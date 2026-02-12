import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

// GET - Buscar evento por slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const { data: evento, error } = await supabase
      .from("eventos")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !evento) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    // Incrementar views
    await supabase
      .from("eventos")
      .update({ views_count: (evento.views_count || 0) + 1 })
      .eq("id", evento.id);

    // Buscar eventos relacionados (mesmo tipo, excluindo o atual)
    const { data: relacionados } = await supabase
      .from("eventos")
      .select("id, titulo, slug, tipo, data_inicio, localizacao, imagem_capa")
      .eq("tipo", evento.tipo)
      .neq("id", evento.id)
      .eq("status", "active")
      .gte("data_inicio", new Date().toISOString().split("T")[0])
      .order("data_inicio", { ascending: true })
      .limit(3);

    return NextResponse.json({
      evento,
      relacionados: relacionados || [],
    });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
