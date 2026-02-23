import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(_req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Run all 4 independent queries in parallel instead of 7 sequential
    const [allPaymentsResult, thisMonthResult, lastMonthResult, subsResult] = await Promise.all([
      // Single query replaces 3 old ones (totalRevenue, avgTicket, count, breakdown)
      supabase
        .from("payments")
        .select("amount, product_type, product_metadata")
        .eq("status", "succeeded"),
      supabase
        .from("payments")
        .select("amount")
        .eq("status", "succeeded")
        .gte("created_at", startOfMonth.toISOString()),
      supabase
        .from("payments")
        .select("amount")
        .eq("status", "succeeded")
        .gte("created_at", startOfLastMonth.toISOString())
        .lt("created_at", startOfMonth.toISOString()),
      // MRR - needs product_metadata filter
      supabase
        .from("payments")
        .select("amount, product_metadata")
        .eq("status", "succeeded")
        .not("product_metadata", "is", null),
    ]);

    if (allPaymentsResult.error) throw allPaymentsResult.error;
    if (thisMonthResult.error) throw thisMonthResult.error;
    if (lastMonthResult.error) throw lastMonthResult.error;
    if (subsResult.error) throw subsResult.error;

    const allPayments = allPaymentsResult.data || [];
    const thisMonthData = thisMonthResult.data || [];
    const lastMonthData = lastMonthResult.data || [];
    const subsData = subsResult.data || [];

    // Derive all metrics from the parallel results
    const totalRevenue = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalTransactions = allPayments.length;
    const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    const thisMonthRevenue = thisMonthData.reduce((sum, p) => sum + (p.amount || 0), 0);
    const lastMonthRevenue = lastMonthData.reduce((sum, p) => sum + (p.amount || 0), 0);

    const growthPercentage =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : thisMonthRevenue > 0
          ? 100
          : 0;

    const mrr =
      subsData
        .filter((p) => {
          const metadata = p.product_metadata as Record<string, unknown> | null;
          const pkg = metadata?.package;
          return pkg === "lateral" || pkg === "premium";
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    const revenueByProduct = allPayments.reduce((acc: Record<string, number>, p) => {
      const type = p.product_type || "outros";
      acc[type] = (acc[type] || 0) + (p.amount || 0);
      return acc;
    }, {});

    return NextResponse.json({
      overview: {
        totalRevenue: totalRevenue / 100,
        thisMonthRevenue: thisMonthRevenue / 100,
        lastMonthRevenue: lastMonthRevenue / 100,
        growthPercentage: parseFloat(growthPercentage.toFixed(2)),
        mrr: mrr / 100,
        averageTicket: averageTicket / 100,
        totalTransactions,
      },
      revenueByProduct: Object.entries(revenueByProduct).map(([type, amount]) => ({
        type,
        amount: (amount as number) / 100,
      })),
    });
  } catch (error) {
    logger.error("Financial overview error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar dados financeiros" },
      { status: 500 }
    );
  }
}
