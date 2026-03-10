"use client";

import { useState, useMemo } from "react";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type {
  Cavalo,
  ResultadoCompatibilidade,
} from "@/components/verificador-compatibilidade/types";
import {
  calcularAptidoesPotro,
  calcularValorPotro,
  calcularQualidadePais,
} from "@/components/verificador-compatibilidade/breeding";
import {
  CompatibilityHero,
  ObjectiveScore,
  PairSummary,
  GeneticMetrics,
  FactorBreakdown,
  CompatibilityMethodology,
} from "./results";

interface CompatibilityResultsProps {
  resultado: ResultadoCompatibilidade;
  garanhao: Cavalo;
  egua: Cavalo;
  garanhaoNome: string;
  eguaNome: string;
  onExportPDF: () => Promise<void>;
  onShare: () => Promise<void>;
  isExporting: boolean;
  isSubscribed: boolean;
  objetivo?: string;
}

export default function CompatibilityResults({
  resultado,
  garanhao,
  egua,
  garanhaoNome,
  eguaNome,
  onExportPDF,
  onShare,
  isExporting,
  isSubscribed,
  objetivo,
}: CompatibilityResultsProps) {
  const { t, language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const [coiBannerDismissed, setCoiBannerDismissed] = useState(false);

  // PRO breeding projections
  const offspringAxes = calcularAptidoesPotro(garanhao, egua, tr);
  const foalValues = calcularValorPotro(resultado, garanhao, egua, tr);
  const parentQuality = calcularQualidadePais(garanhao, egua);

  const criticalFlags = resultado.redFlags?.filter((f) => f.severity === "critical") ?? [];
  const warningFlags = resultado.redFlags?.filter((f) => f.severity === "warning") ?? [];
  const hasRedFlags = criticalFlags.length > 0 || warningFlags.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
      {/* Red Flag Warnings — displayed BEFORE the compatibility score */}
      {hasRedFlags && (
        <div className="mb-6 space-y-3 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon size={18} className="text-red-400" />
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
              {tr("Alertas de Segurança", "Safety Alerts", "Alertas de Seguridad")}
            </h3>
          </div>

          {/* Critical flags */}
          {criticalFlags.map((flag, i) => (
            <div
              key={`critical-${i}`}
              className="rounded-xl border-2 border-red-500/40 bg-red-500/10 p-4"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertOctagon size={18} className="text-red-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                      {tr("Crítico", "Critical", "Critico")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-red-300">{flag.title}</p>
                  <p className="text-xs text-red-300/70 mt-1 leading-relaxed">{flag.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Warning flags */}
          {warningFlags.map((flag, i) => (
            <div
              key={`warning-${i}`}
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-amber-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      {tr("Aviso", "Warning", "Aviso")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-amber-300">{flag.title}</p>
                  <p className="text-xs text-amber-300/70 mt-1 leading-relaxed">{flag.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CompatibilityHero
        resultado={resultado}
        garanhaoNome={garanhaoNome}
        eguaNome={eguaNome}
        coiBannerDismissed={coiBannerDismissed}
        onDismissBanner={() => setCoiBannerDismissed(true)}
        t={t}
      />

      <ObjectiveScore resultado={resultado} garanhao={garanhao} egua={egua} objetivo={objetivo} />

      <PairSummary
        resultado={resultado}
        garanhao={garanhao}
        egua={egua}
        isExporting={isExporting}
        onExportPDF={onExportPDF}
        onShare={onShare}
        t={t}
      />

      <GeneticMetrics resultado={resultado} garanhao={garanhao} egua={egua} t={t} />

      <FactorBreakdown
        resultado={resultado}
        garanhao={garanhao}
        egua={egua}
        isSubscribed={isSubscribed}
        offspringAxes={offspringAxes}
        foalValues={foalValues}
        parentQuality={parentQuality}
        t={t}
      />

      <CompatibilityMethodology
        resultado={resultado}
        garanhao={garanhao}
        egua={egua}
        isSubscribed={isSubscribed}
        t={t}
      />
    </div>
  );
}
