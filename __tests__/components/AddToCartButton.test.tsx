import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Hoisted mocks - created via vi.hoisted so they can be referenced in factories
// ---------------------------------------------------------------------------
const { mockAddItemToCart, mockOpenCart } = vi.hoisted(() => ({
  mockAddItemToCart: vi.fn() as ReturnType<typeof vi.fn>,
  mockOpenCart: vi.fn() as ReturnType<typeof vi.fn>,
}));

// ---------------------------------------------------------------------------
// Mocks - all factories use inline data only (no outer variable references)
// ---------------------------------------------------------------------------
vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    addItemToCart: mockAddItemToCart,
    openCart: mockOpenCart,
    cart: [],
    isCartOpen: false,
    closeCart: vi.fn(),
    totalQuantity: 0,
    updateQuantity: vi.fn(),
    removeFromCart: vi.fn(),
    checkoutUrl: null,
  }),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {},
  }),
}));

vi.mock("lucide-react", () => ({
  Loader2: (props: Record<string, unknown>) => <svg data-testid="icon-loader" {...props} />,
}));

// ---------------------------------------------------------------------------
// Import component after all mocks are declared
// ---------------------------------------------------------------------------
import AddToCartButton from "@/components/AddToCartButton";

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockAddItemToCart.mockClear();
  mockOpenCart.mockClear();
  // Default: addItemToCart resolves immediately
  mockAddItemToCart.mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("AddToCartButton", () => {
  it("renders the button with correct text when available", () => {
    render(<AddToCartButton variantId="variant-123" available={true} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Adicionar ao Saco")).toBeInTheDocument();
  });

  it("calls addItemToCart when clicked", async () => {
    render(<AddToCartButton variantId="variant-123" available={true} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddItemToCart).toHaveBeenCalledWith("variant-123", 1);
    });
  });

  it("shows loading state during add", async () => {
    // Make addItemToCart hang so we can observe the loading state
    let resolveAdd!: () => void;
    mockAddItemToCart.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveAdd = resolve;
        })
    );

    render(<AddToCartButton variantId="variant-123" available={true} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // During loading, the button should show the loader icon and "A Adicionar..."
    await waitFor(() => {
      expect(screen.getByTestId("icon-loader")).toBeInTheDocument();
      expect(screen.getByText("A Adicionar...")).toBeInTheDocument();
    });

    // The button should be disabled during loading
    expect(button).toBeDisabled();

    // Resolve the promise to clean up
    resolveAdd();
    await waitFor(() => {
      expect(screen.getByText("Adicionar ao Saco")).toBeInTheDocument();
    });
  });

  it("handles disabled state when not available (sold out)", () => {
    render(<AddToCartButton variantId="variant-123" available={false} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByText("Esgotado")).toBeInTheDocument();
  });

  it("shows success feedback after adding (opens cart)", async () => {
    mockAddItemToCart.mockResolvedValue(undefined);

    render(<AddToCartButton variantId="variant-123" available={true} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // After the async addItemToCart resolves, openCart should be called
    await waitFor(() => {
      expect(mockOpenCart).toHaveBeenCalledTimes(1);
    });

    // Button should return to its normal state
    await waitFor(() => {
      expect(screen.getByText("Adicionar ao Saco")).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  it("does not call addItemToCart when variantId is empty", () => {
    // Suppress the alert call
    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<AddToCartButton variantId="" available={true} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockAddItemToCart).not.toHaveBeenCalled();
  });

  it("does not call addItemToCart when not available", () => {
    // Suppress the alert call
    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<AddToCartButton variantId="variant-123" available={false} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockAddItemToCart).not.toHaveBeenCalled();
  });
});
