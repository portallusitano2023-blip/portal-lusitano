"use client";

import { TrendingUp, ArrowUpRight } from "lucide-react";
import type { FormData, Resultado } from "./types";
import { calcularValor } from "./utils";

interface SensitivityPanelProps {
  form: FormData;
  resultado: Resultado;
}

const TREINO_ORDER: FormData["treino"][] = [
  "potro",
  "desbravado",
  "iniciado",
  "elementar",
  "medio",
  "avancado",
  "alta_escola",
  "grand_prix",
];

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

const COMP_ORDER: FormData["competicoes"][] = [
  "nenhuma",
  "regional",
  "nacional",
  "cdi1",
  "cdi3",
  "cdi5",
  "campeonato_mundo",
];

const COMP_LABELS: Record<string, string> = {
  nenhuma: "Nenhuma",
  regional: "Regional",
  nacional: "Nacional",
  cdi1: "CDI 1*",
  cdi3: "CDI 3*",
  cdi5: "CDI 5*",
  campeonato_mundo: "Camp. Mundo",
};

const LINHAGEM_ORDER: FormData["linhagem"][] = [
  "desconhecida",
  "comum",
  "registada",
  "certificada",
  "premium",
  "elite",
];

const LINHAGEM_LABELS: Record<string, string> = {
  desconhecida: "Desconhecida",
  comum: "Comum",
  registada: "Registada",
  certificada: "Certificada",
  premium: "Premium",
  elite: "Elite",
};

const SAUDE_ORDER: FormData["saude"][] = ["regular", "bom", "muito_bom", "excelente"];

const SAUDE_LABELS: Record<string, string> = {
  regular: "Regular",
  bom: "Bom",
  muito_bom: "Muito Bom",
  excelente: "Excelente",
};

interface Scenario {
  label: string;
  description: string;
  delta: number;
  percentage: number;
}

function buildScenarios(form: FormData, resultado: Resultado): Scenario[] {
  const scenarios: Scenario[] = [];
  const current = resultado.valorFinal;

  // 1. Next training level
  const treinoIdx = TREINO_ORDER.indexOf(form.treino);
  if (treinoIdx >= 0 && treinoIdx < TREINO_ORDER.length - 1) {
    const nextTreino = TREINO_ORDER[treinoIdx + 1];
    const nextResult = calcularValor({ ...form, treino: nextTreino });
    const delta = nextResult.valorFinal - current;
    if (delta > 0) {
      scenarios.push({
        label: `Treino → ${TREINO_LABELS[nextTreino]}`,
        description: "Próximo nível de treino",
        delta,
        percentage: Math.round((delta / current) * 100),
      });
    }
  }

  // 2. Next competition level
  const compIdx = COMP_ORDER.indexOf(form.competicoes);
  if (compIdx >= 0 && compIdx < COMP_ORDER.length - 1) {
    const nextComp = COMP_ORDER[compIdx + 1];
    const nextResult = calcularValor({ ...form, competicoes: nextComp });
    const delta = nextResult.valorFinal - current;
    if (delta > 0) {
      scenarios.push({
        label: `Competição → ${COMP_LABELS[nextComp]}`,
        description: "Próximo nível competitivo",
        delta,
        percentage: Math.round((delta / current) * 100),
      });
    }
  }

  // 3. Better health
  const saudeIdx = SAUDE_ORDER.indexOf(form.saude);
  if (saudeIdx >= 0 && saudeIdx < SAUDE_ORDER.length - 1) {
    const nextSaude = SAUDE_ORDER[saudeIdx + 1];
    const nextResult = calcularValor({ ...form, saude: nextSaude });
    const delta = nextResult.valorFinal - current;
    if (delta > 0) {
      scenarios.push({
        label: `Saúde → ${SAUDE_LABELS[nextSaude]}`,
        description: "Melhorar estado de saúde",
        delta,
        percentage: Math.round((delta / current) * 100),
      });
    }
  }

  // 4. Better lineage
  const linhagemIdx = LINHAGEM_ORDER.indexOf(form.linhagem);
  if (linhagemIdx >= 0 && linhagemIdx < LINHAGEM_ORDER.length - 1) {
    const nextLinhagem = LINHAGEM_ORDER[linhagemIdx + 1];
    const nextResult = calcularValor({ ...form, linhagem: nextLinhagem });
    const delta = nextResult.valorFinal - current;
    if (delta > 0) {
      scenarios.push({
        label: `Linhagem → ${LINHAGEM_LABELS[nextLinhagem]}`,
        description: "Próximo nível de linhagem",
        delta,
        percentage: Math.round((delta / current) * 100),
      });
    }
  }

  return scenarios.sort((a, b) => b.delta - a.delta);
}

export default function SensitivityPanel({ form, resultado }: SensitivityPanelProps) {
  const scenarios = buildScenarios(form, resultado);

  if (scenarios.length === 0) return null;

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl border border-[var(--border)] p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
        <TrendingUp size={15} className="text-[#C5A059]" />
        Análise What-If
      </h3>
      <p className="text-xs text-[var(--foreground-muted)] mb-4">
        Impacto estimado de cada melhoria no valor do cavalo:
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {scenarios.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 bg-[var(--background-card)]/50 rounded-lg border border-[var(--border)]/50 hover:border-emerald-500/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ArrowUpRight size={14} className="text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--foreground)] truncate">{s.label}</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">{s.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-emerald-400">
                +{s.delta.toLocaleString("pt-PT")}€
              </span>
              <span className="block text-[10px] text-emerald-400/70">+{s.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
