import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedProfissional } from "@/lib/profissional-auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const auth = await getAuthenticatedProfissional();
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("profissionais_eventos")
      .select("*")
      .eq("profissional_id", auth.profissional.id)
      .order("data_inicio", { ascending: false });

    if (error) {
      logger.error("Error fetching meus eventos:", error);
      return NextResponse.json({ error: "Erro ao carregar eventos" }, { status: 500 });
    }

    return NextResponse.json({ eventos: data || [] });
  } catch (error) {
    logger.error("Meus eventos GET error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedProfissional();
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      titulo,
      tipo,
      descricao,
      data_inicio,
      data_fim,
      local,
      pais,
      online,
      link_inscricao,
      preco,
      vagas,
    } = body;

    if (!titulo || !tipo || !descricao || !data_inicio) {
      return NextResponse.json(
        { error: "Campos obrigatórios: titulo, tipo, descricao, data_inicio" },
        { status: 400 }
      );
    }

    const validTipos = ["clinica", "workshop", "conferencia", "curso", "webinar"];
    if (!validTipos.includes(tipo)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("profissionais_eventos")
      .insert({
        profissional_id: auth.profissional.id,
        titulo: titulo.trim().slice(0, 200),
        tipo,
        descricao: descricao.trim().slice(0, 2000),
        data_inicio,
        data_fim: data_fim || null,
        local: local?.trim().slice(0, 200) || null,
        pais: pais?.trim().slice(0, 100) || null,
        online: online || false,
        link_inscricao: link_inscricao?.trim().slice(0, 500) || null,
        preco: preco?.trim().slice(0, 50) || null,
        vagas: vagas ? parseInt(vagas, 10) : null,
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating evento:", error);
      return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
    }

    return NextResponse.json({ evento: data }, { status: 201 });
  } catch (error) {
    logger.error("Meus eventos POST error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
