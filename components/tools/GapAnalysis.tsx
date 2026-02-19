"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ============================================
// TIPOS
// ============================================

interface GapAnalysisCavalo {
  id: string;
  nome: string;
  conformacao: number;
  andamentos: number;
  temperamento: number;
  saude: number;
  blup: number;
}

interface GapAnalysisProps {
  cavalos: GapAnalysisCavalo[];
  cores?: string[];
  calcularScore: (c: GapAnalysisCavalo) => number;
}

// ============================================
// HELPERS
// ============================================

type AttrKey = "conformacao" | "andamentos" | "temperamento" | "saude" | "blup";

const ATTRIBUTES: { key: AttrKey; label: string; max: number }[] = [
  { key: "conformacao", label: "Conformação", max: 10 },
  { key: "andamentos", label: "Andamentos", max: 10 },
  { key: "temperamento", label: "Temperamento", max: 10 },
  { key: "saude", label: "Saúde", max: 10 },
  { key: "blup", label: "BLUP", max: 150 },
];

// Dicas de melhoria genéricas e seguras por atributo.
// Apresentadas apenas quando o cavalo tem score inferior ao melhor do grupo.
// Nota: são orientações educativas gerais; não substituem avaliação por perito qualificado.
const DICAS_MELHORIA: Record<AttrKey, string> = {
  conformacao:
    "Ginástica funcional e trabalho em equilíbrio podem valorizar a apresentação; avaliação de ferragem recomendada.",
  andamentos:
    "Os andamentos são maioritariamente hereditários; o treino sistemático pode melhorar a expressão em 10–20%.",
  temperamento:
    "Trabalho de desensibilização progressiva e exposição gradual a estímulos variados favorece a estabilidade comportamental.",
  saude:
    "Consulte um médico veterinário para definir um plano de saúde preventivo e actualização de profilaxias.",
  blup: "O índice BLUP melhora com o registo consistente de resultados em competições reconhecidas pela APSL ou FEI.",
};

// ============================================
// COMPONENTE
// ============================================

export default function GapAnalysis({
  cavalos,
  cores = ["#C5A059", "#3b82f6", "#ec4899", "#22c55e"],
  calcularScore,
}: GapAnalysisProps) {
  const { t } = useLanguage();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const analysis = useMemo(() => {
    // Find group best for each attribute
    const groupBest: Record<AttrKey, number> = {
      conformacao: 0,
      andamentos: 0,
      temperamento: 0,
      saude: 0,
      blup: 0,
    };

    for (const c of cavalos) {
      for (const attr of ATTRIBUTES) {
        if (c[attr.key] > groupBest[attr.key]) {
          groupBest[attr.key] = c[attr.key];
        }
      }
    }

    return cavalos.map((c, i) => {
      const currentScore = calcularScore(c);
      const gaps: {
        key: AttrKey;
        label: string;
        current: number;
        best: number;
        gap: number;
        max: number;
      }[] = [];

      for (const attr of ATTRIBUTES) {
        const current = c[attr.key];
        const best = groupBest[attr.key];
        if (current < best) {
          gaps.push({
            key: attr.key,
            label: attr.label,
            current,
            best,
            gap: best - current,
            max: attr.max,
          });
        }
      }

      // Improvement potential: calculate score with gaps filled
      const improved = { ...c } as GapAnalysisCavalo;
      for (const gap of gaps) {
        (improved as Record<AttrKey, number>)[gap.key] = gap.best;
      }
      const improvedScore = calcularScore(improved);
      const potential = improvedScore - currentScore;

      return {
        cavalo: c,
        color: cores[i] ?? "#C5A059",
        gaps,
        potential,
        currentScore,
      };
    });
  }, [cavalos, cores, calcularScore]);

  const title = (t.comparador as Record<string, string>).gap_title ?? "Análise de Lacunas";

  return (
    <div
      ref={wrapperRef}
      className="bg-[var(--background-secondary)]/50 rounded-2xl p-6 border border-[var(--border)]"
    >
      <h3 className="text-lg font-serif mb-6 text-[var(--foreground)]">{title}</h3>

      <div className="space-y-8">
        {analysis.map(({ cavalo, color, gaps, potential }) => (
          <div key={cavalo.id}>
            {/* Horse name header */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-[var(--foreground)]">{cavalo.nome}</span>
            </div>

            {gaps.length === 0 ? (
              <p className="text-xs text-emerald-400 ml-5">Líder em todas as categorias</p>
            ) : (
              <div className="space-y-3 ml-5">
                {gaps.map(({ key, label, current, best, gap, max }) => {
                  const currentPct = (current / max) * 100;
                  const bestPct = (best / max) * 100;

                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--foreground-secondary)]">{label}</span>
                        <span className="text-xs font-medium text-red-400">
                          -{key === "blup" ? gap.toFixed(0) : gap}
                        </span>
                      </div>

                      {/* Dual bar: potential (lighter) behind current */}
                      <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden">
                        {/* Potential bar (lighter shade) */}
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: animated ? `${bestPct}%` : "0%",
                            backgroundColor: `${color}30`,
                          }}
                        />
                        {/* Current bar */}
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: animated ? `${currentPct}%` : "0%",
                            backgroundColor: color,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-[var(--foreground-muted)]">
                          {current}
                          {key === "blup" ? "" : "/10"}
                        </span>
                        <span className="text-[10px] text-[var(--foreground-muted)]">
                          Melhor: {best}
                          {key === "blup" ? "" : "/10"}
                        </span>
                      </div>

                      {/* Dica contextual de melhoria — mostrada apenas quando há gap negativo */}
                      <p className="mt-1 text-xs italic text-[var(--foreground-muted)] leading-relaxed">
                        {DICAS_MELHORIA[key]}
                      </p>
                    </div>
                  );
                })}

                {/* Improvement potential total */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--border)]">
                  <span className="text-xs font-medium text-[var(--foreground-secondary)]">
                    Potencial de Melhoria
                  </span>
                  <span className="text-sm font-bold" style={{ color }}>
                    +{potential} pts
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
