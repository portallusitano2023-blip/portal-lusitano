import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { depoimentoUpdateSchema, parseWithZod } from "@/lib/schemas";

// PATCH - Atualizar status do depoimento
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = parseWithZod(depoimentoUpdateSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { status } = parsed.data;

    if (!status || !["aprovado", "rejeitado"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const { data: depoimento, error } = await supabase
      .from("depoimentos_cavalos")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ depoimento });
  } catch (error) {
    logger.error("Error updating depoimento:", error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar depoimento",
      },
      { status: 500 }
    );
  }
}
