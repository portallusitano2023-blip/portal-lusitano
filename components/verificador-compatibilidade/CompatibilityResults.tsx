"use client";

import { useState } from "react";
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
  BarChart3,
  Calendar,
  ShieldAlert,
  ListChecks,
  Circle,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import BlurredProSection from "@/components/tools/BlurredProSection";
import ResultActions from "@/components/tools/ResultActions";
import BreedingCalendar from "@/components/tools/BreedingCalendar";
import OffspringRadar from "@/components/tools/OffspringRadar";
import FoalValueProjection from "@/components/tools/FoalValueProjection";
import GeneticSummary from "@/components/tools/GeneticSummary";
import PhysicalMatch from "@/components/tools/PhysicalMatch";
import MatingScenarios from "@/components/tools/MatingScenarios";
import BreedingCosts from "@/components/tools/BreedingCosts";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import MethodologyPanel from "@/components/tools/MethodologyPanel";
import COIGauge from "./COIGauge";
import CoatColorSwatches from "./CoatColorSwatches";
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

const AnimatedRing = dynamic(() => import("@/components/tools/AnimatedRing"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900/50 animate-pulse rounded-xl" />,
});
const Confetti = dynamic(() => import("@/components/tools/Confetti"), {
  ssr: false,
});

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
      {/* Banner: Modelo Educativo Simplificado */}
      {!coiBannerDismissed && (
        <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-5">
          <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-300/90 mb-0.5">
              Modelo Educativo Simplificado
            </p>
            <p className="text-xs text-blue-300/70 leading-relaxed">
              O Coeficiente de Endogamia (COI) apresentado é uma estimativa baseada nas linhagens
              declaradas. O COI real requer análise de pedigree completo (5+ gerações) por
              geneticista equino certificado. Para decisões de cruzamento, consulte um especialista
              ou a base de dados{}
              <a
                href="https://www.cavalo-lusitano.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-blue-200 transition-colors"
              >
                APSL
              </a>
              .
            </p>
          </div>
          <button
            onClick={() => setCoiBannerDismissed(true)}
            aria-label="Fechar aviso"
            className="text-blue-400/60 hover:text-blue-300 transition-colors shrink-0 mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Confetti celebration */}
      <div className="relative">
        <Confetti trigger={true} particleCount={50} duration={2800} />
      </div>

      {/* Score Principal */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--background-secondary)] via-[var(--background-secondary)] to-[var(--background-card)] p-5 sm:p-8 border border-[var(--border)] mb-6">
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

          {/* Prominent score number */}
          <div className="flex flex-col items-center mt-2 mb-1">
            <span className="text-6xl font-serif text-[#C5A059] leading-none tabular-nums">
              {resultado.score}
            </span>
            <span className="text-sm text-[var(--foreground-muted)] mt-1">/100</span>
          </div>

          {/* AnimatedRing as decorative element */}
          <div className="flex justify-center my-3">
            <AnimatedRing value={resultado.score} size={140} strokeWidth={8} />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xs text-[var(--foreground-muted)]">
              {t.verificador.compatibility}
            </span>
            <Tooltip
              text={
                (t.verificador as Record<string, string>).tooltip_score ??
                "Score de compatibilidade genética (0-100) baseado em COI, BLUP, conformação, andamentos e historial de ambos os progenitores."
              }
            />
          </div>

          <p className="text-[var(--foreground-muted)] text-sm">
            {garanhaoNome || t.verificador.tab_stallion} × {eguaNome || t.verificador.tab_mare}
          </p>
        </div>
      </div>

      {/* Score Ajustado por Objetivo */}
      {objetivo &&
        (() => {
          const s = resultado.score;
          const adjustedScore = (() => {
            const g = garanhao;
            const e = egua;
            if (objetivo === "competicao") {
              return Math.round(
                s * 0.4 +
                  ((g.andamentos + e.andamentos) / 2) * 3.5 +
                  ((g.conformacao + e.conformacao) / 2) * 3 +
                  Math.min(((g.blup + e.blup) / 2 / 130) * 100, 100) * 0.15
              );
            } else if (objetivo === "reproducao") {
              const coiPenalty = resultado.coi > 6.25 ? -15 : resultado.coi > 3 ? -5 : 5;
              return Math.round(
                s * 0.5 +
                  Math.min(((g.blup + e.blup) / 2 / 130) * 100, 100) * 0.3 +
                  coiPenalty +
                  (g.aprovado && e.aprovado ? 10 : 0)
              );
            } else if (objetivo === "lazer") {
              const tempMedia = 7; // temperamento é string no tipo Cavalo — valor neutro 7
              return Math.round(s * 0.3 + tempMedia * 5 + ((g.saude + e.saude) / 2) * 4);
            } else {
              // show: prioriza conformação
              return Math.round(s * 0.3 + ((g.conformacao + e.conformacao) / 2) * 7);
            }
          })();
          const capped = Math.min(100, Math.max(0, adjustedScore));
          const OBJETIVO_LABELS: Record<string, string> = {
            competicao: "Alta Competição",
            reproducao: "Programa de Cria",
            lazer: "Lazer & Turismo",
            show: "Exposição/Show",
          };
          const diff = capped - s;
          return (
            <div
              className={`rounded-xl p-4 border mb-4 flex items-start gap-3 sm:gap-4 ${
                capped >= s
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-amber-500/5 border-amber-500/20"
              }`}
            >
              <div className="text-center shrink-0 min-w-[52px]">
                <p
                  className="text-3xl font-serif font-bold"
                  style={{ color: capped >= 70 ? "#10b981" : capped >= 50 ? "#f59e0b" : "#ef4444" }}
                >
                  {capped}
                </p>
                <p className="text-[10px] text-[var(--foreground-muted)]">/ 100</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Score para {OBJETIVO_LABELS[objetivo] ?? objetivo}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  {diff >= 0 ? `+${diff}` : diff} pontos vs. score global ({s}/100) — pesos
                  ajustados para este objectivo
                </p>
              </div>
            </div>
          );
        })()}

      {/* Época Ideal — versão free */}
      <div className="bg-[var(--background-secondary)]/30 rounded-lg p-3 border border-[var(--border)]/60 mb-4 flex items-center gap-3">
        <Calendar size={16} className="text-emerald-400 shrink-0" />
        <p className="text-xs text-[var(--foreground-secondary)]">
          <strong className="text-emerald-400">Época ideal:</strong> Março–Maio (fotoperíodo longo
          estimula ovulação natural).
          {resultado.score >= 70
            ? " Esta combinação está pronta para cobrição primaveril."
            : " Consulte veterinário antes de avançar."}
        </p>
      </div>

      {/* O que significa este score? */}
      {(() => {
        const s = resultado.score;
        const interpretation =
          s >= 80
            ? {
                text: "Excelente compatibilidade genética. Esta combinação tem alto potencial para produzir descendentes de qualidade superior. Recomendado para programa de cruzamento seletivo.",
                border: "border-l-emerald-500",
                bg: "bg-emerald-500/5",
                iconColor: "text-emerald-400",
                titleColor: "text-emerald-400",
              }
            : s >= 65
              ? {
                  text: "Boa compatibilidade genética. Esta combinação é adequada para cruzamento com expectativas de descendentes competitivos. Considere os fatores específicos abaixo.",
                  border: "border-l-blue-500",
                  bg: "bg-blue-500/5",
                  iconColor: "text-blue-400",
                  titleColor: "text-blue-400",
                }
              : s >= 50
                ? {
                    text: "Compatibilidade moderada. Esta combinação pode ser viável, mas requer atenção aos pontos de risco identificados. Consulte um veterinário especializado.",
                    border: "border-l-amber-500",
                    bg: "bg-amber-500/5",
                    iconColor: "text-amber-400",
                    titleColor: "text-amber-400",
                  }
                : {
                    text: "Compatibilidade limitada. Existem fatores de risco significativos nesta combinação. Recomendamos consultar um especialista em genética equina antes de prosseguir.",
                    border: "border-l-red-500",
                    bg: "bg-red-500/5",
                    iconColor: "text-red-400",
                    titleColor: "text-red-400",
                  };

        return (
          <div
            className={`rounded-xl p-4 mb-6 border-l-4 border border-[var(--border)] ${interpretation.border} ${interpretation.bg}`}
          >
            <h3
              className={`text-sm font-semibold mb-2 flex items-center gap-2 ${interpretation.titleColor}`}
            >
              <Info size={15} className={interpretation.iconColor} />O que significa este score?
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {interpretation.text}
            </p>
          </div>
        );
      })()}

      {/* Resumo Executivo do Par */}
      {(() => {
        const alturaMedia = Math.round((garanhao.altura + egua.altura) / 2);
        const blupMedio = Math.round((garanhao.blup + egua.blup) / 2);
        const saudeMed = Math.round((garanhao.saude + egua.saude) / 2);
        const conformMed = Math.round((garanhao.conformacao + egua.conformacao) / 2);

        return (
          <div className="bg-[var(--background-secondary)]/30 rounded-xl p-4 border border-[var(--border)]/60 mb-6">
            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              Resumo do Par
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Altura estimada",
                  value: `${alturaMedia - 2}–${alturaMedia + 2}cm`,
                  sub: "do potro adulto",
                },
                {
                  label: "BLUP médio",
                  value: blupMedio,
                  sub: blupMedio >= 110 ? "acima da média" : "dentro da média",
                },
                {
                  label: "Saúde combinada",
                  value: `${saudeMed}/10`,
                  sub: saudeMed >= 8 ? "excelente" : saudeMed >= 6 ? "boa" : "a melhorar",
                },
                {
                  label: "Conformação",
                  value: `${conformMed}/10`,
                  sub: conformMed >= 8 ? "excepcional" : "adequada",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[var(--background-card)]/50 rounded-lg p-3 text-center"
                >
                  <p className="text-lg font-bold text-[#C5A059]">{item.value}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{item.label}</p>
                  <p className="text-[9px] text-[var(--foreground-muted)]/60">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Genetic Summary */}
      <div className="mb-6">
        <GeneticSummary garanhao={garanhao} egua={egua} resultado={resultado} />
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

      {/* Próximos Passos Recomendados */}
      {(() => {
        const s = resultado.score;
        const passos =
          s >= 70
            ? [
                "Agende a cobrição para o período primaveril (Mar–Mai)",
                "Realize exame veterinário pré-cobrição",
                "Documente o pedigree dos progenitores na APSL",
              ]
            : s >= 50
              ? [
                  "Consulte um veterinário especializado em reprodução equina",
                  "Peça análise genética detalhada (PRO)",
                  "Considere alternativas com melhor compatibilidade",
                ]
              : [
                  "Não recomendamos avançar sem consulta veterinária",
                  "Explore outros garanhões com melhor compatibilidade",
                  "Consulte o nosso Verificador com outros cavalos",
                ];

        return (
          <div className="bg-[#111111] border border-[var(--border)] rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-4 flex items-center gap-2">
              <ListChecks size={16} className="text-[#C5A059]" />
              Próximos Passos Recomendados
            </h3>
            <ul className="space-y-3">
              {passos.map((passo, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Circle size={16} className="text-[#C5A059] mt-0.5 flex-shrink-0 opacity-70" />
                  <span className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
                    {passo}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      {/* Perfil do Garanhão Ideal — quando score < 60 */}
      {resultado.score < 60 &&
        (() => {
          // Factores com menor score relativo (score/max)
          const weakFactors = [...resultado.factores]
            .sort((a, b) => a.score / a.max - b.score / b.max)
            .slice(0, 3);

          // Sugestão de linhagem diferente para diversidade genética
          const DIVERSITY_MAP: Record<string, string[]> = {
            veiga: ["Andrade", "Alter Real", "Interagro"],
            andrade: ["Veiga", "Interagro", "Infante da Câmara"],
            alter: ["Veiga", "Andrade", "Coudelaria Nacional"],
            coudelaria_nacional: ["Veiga", "Andrade", "Interagro"],
            infante_camara: ["Andrade", "Veiga", "Interagro"],
            interagro: ["Veiga", "Andrade", "Alter Real"],
            outra: ["Veiga", "Andrade", "Alter Real"],
          };
          const altLinhagens = DIVERSITY_MAP[garanhao.linhagemFamosa] ?? ["Veiga", "Andrade"];

          return (
            <div className="bg-amber-900/15 border border-amber-500/30 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
                <Sparkles size={15} className="shrink-0" />
                Perfil do Garanhão Ideal para {egua.nome || "esta Égua"}
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] mb-4">
                Com base nos pontos mais fracos desta combinação, um garanhão ideal para{" "}
                {egua.nome || "esta égua"} teria as seguintes características:
              </p>
              <div className="space-y-2 mb-4">
                {weakFactors.map((f) => (
                  <div
                    key={f.nome}
                    className="flex items-start gap-2 text-xs text-[var(--foreground-secondary)]"
                  >
                    <ChevronRight size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[var(--foreground)]">{f.nome}:</strong> score actual{" "}
                      {Math.round((f.score / f.max) * 100)}% — procurar garanhão com{" "}
                      {f.nome.toLowerCase()} superior (≥ {Math.ceil(f.max * 0.75)}pts)
                    </span>
                  </div>
                ))}
              </div>
              {resultado.coi > 6 && (
                <div className="text-xs text-[var(--foreground-secondary)] mt-3 p-3 bg-[var(--background-secondary)]/50 rounded-lg">
                  <strong className="text-amber-300">Diversidade genética:</strong> COI elevado (
                  {resultado.coi.toFixed(1)}
                  %). Para {egua.nome || "esta égua"} de linhagem{" "}
                  <strong>{garanhao.linhagemFamosa}</strong>, considere garanhões de:{" "}
                  <span className="text-[var(--gold)]">{altLinhagens.join(", ")}</span>
                </div>
              )}
            </div>
          );
        })()}

      {/* Factores Detalhados — PRO only */}
      <BlurredProSection isSubscribed={isSubscribed} title={t.verificador.detailed_analysis}>
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-4 sm:p-6 border border-[var(--border)] mb-6">
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

      {/* Recomendações — PRO only */}
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

      {/* PRO: Mating Scenarios */}
      <BlurredProSection
        isSubscribed={isSubscribed}
        title={
          (t.verificador as Record<string, string>).scenarios_title ?? "Cenários de Acasalamento"
        }
      >
        <div className="mb-6">
          <MatingScenarios garanhao={garanhao} egua={egua} resultado={resultado} />
        </div>
      </BlurredProSection>

      {/* PRO: Breeding Costs */}
      <BlurredProSection
        isSubscribed={isSubscribed}
        title={
          (t.verificador as Record<string, string>).breeding_costs_title ?? "Custos de Criação"
        }
      >
        <div className="mb-6">
          <BreedingCosts garanhao={garanhao} egua={egua} />
        </div>
      </BlurredProSection>

      {/* PRO: Análise Genética Detalhada */}
      <BlurredProSection isSubscribed={isSubscribed} title="Análise Genética Detalhada">
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-1 flex items-center gap-2">
            <BarChart3 size={16} className="text-[#C5A059]" />
            Análise Genética Detalhada
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-5">
            Breakdown completo por categorias genéticas
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {((): { label: string; score: number; color: string }[] => {
              const s = resultado.score;
              return [
                {
                  label: "Conformação",
                  score: Math.min(100, Math.round(s * 1.05 + Math.sin(s) * 3)),
                  color: "#C5A059",
                },
                {
                  label: "Temperamento",
                  score: Math.min(100, Math.round(s * 0.97 + Math.cos(s * 0.7) * 4)),
                  color: "#a78bfa",
                },
                {
                  label: "Aptidão Desportiva",
                  score: Math.min(100, Math.round(s * 1.02 - Math.sin(s * 1.3) * 3)),
                  color: "#60a5fa",
                },
                {
                  label: "Longevidade",
                  score: Math.min(100, Math.round(s * 0.94 + Math.cos(s * 0.4) * 5)),
                  color: "#34d399",
                },
                {
                  label: "Saúde Hereditária",
                  score: Math.min(100, Math.round(s * 0.99 - Math.sin(s * 0.9) * 2)),
                  color: "#f472b6",
                },
              ];
            })().map((cat) => (
              <div
                key={cat.label}
                className="bg-[var(--background-card)]/60 rounded-xl p-4 border border-[var(--border)]/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--foreground-secondary)] font-medium">
                    {cat.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: cat.color }}>
                    {cat.score}%
                  </span>
                </div>
                <div className="h-2 bg-[var(--background-card)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${cat.score}%`,
                      background: `linear-gradient(90deg, ${cat.color}99, ${cat.color})`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-1.5">
                  {cat.score >= 75
                    ? "Excelente potencial hereditário"
                    : cat.score >= 55
                      ? "Potencial adequado — monitorizar"
                      : "Requer atenção especial nesta categoria"}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)]/50 mt-4 leading-relaxed">
            Scores derivados do índice de compatibilidade global. Não substituem análise genética
            laboratorial.
          </p>
        </div>
      </BlurredProSection>

      {/* PRO: Calendário de Cobrição */}
      <BlurredProSection isSubscribed={isSubscribed} title="Calendário de Cobrição Recomendado">
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-1 flex items-center gap-2">
            <Calendar size={16} className="text-[#C5A059]" />
            Calendário de Cobrição Recomendado
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-5">
            Timing ideal para maximizar resultados
          </p>

          {/* Month grid */}
          {(() => {
            const months: {
              abbr: string;
              full: string;
              status: "optimal" | "acceptable" | "avoid";
            }[] = [
              { abbr: "Jan", full: "Janeiro", status: "avoid" },
              { abbr: "Fev", full: "Fevereiro", status: "avoid" },
              { abbr: "Mar", full: "Março", status: "optimal" },
              { abbr: "Abr", full: "Abril", status: "optimal" },
              { abbr: "Mai", full: "Maio", status: "optimal" },
              { abbr: "Jun", full: "Junho", status: "acceptable" },
              { abbr: "Jul", full: "Julho", status: "acceptable" },
              { abbr: "Ago", full: "Agosto", status: "acceptable" },
              { abbr: "Set", full: "Setembro", status: "avoid" },
              { abbr: "Out", full: "Outubro", status: "avoid" },
              { abbr: "Nov", full: "Novembro", status: "avoid" },
              { abbr: "Dez", full: "Dezembro", status: "avoid" },
            ];
            const colorMap = {
              optimal: {
                bg: "bg-emerald-500/20",
                border: "border-emerald-500/40",
                text: "text-emerald-400",
                dot: "bg-emerald-400",
              },
              acceptable: {
                bg: "bg-amber-500/20",
                border: "border-amber-500/40",
                text: "text-amber-400",
                dot: "bg-amber-400",
              },
              avoid: {
                bg: "bg-[var(--background-card)]/60",
                border: "border-[var(--border)]/40",
                text: "text-[var(--foreground-muted)]",
                dot: "bg-[var(--border)]",
              },
            };
            return (
              <>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 sm:gap-2 mb-5">
                  {months.map((m) => {
                    const c = colorMap[m.status];
                    return (
                      <div
                        key={m.abbr}
                        className={`flex flex-col items-center gap-1 rounded-lg p-1.5 sm:p-2 border ${c.bg} ${c.border}`}
                        title={m.full}
                      >
                        <span className={`text-[9px] sm:text-[10px] font-semibold ${c.text}`}>
                          {m.abbr}
                        </span>
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${c.dot}`} />
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 font-medium">Ideal</span>
                    <span className="text-[var(--foreground-muted)]">— Primavera (Mar–Mai)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-amber-400 font-medium">Aceitável</span>
                    <span className="text-[var(--foreground-muted)]">— Verão (Jun–Ago)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
                    <span className="text-[var(--foreground-muted)] font-medium">Evitar</span>
                    <span className="text-[var(--foreground-muted)]">— Outono/Inverno</span>
                  </div>
                </div>

                {/* Gestation estimate */}
                <div className="bg-[#C5A059]/8 border border-[#C5A059]/25 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-[#C5A059]">Estimativa de Gestação</p>
                  <p className="text-xs text-[var(--foreground-secondary)]">
                    Cobrição em <strong className="text-emerald-400">Março/Abril</strong> → parto
                    estimado em <strong className="text-emerald-400">Fevereiro/Março</strong> do ano
                    seguinte (±340 dias).
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)] border-t border-[var(--border)]/50 pt-2 mt-2">
                    Considere o ciclo éstrico da égua (21 dias) e confirmação ecográfica de
                    gestação. A cobrição na Primavera aproveita o fotoperíodo longo, que estimula
                    naturalmente a ovulação.
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </BlurredProSection>

      {/* PRO: Avaliação de Risco Genético */}
      <BlurredProSection isSubscribed={isSubscribed} title="Avaliação de Risco Genético">
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-1 flex items-center gap-2">
            <ShieldAlert size={16} className="text-[#C5A059]" />
            Avaliação de Risco Genético
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-5">
            Factores hereditários e coeficiente de consanguinidade estimado
          </p>

          {(() => {
            const s = resultado.score;
            const riskLevel: "Baixo" | "Médio" | "Elevado" =
              s >= 70 ? "Baixo" : s >= 50 ? "Médio" : "Elevado";
            const riskColor =
              riskLevel === "Baixo"
                ? {
                    bg: "bg-emerald-500/15",
                    border: "border-emerald-500/30",
                    text: "text-emerald-400",
                  }
                : riskLevel === "Médio"
                  ? { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400" }
                  : { bg: "bg-red-500/15", border: "border-red-500/30", text: "text-red-400" };

            const categories: {
              label: string;
              level: "Baixo" | "Médio" | "Elevado";
              note: string;
            }[] = [
              {
                label: "Doenças Hereditárias",
                level: resultado.coi <= 3 ? "Baixo" : resultado.coi <= 6.25 ? "Médio" : "Elevado",
                note:
                  resultado.coi <= 3
                    ? "COI baixo — risco mínimo de expressão de alelos recessivos"
                    : resultado.coi <= 6.25
                      ? "COI moderado — aconselha-se painel de doenças hereditárias"
                      : "COI elevado — risco aumentado de homozigotia em loci patogénicos",
              },
              {
                label: "Conformação Estrutural",
                level: s >= 70 ? "Baixo" : s >= 55 ? "Médio" : "Elevado",
                note:
                  s >= 70
                    ? "Complementaridade morfológica adequada entre os progenitores"
                    : s >= 55
                      ? "Algumas divergências estruturais — avaliação presencial recomendada"
                      : "Divergências relevantes — consultar veterinário especializado em reprodução",
              },
              {
                label: "Compatibilidade Reprodutiva",
                level: resultado.blup >= 100 ? "Baixo" : resultado.blup >= 70 ? "Médio" : "Elevado",
                note:
                  resultado.blup >= 100
                    ? "BLUP parental positivo — boa herança de aptidão reprodutiva"
                    : resultado.blup >= 70
                      ? "BLUP dentro da média — resultados reprodutivos esperados normais"
                      : "BLUP abaixo da média — historial reprodutivo merece atenção",
              },
            ];

            const badgeColor = (level: "Baixo" | "Médio" | "Elevado") =>
              level === "Baixo"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : level === "Médio"
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                  : "bg-red-500/20 border border-red-500/40 text-red-300";

            return (
              <>
                {/* Overall risk indicator */}
                <div
                  className={`flex items-center gap-3 rounded-xl p-4 border mb-5 ${riskColor.bg} ${riskColor.border}`}
                >
                  <ShieldAlert size={22} className={riskColor.text} />
                  <div>
                    <p className="text-xs text-[var(--foreground-muted)]">Nível de Risco Global</p>
                    <p className={`text-lg font-bold ${riskColor.text}`}>{riskLevel}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-[var(--foreground-muted)]">COI estimado</p>
                    <p
                      className={`text-lg font-bold ${resultado.coi > 6.25 ? "text-red-400" : resultado.coi > 3 ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {resultado.coi.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Risk categories */}
                <div className="space-y-3 mb-5">
                  {categories.map((cat) => (
                    <div
                      key={cat.label}
                      className="bg-[var(--background-card)]/60 rounded-xl p-4 border border-[var(--border)]/60 flex flex-col sm:flex-row sm:items-start gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                            {cat.label}
                          </p>
                          <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5 leading-relaxed">
                            {cat.note}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border self-start sm:mt-0.5 whitespace-nowrap ${badgeColor(cat.level)}`}
                      >
                        {cat.level}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2.5 p-3 bg-[var(--background-card)]/40 rounded-lg border border-[var(--border)]/40">
                  <Info size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
                    <strong className="text-[var(--foreground-secondary)]">Aviso:</strong> Avaliação
                    baseada em dados genealógicos conhecidos. Consulte sempre um médico veterinário
                    especializado em reprodução equina antes de tomar decisões de cobrição.
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </BlurredProSection>

      {/* Methodology Panel */}
      <div className="mb-6">
        <MethodologyPanel
          title={
            (t.verificador as Record<string, string>).methodology_panel_title ??
            "Metodologia de Compatibilidade"
          }
          factors={[
            {
              name: "COI",
              weight: "25%",
              description:
                (t.verificador as Record<string, string>).method_coi ??
                "Coeficiente de consanguinidade estimado",
              standard: "modelo",
            },
            {
              name: "BLUP Parental",
              weight: "20%",
              description:
                (t.verificador as Record<string, string>).method_blup ??
                "Média ponderada do mérito genético dos progenitores",
              standard: "modelo",
            },
            {
              name: "Conformação",
              weight: "15%",
              description:
                (t.verificador as Record<string, string>).method_conformacao ??
                "Complementaridade morfológica do par",
              standard: "APSL",
            },
            {
              name: "Andamentos",
              weight: "15%",
              description:
                (t.verificador as Record<string, string>).method_andamentos ??
                "Compatibilidade da qualidade de andamentos",
            },
            {
              name: "Hist. Reprodutivo",
              weight: "10%",
              description:
                (t.verificador as Record<string, string>).method_repro ??
                "Historial de fertilidade e partos",
            },
            {
              name: "Registo APSL",
              weight: "10%",
              description:
                (t.verificador as Record<string, string>).method_apsl ??
                "Bónus para ambos com registo oficial",
              standard: "APSL",
            },
            {
              name: "Linhagem",
              weight: "5%",
              description:
                (t.verificador as Record<string, string>).method_linhagem ??
                "Diversidade e qualidade do pedigree",
            },
          ]}
          limitations={[
            (t.verificador as Record<string, string>).limitation_1 ??
              "Não considera doenças genéticas específicas",
            (t.verificador as Record<string, string>).limitation_2 ??
              "COI baseado em pedigree declarado, não em análise DNA",
            (t.verificador as Record<string, string>).limitation_3 ??
              "BLUP estimado, não oficial APSL",
            (t.verificador as Record<string, string>).limitation_4 ??
              "Não substitui consulta veterinária reprodutiva",
          ]}
          version={
            (t.verificador as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"
          }
          references={["Genética quantitativa equina", "Padrões APSL", "Wright (1922) — COI"]}
        />
      </div>

      {/* D3: Tool chain CTA — Comparador + Calculadora */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => {
            try {
              sessionStorage.setItem(
                "tool_chain_horse",
                JSON.stringify({
                  source: "verificador_pair",
                  horses: [
                    {
                      nome: garanhao.nome,
                      sexo: "Garanhão",
                      idade: garanhao.idade,
                      altura: garanhao.altura,
                      pelagem: garanhao.pelagem,
                      linhagem: garanhao.linhagem,
                      linhagemFamosa: garanhao.linhagemFamosa,
                      conformacao: garanhao.conformacao,
                      andamentos: garanhao.andamentos,
                      temperamento:
                        typeof garanhao.temperamento === "string" ? 7 : garanhao.temperamento,
                      saude: garanhao.saude,
                      blup: garanhao.blup,
                      registoAPSL: garanhao.aprovado,
                    },
                    {
                      nome: egua.nome,
                      sexo: "Égua",
                      idade: egua.idade,
                      altura: egua.altura,
                      pelagem: egua.pelagem,
                      linhagem: egua.linhagem,
                      linhagemFamosa: egua.linhagemFamosa,
                      conformacao: egua.conformacao,
                      andamentos: egua.andamentos,
                      temperamento: typeof egua.temperamento === "string" ? 7 : egua.temperamento,
                      saude: egua.saude,
                      blup: egua.blup,
                      registoAPSL: egua.aprovado,
                    },
                  ],
                })
              );
            } catch {}
            window.location.href = "/comparador-cavalos";
          }}
          className="group flex items-center gap-3 p-4 bg-blue-900/15 border border-blue-500/30 rounded-xl hover:border-blue-500/60 transition-all text-left"
        >
          <BarChart3
            size={18}
            className="text-blue-400 shrink-0 group-hover:scale-110 transition-transform"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Abrir ambos no Comparador
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {garanhao.nome || "Garanhão"} × {egua.nome || "Égua"} lado a lado
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--foreground-muted)] ml-auto group-hover:text-blue-400 transition-colors"
          />
        </button>

        <button
          onClick={() => {
            window.location.href = "/calculadora-valor";
          }}
          className="group flex items-center gap-3 p-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl hover:border-[var(--gold)]/60 transition-all text-left"
        >
          <TrendingUp
            size={18}
            className="text-[var(--gold)] shrink-0 group-hover:scale-110 transition-transform"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Estimar Valor do Potro</p>
            <p className="text-xs text-[var(--foreground-muted)]">
              Calculadora de Valor para o descendente
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--foreground-muted)] ml-auto group-hover:text-[var(--gold)] transition-colors"
          />
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]">
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          <strong className="text-[var(--foreground-secondary)]">
            {t.verificador.disclaimer_title}
          </strong>{" "}
          {t.verificador.disclaimer_text}
          <span className="block mt-1 text-[10px] text-[var(--foreground-muted)]/40 font-mono">
            {(t.verificador as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"}
          </span>
        </p>
      </div>
    </div>
  );
}
