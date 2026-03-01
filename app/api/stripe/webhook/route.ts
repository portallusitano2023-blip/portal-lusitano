import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import Stripe from "stripe";
import { CONTACT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { handleCavaloAnuncio } from "./handlers/checkout-cavalo";
import { handleInstagramAd } from "./handlers/checkout-instagram";
import { handlePublicidade } from "./handlers/checkout-publicidade";
import { handleProfissional } from "./handlers/checkout-profissional";
import { handleToolsSubscription } from "./handlers/checkout-tools";
import {
  handlePaymentSucceeded,
  handleSubscriptionCancelled,
  handlePaymentFailed,
  handleSubscriptionUpdated,
} from "./handlers/subscription";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    logger.error(`Webhook signature verification failed: ${errorMsg}`);

    // Alert admin on signature failure — may indicate replay attack or misconfiguration
    resend.emails
      .send({
        from: "Portal Lusitano <admin@portal-lusitano.pt>",
        to: CONTACT_EMAIL,
        subject: "[ALERTA SEGURANÇA] Falha de verificação Stripe Webhook",
        html: `
        <h2>⚠️ Falha de Assinatura Stripe Webhook</h2>
        <p>Uma tentativa de webhook falhou na verificação de assinatura.</p>
        <p><strong>Erro:</strong> ${errorMsg}</p>
        <p><strong>Hora:</strong> ${new Date().toISOString()}</p>
        <p>Isto pode indicar:</p>
        <ul>
          <li>Tentativa de replay attack</li>
          <li>Webhook secret incorreto</li>
          <li>Request de fonte não autorizada</li>
        </ul>
        <p>Verifique o dashboard Stripe para actividade suspeita.</p>
      `,
      })
      .catch(() => {}); // fire-and-forget, don't block the response

    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { data: existingPayment } = await supabaseAdmin
          .from("payments")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (existingPayment) {
          logger.warn(`Duplicate webhook received for checkout session ${session.id}, skipping`);
          return Response.json({ received: true, duplicate: true });
        }

        await handleCheckoutCompleted(session);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const piRaw = (invoice as unknown as Record<string, unknown>).payment_intent;
        if (piRaw) {
          const paymentIntentId = typeof piRaw === "string" ? piRaw : (piRaw as { id: string }).id;

          const { data: existingPayment } = await supabaseAdmin
            .from("payments")
            .select("id")
            .eq("stripe_payment_intent_id", paymentIntentId)
            .maybeSingle();

          if (existingPayment) {
            logger.warn(
              `Duplicate webhook received for payment intent ${paymentIntentId}, skipping`
            );
            return Response.json({ received: true, duplicate: true });
          }
        }

        await handlePaymentSucceeded(invoice);
        break;
      }
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    logger.error(
      `Webhook handler error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata) {
    return;
  }

  switch (metadata.type) {
    case "cavalo_anuncio":
      await handleCavaloAnuncio(session, metadata);
      break;
    case "instagram_ad":
      await handleInstagramAd(session, metadata);
      break;
    case "publicidade":
      await handlePublicidade(session, metadata);
      break;
    case "profissional":
      await handleProfissional(session, metadata);
      break;
    case "tools_subscription":
      await handleToolsSubscription(session, metadata);
      break;
    default:
      break;
  }
}
