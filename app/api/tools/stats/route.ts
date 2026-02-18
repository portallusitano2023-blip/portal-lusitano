import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

// GET /api/tools/stats
// Retorna estatísticas públicas das ferramentas para prova social no Hub
export async function GET() {
  try {
    // Total de análises realizadas
    const { count: totalAnalyses, error: countError } = await supabase
      .from("tool_usage")
      .select("*", { count: "exact", head: true });

    if (countError) {
      logger.error("Erro ao contar tool_usage:", countError);
    }

    // Total de utilizadores únicos
    const { data: usersData, error: usersError } = await supabase
      .from("tool_usage")
      .select("user_id");

    if (usersError) {
      logger.error("Erro ao contar utilizadores:", usersError);
    }

    const uniqueUsers = usersData ? new Set(usersData.map((r) => r.user_id)).size : 0;

    // Média e total de reviews das ferramentas
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("avaliacao")
      .not("ferramenta_slug", "is", null)
      .eq("status", "approved");

    if (reviewsError) {
      logger.error("Erro ao buscar reviews:", reviewsError);
    }

    const reviewCount = reviewsData?.length || 0;
    const avgRating =
      reviewCount > 0
        ? Math.round((reviewsData!.reduce((acc, r) => acc + r.avaliacao, 0) / reviewCount) * 10) /
          10
        : 0;

    return NextResponse.json({
      totalAnalyses: totalAnalyses || 0,
      totalUsers: uniqueUsers,
      avgRating,
      reviewCount,
    });
  } catch (error) {
    logger.error("Erro em /api/tools/stats:", error);
    // Retornar valores neutros em caso de erro — nunca quebrar a página
    return NextResponse.json({
      totalAnalyses: 0,
      totalUsers: 0,
      avgRating: 0,
      reviewCount: 0,
    });
  }
}
