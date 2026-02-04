import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const now = new Date();

    // Buscar leads (ebooks)
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("*");

    if (leadsError) {
      console.error("Erro ao buscar leads:", leadsError);
    }

    // Buscar cavalos
    const { data: cavalos, error: cavalosError } = await supabase
      .from("cavalos_venda")
      .select("id, status, views_count, created_at");

    if (cavalosError) {
      console.error("Erro ao buscar cavalos:", cavalosError);
    }

    // Buscar eventos
    const { data: eventos, error: eventosError } = await supabase
      .from("eventos")
      .select("id, destaque, data_inicio, views_count");

    if (eventosError) {
      console.error("Erro ao buscar eventos:", eventosError);
    }

    // Buscar coudelarias
    const { data: coudelarias, error: coudError } = await supabase
      .from("coudelarias")
      .select("id, destaque");

    if (coudError) {
      console.error("Erro ao buscar coudelarias:", coudError);
    }

    // Buscar reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("id, status, created_at");

    if (reviewsError) {
      console.error("Erro ao buscar reviews:", reviewsError);
    }

    // Stats de leads/ebooks
    const totalLeads = leads?.length || 0;
    const convertedLeads = leads?.filter(l => l.converted).length || 0;

    // Stats de cavalos
    const totalCavalos = cavalos?.length || 0;
    const activeCavalos = cavalos?.filter(c => c.status === "active").length || 0;
    const soldCavalos = cavalos?.filter(c => c.status === "sold").length || 0;
    const cavalosViews = cavalos?.reduce((sum, c) => sum + (c.views_count || 0), 0) || 0;

    // Stats de eventos
    const totalEventos = eventos?.length || 0;
    const featuredEventos = eventos?.filter(e => e.destaque).length || 0;
    const futureEventos = eventos?.filter(e => new Date(e.data_inicio) > now).length || 0;
    const eventosViews = eventos?.reduce((sum, e) => sum + (e.views_count || 0), 0) || 0;

    // Stats de coudelarias
    const totalCoudelarias = coudelarias?.length || 0;
    const featuredCoudelarias = coudelarias?.filter(c => c.destaque).length || 0;

    // Stats de reviews
    const totalReviews = reviews?.length || 0;
    const pendingReviews = reviews?.filter(r => r.status === "pending").length || 0;
    const approvedReviews = reviews?.filter(r => r.status === "approved").length || 0;

    const stats = {
      // Leads/Ebooks
      totalLeads,
      convertedLeads,
      conversionRate: totalLeads > 0
        ? parseFloat(((convertedLeads / totalLeads) * 100).toFixed(1))
        : 0,

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
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
