import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("lucide-react", () => ({
  X: (props: Record<string, unknown>) => <svg data-testid="icon-x" {...props} />,
  Heart: (props: Record<string, unknown>) => <svg data-testid="icon-heart" {...props} />,
  ShoppingBag: (props: Record<string, unknown>) => <svg data-testid="icon-bag" {...props} />,
  Loader2: (props: Record<string, unknown>) => <svg data-testid="icon-loader" {...props} />,
  ChevronLeft: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-left" {...props} />
  ),
  ChevronRight: (props: Record<string, unknown>) => (
    <svg data-testid="icon-chevron-right" {...props} />
  ),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
  }),
}));

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    addItemToCart: vi.fn(),
  }),
}));

vi.mock("@/context/WishlistContext", () => ({
  useWishlist: () => ({
    addToWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
    isInWishlist: () => false,
  }),
}));

vi.mock("@/context/ToastContext", () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
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

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const imgProps = { ...props, fill: undefined };
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(imgProps as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------
import QuickView from "@/components/QuickView";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const mockProduct = {
  id: "gid://shopify/Product/123",
  handle: "cinto-lusitano",
  title: "Cinto Lusitano Premium",
  description: "Cinto em pele genuina com fivela dourada.",
  images: [{ url: "https://example.com/cinto.jpg" }],
  priceRange: { minVariantPrice: { amount: "89.90" } },
  variants: [
    { id: "gid://shopify/ProductVariant/456", title: "Default", price: { amount: "89.90" } },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("QuickView", () => {
  it("renders nothing when no product is provided", () => {
    const { container } = render(<QuickView product={null} isOpen={true} onClose={vi.fn()} />);
    // With product=null, component returns null
    expect(container.innerHTML).toBe("");
  });

  it("shows product details when product is provided and isOpen is true", () => {
    render(<QuickView product={mockProduct} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("Cinto Lusitano Premium")).toBeInTheDocument();
    expect(screen.getByText("89.90 EUR")).toBeInTheDocument();
    expect(screen.getByText("Cinto em pele genuina com fivela dourada.")).toBeInTheDocument();
  });

  it("shows close button with correct aria-label", () => {
    render(<QuickView product={mockProduct} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByLabelText("Fechar")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<QuickView product={mockProduct} isOpen={true} onClose={handleClose} />);
    fireEvent.click(screen.getByLabelText("Fechar"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
