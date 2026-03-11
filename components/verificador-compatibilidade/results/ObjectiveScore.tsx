"use client";

import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Cavalo, ResultadoCompatibilidade } from "../types";

interface ObjectiveScoreProps {
  resultado: ResultadoCompatibilidade;
  garanhao: Cavalo;
  egua: Cavalo;
  objetivo?: string;
}

export default function ObjectiveScore({
  resultado,
  garanhao,
  egua,
  objetivo,
}: ObjectiveScoreProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);

  return (
    <>
      {/* Score Ajustado por Objetivo */}
      {objetivo &&
        (() => {
          const s = resultado.score;
          const adjustedScore = (() => {
            const g = garanhao;
            const e = egua;
            if (objetivo === "competicao") {
              return Math.min(100, Math.round(
                s * 0.35 +
                  ((g.andamentos + e.andamentos) / 2) * 2.8 +
                  ((g.conformacao + e.conformacao) / 2) * 2.5 +
                  Math.min(((g.blup + e.blup) / 2 / 130) * 100, 100) * 0.12
              ));
            } else if (objetivo === "reproducao") {
              const coiPenalty = resultado.coi > 6.25 ? -15 : resultado.coi > 3 ? -5 : 5;
              const fertMap: Record<string, number> = { "Muito Alta": 10, "Alta": 7, "Normal": 5, "Baixa": 2 };
              const fertAvg = ((fertMap[g.fertilidade] ?? 5) + (fertMap[e.fertilidade] ?? 5)) / 2;
              return Math.round(
                s * 0.5 +
                  Math.min(((g.blup + e.blup) / 2 / 130) * 100, 100) * 0.3 +
                  coiPenalty +
                  (g.aprovado && e.aprovado ? 10 : 0) +
                  fertAvg * 1.0
              );
            } else if (objetivo === "lazer") {
              const TEMP_SCORES: Record<string, number> = {
                Calmo: 9,
                Equilibrado: 7,
                Energético: 5,
                Nervoso: 3,
              };
              const tempG = TEMP_SCORES[g.temperamento] ?? 7;
              const tempE = TEMP_SCORES[e.temperamento] ?? 7;
              const tempMedia = (tempG + tempE) / 2;
              return Math.round(s * 0.3 + tempMedia * 5 + ((g.saude + e.saude) / 2) * 4);
            } else if (objetivo === "show" || objetivo === "morfologia") {
              const tempScores: Record<string, number> = { Calmo: 8, Equilibrado: 7, "Energético": 5, Nervoso: 3 };
              const tempG = tempScores[g.temperamento] ?? 5;
              const tempE = tempScores[e.temperamento] ?? 5;
              return Math.min(100, Math.round(
                s * 0.2 +
                  ((g.conformacao + e.conformacao) / 2) * 5 +
                  ((g.saude + e.saude) / 2) * 1.5 +
                  ((tempG + tempE) / 2) * 1
              ));
            } else {
              return Math.round(s * 0.3 + ((g.conformacao + e.conformacao) / 2) * 7);
            }
          })();
          const capped = Math.min(100, Math.max(0, adjustedScore));
          const OBJETIVO_LABELS: Record<string, string> = {
            competicao: tr("Alta Competição", "High Competition", "Alta Competición"),
            reproducao: tr("Programa de Cria", "Breeding Programme", "Programa de Cría"),
            lazer: tr("Lazer & Turismo", "Leisure & Tourism", "Ocio & Turismo"),
            show: tr("Exposição/Show", "Exhibition/Show", "Exposición/Show"),
          };
          const diff = capped - s;
          return (
            <div
              className={`rounded-xl p-4 border mb-4 flex items-start gap-3 sm:gap-4 ${
                capped >= s
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-amber-500/5 border-amber-500/20"
              }`}
            >
              <div className="text-center shrink-0 min-w-[52px]">
                <p
                  className="text-3xl font-serif font-bold"
                  style={{ color: capped >= 70 ? "#10b981" : capped >= 50 ? "#f59e0b" : "#ef4444" }}
                >
                  {capped}
                </p>
                <p className="text-[10px] text-[var(--foreground-muted)]">/ 100</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {tr("Score para", "Score for", "Puntuación para")} {OBJETIVO_LABELS[objetivo] ?? objetivo}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  {diff >= 0 ? `+${diff}` : diff} {tr(
                    `pontos vs. score global (${s}/100) — pesos ajustados para este objectivo`,
                    `points vs. global score (${s}/100) — weights adjusted for this objective`,
                    `puntos vs. puntuación global (${s}/100) — pesos ajustados para este objetivo`
                  )}
                </p>
              </div>
            </div>
          );
        })()}

      {/* Época Ideal — versão free */}
      <div className="bg-[var(--background-secondary)]/30 rounded-lg p-3 border border-[var(--border)]/60 mb-4 flex items-center gap-3">
        <Calendar size={16} className="text-emerald-400 shrink-0" />
        <p className="text-xs text-[var(--foreground-secondary)]">
          <strong className="text-emerald-400">{tr("Época ideal:", "Ideal season:", "Época ideal:")}</strong> {tr(
            "Março–Maio (fotoperíodo longo estimula ovulação natural).",
            "March–May (long photoperiod stimulates natural ovulation).",
            "Marzo–Mayo (fotoperíodo largo estimula ovulación natural)."
          )}
          {resultado.score >= 70
            ? ` ${tr("Esta combinação está pronta para cobrição primaveril.", "This combination is ready for spring breeding.", "Esta combinación está lista para cubrición primaveral.")}`
            : ` ${tr("Consulte veterinário antes de avançar.", "Consult a veterinarian before proceeding.", "Consulte al veterinario antes de proceder.")}`}
        </p>
      </div>
    </>
  );
}
