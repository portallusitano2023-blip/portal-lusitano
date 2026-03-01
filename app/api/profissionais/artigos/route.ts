import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("profissionais_artigos")
      .select(
        "id, titulo, categoria, resumo, conteudo, leituras, created_at, profissional_id, profissionais(nome)"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      logger.error("Error fetching artigos:", error);
      return NextResponse.json({ error: "Erro ao carregar artigos" }, { status: 500 });
    }

    const artigos = (data || []).map((a) => ({
      id: a.id,
      titulo: a.titulo,
      autor: (a.profissionais as unknown as { nome: string })?.nome || "Profissional",
      categoria: a.categoria,
      resumo: a.resumo,
      conteudo: a.conteudo,
      data: new Date(a.created_at).toISOString().slice(0, 7),
      leituras: a.leituras || 0,
    }));

    return NextResponse.json(
      { artigos },
      {
        headers: {
          // Public articles listing — cache 5 min at CDN, stale up to 15 min
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
        },
      }
    );
  } catch (error) {
    logger.error("Artigos API error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
