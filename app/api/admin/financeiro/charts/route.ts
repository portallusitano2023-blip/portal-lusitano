import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(_req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Obter todos os pagamentos succeeded
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("status", "succeeded")
      .order("created_at", { ascending: true });

    if (paymentsError) throw paymentsError;

    // 1. RECEITA DIÁRIA (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue: Record<string, number> = {};
    const last30Days: string[] = [];

    // Inicializar todos os dias com 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last30Days.push(dateStr);
      dailyRevenue[dateStr] = 0;
    }

    // Agregar receitas por dia
    payments
      ?.filter((p) => new Date(p.created_at) >= thirtyDaysAgo)
      .forEach((payment) => {
        const dateStr = payment.created_at.split("T")[0];
        if (dailyRevenue[dateStr] !== undefined) {
          dailyRevenue[dateStr] += payment.amount || 0;
        }
      });

    const dailyRevenueChart = last30Days.map((date) => ({
      date,
      revenue: dailyRevenue[date] / 100, // Converter para euros
    }));

    // 2. RECEITA MENSAL (últimos 12 meses)
    const monthlyRevenue: Record<string, number> = {};
    const last12Months: string[] = [];

    // Inicializar últimos 12 meses com 0
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      last12Months.push(monthStr);
      monthlyRevenue[monthStr] = 0;
    }

    // Agregar receitas por mês
    payments?.forEach((payment) => {
      const date = new Date(payment.created_at);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyRevenue[monthStr] !== undefined) {
        monthlyRevenue[monthStr] += payment.amount || 0;
      }
    });

    const monthlyRevenueChart = last12Months.map((month) => {
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
        revenue: monthlyRevenue[month] / 100,
      };
    });

    // 3. RECEITA POR TIPO DE PRODUTO
    const productRevenue: Record<string, number> = {};
    const productCounts: Record<string, number> = {};

    payments?.forEach((payment) => {
      const type = payment.product_type || "outros";
      productRevenue[type] = (productRevenue[type] || 0) + (payment.amount || 0);
      productCounts[type] = (productCounts[type] || 0) + 1;
    });

    const productLabels: Record<string, string> = {
      cavalo_anuncio: "Anúncios de Cavalos",
      instagram_ad: "Instagram",
      publicidade: "Publicidade",
      outros: "Outros",
    };

    const revenueByProductChart = Object.entries(productRevenue).map(([type, amount]) => ({
      type: productLabels[type] || type,
      typeKey: type,
      revenue: amount / 100,
      count: productCounts[type],
    }));

    // 4. EVOLUÇÃO MRR (últimos 12 meses)
    // Simplificado: assumimos que subscrições são mantidas
    const mrrEvolution: Record<string, number> = {};

    last12Months.forEach((month) => {
      mrrEvolution[month] = 0;
    });

    // Calcular MRR acumulado por mês
    payments?.forEach((payment) => {
      const date = new Date(payment.created_at);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const metadata = payment.product_metadata as Record<string, unknown> | null;
      const pkg = metadata?.package;

      // Apenas pacotes recorrentes (lateral e premium)
      if (pkg === "lateral" || pkg === "premium") {
        if (mrrEvolution[monthStr] !== undefined) {
          mrrEvolution[monthStr] += payment.amount || 0;
        }
      }
    });

    const mrrChart = last12Months.map((month) => {
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
        mrr: mrrEvolution[month] / 100,
      };
    });

    // 5. ESTATÍSTICAS ADICIONAIS
    const totalPayments = payments?.length || 0;
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    return NextResponse.json({
      dailyRevenue: dailyRevenueChart,
      monthlyRevenue: monthlyRevenueChart,
      revenueByProduct: revenueByProductChart,
      mrrEvolution: mrrChart,
      stats: {
        totalPayments,
        totalRevenue: totalRevenue / 100,
        dateRange: {
          from: thirtyDaysAgo.toISOString(),
          to: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    logger.error("Financial charts error:", error);
    return NextResponse.json({ error: "Erro ao gerar gráficos" }, { status: 500 });
  }
}
