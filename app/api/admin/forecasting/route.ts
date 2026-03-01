import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// Calcular média móvel simples
function simpleMovingAverage(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(data[i]);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }
  return result;
}

// Calcular taxa de crescimento
function calculateGrowthRate(data: number[]): number {
  if (data.length < 2) return 0;

  const oldValue = data[0];
  const newValue = data[data.length - 1];

  if (oldValue === 0) return newValue > 0 ? 100 : 0;

  return ((newValue - oldValue) / oldValue) * 100;
}

// Previsão linear simples
function linearForecast(data: number[], periodsAhead: number): number[] {
  if (data.length < 2) return Array(periodsAhead).fill(data[0] || 0);

  // Calcular tendência linear (least squares)
  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Gerar previsões
  const forecasts: number[] = [];
  for (let i = 0; i < periodsAhead; i++) {
    const value = intercept + slope * (n + i);
    forecasts.push(Math.max(0, Math.round(value))); // Não permitir valores negativos
  }

  return forecasts;
}

// GET - Calcular previsões
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const metric = searchParams.get("metric") || "revenue"; // 'revenue', 'leads', 'customers'
    const daysBack = parseInt(searchParams.get("days_back") || "30");
    const daysAhead = parseInt(searchParams.get("days_ahead") || "7");

    // Data de início
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let historicalData: { date: string; value: number }[] = [];

    if (metric === "revenue") {
      // Receita por dia
      const { data: payments } = await supabase
        .from("payments")
        .select("amount, created_at")
        .eq("status", "succeeded")
        .gte("created_at", startDate.toISOString());

      if (payments) {
        // Agrupar por dia
        const dailyRevenue: Record<string, number> = {};
        payments.forEach((p) => {
          const date = new Date(p.created_at).toISOString().split("T")[0];
          dailyRevenue[date] = (dailyRevenue[date] || 0) + p.amount;
        });

        historicalData = Object.entries(dailyRevenue)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, value]) => ({ date, value: value / 100 })); // Converter de centavos
      }
    } else if (metric === "leads") {
      // Leads por dia
      const { data: leads } = await supabase
        .from("leads")
        .select("email, created_at")
        .gte("created_at", startDate.toISOString());

      if (leads) {
        const dailyLeads: Record<string, number> = {};
        leads.forEach((l) => {
          const date = new Date(l.created_at).toISOString().split("T")[0];
          dailyLeads[date] = (dailyLeads[date] || 0) + 1;
        });

        historicalData = Object.entries(dailyLeads)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, value]) => ({ date, value }));
      }
    } else if (metric === "customers") {
      // Novos clientes por dia (primeiro pagamento)
      const { data: payments } = await supabase
        .from("payments")
        .select("email, created_at")
        .eq("status", "succeeded")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (payments) {
        const firstPayments = new Map<string, string>();
        payments.forEach((p) => {
          if (!firstPayments.has(p.email)) {
            firstPayments.set(p.email, p.created_at);
          }
        });

        const dailyCustomers: Record<string, number> = {};
        firstPayments.forEach((created_at) => {
          const date = new Date(created_at).toISOString().split("T")[0];
          dailyCustomers[date] = (dailyCustomers[date] || 0) + 1;
        });

        historicalData = Object.entries(dailyCustomers)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, value]) => ({ date, value }));
      }
    }

    // Preencher dias sem dados com 0
    const allDates: string[] = [];
    for (let i = 0; i < daysBack; i++) {
      const date = new Date();
      date.setDate(date.getDate() - daysBack + i);
      allDates.push(date.toISOString().split("T")[0]);
    }

    const filledData = allDates.map((date) => {
      const existing = historicalData.find((d) => d.date === date);
      return { date, value: existing ? existing.value : 0 };
    });

    // Calcular previsões
    const values = filledData.map((d) => d.value);
    const forecasts = linearForecast(values, daysAhead);

    // Gerar datas futuras
    const futureDates: string[] = [];
    for (let i = 1; i <= daysAhead; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      futureDates.push(date.toISOString().split("T")[0]);
    }

    const forecastData = futureDates.map((date, index) => ({
      date,
      value: forecasts[index],
      is_forecast: true,
    }));

    // Calcular métricas
    const growthRate = calculateGrowthRate(values);
    const movingAvg = simpleMovingAverage(values, 7);
    const currentTrend = movingAvg[movingAvg.length - 1];
    const totalHistorical = values.reduce((sum, v) => sum + v, 0);
    const totalForecast = forecasts.reduce((sum, v) => sum + v, 0);
    const avgDaily = totalHistorical / daysBack;

    // Confiança da previsão (baseada em volatilidade)
    const volatility = calculateVolatility(values);
    const confidence = Math.max(0, Math.min(100, 100 - volatility * 10));

    return NextResponse.json({
      metric,
      historical: filledData,
      forecast: forecastData,
      metrics: {
        growth_rate: growthRate,
        current_trend: currentTrend,
        total_historical: totalHistorical,
        total_forecast: totalForecast,
        avg_daily: avgDaily,
        confidence: confidence,
      },
    });
  } catch (error) {
    logger.error("Forecasting error:", error);
    return NextResponse.json({ error: "Erro ao calcular previsões" }, { status: 500 });
  }
}

// Calcular volatilidade (desvio padrão relativo)
function calculateVolatility(data: number[]): number {
  if (data.length === 0) return 0;

  const mean = data.reduce((sum, v) => sum + v, 0) / data.length;
  if (mean === 0) return 0;

  const variance = data.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  return (stdDev / mean) * 100; // Coeficiente de variação
}
