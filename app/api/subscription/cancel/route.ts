import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

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

    // Buscar subscricao do utilizador
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("email", userEmail)
      .eq("status", "active")
      .single();

    if (error || !subscription) {
      return NextResponse.json(
        { error: "Subscricao nao encontrada" },
        { status: 404 }
      );
    }

    // Cancelar no Stripe (ao fim do periodo)
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Atualizar na base de dados
    await supabase
      .from("subscriptions")
      .update({
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.stripe_subscription_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao cancelar:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar subscricao" },
      { status: 500 }
    );
  }
}
