import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { EmailWorkflows } from "@/lib/resend";
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

        const planId = session.metadata?.planId || "Aficionado";
        const customerEmail = session.customer_email;
        const customerName = session.customer_details?.name || "Membro";
        const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";

        console.log(`Novo membro PRO: ${customerEmail} - Plano: ${planId}`);

        // Enviar emails de boas-vindas e confirmação de pagamento
        if (customerEmail) {
          try {
            await EmailWorkflows.sendWelcomeSeries(customerEmail, customerName, planId);
            await EmailWorkflows.sendPaymentSuccess(customerEmail, customerName, planId, amount);
            console.log(`Emails enviados com sucesso para ${customerEmail}`);
          } catch (emailError) {
            console.error("Erro ao enviar emails:", emailError);
            // Não falhar o webhook por causa de email
          }
        }

        // TODO: Integrar com Supabase para guardar subscrição
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id);

        // Atualizar status da subscrição
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription cancelled:", subscription.id);

        // Obter informações do cliente
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );

        if (customer && !customer.deleted && customer.email) {
          const customerName = customer.name || "Membro";
          const endDate = new Date(subscription.current_period_end * 1000)
            .toLocaleDateString("pt-PT");

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

        // TODO: Desativar acesso PRO no Supabase
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
            const amount = invoice.amount_paid
              ? (invoice.amount_paid / 100).toFixed(2)
              : "0.00";
            const planName = invoice.lines.data[0]?.description || "PRO";

            try {
              await EmailWorkflows.sendPaymentSuccess(
                customer.email,
                customerName,
                planName,
                amount
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
