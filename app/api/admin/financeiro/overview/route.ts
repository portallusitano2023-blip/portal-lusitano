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

    // Obter data atual e início do mês
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. RECEITA TOTAL (all time) - apenas succeeded
    const { data: totalRevenueData, error: totalError } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "succeeded");

    if (totalError) throw totalError;

    const totalRevenue = totalRevenueData?.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    ) || 0;

    // 2. RECEITA ESTE MÊS
    const { data: thisMonthData, error: monthError } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "succeeded")
      .gte("created_at", startOfMonth.toISOString());

    if (monthError) throw monthError;

    const thisMonthRevenue = thisMonthData?.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    ) || 0;

    // 3. RECEITA MÊS PASSADO (para calcular crescimento)
    const { data: lastMonthData, error: lastMonthError } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "succeeded")
      .gte("created_at", startOfLastMonth.toISOString())
      .lt("created_at", startOfMonth.toISOString());

    if (lastMonthError) throw lastMonthError;

    const lastMonthRevenue = lastMonthData?.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    ) || 0;

    // Calcular crescimento percentual
    const growthPercentage = lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0 ? 100 : 0;

    // 4. MRR (Monthly Recurring Revenue) - subscrições ativas
    // Publicidade lateral (€25) e premium (€75) são recorrentes
    const { data: subscriptionsData, error: subsError } = await supabase
      .from("payments")
      .select("amount, product_metadata")
      .eq("status", "succeeded")
      .not("product_metadata", "is", null);

    if (subsError) throw subsError;

    // Calcular MRR baseado em subscrições (simplificado - assume 1 mês)
    const mrr = subscriptionsData
      ?.filter((payment) => {
        const metadata = payment.product_metadata as any;
        const pkg = metadata?.package;
        return pkg === "lateral" || pkg === "premium"; // Pacotes recorrentes
      })
      .reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    // 5. TICKET MÉDIO (valor médio por transação)
    const { data: allPayments, error: avgError } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "succeeded");

    if (avgError) throw avgError;

    const totalTransactions = allPayments?.length || 0;
    const averageTicket = totalTransactions > 0
      ? totalRevenue / totalTransactions
      : 0;

    // 6. TOTAL DE TRANSAÇÕES
    const { count: transactionCount, error: countError } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "succeeded");

    if (countError) throw countError;

    // 7. BREAKDOWN POR TIPO DE PRODUTO
    const { data: productBreakdown, error: breakdownError } = await supabase
      .from("payments")
      .select("amount, product_type")
      .eq("status", "succeeded");

    if (breakdownError) throw breakdownError;

    const revenueByProduct = productBreakdown?.reduce((acc: any, payment) => {
      const type = payment.product_type || "outros";
      acc[type] = (acc[type] || 0) + (payment.amount || 0);
      return acc;
    }, {}) || {};

    return NextResponse.json({
      overview: {
        totalRevenue: totalRevenue / 100, // Converter de centavos para euros
        thisMonthRevenue: thisMonthRevenue / 100,
        lastMonthRevenue: lastMonthRevenue / 100,
        growthPercentage: parseFloat(growthPercentage.toFixed(2)),
        mrr: mrr / 100,
        averageTicket: averageTicket / 100,
        totalTransactions: transactionCount || 0,
      },
      revenueByProduct: Object.entries(revenueByProduct).map(([type, amount]) => ({
        type,
        amount: (amount as number) / 100,
      })),
    });
  } catch (error: any) {
    console.error("Financial overview error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar dados financeiros" },
      { status: 500 }
    );
  }
}
