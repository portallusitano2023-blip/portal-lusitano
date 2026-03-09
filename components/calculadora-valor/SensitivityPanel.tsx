"use client";

import { useMemo } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import type { FormData, Resultado } from "./types";
import { calcularValor } from "./utils";
import { TREINO_LABELS, COMP_LABELS, SAUDE_LABELS, LINHAGEM_LABELS } from "@/lib/tools/shared-data";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

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

const COMP_ORDER: FormData["competicoes"][] = [
  "nenhuma",
  "regional",
  "nacional",
  "cdi1",
  "cdi3",
  "cdi5",
  "campeonato_mundo",
];

const LINHAGEM_ORDER: FormData["linhagem"][] = [
  "desconhecida",
  "comum",
  "registada",
  "certificada",
  "premium",
  "elite",
];

const SAUDE_ORDER: FormData["saude"][] = ["regular", "bom", "muito_bom", "excelente"];

interface Scenario {
  label: string;
  description: string;
  delta: number;
  percentage: number;
}

function buildScenarios(form: FormData, resultado: Resultado, tr: (pt: string, en: string, es: string) => string): Scenario[] {
  const scenarios: Scenario[] = [];
  const current = resultado.valorFinal;

  // 1. Next training level
  const treinoIdx = TREINO_ORDER.indexOf(form.treino);
  if (treinoIdx >= 0 && treinoIdx < TREINO_ORDER.length - 1) {
    const nextTreino = TREINO_ORDER[treinoIdx + 1];
    const nextResult = calcularValor({ ...form, treino: nextTreino }, tr);
    const delta = nextResult.valorFinal - current;
    if (delta > 0) {
      scenarios.push({
        label: `${tr("Treino", "Training", "Entrenamiento")} → ${TREINO_LABELS[nextTreino]}`,
        description: tr("Próximo nível de treino", "Next training level", "Siguiente nivel de entrenamiento"),
        delta,
        percentage: Math.round((delta / current) * 100),
      });
    }
  }

  // 2. Next competition level
  const compIdx = COMP_ORDER.indexOf(form.competicoes);
  if (compIdx >= 0 && compIdx < COMP_ORDER.length - 1) {
    const nextComp = COMP_ORDER[compIdx + 1];
    const nextResult = calcularValor({ ...form, competicoes: nextComp }, tr);
    const delta = nextResult.valorFinal - current;
    if (delta > 0) {
      scenarios.push({
        label: `${tr("Competição", "Competition", "Competición")} → ${COMP_LABELS[nextComp]}`,
        description: tr("Próximo nível competitivo", "Next competition level", "Siguiente nivel competitivo"),
        delta,
        percentage: Math.round((delta / current) * 100),
      });
    }
  }

  // 3. Better health
  const saudeIdx = SAUDE_ORDER.indexOf(form.saude);
  if (saudeIdx >= 0 && saudeIdx < SAUDE_ORDER.length - 1) {
    const nextSaude = SAUDE_ORDER[saudeIdx + 1];
    const nextResult = calcularValor({ ...form, saude: nextSaude }, tr);
    const delta = nextResult.valorFinal - current;
    if (delta > 0) {
      scenarios.push({
        label: `${tr("Saúde", "Health", "Salud")} → ${SAUDE_LABELS[nextSaude]}`,
        description: tr("Melhorar estado de saúde", "Improve health status", "Mejorar estado de salud"),
        delta,
        percentage: Math.round((delta / current) * 100),
      });
    }
  }

  // 4. Better lineage
  const linhagemIdx = LINHAGEM_ORDER.indexOf(form.linhagem);
  if (linhagemIdx >= 0 && linhagemIdx < LINHAGEM_ORDER.length - 1) {
    const nextLinhagem = LINHAGEM_ORDER[linhagemIdx + 1];
    const nextResult = calcularValor({ ...form, linhagem: nextLinhagem }, tr);
    const delta = nextResult.valorFinal - current;
    if (delta > 0) {
      scenarios.push({
        label: `${tr("Linhagem", "Lineage", "Linaje")} → ${LINHAGEM_LABELS[nextLinhagem]}`,
        description: tr("Próximo nível de linhagem", "Next lineage level", "Siguiente nivel de linaje"),
        delta,
        percentage: Math.round((delta / current) * 100),
      });
    }
  }

  return scenarios.sort((a, b) => b.delta - a.delta);
}

export default function SensitivityPanel({ form, resultado }: SensitivityPanelProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const scenarios = useMemo(() => {
    try {
      return buildScenarios(form, resultado, tr);
    } catch {
      return [];
    }
  }, [form, resultado, tr]);

  if (scenarios.length === 0) return null;

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl border border-[var(--border)] p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
        <TrendingUp size={15} className="text-[#C5A059]" />
        {tr("Análise What-If", "What-If Analysis", "Análisis What-If")}
      </h3>
      <p className="text-xs text-[var(--foreground-muted)] mb-4">
        {tr(
          "Impacto estimado de cada melhoria no valor do cavalo:",
          "Estimated impact of each improvement on horse value:",
          "Impacto estimado de cada mejora en el valor del caballo:"
        )}
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
