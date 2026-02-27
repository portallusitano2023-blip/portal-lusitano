import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    // Check if user already has a Stripe customer
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("user_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Support monthly vs annual billing
    const body = await request.json().catch(() => ({}));
    const billing = body.billing === "annual" ? "annual" : "monthly";

    const monthlyPriceId =
      process.env.STRIPE_TOOLS_PRICE_ID || process.env.STRIPE_PRICE_FERRAMENTAS_PRO;
    const annualPriceId = process.env.STRIPE_TOOLS_ANNUAL_PRICE_ID;

    const priceId = billing === "annual" && annualPriceId ? annualPriceId : monthlyPriceId;
    if (!priceId) {
      return NextResponse.json({ error: "Preco nao configurado" }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/ferramentas?success=true`,
      cancel_url: `${baseUrl}/ferramentas?cancelled=true`,
      metadata: {
        type: "tools_subscription",
        user_id: user.id,
        billing,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error("Checkout error:", error);
    return NextResponse.json({ error: "Erro ao criar sessao de pagamento" }, { status: 500 });
  }
}
