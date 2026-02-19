import { supabaseAdmin as supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { CONTACT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { escapeHtml } from "@/lib/sanitize";
import Stripe from "stripe";

export async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  if (customerId) {
    // Reactivate tools subscription on renewal if needed
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id, tools_subscription_status")
      .eq("stripe_customer_id", customerId)
      .single();

    if (profile && profile.tools_subscription_status !== "active") {
      await supabase
        .from("user_profiles")
        .update({ tools_subscription_status: "active" })
        .eq("id", profile.id);
    }
  }
}

export async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Deactivate profissional if applicable
  await supabase
    .from("profissionais")
    .update({ status: "cancelled", plano_ativo: false })
    .eq("stripe_customer_id", customerId);

  // Deactivate tools subscription if applicable
  await supabase
    .from("user_profiles")
    .update({ tools_subscription_status: "cancelled" })
    .eq("stripe_customer_id", customerId);
}

export async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  logger.error(`Payment failed for customer ${customerId}, invoice ${invoice.id}`);

  // Notify admin
  await resend.emails.send({
    from: "Portal Lusitano <admin@portal-lusitano.pt>",
    to: CONTACT_EMAIL,
    subject: `Pagamento Falhado - ${escapeHtml(invoice.customer_email || customerId)}`,
    html: `
      <h2>Pagamento falhado</h2>
      <p><strong>Cliente:</strong> ${escapeHtml(invoice.customer_email || customerId)}</p>
      <p><strong>Valor:</strong> &euro;${((invoice.amount_due || 0) / 100).toFixed(2)}</p>
      <p><strong>Invoice ID:</strong> ${escapeHtml(invoice.id)}</p>
      <p>O Stripe tentará novamente automaticamente.</p>
    `,
  });
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  // Update profissional status based on subscription status
  if (status === "past_due" || status === "unpaid") {
    await supabase
      .from("profissionais")
      .update({ plano_ativo: false })
      .eq("stripe_customer_id", customerId);

    await supabase
      .from("user_profiles")
      .update({ tools_subscription_status: status })
      .eq("stripe_customer_id", customerId);
  } else if (status === "active") {
    await supabase
      .from("profissionais")
      .update({ plano_ativo: true })
      .eq("stripe_customer_id", customerId);

    await supabase
      .from("user_profiles")
      .update({ tools_subscription_status: "active" })
      .eq("stripe_customer_id", customerId);
  }
}
