"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BarChart3, Sparkles, ChevronRight, Scale, Lightbulb } from "lucide-react";
import dynamic from "next/dynamic";
import BlurredProSection from "@/components/tools/BlurredProSection";
import ValueWaterfall from "@/components/tools/ValueWaterfall";
import InvestmentSafety from "@/components/tools/InvestmentSafety";
import DisciplineComparison from "@/components/tools/DisciplineComparison";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { MERCADOS, VALORES_BASE, MULT_LINHAGEM, MULT_SAUDE, MULT_COMP } from "../data";
import { calcularProjecaoValor, calcularTrainingROI } from "../projections";
import type { FormData, Resultado } from "../types";

const MarketPositionChart = dynamic(() => import("@/components/tools/MarketPositionChart"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900/50 animate-pulse rounded-xl" />,
});
const RegionalMarketMap = dynamic(() => import("@/components/tools/RegionalMarketMap"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900/50 animate-pulse rounded-xl" />,
});
const InvestmentTimeline = dynamic(() => import("@/components/tools/InvestmentTimeline"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900/50 animate-pulse rounded-xl" />,
});
const TrainingROI = dynamic(() => import("@/components/tools/TrainingROI"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900/50 animate-pulse rounded-xl" />,
});

interface BreakdownAnalysisProps {
  form: FormData;
  resultado: Resultado;
  isSubscribed: boolean;
  t: Record<string, any>;
}

