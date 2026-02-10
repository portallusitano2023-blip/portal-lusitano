import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  OrganizationSchema,
  WebsiteSchema,
  ProductSchema,
  ArticleSchema,
  BreadcrumbSchema,
} from "@/components/JsonLd";

// ---------------------------------------------------------------------------
// Helper: extract JSON-LD content from rendered script tag
// ---------------------------------------------------------------------------
function getJsonLd(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script!.textContent || "{}");
}

// ---------------------------------------------------------------------------
// Tests - OrganizationSchema
// ---------------------------------------------------------------------------
describe("OrganizationSchema", () => {
  it("renders a script tag with application/ld+json type", () => {
    const { container } = render(<OrganizationSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });

  it('contains @type "Organization"', () => {
    const { container } = render(<OrganizationSchema />);
    const data = getJsonLd(container);
    expect(data["@type"]).toBe("Organization");
  });

  it("contains the site name Portal Lusitano", () => {
    const { container } = render(<OrganizationSchema />);
    const data = getJsonLd(container);
    expect(data["name"]).toBe("Portal Lusitano");
  });

  it("contains schema.org context", () => {
    const { container } = render(<OrganizationSchema />);
    const data = getJsonLd(container);
    expect(data["@context"]).toBe("https://schema.org");
  });

  it("includes social media links in sameAs", () => {
    const { container } = render(<OrganizationSchema />);
    const data = getJsonLd(container);
    expect(Array.isArray(data["sameAs"])).toBe(true);
    const sameAs = data["sameAs"] as string[];
    expect(sameAs.some((url) => url.includes("instagram"))).toBe(true);
    expect(sameAs.some((url) => url.includes("tiktok"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests - WebsiteSchema
// ---------------------------------------------------------------------------
describe("WebsiteSchema", () => {
  it("renders a script tag with application/ld+json type", () => {
    const { container } = render(<WebsiteSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });

  it('contains @type "WebSite"', () => {
    const { container } = render(<WebsiteSchema />);
    const data = getJsonLd(container);
    expect(data["@type"]).toBe("WebSite");
  });

  it("contains the site name Portal Lusitano", () => {
    const { container } = render(<WebsiteSchema />);
    const data = getJsonLd(container);
    expect(data["name"]).toBe("Portal Lusitano");
  });

  it("includes a SearchAction potentialAction", () => {
    const { container } = render(<WebsiteSchema />);
    const data = getJsonLd(container);
    const action = data["potentialAction"] as Record<string, unknown>;
    expect(action["@type"]).toBe("SearchAction");
  });
});

// ---------------------------------------------------------------------------
// Tests - ProductSchema
// ---------------------------------------------------------------------------
describe("ProductSchema", () => {
  const defaultProps = {
    name: "Sela Lusitana",
    description: "Sela de alta qualidade",
    image: "https://example.com/sela.jpg",
    price: "299.99",
  };

  it('contains @type "Product"', () => {
    const { container } = render(<ProductSchema {...defaultProps} />);
    const data = getJsonLd(container);
    expect(data["@type"]).toBe("Product");
  });

  it("includes the product name", () => {
    const { container } = render(<ProductSchema {...defaultProps} />);
    const data = getJsonLd(container);
    expect(data["name"]).toBe("Sela Lusitana");
  });

  it("includes offer with price and EUR currency by default", () => {
    const { container } = render(<ProductSchema {...defaultProps} />);
    const data = getJsonLd(container);
    const offers = data["offers"] as Record<string, unknown>;
    expect(offers["price"]).toBe("299.99");
    expect(offers["priceCurrency"]).toBe("EUR");
  });
});

// ---------------------------------------------------------------------------
// Tests - ArticleSchema
// ---------------------------------------------------------------------------
describe("ArticleSchema", () => {
  it('contains @type "Article"', () => {
    const { container } = render(
      <ArticleSchema
        title="Teste Artigo"
        description="Descricao do artigo"
        image="https://example.com/img.jpg"
        datePublished="2025-01-01"
      />
    );
    const data = getJsonLd(container);
    expect(data["@type"]).toBe("Article");
    expect(data["headline"]).toBe("Teste Artigo");
  });
});

// ---------------------------------------------------------------------------
// Tests - BreadcrumbSchema
// ---------------------------------------------------------------------------
describe("BreadcrumbSchema", () => {
  it('contains @type "BreadcrumbList"', () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Loja", url: "/loja" },
        ]}
      />
    );
    const data = getJsonLd(container);
    expect(data["@type"]).toBe("BreadcrumbList");
  });

  it("contains the correct number of list items", () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Loja", url: "/loja" },
          { name: "Produto", url: "/loja/produto" },
        ]}
      />
    );
    const data = getJsonLd(container);
    const items = data["itemListElement"] as unknown[];
    expect(items).toHaveLength(3);
  });
});
