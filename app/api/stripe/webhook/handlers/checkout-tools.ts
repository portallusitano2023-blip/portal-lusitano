import { supabaseAdmin as supabase } from "@/lib/supabase";
import { resend, getToolsProActivadoEmail } from "@/lib/resend";
import { CONTACT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import Stripe from "stripe";
import { registerPayment } from "./utils";

export async function handleToolsSubscription(
  session: Stripe.Checkout.Session,
  metadata: Stripe.Metadata
): Promise<void> {
  const userId = metadata.user_id;
  const subscriptionId = session.subscription as string;
  const customerEmail = session.customer_details?.email;

  if (!userId) {
    logger.error("tools_subscription: missing user_id in metadata");
    return;
  }

  if (!customerEmail) {
    logger.error("tools_subscription: missing customer email", { sessionId: session.id });
    return;
  }

  // Update user profile with active subscription
  const { error } = await supabase
    .from("user_profiles")
    .update({
      tools_subscription_status: "active",
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: session.customer as string,
    })
    .eq("id", userId);

  if (error) {
    logger.error("Error updating tools subscription:", error);
    throw new Error(`Failed to activate tools subscription: ${error.message}`);
  }

  // Register payment
  await registerPayment(
    session,
    session.payment_intent as string,
    "tools_subscription",
    {
      user_id: userId,
      subscription_id: subscriptionId,
    },
    "Ferramentas PRO - Subscrição Mensal"
  );

  // Confirmation email to user
  await resend.emails.send({
    from: "Portal Lusitano <ferramentas@portal-lusitano.pt>",
    to: customerEmail,
    subject: "Ferramentas Pro activadas — Portal Lusitano",
    html: getToolsProActivadoEmail(customerEmail),
  });

  // Notify admin
  await resend.emails.send({
    from: "Portal Lusitano <admin@portal-lusitano.pt>",
    to: CONTACT_EMAIL,
    subject: `Nova Subscrição PRO: ${customerEmail}`,
    html: `
      <h2>Nova subscrição Ferramentas PRO</h2>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Valor:</strong> €${((session.amount_total || 0) / 100).toFixed(2)}/mês</p>
      <p><strong>Subscription ID:</strong> ${subscriptionId}</p>
    `,
  });
}
