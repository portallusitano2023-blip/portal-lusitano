"use client";

import { Feather, Clock, Activity, TrendingUp, Heart, DollarSign, MapPin, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result } from "@/components/analise-perfil/types";

interface HorseTabProps {
  result: Result;
}

export default function HorseTab({ result }: HorseTabProps) {
  const { t } = useLanguage();

  return (
    <div key="cavalo" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="bg-gradient-to-b from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/20 p-8">
        <h3 className="flex items-center gap-2 text-xl font-serif text-[var(--foreground)] mb-8">
          <Feather className="text-[var(--gold)]" size={24} />
          {t.analise_perfil.your_ideal_lusitano}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              label: t.analise_perfil.ideal_age,
              value: result.idealHorse.age,
              icon: Clock,
            },
            {
              label: t.analise_perfil.height,
              value: result.idealHorse.height,
              icon: Activity,
            },
            {
              label: t.analise_perfil.training_level,
              value: result.idealHorse.training,
              icon: TrendingUp,
            },
            {
              label: t.analise_perfil.temperament,
              value: result.idealHorse.temperament,
              icon: Heart,
            },
          ].map((it) => (
            <div
              key={it.label}
              className="bg-[var(--background-secondary)]/50 p-5 border border-[var(--border)]"
            >
              <div className="flex items-center gap-2 text-[var(--gold)] mb-2">
                <it.icon size={16} />
                <span className="text-xs uppercase tracking-wider">{it.label}</span>
              </div>
              <p className="text-[var(--foreground)]">{it.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 bg-[var(--gold)]/10 border border-[var(--gold)]/30">
          <div className="flex items-center gap-2 text-[var(--gold)] mb-2">
            <DollarSign size={16} />
            <span className="text-xs uppercase tracking-wider">{t.analise_perfil.price_range}</span>
          </div>
          <p className="text-2xl font-serif text-[var(--foreground)]">
            {result.idealHorse.priceRange}
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mt-2">
            {t.analise_perfil.indicative_values}
          </p>
        </div>
      </div>
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <MapPin className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.recommended_regions}
        </h3>
        <div className="flex flex-wrap gap-3">
          {result.recommendedRegions.map((r) => (
            <span
              key={r}
              className="bg-[var(--background-card)] text-[var(--foreground-secondary)] px-4 py-2 text-sm"
            >
              {r}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <Zap className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.acquisition_tips}
        </h3>
        <div className="space-y-3">
          {result.tips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-[var(--foreground-secondary)] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-[var(--gold)] font-bold flex-shrink-0">{i + 1}.</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
