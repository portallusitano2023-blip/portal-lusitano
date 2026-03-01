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
import ToolNavBar from "@/components/tools/ToolNavBar";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
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
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
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
    chainContext,
    setChainContext,
  } = useQuizLogic();

  // Progress: 0 on intro, quiz progress during quiz, 100 on result
  const quizProgress = showIntro
    ? 0
    : showResult
      ? 100
      : questions.length > 0
        ? Math.round(((currentQuestion + 1) / questions.length) * 100)
        : 0;

  return (
    <>
      <ToolNavBar
        currentTool="analise-perfil"
        internalProgress={quizProgress}
        hasResult={showResult}
        rightSlot={
          !showIntro ? (
            <button
              onClick={resetQuiz}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--background-secondary)] hover:bg-[var(--surface-hover)] transition-colors min-w-[44px] min-h-[44px]"
              aria-label={tr("Recomeçar", "Restart", "Reiniciar")}
              title={tr("Recomeçar", "Restart", "Reiniciar")}
            >
              <RotateCcw size={15} className="text-[var(--foreground-muted)]" />
            </button>
          ) : undefined
        }
      />
      <main id="main-content" className="min-h-screen bg-[var(--background)] pt-16">
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

        {/* Chain welcome banner — from Verificador */}
        {chainContext && showIntro && (
          <div className="max-w-2xl mx-auto px-4 pt-20 -mb-12">
            <div className="flex items-start gap-3 px-5 py-4 bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border border-emerald-500/40 rounded-xl animate-[fadeSlideIn_0.4s_ease-out_forwards]">
              <Dna size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300 flex-1 leading-relaxed">
                <strong>
                  {tr(
                    "Vindo do Verificador de Compatibilidade",
                    "From the Compatibility Checker",
                    "Desde el Verificador de Compatibilidad"
                  )}
                </strong>
                <span className="text-emerald-300/70">
                  {" "}
                  ·{" "}
                  {tr(
                    `Análise de ${chainContext} — descobre o perfil ideal de comprador para este cruzamento`,
                    `Analysis of ${chainContext} — discover the ideal buyer profile for this cross`,
                    `Análisis de ${chainContext} — descubre el perfil ideal de comprador para este cruce`
                  )}
                </span>
              </p>
              <button
                onClick={() => setChainContext(null)}
                className="text-emerald-400/50 hover:text-emerald-400 transition-colors shrink-0"
                aria-label={tr("Fechar", "Close", "Cerrar")}
              >
                &#10005;
              </button>
            </div>
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
                  <span className="text-[#C5A059] font-semibold">
                    {tr("PRO Activo", "PRO Active", "PRO Activo")}
                  </span>
                  <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                  <span className="text-[#C5A059]/80 hidden sm:inline">
                    {tr("Utilizações ilimitadas", "Unlimited uses", "Usos ilimitados")}
                  </span>
                  <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                  <span className="text-[#C5A059]/80 hidden sm:inline">
                    {tr(
                      "Análise de Perfil desbloqueada",
                      "Profile Analysis unlocked",
                      "Análisis de Perfil desbloqueado"
                    )}
                  </span>
                  <a
                    href="/ferramentas/historico"
                    className="ml-auto text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap text-xs sm:text-sm"
                  >
                    {tr("Ver histórico →", "View history →", "Ver historial →")}
                  </a>
                </div>
              </div>
            )}
            {/* Free uses counter — quiz in progress */}
            {!accessLoading && !isSubscribed && freeUsesLeft > 0 && (
              <div className="max-w-2xl mx-auto px-4 pt-6">
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-sm">
                  <span className="text-amber-400/90 flex-1 min-w-0">
                    {tr(
                      `${freeUsesLeft} uso${freeUsesLeft !== 1 ? "s" : ""} gratuito${freeUsesLeft !== 1 ? "s" : ""} disponível${freeUsesLeft !== 1 ? "is" : ""} — Subscreva PRO para utilizações ilimitadas`,
                      `${freeUsesLeft} free use${freeUsesLeft !== 1 ? "s" : ""} remaining — Subscribe to PRO for unlimited uses`,
                      `${freeUsesLeft} uso${freeUsesLeft !== 1 ? "s" : ""} gratuito${freeUsesLeft !== 1 ? "s" : ""} disponible${freeUsesLeft !== 1 ? "s" : ""} — Suscríbase a PRO para usos ilimitados`
                    )}
                  </span>
                  <a
                    href="/ferramentas"
                    className="text-amber-400 hover:text-amber-300 transition-colors font-medium whitespace-nowrap"
                  >
                    {tr("Subscrever", "Subscribe", "Suscribirse")}
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
                      <span className="text-[#C5A059] font-semibold">
                        {tr("PRO Activo", "PRO Active", "PRO Activo")}
                      </span>
                      <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                      <span className="text-[#C5A059]/80 hidden sm:inline">
                        {tr("Utilizações ilimitadas", "Unlimited uses", "Usos ilimitados")}
                      </span>
                      <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                      <span className="text-[#C5A059]/80 hidden sm:inline">
                        {tr(
                          "Análise de Perfil desbloqueada",
                          "Profile Analysis unlocked",
                          "Análisis de Perfil desbloqueado"
                        )}
                      </span>
                      <a
                        href="/ferramentas/historico"
                        className="ml-auto text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap text-xs sm:text-sm"
                      >
                        {tr("Ver histórico →", "View history →", "Ver historial →")}
                      </a>
                    </div>
                  </div>
                )}
                {/* Free uses counter — results */}
                {!isSubscribed && freeUsesLeft > 0 && (
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                    <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-sm">
                      <span className="text-amber-400/90 flex-1 min-w-0">
                        {tr(
                          `${freeUsesLeft} uso${freeUsesLeft !== 1 ? "s" : ""} gratuito${freeUsesLeft !== 1 ? "s" : ""} disponível${freeUsesLeft !== 1 ? "is" : ""} — Subscreva PRO para utilizações ilimitadas`,
                          `${freeUsesLeft} free use${freeUsesLeft !== 1 ? "s" : ""} remaining — Subscribe to PRO for unlimited uses`,
                          `${freeUsesLeft} uso${freeUsesLeft !== 1 ? "s" : ""} gratuito${freeUsesLeft !== 1 ? "s" : ""} disponible${freeUsesLeft !== 1 ? "s" : ""} — Suscríbase a PRO para usos ilimitados`
                        )}
                      </span>
                      <a
                        href="/ferramentas"
                        className="text-amber-400 hover:text-amber-300 transition-colors font-medium whitespace-nowrap"
                      >
                        {tr("Subscrever", "Subscribe", "Suscribirse")}
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
                    competidor: tr(
                      "Foque em formação profissional com treinador certificado",
                      "Focus on professional training with a certified trainer",
                      "Enfóquese en formación profesional con entrenador certificado"
                    ),
                    criador: tr(
                      "Explore linhas genéticas de alta qualidade",
                      "Explore high-quality genetic lines",
                      "Explore líneas genéticas de alta calidad"
                    ),
                    amador: tr(
                      "Priorize um cavalo de temperamento calmo e versátil",
                      "Prioritise a horse with a calm and versatile temperament",
                      "Priorice un caballo de temperamento tranquilo y versátil"
                    ),
                    aprendiz: tr(
                      "Comece com aulas de equitação antes da compra",
                      "Start with riding lessons before purchasing",
                      "Comience con clases de equitación antes de la compra"
                    ),
                    tradicional: tr(
                      "Lusitano de trabalho com boa formação clássica",
                      "Working Lusitano with good classical training",
                      "Lusitano de trabajo con buena formación clásica"
                    ),
                  };
                  const dominantPct = scorePercentages[0]?.percentage ?? 0;
                  const profileName = result.title;
                  const nextAction =
                    profileActions[result.profile] ??
                    tr(
                      "Consulte os detalhes do seu perfil para orientação personalizada",
                      "Check your profile details for personalised guidance",
                      "Consulte los detalles de su perfil para orientación personalizada"
                    );

                  const insights = [
                    {
                      icon: <Target size={18} className="text-[#C5A059]" aria-hidden="true" />,
                      title: tr("Perfil dominante", "Dominant profile", "Perfil dominante"),
                      description: tr(
                        `O seu perfil principal é ${profileName} com ${dominantPct}% de afinidade`,
                        `Your main profile is ${profileName} with ${dominantPct}% affinity`,
                        `Su perfil principal es ${profileName} con ${dominantPct}% de afinidad`
                      ),
                    },
                    {
                      icon: (
                        <ArrowRight size={18} className="text-emerald-400" aria-hidden="true" />
                      ),
                      title: tr("Próxima acção", "Next action", "Próxima acción"),
                      description: nextAction,
                    },
                    {
                      icon: <CheckCircle2 size={18} className="text-sky-400" aria-hidden="true" />,
                      title: tr("Nível de preparação", "Readiness level", "Nivel de preparación"),
                      description: tr(
                        "Consulte os detalhes PRO para o seu plano completo de preparação",
                        "Check PRO details for your complete readiness plan",
                        "Consulte los detalles PRO para su plan completo de preparación"
                      ),
                    },
                  ];

                  return (
                    <section className="py-8 border-b border-[var(--border)]">
                      <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <h2 className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--foreground-muted)] mb-5">
                          <Sparkles size={14} className="text-[#C5A059]" aria-hidden="true" />
                          {tr(
                            "As suas 3 principais conclusões",
                            "Your 3 key insights",
                            "Sus 3 principales conclusiones"
                          )}
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
                                  {tr(
                                    "Traços do Perfil Secundário",
                                    "Secondary Profile Traits",
                                    "Rasgos del Perfil Secundario"
                                  )}{" "}
                                  — {scorePercentages[1].label}
                                </h3>
                                <span className="ml-auto text-xs text-[var(--foreground-muted)] bg-[var(--background-card)] px-2 py-0.5 rounded-full">
                                  {scorePercentages[1].percentage}%{" "}
                                  {tr("afinidade", "affinity", "afinidad")}
                                </span>
                              </div>
                              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-3">
                                {tr(
                                  `Com ${scorePercentages[1].percentage}% de afinidade, o seu perfil combina características de`,
                                  `With ${scorePercentages[1].percentage}% affinity, your profile combines traits of`,
                                  `Con ${scorePercentages[1].percentage}% de afinidad, su perfil combina características de`
                                )}{" "}
                                <strong className="text-[var(--foreground-secondary)]">
                                  {scorePercentages[0]?.label ?? ""}
                                </strong>{" "}
                                {tr("e", "and", "y")}{" "}
                                <strong className="text-[var(--foreground-secondary)]">
                                  {scorePercentages[1].label}
                                </strong>
                                .{" "}
                                {tr(
                                  "Isto significa que pode beneficiar de abordagens de ambos os perfis.",
                                  "This means you can benefit from approaches of both profiles.",
                                  "Esto significa que puede beneficiarse de enfoques de ambos perfiles."
                                )}
                              </p>
                              {/* Dicas específicas para o perfil híbrido */}
                              {(() => {
                                const primary = scorePercentages[0]?.profile ?? "";
                                const secondary = scorePercentages[1].profile;
                                const combo = `${primary}_${secondary}`;
                                const HYBRID_TIPS: Record<string, string[]> = {
                                  competidor_criador: [
                                    tr(
                                      "Considere garanhões com dupla aptidão — competição e reprodução",
                                      "Consider stallions with dual aptitude — competition and breeding",
                                      "Considere sementales con doble aptitud — competición y reproducción"
                                    ),
                                    tr(
                                      "Procure cavalos com BLUP alto que também tenham palmarés desportivo",
                                      "Look for horses with high BLUP that also have a sport record",
                                      "Busque caballos con BLUP alto que también tengan palmarés deportivo"
                                    ),
                                    tr(
                                      "Uma égua de qualidade pode ser tanto atleta como reprodutora",
                                      "A quality mare can be both an athlete and a broodmare",
                                      "Una yegua de calidad puede ser tanto atleta como reproductora"
                                    ),
                                  ],
                                  competidor_amador: [
                                    tr(
                                      "Comece em provas locais para desenvolver experiência a custo controlado",
                                      "Start with local shows to build experience at a controlled cost",
                                      "Comience en pruebas locales para desarrollar experiencia a coste controlado"
                                    ),
                                    tr(
                                      "Um cavalo com temperamento dócil facilita a progressão competitiva",
                                      "A horse with a docile temperament eases competitive progression",
                                      "Un caballo con temperamento dócil facilita la progresión competitiva"
                                    ),
                                    tr(
                                      "Invista em treino regular com um técnico mesmo que não seja dedicado",
                                      "Invest in regular training with a coach even if not full-time",
                                      "Invierta en entrenamiento regular con un técnico aunque no sea dedicado"
                                    ),
                                  ],
                                  criador_amador: [
                                    tr(
                                      "Escolha cavalos com linhagem documentada mas temperamento suave",
                                      "Choose horses with documented lineage but gentle temperament",
                                      "Elija caballos con linaje documentado pero temperamento suave"
                                    ),
                                    tr(
                                      "O prazer de criar pode coexistir com custos controlados",
                                      "The joy of breeding can coexist with controlled costs",
                                      "El placer de criar puede coexistir con costes controlados"
                                    ),
                                    tr(
                                      "Participe em exposições APSL para ganhar experiência no sector",
                                      "Participate in APSL shows to gain industry experience",
                                      "Participe en exposiciones APSL para ganar experiencia en el sector"
                                    ),
                                  ],
                                  competidor_investidor: [
                                    tr(
                                      "Foque em cavalos jovens com alto BLUP — melhor ROI a 3-5 anos",
                                      "Focus on young horses with high BLUP — best ROI at 3-5 years",
                                      "Enfóquese en caballos jóvenes con alto BLUP — mejor ROI a 3-5 años"
                                    ),
                                    tr(
                                      "Competições CDI aumentam significativamente o valor de mercado",
                                      "CDI competitions significantly increase market value",
                                      "Competiciones CDI aumentan significativamente el valor de mercado"
                                    ),
                                    tr(
                                      "Documente todo o percurso desportivo para facilitar a venda futura",
                                      "Document the entire sport career to facilitate future sale",
                                      "Documente todo el recorrido deportivo para facilitar la venta futura"
                                    ),
                                  ],
                                };
                                const tips = HYBRID_TIPS[combo] ??
                                  HYBRID_TIPS[`${secondary}_${primary}`] ?? [
                                    tr(
                                      "Combine as melhores práticas de ambos os perfis",
                                      "Combine the best practices of both profiles",
                                      "Combine las mejores prácticas de ambos perfiles"
                                    ),
                                    tr(
                                      "A sua versatilidade é um ponto forte no mundo equestre",
                                      "Your versatility is a strength in the equestrian world",
                                      "Su versatilidad es un punto fuerte en el mundo ecuestre"
                                    ),
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
                                  label: tr(
                                    "Definir orçamento total",
                                    "Set total budget",
                                    "Definir presupuesto total"
                                  ),
                                  description: tr(
                                    "Inclui compra, transporte, primeiros meses de estábulo",
                                    "Includes purchase, transport, first months of stabling",
                                    "Incluye compra, transporte, primeros meses de establo"
                                  ),
                                  priority: "essential" as const,
                                },
                                {
                                  id: "stable",
                                  label: tr(
                                    "Garantir lugar em estábulo",
                                    "Secure stable place",
                                    "Asegurar plaza en establo"
                                  ),
                                  description: tr(
                                    "Confirmar vaga, condições e custos mensais",
                                    "Confirm vacancy, conditions and monthly costs",
                                    "Confirmar vacante, condiciones y costes mensuales"
                                  ),
                                  priority: "essential" as const,
                                },
                                {
                                  id: "insurance",
                                  label: tr(
                                    "Pesquisar seguros equinos",
                                    "Research equine insurance",
                                    "Investigar seguros equinos"
                                  ),
                                  description: tr(
                                    "Comparar apólices de saúde, vida e responsabilidade civil",
                                    "Compare health, life and liability policies",
                                    "Comparar pólizas de salud, vida y responsabilidad civil"
                                  ),
                                  priority: "important" as const,
                                },
                                {
                                  id: "trainer",
                                  label: tr(
                                    "Contactar treinador",
                                    "Contact trainer",
                                    "Contactar entrenador"
                                  ),
                                  description: tr(
                                    "Identificar profissional para acompanhamento pós-compra",
                                    "Identify a professional for post-purchase support",
                                    "Identificar profesional para acompañamiento post-compra"
                                  ),
                                  priority: "important" as const,
                                },
                                {
                                  id: "transport",
                                  label: tr(
                                    "Organizar transporte",
                                    "Organise transport",
                                    "Organizar transporte"
                                  ),
                                  description: tr(
                                    "Reservar transporte especializado para equinos",
                                    "Book specialised equine transport",
                                    "Reservar transporte especializado para equinos"
                                  ),
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
                                  label: tr(
                                    "Exame veterinário completo",
                                    "Full veterinary exam",
                                    "Examen veterinario completo"
                                  ),
                                  description: tr(
                                    "Incluir radiografias, análises sanguíneas e exame de fertilidade se aplicável",
                                    "Include X-rays, blood tests and fertility exam if applicable",
                                    "Incluir radiografías, análisis sanguíneos y examen de fertilidad si aplica"
                                  ),
                                  priority: "essential" as const,
                                },
                                {
                                  id: "conformation",
                                  label: tr(
                                    "Avaliar conformação",
                                    "Assess conformation",
                                    "Evaluar conformación"
                                  ),
                                  description: tr(
                                    "Verificar aprumos, dorso, garupa, pescoço e cabeça",
                                    "Check limbs, back, croup, neck and head",
                                    "Verificar aplomos, dorso, grupa, cuello y cabeza"
                                  ),
                                  priority: "essential" as const,
                                },
                                {
                                  id: "test-ride",
                                  label: tr("Ensaio montado", "Test ride", "Prueba montada"),
                                  description: tr(
                                    "Testar nos 3 andamentos, transições e temperamento",
                                    "Test in all 3 gaits, transitions and temperament",
                                    "Probar en los 3 aires, transiciones y temperamento"
                                  ),
                                  priority: "essential" as const,
                                },
                                {
                                  id: "papers",
                                  label: tr(
                                    "Verificar documentação",
                                    "Verify documentation",
                                    "Verificar documentación"
                                  ),
                                  description: tr(
                                    "Registo APSL, passaporte equino, vacinações em dia",
                                    "APSL registration, equine passport, up-to-date vaccinations",
                                    "Registro APSL, pasaporte equino, vacunas al día"
                                  ),
                                  priority: "important" as const,
                                },
                                {
                                  id: "history",
                                  label: tr(
                                    "Histórico de saúde",
                                    "Health history",
                                    "Historial de salud"
                                  ),
                                  description: tr(
                                    "Pedir relatórios veterinários anteriores",
                                    "Request previous veterinary reports",
                                    "Solicitar informes veterinarios anteriores"
                                  ),
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
                                  label: tr(
                                    "Período de adaptação",
                                    "Adaptation period",
                                    "Período de adaptación"
                                  ),
                                  description: tr(
                                    "Dar 7-14 dias para o cavalo se habituar ao novo ambiente",
                                    "Allow 7-14 days for the horse to adjust to the new environment",
                                    "Dar 7-14 días para que el caballo se adapte al nuevo entorno"
                                  ),
                                  priority: "essential" as const,
                                },
                                {
                                  id: "vet-visit",
                                  label: tr(
                                    "Visita veterinária inicial",
                                    "Initial vet visit",
                                    "Visita veterinaria inicial"
                                  ),
                                  description: tr(
                                    "Check-up completo no novo local",
                                    "Full check-up at the new location",
                                    "Chequeo completo en el nuevo lugar"
                                  ),
                                  priority: "essential" as const,
                                },
                                {
                                  id: "training-plan",
                                  label: tr(
                                    "Plano de treino",
                                    "Training plan",
                                    "Plan de entrenamiento"
                                  ),
                                  description: tr(
                                    "Definir objectivos e rotina com o treinador",
                                    "Define goals and routine with the trainer",
                                    "Definir objetivos y rutina con el entrenador"
                                  ),
                                  priority: "important" as const,
                                },
                                {
                                  id: "farrier",
                                  label: tr(
                                    "Visita do ferrador",
                                    "Farrier visit",
                                    "Visita del herrador"
                                  ),
                                  description: tr(
                                    "Avaliar cascos e ferrar se necessário",
                                    "Assess hooves and shoe if necessary",
                                    "Evaluar cascos y herrar si es necesario"
                                  ),
                                  priority: "important" as const,
                                },
                                {
                                  id: "socialisation",
                                  label: tr("Socialização", "Socialisation", "Socialización"),
                                  description: tr(
                                    "Introduzir gradualmente a outros cavalos do estábulo",
                                    "Gradually introduce to other horses in the stable",
                                    "Introducir gradualmente a otros caballos del establo"
                                  ),
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
                              label: tr("Pensão", "Board", "Pensión"),
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
                              label: tr("Alimentação", "Feed", "Alimentación"),
                              monthly: result.profile === "competidor" ? 180 : 140,
                              color: "#60A5FA",
                              icon: "Apple",
                            },
                            {
                              label: tr("Veterinário", "Veterinary", "Veterinario"),
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
                              label: tr("Ferrador", "Farrier", "Herrador"),
                              monthly: result.profile === "competidor" ? 75 : 55,
                              color: "#A78BFA",
                              icon: "Hammer",
                            },
                            {
                              label: tr("Treino", "Training", "Entrenamiento"),
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
                              label: tr("Seguro", "Insurance", "Seguro"),
                              monthly: result.profile === "competidor" ? 150 : 80,
                              color: "#FBBF24",
                              icon: "Shield",
                            },
                            {
                              label: tr("Competições", "Competitions", "Competiciones"),
                              monthly: result.profile === "competidor" ? 200 : 0,
                              color: "#FB923C",
                              icon: "Trophy",
                            },
                            {
                              label: tr("Equipamento", "Equipment", "Equipamiento"),
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
                          tr("Simulador do 1º Ano", "1st Year Simulator", "Simulador del 1er Año")
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
                          tr("Score de Preparação", "Readiness Score", "Score de Preparación")
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
                        tr(
                          "Metodologia de Análise de Perfil",
                          "Profile Analysis Methodology",
                          "Metodología de Análisis de Perfil"
                        )
                      }
                      factors={[
                        {
                          name: tr("Experiência", "Experience", "Experiencia"),
                          weight: "25%",
                          description:
                            (t.analise_perfil as Record<string, string>).method_experience ??
                            tr(
                              "Nível de experiência equestre declarado",
                              "Declared equestrian experience level",
                              "Nivel de experiencia ecuestre declarado"
                            ),
                        },
                        {
                          name: tr("Objectivos", "Objectives", "Objetivos"),
                          weight: "20%",
                          description:
                            (t.analise_perfil as Record<string, string>).method_objectives ??
                            tr(
                              "Objectivos primários com o cavalo",
                              "Primary objectives with the horse",
                              "Objetivos primarios con el caballo"
                            ),
                        },
                        {
                          name: tr("Orçamento", "Budget", "Presupuesto"),
                          weight: "15%",
                          description:
                            (t.analise_perfil as Record<string, string>).method_budget ??
                            tr(
                              "Capacidade financeira declarada",
                              "Declared financial capacity",
                              "Capacidad financiera declarada"
                            ),
                        },
                        {
                          name: tr("Disponibilidade", "Availability", "Disponibilidad"),
                          weight: "15%",
                          description:
                            (t.analise_perfil as Record<string, string>).method_availability ??
                            tr(
                              "Tempo disponível para dedicar ao cavalo",
                              "Available time to dedicate to the horse",
                              "Tiempo disponible para dedicar al caballo"
                            ),
                        },
                        {
                          name: tr("Infraestrutura", "Infrastructure", "Infraestructura"),
                          weight: "15%",
                          description:
                            (t.analise_perfil as Record<string, string>).method_infrastructure ??
                            tr(
                              "Condições de alojamento e instalações",
                              "Housing conditions and facilities",
                              "Condiciones de alojamiento e instalaciones"
                            ),
                        },
                        {
                          name: tr("Preferências", "Preferences", "Preferencias"),
                          weight: "10%",
                          description:
                            (t.analise_perfil as Record<string, string>).method_preferences ??
                            tr(
                              "Preferências pessoais de raça e disciplina",
                              "Personal breed and discipline preferences",
                              "Preferencias personales de raza y disciplina"
                            ),
                        },
                      ]}
                      limitations={[
                        (t.analise_perfil as Record<string, string>).limitation_1 ??
                          tr(
                            "Perfil baseado apenas nas respostas do quiz",
                            "Profile based only on quiz answers",
                            "Perfil basado solo en las respuestas del quiz"
                          ),
                        (t.analise_perfil as Record<string, string>).limitation_2 ??
                          tr(
                            "Custos são médias nacionais e podem variar por região",
                            "Costs are national averages and may vary by region",
                            "Costes son promedios nacionales y pueden variar por región"
                          ),
                        (t.analise_perfil as Record<string, string>).limitation_3 ??
                          tr(
                            "Não considera circunstâncias pessoais específicas",
                            "Does not consider specific personal circumstances",
                            "No considera circunstancias personales específicas"
                          ),
                      ]}
                      version={
                        (t.analise_perfil as Record<string, string>).methodology_version ??
                        "v2.1 — Fev 2026"
                      }
                      references={[
                        tr(
                          "Médias mercado equestre PT",
                          "PT equestrian market averages",
                          "Promedios mercado ecuestre PT"
                        ),
                        tr(
                          "Perfis de cavaleiro (tipologia APSL)",
                          "Rider profiles (APSL typology)",
                          "Perfiles de jinete (tipología APSL)"
                        ),
                      ]}
                    />
                    <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)] mt-6">
                      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                        <strong className="text-[var(--foreground-secondary)]">
                          {(t.analise_perfil as Record<string, string>).disclaimer_title ??
                            tr("Aviso:", "Notice:", "Aviso:")}
                        </strong>{" "}
                        {(t.analise_perfil as Record<string, string>).disclaimer_text ??
                          tr(
                            "Esta análise é uma ferramenta de orientação baseada nas suas respostas ao questionário. Os resultados são indicativos e não substituem o aconselhamento de profissionais do sector equestre. Custos e recomendações podem variar significativamente conforme a região, o mercado local e as circunstâncias individuais.",
                            "This analysis is a guidance tool based on your quiz answers. Results are indicative and do not replace advice from equestrian industry professionals. Costs and recommendations may vary significantly by region, local market and individual circumstances.",
                            "Este análisis es una herramienta de orientación basada en sus respuestas al cuestionario. Los resultados son indicativos y no sustituyen el asesoramiento de profesionales del sector ecuestre. Costes y recomendaciones pueden variar significativamente según la región, el mercado local y las circunstancias individuales."
                          )}
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
                      {tr("Continua a tua jornada", "Continue your journey", "Continúa tu viaje")}
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
                            {tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor")}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] truncate">
                            {tr(
                              "Estima o valor de um cavalo",
                              "Estimate a horse's value",
                              "Estima el valor de un caballo"
                            )}
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
                            {tr(
                              "Comparador de Cavalos",
                              "Horse Comparator",
                              "Comparador de Caballos"
                            )}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] truncate">
                            {tr(
                              "Compara até 4 candidatos",
                              "Compare up to 4 candidates",
                              "Compara hasta 4 candidatos"
                            )}
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
                            {tr("Verificador Genético", "Genetic Checker", "Verificador Genético")}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] truncate">
                            {tr(
                              "Compatibilidade de criação",
                              "Breeding compatibility",
                              "Compatibilidad de cría"
                            )}
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
    </>
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
