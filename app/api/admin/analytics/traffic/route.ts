import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. TOTAL DE VISUALIZAÇÕES DE CAVALOS
    const { data: cavalos, error: cavalosError } = await supabase
      .from("cavalos_venda")
      .select("views_count");

    if (cavalosError) throw cavalosError;

    const totalCavalosViews = cavalos?.reduce(
      (sum, cavalo) => sum + (cavalo.views_count || 0),
      0
    ) || 0;

    // 2. TOTAL DE VISUALIZAÇÕES DE EVENTOS
    const { data: eventos, error: eventosError } = await supabase
      .from("eventos")
      .select("views_count");

    if (eventosError) throw eventosError;

    const totalEventosViews = eventos?.reduce(
      (sum, evento) => sum + (evento.views_count || 0),
      0
    ) || 0;

    // 3. TOTAL GERAL DE VISUALIZAÇÕES
    const totalViews = totalCavalosViews + totalEventosViews;

    // 4. CAVALOS MAIS VISTOS (Top 10)
    const { data: topCavalos, error: topCavalosError } = await supabase
      .from("cavalos_venda")
      .select("id, nome_cavalo, views_count")
      .order("views_count", { ascending: false })
      .limit(10);

    if (topCavalosError) throw topCavalosError;

    // 5. EVENTOS MAIS VISTOS (Top 10)
    const { data: topEventos, error: topEventosError } = await supabase
      .from("eventos")
      .select("id, titulo, views_count")
      .order("views_count", { ascending: false })
      .limit(10);

    if (topEventosError) throw topEventosError;

    // 6. FONTES DE TRÁFEGO (UTM Source da tabela leads)
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("utm_source, utm_medium, utm_campaign");

    if (leadsError) throw leadsError;

    // Agregar por fonte
    const trafficSources: Record<string, number> = {};
    leads?.forEach((lead) => {
      const source = lead.utm_source || "Direto";
      trafficSources[source] = (trafficSources[source] || 0) + 1;
    });

    const trafficSourcesArray = Object.entries(trafficSources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 7. BREAKDOWN POR TIPO DE CONTEÚDO
    const contentTypeBreakdown = [
      {
        type: "Cavalos à Venda",
        views: totalCavalosViews,
        count: cavalos?.length || 0,
      },
      {
        type: "Eventos",
        views: totalEventosViews,
        count: eventos?.length || 0,
      },
    ];

    // 8. TAXA MÉDIA DE VISUALIZAÇÕES
    const totalContent = (cavalos?.length || 0) + (eventos?.length || 0);
    const averageViewsPerContent = totalContent > 0 ? totalViews / totalContent : 0;

    // 9. LEADS GERADOS (total)
    const { count: totalLeads, error: leadsCountError } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    if (leadsCountError) throw leadsCountError;

    // 10. CRESCIMENTO DE LEADS (últimos 30 dias vs 30 dias anteriores)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { count: recentLeads, error: recentError } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (recentError) throw recentError;

    const { count: previousLeads, error: previousError } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sixtyDaysAgo.toISOString())
      .lt("created_at", thirtyDaysAgo.toISOString());

    if (previousError) throw previousError;

    const leadsGrowth = (previousLeads || 0) > 0
      ? (((recentLeads || 0) - (previousLeads || 0)) / (previousLeads || 0)) * 100
      : (recentLeads || 0) > 0 ? 100 : 0;

    return NextResponse.json({
      overview: {
        totalViews,
        totalCavalosViews,
        totalEventosViews,
        averageViewsPerContent: parseFloat(averageViewsPerContent.toFixed(2)),
        totalLeads: totalLeads || 0,
        recentLeads: recentLeads || 0,
        leadsGrowth: parseFloat(leadsGrowth.toFixed(2)),
      },
      topCavalos: topCavalos?.map((c) => ({
        id: c.id,
        name: c.nome_cavalo,
        views: c.views_count || 0,
      })) || [],
      topEventos: topEventos?.map((e) => ({
        id: e.id,
        name: e.titulo,
        views: e.views_count || 0,
      })) || [],
      trafficSources: trafficSourcesArray,
      contentTypeBreakdown,
    });
  } catch (error: any) {
    console.error("Traffic analytics error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar analytics de tráfego" },
      { status: 500 }
    );
  }
}
