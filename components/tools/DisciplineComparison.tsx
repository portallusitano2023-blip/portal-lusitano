"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Award, Swords, Target, Carrot, Heart, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { FormData } from "@/components/calculadora-valor/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DisciplineComparisonProps {
  form: FormData;
  valorBase: number;
}

interface DisciplineRow {
  name: string;
  icon: React.ReactNode;
  multiplier: number;
  suitability: number; // 0-5
  estimatedValue: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function starsFromAvg(avg: number): number {
  // avg is the average of relevant attributes (each 0-10)
  // Convert to 0-5 stars
  return clamp(Math.round(avg / 2), 0, 5);
}

function formatEUR(value: number): string {
  return value.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

// ---------------------------------------------------------------------------
// Star rating sub-component
// ---------------------------------------------------------------------------

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de ${max} estrelas`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width={14}
          height={14}
          viewBox="0 0 16 16"
          fill={i < rating ? "#C5A059" : "rgba(255,255,255,0.1)"}
          aria-hidden="true"
        >
          <path d="M8 1.12l1.85 3.76 4.15.6-3 2.93.71 4.13L8 10.67l-3.71 1.87.71-4.13-3-2.93 4.15-.6L8 1.12z" />
        </svg>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DisciplineComparison({ form, valorBase }: DisciplineComparisonProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setAnimated(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const calc = t.calculadora as Record<string, string>;

  // --- Compute disciplines ---
  const disciplines: DisciplineRow[] = useMemo(() => {
    const {
      elevacao,
      andamentos,
      regularidade,
      temperamento,
      vontadeTrabalho,
      sensibilidade,
      morfologia,
    } = form;

    const raw: {
      name: string;
      icon: React.ReactNode;
      multiplier: number;
      relevantAvg: number;
    }[] = [
      {
        name: calc.disc_dressage ?? "Dressage",
        icon: <Award size={16} className="text-[var(--gold,#C5A059)]" />,
        multiplier: 0.8 + ((elevacao + andamentos + regularidade) / 30) * 0.6,
        relevantAvg: (elevacao + andamentos + regularidade) / 3,
      },
      {
        name: calc.disc_working_eq ?? "Working Equitation",
        icon: <Swords size={16} className="text-[var(--gold,#C5A059)]" />,
        multiplier: 0.8 + ((temperamento + vontadeTrabalho + andamentos) / 30) * 0.5,
        relevantAvg: (temperamento + vontadeTrabalho + andamentos) / 3,
      },
      {
        name: calc.disc_toureio ?? "Toureio",
        icon: <Target size={16} className="text-[var(--gold,#C5A059)]" />,
        multiplier: 0.7 + ((temperamento + sensibilidade) / 20) * 0.6,
        relevantAvg: (temperamento + sensibilidade) / 2,
      },
      {
        name: calc.disc_atrelagem ?? "Atrelagem",
        icon: <Carrot size={16} className="text-[var(--gold,#C5A059)]" />,
        multiplier: 0.7 + ((morfologia + andamentos + temperamento) / 30) * 0.5,
        relevantAvg: (morfologia + andamentos + temperamento) / 3,
      },
      {
        name: calc.disc_lazer ?? "Lazer",
        icon: <Heart size={16} className="text-[var(--gold,#C5A059)]" />,
        multiplier: 0.9 + (temperamento / 10) * 0.2,
        relevantAvg: temperamento,
      },
      {
        name: calc.disc_ensino ?? "Ensino / Escola",
        icon: <GraduationCap size={16} className="text-[var(--gold,#C5A059)]" />,
        multiplier: 0.8 + ((temperamento + sensibilidade + vontadeTrabalho) / 30) * 0.4,
        relevantAvg: (temperamento + sensibilidade + vontadeTrabalho) / 3,
      },
    ];

    return raw
      .map((d) => ({
        name: d.name,
        icon: d.icon,
        multiplier: d.multiplier,
        suitability: starsFromAvg(d.relevantAvg),
        estimatedValue: Math.round(valorBase * d.multiplier),
      }))
      .sort((a, b) => b.suitability - a.suitability || b.estimatedValue - a.estimatedValue);
  }, [form, valorBase, calc]);

  // For proportional bars
  const maxValue = useMemo(
    () => Math.max(...disciplines.map((d) => d.estimatedValue), 1),
    [disciplines]
  );

  const bestIdx = 0; // Already sorted by suitability desc

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-card,#111)] overflow-hidden"
      role="region"
      aria-label={calc.discipline_title ?? "Valor Estimado por Disciplina"}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border,rgba(255,255,255,0.1))]">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--gold,#C5A059)]/10 flex items-center justify-center">
          <Award size={18} className="text-[var(--gold,#C5A059)]" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-serif font-semibold text-[var(--foreground,#ededed)]">
            {calc.discipline_title ?? "Valor por Disciplina"}
          </h3>
          <p className="text-xs text-[var(--foreground-muted,#71717a)]">
            {calc.discipline_subtitle ?? "Estimativa de valor consoante a aptidao"}
          </p>
        </div>
      </div>

      {/* Discipline rows */}
      <div className="divide-y divide-[var(--border,rgba(255,255,255,0.1))]">
        {disciplines.map((disc, i) => {
          const isBest = i === bestIdx;
          const barPercent = (disc.estimatedValue / maxValue) * 100;

          return (
            <div
              key={disc.name}
              className={`px-5 py-3.5 transition-all duration-500 ${
                isBest
                  ? "border-l-2 border-l-[var(--gold,#C5A059)] bg-[var(--gold,#C5A059)]/[0.04]"
                  : ""
              }`}
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.5s ease-out ${i * 100}ms, transform 0.5s ease-out ${i * 100}ms`,
              }}
            >
              {/* Top line: icon, name, stars, value */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--gold,#C5A059)]/10 flex items-center justify-center">
                  {disc.icon}
                </div>

                <span
                  className={`text-sm font-semibold flex-1 min-w-0 truncate ${
                    isBest ? "text-[var(--gold,#C5A059)]" : "text-[var(--foreground,#ededed)]"
                  }`}
                >
                  {disc.name}
                  {isBest && (
                    <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-[var(--gold,#C5A059)] opacity-70">
                      {calc.discipline_best_match ?? "Melhor aptidao"}
                    </span>
                  )}
                </span>

                <StarRating rating={disc.suitability} />

                <span
                  className={`text-sm font-serif font-bold tabular-nums whitespace-nowrap ${
                    isBest ? "text-[var(--gold,#C5A059)]" : "text-[var(--foreground,#ededed)]"
                  }`}
                >
                  {formatEUR(disc.estimatedValue)}
                </span>
              </div>

              {/* Bar */}
              <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: animated ? `${barPercent}%` : "0%",
                    background: isBest
                      ? "linear-gradient(90deg, #C5A059, #D4AF6A)"
                      : "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.35))",
                    transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${200 + i * 100}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
