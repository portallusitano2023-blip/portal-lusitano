import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock dependencies
vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    t: {
      home: {
        est: "Est. 2023 - Portugal",
        title_prefix: "The",
        title_main: "NOBREZA LUSITANA",
        hero_text: "A uniao perfeita entre a tradicao equestre secular e o design contemporaneo.",
        cta: "Explorar Colecao",
        curation: "Curadoria",
        featured: "Colecao em Destaque",
        view_all: "Ver Todos",
        manifesto: "Nao criamos apenas vestuario.",
        scroll: "Scroll",
      },
      shop: { examine: "Examinar", price_suffix: "EUR" },
    },
  }),
}));
vi.mock("@/context/CartContext", () => ({
  useCart: () => ({ addToCart: vi.fn() }),
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => (
    <a {...props}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const imgProps = { ...props, fill: undefined };
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(imgProps as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

import HomeContent from "@/components/HomeContent";

describe("HomeContent", () => {
  const mockProducts = [
    {
      id: "1",
      title: "T-Shirt Lusitano",
      handle: "t-shirt-lusitano",
      images: [{ url: "/img.jpg", altText: "T-shirt" }],
      variants: [{ id: "v1", price: { amount: "39.90" } }],
      priceRange: { minVariantPrice: { amount: "39.90", currencyCode: "EUR" } },
    },
  ];

  it("should render the hero title", () => {
    render(<HomeContent products={mockProducts} />);
    expect(screen.getByText("NOBREZA LUSITANA")).toBeInTheDocument();
  });

  it("should render with empty products array", () => {
    render(<HomeContent products={[]} />);
    expect(screen.getByText("NOBREZA LUSITANA")).toBeInTheDocument();
  });

  it("should render the CTA button", () => {
    render(<HomeContent products={mockProducts} />);
    expect(screen.getByText("Explorar Colecao")).toBeInTheDocument();
  });
});
