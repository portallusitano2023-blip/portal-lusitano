import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Store original modules for restoration
const originalEnv = process.env;

// Mock external dependencies before importing the route
vi.mock("@/lib/resend", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true, id: "test-id" }),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      upsert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

describe("POST /api/ebook-gratis/subscribe - Validation Tests", () => {
  let POST: typeof import("@/app/api/ebook-gratis/subscribe/route").POST;

  beforeEach(async () => {
    vi.resetModules();
    // Re-import the module to reset the rate limiter
    const module = await import("@/app/api/ebook-gratis/subscribe/route");
    POST = module.POST;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: object, ip = "test-ip-" + Math.random()) => {
    return new NextRequest("http://localhost:3000/api/ebook-gratis/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify(body),
    });
  };

  it("should return 400 if email is missing", async () => {
    const request = createRequest({ nome: "Test User" });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Email e nome são obrigatórios");
  });

  it("should return 400 if nome is missing", async () => {
    const request = createRequest({ email: "test@example.com" });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Email e nome são obrigatórios");
  });

  it("should return 400 for invalid email format", async () => {
    const request = createRequest({ email: "invalid-email", nome: "Test User" });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Por favor, insere um email válido");
  });

  it("should return 400 for email without valid TLD", async () => {
    const request = createRequest({ email: "test@example", nome: "Test User" });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Por favor, insere um email válido");
  });

  it("should return 400 if nome exceeds max length", async () => {
    const longName = "a".repeat(101);
    const request = createRequest({ email: "test@example.com", nome: longName });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Dados inválidos");
  });

  it("should return 400 if email exceeds max length", async () => {
    const longEmail = "a".repeat(256) + "@example.com";
    const request = createRequest({ email: longEmail, nome: "Test User" });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Dados inválidos");
  });

  it("should return 400 for disposable email domains", async () => {
    const disposableEmails = [
      "test@tempmail.com",
      "test@throwaway.com",
      "test@mailinator.com",
      "test@guerrillamail.com",
      "test@10minutemail.com",
    ];

    for (const email of disposableEmails) {
      const request = createRequest({ email, nome: "Test User" });
      const response = await POST(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Por favor, insere um email válido");
    }
  });

  it("should successfully process valid subscription", async () => {
    const request = createRequest({
      email: "test@example.com",
      nome: "Test User",
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe("Email enviado com sucesso!");
  });

  it("should handle empty body gracefully", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/ebook-gratis/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "unique-ip-" + Math.random(),
        },
        body: JSON.stringify({}),
      }
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
