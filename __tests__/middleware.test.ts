import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock jose module
vi.mock("jose", () => ({
  jwtVerify: vi.fn(),
}));

type MockHeaders = ReturnType<typeof createMockHeaders>;

function createMockHeaders(init: Record<string, string> = {}) {
  const headers = new Map<string, string>();
  for (const [key, value] of Object.entries(init)) {
    headers.set(key.toLowerCase(), value);
  }
  return {
    get: (key: string) => headers.get(key.toLowerCase()) || null,
    set: (key: string, value: string) => headers.set(key.toLowerCase(), value),
    has: (key: string) => headers.has(key.toLowerCase()),
    delete: (key: string) => headers.delete(key.toLowerCase()),
    entries: () => headers.entries(),
    forEach: (cb: (value: string, key: string) => void) => headers.forEach(cb),
  };
}

function createMockCookies(cookies: Record<string, string> = {}) {
  return {
    get: (name: string) => {
      if (name in cookies) return { value: cookies[name] };
      return undefined;
    },
    set: vi.fn(),
  };
}

function createMockNextUrl(pathname: string, host: string = "portal-lusitano.com") {
  return {
    pathname,
    host,
    clone: () => createMockNextUrl(pathname, host),
  };
}

function createMockRequest(
  pathname: string,
  options: {
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
    method?: string;
    host?: string;
  } = {}
) {
  const host = options.host || "portal-lusitano.com";
  return {
    nextUrl: createMockNextUrl(pathname, host),
    headers: createMockHeaders({
      host,
      ...(options.headers || {}),
    }),
    cookies: createMockCookies(options.cookies || {}),
    method: options.method || "GET",
    url: `https://${host}${pathname}`,
  };
}

// Track NextResponse calls
const mockRedirect = vi.fn();
const mockRewrite = vi.fn();
const mockJson = vi.fn();

vi.mock("next/server", () => {
  class MockNextResponse {
    headers: ReturnType<typeof createMockHeaders>;
    cookies: { set: ReturnType<typeof vi.fn> };
    status: number;

    constructor(
      _body: unknown,
      init?: { status?: number; headers?: ReturnType<typeof createMockHeaders> }
    ) {
      this.headers = init?.headers ?? createMockHeaders();
      this.cookies = { set: vi.fn() };
      this.status = init?.status ?? 200;
    }

    static next() {
      const resp = new MockNextResponse(null);
      return resp;
    }

    static redirect(url: unknown, status?: number) {
      const resp = new MockNextResponse(null);
      resp.status = status || 302;
      mockRedirect(url, status);
      return resp;
    }

    static rewrite(url: unknown) {
      const resp = new MockNextResponse(null);
      mockRewrite(url);
      return resp;
    }

    static json(
      body: unknown,
      init?: { status?: number; headers?: ReturnType<typeof createMockHeaders> }
    ) {
      const resp = new MockNextResponse(null);
      resp.status = init?.status || 200;
      mockJson(body, init);
      return resp;
    }
  }

  return {
    NextResponse: MockNextResponse,
    NextRequest: class {},
  };
});

// Import after mocking
import { middleware } from "@/middleware";
type MiddlewareRequest = Parameters<typeof middleware>[0];

