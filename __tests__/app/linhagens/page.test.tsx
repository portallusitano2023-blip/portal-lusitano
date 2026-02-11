import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks — vi.mock calls are hoisted, so we cannot reference outer variables.
// All mock data must be defined inline within the factory functions.
// ---------------------------------------------------------------------------

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      linhagens: {
        back: "Voltar",
        badge: "Patrimonio Genetico",
        title: "Linhagens do Lusitano",
        subtitle: "A historia das grandes familias equestres",
        importance_title: "A Importancia das Linhagens",
        importance_p1: "As linhagens sao familias geneticas distintas",
        importance_p2_prefix: "Existem",
        importance_p2_highlight: "6 Chefes de Linhagem oficiais",
        importance_p2_suffix: "reconhecidos pelo Stud Book Portugues.",
        heads_title: "Os 6 Chefes de Linhagem",
        heads_subtitle: "Fundadores oficiais reconhecidos em 1989",
        main_lineages: "Linhagens Principais",
        other_lineages_title: "Outras Linhagens",
        other_lineages_text: "Existem outras linhagens importantes",
        timeline_title: "Linha do Tempo Historica",
        timeline_subtitle: "1748 ate hoje",
        choose_title: "Como Escolher a Linhagem Ideal",
        choose_step1_title: "Defina o Objetivo",
        choose_step1_desc: "Identifique a disciplina",
        choose_step2_title: "Avalie o Temperamento",
        choose_step2_desc: "Cada linhagem tem carateristicas",
        choose_step3_title: "Consulte Especialistas",
        choose_step3_desc: "Fale com criadores",
        since: "desde",
        lineage_head: "Chefe de Linha",
        lineage_prefix: "Linhagem",
        explore_lineage: "Explorar",
        confidence_label: "Confianca",
        tab_history: "Historia",
        tab_characteristics: "Caracteristicas",
        tab_notable_horses: "Cavalos Notaveis",
        tab_timeline: "Timeline",
        founder: "Fundador",
        history: "Historia",
        key_facts: "Factos-Chave",
        morphology: "Morfologia",
        temperament_label: "Temperamento",
        common_colors: "Cores Comuns",
        aptitudes: "Aptidoes",
        reference_studs: "Coudelarias de Referencia",
        notable_horses_title: "Cavalos Notaveis",
        no_notable_horses: "Nenhum cavalo notavel registado",
        historic_moments: "Momentos Historicos",
        no_timeline: "Nenhum evento registado",
      },
    },
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-left" {...props} />,
  BookOpen: (props: Record<string, unknown>) => <svg data-testid="icon-book-open" {...props} />,
  Calendar: (props: Record<string, unknown>) => <svg data-testid="icon-calendar" {...props} />,
  MapPin: (props: Record<string, unknown>) => <svg data-testid="icon-map-pin" {...props} />,
  Users: (props: Record<string, unknown>) => <svg data-testid="icon-users" {...props} />,
  Award: (props: Record<string, unknown>) => <svg data-testid="icon-award" {...props} />,
  ChevronRight: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-right" {...props} />
  ),
  X: (props: Record<string, unknown>) => <svg data-testid="icon-x" {...props} />,
  Star: (props: Record<string, unknown>) => <svg data-testid="icon-star" {...props} />,
  Dna: (props: Record<string, unknown>) => <svg data-testid="icon-dna" {...props} />,
  Crown: (props: Record<string, unknown>) => <svg data-testid="icon-crown" {...props} />,
  Shield: (props: Record<string, unknown>) => <svg data-testid="icon-shield" {...props} />,
  Landmark: (props: Record<string, unknown>) => <svg data-testid="icon-landmark" {...props} />,
  Heart: (props: Record<string, unknown>) => <svg data-testid="icon-heart" {...props} />,
  Target: (props: Record<string, unknown>) => <svg data-testid="icon-target" {...props} />,
  Clock: (props: Record<string, unknown>) => <svg data-testid="icon-clock" {...props} />,
  Sparkles: (props: Record<string, unknown>) => <svg data-testid="icon-sparkles" {...props} />,
}));

