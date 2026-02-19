/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { supabaseAdmin as supabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function registerPayment(
  session: Stripe.Checkout.Session,
  stripePaymentOrSubscriptionId: string,
  productType: string,
  productMetadata: Record<string, unknown>,
  description: string
) {
  return supabase
    .from("payments")
    .insert({
      stripe_payment_intent_id: stripePaymentOrSubscriptionId,
      stripe_session_id: session.id,
      email: session.customer_details?.email!,
      amount: session.amount_total!,
      currency: session.currency!,
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
