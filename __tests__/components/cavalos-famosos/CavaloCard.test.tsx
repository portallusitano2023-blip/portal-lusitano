import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CavaloCard } from "@/components/cavalos-famosos/CavaloCard";
import { CavaloFamoso } from "@/app/cavalos-famosos/types";

describe("CavaloCard", () => {
  const mockCavaloBasico: CavaloFamoso = {
    id: "test-1",
    nome: "Rubi AR",
    apelido: "The London Horse",
    anoNascimento: 2003,
    coudelaria: "Andrade",
    disciplina: "Dressage",
    linhagem: "Veiga",
    pelagem: "Castanho",
    descricao: "Primeiro Lusitano a competir em Dressage nos Jogos Olímpicos.",
    destaque: true,
    pedigree: {
      pai: { nome: "Xaquiro" },
      mae: { nome: "Danúbia" },
      avoPaterno: { nome: "Novilheiro" },
    },
    conquistas: ["Jogos Olímpicos Londres 2012", "Campeão Nacional"],
    legado: "Primeiro Lusitano a competir em Dressage nos Jogos Olímpicos.",
    curiosidades: ["Revolucionou a presença do Lusitano no Dressage"],
  };

  const mockCavaloCompleto: CavaloFamoso = {
    ...mockCavaloBasico,
    id: "test-2",
    nome: "Novilheiro",
    anoFalecimento: 1985,
    influenciaGenetica: 12,
    estatisticasDescendentes: {
      totalDescendentes: 4500,
      descendentesAprovados: 3200,
      campeoes: 10,
      reprodutoresAtivos: 50,
      paisesComDescendentes: ["Portugal", "Brasil"],
      melhoresFilhos: [{ nome: "Filho 1", conquista: "Campeão Nacional" }],
    },
  };

  describe("Variante Destaque", () => {
    it("deve renderizar variante destaque corretamente", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="destaque" />);

      // Verificar nome
      expect(screen.getByText("Rubi AR")).toBeInTheDocument();

      // Verificar apelido com aspas
      expect(screen.getByText('"The London Horse"')).toBeInTheDocument();

      // Verificar disciplina
      expect(screen.getByText("Dressage")).toBeInTheDocument();

      // Verificar linhagem
      expect(screen.getByText("Veiga")).toBeInTheDocument();

      // Verificar coudelaria
      expect(screen.getByText(/Andrade/)).toBeInTheDocument();

      // Verificar legado
      expect(
        screen.getByText(/Primeiro Lusitano a competir em Dressage nos Jogos Olímpicos/)
      ).toBeInTheDocument();

      // Verificar número de conquistas
      expect(screen.getByText("2 conquistas")).toBeInTheDocument();
    });

    it("deve exibir inicial do nome no placeholder de imagem", () => {
      const mockOnClick = vi.fn();
      const { container } = render(
        <CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="destaque" />
      );

      // Verificar que a inicial "R" está presente (case-sensitive)
      const inicial = container.querySelector(".text-7xl");
      expect(inicial?.textContent).toBe("R");
    });

    it("deve exibir badge de influência genética quando > 5%", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloCompleto} onClick={mockOnClick} variant="destaque" />);

      expect(screen.getByText("12%")).toBeInTheDocument();
    });

    it("não deve exibir badge de influência genética quando <= 5%", () => {
      const cavaloComInfluenciaBaixa = { ...mockCavaloBasico, influenciaGenetica: 3 };
      const mockOnClick = vi.fn();
      render(
        <CavaloCard cavalo={cavaloComInfluenciaBaixa} onClick={mockOnClick} variant="destaque" />
      );

      expect(screen.queryByText("3%")).not.toBeInTheDocument();
    });

    it("deve exibir estatísticas de descendentes quando disponíveis", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloCompleto} onClick={mockOnClick} variant="destaque" />);

      expect(screen.getByText("4500 desc.")).toBeInTheDocument();
    });

    it("não deve exibir estatísticas quando não disponíveis", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="destaque" />);

      expect(screen.queryByText(/desc\./)).not.toBeInTheDocument();
    });

    it("deve exibir ano de falecimento quando cavalo faleceu", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloCompleto} onClick={mockOnClick} variant="destaque" />);

      expect(screen.getByText(/- 1985/)).toBeInTheDocument();
    });

    it("não deve exibir ano de falecimento quando cavalo está vivo", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="destaque" />);

      expect(screen.queryByText(/- \d{4}/)).not.toBeInTheDocument();
    });

    it("deve chamar onClick quando clicado", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="destaque" />);

      const card = screen.getByRole("button");
      fireEvent.click(card);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Variante Normal", () => {
    it("deve renderizar variante normal (compact) corretamente", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="normal" />);

      // Verificar nome
      expect(screen.getByText("Rubi AR")).toBeInTheDocument();

      // Verificar ano e coudelaria
      expect(screen.getByText(/2003 • Andrade/)).toBeInTheDocument();

      // Verificar disciplina
      expect(screen.getByText("Dressage")).toBeInTheDocument();

      // Verificar linhagem
      expect(screen.getByText("Veiga")).toBeInTheDocument();

      // Verificar legado
      expect(screen.getByText(/Primeiro Lusitano a competir em Dressage/)).toBeInTheDocument();
    });

    it("deve exibir influência genética na variante normal", () => {
      const cavaloComInfluencia = { ...mockCavaloBasico, influenciaGenetica: 8 };
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={cavaloComInfluencia} onClick={mockOnClick} variant="normal" />);

      expect(screen.getByText("8%")).toBeInTheDocument();
      expect(screen.getByText(/Influência genética:/)).toBeInTheDocument();
    });

    it("não deve exibir apelido na variante normal", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="normal" />);

      // Apelido não aparece na variante normal
      expect(screen.queryByText('"The London Horse"')).not.toBeInTheDocument();
    });

    it("deve chamar onClick quando clicado na variante normal", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="normal" />);

      const card = screen.getByRole("button");
      fireEvent.click(card);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Variante padrão", () => {
    it("deve usar variante destaque por padrão quando não especificado", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} />);

      // Verificar características da variante destaque (apelido presente)
      expect(screen.getByText('"The London Horse"')).toBeInTheDocument();

      // Verificar número de conquistas (só presente em destaque)
      expect(screen.getByText("2 conquistas")).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ser um botão acessível", () => {
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="destaque" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });

    it("deve ter classes de toque apropriadas", () => {
      const mockOnClick = vi.fn();
      const { container } = render(
        <CavaloCard cavalo={mockCavaloBasico} onClick={mockOnClick} variant="destaque" />
      );

      const button = container.querySelector("button");
      expect(button?.className).toContain("touch-manipulation");
    });
  });

  describe("Casos extremos", () => {
    it("deve lidar com nome vazio graciosamente", () => {
      const cavaloNomeVazio = { ...mockCavaloBasico, nome: "" };
      const mockOnClick = vi.fn();
      const { container } = render(
        <CavaloCard cavalo={cavaloNomeVazio} onClick={mockOnClick} variant="destaque" />
      );

      // Não deve crashar, componente renderiza
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("deve lidar com conquistas vazias", () => {
      const cavaloSemConquistas = { ...mockCavaloBasico, conquistas: [] };
      const mockOnClick = vi.fn();
      render(<CavaloCard cavalo={cavaloSemConquistas} onClick={mockOnClick} variant="destaque" />);

      expect(screen.getByText("0 conquistas")).toBeInTheDocument();
    });

    it("deve lidar com legado longo graciosamente (line-clamp)", () => {
      const legadoLongo =
        "Este é um legado extremamente longo que deveria ser truncado pelo line-clamp-2 para não quebrar o layout do card e manter a consistência visual entre todos os cards da galeria. Normalmente este texto seria muito maior do que o espaço disponível.";
      const cavaloLegadoLongo = { ...mockCavaloBasico, legado: legadoLongo };
      const mockOnClick = vi.fn();
      const { container } = render(
        <CavaloCard cavalo={cavaloLegadoLongo} onClick={mockOnClick} variant="destaque" />
      );

      // Verificar que line-clamp está aplicado
      const legadoElement = container.querySelector(".line-clamp-2");
      expect(legadoElement).toBeInTheDocument();
      expect(legadoElement?.textContent).toContain("Este é um legado extremamente longo");
    });
  });
});
