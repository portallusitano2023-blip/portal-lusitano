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
      eventos: {
        badge: "Calendario Equestre",
        title: "Eventos Lusitanos",
        subtitle: "Descubra os melhores eventos equestres em Portugal",
        all_types: "Todos os Eventos",
        fairs: "Feiras",
        competitions: "Competicoes",
        auctions: "Leiloes",
        exhibitions: "Exposicoes",
        workshops: "Workshops",
        featured: "Em Destaque",
        loading: "A carregar eventos...",
        no_events: "Sem eventos",
        no_events_hint: "Volte mais tarde",
        all_events: "Todos os Eventos",
        event_single: "evento",
        event_plural: "eventos",
        confirmed: "Confirmado",
        annual: "Anual",
        provisional: "Provisorio",
        highlight: "Destaque",
        organized_by: "Organizado por",
        view_full_page: "Ver pagina completa",
        official_site: "Site oficial",
      },
    },
  }),
}));

vi.mock("@/components/ui/Pagination", () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock("lucide-react", () => ({
  Calendar: (props: Record<string, unknown>) => <svg data-testid="icon-calendar" {...props} />,
  MapPin: (props: Record<string, unknown>) => <svg data-testid="icon-mappin" {...props} />,
  Clock: (props: Record<string, unknown>) => <svg data-testid="icon-clock" {...props} />,
  Euro: (props: Record<string, unknown>) => <svg data-testid="icon-euro" {...props} />,
  ChevronLeft: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-left" {...props} />
  ),
  ChevronRight: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-right" {...props} />
  ),
  Tag: (props: Record<string, unknown>) => <svg data-testid="icon-tag" {...props} />,
  ExternalLink: (props: Record<string, unknown>) => <svg data-testid="icon-external" {...props} />,
  Star: (props: Record<string, unknown>) => <svg data-testid="icon-star" {...props} />,
  CheckCircle: (props: Record<string, unknown>) => (
    <svg data-testid="icon-check-circle" {...props} />
  ),
  RefreshCw: (props: Record<string, unknown>) => <svg data-testid="icon-refresh" {...props} />,
  AlertCircle: (props: Record<string, unknown>) => <svg data-testid="icon-alert" {...props} />,
  Filter: (props: Record<string, unknown>) => <svg data-testid="icon-filter" {...props} />,
}));

// Mock global fetch
const mockFetch = vi.fn();

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------
import EventosPage from "@/app/eventos/page";

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ eventos: [] }),
  });
  global.fetch = mockFetch;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("EventosPage", () => {
  it("renders the page title", () => {
    render(<EventosPage />);
    expect(screen.getByText("Eventos Lusitanos")).toBeInTheDocument();
  });

  it("renders the subtitle text", () => {
    render(<EventosPage />);
    expect(
      screen.getByText("Descubra os melhores eventos equestres em Portugal")
    ).toBeInTheDocument();
  });

  it("renders the badge text", () => {
    render(<EventosPage />);
    expect(screen.getByText("Calendario Equestre")).toBeInTheDocument();
  });

  it("renders event type filter buttons", () => {
    render(<EventosPage />);
    expect(screen.getByText("Todos os Eventos")).toBeInTheDocument();
    expect(screen.getByText("Feiras")).toBeInTheDocument();
    expect(screen.getByText("Competicoes")).toBeInTheDocument();
    expect(screen.getByText("Leiloes")).toBeInTheDocument();
    expect(screen.getByText("Exposicoes")).toBeInTheDocument();
    expect(screen.getByText("Workshops")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    render(<EventosPage />);
    expect(screen.getByText("A carregar eventos...")).toBeInTheDocument();
  });

  it("fetches events on mount", () => {
    render(<EventosPage />);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/api/eventos"));
  });
});
