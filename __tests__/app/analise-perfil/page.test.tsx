import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

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
  usePathname: () => "/analise-perfil",
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      analise_perfil: {
        loading: "A carregar...",
        intro_title: "Descubra o seu perfil equestre",
        intro_subtitle: "Análise personalizada das suas necessidades",
        start_quiz: "Iniciar Questionário",
        question_of: "de",
        next: "Próxima",
        back: "Voltar",
        finish: "Finalizar",
        your_profile: "O Seu Perfil",
        repeat_analysis: "Repetir Análise",
        save_result: "Guardar Resultado",
        download_pdf: "Download PDF",
        download_badge: "Download Badge",
        share: "Partilhar",
        tab_perfil: "Perfil",
        tab_cavalo: "Cavalo Ideal",
        tab_custos: "Custos",
        tab_cronograma: "Cronograma",
        tab_analise: "Análise",
        tab_proximos: "Próximos Passos",
      },
    },
  }),
}));

// Mock the main quiz logic hook
const mockQuizLogic = {
  showIntro: true,
  showResult: false,
  startQuiz: vi.fn(),
  resetQuiz: vi.fn(),
  quizRef: { current: null },
  questions: [
    {
      id: 1,
      text: "Qual é o seu nível de experiência?",
      options: ["Iniciante", "Intermédio", "Avançado"],
    },
    { id: 2, text: "Qual é o seu objetivo?", options: ["Lazer", "Competição", "Reprodução"] },
  ],
  currentQuestion: 0,
  canUse: true,
  isSubscribed: false,
  freeUsesLeft: 3,
  requiresAuth: false,
  accessLoading: false,
  handleAnswer: vi.fn(),
  goBack: vi.fn(),
  result: null,
  scorePercentages: {},
  saved: false,
  copied: false,
  badgeRef: { current: null },
  saveResult: vi.fn(),
  downloadPDF: vi.fn(),
  downloadBadge: vi.fn(),
  shareWhatsApp: vi.fn(),
  shareFacebook: vi.fn(),
  shareInstagram: vi.fn(),
  copyShareLink: vi.fn(),
  radarData: [],
  selectedTab: "perfil",
  setSelectedTab: vi.fn(),
  answerDetails: [],
  calculateConfidence: vi.fn().mockReturnValue(85),
};

vi.mock("@/components/analise-perfil/useQuizLogic", () => ({
  useQuizLogic: () => mockQuizLogic,
}));

vi.mock("@/components/analise-perfil/IntroSection", () => ({
  default: ({ onStart }: { onStart: () => void }) => (
    <div data-testid="intro-section">
      <h1>Descubra o seu perfil equestre</h1>
      <button onClick={onStart}>Iniciar Questionário</button>
    </div>
  ),
}));

vi.mock("@/components/analise-perfil/QuizSection", () => {
  const MockQuizSection = React.forwardRef(
    (
      {
        questions,
        currentQuestion,
        onAnswer,
        onBack,
        onReset,
      }: {
        questions: { text: string; options: string[] }[];
        currentQuestion: number;
        onAnswer: (answer: string) => void;
        onBack: () => void;
        onReset: () => void;
      },
      ref
    ) => (
      <div data-testid="quiz-section" ref={ref as React.RefObject<HTMLDivElement>}>
        <p>Pergunta {currentQuestion + 1}</p>
        <p>{questions[currentQuestion]?.text}</p>
        {questions[currentQuestion]?.options.map((opt: string) => (
          <button key={opt} onClick={() => onAnswer(opt)}>
            {opt}
          </button>
        ))}
        {currentQuestion > 0 && <button onClick={onBack}>Voltar</button>}
        <button onClick={onReset}>Reset</button>
      </div>
    )
  );
  MockQuizSection.displayName = "MockQuizSection";
  return { default: MockQuizSection };
});

vi.mock("@/components/analise-perfil/ResultHeader", () => ({
  default: ({ result }: { result: { perfil: string; pontuacao: number } }) => (
    <div data-testid="result-header">
      <h2>O Seu Perfil</h2>
      <p>Perfil: {result.perfil}</p>
      <p>Pontuação: {result.pontuacao}</p>
    </div>
  ),
}));

vi.mock("@/components/analise-perfil/ScoreDistribution", () => ({
  default: () => <div data-testid="score-distribution">Score Distribution</div>,
}));

vi.mock("@/components/analise-perfil/ResultTabs", () => ({
  default: ({
    selectedTab,
    onSelectTab,
  }: {
    selectedTab: string;
    onSelectTab: (tab: string) => void;
  }) => (
    <div data-testid="result-tabs">
      <button
        onClick={() => onSelectTab("perfil")}
        className={selectedTab === "perfil" ? "active" : ""}
      >
        Perfil
      </button>
      <button
        onClick={() => onSelectTab("cavalo")}
        className={selectedTab === "cavalo" ? "active" : ""}
      >
        Cavalo Ideal
      </button>
      <button
        onClick={() => onSelectTab("custos")}
        className={selectedTab === "custos" ? "active" : ""}
      >
        Custos
      </button>
    </div>
  ),
}));

vi.mock("@/components/analise-perfil/tabs/ProfileTab", () => ({
  default: ({ result }: { result: { perfil: string } }) => (
    <div data-testid="profile-tab">Profile: {result.perfil}</div>
  ),
}));

vi.mock("@/components/analise-perfil/tabs/HorseTab", () => ({
  default: () => <div data-testid="horse-tab">Horse Recommendations</div>,
}));

vi.mock("@/components/analise-perfil/tabs/CostsTab", () => ({
  default: () => <div data-testid="costs-tab">Cost Analysis</div>,
}));

