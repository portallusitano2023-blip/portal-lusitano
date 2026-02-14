import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { sanitizeSearchInput } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria");
    const distrito = searchParams.get("distrito");
    const pesquisa = searchParams.get("pesquisa");

    let query = supabase
      .from("profissionais")
      .select(
        "id, nome, slug, tipo, especialidade, descricao_curta, descricao_completa, cidade, distrito, telemovel, email, website, instagram, foto_perfil_url, servicos_oferecidos, rating_average, rating_count, destaque, ordem_destaque, verificado, plano, anos_experiencia, created_at"
      )
      .eq("status", "aprovado")
      .is("deleted_at", null)
      .order("destaque", { ascending: false })
      .order("ordem_destaque", { ascending: true })
      .order("rating_average", { ascending: false });

    if (categoria && categoria !== "todos") {
      query = query.eq("tipo", categoria);
    }

    if (distrito && distrito !== "Todos") {
      query = query.eq("distrito", distrito);
    }

    if (pesquisa) {
      const safePesquisa = sanitizeSearchInput(pesquisa);
      query = query.or(
        `nome.ilike.%${safePesquisa}%,especialidade.ilike.%${safePesquisa}%,descricao_curta.ilike.%${safePesquisa}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Error fetching profissionais:", error);
      return NextResponse.json({ error: "Erro ao carregar profissionais" }, { status: 500 });
    }

    return NextResponse.json({ profissionais: data || [] });
  } catch (error) {
    logger.error("Profissionais API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno" },
      { status: 500 }
    );
  }
}
