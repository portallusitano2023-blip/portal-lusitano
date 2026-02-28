"use client";

import { Zap } from "lucide-react";
import { calcularValor } from "../utils";
import type { FormData, Resultado } from "../types";

interface ScenarioSimulatorProps {
  form: FormData;
  resultado: Resultado;
}

export default function ScenarioSimulator({ form, resultado }: ScenarioSimulatorProps) {
  const TREINO_PROGRESSAO: Record<string, string> = {
    potro: "desbravado",
    desbravado: "iniciado",
    iniciado: "elementar",
    elementar: "medio",
    medio: "avancado",
    avancado: "alta_escola",
    alta_escola: "grand_prix",
  };
  const TREINO_LABELS: Record<string, string> = {
    potro: "Potro",
    desbravado: "Desbravado",
    iniciado: "Iniciado",
    elementar: "Elementar",
    medio: "Médio",
    avancado: "Avançado",
    alta_escola: "Alta Escola",
    grand_prix: "Grand Prix",
  };

  type Cenario = {
    titulo: string;
    descricao: string;
    valorNovo: number;
    delta: number;
    deltaPercent: number;
    emoji: string;
  };

  const cenarios: Cenario[] = [];

  // Cenário 1: Subir nível de treino (se não for já o máximo)
  if (TREINO_PROGRESSAO[form.treino]) {
    const novoTreino = TREINO_PROGRESSAO[form.treino];
    const novoForm = { ...form, treino: novoTreino as FormData["treino"] };
    const novoResultado = calcularValor(novoForm);
    cenarios.push({
      titulo: `Treino → ${TREINO_LABELS[novoTreino] ?? novoTreino}`,
      descricao: "Progressão de nível de treino",
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "📈",
    });
  }

  // Cenário 2: Documentação Veterinária Completa
  if (!form.raioX || !form.exameVeterinario) {
    const novoForm = { ...form, raioX: true, exameVeterinario: true };
    const novoResultado = calcularValor(novoForm);
    cenarios.push({
      titulo: "Documentação Veterinária Completa",
      descricao: "Raio-X + Exame veterinário",
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "🩺",
    });
  }

  // Cenário 3: Mudar mercado para Alemanha (se estiver em PT)
  if (form.mercado === "Portugal") {
    const novoForm = { ...form, mercado: "Alemanha" };
    const novoResultado = calcularValor(novoForm);
    cenarios.push({
      titulo: "Venda para Mercado Alemão",
      descricao: "Reorientar para mercado internacional",
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "🌍",
    });
  }

  // Cenário 4: Subir competições
  const COMP_UPGRADE: Record<string, string> = {
    nenhuma: "regional",
    regional: "nacional",
    nacional: "cdi1",
    cdi1: "cdi3",
  };
  const COMP_LABELS: Record<string, string> = {
    regional: "Provas Regionais",
    nacional: "Provas Nacionais",
    cdi1: "CDI 1*",
    cdi3: "CDI 3*",
  };
  if (COMP_UPGRADE[form.competicoes]) {
    const novoComp = COMP_UPGRADE[form.competicoes];
    const novoForm = { ...form, competicoes: novoComp as FormData["competicoes"] };
    const novoResultado = calcularValor(novoForm);
    cenarios.push({
      titulo: `Competir em ${COMP_LABELS[novoComp] ?? novoComp}`,
      descricao: "Progressão no palmarés desportivo",
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "🏆",
    });
  }

  // Cenário 5: Certificado de exportação
  if (!(form.certificadoExportacao ?? false) && form.mercado !== "Portugal") {
    const novoForm = { ...form, certificadoExportacao: true };
    const novoResultado = calcularValor(novoForm);
    cenarios.push({
      titulo: "Certificado de Exportação",
      descricao: "Documentação para venda internacional",
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "📜",
    });
  }

  if (cenarios.length === 0) return null;

  // Ordena por delta (maior primeiro), mostra top 4
  const top = cenarios.sort((a, b) => b.delta - a.delta).slice(0, 4);

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)] mb-6">
      <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-1 flex items-center gap-2">
        <Zap size={15} className="text-[#C5A059]" />
        Simulador de Cenários
      </h3>
      <p className="text-xs text-[var(--foreground-muted)] mb-4">
        Impacto estimado de cada melhoria no valor actual de{" "}
        {resultado.valorFinal.toLocaleString("pt-PT")}€
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {top.map((c, i) => (
          <div
            key={i}
            className="bg-[var(--background-card)]/50 rounded-lg p-3 border border-[var(--border)]/60 flex items-center gap-3"
          >
            <span className="text-xl shrink-0">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">{c.titulo}</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">{c.descricao}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-emerald-400">
                +{c.delta.toLocaleString("pt-PT")}€
              </p>
              <p className="text-[10px] text-emerald-500/70">+{c.deltaPercent}%</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[var(--foreground-muted)]/40 mt-3">
        Simulações baseadas no modelo interno — valores ilustrativos, não constituem garantia.
      </p>
    </div>
  );
}
