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
      cavalos_famosos: {
        gallery_badge: "Galeria de Honra \u2022 Genealogia Interativa",
        title: "Lendas do Lusitano",
        subtitle: "Uma homenagem aos cavalos que marcaram a historia da raca Lusitana.",
        back: "Voltar",
        top_influencers: "MAIORES INFLUENCIADORES GENETICOS",
        of_current: "dos Lusitanos atuais",
        all_disciplines: "Todas Disciplinas",
        all_lineages: "Todas Linhagens",
        lineage_prefix: "Linhagem",
        featured: "Lendas em Destaque",
        others: "Outras Lendas Historicas",
        no_results: "Nenhum cavalo encontrado",
        no_results_hint: "Ajuste os filtros para ver mais resultados",
        know_horse: "Conhece um cavalo Lusitano lendario?",
        help_expand: "Ajuda-nos a expandir esta galeria de honra.",
        suggest: "Sugerir Cavalo",
        conquistas: "conquistas",
        quote_author: "Mestre Nuno Oliveira",
      },
    },
  }),
}));

vi.mock("@/app/cavalos-famosos/data", () => ({
  cavalosFamosos: [
    {
      id: "1",
      nome: "Novilheiro",
      apelido: "O Lendario",
      anoNascimento: 1971,
      anoFalecimento: 2000,
      coudelaria: "Coudelaria Manuel Veiga",
      pelagem: "Ruco",
      disciplina: "Saltos / Dressage / Toureio",
      linhagem: "Veiga/Andrade",
      conquistas: ["Campeao Britanico"],
      descricao: "O mais celebre Lusitano",
      destaque: true,
      legado: "O Lusitano mais versatil",
      pedigree: {},
      influenciaGenetica: 15,
    },
    {
      id: "2",
      nome: "Oxidado",
      apelido: "O Rei",
      anoNascimento: 1994,
      anoFalecimento: 2020,
      coudelaria: "Coudelaria JPR",
      pelagem: "Castanho",
      disciplina: "Working Equitation",
      linhagem: "Veiga",
      conquistas: ["Campeao Europeu"],
      descricao: "O mais titulado",
      destaque: false,
      legado: "O mais titulado de WE",
      pedigree: {},
    },
  ],
}));

// CavaloCard is a NAMED export
vi.mock("@/components/cavalos-famosos/CavaloCard", () => ({
  CavaloCard: ({
    cavalo,
    onClick,
  }: {
    cavalo: { id: string; nome: string };
    onClick?: () => void;
  }) => (
    <button data-testid={`cavalo-card-${cavalo.id}`} onClick={onClick}>
      {cavalo.nome}
    </button>
  ),
}));

// ModalDetalhes is a NAMED export
vi.mock("@/components/cavalos-famosos/ModalDetalhes", () => ({
  ModalDetalhes: ({ cavalo, onClose }: { cavalo: { nome: string } | null; onClose: () => void }) =>
    cavalo ? (
      <div data-testid="modal-detalhes">
        <span>modal</span>
        <span>{cavalo.nome}</span>
        <button onClick={onClose}>fechar</button>
      </div>
    ) : null,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/cavalos-famosos",
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-left" {...props} />,
  Trophy: (props: Record<string, unknown>) => <svg data-testid="icon-trophy" {...props} />,
  Crown: (props: Record<string, unknown>) => <svg data-testid="icon-crown" {...props} />,
  Medal: (props: Record<string, unknown>) => <svg data-testid="icon-medal" {...props} />,
  Sparkles: (props: Record<string, unknown>) => <svg data-testid="icon-sparkles" {...props} />,
  History: (props: Record<string, unknown>) => <svg data-testid="icon-history" {...props} />,
}));

// Import AFTER mocks
import CavalosFamososPage from "@/app/cavalos-famosos/page";

describe("CavalosFamososPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title "Lendas do Lusitano"', () => {
    render(<CavalosFamososPage />);
    expect(screen.getByText(/lendas do lusitano/i)).toBeInTheDocument();
  });

  it("renders Nuno Oliveira quote", () => {
    render(<CavalosFamososPage />);
    expect(screen.getByText(/Nuno Oliveira/)).toBeInTheDocument();
  });

  it("renders discipline filter buttons", () => {
    render(<CavalosFamososPage />);
    expect(screen.getByText("Todas Disciplinas")).toBeInTheDocument();
  });

  it("renders horse cards from mock data", () => {
    render(<CavalosFamososPage />);
    expect(screen.getByTestId("cavalo-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("cavalo-card-2")).toBeInTheDocument();
  });

  it("opens modal when a card is clicked", () => {
    render(<CavalosFamososPage />);
    fireEvent.click(screen.getByTestId("cavalo-card-1"));
    expect(screen.getByTestId("modal-detalhes")).toBeInTheDocument();
  });

  it("closes modal when fechar button is clicked", () => {
    render(<CavalosFamososPage />);
    fireEvent.click(screen.getByTestId("cavalo-card-1"));
    expect(screen.getByTestId("modal-detalhes")).toBeInTheDocument();
    fireEvent.click(screen.getByText("fechar"));
    expect(screen.queryByTestId("modal-detalhes")).not.toBeInTheDocument();
  });

  it("renders linhagem filter buttons", () => {
    render(<CavalosFamososPage />);
    expect(screen.getByText("Todas Linhagens")).toBeInTheDocument();
  });
});
