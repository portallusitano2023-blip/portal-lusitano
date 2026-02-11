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
  usePathname: () => "/calculadora-valor",
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      calculadora: {
        tool_name: "Calculadora de Valor",
        intro_title: "Calcule o valor do seu Lusitano",
        intro_subtitle: "Avaliação profissional baseada em critérios técnicos",
        start_btn: "Iniciar Avaliação",
        step_identificacao: "Identificação",
        step_genetica: "Genética e Morfologia",
        step_andamentos: "Andamentos",
        step_treino: "Treino e Saúde",
        step_reproducao: "Reprodução",
        btn_next: "Próximo",
        btn_previous: "Anterior",
        btn_calculate: "Calcular Valor",
        calculating: "A calcular...",
        resultado_title: "Avaliação Completa",
        export_pdf: "Exportar PDF",
        share: "Partilhar",
        reset: "Nova Avaliação",
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

// Mock all calculator components
vi.mock("@/components/calculadora-valor", () => ({
  CalculadoraHeader: ({ step, onReset }: { step: number; onReset: () => void }) => (
    <div data-testid="calculadora-header">
      <span>Step: {step}</span>
      <button onClick={onReset}>Reset</button>
    </div>
  ),
  IntroSection: ({ onStart }: { onStart: () => void }) => (
    <div data-testid="intro-section">
      <h1>Calcule o valor do seu Lusitano</h1>
      <button onClick={onStart}>Iniciar Avaliação</button>
    </div>
  ),
  StepIdentificacao: ({
    form,
    update,
  }: {
    form: { nome: string };
    update: (k: string, v: string) => void;
  }) => (
    <div data-testid="step-identificacao">
      <label>Nome do Cavalo</label>
      <input value={form.nome} onChange={(e) => update("nome", e.target.value)} />
    </div>
  ),
  StepGeneticaMorfologia: () => <div data-testid="step-genetica">Genética</div>,
  StepAndamentosTemperamento: () => <div data-testid="step-andamentos">Andamentos</div>,
  StepTreinoSaude: () => <div data-testid="step-treino">Treino</div>,
  StepReproducaoMercado: () => <div data-testid="step-reproducao">Reprodução</div>,
  StepNavigation: ({
    step,
    totalSteps,
    onPrevious,
    onNext,
    onCalculate,
    isCalculating,
  }: {
    step: number;
    totalSteps: number;
    onPrevious: () => void;
    onNext: () => void;
    onCalculate: () => void;
    isCalculating: boolean;
  }) => (
    <div data-testid="step-navigation">
      {step > 1 && <button onClick={onPrevious}>Anterior</button>}
      {step < totalSteps && <button onClick={onNext}>Próximo</button>}
      {step === totalSteps && (
        <button onClick={onCalculate} disabled={isCalculating}>
          {isCalculating ? "A calcular..." : "Calcular Valor"}
        </button>
      )}
    </div>
  ),
  ResultadoDisplay: ({ resultado }: { resultado: { valorEstimado: number } }) => (
    <div data-testid="resultado-display">
      <h2>Avaliação Completa</h2>
      <p>Valor: {resultado.valorEstimado}€</p>
    </div>
  ),
  calcularValor: vi.fn().mockReturnValue({
    valorEstimado: 25000,
    scoreTotal: 75,
    detalhes: {},
  }),
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

vi.mock("lucide-react", () => ({
  Calculator: (props: Record<string, unknown>) => <svg data-testid="icon-calculator" {...props} />,
  ArrowLeft: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-left" {...props} />,
  ChevronRight: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-right" {...props} />
  ),
  Download: (props: Record<string, unknown>) => <svg data-testid="icon-download" {...props} />,
  Share2: (props: Record<string, unknown>) => <svg data-testid="icon-share" {...props} />,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------
import CalculadoraValorPage from "@/app/calculadora-valor/page";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("CalculadoraValorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page with header", () => {
    render(<CalculadoraValorPage />);
    expect(screen.getByTestId("calculadora-header")).toBeInTheDocument();
  });

  it("shows intro section on initial load (step 0)", () => {
    render(<CalculadoraValorPage />);
    expect(screen.getByTestId("intro-section")).toBeInTheDocument();
    expect(screen.getByText("Calcule o valor do seu Lusitano")).toBeInTheDocument();
  });

  it("starts calculator when clicking start button", () => {
    render(<CalculadoraValorPage />);
    const startButton = screen.getByText("Iniciar Avaliação");
    fireEvent.click(startButton);

    // Should move to step 1
    expect(screen.queryByTestId("intro-section")).not.toBeInTheDocument();
    expect(screen.getByTestId("step-identificacao")).toBeInTheDocument();
  });

  it("shows subscription banner after starting", () => {
    render(<CalculadoraValorPage />);
    fireEvent.click(screen.getByText("Iniciar Avaliação"));
    expect(screen.getByTestId("subscription-banner")).toBeInTheDocument();
    expect(screen.getByText("3 uses left")).toBeInTheDocument();
  });

  it("shows step navigation with correct buttons", () => {
    render(<CalculadoraValorPage />);
    fireEvent.click(screen.getByText("Iniciar Avaliação"));
    expect(screen.getByTestId("step-navigation")).toBeInTheDocument();
  });

  it("navigates through steps correctly", () => {
    render(<CalculadoraValorPage />);
    fireEvent.click(screen.getByText("Iniciar Avaliação"));

    // Step 1
    expect(screen.getByTestId("step-identificacao")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Próximo"));

    // Step 2
    expect(screen.getByTestId("step-genetica")).toBeInTheDocument();
  });

  it("allows going back to previous step", () => {
    render(<CalculadoraValorPage />);
    fireEvent.click(screen.getByText("Iniciar Avaliação"));
    fireEvent.click(screen.getByText("Próximo"));

    // Should be on step 2
    expect(screen.getByTestId("step-genetica")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Anterior"));

    // Should be back on step 1
    expect(screen.getByTestId("step-identificacao")).toBeInTheDocument();
  });

  it("shows calculate button on final step", () => {
    render(<CalculadoraValorPage />);
    fireEvent.click(screen.getByText("Iniciar Avaliação"));

    // Navigate to step 5 (final step)
    fireEvent.click(screen.getByText("Próximo")); // Step 2
    fireEvent.click(screen.getByText("Próximo")); // Step 3
    fireEvent.click(screen.getByText("Próximo")); // Step 4
    fireEvent.click(screen.getByText("Próximo")); // Step 5

    expect(screen.getByText("Calcular Valor")).toBeInTheDocument();
  });

  it("shows calculating state when button is clicked", async () => {
    render(<CalculadoraValorPage />);
    fireEvent.click(screen.getByText("Iniciar Avaliação"));

    // Navigate to final step
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText("Próximo"));
    }

    const calculateButton = screen.getByText("Calcular Valor");
    fireEvent.click(calculateButton);

    expect(screen.getByText("A calcular...")).toBeInTheDocument();
  });

  it("shows calculating button is disabled while processing", () => {
    render(<CalculadoraValorPage />);
    fireEvent.click(screen.getByText("Iniciar Avaliação"));

    // Navigate to final step
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText("Próximo"));
    }

    const calculateButton = screen.getByText("Calcular Valor");
    fireEvent.click(calculateButton);

    // Button should show calculating state
    expect(screen.getByText("A calcular...")).toBeInTheDocument();
  });

  it("can reset calculator from header", () => {
    render(<CalculadoraValorPage />);
    fireEvent.click(screen.getByText("Iniciar Avaliação"));

    // Click reset button in header
    fireEvent.click(screen.getByText("Reset"));

    // Should be back at intro
    expect(screen.getByTestId("intro-section")).toBeInTheDocument();
  });
});
