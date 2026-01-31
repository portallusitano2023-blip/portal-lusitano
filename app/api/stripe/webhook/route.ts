import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { EmailWorkflows } from "@/lib/resend";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json(
        { error: "Assinatura inválida" },
        { status: 400 }
      );
    }

    // Processar eventos
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed:", session.id);

        const planId = session.metadata?.planId || "aficionado";
        const billingPeriod = session.metadata?.billingPeriod || "monthly";
        const customerEmail = session.customer_email;
        const customerName = session.customer_details?.name || "Membro";
        const amount = session.amount_total || 0;
        const amountFormatted = (amount / 100).toFixed(2);

        console.log(`Novo membro PRO: ${customerEmail} - Plano: ${planId}`);

        // Guardar subscrição no Supabase
        if (customerEmail && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const subData = subscription as any;

          const planName = PLANS[planId as keyof typeof PLANS]?.name || planId;
          const periodStart = subData.current_period_start as number | undefined;
          const periodEnd = subData.current_period_end as number | undefined;

          const { error: dbError } = await supabase.from("subscriptions").upsert(
            {
              email: customerEmail.toLowerCase().trim(),
              name: customerName,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price.id,
              plan_id: planId,
              plan_name: planName,
              billing_period: billingPeriod,
              amount: amount,
              currency: session.currency || "eur",
              status: "active",
              current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
              current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
              coupon_code: session.metadata?.couponCode || null,
            },
            { onConflict: "stripe_subscription_id" }
          );

          if (dbError) {
            console.error("Erro ao guardar subscrição no Supabase:", dbError);
          } else {
            console.log(`Subscrição guardada no Supabase para ${customerEmail}`);
          }

          // Marcar lead como convertido (se existir)
          await supabase
            .from("leads")
            .update({ converted_to_pro: true, updated_at: new Date().toISOString() })
            .eq("email", customerEmail.toLowerCase().trim());
        }

        // Enviar emails de boas-vindas e confirmação de pagamento
        if (customerEmail) {
          try {
            await EmailWorkflows.sendWelcomeSeries(customerEmail, customerName, planId);
            await EmailWorkflows.sendPaymentSuccess(customerEmail, customerName, planId, amount / 100);
            console.log(`Emails enviados com sucesso para ${customerEmail}`);
          } catch (emailError) {
            console.error("Erro ao enviar emails:", emailError);
          }
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subData = subscription as any;
        console.log("Subscription updated:", subData.id);

        const periodStart = subData.current_period_start as number | undefined;
        const periodEnd = subData.current_period_end as number | undefined;

        // Atualizar subscrição no Supabase
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: subData.status,
            current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
            current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            cancelled_at: subData.canceled_at
              ? new Date(subData.canceled_at * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subData.id);

        if (updateError) {
          console.error("Erro ao atualizar subscrição:", updateError);
        } else {
          console.log(`Subscrição ${subData.id} atualizada para status: ${subData.status}`);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subData2 = subscription as any;
        console.log("Subscription cancelled:", subData2.id);

        const periodEnd = subData2.current_period_end as number | undefined;

        // Desativar subscrição no Supabase
        const { error: cancelError } = await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subData2.id);

        if (cancelError) {
          console.error("Erro ao desativar subscrição:", cancelError);
        } else {
          console.log(`Subscrição ${subData2.id} desativada no Supabase`);
        }

        // Obter informações do cliente e enviar email
        const customer = await stripe.customers.retrieve(
          subData2.customer as string
        );

        if (customer && !customer.deleted && customer.email) {
          const customerName = customer.name || "Membro";
          const endDate = periodEnd
            ? new Date(periodEnd * 1000).toLocaleDateString("pt-PT")
            : new Date().toLocaleDateString("pt-PT");

          try {
            await EmailWorkflows.sendSubscriptionCancelled(
              customer.email,
              customerName,
              endDate
            );
            console.log(`Email de cancelamento enviado para ${customer.email}`);
          } catch (emailError) {
            console.error("Erro ao enviar email de cancelamento:", emailError);
          }
        }

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment succeeded:", invoice.id);

        // Enviar email de confirmação apenas para renovações (não para primeiro pagamento)
        if (invoice.billing_reason === "subscription_cycle") {
          const customer = await stripe.customers.retrieve(
            invoice.customer as string
          );

          if (customer && !customer.deleted && customer.email) {
            const customerName = customer.name || "Membro";
            const amountPaid = invoice.amount_paid ? invoice.amount_paid / 100 : 0;
            const planName = invoice.lines.data[0]?.description || "PRO";

            try {
              await EmailWorkflows.sendPaymentSuccess(
                customer.email,
                customerName,
                planName,
                amountPaid
              );
              console.log(`Email de renovação enviado para ${customer.email}`);
            } catch (emailError) {
              console.error("Erro ao enviar email de renovação:", emailError);
            }
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed:", invoice.id);

        // Notificar utilizador sobre falha no pagamento
        const customer = await stripe.customers.retrieve(
          invoice.customer as string
        );

        if (customer && !customer.deleted && customer.email) {
          const customerName = customer.name || "Membro";

          try {
            await EmailWorkflows.sendPaymentFailed(customer.email, customerName);
            console.log(`Email de falha de pagamento enviado para ${customer.email}`);
          } catch (emailError) {
            console.error("Erro ao enviar email de falha:", emailError);
          }
        }
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
