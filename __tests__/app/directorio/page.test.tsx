import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks - must be defined before component import
// ---------------------------------------------------------------------------

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      directorio: {
        badge: "Diretorio Oficial",
        title: "Coudelarias de Portugal",
        subtitle: "Descubra as melhores coudelarias de cavalos Lusitanos em Portugal.",
        coudelarias: "Coudelarias",
        regioes: "Regioes",
        cavalos: "Cavalos",
        has_stud: "Tem uma coudelaria?",
        register_cta: "Registe-se e apareca no maior diretorio equestre de Portugal",
        register_btn: "Registar Coudelaria",
        search_placeholder: "Pesquisar por nome ou localiza\u00E7\u00E3o...",
        featured: "Coudelarias em Destaque",
        others: "Outras Coudelarias",
        coudelaria_single: "coudelaria",
        coudelarias_plural: "coudelarias",
        since: "Desde",
        horses: "cavalos",
        view_stud: "Ver coudelaria",
        view_details: "Ver detalhes",
        highlight: "Destaque",
        no_results: "Nenhuma coudelaria encontrada",
        no_results_hint: "Tente ajustar os filtros de pesquisa",
        loading: "A carregar coudelarias...",
      },
    },
  }),
}));

vi.mock("@/components/ui/Pagination", () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock("lucide-react", () => ({
  MapPin: (props: Record<string, unknown>) => <svg data-testid="icon-map-pin" {...props} />,
  Search: (props: Record<string, unknown>) => <svg data-testid="icon-search" {...props} />,
  Filter: (props: Record<string, unknown>) => <svg data-testid="icon-filter" {...props} />,
  Crown: (props: Record<string, unknown>) => <svg data-testid="icon-crown" {...props} />,
  ArrowRight: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-right" {...props} />,
  Plus: (props: Record<string, unknown>) => <svg data-testid="icon-plus" {...props} />,
  Users: (props: Record<string, unknown>) => <svg data-testid="icon-users" {...props} />,
  Star: (props: Record<string, unknown>) => <svg data-testid="icon-star" {...props} />,
}));

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: () => null,
    getAll: () => [],
    has: () => false,
    toString: () => "",
    entries: () => [][Symbol.iterator](),
    forEach: () => {},
    keys: () => [][Symbol.iterator](),
    values: () => [][Symbol.iterator](),
  }),
  usePathname: () => "/directorio",
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={(props.alt as string) || ""} />
  ),
}));

import DirectorioPage from "@/app/directorio/page";

describe("DirectorioPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Default fetch mock: returns empty coudelarias after a short delay
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ coudelarias: [] }),
    });
  });

  it('renders hero section with title "Coudelarias de Portugal"', async () => {
    render(<DirectorioPage />);

    await waitFor(() => {
      expect(screen.getByText(/coudelarias de portugal/i)).toBeInTheDocument();
    });
  });

  it('renders "Diretorio Oficial" label', async () => {
    render(<DirectorioPage />);

    await waitFor(() => {
      expect(screen.getByText(/diret[oó]rio oficial/i)).toBeInTheDocument();
    });
  });

  it("renders search input with correct placeholder", async () => {
    render(<DirectorioPage />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/pesquisar por nome ou localiza/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it("renders region filter select", async () => {
    render(<DirectorioPage />);

    await waitFor(() => {
      // The region filter should be a select or a filter element
      const regionFilter =
        screen.queryByRole("combobox") ||
        screen.queryByText(/regi[aã]o/i) ||
        screen.queryByText(/todas as regi/i);
      expect(regionFilter).toBeTruthy();
    });
  });

  it("shows loading state initially", () => {
    // Use a fetch that never resolves to keep loading visible
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

    render(<DirectorioPage />);

    expect(screen.getByText(/a carregar coudelarias/i)).toBeInTheDocument();
  });

  it("shows empty state when no coudelarias are returned", async () => {
    render(<DirectorioPage />);

    await waitFor(() => {
      expect(screen.getByText(/nenhuma coudelaria encontrada/i)).toBeInTheDocument();
    });
  });

  it("renders CTA for registering a coudelaria", async () => {
    render(<DirectorioPage />);

    await waitFor(() => {
      expect(screen.getByText(/tem uma coudelaria/i)).toBeInTheDocument();
      expect(screen.getByText(/registar coudelaria/i)).toBeInTheDocument();
    });
  });
});
