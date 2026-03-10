"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { X, Sparkles, TrendingUp, RefreshCw, Pencil } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
import Paywall from "@/components/tools/Paywall";
import ToolNavBar from "@/components/tools/ToolNavBar";
import ProStatusBar from "@/components/ferramentas/ProStatusBar";
import FreeUsesCounter from "@/components/ferramentas/FreeUsesCounter";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { getSharedLabel, TREINO_LABELS } from "@/lib/tools/shared-data";
import {
  IntroSection,
  StepIdentificacao,
  StepGeneticaMorfologia,
  StepAndamentosTemperamento,
  StepTreinoSaude,
  StepReproducaoMercado,
  StepNavigation,
} from "@/components/calculadora-valor";
import HistoryPanel from "@/components/calculadora-valor/HistoryPanel";
import { useCalculadoraState } from "@/components/calculadora-valor/useCalculadoraState";

const ResultadoDisplay = dynamic(() => import("@/components/calculadora-valor/ResultadoDisplay"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="w-5 h-5 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
    </div>
  ),
});

export default function CalculadoraValorPage() {
  const {
    t,
    form,
    update,
    step,
    setStep,
    isCalculating,
    resultado,
    estimativaParcial,
    calcular,
    resetar,
    editarResultado,
    showResetConfirm,
    setShowResetConfirm,
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    accessLoading,
    isExporting,
    pdfPreviewUrl,
    handleExportPDF,
    handleClosePdfPreview,
    handleDownloadPdf,
    handleShare,
    handleSendEmail,
    handleComparar,
    handleVerificarCompat,
    hasDraft,
    draftDate,
    restaurarDraft,
    descartarDraft,
    profileContext,
    setProfileContext,
    calcHistory,
    showCalcHistory,
    setShowCalcHistory,
    progress,
    resultRef,
    PROFILE_LABELS,
    SUBPROFILE_LABELS,
    TOTAL_STEPS,
  } = useCalculadoraState();

  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "pt-PT";

  // Track which steps the user has visited for validation feedback
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (step > 0) {
      setVisitedSteps((prev) => {
        if (prev.has(step)) return prev;
        const next = new Set(prev);
        next.add(step);
        return next;
      });
    }
  }, [step]);

  return (
    <>
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <ToolNavBar
          currentTool="calculadora-valor"
          internalProgress={step > 0 && !resultado ? progress : undefined}
          internalStepLabel={step > 0 && !resultado ? `${step} / ${TOTAL_STEPS}` : undefined}
          hasResult={!!resultado}
          rightSlot={
            resultado ? (
              <>
                <HistoryPanel
                  history={calcHistory}
                  show={showCalcHistory}
                  onToggle={() => setShowCalcHistory((v) => !v)}
                  onClose={() => setShowCalcHistory(false)}
                />
                <button
                  onClick={editarResultado}
                  className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
                >
                  <Pencil size={13} />
                  <span className="hidden sm:inline">{tr("Editar", "Edit", "Editar")}</span>
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-sm text-[var(--gold)] hover:text-[#D4AF6A] transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={14} />
                  <span className="hidden sm:inline">{t.calculadora.new_evaluation}</span>
                </button>
              </>
            ) : step > 1 && estimativaParcial ? (
              <div className="text-right">
                <p className="text-[10px] text-[var(--foreground-muted)] leading-tight">
                  {tr("Estimativa parcial", "Partial estimate", "Estimación parcial")}
                </p>
                <p className="text-xs font-semibold text-[var(--gold)] leading-tight">
                  €{estimativaParcial.min.toLocaleString(locale)} – €
                  {estimativaParcial.max.toLocaleString(locale)}
                </p>
              </div>
            ) : step > 0 ? (
              <div className="text-xs text-[var(--foreground-muted)] flex items-center gap-2">
                <span className="text-[var(--gold)]">{step}</span>
                <span>/</span>
                <span>{TOTAL_STEPS}</span>
              </div>
            ) : undefined
          }
        />

        <div id="main-content" className="pt-16">
          {/* Intro */}
          {step === 0 && !resultado && (
            <>
              <IntroSection
                onStart={() => {
                  setStep(1);
                  setTimeout(
                    () =>
                      document
                        .getElementById("main-content")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    50
                  );
                }}
              />
              {/* Banner de draft guardado */}
              {hasDraft && (
                <div className="max-w-2xl mx-auto px-4 -mt-12 mb-8">
                  <div className="flex flex-col sm:flex-row items-center gap-3 px-5 py-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl">
                    <p className="text-xs text-[var(--gold)] flex-1 text-center sm:text-left">
                      {tr("Tem uma avaliação guardada de", "You have a saved evaluation from", "Tiene una evaluación guardada de")} {draftDate}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={restaurarDraft}
                        className="px-3 py-1.5 bg-[var(--gold)] text-black text-xs font-bold rounded-lg hover:bg-[#D4B068] transition-colors"
                      >
                        {tr("Continuar", "Continue", "Continuar")}
                      </button>
                      <button
                        onClick={descartarDraft}
                        className="px-3 py-1.5 bg-transparent border border-[var(--gold)]/40 text-[var(--gold)] text-xs rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
                      >
                        {tr("Descartar", "Discard", "Descartar")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Banner de boas-vindas — vindo da Análise de Perfil */}
              {profileContext && (
                <div className="max-w-2xl mx-auto px-4 -mt-8 mb-8">
                  <div className="flex items-start gap-3 px-5 py-4 bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold)]/5 border border-[var(--gold)]/40 rounded-xl animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                    <Sparkles size={16} className="text-[var(--gold)] shrink-0 mt-0.5" />
                    <p className="text-xs text-[var(--gold)] flex-1 leading-relaxed">
                      <strong>
                        {tr("Bem-vindo", "Welcome", "Bienvenido")},{" "}
                        {getSharedLabel(PROFILE_LABELS, profileContext.profile, language)}
                        {profileContext.subProfile
                          ? ` — ${getSharedLabel(SUBPROFILE_LABELS, profileContext.subProfile, language)}`
                          : ""}
                      </strong>
                      <span className="text-[var(--gold)]/70">
                        {" "}
                        · {tr("Intervalo sugerido pelo teu perfil:", "Range suggested by your profile:", "Rango sugerido por tu perfil:")}{" "}
                        <strong>{profileContext.priceRange}</strong>
                      </span>
                    </p>
                    <button
                      onClick={() => setProfileContext(null)}
                      className="text-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors shrink-0"
                      aria-label={tr("Fechar", "Close", "Cerrar")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Form area */}
          <div className="pb-24 px-4">
            <div className="max-w-2xl mx-auto">
              {/* PRO Status Bar + Free uses + Subscription — only when user can use */}
              {canUse && (
                <>
                  <ProStatusBar
                    toolName={["Calculadora", "Calculator", "Calculadora"]}
                    isSubscribed={isSubscribed}
                    accessLoading={accessLoading}
                    show={step > 0 || !!resultado}
                  />
                  <FreeUsesCounter
                    freeUsesLeft={freeUsesLeft}
                    isSubscribed={isSubscribed}
                    accessLoading={accessLoading}
                    show={step > 0 || !!resultado}
                  />
                  {accessLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-5 h-5 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
                    </div>
                  ) : (
                    <SubscriptionBanner
                      isSubscribed={isSubscribed}
                      freeUsesLeft={freeUsesLeft}
                      requiresAuth={requiresAuth}
                    />
                  )}
                  <ProUpgradeCard isSubscribed={isSubscribed} />
                </>
              )}

              {/* Banner de boas-vindas — perfil vindo da Análise de Perfil (form steps) */}
              {profileContext && (step > 0 || !!resultado) && (
                <div className="flex items-start gap-3 px-4 py-3 bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold)]/5 border border-[var(--gold)]/40 rounded-xl mb-6 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                  <Sparkles size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--gold)] flex-1 leading-relaxed">
                    <strong>
                      {getSharedLabel(PROFILE_LABELS, profileContext.profile, language)}
                      {profileContext.subProfile
                        ? ` · ${getSharedLabel(SUBPROFILE_LABELS, profileContext.subProfile, language)}`
                        : ""}
                    </strong>
                    <span className="text-[var(--gold)]/70">
                      {" "}
                      — {tr("intervalo recomendado:", "recommended range:", "rango recomendado:")} <strong>{profileContext.priceRange}</strong>
                    </span>
                  </p>
                  <button
                    onClick={() => setProfileContext(null)}
                    className="text-[var(--gold)]/40 hover:text-[var(--gold)] transition-colors shrink-0"
                    aria-label={tr("Fechar", "Close", "Cerrar")}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Loading overlay */}
              {isCalculating && (
                <div
                  role="status"
                  aria-label={tr("A calcular o valor do seu cavalo", "Calculating your horse's value", "Calculando el valor de su caballo")}
                  className="flex flex-col items-center justify-center py-24 gap-8"
                >
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-[#C5A059]/15" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C5A059] animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#C5A059]/40 animate-spin [animation-duration:1.5s]" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[#C5A059] font-semibold text-lg tracking-wide">
                      {tr("A avaliar", "Evaluating", "Evaluando")} {form.nome ? `"${form.nome}"` : tr("o seu cavalo", "your horse", "su caballo")}...
                    </p>
                    <p className="text-white/40 text-sm">
                      {form.treino && `${getSharedLabel(TREINO_LABELS, form.treino, language)} · `}
                      {form.mercado || "Portugal"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.1s_both]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                      <span className="text-white/60 text-sm">
                        {tr("Analisando genealogia e linhagem...", "Analyzing genealogy and lineage...", "Analizando genealogia y linaje...")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.5s_both]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse [animation-delay:0.4s]" />
                      <span className="text-white/60 text-sm">
                        {tr("Avaliando formação e andamentos...", "Evaluating training and gaits...", "Evaluando formación y movimientos...")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.9s_both]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse [animation-delay:0.8s]" />
                      <span className="text-white/60 text-sm">{tr("Calculando valor de mercado...", "Calculating market value...", "Calculando valor de mercado...")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form steps — only shown when user can use the tool */}
              {canUse && step > 0 && !resultado && !isCalculating && (
                <div
                  key={`step-${step}`}
                  className="space-y-8 pt-8 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                >
                  {/* Live Estimate Banner */}
                  {(() => {
                    if (!estimativaParcial) return null;
                    return (
                      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[var(--background-secondary)]/60 border border-[var(--gold)]/20 rounded-xl mb-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 shrink-0">
                          <TrendingUp size={14} className="text-[#C5A059]" />
                          <span className="text-xs text-[var(--foreground-muted)]">{tr("Estimativa", "Estimate", "Estimación")}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap justify-end">
                          <span className="text-xs sm:text-sm font-bold text-[#C5A059] whitespace-nowrap">
                            {estimativaParcial.min.toLocaleString(locale)}€
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)]">–</span>
                          <span className="text-xs sm:text-sm font-bold text-[#C5A059] whitespace-nowrap">
                            {estimativaParcial.max.toLocaleString(locale)}€
                          </span>
                          <span className="text-[10px] text-[var(--foreground-muted)]">
                            ({tr("parcial", "partial", "parcial")})
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Form Completeness Indicator */}
                  {(() => {
                    const camposImportantes = [
                      (form.nome?.trim().length ?? 0) > 0,
                      form.treino != null,
                      form.idade != null && form.idade > 0,
                      form.linhagem != null,
                      form.saude != null,
                      form.morfologia != null,
                      form.andamentos != null,
                      form.competicoes != null,
                      form.mercado != null,
                      form.registoAPSL != null,
                    ];
                    const preenchidos = camposImportantes.filter(Boolean).length;
                    const total = camposImportantes.length;
                    const pct = Math.round((preenchidos / total) * 100);

                    return (
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-1 bg-[var(--background-card)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C5A059]/50 to-[#C5A059] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[var(--foreground-muted)] whitespace-nowrap">
                          {preenchidos}/{total} {tr("campos", "fields", "campos")} — {pct}% {tr("completo", "complete", "completo")}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Confidence Indicator — last step */}
                  {step === TOTAL_STEPS &&
                    (() => {
                      const hasRegistoAPSL = form.registoAPSL;
                      const hasRaioX = form.raioX;
                      const hasExame = form.exameVeterinario;
                      const hasComp = form.competicoes && form.competicoes !== "nenhuma";
                      const confidenceBoosts = [hasRegistoAPSL, hasRaioX, hasExame, hasComp].filter(
                        Boolean
                      ).length;
                      const baseConf = 65;
                      const conf = Math.min(95, baseConf + confidenceBoosts * 8);

                      return (
                        <div
                          className={`flex items-center gap-3 p-3 rounded-lg border mb-4 ${
                            conf >= 80
                              ? "bg-emerald-500/5 border-emerald-500/20"
                              : conf >= 70
                                ? "bg-blue-500/5 border-blue-500/20"
                                : "bg-amber-500/5 border-amber-500/20"
                          }`}
                        >
                          <div
                            className={`text-lg font-bold ${conf >= 80 ? "text-emerald-400" : conf >= 70 ? "text-blue-400" : "text-amber-400"}`}
                          >
                            {conf}%
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[var(--foreground)]">
                              {tr("Confiança da Avaliação", "Evaluation Confidence", "Confianza de la Evaluación")}
                            </p>
                            <p className="text-[10px] text-[var(--foreground-muted)]">
                              {conf >= 80
                                ? tr("Excelente — dados completos para avaliação precisa", "Excellent — complete data for accurate evaluation", "Excelente — datos completos para evaluación precisa")
                                : conf >= 70
                                  ? tr("Boa — adicione documentação para aumentar precisão", "Good — add documentation to increase accuracy", "Buena — añada documentación para aumentar precisión")
                                  : tr("Moderada — registo APSL e exame vet. melhoram a confiança", "Moderate — APSL registration and vet exam improve confidence", "Moderada — registro APSL y examen vet. mejoran la confianza")}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                  {step === 1 && <StepIdentificacao form={form} update={update} />}
                  {step === 2 && <StepGeneticaMorfologia form={form} update={update} />}
                  {step === 3 && <StepAndamentosTemperamento form={form} update={update} />}
                  {step === 4 && <StepTreinoSaude form={form} update={update} />}
                  {step === 5 && <StepReproducaoMercado form={form} update={update} />}

                  {/* Dica contextual do perfil */}
                  {profileContext &&
                    (() => {
                      const profile = profileContext.subProfile ?? profileContext.profile;
                      const tips: Record<number, Partial<Record<string, string>>> = {
                        3: {
                          competidor_elite:
                            tr("Andamentos e elevação com notas 8+ são diferenciais chave para competidores de Alta Escola.", "Gaits and elevation with scores 8+ are key differentiators for Haute École competitors.", "Movimientos y elevación con notas 8+ son diferenciales clave para competidores de Alta Escuela."),
                          competidor_nacional:
                            tr("Andamentos regulares e impulsão são valorizados em provas de Dressage Nacional.", "Regular gaits and impulsion are valued in National Dressage competitions.", "Movimientos regulares e impulsión son valorados en pruebas de Doma Nacional."),
                          competidor_trabalho:
                            tr("Temperamento e impulsão são decisivos para a Equitação de Trabalho.", "Temperament and impulsion are decisive for Working Equitation.", "Temperamento e impulsión son decisivos para la Equitación de Trabajo."),
                        },
                        4: {
                          competidor_elite:
                            tr("Para Alta Escola, nível de treino CDI3* ou superior maximiza o valor de mercado.", "For Haute École, CDI3* training level or above maximizes market value.", "Para Alta Escuela, nivel de entrenamiento CDI3* o superior maximiza el valor de mercado."),
                          competidor_nacional:
                            tr("Nível Avançado ou acima é ideal para o teu perfil de Competição Nacional.", "Advanced level or above is ideal for your National Competition profile.", "Nivel Avanzado o superior es ideal para tu perfil de Competición Nacional."),
                          criador: tr("Saúde e conformação têm maior peso para cavalos de reprodução.", "Health and conformation carry more weight for breeding horses.", "Salud y conformación tienen mayor peso para caballos de reproducción."),
                          investidor:
                            tr("Cavalo jovem com treino baixo + potencial elevado = maior ROI a longo prazo.", "Young horse with low training + high potential = higher long-term ROI.", "Caballo joven con entrenamiento bajo + potencial elevado = mayor ROI a largo plazo."),
                        },
                        5: {
                          criador:
                            tr("Activa 'Reprodução' para incluir a análise de descendentes e valorizações de linhagem.", "Enable 'Breeding' to include offspring analysis and lineage valuations.", "Activa 'Reproducción' para incluir el análisis de descendientes y valoraciones de linaje."),
                          investidor:
                            tr("Mercados Brasil e EUA tendem a valorizar mais cavalos PSL de linhagem Elite.", "Brazil and USA markets tend to value PSL horses with Elite lineage more.", "Los mercados de Brasil y EE.UU. tienden a valorar más los caballos PSL de linaje Elite."),
                          amador_projeto:
                            tr("Cavalos jovens com treino inicial têm maior margem de valorização.", "Young horses with initial training have greater appreciation margin.", "Caballos jóvenes con entrenamiento inicial tienen mayor margen de valorización."),
                        },
                      };
                      const tip = tips[step]?.[profile] ?? tips[step]?.[profileContext.profile];
                      if (!tip) return null;
                      return (
                        <div className="flex items-start gap-3 px-4 py-3 bg-[var(--gold)]/8 border border-[var(--gold)]/25 rounded-xl">
                          <Sparkles size={14} className="text-[var(--gold)]/70 shrink-0 mt-0.5" />
                          <p className="text-xs text-[var(--gold)]/80 leading-relaxed">
                            <strong>{tr("Dica para o teu perfil:", "Tip for your profile:", "Consejo para tu perfil:")}</strong> {tip}
                          </p>
                        </div>
                      );
                    })()}

                  <StepNavigation
                    step={step}
                    totalSteps={TOTAL_STEPS}
                    isCalculating={isCalculating}
                    onPrevious={() => {
                      setStep(step - 1);
                      setTimeout(
                        () =>
                          document
                            .getElementById("main-content")
                            ?.scrollIntoView({ behavior: "smooth" }),
                        50
                      );
                    }}
                    onNext={() => {
                      setStep(step + 1);
                      setTimeout(
                        () =>
                          document
                            .getElementById("main-content")
                            ?.scrollIntoView({ behavior: "smooth" }),
                        50
                      );
                    }}
                    onCalculate={calcular}
                  />
                  {visitedSteps.size < TOTAL_STEPS && (
                    <p className="text-xs text-amber-400/70 mt-2 text-center">
                      {tr(
                        "Visite todos os passos para uma avaliação mais precisa",
                        "Visit all steps for a more accurate evaluation",
                        "Visite todos los pasos para una evaluación más precisa"
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Paywall — replaces form when user cannot use */}
              {!canUse && !resultado && !isCalculating && (
                <div className="pt-8">
                  <Paywall
                    toolName={t.calculadora.tool_name}
                    requiresAuth={requiresAuth}
                    proFeatures={[
                      tr("Avaliação completa com 15+ factores de valorização", "Complete evaluation with 15+ valuation factors", "Evaluación completa con 15+ factores de valorización"),
                      tr("Score de liquidez e tempo estimado de venda", "Liquidity score and estimated selling time", "Puntuación de liquidez y tiempo estimado de venta"),
                      tr("Exportação PDF profissional com análise detalhada", "Professional PDF export with detailed analysis", "Exportación PDF profesional con análisis detallado"),
                      tr("Comparação com mercado e top 10% da raça", "Market comparison and top 10% of the breed", "Comparación con mercado y top 10% de la raza"),
                      tr("Recomendações personalizadas de valorização", "Personalized valuation recommendations", "Recomendaciones personalizadas de valorización"),
                    ]}
                  />
                </div>
              )}

              {/* Result */}
              <div aria-live="polite">
                {resultado && (
                  <ResultadoDisplay
                    ref={resultRef}
                    resultado={resultado}
                    form={form}
                    onExportPDF={handleExportPDF}
                    onShare={handleShare}
                    isExporting={isExporting}
                    isSubscribed={isSubscribed}
                    onComparar={handleComparar}
                    onVerificarCompat={handleVerificarCompat}
                    onSendEmail={isSubscribed ? handleSendEmail : undefined}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* PDF Preview Modal */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-black/90" role="dialog" aria-modal="true" aria-label={tr("Pré-visualização PDF", "PDF Preview", "Vista previa PDF")}>
          <p className="text-xs text-white/50 text-center py-1">
            {tr("Pressione", "Press", "Pulse")} <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">ESC</kbd> {tr("para fechar", "to close", "para cerrar")}
          </p>
          <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-[#C5A059]/30 shrink-0">
            <span className="text-[#C5A059] font-semibold text-sm">
              {tr("Avaliação PDF — Portal Lusitano", "PDF Evaluation — Portal Lusitano", "Evaluación PDF — Portal Lusitano")}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-1.5 rounded-lg bg-[#C5A059] text-black text-sm font-semibold hover:bg-[#d4af6a] transition-colors"
              >
                {tr("Guardar PDF", "Save PDF", "Guardar PDF")}
              </button>
              <button
                onClick={handleClosePdfPreview}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <iframe src={pdfPreviewUrl} className="flex-1 w-full border-0" title={tr("Avaliação PDF", "PDF Evaluation", "Evaluación PDF")} />
        </div>
      )}

      {/* Reset Confirm Dialog */}
      <ConfirmDialog
        open={showResetConfirm}
        title={tr("Recomeçar análise?", "Restart analysis?", "Reiniciar análisis?")}
        message={tr("Os dados actuais serão perdidos. Tens a certeza que queres recomeçar?", "Current data will be lost. Are you sure you want to restart?", "Los datos actuales se perderán. ¿Estás seguro de que quieres reiniciar?")}
        confirmLabel={tr("Recomeçar", "Restart", "Reiniciar")}
        cancelLabel={tr("Cancelar", "Cancel", "Cancelar")}
        variant="warning"
        onConfirm={resetar}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
