"use client";

import { Suspense, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import LocalizedLink from "@/components/LocalizedLink";
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
  BookOpen,
} from "lucide-react";
import Confetti from "@/components/tools/Confetti";
import BlurredProSection from "@/components/tools/BlurredProSection";
import ToolNavBar from "@/components/tools/ToolNavBar";
import ProStatusBar from "@/components/ferramentas/ProStatusBar";
import FreeUsesCounter from "@/components/ferramentas/FreeUsesCounter";
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
const RiderPhysicalTab = dynamic(
  () => import("@/components/analise-perfil/tabs/RiderPhysicalTab"),
  { ssr: false, loading: TabFallback }
);
const MethodologyPanel = dynamic(() => import("@/components/tools/MethodologyPanel"), {
  ssr: false,
  loading: TabFallback,
});

function AnalisePerfilContent() {
  const { t, language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
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
    isPending,
    isPdfLoading,
    isBadgeLoading,
    handleAnswer,
    skipQuestion,
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
    hasSavedProgress,
    resumeQuiz,
    clearSavedProgress,
    sharedConfidence,
  } = useQuizLogic();

  // Confidence: null when shared result has no confidence data (avoids showing 0%)
  const displayConfidence = sharedConfidence ?? (answerDetails.length > 0 ? calculateConfidence() : null);

  // Progress: 0 on intro, quiz progress during quiz, 100 on result
  const quizProgress = showIntro
    ? 0
    : showResult
      ? 100
      : questions.length > 0
        ? Math.round((currentQuestion / questions.length) * 100)
        : 0;

  // Memoised map of profile -> percentage for tabs that need a Record<string, number>
  const scorePercentagesMap = useMemo(
    () => Object.fromEntries(scorePercentages.map((sp) => [sp.profile, sp.percentage])),
    [scorePercentages]
  );

  // Issue #4: ToolNavBar reset should show confirmation when quiz is in progress
  const handleNavBarReset = useCallback(() => {
    if (!showResult && currentQuestion > 3) {
      const msg = tr(
        "Tem a certeza que deseja recomeçar o quiz? O progresso será perdido.",
        "Are you sure you want to restart the quiz? Progress will be lost.",
        "¿Está seguro de que desea reiniciar el cuestionario? El progreso se perderá."
      );
      if (!window.confirm(msg)) return;
    }
    resetQuiz();
  }, [showResult, currentQuestion, tr, resetQuiz]);

  return (
    <>
      <ToolNavBar
        currentTool="analise-perfil"
        internalProgress={quizProgress}
        hasResult={showResult}
        rightSlot={
          !showIntro ? (
            <button
              onClick={handleNavBarReset}
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
          <div role="alert" className="fixed bottom-4 right-4 z-50 bg-red-900/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3 max-w-sm">
            <span className="text-red-400">&#9888;</span>
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              aria-label={tr("Fechar", "Close", "Cerrar")}
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
          <>
            {/* Resume saved progress banner */}
            {hasSavedProgress && (
              <div className="max-w-2xl mx-auto px-4 pt-20 -mb-12 relative z-10">
                <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#C5A059]/15 to-[#C5A059]/5 border border-[#C5A059]/40 rounded-xl animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                  <BookOpen size={16} className="text-[#C5A059] shrink-0" />
                  <p className="text-sm text-[var(--foreground-muted)] flex-1">
                    {tr(
                      "Tens progresso guardado. Queres continuar?",
                      "You have saved progress. Continue where you left off?",
                      "Tienes progreso guardado. ¿Quieres continuar?"
                    )}
                  </p>
                  <button
                    onClick={resumeQuiz}
                    className="px-3 py-1.5 text-xs font-medium bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] rounded-lg transition-colors"
                  >
                    {tr("Continuar", "Resume", "Continuar")}
                  </button>
                  <button
                    onClick={clearSavedProgress}
                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xs transition-colors"
                  >
                    {tr("Descartar", "Discard", "Descartar")}
                  </button>
                </div>
              </div>
            )}
            <IntroSection onStart={startQuiz} />
          </>
        ) : !showResult ? (
          <>
            {/* PRO Status Bar — quiz in progress (only when user can use) */}
            {canUse && (
            <div className="max-w-2xl mx-auto px-4 pt-6">
              <ProStatusBar
                toolName={["Análise de Perfil", "Profile Analysis", "Análisis de Perfil"]}
                isSubscribed={isSubscribed}
                accessLoading={accessLoading}
                className="mb-4"
              />
              <FreeUsesCounter
                freeUsesLeft={freeUsesLeft}
                isSubscribed={isSubscribed}
                accessLoading={accessLoading}
                className="mb-4"
              />
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
              isPending={isPending}
              onAnswer={handleAnswer}
              onSkip={skipQuestion}
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

                {/* PRO Status Bar — results (only when user can use) */}
                {canUse && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                  <ProStatusBar
                    toolName={["Análise de Perfil", "Profile Analysis", "Análisis de Perfil"]}
                    isSubscribed={isSubscribed}
                    accessLoading={accessLoading}
                    className="mb-4"
                  />
                  <FreeUsesCounter
                    freeUsesLeft={freeUsesLeft}
                    isSubscribed={isSubscribed}
                    accessLoading={accessLoading}
                    className="mb-4"
                  />
                </div>
                )}

                <ResultHeader
                  result={result}
                  scorePercentages={scorePercentages}
                  saved={saved}
                  copied={copied}
                  badgeRef={badgeRef}
                  subProfile={subProfile}
                  confidence={displayConfidence !== null ? displayConfidence : undefined}
                  onSave={saveResult}
                  onDownloadPDF={downloadPDF}
                  onDownloadBadge={downloadBadge}
                  isPdfLoading={isPdfLoading}
                  isBadgeLoading={isBadgeLoading}
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
                                  competidor_tradicional: [
                                    tr(
                                      "Equilibre a preparação competitiva com os princípios da equitação clássica portuguesa",
                                      "Balance competitive preparation with the principles of Portuguese classical riding",
                                      "Equilibre la preparación competitiva con los principios de la equitación clásica portuguesa"
                                    ),
                                    tr(
                                      "Provas de Equitação de Trabalho unem tradição e competição de forma natural",
                                      "Working Equitation trials naturally unite tradition and competition",
                                      "Las pruebas de Equitación de Trabajo unen tradición y competición de forma natural"
                                    ),
                                    tr(
                                      "Procure cavalos com formação clássica que se adaptem ao contexto desportivo",
                                      "Look for horses with classical training that adapt to the sporting context",
                                      "Busque caballos con formación clásica que se adapten al contexto deportivo"
                                    ),
                                  ],
                                  aprendiz_amador: [
                                    tr(
                                      "Combine aulas regulares com passeios recreativos para manter a motivação",
                                      "Combine regular lessons with recreational rides to keep motivation high",
                                      "Combine clases regulares con paseos recreativos para mantener la motivación"
                                    ),
                                    tr(
                                      "Um cavalo schoolmaster é ideal para aprender com segurança e prazer",
                                      "A schoolmaster horse is ideal for learning safely and enjoyably",
                                      "Un caballo schoolmaster es ideal para aprender con seguridad y placer"
                                    ),
                                    tr(
                                      "Não tenha pressa — o percurso de aprendizagem é tão valioso quanto o destino",
                                      "Don't rush — the learning journey is as valuable as the destination",
                                      "No tenga prisa — el camino de aprendizaje es tan valioso como el destino"
                                    ),
                                  ],
                                  aprendiz_tradicional: [
                                    tr(
                                      "A equitação clássica portuguesa é uma excelente base para cavaleiros em formação",
                                      "Portuguese classical riding is an excellent foundation for riders in training",
                                      "La equitación clásica portuguesa es una excelente base para jinetes en formación"
                                    ),
                                    tr(
                                      "Procure mestres de equitação tradicional que aceitem alunos — a transmissão directa é insubstituível",
                                      "Seek traditional riding masters who accept students — direct transmission is irreplaceable",
                                      "Busque maestros de equitación tradicional que acepten alumnos — la transmisión directa es insustituible"
                                    ),
                                    tr(
                                      "Visite festivais e feiras equestres para absorver a cultura antes de investir",
                                      "Visit equestrian festivals and fairs to absorb the culture before investing",
                                      "Visite festivales y ferias ecuestres para absorber la cultura antes de invertir"
                                    ),
                                  ],
                                  tradicional_amador: [
                                    tr(
                                      "A tradição equestre lusitana pode ser vivida de forma casual em festas e romarias",
                                      "Lusitanian equestrian tradition can be enjoyed casually at festivals and pilgrimages",
                                      "La tradición ecuestre lusitana puede vivirse de forma casual en fiestas y romerías"
                                    ),
                                    tr(
                                      "Um cavalo de temperamento dócil com boa linhagem une tradição e prazer",
                                      "A gentle-tempered horse with good lineage unites tradition and pleasure",
                                      "Un caballo de temperamento dócil con buen linaje une tradición y placer"
                                    ),
                                    tr(
                                      "Participe em eventos APSL e passeios organizados para viver a cultura equestre",
                                      "Participate in APSL events and organised rides to experience equestrian culture",
                                      "Participe en eventos APSL y paseos organizados para vivir la cultura ecuestre"
                                    ),
                                  ],
                                  criador_tradicional: [
                                    tr(
                                      "Foque na preservação de linhagens clássicas com histórico comprovado na tradição portuguesa",
                                      "Focus on preserving classical bloodlines with proven history in Portuguese tradition",
                                      "Enfóquese en la preservación de linajes clásicos con historial comprobado en la tradición portuguesa"
                                    ),
                                    tr(
                                      "Visite coudelarias históricas para estudar os padrões tradicionais de selecção",
                                      "Visit historic stud farms to study traditional selection standards",
                                      "Visite ganaderías históricas para estudiar los patrones tradicionales de selección"
                                    ),
                                    tr(
                                      "A criação com foco na tradição valoriza funcionalidade, temperamento e tipicidade racial",
                                      "Breeding with a focus on tradition values functionality, temperament and breed typicality",
                                      "La cría con enfoque en la tradición valora funcionalidad, temperamento y tipicidad racial"
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
                        scorePercentages={scorePercentagesMap}
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
                          confidence={displayConfidence ?? 0}
                        />
                      </BlurredProSection>
                    )}
                    {selectedTab === "proximos" && (
                      <NextStepsTab result={result} subProfile={subProfile} />
                    )}
                    {selectedTab === "prioridades" && (
                      <PriorityMapTab
                        result={result}
                      />
                    )}
                    {selectedTab === "checklist" && (
                      <BlurredProSection
                        isSubscribed={isSubscribed}
                        title={t.analise_perfil.tab_checklist}
                      >
                        <ShoppingChecklistTab
                          profile={result.profile}
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
                          profileName={result.title}
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
                          confidence={displayConfidence ?? 0}
                        />
                      </BlurredProSection>
                    )}
                    {selectedTab === "fisico" && (
                      <Suspense fallback={<TabFallback />}>
                        <RiderPhysicalTab result={result} />
                      </Suspense>
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
                      <LocalizedLink
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
                      </LocalizedLink>
                      <LocalizedLink
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
                      </LocalizedLink>
                      <LocalizedLink
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
                      </LocalizedLink>
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