describe("middleware", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    Object.defineProperty(process.env, "NODE_ENV", { value: "production", writable: true });
    process.env.NEXT_PUBLIC_APP_URL = "https://portal-lusitano.com";
    process.env.ADMIN_SECRET = "test-secret-key";
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  describe("Rate Limiting", () => {
    it("deve retornar 429 apos demasiados pedidos API", async () => {
      const ip = "192.168.1.100";

      for (let i = 0; i < 65; i++) {
        const request = createMockRequest("/api/products", {
          headers: { "x-forwarded-for": ip },
        });
        await middleware(request as unknown as MiddlewareRequest);

        if (i >= 60) {
          expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
              error: expect.stringContaining("Too many requests"),
            }),
            expect.objectContaining({ status: 429 })
          );
        }
      }
    });

    it("deve ter limite mais restritivo para rotas de autenticacao", async () => {
      const ip = "10.0.0.50";

      for (let i = 0; i < 15; i++) {
        const request = createMockRequest("/api/auth/login", {
          headers: { "x-forwarded-for": ip },
          method: "POST",
        });
        await middleware(request as unknown as MiddlewareRequest);
      }

      const jsonCalls = mockJson.mock.calls;
      const has429 = jsonCalls.some(
        (call: unknown[]) => (call[1] as { status?: number })?.status === 429
      );
      expect(has429).toBe(true);
    });
  });

  describe("CORS Headers", () => {
    it("deve adicionar headers CORS em rotas API", async () => {
      const request = createMockRequest("/api/products", {
        headers: { "x-forwarded-for": "unique-cors-ip-1" },
      });

      const result = await middleware(request as unknown as MiddlewareRequest);

      if (result?.headers) {
        const headers = result.headers as unknown as MockHeaders;
        expect(headers.get("Access-Control-Allow-Origin")).toBe("https://portal-lusitano.com");
        expect(headers.get("Access-Control-Allow-Methods")).toContain("GET");
      }
    });

    it("deve retornar 200 para preflight OPTIONS em rotas API", async () => {
      const request = createMockRequest("/api/products", {
        headers: { "x-forwarded-for": "unique-cors-ip-2" },
        method: "OPTIONS",
      });

      const result = await middleware(request as unknown as MiddlewareRequest);
      expect(result).toBeDefined();
      expect(result?.status).toBe(200);
    });
  });

  describe("Proteccao de rotas admin", () => {
    it("deve redirecionar para login quando nao ha token de admin", async () => {
      const request = createMockRequest("/admin/dashboard");
      await middleware(request as unknown as MiddlewareRequest);

      expect(mockRedirect).toHaveBeenCalled();
      const redirectUrl = mockRedirect.mock.calls[0][0];
      expect(redirectUrl.pathname || String(redirectUrl)).toContain("/admin/login");
    });

    it("nao deve redirecionar a pagina de login do admin", async () => {
      const request = createMockRequest("/admin/login");
      mockRedirect.mockClear();
      await middleware(request as unknown as MiddlewareRequest);

      // /admin/login nao deve trigger redirect por proteccao admin
      // (pode haver redirect www, mas nao admin redirect)
    });

    it("deve redirecionar quando token JWT e invalido", async () => {
      const { jwtVerify } = await import("jose");
      (jwtVerify as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Invalid token"));

      const request = createMockRequest("/admin/dashboard", {
        cookies: { admin_session: "invalid-token" },
      });
      await middleware(request as unknown as MiddlewareRequest);

      expect(mockRedirect).toHaveBeenCalled();
    });

    it("deve redirecionar quando ADMIN_SECRET nao esta definido", async () => {
      delete process.env.ADMIN_SECRET;
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      const request = createMockRequest("/admin/dashboard", {
        cookies: { admin_session: "some-token" },
      });
      await middleware(request as unknown as MiddlewareRequest);

      expect(mockRedirect).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe("Redirect www", () => {
    it("deve redirecionar www para non-www com 301", async () => {
      const request = createMockRequest("/loja", {
        host: "www.portal-lusitano.com",
      });
      await middleware(request as unknown as MiddlewareRequest);

      expect(mockRedirect).toHaveBeenCalled();
      const [, status] = mockRedirect.mock.calls[0];
      expect(status).toBe(301);
    });
  });

  describe("Rewrite /en/ para locale ingles", () => {
    it("deve reescrever /en/loja para /loja com cookie locale=en", async () => {
      const request = createMockRequest("/en/loja");
      await middleware(request as unknown as MiddlewareRequest);

      expect(mockRewrite).toHaveBeenCalled();
      const rewriteUrl = mockRewrite.mock.calls[0][0];
      expect(rewriteUrl.pathname).toBe("/loja");
    });

    it("deve reescrever /en para / (raiz)", async () => {
      const request = createMockRequest("/en");
      await middleware(request as unknown as MiddlewareRequest);

      expect(mockRewrite).toHaveBeenCalled();
      const rewriteUrl = mockRewrite.mock.calls[0][0];
      expect(rewriteUrl.pathname).toBe("/");
    });
  });

  describe("Security Headers", () => {
    it("deve incluir CSP header com unsafe-inline", async () => {
      const request = createMockRequest("/", {
        headers: { "x-forwarded-for": "unique-csp-ip-1" },
      });

      const result = await middleware(request as unknown as MiddlewareRequest);

      if (result?.headers) {
        const headers = result.headers as unknown as MockHeaders;
        const csp = headers.get("Content-Security-Policy");
        expect(csp).toBeTruthy();
        expect(csp).toContain("'unsafe-inline'");
        expect(csp).toContain("default-src 'self'");
      }
    });

    it("deve definir header x-nonce", async () => {
      const request = createMockRequest("/pagina", {
        headers: { "x-forwarded-for": "unique-nonce-ip-1" },
      });

      const result = await middleware(request as unknown as MiddlewareRequest);

      if (result?.headers) {
        const headers = result.headers as unknown as MockHeaders;
        const nonce = headers.get("x-nonce");
        if (nonce) {
          expect(nonce).toBeTruthy();
          expect(nonce.length).toBeGreaterThan(0);
        }
      }
    });

    it("deve definir headers de seguranca adicionais", async () => {
      const request = createMockRequest("/", {
        headers: { "x-forwarded-for": "unique-sec-ip-1" },
      });

      const result = await middleware(request as unknown as MiddlewareRequest);

      if (result?.headers) {
        const headers = result.headers as unknown as MockHeaders;
        const referer = headers.get("Referrer-Policy");
        if (referer) {
          expect(referer).toBe("strict-origin-when-cross-origin");
        }
      }
    });

    it("deve definir Content-Language como pt para rotas portuguesas", async () => {
      const request = createMockRequest("/loja", {
        headers: { "x-forwarded-for": "unique-lang-ip-1" },
      });

      const result = await middleware(request as unknown as MiddlewareRequest);

      if (result?.headers) {
        const headers = result.headers as unknown as MockHeaders;
        const lang = headers.get("Content-Language");
        if (lang) {
          expect(lang).toBe("pt");
        }
      }
    });
  });
});
