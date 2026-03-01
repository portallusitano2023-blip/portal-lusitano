import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { invalidate, CacheTags } from "@/lib/revalidate";

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
    return NextResponse.json({ error: "Erro ao carregar profissional" }, { status: 500 });
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

    // Whitelist de campos permitidos — impede que o body injete colunas arbitrárias
    const allowedFields = [
      "nome",
      "titulo",
      "especialidade",
      "categoria",
      "localizacao",
      "distrito",
      "telefone",
      "email",
      "descricao",
      "servicos",
      "experiencia_anos",
      "especializacoes",
      "credenciais",
      "idiomas",
      "associacoes",
      "foto_url",
      "disponivel",
      "destaque",
      "modalidade",
      "pais",
      "status",
      "plano",
      "plano_ativo",
      "plano_inicio",
      "plano_fim",
      "plano_valor",
      "nivel_verificacao",
      "notas_admin",
    ];

    const updates: Record<string, unknown> = { updated_by: email };
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

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

    invalidate(CacheTags.PROFISSIONAIS);
    return NextResponse.json({ profissional });
  } catch (error) {
    logger.error("Error updating profissional:", error);
    return NextResponse.json({ error: "Erro ao atualizar profissional" }, { status: 500 });
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

    invalidate(CacheTags.PROFISSIONAIS);
    return NextResponse.json({ message: "Profissional eliminado com sucesso" });
  } catch (error) {
    logger.error("Error deleting profissional:", error);
    return NextResponse.json({ error: "Erro ao eliminar profissional" }, { status: 500 });
  }
}
