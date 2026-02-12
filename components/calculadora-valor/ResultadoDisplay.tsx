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
import { useLanguage } from "@/context/LanguageContext";
import { MERCADOS } from "./data";
import { calcularProjecaoValor, calcularTrainingROI } from "./projections";
import type { FormData, Resultado } from "./types";

interface ResultadoDisplayProps {
  resultado: Resultado;
  form: FormData;
  onExportPDF: () => void;
  onShare: () => void;
  isExporting: boolean;
  isSubscribed: boolean;
}

const ResultadoDisplay = forwardRef<HTMLDivElement, ResultadoDisplayProps>(
  function ResultadoDisplay(
    { resultado, form, onExportPDF, onShare, isExporting, isSubscribed },
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

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[var(--foreground-muted)]">
              <span>Min: {resultado.valorMin.toLocaleString("pt-PT")}&euro;</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              <span>Max: {resultado.valorMax.toLocaleString("pt-PT")}&euro;</span>
            </div>

            {/* Gauge indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 mt-8">
              <AnimatedGauge
                value={resultado.confianca}
                label={t.calculadora.confidence}
                size={160}
              />
              <AnimatedGauge
                value={resultado.percentil}
                label={t.calculadora.market_psl}
                size={160}
              />
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-[var(--foreground-muted)]">
                {t.calculadora.multiplier}:{" "}
              </span>
              <span className="text-lg font-medium text-[var(--foreground)]">
                {resultado.multiplicador}x
              </span>
            </div>
          </div>
        </div>

        {/* Horse Silhouette - Morphology Map */}
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-4">
            {t.calculadora.morph_title || "Mapa Morfológico"}
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
              <span className="text-[var(--foreground-muted)] block">
                {t.calculadora.result_level}
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
          isExporting={isExporting}
        />

        <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]">
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            <strong className="text-[var(--foreground-secondary)]">
              {t.calculadora.disclaimer_title}
            </strong>{" "}
            {t.calculadora.disclaimer_text}
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
