"use client";

import { useMemo } from "react";
import {
  Dna,
  AlertTriangle,
  CheckCircle,
  Baby,
  Palette,
  Activity,
  Info,
  TrendingUp,
} from "lucide-react";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import COIGauge from "../COIGauge";
import CoatColorSwatches from "../CoatColorSwatches";
import PhysicalMatch from "@/components/tools/PhysicalMatch";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Cavalo, ResultadoCompatibilidade } from "../types";
import type { Translations } from "@/context/LanguageContext";

interface GeneticMetricsProps {
  resultado: ResultadoCompatibilidade;
  garanhao: Cavalo;
  egua: Cavalo;
  t: Translations;
}

export default function GeneticMetrics({ resultado, garanhao, egua, t }: GeneticMetricsProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);

  return (
    <>
      {/* Métricas Genéticas */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-3">
            <Dna size={16} className="text-purple-400" />
            {t.verificador.coi_predicted}
            <Tooltip
              text={
                t.verificador.tooltip_coi ??
                tr(
                  "Coeficiente de Consanguinidade — mede o grau de parentesco genético. Abaixo de 3% é excelente; acima de 6.25% aumenta o risco de problemas hereditários.",
                  "Inbreeding Coefficient — measures the degree of genetic relatedness. Below 3% is excellent; above 6.25% increases the risk of hereditary problems.",
                  "Coeficiente de Consanguinidad — mide el grado de parentesco genético. Por debajo de 3% es excelente; por encima de 6.25% aumenta el riesgo de problemas hereditarios."
                )
              }
            />
            <SourceBadge
              source="modelo"
              tooltip={
                t.verificador.source_coi ??
                tr(
                  "Calculado a partir de pedigree declarado — para COI oficial consulte a APSL",
                  "Calculated from declared pedigree — for official COI consult APSL",
                  "Calculado a partir de pedigrí declarado — para COI oficial consulte la APSL"
                )
              }
            />
          </div>
          <COIGauge coi={resultado.coi} />
          <p className="text-[10px] text-[var(--foreground-muted)]/60 mt-2 text-center leading-snug">
            {resultado.coi <= 1.5
              ? tr("≈ Antepassados comuns muito distantes (6.ª geração+)", "≈ Very distant common ancestors (6th generation+)", "≈ Antepasados comunes muy distantes (6.ª generación+)")
              : resultado.coi <= 3
                ? tr("≈ Primos de 4.º-5.º grau", "≈ 4th-5th degree cousins", "≈ Primos de 4.º-5.º grado")
                : resultado.coi <= 6.25
                  ? tr("≈ Primos de 2.º-3.º grau", "≈ 2nd-3rd degree cousins", "≈ Primos de 2.º-3.º grado")
                  : resultado.coi <= 12.5
                    ? tr("≈ Primo-irmãos — monitorizar", "≈ First cousins — monitor", "≈ Primos hermanos — monitorizar")
                    : tr("≈ Meio-irmãos — risco hereditário elevado", "≈ Half-siblings — high hereditary risk", "≈ Medio hermanos — riesgo hereditario elevado")}
          </p>
        </div>

        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-2">
            <Activity size={16} className="text-blue-400" />
            {t.verificador.blup_predicted}
            <Tooltip
              text={
                t.verificador.tooltip_blup ??
                tr(
                  "Estimativa do mérito genético do potro, baseada na média dos progenitores. BLUP simplificado — não oficial.",
                  "Estimate of the foal's genetic merit, based on the average of the parents. Simplified BLUP — not official.",
                  "Estimación del mérito genético del potro, basada en el promedio de los progenitores. BLUP simplificado — no oficial."
                )
              }
            />
            <SourceBadge
              source="modelo"
              tooltip={
                t.verificador.source_blup ??
                tr(
                  "Estimativa simplificada — BLUP oficial requer base de dados APSL completa",
                  "Simplified estimate — official BLUP requires complete APSL database",
                  "Estimación simplificada — BLUP oficial requiere base de datos APSL completa"
                )
              }
            />
          </div>
          <div className="text-3xl font-light text-blue-400">{resultado.blup}</div>
          <div className="text-xs text-[var(--foreground-muted)] mt-1">
            {t.verificador.blup_breed_avg}
          </div>
          <div className="mt-3 h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
              style={{ width: `${Math.min((resultado.blup / 150) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-2">
            <Baby size={16} className="text-pink-400" />
            {t.verificador.estimated_height}
            <Tooltip
              text={
                t.verificador.tooltip_altura ??
                tr(
                  "Estimativa baseada na média dos progenitores ±2cm. Factores ambientais podem causar variações significativas.",
                  "Estimate based on parent average ±2cm. Environmental factors may cause significant variations.",
                  "Estimación basada en el promedio de los progenitores ±2cm. Factores ambientales pueden causar variaciones significativas."
                )
              }
            />
          </div>
          <div className="text-3xl font-light text-pink-400">
            {resultado.altura.min}-{resultado.altura.max}
            <span className="text-lg">cm</span>
          </div>
          <div className="text-xs text-[var(--foreground-muted)] mt-1">
            {t.verificador.of_adult_foal}
          </div>
          <div className="mt-3 h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
              style={{ width: `${((resultado.altura.max - 140) / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pontos Fortes e Fracos */}
      {(resultado.pontosForteseFracos.fortes.length > 0 ||
        resultado.pontosForteseFracos.fracos.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {resultado.pontosForteseFracos.fortes.length > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
              <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                <TrendingUp size={16} />
                {t.verificador.strengths}
              </h3>
              <ul className="space-y-2">
                {resultado.pontosForteseFracos.fortes.map((ponto: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
                  >
                    <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    {ponto}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {resultado.pontosForteseFracos.fracos.length > 0 && (
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
              <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} />
                {t.verificador.attention_points}
              </h3>
              <ul className="space-y-2">
                {resultado.pontosForteseFracos.fracos.map((ponto: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
                  >
                    <Info size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                    {ponto}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Previsão de Pelagem */}
      <div className="bg-[var(--background-secondary)]/50 rounded-xl p-4 sm:p-6 border border-[var(--border)] mb-6">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Palette className="text-purple-400" size={18} />
          {t.verificador.coat_prediction}
          <Tooltip
            text={
              t.verificador.tooltip_pelagem ??
              tr(
                "Probabilidades baseadas em genética mendeliana simplificada. Resultados reais dependem de alelos não testados.",
                "Probabilities based on simplified Mendelian genetics. Actual results depend on untested alleles.",
                "Probabilidades basadas en genética mendeliana simplificada. Los resultados reales dependen de alelos no probados."
              )
            }
          />
          <SourceBadge
            source="modelo"
            tooltip={
              t.verificador.source_pelagem ??
              tr(
                "Genética mendeliana básica — não substitui teste genético",
                "Basic Mendelian genetics — does not replace genetic testing",
                "Genética mendeliana básica — no sustituye prueba genética"
              )
            }
          />
        </h3>
        <CoatColorSwatches pelagens={resultado.pelagens} />
      </div>

      {/* Physical Match */}
      <div className="mb-6">
        <PhysicalMatch garanhao={garanhao} egua={egua} resultado={resultado} />
      </div>

      {/* Probabilidade de Sucesso Reprodutivo */}
      {(() => {
        const score = resultado.score;
        const coi = resultado.coi;

        // Base: 65% (égua jovem saudável, primeira cobrição de primavera)
        let prob = 65;
        if (score >= 70) prob += 10;
        else if (score < 50) prob -= 15;
        if (coi <= 3) prob += 5;
        else if (coi > 6.25) prob -= 10;
        if (egua.saude >= 8) prob += 5;
        if (egua.idade > 15) prob -= 10;
        else if (egua.idade < 5) prob -= 5;
        if (garanhao.aprovado && egua.aprovado) prob += 3;
        prob = Math.min(85, Math.max(30, prob));

        const progColor =
          prob >= 70 ? "bg-emerald-500" : prob >= 55 ? "bg-amber-500" : "bg-red-500";
        const textColor =
          prob >= 70 ? "text-emerald-400" : prob >= 55 ? "text-amber-400" : "text-red-400";

        return (
          <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)] mb-6">
            <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-3 flex items-center gap-2">
              <Baby size={15} className="text-pink-400" />
              {tr("Probabilidade de Sucesso Reprodutivo", "Reproductive Success Probability", "Probabilidad de Éxito Reproductivo")}
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <p className={`text-3xl font-serif font-bold ${textColor}`}>{prob}%</p>
                <p className="text-[10px] text-[var(--foreground-muted)]">{tr("probabilidade", "probability", "probabilidad")}</p>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-[var(--background-card)] rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${progColor}`}
                    style={{ width: `${prob}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {prob >= 70
                    ? tr("Probabilidade elevada de gestação na primeira tentativa", "High probability of pregnancy on first attempt", "Alta probabilidad de gestación en el primer intento")
                    : prob >= 55
                      ? tr("Probabilidade moderada — 1-2 coberturas podem ser necessárias", "Moderate probability — 1-2 breedings may be necessary", "Probabilidad moderada — 1-2 cubriciones pueden ser necesarias")
                      : tr("Probabilidade reduzida — consulte veterinário especializado", "Low probability — consult a specialised veterinarian", "Probabilidad reducida — consulte al veterinario especializado")}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-[var(--foreground-muted)]/60">
              {tr(
                "Estimativa baseada em score de compatibilidade, COI, saúde e idade da égua. Não substitui avaliação veterinária.",
                "Estimate based on compatibility score, COI, health and mare age. Does not replace veterinary assessment.",
                "Estimación basada en puntuación de compatibilidad, COI, salud y edad de la yegua. No sustituye evaluación veterinaria."
              )}
            </p>
          </div>
        );
      })()}

      {/* Riscos */}
      {resultado.riscos.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={18} />
            {t.verificador.alerts_risks}
          </h3>
          {resultado.riscos.map((r: any, i: number) => (
            <div
              key={i}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                r.severidade === "alto"
                  ? "bg-red-500/10 border border-red-500/30"
                  : r.severidade === "medio"
                    ? "bg-amber-500/10 border border-amber-500/30"
                    : "bg-yellow-500/10 border border-yellow-500/30"
              }`}
            >
              <AlertTriangle
                size={18}
                className={
                  r.severidade === "alto"
                    ? "text-red-400"
                    : r.severidade === "medio"
                      ? "text-amber-400"
                      : "text-yellow-400"
                }
              />
              <span className="text-sm text-[var(--foreground-secondary)]">{r.texto}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
