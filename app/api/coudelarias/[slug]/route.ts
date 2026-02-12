import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
      .select("*")
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
      .then(() => {});

    return NextResponse.json({ coudelaria });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
