"use client";

import Link from "next/link";
import { Compass, Briefcase, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result } from "@/components/analise-perfil/types";

interface NextStepsTabProps {
  result: Result;
}

export default function NextStepsTab({ result }: NextStepsTabProps) {
  const { t } = useLanguage();

  return (
    <div key="proximos" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <Compass className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.recommended_next_steps}
        </h3>
        <div className="space-y-4">
          {result.nextSteps.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-[var(--background-card)]/30 border border-[var(--border)] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-8 h-8 bg-[var(--gold)] text-black rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                {i + 1}
              </div>
              <p className="text-[var(--foreground-secondary)] pt-1">{s}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-r from-[var(--gold)]/20 to-transparent border border-[var(--gold)]/30 p-8 text-center">
        <h3 className="text-xl font-serif text-[var(--foreground)] mb-4">
          {t.analise_perfil.ready_title}
        </h3>
        <p className="text-[var(--foreground-secondary)] mb-8 max-w-md mx-auto">
          {t.analise_perfil.ready_desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/directorio"
            className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
          >
            <Briefcase size={18} />
            {t.analise_perfil.explore_studs}
          </Link>
          <Link
            href={`/calculadora-valor?perfil=${result.profile}&min=${result.idealHorse.priceRange.split(" ")[0].replace(".", "").replace(",", "")}`}
            className="inline-flex items-center justify-center gap-2 border border-[var(--gold)] text-[var(--gold)] px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-[var(--gold)] hover:text-black transition-colors"
          >
            {t.analise_perfil.value_calculator}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
