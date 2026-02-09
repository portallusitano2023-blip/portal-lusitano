import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Validate email format
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Update lead status to unsubscribed
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        status: "unsubscribed",
        updated_at: new Date().toISOString(),
      })
      .eq("email", normalizedEmail);

    if (updateError) {
      console.error("Error unsubscribing:", updateError);
      return NextResponse.json({ error: "Erro ao processar pedido" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Subscrição cancelada com sucesso. Não receberás mais emails nossos.",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
