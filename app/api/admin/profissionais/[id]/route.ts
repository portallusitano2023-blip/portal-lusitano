import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Obter um profissional específico
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { data: profissional, error } = await supabase
      .from("profissionais")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;

    if (!profissional) {
      return NextResponse.json({ error: "Profissional não encontrado" }, { status: 404 });
    }

    // Buscar histórico de subscrições
    const { data: historico } = await supabase
      .from("profissionais_subscription_historico")
      .select("*")
      .eq("profissional_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      profissional,
      subscription_historico: historico || [],
    });
  } catch (error) {
    logger.error("Error fetching profissional:", error);
    return NextResponse.json(
      {
        error: "Erro ao carregar profissional",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar profissional
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Construir objeto de atualização
    const updates: Record<string, unknown> = { ...body, updated_by: email };

    // Converter datas
    if (body.plano_inicio) {
      updates.plano_inicio = new Date(body.plano_inicio).toISOString();
    }
    if (body.plano_fim) {
      updates.plano_fim = new Date(body.plano_fim).toISOString();
    }

    // Se mudou status para aprovado
    if (body.status === "aprovado") {
      updates.approved_at = new Date().toISOString();
      updates.approved_by = email;
    }

    // Atualizar
    const { data: profissional, error } = await supabase
      .from("profissionais")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Se mudou o plano, criar histórico
    if (body.plano && body.plano !== "gratis" && body.plano_inicio && body.plano_fim) {
      await supabase.from("profissionais_subscription_historico").insert({
        profissional_id: id,
        plano: body.plano,
        valor: body.plano_valor || 0,
        inicio: new Date(body.plano_inicio).toISOString(),
        fim: new Date(body.plano_fim).toISOString(),
        status: "ativo",
      });
    }

    return NextResponse.json({ profissional });
  } catch (error) {
    logger.error("Error updating profissional:", error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar profissional",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar profissional (soft delete)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Soft delete
    const { error } = await supabase
      .from("profissionais")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: email,
        plano_ativo: false,
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Profissional eliminado com sucesso" });
  } catch (error) {
    logger.error("Error deleting profissional:", error);
    return NextResponse.json(
      {
        error: "Erro ao eliminar profissional",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
