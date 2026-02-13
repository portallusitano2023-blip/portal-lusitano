"use client";

import { useMemo } from "react";
import { BarChart3, Feather } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result } from "@/components/analise-perfil/types";

interface AffinityTabProps {
  result: Result;
  scorePercentages: Record<string, number>;
}

const PROFILE_COLORS: Record<string, string> = {
  competidor: "#3b82f6",
  tradicional: "#C5A059",
  criador: "#ec4899",
  amador: "#22c55e",
  investidor: "#f59e0b",
};

const PROFILE_DESCRIPTIONS: Record<string, string> = {
  competidor: "Foco em competicao, alto desempenho e treino intensivo",
  tradicional: "Preservacao das tradicoes equestres portuguesas",
  criador: "Seleccao genetica, reproducao e melhoramento da raca",
  amador: "Lazer, passeio e prazer de montar",
  investidor: "Retorno financeiro, valorizacao e mercado equestre",
};

const PROFILE_LABELS: Record<string, string> = {
  competidor: "Competidor",
  tradicional: "Tradicional",
  criador: "Criador",
  amador: "Amador",
  investidor: "Investidor",
};

const HORSE_RECOMMENDATIONS: Record<string, string> = {
  competidor: "Cavalo de 7-12 anos, nivel medio ou avancado, com experiencia em competicao",
  tradicional: "Cavalo de linhagem certificada, com bons andamentos e temperamento docil",
  criador: "Egua ou garanhao aprovado, com BLUP acima da media e COI controlado",
  amador: "Cavalo calmo, entre 8-14 anos, com treino basico a elementar",
  investidor: "Cavalo jovem (3-6 anos) de linhagem premium ou elite",
};

export default function AffinityTab({ result, scorePercentages }: AffinityTabProps) {
  const { t } = useLanguage();

  const ranked = useMemo(() => {
    const entries = Object.entries(scorePercentages)
      .map(([profile, percentage]) => ({ profile, percentage }))
      .sort((a, b) => b.percentage - a.percentage);
    return entries;
  }, [scorePercentages]);

  const topProfile = ranked.length > 0 ? ranked[0].profile : result.profile;

  return (
    <div className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Affinity bars */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-2">
          <BarChart3 className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.affinity_title}
        </h3>
        <p className="text-sm text-[var(--foreground-muted)] mb-8">
          Distribuicao de afinidade com cada perfil equestre
        </p>

        <div className="space-y-6">
          {ranked.map((entry, i) => {
            const color = PROFILE_COLORS[entry.profile] || "#71717a";
            const label = PROFILE_LABELS[entry.profile] || entry.profile;
            const description = PROFILE_DESCRIPTIONS[entry.profile] || "";
            const isTop = i === 0;

            return (
              <div
                key={entry.profile}
                className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Label + percentage */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-sm font-medium ${
                        isTop ? "text-[var(--foreground)]" : "text-[var(--foreground-secondary)]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  <span className="text-sm font-serif font-bold tabular-nums" style={{ color }}>
                    {entry.percentage}%
                  </span>
                </div>

                {/* Bar */}
                <div className="h-3 bg-[var(--background-card)] rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${entry.percentage}%`,
                      backgroundColor: color,
                      opacity: isTop ? 1 : 0.7,
                    }}
                  />
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--foreground-muted)] ml-4">{description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Horse recommendation */}
      <div className="bg-gradient-to-b from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/20 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-4">
          <Feather className="text-[var(--gold)]" size={20} />
          Cavalos recomendados
        </h3>
        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
          Com base no perfil dominante (
          <span className="font-medium" style={{ color: PROFILE_COLORS[topProfile] }}>
            {PROFILE_LABELS[topProfile] || topProfile}
          </span>
          ), a recomendacao geral e:
        </p>
        <div className="mt-4 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)] font-medium">
            {HORSE_RECOMMENDATIONS[topProfile] || HORSE_RECOMMENDATIONS.amador}
          </p>
        </div>
        <p className="text-[11px] text-[var(--foreground-muted)]/60 mt-4">
          Recomendacao generica baseada no perfil. Consulte sempre um profissional antes de
          adquirir.
        </p>
      </div>
    </div>
  );
}
