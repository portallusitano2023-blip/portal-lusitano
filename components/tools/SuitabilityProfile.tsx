"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ============================================
// TIPOS
// ============================================

interface SuitabilityProfileCavalo {
  id: string;
  nome: string;
  treino: string;
  conformacao: number;
  andamentos: number;
  temperamento: number;
  saude: number;
  blup: number;
  competicoes: string;
  sexo: string;
  idade: number;
  preco: number;
}

interface SuitabilityProfileProps {
  cavalos: SuitabilityProfileCavalo[];
  cores?: string[];
}

// ============================================
// HELPERS
// ============================================

const _TREINO_MAP: Record<string, number> = {
  Potro: 1,
  Desbravado: 2,
  Iniciado: 3,
  Elementar: 4,
  Medio: 5,
  Médio: 5,
  Avancado: 6,
  Avançado: 6,
  "Alta Escola": 7,
  "Grand Prix": 8,
};

const COMP_BONUS: Record<string, number> = {
  Nenhuma: 3,
  Regional: 5,
  Nacional: 7,
  Internacional: 9,
};

const BAR_COLORS = {
  competition: "#3b82f6",
  leisure: "#22c55e",
  breeding: "#ec4899",
  investment: "#f59e0b",
} as const;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function calcSuitability(c: SuitabilityProfileCavalo) {
  const compBonus = COMP_BONUS[c.competicoes] ?? 3;
  const ageFactor = c.idade >= 4 && c.idade <= 12 ? 8 : c.idade < 4 ? 5 : 4;
  const blupNorm = c.blup / 15;

  const treinoLevel = _TREINO_MAP[c.treino] ?? 4;

  const competition = clamp(
    (c.andamentos * 0.3 + c.conformacao * 0.2 + treinoLevel * 0.3 + compBonus * 0.2) * 10,
    0,
    100
  );
  const leisure = clamp(
    (c.temperamento * 0.4 + c.saude * 0.3 + c.andamentos * 0.15 + c.conformacao * 0.15) * 10,
    0,
    100
  );
  const breeding = clamp(
    (c.conformacao * 0.3 + blupNorm * 0.3 + c.saude * 0.2 + c.andamentos * 0.2) * 10,
    0,
    100
  );
  const investment = clamp(
    (blupNorm * 0.2 + treinoLevel * 0.2 + c.conformacao * 0.2 + ageFactor * 0.2 + compBonus * 0.2) *
      10,
    0,
    100
  );

  return {
    competition: Math.round(competition),
    leisure: Math.round(leisure),
    breeding: Math.round(breeding),
    investment: Math.round(investment),
  };
}

// ============================================
// COMPONENTE
// ============================================

export default function SuitabilityProfile({
  cavalos,
  cores = ["#C5A059", "#3b82f6", "#ec4899", "#22c55e"],
}: SuitabilityProfileProps) {
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

  const profiles = useMemo(
    () =>
      cavalos.map((c, i) => ({
        cavalo: c,
        color: cores[i] ?? "#C5A059",
        scores: calcSuitability(c),
      })),
    [cavalos, cores]
  );

  const title = (t.comparador as Record<string, string>).suitability_title ?? "Perfil de Aptidão";

  const barLabels: {
    key: keyof ReturnType<typeof calcSuitability>;
    label: string;
    color: string;
  }[] = [
    { key: "competition", label: "Competição", color: BAR_COLORS.competition },
    { key: "leisure", label: "Lazer", color: BAR_COLORS.leisure },
    { key: "breeding", label: "Criação", color: BAR_COLORS.breeding },
    { key: "investment", label: "Investimento", color: BAR_COLORS.investment },
  ];

  return (
    <div
      ref={wrapperRef}
      className="bg-[var(--background-secondary)]/50 rounded-2xl p-6 border border-[var(--border)]"
    >
      <h3 className="text-lg font-serif mb-6 text-[var(--foreground)]">{title}</h3>

      <div className="space-y-6">
        {profiles.map(({ cavalo, color, scores }) => (
          <div key={cavalo.id}>
            {/* Horse name with colored dot */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-[var(--foreground)]">{cavalo.nome}</span>
            </div>

            {/* Bars */}
            <div className="space-y-2">
              {barLabels.map(({ key, label, color: barColor }) => {
                const value = scores[key];
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--foreground-muted)] w-24 flex-shrink-0">
                      {label}
                    </span>
                    <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: animated ? `${value}%` : "0%",
                          backgroundColor: barColor,
                          boxShadow: `0 0 8px ${barColor}40`,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-medium tabular-nums w-10 text-right"
                      style={{ color: barColor }}
                    >
                      {value}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
