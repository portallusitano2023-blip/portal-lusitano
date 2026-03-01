import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("@/lib/supabase-admin", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createGetRequest(params: Record<string, string> = {}) {
  const url = new URL("http://localhost:3000/api/cavalos");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url.toString(), { method: "GET" });
}

/** Cria uma chain mockada do Supabase com resposta configuravel */
function createSupabaseChain(resolvedValue: { data: unknown; error: unknown }) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: vi.fn((resolve: (v: unknown) => void) => resolve(resolvedValue)),
  };
  // Make the chain thenable so await works
  return {
    ...chain,
    then: (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
      Promise.resolve(resolvedValue).then(resolve, reject),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("GET /api/cavalos", () => {
  let GET: typeof import("@/app/api/cavalos/route").GET;

  beforeEach(async () => {
    vi.resetModules();

    const mockCavalos = [
      {
        id: "1",
        nome: "Fenomeno",
        preco: 15000,
        sexo: "macho",
        regiao: "Alentejo",
        status: "active",
      },
      {
        id: "2",
        nome: "Estrela",
        preco: 20000,
        sexo: "femea",
        regiao: "Ribatejo",
        status: "active",
      },
    ];

    vi.doMock("@/lib/supabase-admin", () => ({
      supabase: {
        from: vi.fn().mockReturnValue(createSupabaseChain({ data: mockCavalos, error: null })),
      },
    }));

    const routeModule = await import("@/app/api/cavalos/route");
    GET = routeModule.GET;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar lista de cavalos sem filtros", async () => {
    const request = createGetRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.cavalos).toBeDefined();
    expect(data.cavalos).toHaveLength(2);
  });

  it("deve aplicar filtro de sexo", async () => {
    const request = createGetRequest({ sexo: "macho" });
    const response = await GET(request);

    expect(response.status).toBe(200);

    const { supabase } = await import("@/lib/supabase-admin");
    const chain = vi.mocked(supabase.from).mock.results[0]?.value;
    expect(chain.eq).toHaveBeenCalledWith("sexo", "macho");
  });

  it("deve ignorar filtro sexo='todos'", async () => {
    const request = createGetRequest({ sexo: "todos" });
    const response = await GET(request);

    expect(response.status).toBe(200);

    const { supabase } = await import("@/lib/supabase-admin");
    const chain = vi.mocked(supabase.from).mock.results[0]?.value;
    // eq should be called for status but NOT for sexo="todos"
    const eqCalls = chain.eq.mock.calls;
    const sexoCalls = eqCalls.filter((call: string[]) => call[0] === "sexo");
    expect(sexoCalls).toHaveLength(0);
  });

  it("deve aplicar filtro de regiao", async () => {
    const request = createGetRequest({ regiao: "Alentejo" });
    const response = await GET(request);

    expect(response.status).toBe(200);

    const { supabase } = await import("@/lib/supabase-admin");
    const chain = vi.mocked(supabase.from).mock.results[0]?.value;
    expect(chain.eq).toHaveBeenCalledWith("regiao", "Alentejo");
  });

  it("deve aplicar filtros de preco minimo e maximo", async () => {
    const request = createGetRequest({ precoMin: "10000", precoMax: "25000" });
    const response = await GET(request);

    expect(response.status).toBe(200);

    const { supabase } = await import("@/lib/supabase-admin");
    const chain = vi.mocked(supabase.from).mock.results[0]?.value;
    expect(chain.gte).toHaveBeenCalledWith("preco", 10000);
    expect(chain.lte).toHaveBeenCalledWith("preco", 25000);
  });

  it("deve aplicar filtro de pesquisa textual", async () => {
    const request = createGetRequest({ search: "Fenomeno" });
    const response = await GET(request);

    expect(response.status).toBe(200);

    const { supabase } = await import("@/lib/supabase-admin");
    const chain = vi.mocked(supabase.from).mock.results[0]?.value;
    expect(chain.or).toHaveBeenCalledWith("nome.ilike.%Fenomeno%,descricao.ilike.%Fenomeno%");
  });

  it("deve retornar 500 quando Supabase retorna erro", async () => {
    vi.resetModules();

    vi.doMock("@/lib/supabase-admin", () => ({
      supabase: {
        from: vi.fn().mockReturnValue(
          createSupabaseChain({
            data: null,
            error: { message: "Database error" },
          })
        ),
      },
    }));

    const routeModule = await import("@/app/api/cavalos/route");
    const request = createGetRequest();
    const response = await routeModule.GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Erro ao buscar cavalos");
  });

  it("deve aplicar filtro de disciplina", async () => {
    const request = createGetRequest({ disciplina: "dressage" });
    const response = await GET(request);

    expect(response.status).toBe(200);

    const { supabase } = await import("@/lib/supabase-admin");
    const chain = vi.mocked(supabase.from).mock.results[0]?.value;
    expect(chain.contains).toHaveBeenCalledWith("disciplinas", ["dressage"]);
  });

  it("deve ignorar filtro disciplina='todas'", async () => {
    const request = createGetRequest({ disciplina: "todas" });
    const response = await GET(request);

    expect(response.status).toBe(200);

    const { supabase } = await import("@/lib/supabase-admin");
    const chain = vi.mocked(supabase.from).mock.results[0]?.value;
    expect(chain.contains).not.toHaveBeenCalled();
  });
});
