import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      ferramentas: {
        badge: "Ferramentas Profissionais",
        title: "Ferramentas para o",
        title_accent: "Lusitano",
        subtitle: "Analise, compare e descubra",
        subtitle_detail: "Ferramentas criadas para o cavalo Lusitano",
        available: "Ferramentas Disponiveis",
        try: "Experimentar",
        data_secure: "Dados Seguros",
        data_secure_desc: "Encriptacao de ponta",
        instant_results: "Resultados Instantaneos",
        instant_results_desc: "Algoritmos optimizados",
        export_pdf: "Exportar PDF",
        export_pdf_desc: "Relatorios profissionais",
        for_lusitanos: "Para Lusitanos",
        for_lusitanos_desc: "Parametros especificos",
        plans_title: "Planos",
        choose_plan: "Escolha o seu plano",
        plans_subtitle: "Comece gratuitamente",
        free: "Gratuito",
        free_subtitle: "Para experimentar",
        pro: "PRO",
        pro_subtitle: "Para profissionais",
        per_month: "EUR/mes",
        cancel_anytime: "Cancele a qualquer momento",
        most_popular: "Mais Popular",
        create_free: "Criar conta gratuita",
        payment_note: "Pagamento seguro via Stripe",
        pro_advantages: "Vantagens PRO",
        pro_title: "Desbloqueie todo o potencial",
        pro_desc: "Acesso ilimitado a todas as ferramentas",
        unlimited: "Ilimitado",
        unlimited_desc: "Usos sem limites",
        pdf_export: "Exportar PDF",
        pdf_export_desc: "Relatorios completos",
        history: "Historico",
        history_desc: "Consulte analises passadas",
        share: "Partilhar",
        share_desc: "Envie resultados por link",
        faq_badge: "Duvidas Frequentes",
        faq_title: "Perguntas Frequentes",
        faq_subtitle: "Respostas rapidas",
        faq_not_found: "Nao encontrou a sua pergunta?",
        faq_see_all: "Ver todas as FAQs",
        reviews_badge: "Avaliacoes",
        reviews_title: "O que dizem os utilizadores",
        reviews_subtitle: "Feedback da comunidade",
        reviews_all: "Todas",
        reviews_based_on: "Baseado em",
        reviews_single: "avaliacao",
        reviews_plural: "avaliacoes",
        reviews_none: "Sem avaliacoes ainda",
        reviews_be_first: "Seja o primeiro a avaliar",
        reviews_leave: "Deixe a sua avaliacao",
        reviews_share: "Partilhe a sua experiencia",
        reviews_tool: "Ferramenta",
        recommends: "Recomenda",
      },
    },
  }),
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => ({
    user: null,
    session: null,
    isLoading: false,
    signOut: vi.fn(),
  }),
}));

vi.mock("@/components/AnimateOnScroll", () => ({
  AnimateOnScroll: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("@/components/ToolReviewForm", () => ({
  default: () => <div data-testid="tool-review-form" />,
}));

vi.mock("lucide-react", () => ({
  Calculator: (props: Record<string, unknown>) => <svg data-testid="icon-calculator" {...props} />,
  BarChart3: (props: Record<string, unknown>) => <svg data-testid="icon-barchart" {...props} />,
  Heart: (props: Record<string, unknown>) => <svg data-testid="icon-heart" {...props} />,
  UserCheck: (props: Record<string, unknown>) => <svg data-testid="icon-usercheck" {...props} />,
  ChevronDown: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-down" {...props} />
  ),
  Crown: (props: Record<string, unknown>) => <svg data-testid="icon-crown" {...props} />,
  Check: (props: Record<string, unknown>) => <svg data-testid="icon-check" {...props} />,
  X: (props: Record<string, unknown>) => <svg data-testid="icon-x" {...props} />,
  Sparkles: (props: Record<string, unknown>) => <svg data-testid="icon-sparkles" {...props} />,
  ArrowRight: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-right" {...props} />,
  Shield: (props: Record<string, unknown>) => <svg data-testid="icon-shield" {...props} />,
  Download: (props: Record<string, unknown>) => <svg data-testid="icon-download" {...props} />,
  History: (props: Record<string, unknown>) => <svg data-testid="icon-history" {...props} />,
  Share2: (props: Record<string, unknown>) => <svg data-testid="icon-share" {...props} />,
  Zap: (props: Record<string, unknown>) => <svg data-testid="icon-zap" {...props} />,
  Star: (props: Record<string, unknown>) => <svg data-testid="icon-star" {...props} />,
  ThumbsUp: (props: Record<string, unknown>) => <svg data-testid="icon-thumbsup" {...props} />,
  User: (props: Record<string, unknown>) => <svg data-testid="icon-user" {...props} />,
  MessageSquare: (props: Record<string, unknown>) => <svg data-testid="icon-message" {...props} />,
  Loader2: (props: Record<string, unknown>) => <svg data-testid="icon-loader" {...props} />,
  CheckCircle: (props: Record<string, unknown>) => (
    <svg data-testid="icon-check-circle" {...props} />
  ),
}));

// Mock global fetch for reviews section
const mockFetch = vi.fn();
global.fetch = mockFetch;
mockFetch.mockResolvedValue({
  ok: true,
  json: async () => ({ reviews: [], stats: { total: 0, media: 0 } }),
});

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------
import FerramentasPage from "@/app/ferramentas/page";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("FerramentasPage", () => {
  it("renders the page title", () => {
    render(<FerramentasPage />);
    expect(screen.getByText("Ferramentas para o")).toBeInTheDocument();
    expect(screen.getByText("Lusitano")).toBeInTheDocument();
  });

  it("renders the badge text", () => {
    render(<FerramentasPage />);
    expect(screen.getByText("Ferramentas Profissionais")).toBeInTheDocument();
  });

  it("renders all 4 tool cards with titles", () => {
    render(<FerramentasPage />);
    // Tool names appear in both card section and reviews section, so use getAllByText
    expect(screen.getAllByText("Calculadora de Valor").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Comparador de Cavalos").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Verificador de Compatibilidade").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Análise de Perfil").length).toBeGreaterThanOrEqual(1);
  });

  it("renders tool card links pointing to correct routes", () => {
    render(<FerramentasPage />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/calculadora-valor");
    expect(hrefs).toContain("/comparador-cavalos");
    expect(hrefs).toContain("/verificador-compatibilidade");
    expect(hrefs).toContain("/analise-perfil");
  });

  it("renders pricing section with free and pro tiers", () => {
    render(<FerramentasPage />);
    expect(screen.getByText("Gratuito")).toBeInTheDocument();
    expect(screen.getByText("PRO")).toBeInTheDocument();
    expect(screen.getByText("Escolha o seu plano")).toBeInTheDocument();
  });

  it("renders FAQ section", () => {
    render(<FerramentasPage />);
    expect(screen.getByText("Perguntas Frequentes")).toBeInTheDocument();
    expect(screen.getByText("As ferramentas são gratuitas?")).toBeInTheDocument();
  });

  it("does not show CheckoutFeedback when no URL params", () => {
    render(<FerramentasPage />);
    // The success/cancelled messages should not be present when no params
    expect(screen.queryByText("Subscricao PRO activada com sucesso!")).not.toBeInTheDocument();
    expect(screen.queryByText(/Pagamento cancelado/)).not.toBeInTheDocument();
  });
});
