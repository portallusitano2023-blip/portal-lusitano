/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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

  if (!userId) {
    logger.error("tools_subscription: missing user_id in metadata");
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
    to: session.customer_details?.email!,
    subject: "Ferramentas Pro activadas — Portal Lusitano",
    html: getToolsProActivadoEmail(session.customer_details?.email!),
  });

  // Notify admin
  await resend.emails.send({
    from: "Portal Lusitano <admin@portal-lusitano.pt>",
    to: CONTACT_EMAIL,
    subject: `Nova Subscrição PRO: ${session.customer_details?.email}`,
    html: `
      <h2>Nova subscrição Ferramentas PRO</h2>
      <p><strong>Email:</strong> ${session.customer_details?.email}</p>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Valor:</strong> €${((session.amount_total || 0) / 100).toFixed(2)}/mês</p>
      <p><strong>Subscription ID:</strong> ${subscriptionId}</p>
    `,
  });
}
