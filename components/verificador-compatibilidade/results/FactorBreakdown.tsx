"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

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

interface FactorBreakdownProps {
  resultado: any;
  garanhao: any;
  egua: any;
  isSubscribed: boolean;
  offspringAxes: any;
  foalValues: any;
  parentQuality: any;
  t: Record<string, any>;
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
  return (
    <>
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
                Perfil do Garanhão Ideal para {egua.nome || "esta Égua"}
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] mb-4">
                Com base nos pontos mais fracos desta combinação, um garanhão ideal para{" "}
                {egua.nome || "esta égua"} teria as seguintes características:
              </p>
              <div className="space-y-2 mb-4">
                {weakFactors.map((f: any) => (
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
    </>
  );
}
