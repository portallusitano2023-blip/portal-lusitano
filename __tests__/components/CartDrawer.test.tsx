import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks - all factories use inline data only (no outer variable references)
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

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const imgProps = { ...props, fill: undefined };
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(imgProps as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

vi.mock("lucide-react", () => ({
  X: (props: Record<string, unknown>) => <svg data-testid="icon-x" {...props} />,
  Minus: (props: Record<string, unknown>) => <svg data-testid="icon-minus" {...props} />,
  Plus: (props: Record<string, unknown>) => <svg data-testid="icon-plus" {...props} />,
  ShoppingBag: (props: Record<string, unknown>) => (
    <svg data-testid="icon-shopping-bag" {...props} />
  ),
}));

// We need to control mock return values per-test, so we use vi.hoisted
const { mockCloseCart, mockUpdateQuantity, mockRemoveFromCart, mockCartState } = vi.hoisted(() => ({
  mockCloseCart: vi.fn() as ReturnType<typeof vi.fn>,
  mockUpdateQuantity: vi.fn() as ReturnType<typeof vi.fn>,
  mockRemoveFromCart: vi.fn() as ReturnType<typeof vi.fn>,
  mockCartState: {
    cart: [] as Array<{
      id: string;
      title: string;
      price: string;
      quantity: number;
      image: string;
      variantId: string;
    }>,
    isCartOpen: false,
    checkoutUrl: "https://checkout.shopify.com/test",
  },
}));

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    cart: mockCartState.cart,
    isCartOpen: mockCartState.isCartOpen,
    closeCart: mockCloseCart,
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    checkoutUrl: mockCartState.checkoutUrl,
    openCart: vi.fn(),
    addItemToCart: vi.fn(),
    totalQuantity: 0,
  }),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {},
  }),
}));

// ---------------------------------------------------------------------------
// Import component after all mocks are declared
// ---------------------------------------------------------------------------
import CartDrawer from "@/components/CartDrawer";

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockCloseCart.mockClear();
  mockUpdateQuantity.mockClear();
  mockRemoveFromCart.mockClear();
  mockCartState.cart = [];
  mockCartState.isCartOpen = false;
  mockCartState.checkoutUrl = "https://checkout.shopify.com/test";
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("CartDrawer", () => {
  it("renders nothing visible when isCartOpen is false", () => {
    mockCartState.isCartOpen = false;
    const { container } = render(<CartDrawer />);

    // The outer container should have pointer-events-none when closed
    const outerDiv = container.firstElementChild as HTMLElement;
    expect(outerDiv.className).toContain("pointer-events-none");

    // The cart title should not be visible (drawer is translated off-screen)
    // But it is still in the DOM, just visually hidden via transform
    const drawer = container.querySelector(".translate-x-full");
    expect(drawer).toBeTruthy();
  });

  it("renders cart title 'O Seu Saco' when open with empty cart", () => {
    mockCartState.isCartOpen = true;
    mockCartState.cart = [];
    render(<CartDrawer />);

    expect(screen.getByText("O Seu Saco")).toBeInTheDocument();
  });

  it("shows empty cart message when cart has no items", () => {
    mockCartState.isCartOpen = true;
    mockCartState.cart = [];
    render(<CartDrawer />);

    expect(screen.getByText("O seu saco está vazio.")).toBeInTheDocument();
    expect(screen.getByText("Explorar a Coleção")).toBeInTheDocument();
  });

  it("shows cart items with product details when cart has items", () => {
    mockCartState.isCartOpen = true;
    mockCartState.cart = [
      {
        id: "item-1",
        title: "Camisa Lusitana",
        price: "49.90",
        quantity: 2,
        image: "/products/camisa.jpg",
        variantId: "variant-1",
      },
    ];
    render(<CartDrawer />);

    expect(screen.getByText("Camisa Lusitana")).toBeInTheDocument();
    expect(screen.getByText("49.90 EUR")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows subtotal with correct calculation", () => {
    mockCartState.isCartOpen = true;
    mockCartState.cart = [
      {
        id: "item-1",
        title: "Camisa Lusitana",
        price: "49.90",
        quantity: 2,
        image: "/products/camisa.jpg",
        variantId: "variant-1",
      },
      {
        id: "item-2",
        title: "Boné Equestre",
        price: "25.00",
        quantity: 1,
        image: "/products/bone.jpg",
        variantId: "variant-2",
      },
    ];
    render(<CartDrawer />);

    // Subtotal should be (49.90 * 2) + (25.00 * 1) = 124.80
    expect(screen.getByText(/124\.80/)).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
  });

  it("calls closeCart when X button is clicked", () => {
    mockCartState.isCartOpen = true;
    mockCartState.cart = [];
    render(<CartDrawer />);

    const closeButton = screen.getByLabelText("Fechar carrinho");
    fireEvent.click(closeButton);

    expect(mockCloseCart).toHaveBeenCalledTimes(1);
  });

  it("calls updateQuantity when +/- buttons are clicked", () => {
    mockCartState.isCartOpen = true;
    mockCartState.cart = [
      {
        id: "item-1",
        title: "Camisa Lusitana",
        price: "49.90",
        quantity: 2,
        image: "/products/camisa.jpg",
        variantId: "variant-1",
      },
    ];
    render(<CartDrawer />);

    // Find the Plus and Minus buttons (they wrap the mocked SVG icons)
    const plusIcon = screen.getByTestId("icon-plus");
    const minusIcon = screen.getByTestId("icon-minus");

    // Click the Plus button (parent of the icon)
    const plusButton = plusIcon.closest("button")!;
    fireEvent.click(plusButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("item-1", 3);

    // Click the Minus button (parent of the icon)
    const minusButton = minusIcon.closest("button")!;
    fireEvent.click(minusButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("item-1", 1);
  });

  it("shows checkout link with correct text", () => {
    mockCartState.isCartOpen = true;
    mockCartState.cart = [
      {
        id: "item-1",
        title: "Camisa Lusitana",
        price: "49.90",
        quantity: 1,
        image: "/products/camisa.jpg",
        variantId: "variant-1",
      },
    ];
    render(<CartDrawer />);

    const checkoutLink = screen.getByText("Finalizar Compra");
    expect(checkoutLink).toBeInTheDocument();
    expect(checkoutLink.closest("a")).toHaveAttribute("href", "https://checkout.shopify.com/test");
  });
});
