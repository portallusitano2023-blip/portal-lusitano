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
  usePathname: () => "/comparador-cavalos",
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      comparador: {
        tool_name: "Comparador de Cavalos",
        tool_subtitle: "Compare até 4 cavalos lado a lado",
        badge: "Ferramenta Profissional",
        title_prefix: "Compare",
        title_accent: "Cavalos Lusitanos",
        intro_quote: "A comparação directa é a chave para uma decisão informada",
        intro_desc: "Analise características, genética, treino e valor",
        start_btn: "Iniciar Comparação",
        feat_radar: "Gráfico Radar",
        feat_radar_desc: "Visualização comparativa",
        feat_table: "Tabela Detalhada",
        feat_table_desc: "Dados lado a lado",
        feat_value: "Análise de Valor",
        feat_value_desc: "Custo-benefício por ponto",
        btn_add: "Adicionar Cavalo",
        btn_analyse: "Analisar Comparação",
        new_comparison: "Nova Comparação",
        placeholder_horse_name: "Nome do cavalo",
        label_age: "Idade",
        label_height: "Altura",
        label_sex: "Sexo",
        label_coat: "Pelagem",
        label_lineage: "Linhagem",
        label_training: "Treino",
        label_conformation: "Conformação",
        label_gaits: "Andamentos",
        label_temperament: "Temperamento",
        label_health: "Saúde",
        label_competitions: "Competições",
        label_price: "Preço",
        label_apsl_reg: "Registo APSL",
        score_total: "Score Total",
        value_per_point: "Valor/Ponto:",
        best_score: "Melhor Score",
        best_value: "Melhor Valor",
        visual_comparison: "Comparação Visual",
        comparative_table: "Tabela Comparativa",
        param_header: "Parâmetro",
        param_age: "Idade",
        param_height: "Altura",
        param_conformation: "Conformação",
        param_gaits: "Andamentos",
        param_temperament: "Temperamento",
        param_health: "Saúde",
        param_price: "Preço",
        total_score: "Score Total",
        value_per_pt: "Valor/Ponto",
        best_quality: "Melhor Qualidade",
        best_cost_benefit: "Melhor Custo-Benefício",
        points: "pontos",
        per_point: "por ponto",
        disclaimer_title: "Aviso:",
        disclaimer_text: "Esta ferramenta é apenas indicativa",
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

vi.mock("@/components/tools/SubscriptionBanner", () => ({
  default: ({ isSubscribed, freeUsesLeft }: { isSubscribed: boolean; freeUsesLeft: number }) => (
    <div data-testid="subscription-banner">
      {isSubscribed ? "Subscribed" : `${freeUsesLeft} uses left`}
    </div>
  ),
}));

vi.mock("@/components/tools/Paywall", () => ({
  default: ({ toolName }: { toolName: string }) => (
    <div data-testid="paywall">Paywall: {toolName}</div>
  ),
}));

vi.mock("@/components/tools/ResultActions", () => ({
  default: ({ onExportPDF, onShare }: { onExportPDF: () => void; onShare: () => void }) => (
    <div data-testid="result-actions">
      <button onClick={onExportPDF}>Export PDF</button>
      <button onClick={onShare}>Share</button>
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Scale: (props: Record<string, unknown>) => <svg data-testid="icon-scale" {...props} />,
  ArrowLeft: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-left" {...props} />,
  Plus: (props: Record<string, unknown>) => <svg data-testid="icon-plus" {...props} />,
  X: (props: Record<string, unknown>) => <svg data-testid="icon-x" {...props} />,
  Trophy: (props: Record<string, unknown>) => <svg data-testid="icon-trophy" {...props} />,
  Euro: (props: Record<string, unknown>) => <svg data-testid="icon-euro" {...props} />,
  Crown: (props: Record<string, unknown>) => <svg data-testid="icon-crown" {...props} />,
  Activity: (props: Record<string, unknown>) => <svg data-testid="icon-activity" {...props} />,
  TrendingUp: (props: Record<string, unknown>) => <svg data-testid="icon-trending-up" {...props} />,
  BarChart3: (props: Record<string, unknown>) => <svg data-testid="icon-barchart" {...props} />,
  ChevronRight: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-right" {...props} />
  ),
  RefreshCw: (props: Record<string, unknown>) => <svg data-testid="icon-refresh" {...props} />,
  Check: (props: Record<string, unknown>) => <svg data-testid="icon-check" {...props} />,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------
import ComparadorCavalosPage from "@/app/comparador-cavalos/page";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("ComparadorCavalosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page with header", () => {
    render(<ComparadorCavalosPage />);
    const header = screen.getByText("Comparador de Cavalos");
    expect(header).toBeInTheDocument();
  });

  it("shows intro section on initial load", () => {
    render(<ComparadorCavalosPage />);
    expect(screen.getByText("Compare")).toBeInTheDocument();
    expect(screen.getByText("Cavalos Lusitanos")).toBeInTheDocument();
    expect(screen.getByText(/A comparação directa é a chave/)).toBeInTheDocument();
  });

  it("shows feature cards in intro", () => {
    render(<ComparadorCavalosPage />);
    expect(screen.getByText("Gráfico Radar")).toBeInTheDocument();
    expect(screen.getByText("Tabela Detalhada")).toBeInTheDocument();
    expect(screen.getByText("Análise de Valor")).toBeInTheDocument();
  });

  it("starts comparison when clicking start button", () => {
    render(<ComparadorCavalosPage />);
    const startButton = screen.getByText("Iniciar Comparação");
    fireEvent.click(startButton);

    // Should hide intro and show comparison form
    const remainingStartButtons = screen.queryAllByText("Iniciar Comparação");
    expect(remainingStartButtons.length).toBe(0);
  });

  it("shows subscription banner after starting", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));
    expect(screen.getByTestId("subscription-banner")).toBeInTheDocument();
  });

  it("shows horse selection cards with input fields", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));

    // Should show age, height, sex labels
    expect(screen.getAllByText("Idade").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Altura").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sexo").length).toBeGreaterThan(0);
  });

  it("shows add horse button after starting", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));

    const addButton = screen.getByText("Adicionar Cavalo");
    expect(addButton).toBeInTheDocument();
  });

  it("shows comparison interface with horse inputs", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));

    // Should show multiple input fields for horse data
    const ageLabels = screen.getAllByText("Idade");
    expect(ageLabels.length).toBeGreaterThanOrEqual(2);
  });

  it("shows analyze button when horses are ready", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));
    expect(screen.getByText("Analisar Comparação")).toBeInTheDocument();
  });

  it("shows analysis results after clicking analyze", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));

    const analyzeButton = screen.getByText("Analisar Comparação");
    fireEvent.click(analyzeButton);

    // Should show results
    expect(screen.getByText("Comparação Visual")).toBeInTheDocument();
    expect(screen.getByText("Tabela Comparativa")).toBeInTheDocument();
    expect(screen.getByText("Melhor Qualidade")).toBeInTheDocument();
    expect(screen.getByText("Melhor Custo-Benefício")).toBeInTheDocument();
  });

  it("shows result actions (PDF, Share) after analysis", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));
    fireEvent.click(screen.getByText("Analisar Comparação"));

    expect(screen.getByTestId("result-actions")).toBeInTheDocument();
  });

  it("shows disclaimer in results", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));
    fireEvent.click(screen.getByText("Analisar Comparação"));

    expect(screen.getByText("Aviso:")).toBeInTheDocument();
    expect(screen.getByText(/Esta ferramenta é apenas indicativa/)).toBeInTheDocument();
  });

  it("can reset comparison", () => {
    render(<ComparadorCavalosPage />);
    fireEvent.click(screen.getByText("Iniciar Comparação"));
    fireEvent.click(screen.getByText("Analisar Comparação"));

    // Reset button should appear after analysis
    const resetButton = screen.getByText("Nova Comparação");
    fireEvent.click(resetButton);

    // Should be back at intro
    expect(screen.getByText("Iniciar Comparação")).toBeInTheDocument();
  });

  it("renders link back to home in header", () => {
    render(<ComparadorCavalosPage />);
    const link = screen.getByRole("link", { name: /Portal Lusitano/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
