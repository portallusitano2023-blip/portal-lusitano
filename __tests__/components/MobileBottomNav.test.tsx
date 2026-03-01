import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileBottomNav from "@/components/MobileBottomNav";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockPathname = vi.fn<() => string>(() => "/");
const mockFavoritesCount = vi.fn<() => number>(() => 0);

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

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

vi.mock("@/context/HorseFavoritesContext", () => ({
  useHorseFavorites: () => ({
    favoritesCount: mockFavoritesCount(),
    favorites: [],
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isFavorite: vi.fn(),
    toggleFavorite: vi.fn(),
  }),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    t: {
      mobile_nav: {
        home: "Início",
        tools: "Ferramentas",
        horses: "Cavalos",
        favorites: "Favoritos",
        account: "Conta",
        shop: "Loja",
      },
    },
  }),
}));

vi.mock("lucide-react", () => ({
  Home: (props: Record<string, unknown>) => <svg data-testid="icon-home" {...props} />,
  Wrench: (props: Record<string, unknown>) => <svg data-testid="icon-wrench" {...props} />,
  ShoppingCart: (props: Record<string, unknown>) => <svg data-testid="icon-cart" {...props} />,
  Heart: (props: Record<string, unknown>) => <svg data-testid="icon-heart" {...props} />,
  User: (props: Record<string, unknown>) => <svg data-testid="icon-user" {...props} />,
}));

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockPathname.mockReturnValue("/");
  mockFavoritesCount.mockReturnValue(0);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("MobileBottomNav", () => {
  it("renders all navigation items", () => {
    render(<MobileBottomNav />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(screen.getByText("Cavalos")).toBeInTheDocument();
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
    expect(screen.getByText("Conta")).toBeInTheDocument();
  });

  it("highlights the active nav item based on pathname", () => {
    mockPathname.mockReturnValue("/comprar");
    render(<MobileBottomNav />);

    const cavalosLink = screen.getByText("Cavalos").closest("a");
    expect(cavalosLink).toBeTruthy();
    expect(cavalosLink?.className).toContain("text-[var(--gold)]");
  });

  it("shows favorites badge when favoritesCount > 0", () => {
    mockFavoritesCount.mockReturnValue(3);
    render(<MobileBottomNav />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show favorites badge when count is 0", () => {
    mockFavoritesCount.mockReturnValue(0);
    render(<MobileBottomNav />);

    expect(screen.getByText("Favoritos")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("highlights ferramentas nav item on tool pages", () => {
    mockPathname.mockReturnValue("/calculadora-valor");
    render(<MobileBottomNav />);

    const ferramentasLink = screen.getByText("Ferramentas").closest("a");
    expect(ferramentasLink).toBeTruthy();
    expect(ferramentasLink?.className).toContain("text-[var(--gold)]");
  });

  it("hides on /admin path", () => {
    mockPathname.mockReturnValue("/admin/dashboard");
    const { container } = render(<MobileBottomNav />);

    const nav = container.querySelector("nav");
    expect(nav).toBeNull();
  });

  it("hides on /studio path", () => {
    mockPathname.mockReturnValue("/studio");
    const { container } = render(<MobileBottomNav />);

    const nav = container.querySelector("nav");
    expect(nav).toBeNull();
  });

  it("links to /ferramentas from ferramentas nav item", () => {
    render(<MobileBottomNav />);

    const ferramentasLink = screen.getByText("Ferramentas").closest("a");
    expect(ferramentasLink).toHaveAttribute("href", "/ferramentas");
  });
});
