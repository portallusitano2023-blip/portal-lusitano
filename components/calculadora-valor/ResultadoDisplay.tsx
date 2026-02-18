"use client";

import { forwardRef } from "react";
import Link from "next/link";
import {
  Crown,
  Dna,
  BarChart3,
  TrendingUp,
  Check,
  Info,
  ChevronRight,
  Sparkles,
  BookOpen,
  Scale,
  Lightbulb,
} from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import AnimatedGauge from "@/components/tools/AnimatedGauge";
import HorseSilhouette from "@/components/tools/HorseSilhouette";
import MarketPositionChart from "@/components/tools/MarketPositionChart";
import Confetti from "@/components/tools/Confetti";
import BlurredProSection from "@/components/tools/BlurredProSection";
import ResultActions from "@/components/tools/ResultActions";
import RegionalMarketMap from "@/components/tools/RegionalMarketMap";
import InvestmentTimeline from "@/components/tools/InvestmentTimeline";
import TrainingROI from "@/components/tools/TrainingROI";
import ValueWaterfall from "@/components/tools/ValueWaterfall";
import LiquidityScore from "@/components/tools/LiquidityScore";
import InvestmentSafety from "@/components/tools/InvestmentSafety";
import DisciplineComparison from "@/components/tools/DisciplineComparison";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import MethodologyPanel from "@/components/tools/MethodologyPanel";
import ConfidenceRange from "@/components/tools/ConfidenceRange";
import { useLanguage } from "@/context/LanguageContext";
import { MERCADOS, VALORES_BASE, MULT_LINHAGEM, MULT_SAUDE, MULT_COMP } from "./data";
import { calcularProjecaoValor, calcularTrainingROI } from "./projections";
import type { FormData, Resultado } from "./types";

interface ResultadoDisplayProps {
  resultado: Resultado;
  form: FormData;
  onExportPDF: () => void;
  onShare: () => void;
  isExporting: boolean;
  isSubscribed: boolean;
  onComparar?: () => void;
  onSendEmail?: () => Promise<void>;
}

