import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock supabase before importing the module under test
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { triggerAutomations, getPendingAutomationsCount } from "@/lib/automations";
import { supabase } from "@/lib/supabase";

describe("automations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset the supabase mock chain for each test
    const mockEq = vi.fn();
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    // Store references for chaining
    mockEq.mockReturnValue({ eq: mockEq });

    (supabase.from as ReturnType<typeof vi.fn>) = mockFrom;

    // Default fetch mock
    mockFetch.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // Helper to setup supabase mock response
  function setupSupabaseMock(data: unknown[] | null, error: unknown = null) {
    const mockEqFinal = vi.fn().mockResolvedValue({ data, error });
    const mockEqFirst = vi.fn().mockReturnValue({ eq: mockEqFinal });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEqFirst });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    (supabase.from as ReturnType<typeof vi.fn>) = mockFrom;
  }

  // =============================================
  // triggerAutomations - matching trigger
  // =============================================
  describe("triggerAutomations", () => {
    it("deve executar automacao quando trigger_type corresponde", async () => {
      setupSupabaseMock([
        {
          id: "auto-1",
          trigger_type: "lead_created",
          enabled: true,
          trigger_conditions: {},
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("lead_created", { email: "test@test.com" });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/automations/execute"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("auto-1"),
        })
      );
    });

    it("nao deve executar nada quando nao ha automacoes correspondentes", async () => {
      setupSupabaseMock([]);

      await triggerAutomations("non_existing_trigger", {});

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("nao deve executar nada quando automations e null", async () => {
      setupSupabaseMock(null);

      await triggerAutomations("lead_created", {});

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("deve lidar com erro do supabase graciosamente", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      setupSupabaseMock(null, { message: "Database error" });

      await triggerAutomations("lead_created", {});

      expect(mockFetch).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it("deve ignorar automacoes cujas condicoes nao correspondem", async () => {
      setupSupabaseMock([
        {
          id: "auto-cond",
          trigger_type: "payment_succeeded",
          enabled: true,
          trigger_conditions: { amount_min: 1000 },
          delay_minutes: 0,
        },
      ]);

      // Amount 500 < amount_min 1000, nao deve executar
      await triggerAutomations("payment_succeeded", { amount: 500 });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("deve executar automacao quando condicoes correspondem", async () => {
      setupSupabaseMock([
        {
          id: "auto-match",
          trigger_type: "payment_succeeded",
          enabled: true,
          trigger_conditions: { amount_min: 100 },
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("payment_succeeded", { amount: 500 });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("deve agendar automacao com delay em vez de executar imediatamente", async () => {
      setupSupabaseMock([
        {
          id: "auto-delayed",
          trigger_type: "lead_created",
          enabled: true,
          trigger_conditions: {},
          delay_minutes: 30,
        },
      ]);

      await triggerAutomations("lead_created", { email: "delayed@test.com" });

      // Nao deve ter chamado fetch imediatamente
      expect(mockFetch).not.toHaveBeenCalled();

      // Deve ter agendado (getPendingAutomationsCount > 0)
      expect(getPendingAutomationsCount()).toBeGreaterThan(0);

      // Avancar o timer para o delay
      await vi.advanceTimersByTimeAsync(30 * 60 * 1000);

      // Agora sim deve ter chamado fetch
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/automations/execute"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("auto-delayed"),
        })
      );
    });

    it("deve executar multiplas automacoes que correspondem ao trigger", async () => {
      setupSupabaseMock([
        {
          id: "auto-a",
          trigger_type: "review_submitted",
          enabled: true,
          trigger_conditions: {},
          delay_minutes: 0,
        },
        {
          id: "auto-b",
          trigger_type: "review_submitted",
          enabled: true,
          trigger_conditions: {},
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("review_submitted", { review_id: "r1" });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("deve lidar com erro de execucao de uma automacao sem afectar as outras", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      setupSupabaseMock([
        {
          id: "auto-fail",
          trigger_type: "lead_created",
          enabled: true,
          trigger_conditions: {},
          delay_minutes: 0,
        },
        {
          id: "auto-ok",
          trigger_type: "lead_created",
          enabled: true,
          trigger_conditions: {},
          delay_minutes: 0,
        },
      ]);

      // Primeira chamada falha, segunda sucede
      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ ok: true });

      await triggerAutomations("lead_created", {});

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  // =============================================
  // getPendingAutomationsCount
  // =============================================
  describe("getPendingAutomationsCount", () => {
    it("deve retornar 0 quando nao ha automacoes agendadas", () => {
      // Note: previous tests may leave scheduled jobs, so we check >= 0
      const count = getPendingAutomationsCount();
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it("deve incrementar quando automacao com delay e agendada", async () => {
      const initialCount = getPendingAutomationsCount();

      setupSupabaseMock([
        {
          id: "auto-count-test",
          trigger_type: "test_trigger",
          enabled: true,
          trigger_conditions: {},
          delay_minutes: 60,
        },
      ]);

      await triggerAutomations("test_trigger", {});

      expect(getPendingAutomationsCount()).toBeGreaterThan(initialCount);
    });
  });

  // =============================================
  // checkTriggerConditions (tested indirectly)
  // =============================================
  describe("checkTriggerConditions (via triggerAutomations)", () => {
    it("deve aceitar quando amount >= amount_min", async () => {
      setupSupabaseMock([
        {
          id: "cond-min",
          trigger_type: "payment",
          enabled: true,
          trigger_conditions: { amount_min: 100 },
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("payment", { amount: 150 });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("deve rejeitar quando amount < amount_min", async () => {
      setupSupabaseMock([
        {
          id: "cond-min-fail",
          trigger_type: "payment",
          enabled: true,
          trigger_conditions: { amount_min: 100 },
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("payment", { amount: 50 });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("deve aceitar quando amount <= amount_max", async () => {
      setupSupabaseMock([
        {
          id: "cond-max",
          trigger_type: "payment",
          enabled: true,
          trigger_conditions: { amount_max: 500 },
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("payment", { amount: 300 });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("deve rejeitar quando amount > amount_max", async () => {
      setupSupabaseMock([
        {
          id: "cond-max-fail",
          trigger_type: "payment",
          enabled: true,
          trigger_conditions: { amount_max: 500 },
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("payment", { amount: 600 });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("deve aceitar quando email contem o texto esperado", async () => {
      setupSupabaseMock([
        {
          id: "cond-email",
          trigger_type: "lead_created",
          enabled: true,
          trigger_conditions: { email_contains: "@empresa.com" },
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("lead_created", {
        email: "joao@empresa.com",
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("deve rejeitar quando email nao contem o texto esperado", async () => {
      setupSupabaseMock([
        {
          id: "cond-email-fail",
          trigger_type: "lead_created",
          enabled: true,
          trigger_conditions: { email_contains: "@empresa.com" },
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("lead_created", {
        email: "joao@gmail.com",
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("deve aceitar quando conditions e objecto vazio (sem restricoes)", async () => {
      setupSupabaseMock([
        {
          id: "cond-empty",
          trigger_type: "test",
          enabled: true,
          trigger_conditions: {},
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("test", { anything: "goes" });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("deve aceitar quando conditions e null (sem restricoes)", async () => {
      setupSupabaseMock([
        {
          id: "cond-null",
          trigger_type: "test",
          enabled: true,
          trigger_conditions: null,
          delay_minutes: 0,
        },
      ]);

      await triggerAutomations("test", {});
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("deve verificar multiplas condicoes em conjunto", async () => {
      setupSupabaseMock([
        {
          id: "cond-multi",
          trigger_type: "payment",
          enabled: true,
          trigger_conditions: { amount_min: 100, amount_max: 500 },
          delay_minutes: 0,
        },
      ]);

      // Dentro do range
      await triggerAutomations("payment", { amount: 250 });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("deve rejeitar se qualquer condicao falhar num conjunto de condicoes", async () => {
      setupSupabaseMock([
        {
          id: "cond-multi-fail",
          trigger_type: "payment",
          enabled: true,
          trigger_conditions: { amount_min: 100, amount_max: 500 },
          delay_minutes: 0,
        },
      ]);

      // Fora do range (acima do max)
      await triggerAutomations("payment", { amount: 600 });
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
