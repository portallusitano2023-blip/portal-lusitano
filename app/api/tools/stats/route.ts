import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";
import { logger } from "@/lib/logger";

// GET /api/tools/stats
// Retorna estatísticas públicas das ferramentas para prova social no Hub
export async function GET() {
  try {
    // Buscar todas as estatísticas em paralelo — queries independentes
    const [
      { count: totalAnalyses, error: countError },
      { data: usersData, error: usersError },
      { count: reviewCount, error: reviewCountError },
      { data: reviewsData, error: reviewsError },
    ] = await Promise.all([
      // Total tool uses — efficient count-only query (no rows returned)
      supabase.from("tool_usage").select("*", { count: "exact", head: true }),
      // Unique users — bounded query to prevent loading entire table.
      // Supabase REST API does not support COUNT DISTINCT, so we fetch
      // user_ids with a cap and count distinct in memory.
      supabase.from("tool_usage").select("user_id").limit(10000),
      // Review count — efficient count-only query
      supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .not("ferramenta_slug", "is", null)
        .eq("status", "approved"),
      // Review ratings — bounded fetch for average calculation
      supabase
        .from("reviews")
        .select("avaliacao")
        .not("ferramenta_slug", "is", null)
        .eq("status", "approved")
        .limit(5000),
    ]);

    if (countError && countError.code !== "PGRST205")
      logger.error("Erro ao contar tool_usage:", countError);
    if (usersError && usersError.code !== "PGRST205")
      logger.error("Erro ao contar utilizadores:", usersError);
    if (reviewCountError) logger.error("Erro ao contar reviews:", reviewCountError);
    if (reviewsError) logger.error("Erro ao buscar reviews:", reviewsError);

    const uniqueUsers = usersData ? new Set(usersData.map((r) => r.user_id)).size : 0;

    const safeReviewCount = reviewCount ?? reviewsData?.length ?? 0;
    const avgRating =
      safeReviewCount > 0 && reviewsData && reviewsData.length > 0
        ? Math.round(
            (reviewsData.reduce((acc, r) => acc + r.avaliacao, 0) / reviewsData.length) * 10
          ) / 10
        : 0;

    return NextResponse.json(
      {
        totalAnalyses: totalAnalyses || 0,
        totalUsers: uniqueUsers,
        avgRating,
        reviewCount: safeReviewCount,
      },
      {
        headers: {
          // Public social proof stats — cache 5 min, stale up to 15 min
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
        },
      }
    );
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
