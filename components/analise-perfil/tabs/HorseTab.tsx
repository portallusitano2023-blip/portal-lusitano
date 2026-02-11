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
      <div className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 p-8">
        <h3 className="flex items-center gap-2 text-xl font-serif text-white mb-8">
          <Feather className="text-[#C5A059]" size={24} />
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
            <div key={it.label} className="bg-zinc-900/50 p-5 border border-white/5">
              <div className="flex items-center gap-2 text-[#C5A059] mb-2">
                <it.icon size={16} />
                <span className="text-xs uppercase tracking-wider">{it.label}</span>
              </div>
              <p className="text-white">{it.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 bg-[#C5A059]/10 border border-[#C5A059]/30">
          <div className="flex items-center gap-2 text-[#C5A059] mb-2">
            <DollarSign size={16} />
            <span className="text-xs uppercase tracking-wider">{t.analise_perfil.price_range}</span>
          </div>
          <p className="text-2xl font-serif text-white">{result.idealHorse.priceRange}</p>
          <p className="text-sm text-zinc-500 mt-2">{t.analise_perfil.indicative_values}</p>
        </div>
      </div>
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <MapPin className="text-[#C5A059]" size={20} />
          {t.analise_perfil.recommended_regions}
        </h3>
        <div className="flex flex-wrap gap-3">
          {result.recommendedRegions.map((r) => (
            <span key={r} className="bg-zinc-800 text-zinc-300 px-4 py-2 text-sm">
              {r}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <Zap className="text-[#C5A059]" size={20} />
          {t.analise_perfil.acquisition_tips}
        </h3>
        <div className="space-y-3">
          {result.tips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-zinc-300 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-[#C5A059] font-bold flex-shrink-0">{i + 1}.</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
