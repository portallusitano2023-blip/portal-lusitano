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
  usePathname: () => "/ferramentas",
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => ({
    user: null,
    session: null,
    isLoading: false,
    signOut: vi.fn(),
  }),
}));

vi.mock("lucide-react", () => ({
  Lock: (props: Record<string, unknown>) => <svg data-testid="icon-lock" {...props} />,
  Crown: (props: Record<string, unknown>) => <svg data-testid="icon-crown" {...props} />,
  ArrowRight: (props: Record<string, unknown>) => <svg data-testid="icon-arrow-right" {...props} />,
  Loader2: (props: Record<string, unknown>) => <svg data-testid="icon-loader" {...props} />,
}));

// ---------------------------------------------------------------------------
// Import component AFTER mocks
// ---------------------------------------------------------------------------
import Paywall from "@/components/tools/Paywall";

// ---------------------------------------------------------------------------
// Tests - Default (PRO paywall)
// ---------------------------------------------------------------------------
describe("Paywall - PRO subscription mode", () => {
  it("renders the PRO heading", () => {
    render(<Paywall toolName="Calculadora" />);
    expect(screen.getByText("Ferramentas PRO")).toBeInTheDocument();
  });

  it("renders the subscribe button", () => {
    render(<Paywall toolName="Calculadora" />);
    expect(screen.getByText("Subscrever PRO")).toBeInTheDocument();
  });

  it("displays the pricing (9,99 EUR/mes)", () => {
    render(<Paywall toolName="Calculadora" />);
    expect(screen.getByText(/9,99/)).toBeInTheDocument();
  });

  it("shows the tool name in the description", () => {
    render(<Paywall toolName="Comparador" />);
    expect(screen.getByText(/Ja usou o seu uso gratuito da Comparador/)).toBeInTheDocument();
  });

  it("displays feature list items", () => {
    render(<Paywall toolName="Calculadora" />);
    expect(screen.getByText(/Uso ilimitado das 4 ferramentas/)).toBeInTheDocument();
    expect(screen.getByText(/Exportacao PDF profissional/)).toBeInTheDocument();
    expect(screen.getByText(/Guardar e partilhar resultados/)).toBeInTheDocument();
    expect(screen.getByText(/Historico completo de avaliacoes/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tests - Auth required mode
// ---------------------------------------------------------------------------
describe("Paywall - requiresAuth mode", () => {
  it("renders the auth heading instead of PRO heading", () => {
    render(<Paywall toolName="Calculadora" requiresAuth />);
    expect(screen.getByText("Crie uma conta gratuita")).toBeInTheDocument();
    expect(screen.queryByText("Ferramentas PRO")).not.toBeInTheDocument();
  });

  it("renders the register link", () => {
    render(<Paywall toolName="Calculadora" requiresAuth />);
    const registerLink = screen.getByText("Criar Conta Gratis");
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest("a")).toHaveAttribute("href", "/registar");
  });

  it("renders the login link", () => {
    render(<Paywall toolName="Calculadora" requiresAuth />);
    const loginLink = screen.getByText("Ja tenho conta");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
  });

  it("shows the tool name in the auth description", () => {
    render(<Paywall toolName="Comparador" requiresAuth />);
    expect(screen.getByText(/Registe-se para usar a Comparador gratuitamente/)).toBeInTheDocument();
  });

  it("renders the lock icon in auth mode", () => {
    render(<Paywall toolName="Calculadora" requiresAuth />);
    expect(screen.getByTestId("icon-lock")).toBeInTheDocument();
  });
});
