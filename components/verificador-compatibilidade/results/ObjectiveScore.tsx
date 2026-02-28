"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Calendar } from "lucide-react";

interface ObjectiveScoreProps {
  resultado: any;
  garanhao: any;
  egua: any;
  objetivo?: string;
}

export default function ObjectiveScore({
  resultado,
  garanhao,
  egua,
  objetivo,
}: ObjectiveScoreProps) {
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
              return Math.round(
                s * 0.4 +
                  ((g.andamentos + e.andamentos) / 2) * 3.5 +
                  ((g.conformacao + e.conformacao) / 2) * 3 +
                  Math.min(((g.blup + e.blup) / 2 / 130) * 100, 100) * 0.15
              );
            } else if (objetivo === "reproducao") {
              const coiPenalty = resultado.coi > 6.25 ? -15 : resultado.coi > 3 ? -5 : 5;
              return Math.round(
                s * 0.5 +
                  Math.min(((g.blup + e.blup) / 2 / 130) * 100, 100) * 0.3 +
                  coiPenalty +
                  (g.aprovado && e.aprovado ? 10 : 0)
              );
            } else if (objetivo === "lazer") {
              const tempMedia = 7; // temperamento é string no tipo Cavalo — valor neutro 7
              return Math.round(s * 0.3 + tempMedia * 5 + ((g.saude + e.saude) / 2) * 4);
            } else {
              // show: prioriza conformação
              return Math.round(s * 0.3 + ((g.conformacao + e.conformacao) / 2) * 7);
            }
          })();
          const capped = Math.min(100, Math.max(0, adjustedScore));
          const OBJETIVO_LABELS: Record<string, string> = {
            competicao: "Alta Competição",
            reproducao: "Programa de Cria",
            lazer: "Lazer & Turismo",
            show: "Exposição/Show",
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
                  Score para {OBJETIVO_LABELS[objetivo] ?? objetivo}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  {diff >= 0 ? `+${diff}` : diff} pontos vs. score global ({s}/100) — pesos
                  ajustados para este objectivo
                </p>
              </div>
            </div>
          );
        })()}

      {/* Época Ideal — versão free */}
      <div className="bg-[var(--background-secondary)]/30 rounded-lg p-3 border border-[var(--border)]/60 mb-4 flex items-center gap-3">
        <Calendar size={16} className="text-emerald-400 shrink-0" />
        <p className="text-xs text-[var(--foreground-secondary)]">
          <strong className="text-emerald-400">Época ideal:</strong> Março–Maio (fotoperíodo longo
          estimula ovulação natural).
          {resultado.score >= 70
            ? " Esta combinação está pronta para cobrição primaveril."
            : " Consulte veterinário antes de avançar."}
        </p>
      </div>
    </>
  );
}
