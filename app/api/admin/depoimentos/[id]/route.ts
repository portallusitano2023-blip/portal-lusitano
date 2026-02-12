import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// PATCH - Atualizar status do depoimento
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    // Validar status
    if (!["aprovado", "rejeitado"].includes(status)) {
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
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
