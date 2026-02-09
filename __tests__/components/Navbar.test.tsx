import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock all external dependencies
vi.mock("@/context/CartContext", () => ({
  useCart: () => ({ totalQuantity: 0, openCart: vi.fn() }),
}));
vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      nav: { home: "Inicio", shop: "Loja", about: "Sobre", journal: "Jornal" },
      cart: "Saco",
    },
  }),
}));
vi.mock("@/context/WishlistContext", () => ({
  useWishlist: () => ({ wishlist: [] }),
}));
vi.mock("@/context/HorseFavoritesContext", () => ({
  useHorseFavorites: () => ({ favoritesCount: 0 }),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
vi.mock("next/dynamic", () => ({
  default: () => {
    const Component = () => null;
    Component.displayName = "DynamicMock";
    return Component;
  },
}));
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const imgProps = { ...props, fill: undefined };
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(imgProps as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("should render the logo text", () => {
    render(<Navbar />);
    expect(screen.getByText("PORTAL LUSITANO")).toBeInTheDocument();
  });

  it("should render desktop navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Loja")).toBeInTheDocument();
    expect(screen.getByText("Jornal")).toBeInTheDocument();
  });

  it("should have search button with aria label", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("Pesquisar")).toBeInTheDocument();
  });

  it("should have cart button with quantity", () => {
    render(<Navbar />);
    expect(screen.getByLabelText(/Carrinho/)).toBeInTheDocument();
  });

  it("should render Lusitano dropdown button", () => {
    render(<Navbar />);
    expect(screen.getByText("Lusitano")).toBeInTheDocument();
  });

  it("should render ebook link", () => {
    render(<Navbar />);
    expect(screen.getByText("Ebook Grátis")).toBeInTheDocument();
  });

  it("should have mobile menu toggle", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("Abrir menu")).toBeInTheDocument();
  });
});
