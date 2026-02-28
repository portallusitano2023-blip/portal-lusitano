"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
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
  const { t } = useLanguage();
  const [coiBannerDismissed, setCoiBannerDismissed] = useState(false);

  // PRO breeding projections
  const offspringAxes = calcularAptidoesPotro(garanhao, egua);
  const foalValues = calcularValorPotro(resultado, garanhao, egua);
  const parentQuality = calcularQualidadePais(garanhao, egua);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
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
