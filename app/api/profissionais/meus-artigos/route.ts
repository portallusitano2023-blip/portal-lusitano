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
      .from("profissionais_artigos")
      .select("*")
      .eq("profissional_id", auth.profissional.id)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching meus artigos:", error);
      return NextResponse.json({ error: "Erro ao carregar artigos" }, { status: 500 });
    }

    return NextResponse.json({ artigos: data || [] });
  } catch (error) {
    logger.error("Meus artigos GET error:", error);
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
    const { titulo, categoria, resumo, conteudo } = body;

    if (!titulo || !categoria || !resumo || !conteudo) {
      return NextResponse.json(
        { error: "Campos obrigatórios: titulo, categoria, resumo, conteudo" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("profissionais_artigos")
      .insert({
        profissional_id: auth.profissional.id,
        titulo: titulo.trim().slice(0, 200),
        categoria: categoria.trim().slice(0, 100),
        resumo: resumo.trim().slice(0, 500),
        conteudo: conteudo.trim().slice(0, 10000),
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating artigo:", error);
      return NextResponse.json({ error: "Erro ao criar artigo" }, { status: 500 });
    }

    return NextResponse.json({ artigo: data }, { status: 201 });
  } catch (error) {
    logger.error("Meus artigos POST error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
