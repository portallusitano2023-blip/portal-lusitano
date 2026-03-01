import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(_req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. FONTES DE TRÁFEGO (UTM da tabela leads)
    let leads: {
      email: string;
      utm_source: string | null;
      utm_medium: string | null;
      utm_campaign: string | null;
      created_at: string;
    }[] = [];

    try {
      const { data } = await supabase
        .from("leads")
        .select("email, utm_source, utm_medium, utm_campaign, created_at");

      leads = data || [];
    } catch (e) {
      logger.warn("Error fetching leads:", e);
    }

    // Agregar por fonte
    const sourceStats: Record<string, { leads: number; percentage: number }> = {};
    const totalLeads = leads.length;

    leads.forEach((lead) => {
      const source = lead.utm_source || "Direto";
      if (!sourceStats[source]) {
        sourceStats[source] = { leads: 0, percentage: 0 };
      }
      sourceStats[source].leads += 1;
    });

    // Calcular percentagens
    Object.keys(sourceStats).forEach((source) => {
      sourceStats[source].percentage =
        totalLeads > 0 ? (sourceStats[source].leads / totalLeads) * 100 : 0;
    });

    const trafficSources = Object.entries(sourceStats)
      .map(([source, stats]) => ({
        source,
        leads: stats.leads,
        percentage: parseFloat(stats.percentage.toFixed(1)),
      }))
      .sort((a, b) => b.leads - a.leads);

    // 2. ROI POR CANAL (Receita gerada por fonte)
    // Cruzar leads com payments por email
    let payments: { email: string; amount: number; created_at: string }[] = [];

    try {
      const { data } = await supabase
        .from("payments")
        .select("email, amount, created_at")
        .eq("status", "succeeded");

      payments = data || [];
    } catch (e) {
      logger.warn("Error fetching payments:", e);
    }

    // Criar mapa email → utm_source
    const emailToSource: Record<string, string> = {};
    leads.forEach((lead) => {
      emailToSource[lead.email] = lead.utm_source || "Direto";
    });

    // Calcular receita por fonte
    const revenueBySource: Record<string, number> = {};
    payments.forEach((payment) => {
      const source = emailToSource[payment.email] || "Direto";
      revenueBySource[source] = (revenueBySource[source] || 0) + (payment.amount || 0);
    });

    const roiByChannel = Object.entries(revenueBySource)
      .map(([source, revenue]) => {
        const leadsFromSource = sourceStats[source]?.leads || 0;
        const revenueInEuros = revenue / 100;

        return {
          source,
          revenue: parseFloat(revenueInEuros.toFixed(2)),
          leads: leadsFromSource,
          revenuePerLead:
            leadsFromSource > 0 ? parseFloat((revenueInEuros / leadsFromSource).toFixed(2)) : 0,
          // ROI = (Receita - Custo) / Custo * 100
          // Assumimos custo estimado por lead
          estimatedCost: leadsFromSource * 5, // €5 por lead (estimativa)
          roi:
            leadsFromSource > 0
              ? parseFloat(
                  (((revenueInEuros - leadsFromSource * 5) / (leadsFromSource * 5)) * 100).toFixed(
                    1
                  )
                )
              : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    // 3. TENDÊNCIAS (últimos 6 meses)
    const monthlyTrends: Record<string, Record<string, number>> = {};
    const last6Months: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      last6Months.push(monthStr);
      monthlyTrends[monthStr] = {};
    }

    leads.forEach((lead) => {
      const date = new Date(lead.created_at);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const source = lead.utm_source || "Direto";

      if (monthlyTrends[monthStr]) {
        monthlyTrends[monthStr][source] = (monthlyTrends[monthStr][source] || 0) + 1;
      }
    });

    const trendsChart = last6Months.map((month) => {
      const [, monthNum] = month.split("-");
      const monthNames = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      return {
        month: monthNames[parseInt(monthNum) - 1],
        fullMonth: month,
        sources: monthlyTrends[month],
      };
    });

    // 5. MELHOR CANAL (por ROI)
    const bestChannel =
      roiByChannel.length > 0
        ? roiByChannel.reduce((best, current) => (current.roi > best.roi ? current : best))
        : null;

    return NextResponse.json({
      trafficSources,
      roiByChannel,
      trendsChart,
      bestChannel,
      totalLeads,
      totalRevenue: parseFloat(
        (Object.values(revenueBySource).reduce((sum, r) => sum + r, 0) / 100).toFixed(2)
      ),
    });
  } catch (error) {
    logger.error("Sources analytics error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar analytics de fontes" },
      { status: 500 }
    );
  }
}
