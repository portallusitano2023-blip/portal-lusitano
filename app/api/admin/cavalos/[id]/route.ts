import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// PUT - Atualizar cavalo
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      "nome",
      "nome_cavalo",
      "descricao",
      "preco",
      "linhagem",
      "idade",
      "sexo",
      "pelagem",
      "altura",
      "peso",
      "disciplinas",
      "nivel",
      "localizacao",
      "coudelaria",
      "imagens",
      "image_url",
      "slug",
      "destaque",
      "status",
      "contacto_nome",
      "contacto_email",
      "contacto_telefone",
    ];
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowedFields) {
      if (key in body) updateData[key] = body[key];
    }

    const { data, error } = await supabase
      .from("cavalos_venda")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("Erro ao atualizar cavalo:", error);
      return NextResponse.json({ error: "Erro ao atualizar cavalo" }, { status: 500 });
    }

    return NextResponse.json({ cavalo: data });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// PATCH - Atualizar status do cavalo
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("cavalos_venda")
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("Erro ao atualizar status:", error);
      return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
    }

    return NextResponse.json({ cavalo: data });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE - Eliminar cavalo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase.from("cavalos_venda").delete().eq("id", id);

    if (error) {
      logger.error("Erro ao eliminar cavalo:", error);
      return NextResponse.json({ error: "Erro ao eliminar cavalo" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
