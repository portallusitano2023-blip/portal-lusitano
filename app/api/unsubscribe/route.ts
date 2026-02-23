import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { verifyUnsubscribeToken } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token } = body;

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: "Token em falta." }, { status: 400 });
    }

    // Validate email format
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Verificar HMAC token — impede que terceiros cancelem subscrições alheias
    try {
      if (!verifyUnsubscribeToken(email, token)) {
        return NextResponse.json({ error: "Link inválido ou expirado." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Link inválido ou expirado." }, { status: 403 });
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
      logger.error("Error unsubscribing:", updateError);
      return NextResponse.json({ error: "Erro ao processar pedido" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Subscrição cancelada com sucesso. Não receberás mais emails nossos.",
    });
  } catch (error) {
    logger.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
