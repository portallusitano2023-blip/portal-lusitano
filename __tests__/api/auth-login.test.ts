import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  checkCredentials: vi.fn(),
  createSession: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  authLimiter: {
    check: vi.fn(),
  },
}));

vi.mock("@/lib/schemas", async () => {
  const actual = await vi.importActual("@/lib/schemas");
  return actual;
});

import { checkCredentials, createSession } from "@/lib/auth";
import { authLimiter } from "@/lib/rate-limit";

// Helper to create a mock NextRequest
function createMockRequest(body: Record<string, unknown>) {
  return {
    json: () => Promise.resolve(body),
    headers: new Headers({ "x-forwarded-for": "127.0.0.1" }),
  };
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authLimiter.check).mockResolvedValue(undefined as never);
  });

  it("rejects invalid email format", async () => {
    const { POST } = await import("@/app/api/auth/login/route");
    const req = createMockRequest({ email: "invalid", password: "test" });
    const res = await POST(req as never);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("rejects missing password", async () => {
    const { POST } = await import("@/app/api/auth/login/route");
    const req = createMockRequest({ email: "admin@test.com" });
    const res = await POST(req as never);
    await res.json();
    expect(res.status).toBe(400);
  });

  it("rejects invalid credentials", async () => {
    vi.mocked(checkCredentials).mockReturnValue(false);
    const { POST } = await import("@/app/api/auth/login/route");
    const req = createMockRequest({
      email: "admin@test.com",
      password: "wrong",
    });
    const res = await POST(req as never);
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.error).toContain("inválidas");
  });

  it("succeeds with valid credentials", async () => {
    vi.mocked(checkCredentials).mockReturnValue(true);
    vi.mocked(createSession).mockResolvedValue(undefined as never);
    const { POST } = await import("@/app/api/auth/login/route");
    const req = createMockRequest({
      email: "admin@test.com",
      password: "correct",
    });
    const res = await POST(req as never);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(authLimiter.check).mockRejectedValue(new Error("Rate limited"));
    const { POST } = await import("@/app/api/auth/login/route");
    const req = createMockRequest({
      email: "admin@test.com",
      password: "test",
    });
    const res = await POST(req as never);
    expect(res.status).toBe(429);
  });
});
