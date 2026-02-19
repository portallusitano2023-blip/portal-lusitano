import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const now = new Date();

    // Buscar todas as tabelas em paralelo — são queries independentes
    const [
      { data: leads, error: leadsError },
      { data: cavalos, error: cavalosError },
      { data: eventos, error: eventosError },
      { data: coudelarias, error: coudError },
      { data: reviews, error: reviewsError },
    ] = await Promise.all([
      supabase.from("leads").select("*"),
      supabase.from("cavalos_venda").select("id, status, views_count, created_at"),
      supabase.from("eventos").select("id, destaque, data_inicio, views_count"),
      supabase.from("coudelarias").select("id, destaque"),
      supabase.from("reviews").select("id, status, created_at"),
    ]);

    if (leadsError) logger.error("Erro ao buscar leads:", leadsError);
    if (cavalosError) logger.error("Erro ao buscar cavalos:", cavalosError);
    if (eventosError) logger.error("Erro ao buscar eventos:", eventosError);
    if (coudError) logger.error("Erro ao buscar coudelarias:", coudError);
    if (reviewsError) logger.error("Erro ao buscar reviews:", reviewsError);

    // Stats de leads/ebooks
    const totalLeads = leads?.length || 0;
    const convertedLeads = leads?.filter((l) => l.converted).length || 0;

    // Stats de cavalos
    const totalCavalos = cavalos?.length || 0;
    const activeCavalos = cavalos?.filter((c) => c.status === "active").length || 0;
    const soldCavalos = cavalos?.filter((c) => c.status === "sold").length || 0;
    const cavalosViews = cavalos?.reduce((sum, c) => sum + (c.views_count || 0), 0) || 0;

    // Stats de eventos
    const totalEventos = eventos?.length || 0;
    const featuredEventos = eventos?.filter((e) => e.destaque).length || 0;
    const futureEventos = eventos?.filter((e) => new Date(e.data_inicio) > now).length || 0;
    const eventosViews = eventos?.reduce((sum, e) => sum + (e.views_count || 0), 0) || 0;

    // Stats de coudelarias
    const totalCoudelarias = coudelarias?.length || 0;
    const featuredCoudelarias = coudelarias?.filter((c) => c.destaque).length || 0;

    // Stats de reviews
    const totalReviews = reviews?.length || 0;
    const pendingReviews = reviews?.filter((r) => r.status === "pending").length || 0;
    const approvedReviews = reviews?.filter((r) => r.status === "approved").length || 0;

    const stats = {
      // Leads/Ebooks
      totalLeads,
      convertedLeads,
      conversionRate:
        totalLeads > 0 ? parseFloat(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0,

      // Cavalos
      totalCavalos,
      activeCavalos,
      soldCavalos,
      cavalosViews,

      // Eventos
      totalEventos,
      featuredEventos,
      futureEventos,
      eventosViews,

      // Coudelarias
      totalCoudelarias,
      featuredCoudelarias,

      // Reviews
      totalReviews,
      pendingReviews,
      approvedReviews,
    };

    return NextResponse.json(stats);
  } catch (error) {
    logger.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
