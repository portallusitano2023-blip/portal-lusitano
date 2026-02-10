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
  Crown: (props: Record<string, unknown>) => <svg data-testid="icon-crown" {...props} />,
  Zap: (props: Record<string, unknown>) => <svg data-testid="icon-zap" {...props} />,
  Loader2: (props: Record<string, unknown>) => <svg data-testid="icon-loader" {...props} />,
}));

// ---------------------------------------------------------------------------
// Import component AFTER mocks
// ---------------------------------------------------------------------------
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";

// ---------------------------------------------------------------------------
// Tests - Subscribed state
// ---------------------------------------------------------------------------
describe("SubscriptionBanner - isSubscribed", () => {
  it("renders PRO badge with unlimited usage text", () => {
    render(<SubscriptionBanner freeUsesLeft={0} isSubscribed={true} requiresAuth={false} />);
    expect(screen.getByText("Ferramentas PRO - Uso Ilimitado")).toBeInTheDocument();
  });

  it("renders the manage (Gerir) button", () => {
    render(<SubscriptionBanner freeUsesLeft={0} isSubscribed={true} requiresAuth={false} />);
    expect(screen.getByText("Gerir")).toBeInTheDocument();
  });

  it("renders the crown icon", () => {
    render(<SubscriptionBanner freeUsesLeft={0} isSubscribed={true} requiresAuth={false} />);
    expect(screen.getByTestId("icon-crown")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tests - requiresAuth state (not logged in)
// ---------------------------------------------------------------------------
describe("SubscriptionBanner - requiresAuth", () => {
  it("renders register prompt with link to /registar", () => {
    render(<SubscriptionBanner freeUsesLeft={0} isSubscribed={false} requiresAuth={true} />);
    const link = screen.getByText("Crie uma conta para usar gratuitamente");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/registar");
  });

  it("renders the zap icon", () => {
    render(<SubscriptionBanner freeUsesLeft={0} isSubscribed={false} requiresAuth={true} />);
    expect(screen.getByTestId("icon-zap")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tests - Free uses remaining
// ---------------------------------------------------------------------------
describe("SubscriptionBanner - free uses left", () => {
  it("shows remaining free uses count (plural)", () => {
    render(<SubscriptionBanner freeUsesLeft={3} isSubscribed={false} requiresAuth={false} />);
    expect(screen.getByText(/3 usos gratuitos restantes/)).toBeInTheDocument();
  });

  it("shows remaining free uses count (singular)", () => {
    render(<SubscriptionBanner freeUsesLeft={1} isSubscribed={false} requiresAuth={false} />);
    expect(screen.getByText(/1 uso gratuito restante/)).toBeInTheDocument();
  });

  it("renders the subscribe PRO button when free uses remain", () => {
    render(<SubscriptionBanner freeUsesLeft={2} isSubscribed={false} requiresAuth={false} />);
    expect(screen.getByText("Subscrever PRO")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tests - No uses left, not subscribed, not requiring auth
// ---------------------------------------------------------------------------
describe("SubscriptionBanner - no uses, not subscribed", () => {
  it("renders nothing when freeUsesLeft is 0 and not subscribed/requiresAuth", () => {
    const { container } = render(
      <SubscriptionBanner freeUsesLeft={0} isSubscribed={false} requiresAuth={false} />
    );
    expect(container.innerHTML).toBe("");
  });
});
