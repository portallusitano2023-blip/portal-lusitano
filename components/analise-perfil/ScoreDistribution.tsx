"use client";

import { useLanguage } from "@/context/LanguageContext";
import RadarChart from "@/components/analise-perfil/RadarChart";
import type { RadarChartData, ScorePercentage } from "@/components/analise-perfil/types";

interface ScoreDistributionProps {
  radarData: RadarChartData;
  scorePercentages: ScorePercentage[];
}

export default function ScoreDistribution({ radarData, scorePercentages }: ScoreDistributionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-12 border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-[var(--foreground-muted)] mb-6 text-center">
              {t.analise_perfil.profile_map}
            </h3>
            <RadarChart data={radarData} />
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wider text-[var(--foreground-muted)] mb-6">
              {t.analise_perfil.profile_distribution}
            </h3>
            <div className="space-y-4">
              {scorePercentages.map((item, i) => (
                <div
                  key={item.profile}
                  className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span
                      className={
                        i === 0
                          ? "text-[var(--gold)] font-medium"
                          : "text-[var(--foreground-secondary)]"
                      }
                    >
                      {item.label}
                    </span>
                    <span
                      className={
                        i === 0 ? "text-[var(--gold)] font-bold" : "text-[var(--foreground-muted)]"
                      }
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? "bg-[var(--gold)]" : "bg-zinc-600"} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {scorePercentages[1]?.percentage > 20 && (
              <p className="text-sm text-[var(--foreground-muted)] mt-4">
                <span className="text-[var(--gold)]">{t.analise_perfil.note_label}</span>{" "}
                {t.analise_perfil.secondary_profile}{" "}
                <span className="text-[var(--foreground)]">{scorePercentages[1].label}</span> (
                {scorePercentages[1].percentage}%)
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
