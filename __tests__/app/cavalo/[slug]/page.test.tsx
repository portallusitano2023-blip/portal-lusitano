import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CavaloPage from "@/app/cavalo/[slug]/page";
import { client } from "@/lib/client";

// Mock do Sanity client
vi.mock("@/lib/client", () => ({
  client: {
    fetch: vi.fn(),
  },
}));

// Mock do Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    className,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
  }) => {
    if (fill) {
      return <img src={src} alt={alt} className={className} />;
    }
    return <img src={src} alt={alt} className={className} />;
  },
}));

// Mock do DynamicSEO component
vi.mock("@/components/DynamicSEO", () => ({
  default: () => null,
}));

// Mock do next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("CavaloPage [slug]", () => {
  const mockCavaloData = {
    atual: {
      nome: "Lusitano de Elite",
      idade: 8,
      ferro: "Andrade",
      genealogia: "Pai: Xaquiro, Mãe: Danúbia",
      descricao: "Cavalo Lusitano de elite com excelente linhagem e aptidão para dressage.",
      preco: 75000,
      imageUrl: "https://cdn.sanity.io/images/test/main-photo.jpg",
      galeriaUrls: [
        "https://cdn.sanity.io/images/test/photo1.jpg",
        "https://cdn.sanity.io/images/test/photo2.jpg",
        "https://cdn.sanity.io/images/test/photo3.jpg",
      ],
    },
    relacionados: [
      {
        nome: "Cavalo Relacionado 1",
        slug: "cavalo-1",
        imageUrl: "https://cdn.sanity.io/images/test/related1.jpg",
        idade: 6,
      },
      {
        nome: "Cavalo Relacionado 2",
        slug: "cavalo-2",
        imageUrl: "https://cdn.sanity.io/images/test/related2.jpg",
        idade: 7,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir loading state inicialmente", () => {
    vi.mocked(client.fetch).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const mockParams = Promise.resolve({ slug: "test-cavalo" });
    render(<CavaloPage params={mockParams} />);

    expect(screen.getByText(/Carregando exemplar de elite/i)).toBeInTheDocument();
  });

  it("deve carregar e exibir dados do cavalo corretamente", async () => {
    vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

    const mockParams = Promise.resolve({ slug: "lusitano-elite" });
    render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
    });

    // Verificar informações básicas
    expect(screen.getByText("8 anos")).toBeInTheDocument();
    expect(screen.getByText("Andrade")).toBeInTheDocument();

    // Verificar descrição
    expect(screen.getByText(/Cavalo Lusitano de elite com excelente linhagem/)).toBeInTheDocument();

    // Verificar genealogia
    expect(screen.getByText("Pai: Xaquiro, Mãe: Danúbia")).toBeInTheDocument();

    // Verificar preço formatado (locale pode variar)
    expect(screen.getByText(/75[.,\s]?000\s*€/)).toBeInTheDocument();
  });

  it("deve exibir 'Sob Consulta' quando preço não está disponível", async () => {
    const cavaloSemPreco = {
      ...mockCavaloData,
      atual: {
        ...mockCavaloData.atual,
        preco: null,
      },
    };

    vi.mocked(client.fetch).mockResolvedValue(cavaloSemPreco);

    const mockParams = Promise.resolve({ slug: "cavalo-sem-preco" });
    render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Sob Consulta")).toBeInTheDocument();
    });
  });

  it("deve renderizar galeria com imagem principal e miniaturas", async () => {
    vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

    const mockParams = Promise.resolve({ slug: "lusitano-elite" });
    const { container } = render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
    });

    // Verificar que há múltiplas imagens (principal + miniaturas)
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(1);

    // Verificar que a imagem principal tem o alt correto
    const mainImage = screen.getByAltText("Lusitano de Elite");
    expect(mainImage).toBeInTheDocument();
    expect(mainImage.getAttribute("src")).toBe(mockCavaloData.atual.imageUrl);
  });

  it("deve incluir todas as fotos da galeria (principal + extras)", async () => {
    vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

    const mockParams = Promise.resolve({ slug: "lusitano-elite" });
    const { container } = render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
    });

    // Total de fotos = 1 principal + 3 da galeria = 4 fotos
    // Cada foto aparece 2x: 1x como principal e 4x como miniatura
    const allImages = container.querySelectorAll("img");
    // Deve haver pelo menos 4 miniaturas
    expect(allImages.length).toBeGreaterThanOrEqual(4);
  });

  it("deve exibir exemplares relacionados quando disponíveis", async () => {
    vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

    const mockParams = Promise.resolve({ slug: "lusitano-elite" });
    render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
    });

    // Verificar título da secção (com <span> separado)
    expect(screen.getByText(/Outros/)).toBeInTheDocument();
    expect(screen.getByText(/Exemplares de Elite/)).toBeInTheDocument();

    // Verificar cavalos relacionados
    expect(screen.getByText("Cavalo Relacionado 1")).toBeInTheDocument();
    expect(screen.getByText("Cavalo Relacionado 2")).toBeInTheDocument();
    expect(screen.getByText("6 anos")).toBeInTheDocument();
    expect(screen.getByText("7 anos")).toBeInTheDocument();
  });

  it("não deve exibir secção de relacionados quando vazia", async () => {
    const cavaloSemRelacionados = {
      ...mockCavaloData,
      relacionados: [],
    };

    vi.mocked(client.fetch).mockResolvedValue(cavaloSemRelacionados);

    const mockParams = Promise.resolve({ slug: "cavalo-sem-relacionados" });
    render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
    });

    // Não deve exibir secção de relacionados
    expect(screen.queryByText(/Outros.*Exemplares de Elite/)).not.toBeInTheDocument();
  });

  it("deve exibir botões de contacto (WhatsApp e Email)", async () => {
    vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

    const mockParams = Promise.resolve({ slug: "lusitano-elite" });
    render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
    });

    // Verificar botão WhatsApp
    const whatsappButton = screen.getByText("Contactar por WhatsApp");
    expect(whatsappButton).toBeInTheDocument();
    expect(whatsappButton.closest("a")?.href).toContain("wa.me");

    // Verificar botão Email
    const emailButton = screen.getByText("Enviar Email");
    expect(emailButton).toBeInTheDocument();
    expect(emailButton.closest("a")?.href).toContain("mailto:");
  });

  it("deve formatar link do WhatsApp com nome do cavalo", async () => {
    vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

    const mockParams = Promise.resolve({ slug: "lusitano-elite" });
    render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
    });

    const whatsappLink = screen.getByText("Contactar por WhatsApp").closest("a");
    expect(whatsappLink?.href).toContain("Lusitano%20de%20Elite");
    expect(whatsappLink?.href).toContain("Portal%20Lusitano");
  });

  it("deve exibir link voltar ao marketplace", async () => {
    vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

    const mockParams = Promise.resolve({ slug: "lusitano-elite" });
    render(<CavaloPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
    });

    const backLink = screen.getByText(/Voltar ao Marketplace/);
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")?.href).toContain("/marketplace");
  });

  describe("Casos de erro", () => {
    it("deve permanecer em loading quando cavalo não existe (atual é null)", async () => {
      vi.mocked(client.fetch).mockResolvedValue({
        atual: null,
        relacionados: [],
      });

      const mockParams = Promise.resolve({ slug: "cavalo-nao-existe" });
      render(<CavaloPage params={mockParams} />);

      // Componente não renderiza conteúdo quando data.atual é null
      expect(screen.getByText(/Carregando exemplar de elite/i)).toBeInTheDocument();
    });
  });

  describe("Acessibilidade e UX", () => {
    it("deve ter classes para impressão (no-print)", async () => {
      vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

      const mockParams = Promise.resolve({ slug: "lusitano-elite" });
      const { container } = render(<CavaloPage params={mockParams} />);

      await waitFor(() => {
        expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
      });

      // Verificar que elementos de navegação têm classe no-print
      const noPrintElements = container.querySelectorAll(".no-print");
      expect(noPrintElements.length).toBeGreaterThan(0);
    });

    it("deve ter estrutura semântica com main", async () => {
      vi.mocked(client.fetch).mockResolvedValue(mockCavaloData);

      const mockParams = Promise.resolve({ slug: "lusitano-elite" });
      const { container } = render(<CavaloPage params={mockParams} />);

      await waitFor(() => {
        expect(screen.getByText("Lusitano de Elite")).toBeInTheDocument();
      });

      const mainElement = container.querySelector("main");
      expect(mainElement).toBeInTheDocument();
    });
  });
});