vi.mock("@/components/analise-perfil/tabs/TimelineTab", () => ({
  default: () => <div data-testid="timeline-tab">Timeline</div>,
}));

vi.mock("@/components/analise-perfil/tabs/AnalysisTab", () => ({
  default: () => <div data-testid="analysis-tab">Analysis Details</div>,
}));

vi.mock("@/components/analise-perfil/tabs/NextStepsTab", () => ({
  default: () => <div data-testid="nextsteps-tab">Next Steps</div>,
}));

vi.mock("lucide-react", () => ({
  RotateCcw: (props: Record<string, unknown>) => <svg data-testid="icon-rotate" {...props} />,
  ArrowLeft: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-left" {...props} />,
  ChevronRight: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-right" {...props} />
  ),
  Download: (props: Record<string, unknown>) => <svg data-testid="icon-download" {...props} />,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------
import AnalisePerfil from "@/app/analise-perfil/page";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("AnalisePerfil", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuizLogic.showIntro = true;
    mockQuizLogic.showResult = false;
    mockQuizLogic.result = null;
  });

  it("renders the page component", () => {
    render(<AnalisePerfil />);
    // Component should render (Suspense is mocked so fallback won't show)
    expect(screen.getByTestId("intro-section")).toBeInTheDocument();
  });

  it("shows intro section when quiz has not started", () => {
    render(<AnalisePerfil />);
    expect(screen.getByTestId("intro-section")).toBeInTheDocument();
    expect(screen.getByText("Descubra o seu perfil equestre")).toBeInTheDocument();
  });

  it("starts quiz when clicking start button", () => {
    render(<AnalisePerfil />);
    const startButton = screen.getByText("Iniciar Questionário");
    fireEvent.click(startButton);

    expect(mockQuizLogic.startQuiz).toHaveBeenCalled();
  });

  it("shows quiz section when quiz is active", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = false;

    render(<AnalisePerfil />);
    expect(screen.getByTestId("quiz-section")).toBeInTheDocument();
    expect(screen.getByText("Qual é o seu nível de experiência?")).toBeInTheDocument();
  });

  it("shows question options in quiz", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = false;

    render(<AnalisePerfil />);
    expect(screen.getByText("Iniciante")).toBeInTheDocument();
    expect(screen.getByText("Intermédio")).toBeInTheDocument();
    expect(screen.getByText("Avançado")).toBeInTheDocument();
  });

  it("calls handleAnswer when clicking an option", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = false;

    render(<AnalisePerfil />);
    const option = screen.getByText("Iniciante");
    fireEvent.click(option);

    expect(mockQuizLogic.handleAnswer).toHaveBeenCalledWith("Iniciante");
  });

  it("shows result section after completing quiz", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = true;
    mockQuizLogic.result = {
      perfil: "Cavaleiro Iniciante",
      pontuacao: 75,
      descricao: "Perfil adequado para iniciantes",
    };

    render(<AnalisePerfil />);
    expect(screen.getByTestId("result-header")).toBeInTheDocument();
    expect(screen.getByText("O Seu Perfil")).toBeInTheDocument();
  });

  it("displays profile information in results", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = true;
    mockQuizLogic.result = {
      perfil: "Cavaleiro Iniciante",
      pontuacao: 75,
    };

    render(<AnalisePerfil />);
    expect(screen.getByText("Perfil: Cavaleiro Iniciante")).toBeInTheDocument();
    expect(screen.getByText("Pontuação: 75")).toBeInTheDocument();
  });

  it("shows score distribution chart in results", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = true;
    mockQuizLogic.result = { perfil: "Test", pontuacao: 75 };

    render(<AnalisePerfil />);
    expect(screen.getByTestId("score-distribution")).toBeInTheDocument();
  });

  it("shows result tabs for different content sections", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = true;
    mockQuizLogic.result = { perfil: "Test", pontuacao: 75 };

    render(<AnalisePerfil />);
    expect(screen.getByTestId("result-tabs")).toBeInTheDocument();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Cavalo Ideal")).toBeInTheDocument();
    expect(screen.getByText("Custos")).toBeInTheDocument();
  });

  it("displays profile tab content by default", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = true;
    mockQuizLogic.result = { perfil: "Test Profile", pontuacao: 75 };
    mockQuizLogic.selectedTab = "perfil";

    render(<AnalisePerfil />);
    expect(screen.getByTestId("profile-tab")).toBeInTheDocument();
    expect(screen.getByText("Profile: Test Profile")).toBeInTheDocument();
  });

  it("switches to horse tab when clicked", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = true;
    mockQuizLogic.result = { perfil: "Test", pontuacao: 75 };
    mockQuizLogic.selectedTab = "cavalo";

    render(<AnalisePerfil />);
    const horseTab = screen.getByText("Cavalo Ideal");
    fireEvent.click(horseTab);

    expect(mockQuizLogic.setSelectedTab).toHaveBeenCalledWith("cavalo");
  });

  it("shows repeat analysis button in results", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = true;
    mockQuizLogic.result = { perfil: "Test", pontuacao: 75 };

    render(<AnalisePerfil />);
    expect(screen.getByText("Repetir Análise")).toBeInTheDocument();
  });

  it("resets quiz when clicking repeat analysis", () => {
    mockQuizLogic.showIntro = false;
    mockQuizLogic.showResult = true;
    mockQuizLogic.result = { perfil: "Test", pontuacao: 75 };

    render(<AnalisePerfil />);
    const resetButton = screen.getByText("Repetir Análise");
    fireEvent.click(resetButton);

    expect(mockQuizLogic.resetQuiz).toHaveBeenCalled();
  });
});
