"use client";

import dynamic from "next/dynamic";
import { X, Sparkles, TrendingUp } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
import Paywall from "@/components/tools/Paywall";
import {
  CalculadoraHeader,
  IntroSection,
  StepIdentificacao,
  StepGeneticaMorfologia,
  StepAndamentosTemperamento,
  StepTreinoSaude,
  StepReproducaoMercado,
  StepNavigation,
  estimarValorParcial,
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

  return (
    <>
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <CalculadoraHeader
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          hasResultado={!!resultado}
          onReset={() => setShowResetConfirm(true)}
          onEdit={editarResultado}
          estimativaParcial={estimativaParcial}
        >
          {resultado && (
            <HistoryPanel
              history={calcHistory}
              show={showCalcHistory}
              onToggle={() => setShowCalcHistory((v) => !v)}
              onClose={() => setShowCalcHistory(false)}
            />
          )}
        </CalculadoraHeader>

        <div className="pt-16">
          {/* Intro */}
          {step === 0 && !resultado && (
            <>
              <IntroSection onStart={() => setStep(1)} />
              {/* Banner de draft guardado */}
              {hasDraft && (
                <div className="max-w-2xl mx-auto px-4 -mt-12 mb-8">
                  <div className="flex flex-col sm:flex-row items-center gap-3 px-5 py-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl">
                    <p className="text-xs text-[var(--gold)] flex-1 text-center sm:text-left">
                      Tem uma avaliação guardada de {draftDate}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={restaurarDraft}
                        className="px-3 py-1.5 bg-[var(--gold)] text-black text-xs font-bold rounded-lg hover:bg-[#D4B068] transition-colors"
                      >
                        Continuar
                      </button>
                      <button
                        onClick={descartarDraft}
                        className="px-3 py-1.5 bg-transparent border border-[var(--gold)]/40 text-[var(--gold)] text-xs rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
                      >
                        Descartar
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
                        Bem-vindo,{" "}
                        {PROFILE_LABELS[profileContext.profile] ?? profileContext.profile}
                        {profileContext.subProfile
                          ? ` — ${SUBPROFILE_LABELS[profileContext.subProfile] ?? profileContext.subProfile}`
                          : ""}
                      </strong>
                      <span className="text-[var(--gold)]/70">
                        {" "}
                        · Intervalo sugerido pelo teu perfil:{" "}
                        <strong>{profileContext.priceRange}</strong>
                      </span>
                    </p>
                    <button
                      onClick={() => setProfileContext(null)}
                      className="text-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors shrink-0"
                      aria-label="Fechar"
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
              {/* PRO Status Bar */}
              {!accessLoading && (step > 0 || !!resultado) && isSubscribed && (
                <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-3 flex items-center gap-2 mb-6 text-sm flex-wrap">
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
                    Calculadora desbloqueada
                  </span>
                  <a
                    href="/ferramentas/historico"
                    className="ml-auto text-xs sm:text-sm text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap"
                  >
                    Ver histórico →
                  </a>
                </div>
              )}
              {/* Free uses counter */}
              {!accessLoading && (step > 0 || !!resultado) && !isSubscribed && freeUsesLeft > 0 && (
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex items-center gap-2 mb-6 text-xs sm:text-sm flex-wrap">
                  <span className="text-amber-400/90 flex-1">
                    {freeUsesLeft} uso{freeUsesLeft !== 1 ? "s" : ""} gratuito
                    {freeUsesLeft !== 1 ? "s" : ""} disponível{freeUsesLeft !== 1 ? "is" : ""} —
                    Subscreva PRO
                  </span>
                  <a
                    href="/ferramentas"
                    className="ml-auto text-amber-400 hover:text-amber-300 transition-colors font-medium whitespace-nowrap"
                  >
                    Subscrever →
                  </a>
                </div>
              )}
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

              {/* Banner de boas-vindas — perfil vindo da Análise de Perfil (form steps) */}
              {profileContext && (step > 0 || !!resultado) && (
                <div className="flex items-start gap-3 px-4 py-3 bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold)]/5 border border-[var(--gold)]/40 rounded-xl mb-6 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                  <Sparkles size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--gold)] flex-1 leading-relaxed">
                    <strong>
                      {PROFILE_LABELS[profileContext.profile] ?? profileContext.profile}
                      {profileContext.subProfile
                        ? ` · ${SUBPROFILE_LABELS[profileContext.subProfile] ?? profileContext.subProfile}`
                        : ""}
                    </strong>
                    <span className="text-[var(--gold)]/70">
                      {" "}
                      — intervalo recomendado: <strong>{profileContext.priceRange}</strong>
                    </span>
                  </p>
                  <button
                    onClick={() => setProfileContext(null)}
                    className="text-[var(--gold)]/40 hover:text-[var(--gold)] transition-colors shrink-0"
                    aria-label="Fechar"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Loading overlay */}
              {isCalculating && (
                <div
                  role="status"
                  aria-label="A calcular o valor do seu cavalo"
                  className="flex flex-col items-center justify-center py-24 gap-8"
                >
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-[#C5A059]/15" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C5A059] animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#C5A059]/40 animate-spin [animation-duration:1.5s]" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[#C5A059] font-semibold text-lg tracking-wide">
                      A avaliar {form.nome ? `"${form.nome}"` : "o seu cavalo"}...
                    </p>
                    <p className="text-white/40 text-sm">
                      {form.treino && `${form.treino} · `}
                      {form.mercado || "Portugal"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.1s_both]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                      <span className="text-white/60 text-sm">
                        Analisando genealogia e linhagem...
                      </span>
                    </div>
                    <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.5s_both]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse [animation-delay:0.4s]" />
                      <span className="text-white/60 text-sm">
                        Avaliando formação e andamentos...
                      </span>
                    </div>
                    <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.9s_both]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse [animation-delay:0.8s]" />
                      <span className="text-white/60 text-sm">Calculando valor de mercado...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form steps */}
              {step > 0 && !resultado && !isCalculating && (
                <div
                  key={`step-${step}`}
                  className="space-y-8 pt-8 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                >
                  {/* Live Estimate Banner */}
                  {(() => {
                    const estimativa = estimarValorParcial(form);
                    if (!estimativa) return null;
                    return (
                      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[var(--background-secondary)]/60 border border-[var(--gold)]/20 rounded-xl mb-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 shrink-0">
                          <TrendingUp size={14} className="text-[#C5A059]" />
                          <span className="text-xs text-[var(--foreground-muted)]">Estimativa</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap justify-end">
                          <span className="text-xs sm:text-sm font-bold text-[#C5A059] whitespace-nowrap">
                            {estimativa.min.toLocaleString("pt-PT")}€
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)]">–</span>
                          <span className="text-xs sm:text-sm font-bold text-[#C5A059] whitespace-nowrap">
                            {estimativa.max.toLocaleString("pt-PT")}€
                          </span>
                          <span className="text-[10px] text-[var(--foreground-muted)]">
                            (parcial)
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
                          {preenchidos}/{total} campos — {pct}% completo
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
                              Confiança da Avaliação
                            </p>
                            <p className="text-[10px] text-[var(--foreground-muted)]">
                              {conf >= 80
                                ? "Excelente — dados completos para avaliação precisa"
                                : conf >= 70
                                  ? "Boa — adicione documentação para aumentar precisão"
                                  : "Moderada — registo APSL e exame vet. melhoram a confiança"}
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
                            "Andamentos e elevação com notas 8+ são diferenciais chave para competidores de Alta Escola.",
                          competidor_nacional:
                            "Andamentos regulares e impulsão são valorizados em provas de Dressage Nacional.",
                          competidor_trabalho:
                            "Temperamento e impulsão são decisivos para a Equitação de Trabalho.",
                        },
                        4: {
                          competidor_elite:
                            "Para Alta Escola, nível de treino CDI3* ou superior maximiza o valor de mercado.",
                          competidor_nacional:
                            "Nível Avançado ou acima é ideal para o teu perfil de Competição Nacional.",
                          criador: "Saúde e conformação têm maior peso para cavalos de reprodução.",
                          investidor:
                            "Cavalo jovem com treino baixo + potencial elevado = maior ROI a longo prazo.",
                        },
                        5: {
                          criador:
                            "Activa 'Reprodução' para incluir a análise de descendentes e valorizações de linhagem.",
                          investidor:
                            "Mercados Brasil e EUA tendem a valorizar mais cavalos PSL de linhagem Elite.",
                          amador_projeto:
                            "Cavalos jovens com treino inicial têm maior margem de valorização.",
                        },
                      };
                      const tip = tips[step]?.[profile] ?? tips[step]?.[profileContext.profile];
                      if (!tip) return null;
                      return (
                        <div className="flex items-start gap-3 px-4 py-3 bg-[var(--gold)]/8 border border-[var(--gold)]/25 rounded-xl">
                          <Sparkles size={14} className="text-[var(--gold)]/70 shrink-0 mt-0.5" />
                          <p className="text-xs text-[var(--gold)]/80 leading-relaxed">
                            <strong>Dica para o teu perfil:</strong> {tip}
                          </p>
                        </div>
                      );
                    })()}

                  {!canUse && (
                    <Paywall
                      toolName={t.calculadora.tool_name}
                      requiresAuth={requiresAuth}
                      proFeatures={[
                        "Avaliação completa com 15+ factores de valorização",
                        "Score de liquidez e tempo estimado de venda",
                        "Exportação PDF profissional com análise detalhada",
                        "Comparação com mercado e top 10% da raça",
                        "Recomendações personalizadas de valorização",
                      ]}
                    />
                  )}

                  <StepNavigation
                    step={step}
                    totalSteps={TOTAL_STEPS}
                    isCalculating={isCalculating}
                    onPrevious={() => setStep((s) => s - 1)}
                    onNext={() => setStep((s) => s + 1)}
                    onCalculate={calcular}
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
        <div className="fixed inset-0 z-[200] flex flex-col bg-black/90">
          <p className="text-xs text-white/50 text-center py-1">
            Pressione <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">ESC</kbd> para
            fechar
          </p>
          <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-[#C5A059]/30 shrink-0">
            <span className="text-[#C5A059] font-semibold text-sm">
              Avaliação PDF — Portal Lusitano
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-1.5 rounded-lg bg-[#C5A059] text-black text-sm font-semibold hover:bg-[#d4af6a] transition-colors"
              >
                Guardar PDF
              </button>
              <button
                onClick={handleClosePdfPreview}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <iframe src={pdfPreviewUrl} className="flex-1 w-full border-0" title="Avaliação PDF" />
        </div>
      )}

      {/* Reset Confirm Dialog */}
      <ConfirmDialog
        open={showResetConfirm}
        title="Recomeçar análise?"
        message="Os dados actuais serão perdidos. Tens a certeza que queres recomeçar?"
        confirmLabel="Recomeçar"
        cancelLabel="Cancelar"
        variant="warning"
        onConfirm={resetar}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
