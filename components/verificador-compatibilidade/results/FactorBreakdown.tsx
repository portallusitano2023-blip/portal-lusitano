"use client";

import { useMemo } from "react";
import {
  ChevronRight,
  Info,
  Sparkles,
  BarChart3,
  Calendar,
  ShieldAlert,
  ListChecks,
  Circle,
} from "lucide-react";
import BlurredProSection from "@/components/tools/BlurredProSection";
import BreedingCalendar from "@/components/tools/BreedingCalendar";
import OffspringRadar from "@/components/tools/OffspringRadar";
import FoalValueProjection from "@/components/tools/FoalValueProjection";
import MatingScenarios from "@/components/tools/MatingScenarios";
import BreedingCosts from "@/components/tools/BreedingCosts";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Cavalo, ResultadoCompatibilidade } from "../types";
import type { Translations } from "@/context/LanguageContext";
import type { OffspringAxis, FoalValueStage } from "../breeding";

interface FactorBreakdownProps {
  resultado: ResultadoCompatibilidade;
  garanhao: Cavalo;
  egua: Cavalo;
  isSubscribed: boolean;
  offspringAxes: OffspringAxis[];
  foalValues: FoalValueStage[];
  parentQuality: number;
  t: Translations;
}

export default function FactorBreakdown({
  resultado,
  garanhao,
  egua,
  isSubscribed,
  offspringAxes,
  foalValues,
  parentQuality,
  t,
}: FactorBreakdownProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);

  return (
    <>
      {/* Próximos Passos Recomendados */}
      {(() => {
        const s = resultado.score;
        const passos =
          s >= 70
            ? [
                tr("Agende a cobrição para o período primaveril (Mar–Mai)", "Schedule breeding for the spring period (Mar–May)", "Programe la cubrición para el período primaveral (Mar–May)"),
                tr("Realize exame veterinário pré-cobrição", "Perform pre-breeding veterinary examination", "Realice examen veterinario pre-cubrición"),
                tr("Documente o pedigree dos progenitores na APSL", "Document the parents' pedigree with APSL", "Documente el pedigrí de los progenitores en la APSL"),
              ]
            : s >= 50
              ? [
                  tr("Consulte um veterinário especializado em reprodução equina", "Consult a veterinarian specialised in equine reproduction", "Consulte a un veterinario especializado en reproducción equina"),
                  tr("Peça análise genética detalhada (PRO)", "Request detailed genetic analysis (PRO)", "Solicite análisis genético detallado (PRO)"),
                  tr("Considere alternativas com melhor compatibilidade", "Consider alternatives with better compatibility", "Considere alternativas con mejor compatibilidad"),
                ]
              : [
                  tr("Não recomendamos avançar sem consulta veterinária", "We do not recommend proceeding without veterinary consultation", "No recomendamos avanzar sin consulta veterinaria"),
                  tr("Explore outros garanhões com melhor compatibilidade", "Explore other stallions with better compatibility", "Explore otros sementales con mejor compatibilidad"),
                  tr("Consulte o nosso Verificador com outros cavalos", "Use our Checker with other horses", "Consulte nuestro Verificador con otros caballos"),
                ];

        return (
          <div className="bg-[#111111] border border-[var(--border)] rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-4 flex items-center gap-2">
              <ListChecks size={16} className="text-[#C5A059]" />
              {tr("Próximos Passos Recomendados", "Recommended Next Steps", "Próximos Pasos Recomendados")}
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
            .sort((a: any, b: any) => a.score / a.max - b.score / b.max)
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
                {tr(
                  `Perfil do Garanhão Ideal para ${egua.nome || "esta Égua"}`,
                  `Ideal Stallion Profile for ${egua.nome || "this Mare"}`,
                  `Perfil del Semental Ideal para ${egua.nome || "esta Yegua"}`
                )}
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] mb-4">
                {tr(
                  `Com base nos pontos mais fracos desta combinação, um garanhão ideal para ${egua.nome || "esta égua"} teria as seguintes características:`,
                  `Based on the weakest points of this combination, an ideal stallion for ${egua.nome || "this mare"} would have the following characteristics:`,
                  `Con base en los puntos más débiles de esta combinación, un semental ideal para ${egua.nome || "esta yegua"} tendría las siguientes características:`
                )}
              </p>
              <div className="space-y-2 mb-4">
                {weakFactors.map((f: any) => (
                  <div
                    key={f.nome}
                    className="flex items-start gap-2 text-xs text-[var(--foreground-secondary)]"
                  >
                    <ChevronRight size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[var(--foreground)]">{f.nome}:</strong> {tr("score actual", "current score", "puntuación actual")}{" "}
                      {Math.round((f.score / f.max) * 100)}% — {tr(
                        `procurar garanhão com ${f.nome.toLowerCase()} superior (≥ ${Math.ceil(f.max * 0.75)}pts)`,
                        `look for a stallion with higher ${f.nome.toLowerCase()} (≥ ${Math.ceil(f.max * 0.75)}pts)`,
                        `buscar semental con ${f.nome.toLowerCase()} superior (≥ ${Math.ceil(f.max * 0.75)}pts)`
                      )}
                    </span>
                  </div>
                ))}
              </div>
              {resultado.coi > 6 && (
                <div className="text-xs text-[var(--foreground-secondary)] mt-3 p-3 bg-[var(--background-secondary)]/50 rounded-lg">
                  <strong className="text-amber-300">{tr("Diversidade genética:", "Genetic diversity:", "Diversidad genética:")}</strong> {tr("COI elevado", "High COI", "COI elevado")} (
                  {resultado.coi.toFixed(1)}
                  %). {tr("Para", "For", "Para")} {egua.nome || tr("esta égua", "this mare", "esta yegua")} {tr("de linhagem", "of lineage", "de línea")}{" "}
                  <strong>{garanhao.linhagemFamosa}</strong>, {tr("considere garanhões de:", "consider stallions from:", "considere sementales de:")}{" "}
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
            {resultado.factores.map((f: any, i: number) => (
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
              {resultado.recomendacoes.map((rec: string, i: number) => (
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
          (t.verificador as Record<string, string>).scenarios_title ?? tr("Cenários de Acasalamento", "Mating Scenarios", "Escenarios de Apareamiento")
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
          (t.verificador as Record<string, string>).breeding_costs_title ?? tr("Custos de Criação", "Breeding Costs", "Costes de Cría")
        }
      >
        <div className="mb-6">
          <BreedingCosts garanhao={garanhao} egua={egua} />
        </div>
      </BlurredProSection>

      {/* PRO: Indicadores de Compatibilidade */}
      <BlurredProSection isSubscribed={isSubscribed} title={tr("Indicadores de Compatibilidade", "Compatibility Indicators", "Indicadores de Compatibilidad")}>
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-1 flex items-center gap-2">
            <BarChart3 size={16} className="text-[#C5A059]" />
            {tr("Indicadores de Compatibilidade", "Compatibility Indicators", "Indicadores de Compatibilidad")}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-5">
            {tr(
              "Indicadores baseados nos dados disponíveis do cálculo de compatibilidade",
              "Indicators based on available data from the compatibility calculation",
              "Indicadores basados en los datos disponibles del cálculo de compatibilidad"
            )}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {((): { label: string; value: string; detail: string; color: string }[] => {
              const findFactor = (nome: string) =>
                resultado.factores.find((f: any) => f.nome === nome);
              const confFactor = findFactor(tr("Conformação Morfológica", "Morphological Conformation", "Conformación Morfológica"));
              const tempFactor = findFactor(tr("Compatibilidade Temperamento", "Temperament Compatibility", "Compatibilidad de Temperamento"));
              const andFactor = findFactor(tr("Qualidade dos Andamentos", "Gait Quality", "Calidad de los Movimientos"));
              const saudeFactor = findFactor(tr("Estado de Saúde", "Health Status", "Estado de Salud"));
              const linFactor = findFactor(tr("Qualidade Genética", "Genetic Quality", "Calidad Genética"));

              const insufficientData = tr("Dados insuficientes", "Insufficient data", "Datos insuficientes");

              return [
                {
                  label: tr("COI Previsto", "Predicted COI", "COI Previsto"),
                  value: `${resultado.coi.toFixed(1)}%`,
                  detail:
                    resultado.coi <= 3
                      ? tr("Baixa consanguinidade — boa diversidade genética", "Low inbreeding — good genetic diversity", "Baja consanguinidad — buena diversidad genética")
                      : resultado.coi <= 6.25
                        ? tr("Consanguinidade moderada — monitorizar", "Moderate inbreeding — monitor", "Consanguinidad moderada — monitorizar")
                        : tr("Consanguinidade elevada — risco acrescido", "High inbreeding — increased risk", "Consanguinidad elevada — riesgo aumentado"),
                  color: resultado.coi <= 3 ? "#34d399" : resultado.coi <= 6.25 ? "#fbbf24" : "#f87171",
                },
                {
                  label: tr("Compatibilidade de Linhagem", "Lineage Compatibility", "Compatibilidad de Línea"),
                  value: linFactor ? `${linFactor.score}/${linFactor.max}` : insufficientData,
                  detail: linFactor
                    ? linFactor.descricao
                    : insufficientData,
                  color: "#C5A059",
                },
                {
                  label: tr("Compatibilidade Temperamento", "Temperament Compatibility", "Compatibilidad de Temperamento"),
                  value: tempFactor ? `${tempFactor.score}/${tempFactor.max}` : insufficientData,
                  detail: tempFactor
                    ? `${garanhao.temperamento} + ${egua.temperamento}`
                    : insufficientData,
                  color: "#a78bfa",
                },
                {
                  label: tr("Conformação Morfológica", "Morphological Conformation", "Conformación Morfológica"),
                  value: confFactor ? `${confFactor.score}/${confFactor.max}` : insufficientData,
                  detail: confFactor
                    ? confFactor.descricao
                    : insufficientData,
                  color: "#60a5fa",
                },
                {
                  label: tr("Qualidade dos Andamentos", "Gait Quality", "Calidad de los Movimientos"),
                  value: andFactor ? `${andFactor.score}/${andFactor.max}` : insufficientData,
                  detail: andFactor
                    ? andFactor.descricao
                    : insufficientData,
                  color: "#34d399",
                },
                {
                  label: tr("Pelagens Previstas", "Predicted Coats", "Pelajes Previstos"),
                  value:
                    resultado.pelagens.length > 0
                      ? resultado.pelagens
                          .slice(0, 2)
                          .map((p: any) => `${p.cor} ${p.prob}%`)
                          .join(", ")
                      : insufficientData,
                  detail:
                    resultado.pelagens.length > 0
                      ? tr(
                          `${resultado.pelagens.length} pelagem(ns) possível(is) calculada(s)`,
                          `${resultado.pelagens.length} possible coat(s) calculated`,
                          `${resultado.pelagens.length} pelaje(s) posible(s) calculado(s)`
                        )
                      : tr("Dados insuficientes para previsão de pelagem", "Insufficient data for coat prediction", "Datos insuficientes para previsión de pelaje"),
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
                    {cat.value}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-1.5 leading-relaxed">
                  {cat.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)]/50 mt-4 leading-relaxed">
            {tr(
              "Indicadores derivados dos dados introduzidos. Não substituem análise genética laboratorial nem consulta veterinária.",
              "Indicators derived from the entered data. They do not replace laboratory genetic analysis or veterinary consultation.",
              "Indicadores derivados de los datos introducidos. No sustituyen análisis genético de laboratorio ni consulta veterinaria."
            )}
          </p>
        </div>
      </BlurredProSection>

      {/* PRO: Calendário de Cobrição */}
      <BlurredProSection isSubscribed={isSubscribed} title={tr("Calendário de Cobrição Recomendado", "Recommended Breeding Calendar", "Calendario de Cubrición Recomendado")}>
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-1 flex items-center gap-2">
            <Calendar size={16} className="text-[#C5A059]" />
            {tr("Calendário de Cobrição Recomendado", "Recommended Breeding Calendar", "Calendario de Cubrición Recomendado")}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-5">
            {tr("Timing ideal para maximizar resultados", "Ideal timing to maximise results", "Timing ideal para maximizar resultados")}
          </p>

          {/* Month grid */}
          {(() => {
            const months: {
              abbr: string;
              full: string;
              status: "optimal" | "acceptable" | "avoid";
            }[] = [
              { abbr: tr("Jan", "Jan", "Ene"), full: tr("Janeiro", "January", "Enero"), status: "avoid" },
              { abbr: tr("Fev", "Feb", "Feb"), full: tr("Fevereiro", "February", "Febrero"), status: "avoid" },
              { abbr: tr("Mar", "Mar", "Mar"), full: tr("Março", "March", "Marzo"), status: "optimal" },
              { abbr: tr("Abr", "Apr", "Abr"), full: tr("Abril", "April", "Abril"), status: "optimal" },
              { abbr: tr("Mai", "May", "May"), full: tr("Maio", "May", "Mayo"), status: "optimal" },
              { abbr: tr("Jun", "Jun", "Jun"), full: tr("Junho", "June", "Junio"), status: "acceptable" },
              { abbr: tr("Jul", "Jul", "Jul"), full: tr("Julho", "July", "Julio"), status: "acceptable" },
              { abbr: tr("Ago", "Aug", "Ago"), full: tr("Agosto", "August", "Agosto"), status: "acceptable" },
              { abbr: tr("Set", "Sep", "Sep"), full: tr("Setembro", "September", "Septiembre"), status: "avoid" },
              { abbr: tr("Out", "Oct", "Oct"), full: tr("Outubro", "October", "Octubre"), status: "avoid" },
              { abbr: tr("Nov", "Nov", "Nov"), full: tr("Novembro", "November", "Noviembre"), status: "avoid" },
              { abbr: tr("Dez", "Dec", "Dic"), full: tr("Dezembro", "December", "Diciembre"), status: "avoid" },
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
                    <span className="text-emerald-400 font-medium">{tr("Ideal", "Ideal", "Ideal")}</span>
                    <span className="text-[var(--foreground-muted)]">— {tr("Primavera (Mar–Mai)", "Spring (Mar–May)", "Primavera (Mar–May)")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-amber-400 font-medium">{tr("Aceitável", "Acceptable", "Aceptable")}</span>
                    <span className="text-[var(--foreground-muted)]">— {tr("Verão (Jun–Ago)", "Summer (Jun–Aug)", "Verano (Jun–Ago)")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
                    <span className="text-[var(--foreground-muted)] font-medium">{tr("Evitar", "Avoid", "Evitar")}</span>
                    <span className="text-[var(--foreground-muted)]">— {tr("Outono/Inverno", "Autumn/Winter", "Otoño/Invierno")}</span>
                  </div>
                </div>

                {/* Gestation estimate */}
                <div className="bg-[#C5A059]/8 border border-[#C5A059]/25 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-[#C5A059]">{tr("Estimativa de Gestação", "Gestation Estimate", "Estimación de Gestación")}</p>
                  <p className="text-xs text-[var(--foreground-secondary)]">
                    {tr(
                      "Cobrição em",
                      "Breeding in",
                      "Cubrición en"
                    )} <strong className="text-emerald-400">{tr("Março/Abril", "March/April", "Marzo/Abril")}</strong> → {tr(
                      "parto estimado em",
                      "estimated foaling in",
                      "parto estimado en"
                    )} <strong className="text-emerald-400">{tr("Fevereiro/Março", "February/March", "Febrero/Marzo")}</strong> {tr(
                      "do ano seguinte (±340 dias).",
                      "of the following year (±340 days).",
                      "del año siguiente (±340 días)."
                    )}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)] border-t border-[var(--border)]/50 pt-2 mt-2">
                    {tr(
                      "Considere o ciclo éstrico da égua (21 dias) e confirmação ecográfica de gestação. A cobrição na Primavera aproveita o fotoperíodo longo, que estimula naturalmente a ovulação.",
                      "Consider the mare's oestrous cycle (21 days) and ultrasound pregnancy confirmation. Spring breeding takes advantage of the long photoperiod, which naturally stimulates ovulation.",
                      "Considere el ciclo éstrico de la yegua (21 días) y confirmación ecográfica de gestación. La cubrición en primavera aprovecha el fotoperíodo largo, que estimula naturalmente la ovulación."
                    )}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </BlurredProSection>

      {/* PRO: Avaliação de Risco Genético */}
      <BlurredProSection isSubscribed={isSubscribed} title={tr("Avaliação de Risco Genético", "Genetic Risk Assessment", "Evaluación de Riesgo Genético")}>
        <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-1 flex items-center gap-2">
            <ShieldAlert size={16} className="text-[#C5A059]" />
            {tr("Avaliação de Risco Genético", "Genetic Risk Assessment", "Evaluación de Riesgo Genético")}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-5">
            {tr(
              "Factores hereditários e coeficiente de consanguinidade estimado",
              "Hereditary factors and estimated inbreeding coefficient",
              "Factores hereditarios y coeficiente de consanguinidad estimado"
            )}
          </p>

          {(() => {
            const s = resultado.score;
            const riskLevelLabel = s >= 70 ? tr("Baixo", "Low", "Bajo") : s >= 50 ? tr("Médio", "Medium", "Medio") : tr("Elevado", "High", "Elevado");
            const riskLevelKey: "Baixo" | "Médio" | "Elevado" =
              s >= 70 ? "Baixo" : s >= 50 ? "Médio" : "Elevado";
            const riskColor =
              riskLevelKey === "Baixo"
                ? {
                    bg: "bg-emerald-500/15",
                    border: "border-emerald-500/30",
                    text: "text-emerald-400",
                  }
                : riskLevelKey === "Médio"
                  ? { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400" }
                  : { bg: "bg-red-500/15", border: "border-red-500/30", text: "text-red-400" };

            const categories: {
              label: string;
              level: "Baixo" | "Médio" | "Elevado";
              levelLabel: string;
              note: string;
            }[] = [
              {
                label: tr("Doenças Hereditárias", "Hereditary Diseases", "Enfermedades Hereditarias"),
                level: resultado.coi <= 3 ? "Baixo" : resultado.coi <= 6.25 ? "Médio" : "Elevado",
                levelLabel: resultado.coi <= 3 ? tr("Baixo", "Low", "Bajo") : resultado.coi <= 6.25 ? tr("Médio", "Medium", "Medio") : tr("Elevado", "High", "Elevado"),
                note:
                  resultado.coi <= 3
                    ? tr("COI baixo — risco mínimo de expressão de alelos recessivos", "Low COI — minimal risk of recessive allele expression", "COI bajo — riesgo mínimo de expresión de alelos recesivos")
                    : resultado.coi <= 6.25
                      ? tr("COI moderado — aconselha-se painel de doenças hereditárias", "Moderate COI — hereditary disease panel recommended", "COI moderado — se aconseja panel de enfermedades hereditarias")
                      : tr("COI elevado — risco aumentado de homozigotia em loci patogénicos", "High COI — increased risk of homozygosity at pathogenic loci", "COI elevado — riesgo aumentado de homocigosis en loci patogénicos"),
              },
              {
                label: tr("Conformação Estrutural", "Structural Conformation", "Conformación Estructural"),
                level: s >= 70 ? "Baixo" : s >= 55 ? "Médio" : "Elevado",
                levelLabel: s >= 70 ? tr("Baixo", "Low", "Bajo") : s >= 55 ? tr("Médio", "Medium", "Medio") : tr("Elevado", "High", "Elevado"),
                note:
                  s >= 70
                    ? tr("Complementaridade morfológica adequada entre os progenitores", "Adequate morphological complementarity between parents", "Complementariedad morfológica adecuada entre los progenitores")
                    : s >= 55
                      ? tr("Algumas divergências estruturais — avaliação presencial recomendada", "Some structural divergences — in-person assessment recommended", "Algunas divergencias estructurales — evaluación presencial recomendada")
                      : tr("Divergências relevantes — consultar veterinário especializado em reprodução", "Relevant divergences — consult veterinarian specialised in reproduction", "Divergencias relevantes — consultar veterinario especializado en reproducción"),
              },
              {
                label: tr("Compatibilidade Reprodutiva", "Reproductive Compatibility", "Compatibilidad Reproductiva"),
                level: resultado.blup >= 100 ? "Baixo" : resultado.blup >= 70 ? "Médio" : "Elevado",
                levelLabel: resultado.blup >= 100 ? tr("Baixo", "Low", "Bajo") : resultado.blup >= 70 ? tr("Médio", "Medium", "Medio") : tr("Elevado", "High", "Elevado"),
                note:
                  resultado.blup >= 100
                    ? tr("BLUP parental positivo — boa herança de aptidão reprodutiva", "Positive parental BLUP — good reproductive aptitude inheritance", "BLUP parental positivo — buena herencia de aptitud reproductiva")
                    : resultado.blup >= 70
                      ? tr("BLUP dentro da média — resultados reprodutivos esperados normais", "BLUP within average — normal expected reproductive results", "BLUP dentro de la media — resultados reproductivos esperados normales")
                      : tr("BLUP abaixo da média — historial reprodutivo merece atenção", "BLUP below average — reproductive history deserves attention", "BLUP por debajo de la media — historial reproductivo merece atención"),
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
                    <p className="text-xs text-[var(--foreground-muted)]">{tr("Nível de Risco Global", "Overall Risk Level", "Nivel de Riesgo Global")}</p>
                    <p className={`text-lg font-bold ${riskColor.text}`}>{riskLevelLabel}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-[var(--foreground-muted)]">{tr("COI estimado", "Estimated COI", "COI estimado")}</p>
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
                        {cat.levelLabel}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2.5 p-3 bg-[var(--background-card)]/40 rounded-lg border border-[var(--border)]/40">
                  <Info size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
                    <strong className="text-[var(--foreground-secondary)]">{tr("Aviso:", "Notice:", "Aviso:")}</strong> {tr(
                      "Avaliação baseada em dados genealógicos conhecidos. Consulte sempre um médico veterinário especializado em reprodução equina antes de tomar decisões de cobrição.",
                      "Assessment based on known genealogical data. Always consult a veterinarian specialised in equine reproduction before making breeding decisions.",
                      "Evaluación basada en datos genealógicos conocidos. Consulte siempre a un veterinario especializado en reproducción equina antes de tomar decisiones de cubrición."
                    )}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </BlurredProSection>
    </>
  );
}
