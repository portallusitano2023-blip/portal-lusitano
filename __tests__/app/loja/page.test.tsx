import { describe, it, expect, vi } from "vitest";
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
  usePathname: () => "/loja",
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    t: {
      shop: {
        collection: "COLECCAO",
        legacy: "Legado Lusitano",
        legacy_subtitle: "Artigos seleccionados para o cavaleiro lusitano",
        discover: "DESCOBRIR",
        price_suffix: "EUR",
      },
    },
  }),
}));

// ---------------------------------------------------------------------------
// Import component AFTER mocks
// ---------------------------------------------------------------------------
import LojaContent from "@/app/loja/LojaContent";

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------
const mockProducts = [
  {
    id: "prod-1",
    handle: "sela-lusitana",
    title: "Sela Lusitana Premium",
    description: "Sela artesanal de alta qualidade",
    images: [{ url: "https://example.com/sela.jpg" }],
    priceRange: { minVariantPrice: { amount: "349.99" } },
  },
  {
    id: "prod-2",
    handle: "bridao-classico",
    title: "Bridao Classico",
    description: "Bridao em aco inoxidavel",
    images: [{ url: "https://example.com/bridao.jpg" }],
    priceRange: { minVariantPrice: { amount: "89.00" } },
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("LojaContent", () => {
  it("renders the collection label", () => {
    render(<LojaContent products={mockProducts} />);
    expect(screen.getByText("COLECCAO")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<LojaContent products={mockProducts} />);
    expect(screen.getByText("Legado Lusitano")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<LojaContent products={mockProducts} />);
    expect(screen.getByText("Artigos seleccionados para o cavaleiro lusitano")).toBeInTheDocument();
  });

  it("renders product titles", () => {
    render(<LojaContent products={mockProducts} />);
    expect(screen.getByText("Sela Lusitana Premium")).toBeInTheDocument();
    expect(screen.getByText("Bridao Classico")).toBeInTheDocument();
  });

  it("renders product prices with EUR suffix", () => {
    render(<LojaContent products={mockProducts} />);
    // 349.99 formatted to 2 decimal places
    expect(screen.getByText(/349\.99/)).toBeInTheDocument();
    expect(screen.getByText(/89\.00/)).toBeInTheDocument();
  });

  it("renders product links with correct handles", () => {
    render(<LojaContent products={mockProducts} />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/loja/sela-lusitana");
    expect(hrefs).toContain("/loja/bridao-classico");
  });

  it("renders discover labels for each product", () => {
    render(<LojaContent products={mockProducts} />);
    const discoverLabels = screen.getAllByText("DESCOBRIR");
    expect(discoverLabels).toHaveLength(mockProducts.length);
  });

  it("renders empty grid when no products provided", () => {
    const { container } = render(<LojaContent products={[]} />);
    // The grid container should exist but be empty
    const grid = container.querySelector(".grid");
    expect(grid).not.toBeNull();
    expect(grid!.children).toHaveLength(0);
  });
});
