import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";

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

vi.mock("lucide-react", () => ({
  RefreshCw: (props: Record<string, unknown>) => <svg data-testid="icon-refresh" {...props} />,
  Home: (props: Record<string, unknown>) => <svg data-testid="icon-home" {...props} />,
  AlertTriangle: (props: Record<string, unknown>) => <svg data-testid="icon-alert" {...props} />,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// A component that throws on render so we can trigger the boundary
function ThrowingChild({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error: component exploded");
  }
  return <div>Child rendered successfully</div>;
}

// Suppress console.error noise from React/ErrorBoundary during tests
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Hello World</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("shows default fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Algo correu mal/i)).toBeInTheDocument();
  });

  it("shows custom fallback when provided", () => {
    const customFallback = <div>Custom error page</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error page")).toBeInTheDocument();
    expect(screen.queryByText(/Algo correu mal/i)).not.toBeInTheDocument();
  });

  it("resets error state when retry button is clicked", () => {
    // We need a component whose throw behavior we can control.
    // On first render it throws, after retry it should succeed.
    let shouldThrow = true;

    function ConditionalThrow() {
      if (shouldThrow) {
        throw new Error("Boom");
      }
      return <div>Recovered content</div>;
    }

    render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(screen.getByText(/Algo correu mal/i)).toBeInTheDocument();

    // Now stop the child from throwing
    shouldThrow = false;

    // Click the retry button (find by role or text)
    const retryButton = screen.getByRole("button", {
      name: /tentar novamente/i,
    });
    fireEvent.click(retryButton);

    // Children should render again
    expect(screen.getByText("Recovered content")).toBeInTheDocument();
    expect(screen.queryByText(/Algo correu mal/i)).not.toBeInTheDocument();
  });

  it("shows error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV;

    // Force development mode
    Object.defineProperty(process.env, "NODE_ENV", { value: "development", writable: true });

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    // The componentDidCatch should have called console.error in dev
    expect(console.error).toHaveBeenCalled();

    Object.defineProperty(process.env, "NODE_ENV", { value: originalEnv, writable: true });
  });

  it("renders a link to the homepage in the default fallback", () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    const homeLink = screen.getByRole("link", {
      name: /in[ií]cio|home|p[aá]gina inicial/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
