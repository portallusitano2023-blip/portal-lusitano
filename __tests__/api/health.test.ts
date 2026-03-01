import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("@/lib/supabase-admin", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("GET /api/health", () => {
  let GET: typeof import("@/app/api/health/route").GET;

  beforeEach(async () => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar status healthy quando base de dados conectada", async () => {
    vi.doMock("@/lib/supabase-admin", () => ({
      supabase: {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ count: 10, error: null }),
        }),
      },
    }));

    const routeModule = await import("@/app/api/health/route");
    GET = routeModule.GET;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.services.database).toBe("connected");
    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeDefined();
    expect(data.environment).toBeDefined();
  });

  it("deve retornar status degraded quando base de dados com erro", async () => {
    vi.doMock("@/lib/supabase-admin", () => ({
      supabase: {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            count: null,
            error: { message: "Connection refused" },
          }),
        }),
      },
    }));

    const routeModule = await import("@/app/api/health/route");
    GET = routeModule.GET;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("degraded");
    expect(data.services.database).toBe("error");
  });

  it("deve retornar status degraded quando base de dados lanca excepcao", async () => {
    vi.doMock("@/lib/supabase-admin", () => ({
      supabase: {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockRejectedValue(new Error("Network failure")),
        }),
      },
    }));

    const routeModule = await import("@/app/api/health/route");
    GET = routeModule.GET;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("degraded");
    expect(data.services.database).toBe("error");
  });

  it("deve retornar status degraded quando count e null sem erro", async () => {
    vi.doMock("@/lib/supabase-admin", () => ({
      supabase: {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ count: null, error: null }),
        }),
      },
    }));

    const routeModule = await import("@/app/api/health/route");
    GET = routeModule.GET;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("degraded");
    expect(data.services.database).toBe("error");
  });

  it("deve incluir timestamp em formato ISO", async () => {
    vi.doMock("@/lib/supabase-admin", () => ({
      supabase: {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ count: 5, error: null }),
        }),
      },
    }));

    const routeModule = await import("@/app/api/health/route");
    GET = routeModule.GET;

    const response = await GET();
    const data = await response.json();

    // Validate ISO timestamp format
    const parsed = new Date(data.timestamp);
    expect(parsed.toISOString()).toBe(data.timestamp);
  });

  it("deve retornar uptime como numero positivo", async () => {
    vi.doMock("@/lib/supabase-admin", () => ({
      supabase: {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ count: 5, error: null }),
        }),
      },
    }));

    const routeModule = await import("@/app/api/health/route");
    GET = routeModule.GET;

    const response = await GET();
    const data = await response.json();

    expect(typeof data.uptime).toBe("number");
    expect(data.uptime).toBeGreaterThanOrEqual(0);
  });
});
