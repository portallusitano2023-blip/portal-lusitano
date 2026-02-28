"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

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

interface GeneticMetricsProps {
  resultado: any;
  garanhao: any;
  egua: any;
  t: Record<string, any>;
}

export default function GeneticMetrics({ resultado, garanhao, egua, t }: GeneticMetricsProps) {
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
                (t.verificador as Record<string, string>).tooltip_coi ??
                "Coeficiente de Consanguinidade — mede o grau de parentesco genético. Abaixo de 3% é excelente; acima de 6.25% aumenta o risco de problemas hereditários."
              }
            />
            <SourceBadge
              source="modelo"
              tooltip={
                (t.verificador as Record<string, string>).source_coi ??
                "Calculado a partir de pedigree declarado — para COI oficial consulte a APSL"
              }
            />
          </div>
          <COIGauge coi={resultado.coi} />
          <p className="text-[10px] text-[var(--foreground-muted)]/60 mt-2 text-center leading-snug">
            {resultado.coi <= 1.5
              ? "≈ Antepassados comuns muito distantes (6.ª geração+)"
              : resultado.coi <= 3
                ? "≈ Primos de 4.º-5.º grau"
                : resultado.coi <= 6.25
                  ? "≈ Primos de 2.º-3.º grau"
                  : resultado.coi <= 12.5
                    ? "≈ Primo-irmãos — monitorizar"
                    : "≈ Meio-irmãos — risco hereditário elevado"}
          </p>
        </div>

        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-2">
            <Activity size={16} className="text-blue-400" />
            {t.verificador.blup_predicted}
            <Tooltip
              text={
                (t.verificador as Record<string, string>).tooltip_blup ??
                "Estimativa do mérito genético do potro, baseada na média dos progenitores. BLUP simplificado — não oficial."
              }
            />
            <SourceBadge
              source="modelo"
              tooltip={
                (t.verificador as Record<string, string>).source_blup ??
                "Estimativa simplificada — BLUP oficial requer base de dados APSL completa"
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
                (t.verificador as Record<string, string>).tooltip_altura ??
                "Estimativa baseada na média dos progenitores ±2cm. Factores ambientais podem causar variações significativas."
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
              (t.verificador as Record<string, string>).tooltip_pelagem ??
              "Probabilidades baseadas em genética mendeliana simplificada. Resultados reais dependem de alelos não testados."
            }
          />
          <SourceBadge
            source="modelo"
            tooltip={
              (t.verificador as Record<string, string>).source_pelagem ??
              "Genética mendeliana básica — não substitui teste genético"
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
              Probabilidade de Sucesso Reprodutivo
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <p className={`text-3xl font-serif font-bold ${textColor}`}>{prob}%</p>
                <p className="text-[10px] text-[var(--foreground-muted)]">probabilidade</p>
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
                    ? "Probabilidade elevada de gestação na primeira tentativa"
                    : prob >= 55
                      ? "Probabilidade moderada — 1-2 coberturas podem ser necessárias"
                      : "Probabilidade reduzida — consulte veterinário especializado"}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-[var(--foreground-muted)]/60">
              Estimativa baseada em score de compatibilidade, COI, saúde e idade da égua. Não
              substitui avaliação veterinária.
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
