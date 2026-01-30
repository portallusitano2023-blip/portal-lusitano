import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, PlanId, BillingPeriod } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, period, email } = body as {
      planId: PlanId;
      period: BillingPeriod;
      email?: string;
    };

    // Validar plano
    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: "Plano inválido" },
        { status: 400 }
      );
    }

    // Obter price ID
    const priceId = plan.prices[period];
    if (!priceId) {
      return NextResponse.json(
        { error: "Período de faturação inválido" },
        { status: 400 }
      );
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pro?canceled=true`,
      customer_email: email,
      metadata: {
        planId,
        period,
      },
      subscription_data: {
        metadata: {
          planId,
          period,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      locale: "pt",
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de checkout" },
      { status: 500 }
    );
  }
}
