import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  forecastRevenue,
  predictChurn,
  predictLTV,
  clusterCustomers,
  getFeatureImportance,
} from "@/lib/mlForecasting";

describe("mlForecasting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =============================================
  // forecastRevenue
  // =============================================
  describe("forecastRevenue", () => {
    it("deve gerar previsoes com dados crescentes", async () => {
      const historicalData = [
        { date: "2026-01-01", revenue: 1000 },
        { date: "2026-01-02", revenue: 1200 },
        { date: "2026-01-03", revenue: 1400 },
        { date: "2026-01-04", revenue: 1600 },
        { date: "2026-01-05", revenue: 1800 },
        { date: "2026-01-06", revenue: 2000 },
        { date: "2026-01-07", revenue: 2200 },
      ];

      const result = await forecastRevenue(historicalData, 7);

      expect(result.predictions).toHaveLength(7);
      expect(result.model).toBe("Double Exponential Smoothing + Linear Regression");
      expect(result.accuracy).toBeGreaterThan(0);
      expect(result.accuracy).toBeLessThanOrEqual(100);
      expect(result.rmse).toBeGreaterThanOrEqual(0);

      // Com dados crescentes lineares, as previsoes devem continuar crescentes
      for (let i = 1; i < result.predictions.length; i++) {
        expect(result.predictions[i].value).toBeGreaterThanOrEqual(result.predictions[i - 1].value);
      }

      // Cada previsao deve ter date, value e confidence
      for (const prediction of result.predictions) {
        expect(prediction).toHaveProperty("date");
        expect(prediction).toHaveProperty("value");
        expect(prediction).toHaveProperty("confidence");
        expect(prediction.value).toBeGreaterThanOrEqual(0);
        expect(prediction.confidence).toBeGreaterThanOrEqual(40);
        expect(prediction.confidence).toBeLessThanOrEqual(95);
      }
    });

    it("deve gerar previsoes estaveis com dados planos", async () => {
      const historicalData = [
        { date: "2026-01-01", revenue: 5000 },
        { date: "2026-01-02", revenue: 5000 },
        { date: "2026-01-03", revenue: 5000 },
        { date: "2026-01-04", revenue: 5000 },
        { date: "2026-01-05", revenue: 5000 },
      ];

      const result = await forecastRevenue(historicalData, 10);

      expect(result.predictions).toHaveLength(10);

      // Com dados planos, as previsoes devem estar perto de 5000
      for (const prediction of result.predictions) {
        expect(prediction.value).toBeGreaterThan(4000);
        expect(prediction.value).toBeLessThan(6000);
      }

      // Accuracy deve ser alta para dados sem variacao
      expect(result.accuracy).toBeGreaterThan(80);
    });

    it("deve lidar com um unico ponto de dados", async () => {
      const historicalData = [{ date: "2026-01-01", revenue: 3000 }];

      const result = await forecastRevenue(historicalData, 5);

      expect(result.predictions).toHaveLength(5);

      // Com um unico ponto, a previsao deve ser baseada nesse valor
      for (const prediction of result.predictions) {
        expect(prediction.value).toBeGreaterThanOrEqual(0);
        expect(typeof prediction.value).toBe("number");
        expect(Number.isFinite(prediction.value)).toBe(true);
      }
    });

    it("deve lidar com array vazio retornando previsoes validas", async () => {
      const historicalData: Array<{ date: string; revenue: number }> = [];

      // Com array vazio, a funcao pode dar NaN ou zero, mas nao deve crashar
      const result = await forecastRevenue(historicalData, 3);

      expect(result.predictions).toHaveLength(3);
      expect(result).toHaveProperty("model");
      expect(result).toHaveProperty("rmse");
      expect(result).toHaveProperty("accuracy");
    });

    it("deve ter confianca decrescente ao longo do tempo", async () => {
      const historicalData = [
        { date: "2026-01-01", revenue: 1000 },
        { date: "2026-01-02", revenue: 1100 },
        { date: "2026-01-03", revenue: 1200 },
        { date: "2026-01-04", revenue: 1300 },
        { date: "2026-01-05", revenue: 1400 },
      ];

      const result = await forecastRevenue(historicalData, 30);

      // A confianca da primeira previsao deve ser >= a da ultima
      const firstConfidence = result.predictions[0].confidence;
      const lastConfidence = result.predictions[result.predictions.length - 1].confidence;
      expect(firstConfidence).toBeGreaterThanOrEqual(lastConfidence);
    });

    it("deve garantir que valores previstos nunca sao negativos", async () => {
      // Dados decrescentes que poderiam extrapolar para negativos
      const historicalData = [
        { date: "2026-01-01", revenue: 500 },
        { date: "2026-01-02", revenue: 400 },
        { date: "2026-01-03", revenue: 300 },
        { date: "2026-01-04", revenue: 200 },
        { date: "2026-01-05", revenue: 100 },
      ];

      const result = await forecastRevenue(historicalData, 30);

      for (const prediction of result.predictions) {
        expect(prediction.value).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // =============================================
  // predictChurn
  // =============================================
  describe("predictChurn", () => {
    it("deve prever alto risco para utilizador inativo com poucas compras", async () => {
      const users = [
        {
          id: "user-1",
          email: "inactive@test.com",
          daysSinceLastPurchase: 120,
          totalPurchases: 1,
          avgOrderValue: 1000,
          emailOpenRate: 2,
          accountAgeDays: 365,
        },
      ];

      const results = await predictChurn(users);

      expect(results).toHaveLength(1);
      expect(results[0].userId).toBe("user-1");
      expect(results[0].email).toBe("inactive@test.com");
      expect(results[0].risk).toBe("high");
      expect(results[0].churnProbability).toBeGreaterThan(70);
      expect(results[0].factors.length).toBeGreaterThan(0);
      expect(results[0].recommendedActions.length).toBeGreaterThan(0);
    });

    it("deve prever baixo risco para utilizador activo e frequente", async () => {
      const users = [
        {
          id: "user-2",
          email: "active@test.com",
          daysSinceLastPurchase: 5,
          totalPurchases: 20,
          avgOrderValue: 15000,
          emailOpenRate: 50,
          accountAgeDays: 365,
        },
      ];

      const results = await predictChurn(users);

      expect(results).toHaveLength(1);
      expect(results[0].risk).toBe("low");
      expect(results[0].churnProbability).toBeLessThanOrEqual(40);
      // Utilizador de baixo risco pode nao ter factores negativos
      expect(results[0].factors).toContain("Baixo risco de churn");
      expect(results[0].recommendedActions).toContain("Manter engagement atual");
    });

    it("deve prever risco medio para utilizador intermedio", async () => {
      const users = [
        {
          id: "user-3",
          email: "medium@test.com",
          daysSinceLastPurchase: 65,
          totalPurchases: 3,
          avgOrderValue: 3000,
          emailOpenRate: 10,
          accountAgeDays: 180,
        },
      ];

      const results = await predictChurn(users);

      expect(results).toHaveLength(1);
      expect(results[0].risk).toBe("medium");
      expect(results[0].churnProbability).toBeGreaterThan(40);
      expect(results[0].churnProbability).toBeLessThanOrEqual(70);
    });

    it("deve processar multiplos utilizadores em batch", async () => {
      const users = [
        {
          id: "u1",
          email: "a@test.com",
          daysSinceLastPurchase: 5,
          totalPurchases: 10,
          avgOrderValue: 20000,
          emailOpenRate: 60,
          accountAgeDays: 365,
        },
        {
          id: "u2",
          email: "b@test.com",
          daysSinceLastPurchase: 150,
          totalPurchases: 0,
          avgOrderValue: 0,
          emailOpenRate: 0,
          accountAgeDays: 30,
        },
      ];

      const results = await predictChurn(users);

      expect(results).toHaveLength(2);
      expect(results[0].userId).toBe("u1");
      expect(results[1].userId).toBe("u2");
      // Segundo utilizador deve ser alto risco
      expect(results[1].risk).toBe("high");
    });

    it("deve incluir factores e accoes relevantes para inactividade", async () => {
      const users = [
        {
          id: "user-inactive",
          email: "gone@test.com",
          daysSinceLastPurchase: 100,
          totalPurchases: 1,
          avgOrderValue: 1500,
          emailOpenRate: 3,
          accountAgeDays: 300,
        },
      ];

      const results = await predictChurn(users);

      // Deve mencionar inactividade nos factores
      const hasInactivityFactor = results[0].factors.some(
        (f) => f.includes("Inativo") || f.includes("90 dias")
      );
      expect(hasInactivityFactor).toBe(true);

      // Deve recomendar reengajamento
      const hasReengagement = results[0].recommendedActions.some(
        (a) => a.includes("reengajamento") || a.includes("oferta")
      );
      expect(hasReengagement).toBe(true);
    });
  });

  // =============================================
  // predictLTV
  // =============================================
  describe("predictLTV", () => {
    it("deve prever alto LTV para utilizador com alto gasto e frequencia", async () => {
      const users = [
        {
          id: "hvuser",
          email: "highvalue@test.com",
          totalSpent: 200000,
          totalOrders: 20,
          daysSinceFirstOrder: 730, // 2 anos
          daysSinceLastPurchase: 10,
        },
      ];

      const results = await predictLTV(users);

      expect(results).toHaveLength(1);
      expect(results[0].userId).toBe("hvuser");
      expect(results[0].segment).toBe("high-value");
      expect(results[0].predictedLTV).toBeGreaterThan(50000);
      expect(results[0].confidence).toBeGreaterThan(0);
      expect(results[0].confidence).toBeLessThanOrEqual(100);
    });

    it("deve prever baixo LTV para utilizador com pouco gasto", async () => {
      const users = [
        {
          id: "lvuser",
          email: "lowvalue@test.com",
          totalSpent: 500,
          totalOrders: 1,
          daysSinceFirstOrder: 30,
          daysSinceLastPurchase: 25,
        },
      ];

      const results = await predictLTV(users);

      expect(results).toHaveLength(1);
      expect(results[0].segment).toBe("low-value");
      expect(results[0].predictedLTV).toBeLessThan(15000);
    });

    it("deve ter baixa confianca para utilizador novo com poucos dados", async () => {
      const users = [
        {
          id: "newuser",
          email: "new@test.com",
          totalSpent: 5000,
          totalOrders: 1,
          daysSinceFirstOrder: 7,
          daysSinceLastPurchase: 3,
        },
      ];

      const results = await predictLTV(users);

      expect(results).toHaveLength(1);
      // Com apenas 1 encomenda e 7 dias, a confianca deve ser baixa
      // dataPoints = min(1, 10) = 1 -> 1*8 = 8
      // timeSpan = min(7/365, 2) ~ 0.019 -> 0.019*20 ~ 0.38
      // confidence ~ 8.38 -> baixa
      expect(results[0].confidence).toBeLessThan(30);
    });

    it("deve classificar segmentos correctamente", async () => {
      const users = [
        {
          id: "high",
          email: "high@test.com",
          totalSpent: 300000,
          totalOrders: 30,
          daysSinceFirstOrder: 365,
          daysSinceLastPurchase: 5,
        },
        {
          id: "medium",
          email: "med@test.com",
          totalSpent: 30000,
          totalOrders: 6,
          daysSinceFirstOrder: 365,
          daysSinceLastPurchase: 20,
        },
        {
          id: "low",
          email: "low@test.com",
          totalSpent: 1000,
          totalOrders: 1,
          daysSinceFirstOrder: 60,
          daysSinceLastPurchase: 55,
        },
      ];

      const results = await predictLTV(users);

      expect(results).toHaveLength(3);
      expect(results[0].segment).toBe("high-value");
      // Medium and low depend on computed LTV
      expect(["medium-value", "low-value"]).toContain(results[2].segment);
    });

    it("deve lidar com utilizador sem encomendas (totalOrders = 0)", async () => {
      const users = [
        {
          id: "zero",
          email: "zero@test.com",
          totalSpent: 0,
          totalOrders: 0,
          daysSinceFirstOrder: 1,
          daysSinceLastPurchase: 0,
        },
      ];

      const results = await predictLTV(users);

      expect(results).toHaveLength(1);
      expect(results[0].predictedLTV).toBe(0);
      expect(results[0].segment).toBe("low-value");
    });
  });

  // =============================================
  // clusterCustomers
  // =============================================
  describe("clusterCustomers", () => {
    it("deve classificar champion correctamente (recente, frequente, alto valor)", async () => {
      const users = [
        {
          daysSinceLastPurchase: 10,
          totalOrders: 10,
          totalSpent: 80000,
        },
      ];

      const segments = await clusterCustomers(users);
      const championSegment = segments.find((s) => s.id === "champions");

      expect(championSegment).toBeDefined();
      expect(championSegment!.size).toBe(1);
      expect(championSegment!.avgValue).toBe(80000);
    });

    it("deve classificar loyal correctamente (recente, frequencia media, bom valor)", async () => {
      const users = [
        {
          daysSinceLastPurchase: 40,
          totalOrders: 4,
          totalSpent: 30000,
        },
      ];

      const segments = await clusterCustomers(users);
      const loyalSegment = segments.find((s) => s.id === "loyal");

      expect(loyalSegment).toBeDefined();
      expect(loyalSegment!.size).toBe(1);
    });

    it("deve classificar at-risk correctamente (inactivo, era valioso)", async () => {
      const users = [
        {
          daysSinceLastPurchase: 120,
          totalOrders: 5,
          totalSpent: 40000,
        },
      ];

      const segments = await clusterCustomers(users);
      const atRiskSegment = segments.find((s) => s.id === "at-risk");

      expect(atRiskSegment).toBeDefined();
      expect(atRiskSegment!.size).toBe(1);
    });

    it("deve classificar hibernating correctamente (fallback)", async () => {
      const users = [
        {
          daysSinceLastPurchase: 200,
          totalOrders: 1,
          totalSpent: 1000,
        },
      ];

      const segments = await clusterCustomers(users);
      const hibernatingSegment = segments.find((s) => s.id === "hibernating");

      expect(hibernatingSegment).toBeDefined();
      expect(hibernatingSegment!.size).toBe(1);
    });

    it("deve distribuir multiplos utilizadores nos segmentos correctos", async () => {
      const users = [
        // Champion
        { daysSinceLastPurchase: 5, totalOrders: 8, totalSpent: 100000 },
        // Loyal
        { daysSinceLastPurchase: 30, totalOrders: 4, totalSpent: 25000 },
        // At-risk
        { daysSinceLastPurchase: 100, totalOrders: 6, totalSpent: 50000 },
        // Hibernating
        { daysSinceLastPurchase: 300, totalOrders: 0, totalSpent: 500 },
      ];

      const segments = await clusterCustomers(users);

      // Deve retornar apenas segmentos com size > 0
      expect(segments.length).toBeGreaterThan(0);
      for (const segment of segments) {
        expect(segment.size).toBeGreaterThan(0);
      }

      // O total de utilizadores nos segmentos deve ser 4
      const totalSize = segments.reduce((sum, s) => sum + s.size, 0);
      expect(totalSize).toBe(4);
    });

    it("deve calcular avgValue correctamente para segmentos com multiplos utilizadores", async () => {
      const users = [
        // Ambos sao champions
        { daysSinceLastPurchase: 5, totalOrders: 10, totalSpent: 60000 },
        { daysSinceLastPurchase: 10, totalOrders: 8, totalSpent: 80000 },
      ];

      const segments = await clusterCustomers(users);
      const championSegment = segments.find((s) => s.id === "champions");

      expect(championSegment).toBeDefined();
      expect(championSegment!.size).toBe(2);
      // avgValue = (60000 + 80000) / 2 = 70000
      expect(championSegment!.avgValue).toBe(70000);
    });

    it("deve filtrar segmentos vazios do resultado", async () => {
      // Apenas um tipo de utilizador
      const users = [{ daysSinceLastPurchase: 5, totalOrders: 10, totalSpent: 60000 }];

      const segments = await clusterCustomers(users);

      // Apenas o segmento com utilizadores deve aparecer
      expect(segments.length).toBe(1);
      expect(segments[0].id).toBe("champions");
    });
  });

  // =============================================
  // getFeatureImportance
  // =============================================
  describe("getFeatureImportance", () => {
    it("deve retornar pesos que somam aproximadamente 1", () => {
      const weights = getFeatureImportance();
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);

      expect(sum).toBeCloseTo(1.0, 2);
    });

    it("deve conter todas as features esperadas", () => {
      const weights = getFeatureImportance();

      expect(weights).toHaveProperty("daysSinceLastPurchase");
      expect(weights).toHaveProperty("totalPurchases");
      expect(weights).toHaveProperty("avgOrderValue");
      expect(weights).toHaveProperty("emailOpenRate");
      expect(weights).toHaveProperty("accountAge");
    });

    it("deve ter daysSinceLastPurchase como feature mais importante", () => {
      const weights = getFeatureImportance();
      const maxWeight = Math.max(...Object.values(weights));

      expect(weights.daysSinceLastPurchase).toBe(maxWeight);
    });

    it("deve ter todos os pesos entre 0 e 1", () => {
      const weights = getFeatureImportance();

      for (const value of Object.values(weights)) {
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    });
  });
});
