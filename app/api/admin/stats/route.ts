import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const now = new Date().toISOString();

    // Use Supabase count queries + filtered counts in parallel
    // This avoids downloading ALL rows just to count them in JS
    const [
      // Leads
      { count: totalLeads },
      { count: convertedLeads },
      // Cavalos
      { count: totalCavalos },
      { count: activeCavalos },
      { count: soldCavalos },
      { data: cavalosViews },
      // Eventos
      { count: totalEventos },
      { count: featuredEventos },
      { count: futureEventos },
      { data: eventosViews },
      // Coudelarias
      { count: totalCoudelarias },
      { count: featuredCoudelarias },
      // Reviews
      { count: totalReviews },
      { count: pendingReviews },
      { count: approvedReviews },
    ] = await Promise.all([
      // Leads
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("converted", true),
      // Cavalos
      supabase.from("cavalos_venda").select("*", { count: "exact", head: true }),
      supabase
        .from("cavalos_venda")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("cavalos_venda")
        .select("*", { count: "exact", head: true })
        .eq("status", "sold"),
      supabase.from("cavalos_venda").select("views_count"),
      // Eventos
      supabase.from("eventos").select("*", { count: "exact", head: true }),
      supabase.from("eventos").select("*", { count: "exact", head: true }).eq("destaque", true),
      supabase.from("eventos").select("*", { count: "exact", head: true }).gte("data_inicio", now),
      supabase.from("eventos").select("views_count"),
      // Coudelarias
      supabase.from("coudelarias").select("*", { count: "exact", head: true }),
      supabase.from("coudelarias").select("*", { count: "exact", head: true }).eq("destaque", true),
      // Reviews
      supabase.from("reviews").select("*", { count: "exact", head: true }),
      supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "approved"),
    ]);

    // Sum views (still need data for these since Supabase doesn't have SUM in REST API)
    const totalCavalosViews = cavalosViews?.reduce((sum, c) => sum + (c.views_count || 0), 0) ?? 0;
    const totalEventosViews = eventosViews?.reduce((sum, e) => sum + (e.views_count || 0), 0) ?? 0;

    const tLeads = totalLeads ?? 0;
    const cLeads = convertedLeads ?? 0;

    const stats = {
      // Leads/Ebooks
      totalLeads: tLeads,
      convertedLeads: cLeads,
      conversionRate: tLeads > 0 ? parseFloat(((cLeads / tLeads) * 100).toFixed(1)) : 0,

      // Cavalos
      totalCavalos: totalCavalos ?? 0,
      activeCavalos: activeCavalos ?? 0,
      soldCavalos: soldCavalos ?? 0,
      cavalosViews: totalCavalosViews,

      // Eventos
      totalEventos: totalEventos ?? 0,
      featuredEventos: featuredEventos ?? 0,
      futureEventos: futureEventos ?? 0,
      eventosViews: totalEventosViews,

      // Coudelarias
      totalCoudelarias: totalCoudelarias ?? 0,
      featuredCoudelarias: featuredCoudelarias ?? 0,

      // Reviews
      totalReviews: totalReviews ?? 0,
      pendingReviews: pendingReviews ?? 0,
      approvedReviews: approvedReviews ?? 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    logger.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
