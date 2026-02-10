import { describe, it, expect, vi, beforeEach } from "vitest";
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
      marketplace_page: {
        badge: "Marketplace Lusitano",
        title: "Cavalos a Venda",
        subtitle: "Encontre o Lusitano perfeito",
        stat_horses: "Cavalos",
        stat_featured: "Em Destaque",
        stat_lusitanos: "Lusitanos",
        search_placeholder: "Pesquisar cavalos...",
        filters: "Filtros",
        sex_all: "Todos",
        sex_stallions: "Machos",
        sex_mares: "Femeas",
        sex_geldings: "Castrados",
        sex_stallion: "Macho",
        sex_mare: "Femea",
        sex_gelding: "Castrado",
        level_all: "Todos os niveis",
        level_broken: "Desbastado",
        level_started: "Iniciado",
        level_advanced: "Avancado",
        level_competition: "Competicao",
        discipline_all: "Todas",
        discipline_dressage: "Dressage",
        discipline_alta_escola: "Alta Escola",
        discipline_toureio: "Toureio",
        discipline_trabalho: "Trabalho",
        discipline_leisure: "Lazer",
        discipline_breeding: "Reproducao",
        region_all: "Todas",
        label_sex: "Sexo",
        label_region: "Regiao",
        label_level: "Nivel",
        label_discipline: "Disciplina",
        label_price_min: "Preco Min",
        label_price_max: "Preco Max",
        placeholder_min: "Min",
        placeholder_max: "Max",
        loading: "A carregar cavalos...",
        no_results: "Nenhum cavalo encontrado",
        no_results_hint: "Tente ajustar os filtros",
        featured_horses: "Cavalos em Destaque",
        featured_badge: "Destaque",
        all_horses: "Todos os Cavalos",
        horse_singular: "cavalo",
        horse_plural: "cavalos",
        on_request: "Sob consulta",
        to_define: "A definir",
        negotiable: "Negociavel",
        years: "anos",
        lineage_label: "Linhagem:",
        send_email: "Enviar email",
        modal_height: "Altura",
        modal_lineage: "Linhagem",
        modal_level: "Nivel",
        modal_apsl: "APSL",
        modal_genealogy: "Genealogia",
        modal_father: "Pai:",
        modal_mother: "Mae:",
      },
    },
  }),
}));

vi.mock("@/components/TextSplit", () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock("@/components/ui/Pagination", () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock("@/hooks/useCountUp", () => ({
  useCountUp: (target: number) => target,
}));

vi.mock("@/hooks/useInViewOnce", () => ({
  useInViewOnce: () => true,
}));

vi.mock("@/hooks/useTilt3D", () => ({
  useTilt3D: () => ({
    ref: { current: null },
    onMouseMove: vi.fn(),
    onMouseLeave: vi.fn(),
  }),
}));

vi.mock("lucide-react", () => ({
  Search: (props: Record<string, unknown>) => <svg data-testid="icon-search" {...props} />,
  Filter: (props: Record<string, unknown>) => <svg data-testid="icon-filter" {...props} />,
  Heart: (props: Record<string, unknown>) => <svg data-testid="icon-heart" {...props} />,
  MapPin: (props: Record<string, unknown>) => <svg data-testid="icon-mappin" {...props} />,
  ChevronDown: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-down" {...props} />
  ),
  Star: (props: Record<string, unknown>) => <svg data-testid="icon-star" {...props} />,
  Award: (props: Record<string, unknown>) => <svg data-testid="icon-award" {...props} />,
  Phone: (props: Record<string, unknown>) => <svg data-testid="icon-phone" {...props} />,
  Mail: (props: Record<string, unknown>) => <svg data-testid="icon-mail" {...props} />,
  X: (props: Record<string, unknown>) => <svg data-testid="icon-x" {...props} />,
  ExternalLink: (props: Record<string, unknown>) => <svg data-testid="icon-external" {...props} />,
}));

// Mock global fetch
const mockFetch = vi.fn();

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------
import MarketplacePage from "@/app/marketplace/page";

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ cavalos: [] }),
  });
  global.fetch = mockFetch;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("MarketplacePage", () => {
  it("renders the page title", () => {
    render(<MarketplacePage />);
    expect(screen.getByText("Cavalos a Venda")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<MarketplacePage />);
    expect(screen.getByText("Encontre o Lusitano perfeito")).toBeInTheDocument();
  });

  it("renders the badge text", () => {
    render(<MarketplacePage />);
    expect(screen.getByText("Marketplace Lusitano")).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<MarketplacePage />);
    expect(screen.getByPlaceholderText("Pesquisar cavalos...")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    render(<MarketplacePage />);
    expect(screen.getByText("A carregar cavalos...")).toBeInTheDocument();
  });

  it("fetches horses on mount", () => {
    render(<MarketplacePage />);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/api/cavalos"));
  });
});
