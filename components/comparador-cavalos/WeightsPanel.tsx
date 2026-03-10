"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import Tooltip from "@/components/tools/Tooltip";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { CategoryWeights } from "./types";
import { DEFAULT_WEIGHTS } from "./calcular";

interface WeightsPanelProps {
  weights: CategoryWeights;
  onChange: (weights: CategoryWeights) => void;
}

export default function WeightsPanel({ weights, onChange }: WeightsPanelProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const [open, setOpen] = useState(false);

  const isDefault = useMemo(() => {
    return (Object.keys(DEFAULT_WEIGHTS) as (keyof CategoryWeights)[]).every(
      (k) => weights[k] === DEFAULT_WEIGHTS[k]
    );
  }, [weights]);

  const totalWeight = useMemo(
    () => Object.values(weights).reduce((a, b) => a + b, 0),
    [weights]
  );

  const categories: { key: keyof CategoryWeights; label: string }[] = useMemo(
    () => [
      { key: "linhagem", label: tr("Linhagem", "Lineage", "Linaje") },
      { key: "treino", label: tr("Treino", "Training", "Entrenamiento") },
      { key: "conformacao", label: tr("Conformação", "Conformation", "Conformación") },
      { key: "andamentos", label: tr("Andamentos", "Gaits", "Aires") },
      { key: "idade", label: tr("Idade", "Age", "Edad") },
      { key: "competicoes", label: tr("Competições", "Competitions", "Competiciones") },
      { key: "altura", label: tr("Altura", "Height", "Altura") },
      { key: "temperamento", label: tr("Temperamento", "Temperament", "Temperamento") },
      { key: "saude", label: tr("Saúde", "Health", "Salud") },
      { key: "blup", label: "BLUP" },
      { key: "elevacao", label: tr("Elevação", "Elevation", "Elevación") },
      { key: "regularidade", label: tr("Regularidade", "Regularity", "Regularidad") },
      { key: "premios", label: tr("Prémios", "Awards", "Premios") },
      { key: "registoAPSL", label: tr("Registo APSL", "APSL Registration", "Registro APSL") },
    ],
    [tr]
  );

  const handleChange = (key: keyof CategoryWeights, value: number) => {
    onChange({ ...weights, [key]: value });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_WEIGHTS });
  };

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-2xl border border-[var(--border)] overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--background-card)]/30 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <SlidersHorizontal size={16} className="text-[#C5A059]" />
          <span className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider">
            {tr("Personalizar Pesos", "Customize Weights", "Personalizar Pesos")}
          </span>
          {!isDefault && (
            <span className="ml-1 px-2 py-0.5 text-[10px] font-semibold bg-[#C5A059]/15 text-[#C5A059] rounded-full">
              {tr("Personalizado", "Custom", "Personalizado")}
            </span>
          )}
          <Tooltip
            text={tr(
              "Ajuste a importância de cada categoria no score global. Os pesos são normalizados para somar 100%.",
              "Adjust the importance of each category in the global score. Weights are normalised to sum 100%.",
              "Ajuste la importancia de cada categoría en el score global. Los pesos se normalizan para sumar 100%."
            )}
          />
        </span>
        <ChevronDown
          size={16}
          className={`text-[var(--foreground-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expandable body */}
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-[var(--border)]/50 animate-[fadeSlideIn_0.25s_ease-out_forwards]">
          <p className="text-xs text-[var(--foreground-muted)] mb-4 leading-relaxed">
            {tr(
              "Mova os cursores para alterar o peso relativo de cada categoria. Os scores são recalculados em tempo real.",
              "Move the sliders to change the relative weight of each category. Scores are recalculated in real time.",
              "Mueva los deslizadores para cambiar el peso relativo de cada categoría. Los scores se recalculan en tiempo real."
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {categories.map(({ key, label }) => {
              const value = weights[key];
              const pct = totalWeight > 0 ? Math.round((value / totalWeight) * 100) : 0;
              const defaultPct =
                Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0) > 0
                  ? Math.round(
                      (DEFAULT_WEIGHTS[key] /
                        Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0)) *
                        100
                    )
                  : 0;
              const isChanged = weights[key] !== DEFAULT_WEIGHTS[key];

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor={`weight-${key}`}
                      className={`text-xs ${isChanged ? "text-[#C5A059] font-medium" : "text-[var(--foreground-secondary)]"}`}
                    >
                      {label}
                    </label>
                    <span className="text-xs font-medium text-[#C5A059] tabular-nums min-w-[32px] text-right">
                      {pct}%
                      {isChanged && (
                        <span className="text-[var(--foreground-muted)] ml-1 text-[10px]">
                          ({defaultPct}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <input
                    id={`weight-${key}`}
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={value}
                    onChange={(e) => handleChange(key, +e.target.value)}
                    className="w-full h-1.5 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer touch-pan-x"
                    style={{ accentColor: "#C5A059" }}
                    aria-label={`${label}: ${pct}%`}
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={50}
                    aria-valuetext={`${pct}%`}
                  />
                </div>
              );
            })}
          </div>

          {/* Footer: reset + custom indicator */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]/30">
            {!isDefault ? (
              <div className="flex items-center gap-2 text-xs text-[#C5A059]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                {tr(
                  "Pesos personalizados activos — scores recalculados",
                  "Custom weights active — scores recalculated",
                  "Pesos personalizados activos — scores recalculados"
                )}
              </div>
            ) : (
              <span className="text-xs text-[var(--foreground-muted)]">
                {tr("Pesos por defeito", "Default weights", "Pesos por defecto")}
              </span>
            )}
            {!isDefault && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--foreground-muted)]"
              >
                <RotateCcw size={12} />
                {tr("Repor Defeito", "Reset Defaults", "Restablecer")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
