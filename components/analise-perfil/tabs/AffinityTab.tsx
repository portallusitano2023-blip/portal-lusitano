"use client";

import { useMemo } from "react";
import { BarChart3, Feather } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
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

export default function AffinityTab({ result, scorePercentages }: AffinityTabProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const PROFILE_DESCRIPTIONS: Record<string, string> = {
    competidor: tr(
      "Foco em competição, alto desempenho e treino intensivo",
      "Focus on competition, high performance and intensive training",
      "Enfoque en competición, alto rendimiento y entrenamiento intensivo"
    ),
    tradicional: tr(
      "Preservação das tradições equestres portuguesas",
      "Preservation of Portuguese equestrian traditions",
      "Preservación de las tradiciones ecuestres portuguesas"
    ),
    criador: tr(
      "Selecção genética, reprodução e melhoramento da raça",
      "Genetic selection, breeding and breed improvement",
      "Selección genética, reproducción y mejora de la raza"
    ),
    amador: tr(
      "Lazer, passeio e prazer de montar",
      "Leisure, trail riding and pleasure of riding",
      "Ocio, paseo y placer de montar"
    ),
    investidor: tr(
      "Retorno financeiro, valorização e mercado equestre",
      "Financial return, appreciation and equestrian market",
      "Retorno financiero, valorización y mercado ecuestre"
    ),
  };

  const PROFILE_LABELS: Record<string, string> = {
    competidor: tr("Competidor", "Competitor", "Competidor"),
    tradicional: tr("Tradicional", "Traditional", "Tradicional"),
    criador: tr("Criador", "Breeder", "Criador"),
    amador: tr("Amador", "Amateur", "Aficionado"),
    investidor: tr("Investidor", "Investor", "Inversor"),
  };

  const HORSE_RECOMMENDATIONS: Record<string, string> = {
    competidor: tr(
      "Cavalo de 7-12 anos, nível médio ou avançado, com experiência em competição",
      "Horse aged 7-12, medium or advanced level, with competition experience",
      "Caballo de 7-12 años, nivel medio o avanzado, con experiencia en competición"
    ),
    tradicional: tr(
      "Cavalo de linhagem certificada, com bons andamentos e temperamento dócil",
      "Horse with certified lineage, good gaits and docile temperament",
      "Caballo de linaje certificado, con buenos aires y temperamento dócil"
    ),
    criador: tr(
      "Égua ou garanhão aprovado, com BLUP acima da média e COI controlado",
      "Approved mare or stallion, with above-average BLUP and controlled COI",
      "Yegua o semental aprobado, con BLUP por encima de la media y COI controlado"
    ),
    amador: tr(
      "Cavalo calmo, entre 8-14 anos, com treino básico a elementar",
      "Calm horse, aged 8-14, with basic to elementary training",
      "Caballo tranquilo, entre 8-14 años, con entrenamiento básico a elemental"
    ),
    investidor: tr(
      "Cavalo jovem (3-6 anos) de linhagem premium ou elite",
      "Young horse (3-6 years) of premium or elite lineage",
      "Caballo joven (3-6 años) de linaje premium o élite"
    ),
  };

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
          {tr(
            "Distribuição de afinidade com cada perfil equestre",
            "Affinity distribution across equestrian profiles",
            "Distribución de afinidad con cada perfil ecuestre"
          )}
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
          {tr("Cavalos recomendados", "Recommended horses", "Caballos recomendados")}
        </h3>
        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
          {tr(
            "Com base no perfil dominante",
            "Based on the dominant profile",
            "Según el perfil dominante"
          )}{" "}
          (
          <span className="font-medium" style={{ color: PROFILE_COLORS[topProfile] }}>
            {PROFILE_LABELS[topProfile] || topProfile}
          </span>
          ),{" "}
          {tr(
            "a recomendação geral é:",
            "the general recommendation is:",
            "la recomendación general es:"
          )}
        </p>
        <div className="mt-4 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)] font-medium">
            {HORSE_RECOMMENDATIONS[topProfile] || HORSE_RECOMMENDATIONS.amador}
          </p>
        </div>
        <p className="text-[11px] text-[var(--foreground-muted)]/60 mt-4">
          {tr(
            "Recomendação genérica baseada no perfil. Consulte sempre um profissional antes de adquirir.",
            "Generic recommendation based on profile. Always consult a professional before purchasing.",
            "Recomendación genérica basada en el perfil. Consulte siempre a un profesional antes de adquirir."
          )}
        </p>
      </div>
    </div>
  );
}
