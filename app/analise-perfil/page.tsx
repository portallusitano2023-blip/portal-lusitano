"use client";

import { Suspense } from "react";
import { RotateCcw } from "lucide-react";
import Confetti from "@/components/tools/Confetti";
import BlurredProSection from "@/components/tools/BlurredProSection";
import { useLanguage } from "@/context/LanguageContext";
import { useQuizLogic } from "@/components/analise-perfil/useQuizLogic";
import IntroSection from "@/components/analise-perfil/IntroSection";
import QuizSection from "@/components/analise-perfil/QuizSection";
import ResultHeader from "@/components/analise-perfil/ResultHeader";
import ScoreDistribution from "@/components/analise-perfil/ScoreDistribution";
import ResultTabs from "@/components/analise-perfil/ResultTabs";
import ProfileTab from "@/components/analise-perfil/tabs/ProfileTab";
import HorseTab from "@/components/analise-perfil/tabs/HorseTab";
import CostsTab from "@/components/analise-perfil/tabs/CostsTab";
import TimelineTab from "@/components/analise-perfil/tabs/TimelineTab";
import AnalysisTab from "@/components/analise-perfil/tabs/AnalysisTab";
import NextStepsTab from "@/components/analise-perfil/tabs/NextStepsTab";
import ShoppingChecklistTab from "@/components/analise-perfil/tabs/ShoppingChecklistTab";
import BudgetPlannerTab from "@/components/analise-perfil/tabs/BudgetPlannerTab";

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
  } = useQuizLogic();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {showIntro ? (
        <IntroSection onStart={startQuiz} />
      ) : !showResult ? (
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
        />
      ) : (
        <div key="result" className="min-h-screen animate-[fadeSlideIn_0.4s_ease-out_forwards]">
          {result && (
            <>
              {/* Confetti celebration */}
              <div className="relative">
                <Confetti trigger={true} particleCount={50} duration={2800} />
              </div>

              <ResultHeader
                result={result}
                scorePercentages={scorePercentages}
                saved={saved}
                copied={copied}
                badgeRef={badgeRef}
                onSave={saveResult}
                onDownloadPDF={downloadPDF}
                onDownloadBadge={downloadBadge}
                onShareWhatsApp={shareWhatsApp}
                onShareFacebook={shareFacebook}
                onShareInstagram={shareInstagram}
                onCopyLink={copyShareLink}
              />
              <ScoreDistribution radarData={radarData} scorePercentages={scorePercentages} />
              <ResultTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
              <section className="py-12">
                <div className="max-w-5xl mx-auto px-6">
                  {selectedTab === "perfil" && <ProfileTab result={result} />}
                  {selectedTab === "cavalo" && <HorseTab result={result} />}
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
                  {selectedTab === "proximos" && <NextStepsTab result={result} />}
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
                </div>
              </section>
              <section className="py-12 border-t border-[var(--border)]">
                <div className="max-w-5xl mx-auto px-6 text-center">
                  <button
                    onClick={resetQuiz}
                    className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--foreground-secondary)] px-6 py-3 hover:text-[var(--foreground)] transition-colors"
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