export default function BreakdownAnalysis({
  form,
  resultado,
  isSubscribed,
  t,
}: BreakdownAnalysisProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  // PRO projections
  const investmentProjections = calcularProjecaoValor(resultado.valorFinal, form.idade);
  const trainingROILevels = calcularTrainingROI(
    form,
    resultado.valorFinal,
    resultado.multiplicador
  );

  return (
    <>
      {/* Comparacao de Mercado - Visual Chart */}
      <div className="bg-[var(--background-secondary)]/50 rounded-xl p-4 sm:p-6 border border-[var(--border)] overflow-x-auto">
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
          tr(
            "Análise de Segurança do Investimento",
            "Investment Safety Analysis",
            "Análisis de Seguridad de la Inversión"
          )
        }
      >
        <InvestmentSafety form={form} resultado={resultado} />
      </BlurredProSection>

      {/* PRO: Discipline Comparison */}
      <BlurredProSection
        isSubscribed={isSubscribed}
        title={
          (t.calculadora as Record<string, string>).discipline_title ??
          tr("Comparação por Disciplina", "Discipline Comparison", "Comparación por Disciplina")
        }
      >
        <DisciplineComparison form={form} valorBase={resultado.valorFinal} />
      </BlurredProSection>

      {/* PRO: Metodologia de Valorização */}
      <BlurredProSection
        isSubscribed={isSubscribed}
        title={tr(
          "Metodologia de Valorização",
          "Valuation Methodology",
          "Metodología de Valorización"
        )}
      >
        {(() => {
          const _base = VALORES_BASE[form.treino] ?? resultado.valorFinal;
          const _morfMedia =
            (form.morfologia + form.garupa + form.espádua + form.cabeca + form.membros) / 5;
          const _andMedia =
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
              nome: tr("Genealogia e Sangue", "Genealogy & Bloodline", "Genealogía y Sangre"),
              peso: 30,
              score: linhagemNorm,
              label: tr(
                "Linhagem e pedigree certificado",
                "Certified lineage and pedigree",
                "Linaje y pedigrí certificado"
              ),
            },
            {
              nome: tr("Formação e Disciplina", "Training & Discipline", "Formación y Disciplina"),
              peso: 25,
              score: treinoScore,
              label: tr(
                "Nível de treino e disciplina",
                "Training level and discipline",
                "Nivel de entrenamiento y disciplina"
              ),
            },
            {
              nome: tr("Resultados Desportivos", "Competition Results", "Resultados Deportivos"),
              peso: 20,
              score: Math.min(10, compScore),
              label: tr(
                "Historial em competição",
                "Competition history",
                "Historial en competición"
              ),
            },
            {
              nome: tr("Saúde e Condição", "Health & Condition", "Salud y Condición"),
              peso: 15,
              score: Math.min(10, saudeNorm),
              label: tr(
                "Estado clínico e documentação",
                "Clinical status and documentation",
                "Estado clínico y documentación"
              ),
            },
            {
              nome: tr(
                "Mercado e Procura Actual",
                "Market & Current Demand",
                "Mercado y Demanda Actual"
              ),
              peso: 10,
              score: form.tendencia === "alta" ? 9 : form.tendencia === "estavel" ? 7 : 4,
              label: tr(
                "Dinâmica do mercado-alvo",
                "Target market dynamics",
                "Dinámica del mercado objetivo"
              ),
            },
          ];

          const totalPontos = fatores.reduce((s, f) => s + f.score * f.peso, 0);

          return (
            <div className="bg-[var(--background-secondary)]/50 rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
                <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider flex items-center gap-2">
                  <Scale size={16} className="text-[var(--gold)]" />
                  {tr(
                    "Metodologia de Valorização",
                    "Valuation Methodology",
                    "Metodología de Valorización"
                  )}
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  {tr(
                    "Como calculámos o valor estimado do seu cavalo",
                    "How we calculated your horse's estimated value",
                    "Cómo calculamos el valor estimado de su caballo"
                  )}
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
                    {tr("Valor total calculado", "Total calculated value", "Valor total calculado")}
                  </span>
                  <span className="text-base font-semibold text-[var(--gold)]">
                    {resultado.valorFinal.toLocaleString("pt-PT")} €
                  </span>
                </div>
                <p className="text-[10px] text-[var(--foreground-muted)]/60 mt-1 leading-relaxed">
                  {tr(
                    "Estimativa baseada em pesos sectoriais do mercado equestre lusitano. Não substitui avaliação presencial.",
                    "Estimate based on sector weights of the Lusitano equestrian market. Does not replace in-person evaluation.",
                    "Estimación basada en pesos sectoriales del mercado ecuestre lusitano. No sustituye la evaluación presencial."
                  )}
                </p>
              </div>
            </div>
          );
        })()}
      </BlurredProSection>

      {/* PRO: Como Aumentar o Valor */}
      <BlurredProSection
        isSubscribed={isSubscribed}
        title={tr(
          "Como Aumentar o Valor do Seu Cavalo",
          "How to Increase Your Horse's Value",
          "Cómo Aumentar el Valor de Su Caballo"
        )}
      >
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
              titulo: tr("Formação Profissional", "Professional Training", "Formación Profesional"),
              ganhoMin: 500,
              ganhoMax: 2000,
              descricao: tr(
                "Certificação por treinador FEI pode aumentar o valor de mercado significativamente ao validar o nível técnico do cavalo.",
                "FEI trainer certification can significantly increase market value by validating the horse's technical level.",
                "La certificación por entrenador FEI puede aumentar significativamente el valor de mercado al validar el nivel técnico del caballo."
              ),
              cor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
              mostrar: treinoIdx < 4,
            },
            {
              titulo: tr(
                "Participação em Provas",
                "Competition Participation",
                "Participación en Pruebas"
              ),
              ganhoMin: 1000,
              ganhoMax: 3000,
              descricao: tr(
                "Resultados em provas regionais e nacionais valorizam o perfil do cavalo e aumentam a confiança dos compradores.",
                "Results in regional and national competitions enhance the horse's profile and increase buyer confidence.",
                "Resultados en pruebas regionales y nacionales valorizan el perfil del caballo y aumentan la confianza de los compradores."
              ),
              cor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
              mostrar: form.competicoes === "nenhuma" && treinoIdx >= 2,
            },
            {
              titulo: tr(
                "Documentação Genética",
                "Genetic Documentation",
                "Documentación Genética"
              ),
              ganhoMin: 300,
              ganhoMax: 800,
              descricao: tr(
                "Resultados de testes genéticos e rastreios de saúde aumentam a confiança do comprador e reduzem o tempo de negociação.",
                "Genetic test results and health screenings increase buyer confidence and reduce negotiation time.",
                "Resultados de pruebas genéticas y exámenes de salud aumentan la confianza del comprador y reducen el tiempo de negociación."
              ),
              cor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
              mostrar: !form.raioX || !form.exameVeterinario,
            },
            {
              titulo: tr(
                "Fotografia Profissional",
                "Professional Photography",
                "Fotografía Profesional"
              ),
              ganhoMin: 200,
              ganhoMax: 500,
              descricao: tr(
                "Fotos e vídeo profissional reduzem o tempo de venda em 40% e permitem atingir compradores internacionais.",
                "Professional photos and video reduce sale time by 40% and reach international buyers.",
                "Fotos y vídeo profesional reducen el tiempo de venta en un 40% y permiten alcanzar compradores internacionales."
              ),
              cor: "bg-amber-500/10 border-amber-500/20 text-amber-400",
              mostrar: true,
            },
            {
              titulo: tr(
                "Exposição Internacional",
                "International Exposure",
                "Exposición Internacional"
              ),
              ganhoMin: 2000,
              ganhoMax: 5000,
              descricao: tr(
                "Participação em Lusitano World Championship ou similares aumenta a visibilidade e eleva significativamente o teto de valor.",
                "Participation in Lusitano World Championship or similar events increases visibility and significantly raises the value ceiling.",
                "Participación en el Campeonato Mundial Lusitano o similares aumenta la visibilidad y eleva significativamente el techo de valor."
              ),
              cor: "bg-rose-500/10 border-rose-500/20 text-rose-400",
              mostrar: form.competicoes === "regional" || form.competicoes === "nacional",
            },
            {
              titulo: tr(
                "Trabalho de Ginástica Funcional",
                "Functional Gymnastic Work",
                "Trabajo de Gimnasia Funcional"
              ),
              ganhoMin: 300,
              ganhoMax: 1200,
              descricao: tr(
                "Melhoria da conformação funcional e postura pode valorizar a apresentação e aumentar a nota em avaliações morfológicas.",
                "Improving functional conformation and posture can enhance presentation and increase morphological evaluation scores.",
                "La mejora de la conformación funcional y postura puede valorizar la presentación y aumentar la nota en evaluaciones morfológicas."
              ),
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
                  {tr(
                    "Como Aumentar o Valor do Seu Cavalo",
                    "How to Increase Your Horse's Value",
                    "Cómo Aumentar el Valor de Su Caballo"
                  )}
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  {tr(
                    "Recomendações personalizadas baseadas na sua análise",
                    "Personalised recommendations based on your analysis",
                    "Recomendaciones personalizadas basadas en su análisis"
                  )}
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
                  {tr(
                    "Estimativas de valorização baseadas em médias do sector equestre. Os resultados podem variar conforme o perfil do comprador e o contexto de mercado.",
                    "Value estimates based on equestrian sector averages. Results may vary depending on buyer profile and market context.",
                    "Estimaciones de valorización basadas en promedios del sector ecuestre. Los resultados pueden variar según el perfil del comprador y el contexto del mercado."
                  )}
                </p>
              </div>
            </div>
          );
        })()}
      </BlurredProSection>
    </>
  );
}
