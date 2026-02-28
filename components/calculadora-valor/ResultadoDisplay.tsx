"use client";

import { forwardRef } from "react";
import { Scale } from "lucide-react";
import dynamic from "next/dynamic";
import LiquidityScore from "@/components/tools/LiquidityScore";
import { useLanguage } from "@/context/LanguageContext";
import SensitivityPanel from "./SensitivityPanel";
import type { FormData, Resultado } from "./types";
import {
  ValorHero,
  MorphologyGenetics,
  StrengthsWeaknesses,
  ImprovementActions,
  ScenarioSimulator,
  BreakdownAnalysis,
  MethodologyFooter,
} from "./resultado";

const Confetti = dynamic(() => import("@/components/tools/Confetti"), {
  ssr: false,
});

interface ResultadoDisplayProps {
  resultado: Resultado;
  form: FormData;
  onExportPDF: () => void;
  onShare: () => void;
  isExporting: boolean;
  isSubscribed: boolean;
  onComparar?: () => void;
  onVerificarCompat?: () => void;
  onSendEmail?: () => Promise<void>;
}

const ResultadoDisplay = forwardRef<HTMLDivElement, ResultadoDisplayProps>(
  function ResultadoDisplay(
    {
      resultado,
      form,
      onExportPDF,
      onShare,
      isExporting,
      isSubscribed,
      onComparar,
      onVerificarCompat,
      onSendEmail,
    },
    ref
  ) {
    const { t } = useLanguage();

    return (
      <div
        ref={ref}
        className="space-y-6 pt-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      >
        {/* Confetti celebration */}
        <div className="relative">
          <Confetti trigger={true} particleCount={50} duration={2800} />
        </div>

        <ValorHero resultado={resultado} form={form} t={t} />

        <MorphologyGenetics form={form} resultado={resultado} t={t} />

        {/* Liquidity Score */}
        <LiquidityScore form={form} percentil={resultado.percentil} />

        {/* Simular Venda — CTA contextual para Comparador */}
        {onComparar && (
          <div
            className={`rounded-xl border p-4 sm:p-5 flex items-start gap-3 sm:gap-4 ${
              resultado.percentil >= 65
                ? "bg-emerald-500/5 border-emerald-500/25"
                : resultado.percentil >= 40
                  ? "bg-blue-500/5 border-blue-500/25"
                  : "bg-amber-500/5 border-amber-500/25"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                resultado.percentil >= 65
                  ? "bg-emerald-500/15"
                  : resultado.percentil >= 40
                    ? "bg-blue-500/15"
                    : "bg-amber-500/15"
              }`}
            >
              <Scale
                size={20}
                className={
                  resultado.percentil >= 65
                    ? "text-emerald-400"
                    : resultado.percentil >= 40
                      ? "text-blue-400"
                      : "text-amber-400"
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold mb-1 ${
                  resultado.percentil >= 65
                    ? "text-emerald-400"
                    : resultado.percentil >= 40
                      ? "text-blue-400"
                      : "text-amber-400"
                }`}
              >
                {resultado.percentil >= 65
                  ? "O teu cavalo está bem posicionado — confirma o valor"
                  : resultado.percentil >= 40
                    ? "Compara com cavalos semelhantes no mercado"
                    : "O preço parece abaixo do mercado — verifica com cavalos similares"}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                {resultado.percentil >= 65
                  ? "Compara lado a lado com outros candidatos para confirmar que o preço é competitivo antes de vender."
                  : resultado.percentil >= 40
                    ? "Usa o Comparador para posicionar o teu cavalo face a outros e tomar melhores decisões de preço."
                    : "Benchmarks de mercado sugerem que podes valorizar mais. Compara com cavalos de perfil similar."}
              </p>
            </div>
            <button
              onClick={onComparar}
              className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                resultado.percentil >= 65
                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  : resultado.percentil >= 40
                    ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
              }`}
            >
              Comparar →
            </button>
          </div>
        )}

        <StrengthsWeaknesses
          fortes={resultado.pontosForteseFracos.fortes}
          fracos={resultado.pontosForteseFracos.fracos}
          t={t}
        />

        <ImprovementActions resultado={resultado} form={form} t={t} />

        {/* What-If Sensitivity Analysis */}
        <SensitivityPanel form={form} resultado={resultado} />

        <ScenarioSimulator form={form} resultado={resultado} />

        <BreakdownAnalysis form={form} resultado={resultado} isSubscribed={isSubscribed} t={t} />

        <MethodologyFooter
          form={form}
          resultado={resultado}
          isSubscribed={isSubscribed}
          isExporting={isExporting}
          onExportPDF={onExportPDF}
          onShare={onShare}
          onSendEmail={onSendEmail}
          onComparar={onComparar}
          onVerificarCompat={onVerificarCompat}
          t={t}
        />
      </div>
    );
  }
);

export default ResultadoDisplay;
