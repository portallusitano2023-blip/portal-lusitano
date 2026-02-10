import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

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
  usePathname: () => "/",
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    t: {
      nav: {
        home: "Inicio",
        shop: "Loja",
        journal: "Jornal",
        about: "Sobre",
      },
      home: {
        manifesto: "Nao criamos apenas vestuario. Criamos simbolos de pertenca.",
      },
      footer: {
        rights: "Todos os direitos reservados",
        privacy: "Privacidade",
        terms: "Termos",
        navigation: "Navegação",
        lusitano: "Lusitano",
        tools: "Ferramentas",
        buy_horse: "Comprar Cavalo",
        studs: "Coudelarias",
        events: "Eventos",
        lineages: "Linhagens",
        notable: "Lusitanos Notáveis",
        calculator: "Calculadora de Valor",
        comparator: "Comparador",
        compatibility: "Compatibilidade",
        profile_analysis: "Análise de Perfil",
        about: "Sobre Nós",
        ebook: "Ebook Grátis",
      },
    },
  }),
}));

vi.mock("lucide-react", () => ({
  Instagram: (props: Record<string, unknown>) => <svg data-testid="icon-instagram" {...props} />,
  Mail: (props: Record<string, unknown>) => <svg data-testid="icon-mail" {...props} />,
  Music2: (props: Record<string, unknown>) => <svg data-testid="icon-tiktok" {...props} />,
  MapPin: (props: Record<string, unknown>) => <svg data-testid="icon-mappin" {...props} />,
  ArrowUpRight: (props: Record<string, unknown>) => <svg data-testid="icon-arrow" {...props} />,
  Gift: (props: Record<string, unknown>) => <svg data-testid="icon-gift" {...props} />,
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("Footer", () => {
  it("renders the logo text", () => {
    render(<Footer />);
    expect(screen.getByText("PORTAL")).toBeInTheDocument();
    expect(screen.getByText("LUSITANO")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/loja");
    expect(hrefs).toContain("/jornal");
  });

  it("renders Lusitano section links", () => {
    render(<Footer />);
    expect(screen.getByText("Comprar Cavalo")).toBeInTheDocument();
    expect(screen.getByText("Coudelarias")).toBeInTheDocument();
    expect(screen.getByText("Eventos")).toBeInTheDocument();
    expect(screen.getByText("Linhagens")).toBeInTheDocument();
    expect(screen.getByText("Lusitanos Notáveis")).toBeInTheDocument();
  });

  it("renders tool section links", () => {
    render(<Footer />);
    expect(screen.getByText("Calculadora de Valor")).toBeInTheDocument();
    expect(screen.getByText("Comparador")).toBeInTheDocument();
    expect(screen.getByText("Compatibilidade")).toBeInTheDocument();
    expect(screen.getByText("Análise de Perfil")).toBeInTheDocument();
  });

  it("renders social media links", () => {
    render(<Footer />);
    const allLinks = screen.getAllByRole("link");
    const hasExternalLink = allLinks.some((link) => {
      const href = link.getAttribute("href") ?? "";
      return href.includes("instagram") || href.includes("tiktok") || href.includes("mailto:");
    });
    expect(hasExternalLink).toBe(true);
  });

  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/Todos os direitos reservados/i)).toBeInTheDocument();
  });

  it("renders privacy and terms links", () => {
    render(<Footer />);
    const allLinks = screen.getAllByRole("link");
    const hrefs = allLinks.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/privacidade");
    expect(hrefs).toContain("/termos");
  });
});
