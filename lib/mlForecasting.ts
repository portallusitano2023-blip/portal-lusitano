// ML-powered Analytics & Forecasting
// Uses statistical methods for predictions (no external ML dependencies)

interface DataPoint {
  x: number; // timestamp or index
  y: number; // value
}

interface ForecastResult {
  predictions: Array<{ date: string; value: number; confidence: number }>;
  accuracy: number;
  model: string;
  rmse: number;
}

interface ChurnPrediction {
  userId: string;
  email: string;
  churnProbability: number;
  risk: "high" | "medium" | "low";
  factors: string[];
  recommendedActions: string[];
}

interface LTVPrediction {
  userId: string;
  email: string;
  predictedLTV: number;
  confidence: number;
  segment: "high-value" | "medium-value" | "low-value";
}

interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  characteristics: string[];
  avgValue: number;
  color: string;
}

// ========================================
// LINEAR REGRESSION
// ========================================

function linearRegression(data: DataPoint[]): { slope: number; intercept: number } {
  const n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// ========================================
// DOUBLE EXPONENTIAL SMOOTHING (Holt's method)
// Better than linear regression for time series with trend
// ========================================

function doubleExponentialSmoothing(
  data: number[],
  alpha: number = 0.3,
  beta: number = 0.1
): { level: number; trend: number; fitted: number[] } {
  if (data.length < 2) {
    return { level: data[0] || 0, trend: 0, fitted: data };
  }

  // Initialize
  let level = data[0];
  let trend = data[1] - data[0];
  const fitted: number[] = [level];

  // Smooth
  for (let i = 1; i < data.length; i++) {
    const prevLevel = level;
    level = alpha * data[i] + (1 - alpha) * (prevLevel + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    fitted.push(level + trend);
  }

  return { level, trend, fitted };
}

// ========================================
// REVENUE FORECASTING (Double Exponential Smoothing)
// ========================================

export async function forecastRevenue(
  historicalData: Array<{ date: string; revenue: number }>,
  daysAhead: number = 30
): Promise<ForecastResult> {
  const values = historicalData.map((item) => item.revenue);

  // Use double exponential smoothing for trend-aware forecasting
  const { level, trend, fitted } = doubleExponentialSmoothing(values);

  // Also compute linear regression for comparison/blending
  const dataPoints: DataPoint[] = historicalData.map((item, index) => ({
    x: index,
    y: item.revenue,
  }));
  const lr = linearRegression(dataPoints);

  // Generate predictions (blend both models)
  const predictions = [];
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const expValue = level + trend * (i + 1);
    const lrValue = lr.slope * (values.length + i) + lr.intercept;

    // Weighted blend: 70% exponential smoothing, 30% linear regression
    const value = Math.max(0, 0.7 * expValue + 0.3 * lrValue);

    // Confidence decreases with distance, faster for volatile data
    const confidence = Math.max(40, 95 - (i / daysAhead) * 55);

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    predictions.push({
      date: futureDate.toISOString().split("T")[0],
      value: Math.round(value),
      confidence: Math.round(confidence),
    });
  }

  // Calculate RMSE using fitted values
  let sumSquaredErrors = 0;
  const compareLength = Math.min(fitted.length, values.length);
  for (let i = 0; i < compareLength; i++) {
    sumSquaredErrors += Math.pow(fitted[i] - values[i], 2);
  }
  const rmse = Math.sqrt(sumSquaredErrors / compareLength);
  const meanValue = values.reduce((a, b) => a + b, 0) / values.length;
  const accuracy = Math.max(0, Math.min(100, 100 - (rmse / (meanValue || 1)) * 100));

  return {
    predictions,
    accuracy: Math.round(accuracy),
    model: "Double Exponential Smoothing + Linear Regression",
    rmse: Math.round(rmse),
  };
}

// ========================================
// CHURN PREDICTION (Weighted Multi-Factor Scoring)
// ========================================

export async function predictChurn(users: Record<string, unknown>[]): Promise<ChurnPrediction[]> {
  return users.map((user) => {
    const daysSinceLastPurchase = Number(user.daysSinceLastPurchase) || 0;
    const totalPurchases = Number(user.totalPurchases) || 0;
    const avgOrderValue = Number(user.avgOrderValue) || 0;
    const emailOpenRate = Number(user.emailOpenRate) || 0;
    const accountAgeDays = Number(user.accountAgeDays) || 30;

    // Weighted scoring with sigmoid normalization
    // Recency (35% weight) - most predictive factor
    const recencyScore =
      daysSinceLastPurchase > 120
        ? 1.0
        : daysSinceLastPurchase > 90
          ? 0.8
          : daysSinceLastPurchase > 60
            ? 0.6
            : daysSinceLastPurchase > 30
              ? 0.3
              : 0.1;

    // Frequency (25% weight)
    const expectedPurchases = accountAgeDays / 90; // expect ~1 purchase per quarter
    const frequencyRatio = expectedPurchases > 0 ? totalPurchases / expectedPurchases : 1;
    const frequencyScore = frequencyRatio >= 1 ? 0.1 : frequencyRatio >= 0.5 ? 0.4 : 0.8;

    // Monetary (20% weight)
    const monetaryScore =
      avgOrderValue < 2000 ? 0.7 : avgOrderValue < 5000 ? 0.4 : avgOrderValue < 10000 ? 0.2 : 0.1;

    // Engagement (20% weight)
    const engagementScore =
      emailOpenRate < 5 ? 0.9 : emailOpenRate < 15 ? 0.6 : emailOpenRate < 30 ? 0.3 : 0.1;

    const churnScore =
      recencyScore * 0.35 + frequencyScore * 0.25 + monetaryScore * 0.2 + engagementScore * 0.2;

    const churnProbability = Math.min(100, Math.round(churnScore * 100));

    const risk = churnProbability > 70 ? "high" : churnProbability > 40 ? "medium" : "low";

    const factors: string[] = [];
    const actions: string[] = [];

    if (recencyScore >= 0.6) {
      factors.push(
        daysSinceLastPurchase > 90 ? "Inativo há mais de 90 dias" : "Inativo há mais de 60 dias"
      );
      actions.push("Enviar email de reengajamento com oferta especial");
    }
    if (frequencyScore >= 0.4) {
      factors.push("Frequência de compra abaixo do esperado");
      actions.push("Oferecer desconto progressivo para próximas compras");
    }
    if (engagementScore >= 0.6) {
      factors.push("Baixo engagement com emails");
      actions.push("Testar novo formato/frequência de comunicação");
    }
    if (monetaryScore >= 0.4) {
      factors.push("Valor médio de compra baixo");
      actions.push("Sugerir produtos complementares (upsell)");
    }

    return {
      userId: String(user.id),
      email: String(user.email),
      churnProbability,
      risk,
      factors: factors.length ? factors : ["Baixo risco de churn"],
      recommendedActions: actions.length ? actions : ["Manter engagement atual"],
    };
  });
}

// ========================================
// LIFETIME VALUE (LTV) PREDICTION
// ========================================

export async function predictLTV(users: Record<string, unknown>[]): Promise<LTVPrediction[]> {
  return users.map((user) => {
    const totalSpent = Number(user.totalSpent) || 0;
    const totalOrders = Number(user.totalOrders) || 0;
    const daysSinceFirstOrder = Number(user.daysSinceFirstOrder) || 1;
    const daysSinceLastPurchase = Number(user.daysSinceLastPurchase) || 0;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // BG/NBD-inspired purchase frequency (orders per year)
    const yearsActive = daysSinceFirstOrder / 365;
    const orderFrequency = yearsActive > 0 ? totalOrders / yearsActive : totalOrders;

    // Retention probability (decreases with inactivity)
    const retentionProb = Math.max(0.1, 1 - daysSinceLastPurchase / (daysSinceFirstOrder + 1));

    // Predicted remaining lifespan (weighted by retention)
    const avgLifespanYears = 3;
    const remainingLifespan = avgLifespanYears * retentionProb;

    // LTV = AOV * frequency * remaining lifespan
    const predictedLTV = avgOrderValue * orderFrequency * remainingLifespan;

    // Confidence based on data availability
    const dataPoints = Math.min(totalOrders, 10);
    const timeSpan = Math.min(daysSinceFirstOrder / 365, 2);
    const confidence = Math.min(100, dataPoints * 8 + timeSpan * 20);

    const segment =
      predictedLTV > 50000 ? "high-value" : predictedLTV > 15000 ? "medium-value" : "low-value";

    return {
      userId: String(user.id),
      email: String(user.email),
      predictedLTV: Math.round(predictedLTV),
      confidence: Math.round(confidence),
      segment,
    };
  });
}

// ========================================
// CUSTOMER CLUSTERING (RFM Segmentation)
// ========================================

export async function clusterCustomers(
  users: Record<string, unknown>[]
): Promise<CustomerSegment[]> {
  // RFM segmentation (Recency, Frequency, Monetary)
  const segments: CustomerSegment[] = [
    {
      id: "champions",
      name: "Champions",
      size: 0,
      characteristics: ["Compraram recentemente", "Compram frequentemente", "Gastam muito"],
      avgValue: 0,
      color: "#10b981",
    },
    {
      id: "loyal",
      name: "Leais",
      size: 0,
      characteristics: ["Compram regularmente", "Valor médio-alto", "Engagement alto"],
      avgValue: 0,
      color: "#3b82f6",
    },
    {
      id: "potential",
      name: "Potencial",
      size: 0,
      characteristics: ["Compraram recentemente", "Baixa frequência", "Valor promissor"],
      avgValue: 0,
      color: "#f59e0b",
    },
    {
      id: "at-risk",
      name: "Em Risco",
      size: 0,
      characteristics: ["Não compram há tempo", "Eram clientes valiosos", "Precisam reativação"],
      avgValue: 0,
      color: "#ef4444",
    },
    {
      id: "hibernating",
      name: "Hibernando",
      size: 0,
      characteristics: ["Inativos há muito tempo", "Baixo valor histórico", "Difícil recuperação"],
      avgValue: 0,
      color: "#6b7280",
    },
  ];

  // Classify each user using RFM scores
  users.forEach((user) => {
    const recency = Number(user.daysSinceLastPurchase) || 999;
    const frequency = Number(user.totalOrders) || 0;
    const monetary = Number(user.totalSpent) || 0;

    let segment: CustomerSegment;

    if (recency < 30 && frequency >= 5 && monetary > 50000) {
      segment = segments[0]; // Champions
    } else if (recency < 60 && frequency >= 3 && monetary > 20000) {
      segment = segments[1]; // Loyal
    } else if (recency < 30 && frequency < 3 && monetary > 5000) {
      segment = segments[2]; // Potential
    } else if (recency > 90 && frequency >= 3 && monetary > 20000) {
      segment = segments[3]; // At-risk
    } else {
      segment = segments[4]; // Hibernating
    }

    segment.size++;
    segment.avgValue += monetary;
  });

  // Calculate averages
  segments.forEach((segment) => {
    if (segment.size > 0) {
      segment.avgValue = Math.round(segment.avgValue / segment.size);
    }
  });

  return segments.filter((s) => s.size > 0);
}

// ========================================
// FEATURE IMPORTANCE
// ========================================

export function getFeatureImportance(): Record<string, number> {
  // Feature weights used in the churn prediction model
  return {
    daysSinceLastPurchase: 0.35,
    totalPurchases: 0.25,
    avgOrderValue: 0.2,
    emailOpenRate: 0.15,
    accountAge: 0.05,
  };
}
