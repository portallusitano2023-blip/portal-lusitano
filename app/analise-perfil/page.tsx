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
