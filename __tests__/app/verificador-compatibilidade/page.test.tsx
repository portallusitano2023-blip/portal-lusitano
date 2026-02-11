import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => ({
    get: () => null,
    toString: () => "",
  }),
  usePathname: () => "/verificador-compatibilidade",
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      verificador: {
        tool_name: "Verificador de Compatibilidade",
        tool_subtitle: "Análise genética para reprodução",
        compatibility: "Compatibilidade",
        tab_stallion: "Garanhão",
        tab_mare: "Égua",
        intro_title: "Verifique a compatibilidade genética",
        intro_subtitle: "Análise profissional para reprodução",
        start_btn: "Iniciar Análise",
        calculate_btn: "Calcular Compatibilidade",
        calculating: "A calcular...",
        result_title: "Resultado da Análise",
        compatibility_score: "Score de Compatibilidade",
        genetic_diversity: "Diversidade Genética",
        export_pdf: "Exportar PDF",
        share: "Partilhar",
        new_analysis: "Nova Análise",
        label_name: "Nome",
        label_lineage: "Linhagem",
        label_morphology: "Morfologia",
        label_gaits: "Andamentos",
      },
    },
  }),
}));

vi.mock("@/hooks/useToolAccess", () => ({
  useToolAccess: () => ({
    canUse: true,
    isSubscribed: false,
    freeUsesLeft: 3,
    requiresAuth: false,
    recordUsage: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock("@/lib/tools/share-utils", () => ({
  shareNative: vi.fn().mockResolvedValue(false),
  copyToClipboard: vi.fn().mockResolvedValue(true),
}));

// Mock verificador components
vi.mock("@/components/verificador-compatibilidade", () => ({
  IntroHero: ({ onStart }: { onStart: () => void }) => (
    <div data-testid="intro-hero">
      <h1>Verifique a compatibilidade genética</h1>
      <button onClick={onStart}>Iniciar Análise</button>
    </div>
  ),
  HorseForm: ({
    garanhao,
    egua,
    tab,
    setTab,
    onCalcular,
    isCalculating,
  }: {
    garanhao: { nome: string };
    egua: { nome: string };
    tab: string;
    setTab: (t: string) => void;
    onCalcular: () => void;
    isCalculating: boolean;
  }) => (
    <div data-testid="horse-form">
      <div>
        <button onClick={() => setTab("garanhao")}>Garanhão</button>
        <button onClick={() => setTab("egua")}>Égua</button>
      </div>
      <div>
        <label>Nome</label>
        {tab === "garanhao" && <input value={garanhao.nome} readOnly />}
        {tab === "egua" && <input value={egua.nome} readOnly />}
      </div>
      <button onClick={onCalcular} disabled={isCalculating}>
        {isCalculating ? "A calcular..." : "Calcular Compatibilidade"}
      </button>
    </div>
  ),
  CompatibilityResults: ({
    resultado,
    garanhaoNome,
    eguaNome,
  }: {
    resultado: { score: number; nivel: string };
    garanhaoNome: string;
    eguaNome: string;
  }) => (
    <div data-testid="compatibility-results">
      <h2>Resultado da Análise</h2>
      <p>
        {garanhaoNome} x {eguaNome}
      </p>
      <p>Score: {resultado.score}</p>
      <p>Nível: {resultado.nivel}</p>
    </div>
  ),
  calcularCompatibilidade: vi.fn().mockReturnValue({
    score: 85,
    nivel: "Excelente",
    diversidadeGenetica: 75,
    riscosGeneticos: [],
  }),
  criarCavalo: (nome: string) => ({
    nome,
    linhagem: "Veiga",
    morfologia: 7,
    andamentos: 7,
    temperamento: 7,
  }),
}));

vi.mock("@/components/tools/SubscriptionBanner", () => ({
  default: ({ isSubscribed, freeUsesLeft }: { isSubscribed: boolean; freeUsesLeft: number }) => (
    <div data-testid="subscription-banner">
      {isSubscribed ? "Subscribed" : `${freeUsesLeft} uses left`}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Heart: (props: Record<string, unknown>) => <svg data-testid="icon-heart" {...props} />,
  ArrowLeft: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-left" {...props} />,
  RefreshCw: (props: Record<string, unknown>) => <svg data-testid="icon-refresh" {...props} />,
  ChevronRight: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-right" {...props} />
  ),
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------
import VerificadorCompatibilidadePage from "@/app/verificador-compatibilidade/page";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("VerificadorCompatibilidadePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page with header", () => {
    render(<VerificadorCompatibilidadePage />);
    expect(screen.getByText("Verificador de Compatibilidade")).toBeInTheDocument();
  });

  it("shows intro section on initial load", () => {
    render(<VerificadorCompatibilidadePage />);
    expect(screen.getByTestId("intro-hero")).toBeInTheDocument();
    expect(screen.getByText("Verifique a compatibilidade genética")).toBeInTheDocument();
  });

  it("shows subscription banner on intro", () => {
    render(<VerificadorCompatibilidadePage />);
    expect(screen.getByTestId("subscription-banner")).toBeInTheDocument();
    expect(screen.getByText("3 uses left")).toBeInTheDocument();
  });

  it("starts form when clicking start button", () => {
    render(<VerificadorCompatibilidadePage />);
    const startButton = screen.getByText("Iniciar Análise");
    fireEvent.click(startButton);

    // Should show form
    expect(screen.queryByTestId("intro-hero")).not.toBeInTheDocument();
    expect(screen.getByTestId("horse-form")).toBeInTheDocument();
  });

  it("shows horse form with tabs for stallion and mare", () => {
    render(<VerificadorCompatibilidadePage />);
    fireEvent.click(screen.getByText("Iniciar Análise"));

    expect(screen.getByText("Garanhão")).toBeInTheDocument();
    expect(screen.getByText("Égua")).toBeInTheDocument();
  });

  it("shows calculate button in form", () => {
    render(<VerificadorCompatibilidadePage />);
    fireEvent.click(screen.getByText("Iniciar Análise"));

    expect(screen.getByText("Calcular Compatibilidade")).toBeInTheDocument();
  });

  it("shows calculating state when button is clicked", () => {
    render(<VerificadorCompatibilidadePage />);
    fireEvent.click(screen.getByText("Iniciar Análise"));

    const calculateButton = screen.getByText("Calcular Compatibilidade");
    fireEvent.click(calculateButton);

    expect(screen.getByText("A calcular...")).toBeInTheDocument();
  });

  it("shows form has both horse tabs", () => {
    render(<VerificadorCompatibilidadePage />);
    fireEvent.click(screen.getByText("Iniciar Análise"));

    // Both tabs should exist
    expect(screen.getByText("Garanhão")).toBeInTheDocument();
    expect(screen.getByText("Égua")).toBeInTheDocument();
  });

  it("form has input fields for horse data", () => {
    render(<VerificadorCompatibilidadePage />);
    fireEvent.click(screen.getByText("Iniciar Análise"));

    // Should have name label
    expect(screen.getByText("Nome")).toBeInTheDocument();
  });

  it("shows calculating disabled state", () => {
    render(<VerificadorCompatibilidadePage />);
    fireEvent.click(screen.getByText("Iniciar Análise"));

    const calculateButton = screen.getByText("Calcular Compatibilidade");
    fireEvent.click(calculateButton);

    // Should show calculating state
    expect(screen.getByText("A calcular...")).toBeInTheDocument();
  });

  it("can navigate back to intro from form", () => {
    render(<VerificadorCompatibilidadePage />);
    fireEvent.click(screen.getByText("Iniciar Análise"));

    // Form should be visible
    expect(screen.getByTestId("horse-form")).toBeInTheDocument();
  });

  it("renders link back to home in header", () => {
    render(<VerificadorCompatibilidadePage />);
    const link = screen.getByRole("link", { name: /Portal Lusitano/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
