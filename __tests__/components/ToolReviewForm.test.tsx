import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ToolReviewForm from "@/components/ToolReviewForm";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Star: (props: Record<string, unknown>) => <svg data-testid="star-icon" {...props} />,
  Send: (props: Record<string, unknown>) => <svg data-testid="send-icon" {...props} />,
  Loader2: (props: Record<string, unknown>) => <svg data-testid="loader-icon" {...props} />,
}));

describe("ToolReviewForm", () => {
  const defaultProps = {
    ferramentaSlug: "comparador-cavalos",
    ferramentaNome: "Comparador de Cavalos",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders form with all fields", () => {
    render(<ToolReviewForm {...defaultProps} />);

    // Name input
    expect(screen.getByPlaceholderText("O seu nome")).toBeInTheDocument();

    // Comment textarea
    expect(screen.getByPlaceholderText("O que achou desta ferramenta?")).toBeInTheDocument();

    // Recommend checkbox
    expect(screen.getByRole("checkbox")).toBeInTheDocument();

    // Submit button
    expect(screen.getByText("Submeter Avaliação")).toBeInTheDocument();
  });

  it('shows rating label "Bom" when 3rd star is clicked', () => {
    render(<ToolReviewForm {...defaultProps} />);

    // Star buttons are type="button" inside the form
    const allButtons = screen.getAllByRole("button");
    // First 5 buttons are star ratings, last is submit
    const starButtons = allButtons.filter((btn) => btn.getAttribute("type") === "button");
    expect(starButtons.length).toBeGreaterThanOrEqual(5);

    fireEvent.click(starButtons[2]); // 3rd star

    expect(screen.getByText("Bom")).toBeInTheDocument();
  });

  it("shows validation error when submitting without rating", () => {
    render(<ToolReviewForm {...defaultProps} />);

    const form = screen.getByText("Submeter Avaliação").closest("form");
    fireEvent.submit(form!);

    expect(screen.getByText("Por favor selecione uma avaliação")).toBeInTheDocument();
  });

  it("shows validation error when name and comment are empty", () => {
    render(<ToolReviewForm {...defaultProps} />);

    // Select a rating first
    const allButtons = screen.getAllByRole("button");
    const starButtons = allButtons.filter((btn) => btn.getAttribute("type") === "button");
    fireEvent.click(starButtons[3]); // 4th star

    const form = screen.getByText("Submeter Avaliação").closest("form");
    fireEvent.submit(form!);

    expect(screen.getByText("Nome e comentário são obrigatórios")).toBeInTheDocument();
  });

  it("submits successfully and shows success message", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ToolReviewForm {...defaultProps} />);

    // Select rating
    const allButtons = screen.getAllByRole("button");
    const starButtons = allButtons.filter((btn) => btn.getAttribute("type") === "button");
    fireEvent.click(starButtons[4]); // 5 stars

    // Fill name
    fireEvent.change(screen.getByPlaceholderText("O seu nome"), {
      target: { value: "Maria Silva" },
    });

    // Fill comment
    fireEvent.change(screen.getByPlaceholderText("O que achou desta ferramenta?"), {
      target: { value: "Excelente ferramenta!" },
    });

    // Submit
    const form = screen.getByText("Submeter Avaliação").closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/Obrigado pela sua avaliação/i)).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erro interno do servidor" }),
    });

    render(<ToolReviewForm {...defaultProps} />);

    // Select rating
    const allButtons = screen.getAllByRole("button");
    const starButtons = allButtons.filter((btn) => btn.getAttribute("type") === "button");
    fireEvent.click(starButtons[2]);

    // Fill name and comment
    fireEvent.change(screen.getByPlaceholderText("O seu nome"), {
      target: { value: "Joao Pereira" },
    });
    fireEvent.change(screen.getByPlaceholderText("O que achou desta ferramenta?"), {
      target: { value: "Bom trabalho" },
    });

    // Submit
    const form = screen.getByText("Submeter Avaliação").closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/Erro/i)).toBeInTheDocument();
    });
  });

  it("calls onSuccess callback on successful submit", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const onSuccess = vi.fn();
    render(<ToolReviewForm {...defaultProps} onSuccess={onSuccess} />);

    // Select rating
    const allButtons = screen.getAllByRole("button");
    const starButtons = allButtons.filter((btn) => btn.getAttribute("type") === "button");
    fireEvent.click(starButtons[0]);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText("O seu nome"), {
      target: { value: "Ana Costa" },
    });
    fireEvent.change(screen.getByPlaceholderText("O que achou desta ferramenta?"), {
      target: { value: "Razoavel mas funciona" },
    });

    // Submit
    const form = screen.getByText("Submeter Avaliação").closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
