"use client";

import {
  Dna,
  AlertTriangle,
  CheckCircle,
  Baby,
  Palette,
  Activity,
  ChevronRight,
  Info,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import AnimatedRing from "@/components/tools/AnimatedRing";
import Confetti from "@/components/tools/Confetti";
import BlurredProSection from "@/components/tools/BlurredProSection";
import ResultActions from "@/components/tools/ResultActions";
import BreedingCalendar from "@/components/tools/BreedingCalendar";
import OffspringRadar from "@/components/tools/OffspringRadar";
import FoalValueProjection from "@/components/tools/FoalValueProjection";
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
}: CompatibilityResultsProps) {
  const { t } = useLanguage();

  // PRO breeding projections
  const offspringAxes = calcularAptidoesPotro(garanhao, egua);
  const foalValues = calcularValorPotro(resultado, garanhao, egua);
  const parentQuality = calcularQualidadePais(garanhao, egua);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
      {/* Confetti celebration */}
      <div className="relative">
        <Confetti trigger={true} particleCount={50} duration={2800} />
      </div>

      {/* Score Principal */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--background-secondary)] via-[var(--background-secondary)] to-[var(--background-card)] p-8 border border-[var(--border)] mb-6">
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

          {/* AnimatedRing replaces AnimatedCounter */}
          <div className="flex justify-center my-4">
            <AnimatedRing
              value={resultado.score}
              label={t.verificador.compatibility}
              size={200}
              strokeWidth={10}
            />
          </div>

          <p className="text-[var(--foreground-muted)] text-sm">
            {garanhaoNome || t.verificador.tab_stallion} × {eguaNome || t.verificador.tab_mare}
          </p>
        </div>
      </div>

      {/* Result Actions */}
      <div className="mb-6">
        <ResultActions
          onExportPDF={onExportPDF}
          onShare={onShare}
          onPrint={() => window.print()}
          isExporting={isExporting}
        />
      </div>

      {/* Metricas Geneticas */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-2">
            <Dna size={16} className="text-purple-400" />
            {t.verificador.coi_predicted}
          </div>
          <div
            className={`text-3xl font-light ${resultado.coi > 6.25 ? "text-amber-400" : "text-emerald-400"}`}
          >
            {resultado.coi.toFixed(1)}%
          </div>
          <div className="text-xs text-[var(--foreground-muted)] mt-1">
            {resultado.coi <= 3
              ? t.verificador.coi_excellent
              : resultado.coi <= 6.25
                ? t.verificador.coi_acceptable
                : t.verificador.coi_high}
          </div>
          <div className="mt-3 h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
              style={{ width: `${Math.min((resultado.coi / 12.5) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-2">
            <Activity size={16} className="text-blue-400" />
            {t.verificador.blup_predicted}
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
                {resultado.pontosForteseFracos.fortes.map((ponto, i) => (
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
                {resultado.pontosForteseFracos.fracos.map((ponto, i) => (
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

      {/* Previsao de Pelagem */}
      <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Palette className="text-purple-400" size={18} />
          {t.verificador.coat_prediction}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {resultado.pelagens.map((p, i) => (
            <div key={i} className="bg-[var(--background-card)]/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--foreground-secondary)] font-medium">{p.cor}</span>
                <span className="text-purple-400 font-bold">{p.prob}%</span>
              </div>
              <div className="h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${p.prob}%` }}
                />
              </div>
              <span className="text-xs text-[var(--foreground-muted)] mt-1 block">
                {p.genetica}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Riscos */}
      {resultado.riscos.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={18} />
            {t.verificador.alerts_risks}
          </h3>
          {resultado.riscos.map((r, i) => (
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

      {/* Factores Detalhados - PRO only */}
      <BlurredProSection isSubscribed={isSubscribed} title={t.verificador.detailed_analysis}>
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
            {t.verificador.detailed_analysis}
          </h3>
          <div className="space-y-4">
            {resultado.factores.map((f, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm text-[var(--foreground-secondary)]">{f.nome}</span>
                    <span className="text-xs text-[var(--foreground-muted)] ml-2 hidden sm:inline">
                      {f.descricao}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      f.tipo === "excelente"
                        ? "text-emerald-400"
                        : f.tipo === "bom"
                          ? "text-blue-400"
                          : f.tipo === "aviso"
                            ? "text-amber-400"
                            : f.tipo === "risco"
                              ? "text-red-400"
                              : "text-[var(--foreground-muted)]"
                    }`}
                  >
                    {f.score}/{f.max}
                  </span>
                </div>
                <div className="h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      f.tipo === "excelente"
                        ? "bg-emerald-500"
                        : f.tipo === "bom"
                          ? "bg-blue-500"
                          : f.tipo === "aviso"
                            ? "bg-amber-500"
                            : f.tipo === "risco"
                              ? "bg-red-500"
                              : "bg-[var(--foreground-muted)]"
                    }`}
                    style={{ width: `${(f.score / f.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </BlurredProSection>

      {/* Recomendacoes - PRO only */}
      {resultado.recomendacoes.length > 0 && (
        <BlurredProSection isSubscribed={isSubscribed} title={t.verificador.recommendations}>
          <div className="bg-pink-500/5 rounded-xl p-6 border border-pink-500/20 mb-6">
            <h3 className="text-sm font-medium text-pink-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={16} />
              {t.verificador.recommendations}
            </h3>
            <ul className="space-y-3">
              {resultado.recomendacoes.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-[var(--foreground-secondary)]"
                >
                  <ChevronRight size={16} className="text-pink-400 flex-shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </BlurredProSection>
      )}

      {/* PRO: Calendário de Criação */}
      <BlurredProSection isSubscribed={isSubscribed} title={t.verificador.breeding_calendar_title}>
        <div className="mb-6">
          <BreedingCalendar />
        </div>
      </BlurredProSection>

      {/* PRO: Radar de Aptidão do Potro */}
      <BlurredProSection isSubscribed={isSubscribed} title={t.verificador.offspring_radar_title}>
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">
            {t.verificador.offspring_radar_title}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-6">
            {t.verificador.offspring_radar_desc}
          </p>
          <OffspringRadar axes={offspringAxes} />
        </div>
      </BlurredProSection>

      {/* PRO: Estimativa de Valor do Potro */}
      <BlurredProSection isSubscribed={isSubscribed} title={t.verificador.foal_value_title}>
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">
            {t.verificador.foal_value_title}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-6">
            {t.verificador.foal_value_desc}
          </p>
          <FoalValueProjection foalValues={foalValues} parentQuality={parentQuality} />
          <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed mt-4">
            {t.verificador.foal_value_disclaimer}
          </p>
        </div>
      </BlurredProSection>

      {/* Disclaimer */}
      <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]">
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          <strong className="text-[var(--foreground-secondary)]">
            {t.verificador.disclaimer_title}
          </strong>{" "}
          {t.verificador.disclaimer_text}
        </p>
      </div>
    </div>
  );
}
