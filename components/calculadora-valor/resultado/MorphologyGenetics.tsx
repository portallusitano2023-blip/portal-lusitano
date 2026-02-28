"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dna, BarChart3 } from "lucide-react";
import HorseSilhouette from "@/components/tools/HorseSilhouette";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import type { FormData, Resultado } from "../types";

interface MorphologyGeneticsProps {
  form: FormData;
  resultado: Resultado;
  t: Record<string, any>;
}

export default function MorphologyGenetics({ form, resultado, t }: MorphologyGeneticsProps) {
  return (
    <>
      {/* Horse Silhouette - Morphology Map */}
      <div className="bg-[var(--background-secondary)]/50 rounded-xl p-4 sm:p-6 border border-[var(--border)]">
        <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
          {t.calculadora.morph_title || "Mapa Morfológico"}
          <SourceBadge
            source="APSL"
            tooltip={
              (t.calculadora as Record<string, string>).source_conformacao ??
              "Critérios de conformação segundo o padrão da raça Lusitana"
            }
          />
        </h3>
        <HorseSilhouette
          zones={{
            cabeca: form.cabeca,
            espadua: form.espádua,
            dorso: form.morfologia,
            garupa: form.garupa,
            membros: form.membros,
          }}
          size={380}
        />
      </div>

      {/* Indicadores Geneticos */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-3 sm:p-5 border border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-[var(--foreground-secondary)] text-xs sm:text-sm mb-3 flex-wrap">
            <Dna size={14} className="text-purple-400 shrink-0" />
            <span className="truncate">{t.calculadora.blup_estimated}</span>
            <span className="hidden sm:contents">
              <Tooltip
                text={
                  (t.calculadora as Record<string, string>).tooltip_blup ??
                  "Best Linear Unbiased Prediction — indicador de mérito genético. O BLUP aqui é uma estimativa simplificada, NÃO um BLUP oficial APSL."
                }
              />
              <SourceBadge
                source="modelo"
                tooltip={
                  (t.calculadora as Record<string, string>).source_blup ??
                  "Estimativa simplificada — não substitui BLUP oficial APSL"
                }
              />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-light text-[var(--foreground)]">
            {resultado.blup}
          </div>
          <div className="text-xs text-[var(--foreground-muted)] mt-1">
            {t.calculadora.blup_avg}
          </div>
          <div className="mt-3 h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
              style={{ width: `${Math.min((resultado.blup / 150) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-3 sm:p-5 border border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-[var(--foreground-secondary)] text-xs sm:text-sm mb-3 flex-wrap">
            <BarChart3 size={14} className="text-amber-400 shrink-0" />
            <span className="truncate">{t.calculadora.market_percentile}</span>
            <span className="hidden sm:contents">
              <Tooltip
                text={
                  (t.calculadora as Record<string, string>).tooltip_percentile_card ??
                  "Baseado em faixas de valor do mercado equestre português para cavalos PSL."
                }
              />
              <SourceBadge
                source="mercado"
                tooltip={
                  (t.calculadora as Record<string, string>).source_mercado ??
                  "Faixas baseadas em médias do sector equestre português"
                }
              />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-light text-[var(--foreground)]">
            {resultado.percentil}%
          </div>
          <div className="text-xs text-[var(--foreground-muted)] mt-1">
            {t.calculadora.above_percentile} {resultado.percentil}% {t.calculadora.of_psl}
          </div>
          <div className="mt-3 h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
              style={{ width: `${resultado.percentil}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
