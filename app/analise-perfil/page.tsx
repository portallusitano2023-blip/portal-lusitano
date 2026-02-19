"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  RotateCcw,
  Sparkles,
  Target,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Scale,
  Dna,
} from "lucide-react";
import Confetti from "@/components/tools/Confetti";
import BlurredProSection from "@/components/tools/BlurredProSection";
import { useLanguage } from "@/context/LanguageContext";
import { useQuizLogic } from "@/components/analise-perfil/useQuizLogic";

// Critical path: load immediately — these are visible before any tab is selected
import IntroSection from "@/components/analise-perfil/IntroSection";
import QuizSection from "@/components/analise-perfil/QuizSection";
import ResultHeader from "@/components/analise-perfil/ResultHeader";
import ScoreDistribution from "@/components/analise-perfil/ScoreDistribution";
import ResultTabs from "@/components/analise-perfil/ResultTabs";

// Tab fallback — shared lightweight placeholder while tab content loads
const TabFallback = () => (
  <div className="py-12 flex items-center justify-center">
    <div className="w-5 h-5 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
  </div>
);

// Result tabs — lazy loaded because only one is visible at a time
// ProfileTab is the default tab, so load it slightly earlier than the rest
const ProfileTab = dynamic(() => import("@/components/analise-perfil/tabs/ProfileTab"), {
  ssr: false,
  loading: TabFallback,
});
const HorseTab = dynamic(() => import("@/components/analise-perfil/tabs/HorseTab"), {
  ssr: false,
  loading: TabFallback,
});
const CostsTab = dynamic(() => import("@/components/analise-perfil/tabs/CostsTab"), {
  ssr: false,
  loading: TabFallback,
});
const TimelineTab = dynamic(() => import("@/components/analise-perfil/tabs/TimelineTab"), {
  ssr: false,
  loading: TabFallback,
});
const AnalysisTab = dynamic(() => import("@/components/analise-perfil/tabs/AnalysisTab"), {
  ssr: false,
  loading: TabFallback,
});
const NextStepsTab = dynamic(() => import("@/components/analise-perfil/tabs/NextStepsTab"), {
  ssr: false,
  loading: TabFallback,
});
const ShoppingChecklistTab = dynamic(
  () => import("@/components/analise-perfil/tabs/ShoppingChecklistTab"),
  { ssr: false, loading: TabFallback }
);
const BudgetPlannerTab = dynamic(
  () => import("@/components/analise-perfil/tabs/BudgetPlannerTab"),
  {
    ssr: false,
    loading: TabFallback,
  }
);
const PriorityMapTab = dynamic(() => import("@/components/analise-perfil/tabs/PriorityMapTab"), {
  ssr: false,
  loading: TabFallback,
});
const AffinityTab = dynamic(() => import("@/components/analise-perfil/tabs/AffinityTab"), {
  ssr: false,
  loading: TabFallback,
});
const FirstYearSimTab = dynamic(() => import("@/components/analise-perfil/tabs/FirstYearSimTab"), {
  ssr: false,
  loading: TabFallback,
});
const ReadinessTab = dynamic(() => import("@/components/analise-perfil/tabs/ReadinessTab"), {
  ssr: false,
  loading: TabFallback,
});
const MethodologyPanel = dynamic(() => import("@/components/tools/MethodologyPanel"), {
  ssr: false,
  loading: TabFallback,
});

