import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockCookieGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: (...args: unknown[]) => mockCookieGet(...args),
  }),
}));

const mockFrom = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createGetRequest() {
  return new NextRequest("http://localhost:3000/api/favoritos", {
    method: "GET",
  });
}

function createPostRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/favoritos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function createDeleteRequest(params: Record<string, string> = {}) {
  const url = new URL("http://localhost:3000/api/favoritos");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url.toString(), { method: "DELETE" });
}

function createSelectChain(resolvedValue: { data: unknown; error: unknown }) {
  return {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          then: (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
            Promise.resolve(resolvedValue).then(resolve, reject),
        }),
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({
              then: (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
                Promise.resolve(resolvedValue).then(resolve, reject),
            }),
          }),
        }),
      }),
    }),
  };
}

function createInsertChain(resolvedValue: { error: unknown }) {
  return {
    insert: vi.fn().mockReturnValue({
      then: (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
        Promise.resolve(resolvedValue).then(resolve, reject),
    }),
  };
}

function createDeleteChain(resolvedValue: { error: unknown }) {
  return {
    delete: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            then: (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
              Promise.resolve(resolvedValue).then(resolve, reject),
          }),
        }),
      }),
    }),
  };
}

// ---------------------------------------------------------------------------
// Tests - GET
// ---------------------------------------------------------------------------
describe("GET /api/favoritos", () => {
  let GET: typeof import("@/app/api/favoritos/route").GET;

  beforeEach(async () => {
    vi.resetModules();

    vi.doMock("next/headers", () => ({
      cookies: vi.fn().mockResolvedValue({
        get: (...args: unknown[]) => mockCookieGet(...args),
      }),
    }));

    vi.doMock("@/lib/supabase", () => ({
      supabase: {
        from: (...args: unknown[]) => mockFrom(...args),
      },
    }));

    const routeModule = await import("@/app/api/favoritos/route");
    GET = routeModule.GET;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar lista vazia quando utilizador nao autenticado", async () => {
    mockCookieGet.mockReturnValue(undefined);

    const request = createGetRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.favoritos).toEqual([]);
  });

  it("deve retornar favoritos quando utilizador autenticado", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    const mockFavoritos = [
      { id: "1", item_id: "cav-1", item_type: "cavalo", created_at: "2025-01-01" },
    ];

    mockFrom.mockReturnValue(createSelectChain({ data: mockFavoritos, error: null }));

    const request = createGetRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.favoritos).toEqual(mockFavoritos);
  });

  it("deve retornar lista vazia quando Supabase retorna erro", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    mockFrom.mockReturnValue(createSelectChain({ data: null, error: { message: "DB error" } }));

    const request = createGetRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.favoritos).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Tests - POST
// ---------------------------------------------------------------------------
describe("POST /api/favoritos", () => {
  let POST: typeof import("@/app/api/favoritos/route").POST;

  beforeEach(async () => {
    vi.resetModules();

    vi.doMock("next/headers", () => ({
      cookies: vi.fn().mockResolvedValue({
        get: (...args: unknown[]) => mockCookieGet(...args),
      }),
    }));

    vi.doMock("@/lib/supabase", () => ({
      supabase: {
        from: (...args: unknown[]) => mockFrom(...args),
      },
    }));

    const routeModule = await import("@/app/api/favoritos/route");
    POST = routeModule.POST;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar 401 quando utilizador nao autenticado", async () => {
    mockCookieGet.mockReturnValue(undefined);

    const request = createPostRequest({ item_id: "cav-1", item_type: "cavalo" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain("autenticado");
  });

  it("deve retornar 400 quando item_id em falta", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    const request = createPostRequest({ item_type: "cavalo" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("obrigatorios");
  });

  it("deve retornar 400 quando item_type em falta", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    const request = createPostRequest({ item_id: "cav-1" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("obrigatorios");
  });

  it("deve retornar sucesso quando favorito ja existe", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    // First call: check existence - returns existing record
    mockFrom.mockReturnValue(createSelectChain({ data: { id: "existing-1" }, error: null }));

    const request = createPostRequest({ item_id: "cav-1", item_type: "cavalo" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("favoritos");
  });

  it("deve adicionar novo favorito com sucesso", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    // First call: check existence - returns null (not found)
    // Second call: insert
    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return createSelectChain({ data: null, error: null });
      }
      return createInsertChain({ error: null });
    });

    const request = createPostRequest({ item_id: "cav-1", item_type: "cavalo" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("deve retornar 500 quando insert falha", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return createSelectChain({ data: null, error: null });
      }
      return createInsertChain({ error: { message: "Insert failed" } });
    });

    const request = createPostRequest({ item_id: "cav-1", item_type: "cavalo" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("favorito");
  });
});

// ---------------------------------------------------------------------------
// Tests - DELETE
// ---------------------------------------------------------------------------
describe("DELETE /api/favoritos", () => {
  let DELETE: typeof import("@/app/api/favoritos/route").DELETE;

  beforeEach(async () => {
    vi.resetModules();

    vi.doMock("next/headers", () => ({
      cookies: vi.fn().mockResolvedValue({
        get: (...args: unknown[]) => mockCookieGet(...args),
      }),
    }));

    vi.doMock("@/lib/supabase", () => ({
      supabase: {
        from: (...args: unknown[]) => mockFrom(...args),
      },
    }));

    const routeModule = await import("@/app/api/favoritos/route");
    DELETE = routeModule.DELETE;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar 401 quando utilizador nao autenticado", async () => {
    mockCookieGet.mockReturnValue(undefined);

    const request = createDeleteRequest({ item_id: "cav-1", item_type: "cavalo" });
    const response = await DELETE(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain("autenticado");
  });

  it("deve retornar 400 quando parametros em falta", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    const request = createDeleteRequest({});
    const response = await DELETE(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("obrigatorios");
  });

  it("deve remover favorito com sucesso", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    mockFrom.mockReturnValue(createDeleteChain({ error: null }));

    const request = createDeleteRequest({ item_id: "cav-1", item_type: "cavalo" });
    const response = await DELETE(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("deve retornar 500 quando delete falha", async () => {
    mockCookieGet.mockReturnValue({ value: "user@teste.pt" });

    mockFrom.mockReturnValue(createDeleteChain({ error: { message: "Delete failed" } }));

    const request = createDeleteRequest({ item_id: "cav-1", item_type: "cavalo" });
    const response = await DELETE(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("favorito");
  });
});