// Import AFTER mocks
import LinhagenPage from "@/app/linhagens/page";

describe("LinhagenPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title", () => {
    render(<LinhagenPage />);
    expect(screen.getByText("Linhagens do Lusitano")).toBeInTheDocument();
  });

  it("renders page subtitle", () => {
    render(<LinhagenPage />);
    expect(screen.getByText("A historia das grandes familias equestres")).toBeInTheDocument();
  });

  it("renders back button", () => {
    render(<LinhagenPage />);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("renders 6 Chefes de Linhagem section", () => {
    render(<LinhagenPage />);
    expect(screen.getByText("Os 6 Chefes de Linhagem")).toBeInTheDocument();
    expect(screen.getByText("Fundadores oficiais reconhecidos em 1989")).toBeInTheDocument();
  });

  it("renders main lineages section", () => {
    render(<LinhagenPage />);
    expect(screen.getByText("Linhagens Principais")).toBeInTheDocument();
  });

  it("renders lineage cards with explore buttons", () => {
    render(<LinhagenPage />);
    const exploreButtons = screen.getAllByText("Explorar");
    expect(exploreButtons.length).toBeGreaterThan(0);
  });

  it("opens modal when lineage card is clicked", () => {
    render(<LinhagenPage />);
    const exploreButtons = screen.getAllByText("Explorar");
    fireEvent.click(exploreButtons[0]);
    // Modal should have tabs - use getAllByText since Historia appears in both tab and content
    expect(screen.getAllByText("Historia").length).toBeGreaterThan(0);
    expect(screen.getByText("Caracteristicas")).toBeInTheDocument();
  });

  it("closes modal when X button is clicked", () => {
    render(<LinhagenPage />);
    const exploreButtons = screen.getAllByText("Explorar");
    fireEvent.click(exploreButtons[0]);
    expect(screen.getAllByText("Historia").length).toBeGreaterThan(0);
    const closeButton = screen.getByTestId("icon-x").parentElement as HTMLElement;
    fireEvent.click(closeButton);
    expect(screen.queryByText("Caracteristicas")).not.toBeInTheDocument();
  });

  it("toggles timeline section when clicked", () => {
    render(<LinhagenPage />);
    const timelineButton = screen.getByText("Linha do Tempo Historica");
    fireEvent.click(timelineButton);
    // Timeline should be visible after click
    const timelineSubtitle = screen.getByText("1748 ate hoje");
    expect(timelineSubtitle).toBeInTheDocument();
  });

  it("renders choosing lineage guide section", () => {
    render(<LinhagenPage />);
    expect(screen.getByText("Como Escolher a Linhagem Ideal")).toBeInTheDocument();
    expect(screen.getByText("Defina o Objetivo")).toBeInTheDocument();
    expect(screen.getByText("Avalie o Temperamento")).toBeInTheDocument();
    expect(screen.getByText("Consulte Especialistas")).toBeInTheDocument();
  });

  it("switches between modal tabs", () => {
    render(<LinhagenPage />);
    const exploreButtons = screen.getAllByText("Explorar");
    fireEvent.click(exploreButtons[0]);

    // Click on Caracteristicas tab
    const caracteristicasTab = screen.getByText("Caracteristicas");
    fireEvent.click(caracteristicasTab);
    expect(screen.getByText("Morfologia")).toBeInTheDocument();

    // Click on Cavalos Notaveis tab - use getAllByText since it appears in tab and title
    const cavalosTab = screen.getAllByText("Cavalos Notaveis")[0];
    fireEvent.click(cavalosTab);
    expect(screen.getAllByText("Cavalos Notaveis").length).toBeGreaterThan(0);

    // Click on Timeline tab
    const timelineTab = screen.getAllByText("Timeline")[0];
    fireEvent.click(timelineTab);
    expect(screen.getByText("Momentos Historicos")).toBeInTheDocument();
  });
});
