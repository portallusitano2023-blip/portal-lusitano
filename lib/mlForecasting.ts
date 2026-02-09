// ML-powered Analytics & Forecasting
// Uses ML.js for real machine learning predictions

// To install: npm install ml.js
// For now using mock implementations - replace with real ML when installed

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
// LINEAR REGRESSION (Basic)
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

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// ========================================
// REVENUE FORECASTING
// ========================================

export async function forecastRevenue(
  historicalData: Array<{ date: string; revenue: number }>,
  daysAhead: number = 30
): Promise<ForecastResult> {
  // Convert to data points
  const dataPoints: DataPoint[] = historicalData.map((item, index) => ({
    x: index,
    y: item.revenue,
  }));

  // Simple linear regression for now
  // TODO: Replace with ARIMA or Prophet when ml.js is installed
  const { slope, intercept } = linearRegression(dataPoints);

  // Generate predictions
  const predictions = [];
  const startIndex = dataPoints.length;
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const x = startIndex + i;
    const value = Math.max(0, slope * x + intercept);

    // Add some variance to confidence
    const confidence = Math.max(0.5, 1 - i / daysAhead) * 100;

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    predictions.push({
      date: futureDate.toISOString().split("T")[0],
      value: Math.round(value),
      confidence: Math.round(confidence),
    });
  }

  // Calculate RMSE (Root Mean Squared Error)
  let sumSquaredErrors = 0;
  for (let i = 0; i < dataPoints.length; i++) {
    const predicted = slope * dataPoints[i].x + intercept;
    const actual = dataPoints[i].y;
    sumSquaredErrors += Math.pow(predicted - actual, 2);
  }
  const rmse = Math.sqrt(sumSquaredErrors / dataPoints.length);
  const accuracy = Math.max(0, 100 - (rmse / (intercept || 1)) * 100);

  return {
    predictions,
    accuracy: Math.round(accuracy),
    model: "Linear Regression",
    rmse: Math.round(rmse),
  };
}

// ========================================
// CHURN PREDICTION
// ========================================

export async function predictChurn(users: Record<string, unknown>[]): Promise<ChurnPrediction[]> {
  // Mock ML churn prediction
  // TODO: Replace with real ML model (Random Forest or XGBoost)

  return users.map((user) => {
    // Simple heuristic-based prediction (replace with real ML)
    const daysSinceLastPurchase = user.daysSinceLastPurchase || 0;
    const totalPurchases = user.totalPurchases || 0;
    const avgOrderValue = user.avgOrderValue || 0;
    const emailOpenRate = user.emailOpenRate || 0;

    // Calculate churn score (0-1)
    let churnScore = 0;

    // Recency factor
    if (daysSinceLastPurchase > 90) churnScore += 0.3;
    else if (daysSinceLastPurchase > 60) churnScore += 0.2;
    else if (daysSinceLastPurchase > 30) churnScore += 0.1;

    // Frequency factor
    if (totalPurchases < 2) churnScore += 0.2;
    else if (totalPurchases < 5) churnScore += 0.1;

    // Monetary factor
    if (avgOrderValue < 3000)
      churnScore += 0.2; // Less than €30
    else if (avgOrderValue < 10000) churnScore += 0.1; // Less than €100

    // Engagement factor
    if (emailOpenRate < 10) churnScore += 0.3;
    else if (emailOpenRate < 25) churnScore += 0.15;

    const churnProbability = Math.min(1, churnScore) * 100;

    const risk = churnProbability > 70 ? "high" : churnProbability > 40 ? "medium" : "low";

    const factors = [];
    const actions = [];

    if (daysSinceLastPurchase > 60) {
      factors.push("Inativo há mais de 60 dias");
      actions.push("Enviar email de reengajamento");
    }
    if (totalPurchases < 3) {
      factors.push("Baixa frequência de compra");
      actions.push("Oferecer desconto para próxima compra");
    }
    if (emailOpenRate < 20) {
      factors.push("Baixo engagement com emails");
      actions.push("Rever estratégia de comunicação");
    }

    return {
      userId: user.id,
      email: user.email,
      churnProbability: Math.round(churnProbability),
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
  // Mock LTV prediction
  // TODO: Replace with real ML model (Gradient Boosting)

  return users.map((user) => {
    const totalSpent = user.totalSpent || 0;
    const totalOrders = user.totalOrders || 0;
    const daysSinceFirstOrder = user.daysSinceFirstOrder || 1;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Simple LTV formula: (AOV × Purchase Frequency × Customer Lifespan)
    // Assuming average customer lifespan of 3 years
    const orderFrequency = totalOrders / (daysSinceFirstOrder / 365);
    const predictedLifespanYears = 3;
    const predictedLTV = avgOrderValue * orderFrequency * predictedLifespanYears * 365;

    // Confidence based on historical data availability
    const confidence = Math.min(100, (totalOrders / 5) * 50 + (daysSinceFirstOrder / 365) * 50);

    const segment =
      predictedLTV > 50000 ? "high-value" : predictedLTV > 15000 ? "medium-value" : "low-value";

    return {
      userId: user.id,
      email: user.email,
      predictedLTV: Math.round(predictedLTV),
      confidence: Math.round(confidence),
      segment,
    };
  });
}

// ========================================
// CUSTOMER CLUSTERING (K-Means simulation)
// ========================================

export async function clusterCustomers(
  users: Record<string, unknown>[]
): Promise<CustomerSegment[]> {
  // Mock customer clustering
  // TODO: Replace with real K-Means from ml.js

  // Simple RFM segmentation (Recency, Frequency, Monetary)
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

  // Classify each user
  users.forEach((user) => {
    const recency = user.daysSinceLastPurchase || 999;
    const frequency = user.totalOrders || 0;
    const monetary = user.totalSpent || 0;

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
// FEATURE IMPORTANCE (for debugging)
// ========================================

export function getFeatureImportance(): Record<string, number> {
  // Mock feature importance
  // In real ML, this would come from the trained model
  return {
    daysSinceLastPurchase: 0.35,
    totalPurchases: 0.25,
    avgOrderValue: 0.2,
    emailOpenRate: 0.15,
    accountAge: 0.05,
  };
}
