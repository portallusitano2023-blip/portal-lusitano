import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { MonthlyReportPDF } from "@/components/admin/MonthlyReportPDF";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import React from "react";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar parâmetros (mês/ano opcional - default: mês atual)
    const searchParams = req.nextUrl.searchParams;
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const now = new Date();
    const targetMonth = monthParam ? parseInt(monthParam) : now.getMonth() + 1;
    const targetYear = yearParam ? parseInt(yearParam) : now.getFullYear();

    // Calcular datas do período
    const periodStart = new Date(targetYear, targetMonth - 1, 1);
    const periodEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // 1. BUSCAR DADOS FINANCEIROS
    const { data: payments } = await supabase
      .from("payments")
      .select("amount, product_type, created_at")
      .eq("status", "succeeded");

    const paymentsThisMonth = payments?.filter((p) => {
      const date = new Date(p.created_at);
      return date >= periodStart && date <= periodEnd;
    }) || [];

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const revenueThisMonth = paymentsThisMonth.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Receitas por produto (este mês)
    const revenueByProduct = {
      cavalo_anuncio: 0,
      instagram: 0,
      publicidade: 0,
    };

    paymentsThisMonth.forEach((p) => {
      const type = p.product_type || "cavalo_anuncio";
      if (type in revenueByProduct) {
        revenueByProduct[type as keyof typeof revenueByProduct] += p.amount || 0;
      }
    });

    const averageTicket = paymentsThisMonth.length > 0
      ? Math.round(revenueThisMonth / paymentsThisMonth.length)
      : 0;

    // 2. BUSCAR TOP CAVALOS MAIS VISTOS
    const { data: topHorses } = await supabase
      .from("cavalos_venda")
      .select("nome, views_count")
      .order("views_count", { ascending: false })
      .limit(5);

    const topHorsesFormatted = (topHorses || []).map((h) => ({
      name: h.nome || "Sem nome",
      views: h.views_count || 0,
    }));

    // 3. BUSCAR ANÁLISE DE LEADS
    const { data: leadsData } = await supabase
      .from("leads")
      .select("email, utm_source, created_at");

    const leadsThisMonth = leadsData?.filter((l) => {
      const date = new Date(l.created_at);
      return date >= periodStart && date <= periodEnd;
    }) || [];

    const leadsBySource: Record<string, number> = {};
    leadsThisMonth.forEach((lead) => {
      const source = lead.utm_source || "Direto";
      leadsBySource[source] = (leadsBySource[source] || 0) + 1;
    });

    // 4. CALCULAR ROI POR CANAL
    const { data: paymentsWithSource } = await supabase
      .from("payments")
      .select("amount, email, created_at")
      .eq("status", "succeeded");

    const paymentsWithSourceThisMonth = paymentsWithSource?.filter((p) => {
      const date = new Date(p.created_at);
      return date >= periodStart && date <= periodEnd;
    }) || [];

    // Mapear email → utm_source
    const emailToSource: Record<string, string> = {};
    leadsData?.forEach((lead) => {
      emailToSource[lead.email] = lead.utm_source || "Direto";
    });

    const revenueBySource: Record<string, number> = {};
    paymentsWithSourceThisMonth.forEach((p) => {
      const source = emailToSource[p.email] || "Direto";
      revenueBySource[source] = (revenueBySource[source] || 0) + (p.amount || 0);
    });

    const roiData = Object.entries(revenueBySource).map(([source, revenue]) => {
      const leadsFromSource = leadsBySource[source] || 0;
      const revenueInEuros = revenue / 100;
      const estimatedCost = leadsFromSource * 5; // €5 por lead
      const roi = estimatedCost > 0
        ? ((revenueInEuros - estimatedCost) / estimatedCost) * 100
        : 0;

      return {
        source,
        revenue: parseFloat(revenueInEuros.toFixed(2)),
        leads: leadsFromSource,
        roi: parseFloat(roi.toFixed(1)),
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // 5. MONTAR DADOS PARA O PDF
    const reportData = {
      period: {
        month: periodStart.toLocaleDateString("pt-PT", { month: "long" }),
        year: targetYear,
      },
      financial: {
        totalRevenue,
        revenueThisMonth,
        mrr: 0, // TODO: calcular MRR quando houver subscrições recorrentes
        averageTicket,
        transactionCount: paymentsThisMonth.length,
        revenueByProduct,
      },
      topHorses: topHorsesFormatted,
      leads: {
        total: leadsThisMonth.length,
        bySource: leadsBySource,
      },
      roi: roiData,
    };

    // 6. GERAR PDF
    // Criar o componente PDF com a função helper
    const pdfDocument = MonthlyReportPDF({ data: reportData });
    const pdfBuffer = await renderToBuffer(pdfDocument);

    // 7. RETORNAR PDF
    const fileName = `portal-lusitano-relatorio-${targetYear}-${String(targetMonth).padStart(2, "0")}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error("Erro ao gerar relatório PDF:", error);
    return NextResponse.json(
      {
        error: "Erro ao gerar relatório",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
