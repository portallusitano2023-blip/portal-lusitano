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
  it("should render the hero title", () => {
    render(<HomeContent />);
    expect(screen.getByText("NOBREZA LUSITANA")).toBeInTheDocument();
  });

  it("should render with no props", () => {
    render(<HomeContent />);
    expect(screen.getByText("NOBREZA LUSITANA")).toBeInTheDocument();
  });

  it("should render the CTA button", () => {
    render(<HomeContent />);
    expect(screen.getByText("Explorar Colecao")).toBeInTheDocument();
  });
});
