import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import Stripe from "stripe";
import { logger } from "@/lib/logger";

export async function registerPayment(
  session: Stripe.Checkout.Session,
  stripePaymentOrSubscriptionId: string,
  productType: string,
  productMetadata: Record<string, unknown>,
  description: string
) {
  const customerEmail = session.customer_details?.email;
  const amountTotal = session.amount_total;
  const currency = session.currency;

  if (!customerEmail || amountTotal === null || amountTotal === undefined || !currency) {
    logger.error("Stripe session missing required fields", {
      sessionId: session.id,
      hasEmail: !!customerEmail,
      amountTotal,
      currency,
    });
    throw new Error("Stripe session is missing customer_details.email, amount_total, or currency");
  }

  return supabase
    .from("payments")
    .insert({
      stripe_payment_intent_id: stripePaymentOrSubscriptionId,
      stripe_session_id: session.id,
      email: customerEmail,
      amount: amountTotal,
      currency: currency,
      status: "succeeded",
      product_type: productType,
      product_metadata: productMetadata,
      description,
    })
    .select()
    .single();
}

export async function linkPaymentToSubmission(
  submissionId: string,
  paymentId: string,
  extraFields?: Record<string, unknown>
) {
  return supabase
    .from("contact_submissions")
    .update({ payment_id: paymentId, ...extraFields })
    .eq("id", submissionId);
}