function AnalisePerfilContent() {
  const { t } = useLanguage();
  const {
    showIntro,
    showResult,
    startQuiz,
    resetQuiz,
    quizRef,
    questions,
    currentQuestion,
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    accessLoading,
    handleAnswer,
    goBack,
    result,
    scorePercentages,
    saved,
    copied,
    error,
    setError,
    badgeRef,
    saveResult,
    downloadPDF,
    downloadBadge,
    shareWhatsApp,
    shareFacebook,
    shareInstagram,
    copyShareLink,
    radarData,
    selectedTab,
    setSelectedTab,
    answerDetails,
    calculateConfidence,
    subProfile,
    dominantProfile,
    dominantProfileLabel,
    crossValidationWarning,
    dismissCrossWarning,
  } = useQuizLogic();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-900/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3 max-w-sm">
          <span className="text-red-400">&#9888;</span>
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-200"
          >
            &#10005;
          </button>
        </div>
      )}

      {showIntro ? (
        <IntroSection onStart={startQuiz} />
      ) : !showResult ? (
        <>
          {/* PRO Status Bar — quiz in progress */}
          {!accessLoading && isSubscribed && (
            <div className="max-w-2xl mx-auto px-4 pt-6">
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-sm">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#C5A059] shrink-0"
                  aria-hidden="true"
                >
                  <path d="M2 19l2-8 5 4 3-9 3 9 5-4 2 8H2z" />
                </svg>
                <span className="text-[#C5A059] font-semibold">PRO Activo</span>
                <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                <span className="text-[#C5A059]/80 hidden sm:inline">Utilizações ilimitadas</span>
                <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                <span className="text-[#C5A059]/80 hidden sm:inline">
                  Análise de Perfil desbloqueada
                </span>
                <a
                  href="/ferramentas/historico"
                  className="ml-auto text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap text-xs sm:text-sm"
                >
                  Ver histórico →
                </a>
              </div>
            </div>
          )}
          {/* Free uses counter — quiz in progress */}
          {!accessLoading && !isSubscribed && freeUsesLeft > 0 && (
            <div className="max-w-2xl mx-auto px-4 pt-6">
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-sm">
                <span className="text-amber-400/90 flex-1 min-w-0">
                  {freeUsesLeft} uso{freeUsesLeft !== 1 ? "s" : ""} gratuito
                  {freeUsesLeft !== 1 ? "s" : ""} disponível{freeUsesLeft !== 1 ? "is" : ""} —
                  Subscreva PRO para utilizações ilimitadas
                </span>
                <a
                  href="/ferramentas"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium whitespace-nowrap"
                >
                  Subscrever
                </a>
              </div>
            </div>
          )}
          <QuizSection
            ref={quizRef}
            questions={questions}
            currentQuestion={currentQuestion}
            canUse={canUse}
            isSubscribed={isSubscribed}
            freeUsesLeft={freeUsesLeft}
            requiresAuth={requiresAuth}
            accessLoading={accessLoading}
            onAnswer={handleAnswer}
            onBack={goBack}
            onReset={resetQuiz}
            dominantProfile={dominantProfile}
            dominantProfileLabel={dominantProfileLabel}
            crossValidationWarning={crossValidationWarning}
            onDismissCrossWarning={dismissCrossWarning}
          />
        </>
      ) : (
        <div key="result" className="min-h-screen animate-[fadeSlideIn_0.4s_ease-out_forwards]">
          {result && (
            <>
              {/* Confetti celebration */}
              <div className="relative">
                <Confetti trigger={true} particleCount={50} duration={2800} />
              </div>

              {/* PRO Status Bar — results */}
              {isSubscribed && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                  <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-sm">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-[#C5A059] shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M2 19l2-8 5 4 3-9 3 9 5-4 2 8H2z" />
                    </svg>
                    <span className="text-[#C5A059] font-semibold">PRO Activo</span>
                    <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                    <span className="text-[#C5A059]/80 hidden sm:inline">
                      Utilizações ilimitadas
                    </span>
                    <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                    <span className="text-[#C5A059]/80 hidden sm:inline">
                      Análise de Perfil desbloqueada
                    </span>
                    <a
                      href="/ferramentas/historico"
                      className="ml-auto text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap text-xs sm:text-sm"
                    >
                      Ver histórico →
                    </a>
                  </div>
                </div>
              )}
              {/* Free uses counter — results */}
              {!isSubscribed && freeUsesLeft > 0 && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                  <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-sm">
                    <span className="text-amber-400/90 flex-1 min-w-0">
                      {freeUsesLeft} uso{freeUsesLeft !== 1 ? "s" : ""} gratuito
                      {freeUsesLeft !== 1 ? "s" : ""} disponível{freeUsesLeft !== 1 ? "is" : ""} —
                      Subscreva PRO para utilizações ilimitadas
                    </span>
                    <a
                      href="/ferramentas"
                      className="text-amber-400 hover:text-amber-300 transition-colors font-medium whitespace-nowrap"
                    >
                      Subscrever
                    </a>
                  </div>
                </div>
              )}

              <ResultHeader
                result={result}
                scorePercentages={scorePercentages}
                saved={saved}
                copied={copied}
                badgeRef={badgeRef}
                subProfile={subProfile}
                confidence={calculateConfidence()}
                onSave={saveResult}
                onDownloadPDF={downloadPDF}
                onDownloadBadge={downloadBadge}
                onShareWhatsApp={shareWhatsApp}
                onShareFacebook={shareFacebook}
                onShareInstagram={shareInstagram}
                onCopyLink={copyShareLink}
              />
              <ScoreDistribution radarData={radarData} scorePercentages={scorePercentages} />

              {/* Top 3 Insights */}
              {(() => {
                const profileActions: Record<string, string> = {
                  competidor: "Foque em formação profissional com treinador certificado",
                  criador: "Explore linhas genéticas de alta qualidade",
                  amador: "Priorize um cavalo de temperamento calmo e versátil",
                  aprendiz: "Comece com aulas de equitação antes da compra",
                  tradicional: "Lusitano de trabalho com boa formação clássica",
                };
                const dominantPct = scorePercentages[0]?.percentage ?? 0;
                const profileName = result.title;
                const nextAction =
                  profileActions[result.profile] ??
                  "Consulte os detalhes do seu perfil para orientação personalizada";

                const insights = [
                  {
                    icon: <Target size={18} className="text-[#C5A059]" aria-hidden="true" />,
                    title: "Perfil dominante",
                    description: `O seu perfil principal é ${profileName} com ${dominantPct}% de afinidade`,
                  },
                  {
                    icon: <ArrowRight size={18} className="text-emerald-400" aria-hidden="true" />,
                    title: "Próxima acção",
                    description: nextAction,
                  },
                  {
                    icon: <CheckCircle2 size={18} className="text-sky-400" aria-hidden="true" />,
                    title: "Nível de preparação",
                    description: "Consulte os detalhes PRO para o seu plano completo de preparação",
                  },
                ];

                return (
                  <section className="py-8 border-b border-[var(--border)]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                      <h2 className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--foreground-muted)] mb-5">
                        <Sparkles size={14} className="text-[#C5A059]" aria-hidden="true" />
                        As suas 3 principais conclusões
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {insights.map((insight, idx) => (
                          <div
                            key={idx}
                            className="relative bg-[var(--background-secondary)]/40 border border-[#C5A059]/15 rounded-2xl p-5 flex flex-col gap-3 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards] hover:border-[#C5A059]/30 transition-colors"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                          >
                            {/* Number badge */}
                            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--background-card)] border border-[var(--border)] text-[10px] font-bold text-[var(--foreground-muted)] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-[var(--background)]/60 border border-[var(--border)] flex items-center justify-center shrink-0">
                              {insight.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[var(--foreground-secondary)] mb-1">
                                {insight.title}
                              </p>
                              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                                {insight.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })()}

              <ResultTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
              <section className="py-8 sm:py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                  {selectedTab === "perfil" && (
                    <>
                      <ProfileTab result={result} />
                      {/* Perfil Secundário Expandido */}
                      {Array.isArray(scorePercentages) &&
                        scorePercentages.length > 1 &&
                        scorePercentages[1].percentage >= 25 && (
                          <div className="bg-[var(--background-secondary)]/30 rounded-xl p-5 border border-[var(--border)]/60 mt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-[var(--foreground-muted)]" />
                              <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
                                Traços do Perfil Secundário — {scorePercentages[1].label}
                              </h3>
                              <span className="ml-auto text-xs text-[var(--foreground-muted)] bg-[var(--background-card)] px-2 py-0.5 rounded-full">
                                {scorePercentages[1].percentage}% afinidade
                              </span>
                            </div>
                            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-3">
                              Com {scorePercentages[1].percentage}% de afinidade, o seu perfil
                              combina características de{" "}
                              <strong className="text-[var(--foreground-secondary)]">
                                {scorePercentages[0]?.label ?? ""}
                              </strong>{" "}
                              e{" "}
                              <strong className="text-[var(--foreground-secondary)]">
                                {scorePercentages[1].label}
                              </strong>
                              . Isto significa que pode beneficiar de abordagens de ambos os perfis.
                            </p>
                            {/* Dicas específicas para o perfil híbrido */}
                            {(() => {
                              const primary = scorePercentages[0]?.profile ?? "";
                              const secondary = scorePercentages[1].profile;
                              const combo = `${primary}_${secondary}`;
                              const HYBRID_TIPS: Record<string, string[]> = {
                                competidor_criador: [
                                  "Considere garanhões com dupla aptidão — competição e reprodução",
                                  "Procure cavalos com BLUP alto que também tenham palmarés desportivo",
                                  "Uma égua de qualidade pode ser tanto atleta como reprodutora",
                                ],
                                competidor_amador: [
                                  "Comece em provas locais para desenvolver experiência a custo controlado",
                                  "Um cavalo com temperamento dócil facilita a progressão competitiva",
                                  "Invista em treino regular com um técnico mesmo que não seja dedicado",
                                ],
                                criador_amador: [
                                  "Escolha cavalos com linhagem documentada mas temperamento suave",
                                  "O prazer de criar pode coexistir com custos controlados",
                                  "Participe em exposições APSL para ganhar experiência no sector",
                                ],
                                competidor_investidor: [
                                  "Foque em cavalos jovens com alto BLUP — melhor ROI a 3-5 anos",
                                  "Competições CDI aumentam significativamente o valor de mercado",
                                  "Documente todo o percurso desportivo para facilitar a venda futura",
                                ],
                              };
                              const tips = HYBRID_TIPS[combo] ??
                                HYBRID_TIPS[`${secondary}_${primary}`] ?? [
                                  "Combine as melhores práticas de ambos os perfis",
                                  "A sua versatilidade é um ponto forte no mundo equestre",
                                ];
                              return (
                                <ul className="space-y-2">
                                  {tips.map((tip, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-xs text-[var(--foreground-secondary)]"
                                    >
                                      <ChevronRight
                                        size={12}
                                        className="text-[var(--foreground-muted)] mt-0.5 shrink-0"
                                      />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              );
                            })()}
                          </div>
                        )}
                    </>
                  )}
                  {selectedTab === "cavalo" && <HorseTab result={result} />}
                  {selectedTab === "afinidade" && (
                    <AffinityTab
                      result={result}
                      scorePercentages={Object.fromEntries(
                        scorePercentages.map((sp) => [sp.profile, sp.percentage])
                      )}
                    />
                  )}
                  {selectedTab === "custos" && (
                    <BlurredProSection
                      isSubscribed={isSubscribed}
                      title={t.analise_perfil.tab_costs}
                    >
                      <CostsTab result={result} />
                    </BlurredProSection>
                  )}
                  {selectedTab === "cronograma" && <TimelineTab result={result} />}
                  {selectedTab === "analise" && (
                    <BlurredProSection
                      isSubscribed={isSubscribed}
                      title={t.analise_perfil.tab_analysis}
                    >
                      <AnalysisTab
                        result={result}
                        answerDetails={answerDetails}
                        scorePercentages={scorePercentages}
                        confidence={calculateConfidence()}
                      />
                    </BlurredProSection>
                  )}
                  {selectedTab === "proximos" && (
                    <NextStepsTab result={result} subProfile={subProfile} />
                  )}
                  {selectedTab === "prioridades" && (
                    <PriorityMapTab
                      result={result}
                      scorePercentages={Object.fromEntries(
                        scorePercentages.map((sp) => [sp.profile, sp.percentage])
                      )}
                    />
                  )}
                  {selectedTab === "checklist" && (
                    <BlurredProSection
                      isSubscribed={isSubscribed}
                      title={t.analise_perfil.tab_checklist}
                    >
                      <ShoppingChecklistTab
                        phases={[
                          {
                            title: t.analise_perfil.checklist_before,
                            icon: "search",
                            items: [
                              {
                                id: "budget",
                                label: "Definir orçamento total",
                                description:
                                  "Inclui compra, transporte, primeiros meses de estábulo",
                                priority: "essential" as const,
                              },
                              {
                                id: "stable",
                                label: "Garantir lugar em estábulo",
                                description: "Confirmar vaga, condições e custos mensais",
                                priority: "essential" as const,
                              },
                              {
                                id: "insurance",
                                label: "Pesquisar seguros equinos",
                                description:
                                  "Comparar apólices de saúde, vida e responsabilidade civil",
                                priority: "important" as const,
                              },
                              {
                                id: "trainer",
                                label: "Contactar treinador",
                                description:
                                  "Identificar profissional para acompanhamento pós-compra",
                                priority: "important" as const,
                              },
                              {
                                id: "transport",
                                label: "Organizar transporte",
                                description: "Reservar transporte especializado para equinos",
                                priority: "optional" as const,
                              },
                            ],
                          },
                          {
                            title: t.analise_perfil.checklist_visit,
                            icon: "eye",
                            items: [
                              {
                                id: "vet-exam",
                                label: "Exame veterinário completo",
                                description:
                                  "Incluir radiografias, análises sanguíneas e exame de fertilidade se aplicável",
                                priority: "essential" as const,
                              },
                              {
                                id: "conformation",
                                label: "Avaliar conformação",
                                description: "Verificar aprumos, dorso, garupa, pescoço e cabeça",
                                priority: "essential" as const,
                              },
                              {
                                id: "test-ride",
                                label: "Ensaio montado",
                                description: "Testar nos 3 andamentos, transições e temperamento",
                                priority: "essential" as const,
                              },
                              {
                                id: "papers",
                                label: "Verificar documentação",
                                description: "Registo APSL, passaporte equino, vacinações em dia",
                                priority: "important" as const,
                              },
                              {
                                id: "history",
                                label: "Histórico de saúde",
                                description: "Pedir relatórios veterinários anteriores",
                                priority: "important" as const,
                              },
                            ],
                          },
                          {
                            title: t.analise_perfil.checklist_first30,
                            icon: "calendar",
                            items: [
                              {
                                id: "adaptation",
                                label: "Período de adaptação",
                                description:
                                  "Dar 7-14 dias para o cavalo se habituar ao novo ambiente",
                                priority: "essential" as const,
                              },
                              {
                                id: "vet-visit",
                                label: "Visita veterinária inicial",
                                description: "Check-up completo no novo local",
                                priority: "essential" as const,
                              },
                              {
                                id: "training-plan",
                                label: "Plano de treino",
                                description: "Definir objectivos e rotina com o treinador",
                                priority: "important" as const,
                              },
                              {
                                id: "farrier",
                                label: "Visita do ferrador",
                                description: "Avaliar cascos e ferrar se necessário",
                                priority: "important" as const,
                              },
                              {
                                id: "socialisation",
                                label: "Socialização",
                                description: "Introduzir gradualmente a outros cavalos do estábulo",
                                priority: "optional" as const,
                              },
                            ],
                          },
                        ]}
                      />
                    </BlurredProSection>
                  )}
                  {selectedTab === "budget" && (
                    <BlurredProSection
                      isSubscribed={isSubscribed}
                      title={t.analise_perfil.tab_budget}
                    >
                      <BudgetPlannerTab
                        profileName={result.profile}
                        categories={[
                          {
                            label: "Pensão",
                            monthly:
                              result.profile === "competidor"
                                ? 500
                                : result.profile === "criador"
                                  ? 450
                                  : 350,
                            color: "#C5A059",
                            icon: "Home",
                          },
                          {
                            label: "Alimentação",
                            monthly: result.profile === "competidor" ? 180 : 140,
                            color: "#60A5FA",
                            icon: "Apple",
                          },
                          {
                            label: "Veterinário",
                            monthly:
                              result.profile === "competidor"
                                ? 120
                                : result.profile === "criador"
                                  ? 100
                                  : 70,
                            color: "#F472B6",
                            icon: "Stethoscope",
                          },
                          {
                            label: "Ferrador",
                            monthly: result.profile === "competidor" ? 75 : 55,
                            color: "#A78BFA",
                            icon: "Hammer",
                          },
                          {
                            label: "Treino",
                            monthly:
                              result.profile === "competidor"
                                ? 800
                                : result.profile === "tradicional"
                                  ? 400
                                  : 250,
                            color: "#34D399",
                            icon: "GraduationCap",
                          },
                          {
                            label: "Seguro",
                            monthly: result.profile === "competidor" ? 150 : 80,
                            color: "#FBBF24",
                            icon: "Shield",
                          },
                          {
                            label: "Competições",
                            monthly: result.profile === "competidor" ? 200 : 0,
                            color: "#FB923C",
                            icon: "Trophy",
                          },
                          {
                            label: "Equipamento",
                            monthly: result.profile === "competidor" ? 100 : 50,
                            color: "#94A3B8",
                            icon: "Wrench",
                          },
                        ]}
                      />
                    </BlurredProSection>
                  )}
                  {selectedTab === "simulador" && (
                    <BlurredProSection
                      isSubscribed={isSubscribed}
                      title={
                        (t.analise_perfil as Record<string, string>).tab_simulator ??
                        "Simulador do 1o Ano"
                      }
                    >
                      <FirstYearSimTab result={result} />
                    </BlurredProSection>
                  )}
                  {selectedTab === "preparacao" && (
                    <BlurredProSection
                      isSubscribed={isSubscribed}
                      title={
                        (t.analise_perfil as Record<string, string>).tab_readiness ??
                        "Score de Preparação"
                      }
                    >
                      <ReadinessTab
                        result={result}
                        answerDetails={answerDetails}
                        confidence={calculateConfidence()}
                      />
                    </BlurredProSection>
                  )}
                </div>
              </section>
              {/* Methodology Panel + Disclaimer */}
              <section className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
                  <MethodologyPanel
                    title={
                      (t.analise_perfil as Record<string, string>).methodology_panel_title ??
                      "Metodologia de Análise de Perfil"
                    }
                    factors={[
                      {
                        name: "Experiência",
                        weight: "25%",
                        description:
                          (t.analise_perfil as Record<string, string>).method_experience ??
                          "Nível de experiência equestre declarado",
                      },
                      {
                        name: "Objectivos",
                        weight: "20%",
                        description:
                          (t.analise_perfil as Record<string, string>).method_objectives ??
                          "Objectivos primários com o cavalo",
                      },
                      {
                        name: "Orçamento",
                        weight: "15%",
                        description:
                          (t.analise_perfil as Record<string, string>).method_budget ??
                          "Capacidade financeira declarada",
                      },
                      {
                        name: "Disponibilidade",
                        weight: "15%",
                        description:
                          (t.analise_perfil as Record<string, string>).method_availability ??
                          "Tempo disponível para dedicar ao cavalo",
                      },
                      {
                        name: "Infraestrutura",
                        weight: "15%",
                        description:
                          (t.analise_perfil as Record<string, string>).method_infrastructure ??
                          "Condições de alojamento e instalações",
                      },
                      {
                        name: "Preferências",
                        weight: "10%",
                        description:
                          (t.analise_perfil as Record<string, string>).method_preferences ??
                          "Preferências pessoais de raça e disciplina",
                      },
                    ]}
                    limitations={[
                      (t.analise_perfil as Record<string, string>).limitation_1 ??
                        "Perfil baseado apenas nas respostas do quiz",
                      (t.analise_perfil as Record<string, string>).limitation_2 ??
                        "Custos são médias nacionais e podem variar por região",
                      (t.analise_perfil as Record<string, string>).limitation_3 ??
                        "Não considera circunstâncias pessoais específicas",
                    ]}
                    version={
                      (t.analise_perfil as Record<string, string>).methodology_version ??
                      "v2.1 — Fev 2026"
                    }
                    references={[
                      "Médias mercado equestre PT",
                      "Perfis de cavaleiro (tipologia APSL)",
                    ]}
                  />
                  <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)] mt-6">
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      <strong className="text-[var(--foreground-secondary)]">
                        {(t.analise_perfil as Record<string, string>).disclaimer_title ?? "Aviso:"}
                      </strong>{" "}
                      {(t.analise_perfil as Record<string, string>).disclaimer_text ??
                        "Esta análise é uma ferramenta de orientação baseada nas suas respostas ao questionário. Os resultados são indicativos e não substituem o aconselhamento de profissionais do sector equestre. Custos e recomendações podem variar significativamente conforme a região, o mercado local e as circunstâncias individuais."}
                      <span className="block mt-1 text-[10px] text-[var(--foreground-muted)]/40 font-mono">
                        {(t.analise_perfil as Record<string, string>).methodology_version ??
                          "v2.1 — Fev 2026"}
                      </span>
                    </p>
                  </div>
                </div>
              </section>
              {/* Cross-links — próximos passos */}
              <section className="py-8 border-t border-[var(--border)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                  <h2 className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--foreground-muted)] mb-5">
                    <ChevronRight size={14} className="text-[#C5A059]" aria-hidden="true" />
                    Continua a tua jornada
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Link
                      href="/calculadora-valor"
                      className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
                    >
                      <Calculator
                        size={18}
                        className="text-[var(--gold)] shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          Calculadora de Valor
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">
                          Estima o valor de um cavalo
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-[var(--gold)] transition-colors"
                      />
                    </Link>
                    <Link
                      href="/comparador-cavalos"
                      className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
                    >
                      <Scale
                        size={18}
                        className="text-[var(--gold)] shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          Comparador de Cavalos
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">
                          Compara até 4 candidatos
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-[var(--gold)] transition-colors"
                      />
                    </Link>
                    <Link
                      href="/verificador-compatibilidade"
                      className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
                    >
                      <Dna
                        size={18}
                        className="text-pink-400 shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          Verificador Genético
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">
                          Compatibilidade de criação
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-pink-400 transition-colors"
                      />
                    </Link>
                  </div>
                </div>
              </section>

              <section className="py-12 border-t border-[var(--border)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
                  <button
                    onClick={resetQuiz}
                    className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--foreground-secondary)] px-6 py-3 rounded-xl hover:border-[var(--foreground-muted)]/50 hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]/40 transition-all"
                  >
                    <RotateCcw size={18} />
                    {t.analise_perfil.repeat_analysis}
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </main>
  );
}

export default function AnalisePerfil() {
  const { t } = useLanguage();
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="text-[var(--gold)]">{t.analise_perfil.loading}</div>
        </div>
      }
    >
      <AnalisePerfilContent />
    </Suspense>
  );
}
