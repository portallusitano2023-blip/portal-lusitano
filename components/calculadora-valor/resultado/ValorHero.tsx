"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Crown, Check, Sparkles, Lightbulb } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import dynamic from "next/dynamic";
import ConfidenceRange from "@/components/tools/ConfidenceRange";
import Tooltip from "@/components/tools/Tooltip";
import type { FormData, Resultado } from "../types";

const AnimatedGauge = dynamic(() => import("@/components/tools/AnimatedGauge"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900/50 animate-pulse rounded-xl" />,
});

interface ValorHeroProps {
  resultado: Resultado;
  form: FormData;
  t: Record<string, any>;
}

export default function ValorHero({ resultado, form, t }: ValorHeroProps) {
  return (
    <>
      {/* Hero do Valor */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--background-secondary)] via-[var(--background-secondary)] to-[var(--background-card)] p-5 sm:p-8 border border-[var(--border)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--gold)]/5 rounded-full blur-3xl" />
        {/* Badges — in-flow on mobile, absolute on sm+ */}
        <div className="relative z-10 flex flex-wrap justify-center gap-2 mb-4 sm:hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gold)]/10 rounded-full border border-[var(--gold)]/30">
            <Crown size={12} className="text-[var(--gold)]" />
            <span className="text-xs text-[var(--gold)] font-medium">
              {t.calculadora.premium_eval}
            </span>
          </div>
          {resultado.confianca >= 80 && resultado.percentil >= 65 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 rounded-full border border-emerald-500/30">
              <Check size={11} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Pronto para Venda</span>
            </div>
          )}
          {resultado.confianca >= 80 && resultado.percentil < 40 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 rounded-full border border-amber-500/30">
              <Sparkles size={11} className="text-amber-400" />
              <span className="text-xs text-amber-400 font-semibold">Potencial de Melhoria</span>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 hidden sm:flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gold)]/10 rounded-full border border-[var(--gold)]/30">
            <Crown size={12} className="text-[var(--gold)]" />
            <span className="text-xs text-[var(--gold)] font-medium">
              {t.calculadora.premium_eval}
            </span>
          </div>
          {resultado.confianca >= 80 && resultado.percentil >= 65 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 rounded-full border border-emerald-500/30">
              <Check size={11} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Pronto para Venda</span>
            </div>
          )}
          {resultado.confianca >= 80 && resultado.percentil < 40 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 rounded-full border border-amber-500/30">
              <Sparkles size={11} className="text-amber-400" />
              <span className="text-xs text-amber-400 font-semibold">Potencial de Melhoria</span>
            </div>
          )}
        </div>

        <div className="relative z-10 text-center">
          {form.nome && (
            <p className="text-[var(--foreground-secondary)] text-sm mb-1 font-serif italic">
              &ldquo;{form.nome}&rdquo;
            </p>
          )}
          <p className="text-[var(--gold)] text-xs font-medium uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-6 px-2">
            {t.calculadora.market_value}
          </p>

          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl sm:text-7xl font-light tracking-tight text-[var(--foreground)]">
              <AnimatedCounter end={resultado.valorFinal} duration={2000} />
            </span>
            <span className="text-2xl text-[var(--gold)]">&euro;</span>
          </div>

          <div className="mt-4 max-w-sm mx-auto">
            <ConfidenceRange
              value={resultado.valorFinal}
              min={resultado.valorMin}
              max={resultado.valorMax}
              confidence={resultado.confianca}
              unit="€"
              explanation={
                (t.calculadora as Record<string, string>).confidence_range_explanation ??
                "Baseado na completude dos dados fornecidos"
              }
            />
          </div>

          {/* Gauge indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-8">
            <div className="flex flex-col items-center bg-[#111111] border border-[var(--gold)]/15 rounded-2xl px-6 py-4">
              <AnimatedGauge
                value={resultado.confianca}
                label={t.calculadora.confidence}
                size={180}
              />
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs font-medium text-[var(--foreground-secondary)]">
                  {t.calculadora.confidence}
                </span>
                <Tooltip
                  text={
                    (t.calculadora as Record<string, string>).tooltip_confidence ??
                    "Indica o grau de fiabilidade da estimativa. Valores acima de 70% indicam dados completos e coerentes."
                  }
                />
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#111111] border border-[var(--gold)]/15 rounded-2xl px-6 py-4">
              <AnimatedGauge
                value={resultado.percentil}
                label={t.calculadora.market_psl}
                size={180}
              />
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs font-medium text-[var(--foreground-secondary)]">
                  {t.calculadora.market_psl}
                </span>
                <Tooltip
                  text={
                    (t.calculadora as Record<string, string>).tooltip_percentile ??
                    "Posição relativa no mercado PSL. O percentil 80 significa que o cavalo vale mais que 80% dos cavalos comparáveis."
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center flex items-center justify-center gap-1">
            <span className="text-sm text-[var(--foreground-muted)]">
              {t.calculadora.multiplier}:{" "}
            </span>
            <span className="text-lg font-medium text-[var(--foreground)]">
              {resultado.multiplicador}x
            </span>
            <Tooltip
              text={
                (t.calculadora as Record<string, string>).tooltip_multiplier ??
                "Factor aplicado ao valor base. Resulta da combinação de treino, competições, linhagem e conformação."
              }
            />
          </div>
        </div>
      </div>

      {/* Principais Conclusões */}
      {(() => {
        const topForca =
          resultado.pontosForteseFracos.fortes.length > 0
            ? resultado.pontosForteseFracos.fortes[0]
            : "Genealogia de elite";

        const topFraqueza =
          resultado.pontosForteseFracos.fracos.length > 0
            ? resultado.pontosForteseFracos.fracos[0]
            : "Aumentar participações desportivas";

        const posicaoMercado =
          resultado.percentil >= 75
            ? "Top 25% do mercado lusitano"
            : resultado.percentil >= 50
              ? "Acima da mediana do mercado"
              : resultado.percentil >= 25
                ? "Abaixo da mediana, com potencial"
                : "Valor de entrada no mercado";

        return (
          <div className="bg-[#111111] border border-[#C5A059]/20 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lightbulb size={15} className="text-[var(--gold)]" />
              Principais Conclusões
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-[var(--foreground-secondary)]">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span>
                  <span className="text-emerald-400 font-medium">Ponto forte: </span>
                  {topForca}
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--foreground-secondary)]">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span>
                  <span className="text-amber-400 font-medium">Oportunidade: </span>
                  {topFraqueza}
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[var(--foreground-secondary)]">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                <span>
                  <span className="text-blue-400 font-medium">Posição de mercado: </span>
                  {posicaoMercado}
                </span>
              </li>
            </ul>
          </div>
        );
      })()}
    </>
  );
}
