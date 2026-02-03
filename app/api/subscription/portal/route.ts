import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Utilizador nao autenticado" },
        { status: 401 }
      );
    }

    // Buscar customer ID do Stripe
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("email", userEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Cliente Stripe nao encontrado" },
        { status: 404 }
      );
    }

    // Criar sessao do portal de faturacao
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${siteUrl}/minha-conta/subscricao`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Erro ao criar portal:", error);
    return NextResponse.json(
      { error: "Erro ao abrir portal de pagamentos" },
      { status: 500 }
    );
  }
}
