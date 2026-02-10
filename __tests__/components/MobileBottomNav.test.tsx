import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileBottomNav from "@/components/MobileBottomNav";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockOpenCart = vi.fn();
const mockPathname = vi.fn<() => string>(() => "/");
const mockTotalQuantity = vi.fn<() => number>(() => 0);
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

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    openCart: mockOpenCart,
    totalQuantity: mockTotalQuantity(),
    cart: [],
    isCartOpen: false,
    closeCart: vi.fn(),
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
  }),
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
  ShoppingCart: (props: Record<string, unknown>) => <svg data-testid="icon-cart" {...props} />,
  Heart: (props: Record<string, unknown>) => <svg data-testid="icon-heart" {...props} />,
  User: (props: Record<string, unknown>) => <svg data-testid="icon-user" {...props} />,
}));

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockPathname.mockReturnValue("/");
  mockTotalQuantity.mockReturnValue(0);
  mockFavoritesCount.mockReturnValue(0);
  mockOpenCart.mockClear();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("MobileBottomNav", () => {
  it("renders all navigation items", () => {
    render(<MobileBottomNav />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Cavalos")).toBeInTheDocument();
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
    expect(screen.getByText("Conta")).toBeInTheDocument();
    expect(screen.getByText("Loja")).toBeInTheDocument();
  });

  it("highlights the active nav item based on pathname", () => {
    mockPathname.mockReturnValue("/comprar");
    render(<MobileBottomNav />);

    const cavalosLink = screen.getByText("Cavalos").closest("a");
    expect(cavalosLink).toBeTruthy();
    expect(cavalosLink?.className).toContain("text-[#C5A059]");
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

  it("shows cart badge when totalQuantity > 0", () => {
    mockTotalQuantity.mockReturnValue(5);
    render(<MobileBottomNav />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("does not show cart badge when totalQuantity is 0", () => {
    mockTotalQuantity.mockReturnValue(0);
    render(<MobileBottomNav />);

    expect(screen.getByText("Loja")).toBeInTheDocument();
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

  it("calls openCart when cart button is clicked", () => {
    render(<MobileBottomNav />);

    const cartButton = screen.getByText("Loja").closest("button");
    expect(cartButton).toBeTruthy();
    fireEvent.click(cartButton!);

    expect(mockOpenCart).toHaveBeenCalledTimes(1);
  });
});