const ResultadoDisplay = forwardRef<HTMLDivElement, ResultadoDisplayProps>(
  function ResultadoDisplay(
    { resultado, form, onExportPDF, onShare, isExporting, isSubscribed, onComparar, onSendEmail },
    ref
  ) {
    const { t } = useLanguage();

    // PRO projections
    const investmentProjections = calcularProjecaoValor(resultado.valorFinal, form.idade);
    const trainingROILevels = calcularTrainingROI(
      form,
      resultado.valorFinal,
      resultado.multiplicador
    );

    return (
      <div
        ref={ref}
        className="space-y-6 pt-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      >
        {/* Confetti celebration */}
        <div className="relative">
          <Confetti trigger={true} particleCount={50} duration={2800} />
        </div>

        {/* Hero do Valor */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--background-secondary)] via-[var(--background-secondary)] to-[var(--background-card)] p-8 border border-[var(--border)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--gold)]/5 rounded-full blur-3xl" />
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gold)]/10 rounded-full border border-[var(--gold)]/30">
              <Crown size={12} className="text-[var(--gold)]" />
              <span className="text-xs text-[var(--gold)] font-medium">
                {t.calculadora.premium_eval}
              </span>
            </div>
          </div>

          <div className="relative z-10 text-center">
            {form.nome && (
              <p className="text-[var(--foreground-secondary)] text-sm mb-1 font-serif italic">
                &ldquo;{form.nome}&rdquo;
              </p>
            )}
            <p className="text-[var(--gold)] text-xs font-medium uppercase tracking-[0.2em] mb-6">
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
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 mt-8">
              <div className="flex flex-col items-center">
                <AnimatedGauge
                  value={resultado.confianca}
                  label={t.calculadora.confidence}
                  size={160}
                />
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-[var(--foreground-muted)]">
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
              <div className="flex flex-col items-center">
                <AnimatedGauge
                  value={resultado.percentil}
                  label={t.calculadora.market_psl}
                  size={160}
                />
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-[var(--foreground-muted)]">
                    {t.calculadora.market_psl}
                  </span>
                  <Tooltip
                    text={
                      (t.calculadora as Record<string, string>).tooltip_percentile ??
                      "Posicao relativa no mercado PSL. O percentil 80 significa que o cavalo vale mais que 80% dos cavalos comparaveis."
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
                  "Factor aplicado ao valor base. Resulta da combinacao de treino, competicoes, linhagem e conformacao."
                }
              />
            </div>
          </div>
        </div>

        {/* Horse Silhouette - Morphology Map */}
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
            {t.calculadora.morph_title || "Mapa Morfológico"}
            <SourceBadge
              source="APSL"
              tooltip={
                (t.calculadora as Record<string, string>).source_conformacao ??
                "Criterios de conformacao segundo o padrao da raca Lusitana"
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
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)] text-sm mb-3">
              <Dna size={16} className="text-purple-400" />
              <span>{t.calculadora.blup_estimated}</span>
              <Tooltip
                text={
                  (t.calculadora as Record<string, string>).tooltip_blup ??
                  "Best Linear Unbiased Prediction — indicador de merito genetico. O BLUP aqui e uma estimativa simplificada, NAO um BLUP oficial APSL."
                }
              />
              <SourceBadge
                source="modelo"
                tooltip={
                  (t.calculadora as Record<string, string>).source_blup ??
                  "Estimativa simplificada — nao substitui BLUP oficial APSL"
                }
              />
            </div>
            <div className="text-3xl font-light text-[var(--foreground)]">{resultado.blup}</div>
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

          <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)] text-sm mb-3">
              <BarChart3 size={16} className="text-amber-400" />
              <span>{t.calculadora.market_percentile}</span>
              <Tooltip
                text={
                  (t.calculadora as Record<string, string>).tooltip_percentile_card ??
                  "Baseado em faixas de valor do mercado equestre portugues para cavalos PSL."
                }
              />
              <SourceBadge
                source="mercado"
                tooltip={
                  (t.calculadora as Record<string, string>).source_mercado ??
                  "Faixas baseadas em medias do sector equestre portugues"
                }
              />
            </div>
            <div className="text-3xl font-light text-[var(--foreground)]">
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

        {/* Liquidity Score */}
        <LiquidityScore form={form} percentil={resultado.percentil} />

        {/* Pontos Fortes e Fracos */}
        {(resultado.pontosForteseFracos.fortes.length > 0 ||
          resultado.pontosForteseFracos.fracos.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4">
            {resultado.pontosForteseFracos.fortes.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                  <TrendingUp size={16} />
                  {t.calculadora.strengths}
                </h3>
                <ul className="space-y-2">
                  {resultado.pontosForteseFracos.fortes.map((ponto, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
                    >
                      <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {resultado.pontosForteseFracos.fracos.length > 0 && (
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
                <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                  <Info size={16} />
                  {t.calculadora.attention_areas}
                </h3>
                <ul className="space-y-2">
                  {resultado.pontosForteseFracos.fracos.map((ponto, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
                    >
                      <ChevronRight size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Comparacao de Mercado - Visual Chart */}
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-[var(--gold)]" />
            {t.calculadora.market_comparison}
          </h3>
          <MarketPositionChart
            estimatedValue={resultado.valorFinal}
            benchmarks={resultado.comparacao.map((comp) => ({
              label: comp.tipo,
              value: comp.valorMedio,
            }))}
          />
        </div>

        {/* Value Waterfall - Decomposicao do Valor */}
        <ValueWaterfall
          categorias={resultado.categorias}
          valorBase={
            resultado.valorFinal - resultado.categorias.reduce((sum, c) => sum + c.impacto, 0)
          }
          valorFinal={resultado.valorFinal}
        />

        {/* Analise por Categoria - PRO only */}
        <BlurredProSection isSubscribed={isSubscribed} title={t.calculadora.category_impact}>
          <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
            <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-4">
              {t.calculadora.category_impact}
            </h3>
            <div className="space-y-4">
              {resultado.categorias.slice(0, 6).map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm text-[var(--foreground-secondary)]">{cat.nome}</span>
                      <span className="text-xs text-[var(--foreground-muted)] ml-2 hidden sm:inline">
                        {cat.descricao}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${cat.impacto >= 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {cat.impacto >= 0 ? "+" : ""}
                      {cat.impacto.toLocaleString("pt-PT")}&euro;
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--gold)] to-[#D4AF6A] transition-all duration-500"
                      style={{ width: `${Math.min(cat.score * 10, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BlurredProSection>

        {/* Recomendacoes - PRO only */}
        {resultado.recomendacoes.length > 0 && (
          <BlurredProSection isSubscribed={isSubscribed} title={t.calculadora.recommendations}>
            <div className="bg-[var(--gold)]/5 rounded-xl p-6 border border-[var(--gold)]/20">
              <h3 className="text-sm font-medium text-[var(--gold)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} />
                {t.calculadora.recommendations}
              </h3>
              <ul className="space-y-3">
                {resultado.recomendacoes.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[var(--foreground-secondary)]"
                  >
                    <ChevronRight size={16} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </BlurredProSection>
        )}

        {/* PRO: Mapa de Mercados Regionais */}
        <BlurredProSection isSubscribed={isSubscribed} title={t.calculadora.regional_market_title}>
          <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
            <RegionalMarketMap
              baseValue={resultado.valorFinal}
              currentMarket={form.mercado}
              markets={MERCADOS}
            />
            <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed mt-3">
              {t.calculadora.pro_projections_disclaimer}
            </p>
          </div>
        </BlurredProSection>

        {/* PRO: Projecção de Investimento */}
        <BlurredProSection isSubscribed={isSubscribed} title={t.calculadora.investment_title}>
          <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
            <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">
              {t.calculadora.investment_title}
            </h3>
            <p className="text-xs text-[var(--foreground-muted)] mb-6">
              {t.calculadora.investment_subtitle}
            </p>
            <InvestmentTimeline
              projections={investmentProjections}
              currentValue={resultado.valorFinal}
            />
            <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed mt-3">
              {t.calculadora.pro_projections_disclaimer}
            </p>
          </div>
        </BlurredProSection>

        {/* PRO: ROI de Treino */}
        {trainingROILevels.length > 0 && (
          <BlurredProSection isSubscribed={isSubscribed} title={t.calculadora.training_roi_title}>
            <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
              <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">
                {t.calculadora.training_roi_title}
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] mb-6">
                {t.calculadora.training_roi_subtitle}
              </p>
              <TrainingROI
                currentLevel={form.treino.replace("_", " ")}
                currentValue={resultado.valorFinal}
                levels={trainingROILevels}
              />
              <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed mt-4">
                {t.calculadora.pro_projections_disclaimer}
              </p>
            </div>
          </BlurredProSection>
        )}

        {/* PRO: Investment Safety Analysis */}
        <BlurredProSection
          isSubscribed={isSubscribed}
          title={
            (t.calculadora as Record<string, string>).safety_title ??
            "Analise de Seguranca do Investimento"
          }
        >
          <InvestmentSafety form={form} resultado={resultado} />
        </BlurredProSection>

        {/* PRO: Discipline Comparison */}
        <BlurredProSection
          isSubscribed={isSubscribed}
          title={
            (t.calculadora as Record<string, string>).discipline_title ??
            "Comparacao por Disciplina"
          }
        >
          <DisciplineComparison form={form} valorBase={resultado.valorFinal} />
        </BlurredProSection>

        {/* PRO: Metodologia de Valorização */}
        <BlurredProSection isSubscribed={isSubscribed} title="Metodologia de Valorização">
          {(() => {
            const base = VALORES_BASE[form.treino] ?? resultado.valorFinal;
            const morfMedia =
              (form.morfologia + form.garupa + form.espádua + form.cabeca + form.membros) / 5;
            const andMedia =
              (form.andamentos + form.elevacao + form.suspensao + form.regularidade) / 4;
            const saudeScore = MULT_SAUDE[form.saude] ?? 1.0;
            const saudeNorm = Math.round(saudeScore * 8);
            const linhagemScore = MULT_LINHAGEM[form.linhagem] ?? 1.0;
            const linhagemNorm = Math.min(10, Math.round(linhagemScore * 4.5));
            const treinoKeys = [
              "potro",
              "desbravado",
              "iniciado",
              "elementar",
              "medio",
              "avancado",
              "alta_escola",
              "grand_prix",
            ];
            const treinoIdx = treinoKeys.indexOf(form.treino);
            const treinoScore = Math.min(10, Math.max(1, treinoIdx + 2));
            const compScore = Math.round((MULT_COMP[form.competicoes] ?? 1.0) * 5.5);

            const fatores: {
              nome: string;
              peso: number;
              score: number;
              label: string;
            }[] = [
              {
                nome: "Genealogia e Sangue",
                peso: 30,
                score: linhagemNorm,
                label: "Linhagem e pedigree certificado",
              },
              {
                nome: "Formação e Disciplina",
                peso: 25,
                score: treinoScore,
                label: "Nível de treino e disciplina",
              },
              {
                nome: "Resultados Desportivos",
                peso: 20,
                score: Math.min(10, compScore),
                label: "Historial em competição",
              },
              {
                nome: "Saúde e Condição",
                peso: 15,
                score: Math.min(10, saudeNorm),
                label: "Estado clínico e documentação",
              },
              {
                nome: "Mercado e Procura Actual",
                peso: 10,
                score: form.tendencia === "alta" ? 9 : form.tendencia === "estavel" ? 7 : 4,
                label: "Dinâmica do mercado-alvo",
              },
            ];

            const totalPontos = fatores.reduce((s, f) => s + f.score * f.peso, 0);

            return (
              <div className="bg-[var(--background-secondary)]/50 rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
                  <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider flex items-center gap-2">
                    <Scale size={16} className="text-[var(--gold)]" />
                    Metodologia de Valorização
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    Como calculámos o valor estimado do seu cavalo
                  </p>
                </div>

                <div className="divide-y divide-[var(--border)]">
                  {fatores.map((f, i) => {
                    const contribuicao = Math.round(
                      ((f.score * f.peso) / totalPontos) * resultado.valorFinal
                    );
                    const barWidth = Math.round((f.score / 10) * 100);
                    const isStrong = f.score >= 8;
                    const isWeak = f.score < 5;
                    return (
                      <div
                        key={i}
                        className={`px-6 py-4 ${i % 2 === 0 ? "bg-[#111111]" : "bg-[#0D0D0D]"}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-[var(--foreground-secondary)] truncate">
                                {f.nome}
                              </span>
                              <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                {f.peso}%
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                              {f.label}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span
                              className={`text-sm font-semibold ${isStrong ? "text-emerald-400" : isWeak ? "text-orange-400" : "text-[var(--gold)]"}`}
                            >
                              +{contribuicao.toLocaleString("pt-PT")} €
                            </span>
                            <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                              {f.score.toFixed(1)}/10
                            </p>
                          </div>
                        </div>
                        <div className="h-1.5 bg-[var(--background-card)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isStrong
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                : isWeak
                                  ? "bg-gradient-to-r from-orange-500 to-orange-400"
                                  : "bg-gradient-to-r from-[var(--gold)] to-[#D4B068]"
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-6 py-4 bg-[var(--gold)]/5 border-t border-[var(--gold)]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
                      Valor total calculado
                    </span>
                    <span className="text-base font-semibold text-[var(--gold)]">
                      {resultado.valorFinal.toLocaleString("pt-PT")} €
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--foreground-muted)]/60 mt-1 leading-relaxed">
                    Estimativa baseada em pesos sectoriais do mercado equestre lusitano. Não
                    substitui avaliação presencial.
                  </p>
                </div>
              </div>
            );
          })()}
        </BlurredProSection>

        {/* PRO: Como Aumentar o Valor */}
        <BlurredProSection isSubscribed={isSubscribed} title="Como Aumentar o Valor do Seu Cavalo">
          {(() => {
            const morfMedia =
              (form.morfologia + form.garupa + form.espádua + form.cabeca + form.membros) / 5;
            const andMedia =
              (form.andamentos + form.elevacao + form.suspensao + form.regularidade) / 4;
            const treinoKeys = [
              "potro",
              "desbravado",
              "iniciado",
              "elementar",
              "medio",
              "avancado",
              "alta_escola",
              "grand_prix",
            ];
            const treinoIdx = treinoKeys.indexOf(form.treino);

            const todasDicas: {
              titulo: string;
              ganhoMin: number;
              ganhoMax: number;
              descricao: string;
              cor: string;
              mostrar: boolean;
            }[] = [
              {
                titulo: "Formação Profissional",
                ganhoMin: 500,
                ganhoMax: 2000,
                descricao:
                  "Certificação por treinador FEI pode aumentar o valor de mercado significativamente ao validar o nível técnico do cavalo.",
                cor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                mostrar: treinoIdx < 4,
              },
              {
                titulo: "Participação em Provas",
                ganhoMin: 1000,
                ganhoMax: 3000,
                descricao:
                  "Resultados em provas regionais e nacionais valorizam o perfil do cavalo e aumentam a confiança dos compradores.",
                cor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                mostrar: form.competicoes === "nenhuma" && treinoIdx >= 2,
              },
              {
                titulo: "Documentação Genética",
                ganhoMin: 300,
                ganhoMax: 800,
                descricao:
                  "Resultados de testes genéticos e rastreios de saúde aumentam a confiança do comprador e reduzem o tempo de negociação.",
                cor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
                mostrar: !form.raioX || !form.exameVeterinario,
              },
              {
                titulo: "Fotografia Profissional",
                ganhoMin: 200,
                ganhoMax: 500,
                descricao:
                  "Fotos e vídeo profissional reduzem o tempo de venda em 40% e permitem atingir compradores internacionais.",
                cor: "bg-amber-500/10 border-amber-500/20 text-amber-400",
                mostrar: true,
              },
              {
                titulo: "Exposição Internacional",
                ganhoMin: 2000,
                ganhoMax: 5000,
                descricao:
                  "Participação em Lusitano World Championship ou similares aumenta a visibilidade e eleva significativamente o teto de valor.",
                cor: "bg-rose-500/10 border-rose-500/20 text-rose-400",
                mostrar: form.competicoes === "regional" || form.competicoes === "nacional",
              },
              {
                titulo: "Trabalho de Ginástica Funcional",
                ganhoMin: 300,
                ganhoMax: 1200,
                descricao:
                  "Melhoria da conformação funcional e postura pode valorizar a apresentação e aumentar a nota em avaliações morfológicas.",
                cor: "bg-teal-500/10 border-teal-500/20 text-teal-400",
                mostrar: morfMedia < 7.5 || andMedia < 7,
              },
            ];

            const dicasFiltradas = todasDicas.filter((d) => d.mostrar).slice(0, 4);

            return (
              <div className="bg-[var(--background-secondary)]/50 rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
                  <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb size={16} className="text-[var(--gold)]" />
                    Como Aumentar o Valor do Seu Cavalo
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    Recomendações personalizadas baseadas na sua análise
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 p-6">
                  {dicasFiltradas.map((dica, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-5 border ${dica.cor} hover:scale-[1.01] transition-transform duration-200`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--gold)]/10 border border-[var(--gold)]/20 shrink-0">
                          <Sparkles size={14} className="text-[var(--gold)]" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-[var(--background-card)] text-[var(--gold)] border border-[var(--gold)]/20 whitespace-nowrap">
                          +{dica.ganhoMin.toLocaleString("pt-PT")} a{" "}
                          {dica.ganhoMax.toLocaleString("pt-PT")} €
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-2">
                        {dica.titulo}
                      </h4>
                      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                        {dica.descricao}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-3 bg-[var(--background-card)] border-t border-[var(--border)]">
                  <p className="text-[10px] text-[var(--foreground-muted)]/60 leading-relaxed">
                    Estimativas de valorização baseadas em médias do sector equestre. Os resultados
                    podem variar conforme o perfil do comprador e o contexto de mercado.
                  </p>
                </div>
              </div>
            );
          })()}
        </BlurredProSection>

        {/* Informacoes do Cavalo */}
        <div className="bg-[var(--background-secondary)]/30 rounded-xl p-6 border border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
            {t.calculadora.eval_summary}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-[var(--foreground-muted)] block">
                {t.calculadora.result_age}
              </span>
              <span className="text-[var(--foreground-secondary)]">
                {form.idade} {t.calculadora.label_years}
              </span>
            </div>
            <div>
              <span className="text-[var(--foreground-muted)] block">
                {t.calculadora.result_sex}
              </span>
              <span className="text-[var(--foreground-secondary)]">
                {form.sexo === "garanhao"
                  ? t.calculadora.sex_stallion
                  : form.sexo === "egua"
                    ? t.calculadora.sex_mare
                    : t.calculadora.sex_gelding}
              </span>
            </div>
            <div>
              <span className="text-[var(--foreground-muted)] flex items-center gap-1">
                {t.calculadora.result_level}
                <SourceBadge
                  source="FEI"
                  tooltip={
                    (t.calculadora as Record<string, string>).source_treino ??
                    "Niveis de treino referenciados as escalas da FEI"
                  }
                />
              </span>
              <span className="text-[var(--foreground-secondary)] capitalize">
                {form.treino.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-[var(--foreground-muted)] block">
                {t.calculadora.result_market}
              </span>
              <span className="text-[var(--foreground-secondary)]">{form.mercado}</span>
            </div>
          </div>
        </div>

        <ResultActions
          onExportPDF={onExportPDF}
          onShare={onShare}
          onPrint={() => window.print()}
          onSendEmail={onSendEmail}
          isPremium={isSubscribed}
          isExporting={isExporting}
        />

        {/* Tool Chain: Comparar com outros cavalos */}
        {onComparar && (
          <button
            onClick={onComparar}
            className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2"
          >
            <BarChart3 size={16} />
            Comparar com outros cavalos
            <ChevronRight size={16} />
          </button>
        )}

        <MethodologyPanel
          title={
            (t.calculadora as Record<string, string>).methodology_panel_title ??
            "Metodologia de Avaliacao"
          }
          factors={[
            {
              name: (t.calculadora as Record<string, string>).factor_conformacao ?? "Conformacao",
              weight: "15%",
              description:
                (t.calculadora as Record<string, string>).factor_conformacao_desc ??
                "Avaliacao segundo padroes APSL",
              standard: "APSL",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_andamentos ?? "Andamentos",
              weight: "15%",
              description:
                (t.calculadora as Record<string, string>).factor_andamentos_desc ??
                "Elevacao, suspensao, regularidade",
              standard: "FEI",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_treino ?? "Treino",
              weight: "15%",
              description:
                (t.calculadora as Record<string, string>).factor_treino_desc ??
                "Nivel conforme escalas FEI",
              standard: "FEI",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_linhagem ?? "Linhagem",
              weight: "12%",
              description:
                (t.calculadora as Record<string, string>).factor_linhagem_desc ??
                "Qualidade do pedigree e registo",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_competicoes ?? "Competicoes",
              weight: "10%",
              description:
                (t.calculadora as Record<string, string>).factor_competicoes_desc ??
                "Historial competitivo e resultados",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_blup ?? "BLUP",
              weight: "8%",
              description:
                (t.calculadora as Record<string, string>).factor_blup_desc ??
                "Estimativa de merito genetico",
              standard: "modelo",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_temperamento ?? "Temperamento",
              weight: "8%",
              description:
                (t.calculadora as Record<string, string>).factor_temperamento_desc ??
                "Docilidade e predisposicao para trabalho",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_saude ?? "Saude",
              weight: "7%",
              description:
                (t.calculadora as Record<string, string>).factor_saude_desc ??
                "Historial clinico e documentacao veterinaria",
              standard: "veterinário",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_idade ?? "Idade",
              weight: "5%",
              description:
                (t.calculadora as Record<string, string>).factor_idade_desc ??
                "Faixa etaria ideal: 6-12 anos",
            },
            {
              name: (t.calculadora as Record<string, string>).factor_mercado ?? "Mercado",
              weight: "5%",
              description:
                (t.calculadora as Record<string, string>).factor_mercado_desc ??
                "Dinamicas regionais de oferta e procura",
              standard: "mercado",
            },
          ]}
          limitations={[
            (t.calculadora as Record<string, string>).limitation_1 ??
              "Nao considera condicao fisica actual do cavalo",
            (t.calculadora as Record<string, string>).limitation_2 ??
              "BLUP e uma estimativa simplificada, nao oficial APSL",
            (t.calculadora as Record<string, string>).limitation_3 ??
              "Valores de mercado baseados em medias sectoriais",
            (t.calculadora as Record<string, string>).limitation_4 ??
              "Nao substitui avaliacao presencial por profissional qualificado",
          ]}
          version={
            (t.calculadora as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"
          }
          references={[
            (t.calculadora as Record<string, string>).ref_apsl ?? "Padroes de conformacao APSL",
            (t.calculadora as Record<string, string>).ref_fei ?? "Escalas de treino FEI",
            (t.calculadora as Record<string, string>).ref_mercado ??
              "Medias mercado equestre PT (2024-2025)",
          ]}
        />

        <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]">
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            <strong className="text-[var(--foreground-secondary)]">
              {t.calculadora.disclaimer_title}
            </strong>{" "}
            {t.calculadora.disclaimer_text}
            <span className="block mt-1 text-[10px] text-[var(--foreground-muted)]/40 font-mono">
              {(t.calculadora as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"}
            </span>
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-[var(--foreground-muted)] mb-4">
            {t.calculadora.need_professional}
          </p>
          <Link
            href="/profissionais"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--gold)]/50 text-[var(--gold)] rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
          >
            <BookOpen size={16} />
            {t.calculadora.find_evaluators}
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }
);

export default ResultadoDisplay;
