import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";
import { logger } from "@/lib/logger";

// GET - Obter coudelaria por slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug não fornecido" }, { status: 400 });
    }

    // Buscar coudelaria
    const { data: coudelaria, error } = await supabase
      .from("coudelarias")
      .select(
        "id, nome, slug, descricao, historia, localizacao, regiao, telefone, email, website, instagram, facebook, youtube, num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos, horario, coordenadas_lat, coordenadas_lng, foto_capa, galeria, video_url, cavalos_destaque, testemunhos, is_pro, destaque, views_count"
      )
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    if (error || !coudelaria) {
      logger.error("Erro ao buscar coudelaria:", error);
      return NextResponse.json({ error: "Coudelaria não encontrada" }, { status: 404 });
    }

    // Incrementar views (não bloqueia a resposta)
    supabase
      .from("coudelarias")
      .update({ views_count: (coudelaria.views_count || 0) + 1 })
      .eq("id", coudelaria.id)
      .then(({ error: updateErr }) => {
        if (updateErr) logger.error("Failed to increment coudelaria views:", updateErr);
      });

    const response = NextResponse.json({ coudelaria });
    response.headers.set(
      "Cache-Control",
      "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600"
    );
    return response;
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
