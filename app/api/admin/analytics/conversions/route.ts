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

    // 1. TOTAL DE VISITANTES (aproximação via views de cavalos e eventos)
    let totalViews = 0;

    try {
      const { data: cavalos } = await supabase.from("cavalos_venda").select("views_count");

      const { data: eventos } = await supabase.from("eventos").select("views_count");

      totalViews =
        (cavalos?.reduce((sum, c) => sum + (c.views_count || 0), 0) || 0) +
        (eventos?.reduce((sum, e) => sum + (e.views_count || 0), 0) || 0);
    } catch (e) {
      logger.warn("Error fetching views:", e);
    }

    // 2. LEADS GERADOS (ebook grátis)
    let totalLeads = 0;

    try {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true });

      totalLeads = count || 0;
    } catch (e) {
      logger.warn("Error counting leads:", e);
    }

    // 3. CLIENTES PAGOS (pessoas que compraram algo)
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

    // Contar emails únicos (clientes únicos)
    const uniqueCustomers = new Set(payments?.map((p) => p.email)).size;

    // 4. TAXA DE CONVERSÃO LEAD → CLIENTE
    const leadToCustomerRate =
      (totalLeads || 0) > 0 ? (uniqueCustomers / (totalLeads || 1)) * 100 : 0;

    // 5. TAXA DE CONVERSÃO VISITANTE → LEAD
    const visitorToLeadRate = totalViews > 0 ? ((totalLeads || 0) / totalViews) * 100 : 0;

    // 6. RECEITA POR LEAD (LTV - Lifetime Value por lead)
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const revenuePerLead = (totalLeads || 0) > 0 ? totalRevenue / 100 / (totalLeads || 1) : 0;

    // 7. FUNIL DE CONVERSÃO
    const funnel = [
      {
        stage: "Visitantes",
        count: totalViews,
        percentage: 100,
        label: "Total de visualizações",
      },
      {
        stage: "Leads",
        count: totalLeads || 0,
        percentage: visitorToLeadRate,
        label: "Ebook grátis / Newsletter",
      },
      {
        stage: "Clientes",
        count: uniqueCustomers,
        percentage: leadToCustomerRate,
        label: "Fizeram compra",
      },
    ];

    // 8. CONVERSÕES POR MÊS (últimos 12 meses)
    const monthlyConversions: Record<string, { leads: number; customers: number }> = {};
    const last12Months: string[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      last12Months.push(monthStr);
      monthlyConversions[monthStr] = { leads: 0, customers: 0 };
    }

    // Contar leads por mês
    try {
      const { data: leadsData } = await supabase
        .from("leads")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (leadsData) {
        leadsData.forEach((lead) => {
          const date = new Date(lead.created_at);
          const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (monthlyConversions[monthStr]) {
            monthlyConversions[monthStr].leads += 1;
          }
        });
      }
    } catch (e) {
      logger.warn("Error fetching leads data:", e);
    }

    // Contar clientes por mês
    if (payments) {
      const uniqueCustomersByMonth: Record<string, Set<string>> = {};

      payments.forEach((payment) => {
        const date = new Date(payment.created_at);
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyConversions[monthStr]) {
          if (!uniqueCustomersByMonth[monthStr]) {
            uniqueCustomersByMonth[monthStr] = new Set();
          }
          uniqueCustomersByMonth[monthStr].add(payment.email as string);
        }
      });

      Object.entries(uniqueCustomersByMonth).forEach(([month, emails]) => {
        if (monthlyConversions[month]) {
          monthlyConversions[month].customers = emails.size;
        }
      });
    }

    const monthlyChart = last12Months.map((month) => {
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
        leads: monthlyConversions[month].leads,
        customers: monthlyConversions[month].customers,
        conversionRate:
          monthlyConversions[month].leads > 0
            ? (
                (monthlyConversions[month].customers / monthlyConversions[month].leads) *
                100
              ).toFixed(1)
            : "0.0",
      };
    });

    return NextResponse.json({
      overview: {
        totalViews,
        totalLeads: totalLeads || 0,
        uniqueCustomers,
        visitorToLeadRate: parseFloat(visitorToLeadRate.toFixed(2)),
        leadToCustomerRate: parseFloat(leadToCustomerRate.toFixed(2)),
        revenuePerLead: parseFloat(revenuePerLead.toFixed(2)),
      },
      funnel,
      monthlyConversions: monthlyChart,
    });
  } catch (error) {
    logger.error("Conversions analytics error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar analytics de conversões" },
      { status: 500 }
    );
  }
}
