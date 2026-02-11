import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks — vi.mock calls are hoisted, so we cannot reference outer variables.
// All mock data must be defined inline within the factory functions.
// ---------------------------------------------------------------------------

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    toggleLanguage: vi.fn(),
    t: {
      account: {
        private_area: "Area Privada",
        hello: "Ola",
        logout: "Sair",
        profile: "Perfil",
        name: "Nome",
        email: "Email",
        history: "Historico de Encomendas",
        order: "Encomenda",
        no_orders: "Ainda nao fez encomendas",
        explore: "Explorar Loja",
      },
    },
  }),
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => ({
    user: { id: "user-123", email: "test@example.com" },
    loading: false,
  }),
}));

vi.mock("@/lib/supabase-browser", () => ({
  createSupabaseBrowserClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: vi.fn().mockResolvedValue({
            data: { tools_subscription_status: "active" },
            error: null,
          }),
        }),
      }),
    }),
  }),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
    // eslint-disable-next-line @next/next/no-img-element
  }) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("lucide-react", () => ({
  Crown: (props: Record<string, unknown>) => <svg data-testid="icon-crown" {...props} />,
  Loader2: (props: Record<string, unknown>) => <svg data-testid="icon-loader2" {...props} />,
  ExternalLink: (props: Record<string, unknown>) => (
    <svg data-testid="icon-external-link" {...props} />
  ),
}));

const _mockLogout = vi.fn();
vi.mock("@/app/minha-conta/actions", () => ({
  logout: vi.fn(),
}));

vi.mock("@/app/minha-conta/MinhaContaContent", () => ({
  default: ({ customer }: { customer: { firstName: string; lastName: string; email: string } }) => (
    <div data-testid="minha-conta-content">
      <h1>Ola, {customer.firstName}</h1>
      <p>{customer.email}</p>
    </div>
  ),
}));

vi.mock("@/components/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("@/lib/shopify", () => ({
  getCustomer: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Import AFTER mocks
import MinhaContaPage from "@/app/minha-conta/page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/shopify";

describe("MinhaContaPage (Server Component)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "fake-token" }),
    } as never);
    vi.mocked(getCustomer).mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      orders: { edges: [] },
    } as never);
  });

  it("redirects to login if no token", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);

    await MinhaContaPage();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("redirects to login if customer not found", async () => {
    vi.mocked(getCustomer).mockResolvedValue(null);

    await MinhaContaPage();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("renders navbar and content when authenticated", async () => {
    render(await MinhaContaPage());

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("minha-conta-content")).toBeInTheDocument();
  });

  it("passes customer data to MinhaContaContent", async () => {
    render(await MinhaContaPage());

    await waitFor(() => {
      expect(screen.getByText("Ola, John")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  it("calls getCustomer with token", async () => {
    await MinhaContaPage();

    expect(getCustomer).toHaveBeenCalledWith("fake-token");
  });
});
