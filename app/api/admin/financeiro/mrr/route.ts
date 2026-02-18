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

    // Buscar todos os pagamentos de subscrições (publicidade recorrente)
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq("status", "succeeded")
      .not("product_metadata", "is", null)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Filtrar apenas subscrições recorrentes
    const subscriptionPayments =
      payments?.filter((payment) => {
        const metadata = payment.product_metadata as Record<string, unknown> | null;
        const pkg = metadata?.package;
        return pkg === "lateral" || pkg === "premium"; // Pacotes recorrentes
      }) || [];

    // Calcular MRR atual (soma de todas as subscrições ativas)
    const currentMRR =
      subscriptionPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0) / 100;

    // Calcular MRR por tipo de pacote
    const mrrByPackage: Record<string, { count: number; mrr: number }> = {
      lateral: { count: 0, mrr: 0 },
      premium: { count: 0, mrr: 0 },
    };

    subscriptionPayments.forEach((payment) => {
      const metadata = payment.product_metadata as Record<string, unknown> | null;
      const pkg = metadata?.package as "lateral" | "premium";

      if (pkg && mrrByPackage[pkg]) {
        mrrByPackage[pkg].count += 1;
        mrrByPackage[pkg].mrr += (payment.amount || 0) / 100;
      }
    });

    // Evolução de MRR nos últimos 12 meses
    const mrrEvolution: Record<string, { mrr: number; new: number; churn: number }> = {};
    const last12Months: string[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      last12Months.push(monthStr);
      mrrEvolution[monthStr] = { mrr: 0, new: 0, churn: 0 };
    }

    // Calcular MRR acumulado por mês
    let cumulativeMRR = 0;
    const monthlyNewSubscriptions: Record<string, number> = {};

    subscriptionPayments.forEach((payment) => {
      const date = new Date(payment.created_at);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (mrrEvolution[monthStr]) {
        const monthlyValue = (payment.amount || 0) / 100;
        cumulativeMRR += monthlyValue;
        mrrEvolution[monthStr].mrr = cumulativeMRR;
        mrrEvolution[monthStr].new += monthlyValue;
        monthlyNewSubscriptions[monthStr] = (monthlyNewSubscriptions[monthStr] || 0) + 1;
      }
    });

    // Formatar para o frontend
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
        mrr: parseFloat(mrrEvolution[month].mrr.toFixed(2)),
        newMRR: parseFloat(mrrEvolution[month].new.toFixed(2)),
        churnMRR: parseFloat(mrrEvolution[month].churn.toFixed(2)),
        newSubscriptions: monthlyNewSubscriptions[month] || 0,
      };
    });

    // Calcular taxa de crescimento de MRR
    const currentMonth = mrrChart[mrrChart.length - 1];
    const lastMonth = mrrChart[mrrChart.length - 2];
    const mrrGrowthRate =
      lastMonth?.mrr > 0
        ? ((currentMonth.mrr - lastMonth.mrr) / lastMonth.mrr) * 100
        : currentMonth.mrr > 0
          ? 100
          : 0;

    // Projeção ARR (Annual Recurring Revenue)
    const arr = currentMRR * 12;

    return NextResponse.json({
      currentMRR: parseFloat(currentMRR.toFixed(2)),
      arr: parseFloat(arr.toFixed(2)),
      mrrGrowthRate: parseFloat(mrrGrowthRate.toFixed(2)),
      activeSubscriptions: subscriptionPayments.length,
      byPackage: {
        lateral: {
          count: mrrByPackage.lateral.count,
          mrr: parseFloat(mrrByPackage.lateral.mrr.toFixed(2)),
          label: "Banner Lateral (€25/mês)",
        },
        premium: {
          count: mrrByPackage.premium.count,
          mrr: parseFloat(mrrByPackage.premium.mrr.toFixed(2)),
          label: "Destaque Premium (€75/mês)",
        },
      },
      evolution: mrrChart,
    });
  } catch (error) {
    logger.error("MRR calculation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao calcular MRR" },
      { status: 500 }
    );
  }
}
