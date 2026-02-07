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
    let totalCavalosViews = 0;
    let cavalos: { views_count: number }[] = [];

    try {
      const { data, error } = await supabase
        .from("cavalos_venda")
        .select("views_count");

      if (!error && data) {
        cavalos = data;
        totalCavalosViews = data.reduce(
          (sum, cavalo) => sum + (cavalo.views_count || 0),
          0
        );
      }
    } catch (e) {
      console.warn("views_count column might not exist on cavalos_venda:", e);
    }

    // 2. TOTAL DE VISUALIZAÇÕES DE EVENTOS
    let totalEventosViews = 0;
    let eventos: { views_count: number }[] = [];

    try {
      const { data, error } = await supabase
        .from("eventos")
        .select("views_count");

      if (!error && data) {
        eventos = data;
        totalEventosViews = data.reduce(
          (sum, evento) => sum + (evento.views_count || 0),
          0
        );
      }
    } catch (e) {
      console.warn("views_count column might not exist on eventos:", e);
    }

    // 3. TOTAL GERAL DE VISUALIZAÇÕES
    const totalViews = totalCavalosViews + totalEventosViews;

    // 4. CAVALOS MAIS VISTOS (Top 10)
    let topCavalos: { id: string; nome_cavalo: string; views_count: number }[] = [];

    try {
      const { data, error } = await supabase
        .from("cavalos_venda")
        .select("id, nome_cavalo, views_count")
        .order("views_count", { ascending: false })
        .limit(10);

      if (!error && data) {
        topCavalos = data;
      }
    } catch (e) {
      console.warn("Error fetching top cavalos:", e);
    }

    // 5. EVENTOS MAIS VISTOS (Top 10)
    let topEventos: { id: string; titulo: string; views_count: number }[] = [];

    try {
      const { data, error } = await supabase
        .from("eventos")
        .select("id, titulo, views_count")
        .order("views_count", { ascending: false })
        .limit(10);

      if (!error && data) {
        topEventos = data;
      }
    } catch (e) {
      console.warn("Error fetching top eventos:", e);
    }

    // 6. FONTES DE TRÁFEGO (UTM Source da tabela leads)
    let leads: { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null }[] = [];

    try {
      const { data, error } = await supabase
        .from("leads")
        .select("utm_source, utm_medium, utm_campaign");

      if (!error && data) {
        leads = data;
      }
    } catch (e) {
      console.warn("Error fetching leads:", e);
    }

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
    let totalLeads = 0;

    try {
      const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      if (!error) {
        totalLeads = count || 0;
      }
    } catch (e) {
      console.warn("Error counting leads:", e);
    }

    // 10. CRESCIMENTO DE LEADS (últimos 30 dias vs 30 dias anteriores)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    let recentLeads = 0;
    let previousLeads = 0;

    try {
      const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (!error) {
        recentLeads = count || 0;
      }
    } catch (e) {
      console.warn("Error counting recent leads:", e);
    }

    try {
      const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sixtyDaysAgo.toISOString())
        .lt("created_at", thirtyDaysAgo.toISOString());

      if (!error) {
        previousLeads = count || 0;
      }
    } catch (e) {
      console.warn("Error counting previous leads:", e);
    }

    const leadsGrowth = previousLeads > 0
      ? ((recentLeads - previousLeads) / previousLeads) * 100
      : recentLeads > 0 ? 100 : 0;

    return NextResponse.json({
      overview: {
        totalViews,
        totalCavalosViews,
        totalEventosViews,
        averageViewsPerContent: parseFloat(averageViewsPerContent.toFixed(2)),
        totalLeads: totalLeads,
        recentLeads: recentLeads,
        leadsGrowth: parseFloat(leadsGrowth.toFixed(2)),
      },
      topCavalos: (topCavalos || []).map((c) => ({
        id: c.id,
        name: c.nome_cavalo,
        views: c.views_count || 0,
      })),
      topEventos: (topEventos || []).map((e) => ({
        id: e.id,
        name: e.titulo,
        views: e.views_count || 0,
      })),
      trafficSources: trafficSourcesArray,
      contentTypeBreakdown,
    });
  } catch (error) {
    console.error("Traffic analytics error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar analytics de tráfego" },
      { status: 500 }
    );
  }
}
