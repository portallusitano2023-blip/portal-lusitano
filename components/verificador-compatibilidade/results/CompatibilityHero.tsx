"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import dynamic from "next/dynamic";
import Tooltip from "@/components/tools/Tooltip";

const AnimatedRing = dynamic(() => import("@/components/tools/AnimatedRing"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900/50 animate-pulse rounded-xl" />,
});
const Confetti = dynamic(() => import("@/components/tools/Confetti"), {
  ssr: false,
});

interface CompatibilityHeroProps {
  resultado: any;
  garanhaoNome: string;
  eguaNome: string;
  coiBannerDismissed: boolean;
  onDismissBanner: () => void;
  t: Record<string, any>;
}

export default function CompatibilityHero({
  resultado,
  garanhaoNome,
  eguaNome,
  coiBannerDismissed,
  onDismissBanner,
  t,
}: CompatibilityHeroProps) {
  return (
    <>
      {/* Banner: Modelo Educativo Simplificado */}
      {!coiBannerDismissed && (
        <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-5">
          <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-300/90 mb-0.5">
              Modelo Educativo Simplificado
            </p>
            <p className="text-xs text-blue-300/70 leading-relaxed">
              O Coeficiente de Endogamia (COI) apresentado é uma estimativa baseada nas linhagens
              declaradas. O COI real requer análise de pedigree completo (5+ gerações) por
              geneticista equino certificado. Para decisões de cruzamento, consulte um especialista
              ou a base de dados{}
              <a
                href="https://www.cavalo-lusitano.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-blue-200 transition-colors"
              >
                APSL
              </a>
              .
            </p>
          </div>
          <button
            onClick={onDismissBanner}
            aria-label="Fechar aviso"
            className="text-blue-400/60 hover:text-blue-300 transition-colors shrink-0 mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Confetti celebration */}
      <div className="relative">
        <Confetti trigger={true} particleCount={50} duration={2800} />
      </div>

      {/* Score Principal */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--background-secondary)] via-[var(--background-secondary)] to-[var(--background-card)] p-5 sm:p-8 border border-[var(--border)] mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              resultado.score >= 70
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : resultado.score >= 50
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {resultado.score >= 70 ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span className="font-semibold">
              {t.verificador.compatibility} {resultado.nivel}
            </span>
          </div>

          {/* Prominent score number */}
          <div className="flex flex-col items-center mt-2 mb-1">
            <span className="text-6xl font-serif text-[#C5A059] leading-none tabular-nums">
              {resultado.score}
            </span>
            <span className="text-sm text-[var(--foreground-muted)] mt-1">/100</span>
          </div>

          {/* AnimatedRing as decorative element */}
          <div className="flex justify-center my-3">
            <AnimatedRing value={resultado.score} size={140} strokeWidth={8} />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xs text-[var(--foreground-muted)]">
              {t.verificador.compatibility}
            </span>
            <Tooltip
              text={
                (t.verificador as Record<string, string>).tooltip_score ??
                "Score de compatibilidade genética (0-100) baseado em COI, BLUP, conformação, andamentos e historial de ambos os progenitores."
              }
            />
          </div>

          <p className="text-[var(--foreground-muted)] text-sm">
            {garanhaoNome || t.verificador.tab_stallion} × {eguaNome || t.verificador.tab_mare}
          </p>
        </div>
      </div>
    </>
  );
}
