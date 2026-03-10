"use client";

import { forwardRef, useMemo, useCallback, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, Sparkles, AlertTriangle, Info, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
import Paywall from "@/components/tools/Paywall";
import type { CrossValidationWarning } from "@/components/analise-perfil/useQuizLogic";
import type { Question, QuestionOption } from "@/components/analise-perfil/types";

interface QuizSectionProps {
  questions: Question[];
  currentQuestion: number;
  canUse: boolean;
  isSubscribed: boolean;
  freeUsesLeft: number;
  requiresAuth: boolean;
  accessLoading: boolean;
  isPending: boolean;
  onAnswer: (option: QuestionOption) => void;
  onSkip: () => void;
  onBack: () => void;
  onReset: () => void;
  dominantProfile: string | null;
  dominantProfileLabel: string;
  crossValidationWarning: CrossValidationWarning | null;
  onDismissCrossWarning: () => void;
}

const QuizSection = forwardRef<HTMLDivElement, QuizSectionProps>(function QuizSection(
  {
    questions,
    currentQuestion,
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    accessLoading,
    isPending,
    onAnswer,
    onSkip,
    onBack,
    onReset,
    dominantProfile,
    dominantProfileLabel,
    crossValidationWarning,
    onDismissCrossWarning,
  },
  ref
) {
  const { t, language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const progressCompleted = Math.round((currentQuestion / questions.length) * 100);
  const question = questions[currentQuestion];
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Clear stale DOM refs when question changes
  useEffect(() => {
    optionsRef.current = [];
  }, [question?.id]);

  // Issue 35: Restart confirmation when > 3 questions answered
  const handleReset = useCallback(() => {
    if (currentQuestion > 3) {
      const msg = tr(
        "Tem a certeza que deseja recomeçar o quiz? O progresso será perdido.",
        "Are you sure you want to restart the quiz? Progress will be lost.",
        "¿Está seguro de que desea reiniciar el cuestionario? El progreso se perderá."
      );
      if (!window.confirm(msg)) return;
    }
    onReset();
  }, [currentQuestion, onReset, tr]);

  // Issue 31: Keyboard navigation — Arrow keys move focus, Enter selects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!question || !canUse) return;
      const opts = optionsRef.current.filter(Boolean) as HTMLButtonElement[];
      if (opts.length === 0) return;

      const focusedIdx = opts.findIndex((el) => el === document.activeElement);

      if (focusedIdx < 0) return; // no option button focused, don't interfere

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = focusedIdx < opts.length - 1 ? focusedIdx + 1 : 0;
        opts[next]?.focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = focusedIdx > 0 ? focusedIdx - 1 : opts.length - 1;
        opts[prev]?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [question, canUse]);

  return (
    <div
      key="quiz"
      ref={ref}
      className="min-h-screen pt-24 pb-20 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Only show SubscriptionBanner/ProUpgradeCard when user CAN use —
            when !canUse the Paywall below already handles auth/subscribe prompts */}
        {canUse && (
          <>
            {accessLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
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

        {/* Paywall — replaces quiz content when user cannot use */}
        {!canUse && !accessLoading && (
          <Paywall
            toolName={t.analise_perfil.title_line1}
            requiresAuth={requiresAuth}
            proFeatures={[
              tr(
                "Análise completa com 17 perguntas e 5 perfis",
                "Full analysis with 17 questions and 5 profiles",
                "Análisis completo con 17 preguntas y 5 perfiles"
              ),
              tr(
                "Sub-perfil especializado (Elite FEI, Trabalho, etc.)",
                "Specialised sub-profile (FEI Elite, Working Eq., etc.)",
                "Sub-perfil especializado (Elite FEI, Trabajo, etc.)"
              ),
              tr(
                "Percentagem de confiança no resultado",
                "Confidence percentage in results",
                "Porcentaje de confianza en el resultado"
              ),
              tr(
                "Guia de cavalos recomendados por perfil",
                "Recommended horses guide by profile",
                "Guía de caballos recomendados por perfil"
              ),
              tr(
                "Plano de custos e timeline personalizada",
                "Personalised cost plan and timeline",
                "Plan de costes y cronograma personalizado"
              ),
            ]}
          />
        )}

        {/* Quiz content — only rendered when user can use the tool */}
        {(canUse || accessLoading) && (
        <>
        {/* Barra de progresso rica */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--foreground-muted)]">
              {tr(
                `Pergunta ${currentQuestion + 1} de ${questions.length}`,
                `Question ${currentQuestion + 1} of ${questions.length}`,
                `Pregunta ${currentQuestion + 1} de ${questions.length}`
              )}
            </span>
            <span className="text-xs font-medium text-[#C5A059]">
              {progressCompleted}% {tr("concluído", "completed", "completado")}
            </span>
          </div>
          <div
            className="h-1.5 bg-[var(--background-card)]/50 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressCompleted}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={tr("Progresso do quiz", "Quiz progress", "Progreso del cuestionario")}
          >
            <div
              className="h-full bg-gradient-to-r from-[#C5A059]/70 to-[#C5A059] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.round((currentQuestion / questions.length) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide max-w-[60%]">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 shrink-0 rounded-full transition-all duration-300 ${
                    i < currentQuestion
                      ? "bg-[var(--gold)]"
                      : i === currentQuestion
                        ? "bg-[var(--gold)]/60 ring-2 ring-[var(--gold)]/40 scale-125"
                        : "bg-[var(--background-card)]"
                  }`}
                />
              ))}
            </div>
            {questions.length - currentQuestion - 1 > 0 && (
              <span className="text-[10px] text-[var(--foreground-muted)]">
                ~{Math.ceil(((questions.length - currentQuestion - 1) * 20) / 60)} min{" "}
                {tr("restantes", "remaining", "restantes")}
              </span>
            )}
          </div>
          {question?.category && (
            <p className="text-[10px] text-[var(--foreground-muted)] mt-1.5 text-center">
              {tr("Categoria:", "Category:", "Categoría:")}{" "}
              <span className="text-[#C5A059]/80">{question.category}</span>
            </p>
          )}
        </div>

        {/* Preview do perfil (a partir de metade do quiz) */}
        {currentQuestion >= Math.floor(questions.length / 2) && dominantProfile && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-[var(--background-secondary)]/40 rounded-lg border border-[var(--border)]/50">
            <Sparkles size={12} className="text-[#C5A059] shrink-0" />
            <p className="text-xs text-[var(--foreground-muted)]">
              {tr(
                "Com base nas suas respostas, o seu perfil indica:",
                "Based on your answers, your profile indicates:",
                "Según sus respuestas, su perfil indica:"
              )}{" "}
              <span className="text-[var(--foreground)] font-semibold">{dominantProfileLabel}</span>
            </p>
          </div>
        )}

        {/* Aviso de validação cruzada educativo */}
        {crossValidationWarning && (
          <div
            role="alert"
            className={`flex items-start gap-3 mb-4 px-4 py-3 rounded-xl border animate-[fadeSlideIn_0.3s_ease-out_forwards] ${
              crossValidationWarning.severity === "warning"
                ? "bg-amber-500/10 border-amber-500/20"
                : "bg-blue-500/10 border-blue-500/20"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {crossValidationWarning.severity === "warning" ? (
                <AlertTriangle size={16} className="text-amber-400" aria-hidden="true" />
              ) : (
                <Info size={16} className="text-blue-400" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs leading-relaxed ${
                  crossValidationWarning.severity === "warning" ? "text-amber-300" : "text-blue-300"
                }`}
              >
                <span className="font-semibold">
                  {tr("Dica Educativa:", "Educational Tip:", "Consejo Educativo:")}{" "}
                </span>
                {crossValidationWarning.message}
              </p>
            </div>
            <button
              onClick={onDismissCrossWarning}
              aria-label={tr("Dispensar aviso", "Dismiss warning", "Descartar aviso")}
              className={`shrink-0 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-colors ${
                crossValidationWarning.severity === "warning"
                  ? "text-amber-400/60 hover:text-amber-300"
                  : "text-blue-400/60 hover:text-blue-300"
              }`}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div
          key={currentQuestion}
          className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
        >
          <div className="bg-gradient-to-b from-[var(--background-secondary)]/80 to-[var(--background-secondary)]/40 border border-[var(--border)] rounded-2xl p-5 sm:p-8 md:p-10 mb-6">
            <div className="flex items-start gap-3 sm:gap-4 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--gold)]/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[var(--gold)]/20">
                {question.icon}
              </div>
              <div className="flex-1 min-w-0">
                {/* Badge "Questão-Chave" para perguntas de alto peso */}
                {question.weight >= 1.5 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C5A059]/15 border border-[#C5A059]/40 rounded-full text-[10px] font-semibold text-[#C5A059] mb-3">
                    <Sparkles size={9} />
                    {tr("Questão-Chave", "Key Question", "Pregunta Clave")}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-[var(--foreground)] leading-tight">
                  {question.question}
                </h3>
                {question.description && (
                  <p className="text-sm text-[var(--foreground-muted)] mt-2">
                    {question.description}
                  </p>
                )}
              </div>
            </div>
            {/* Answer options — only rendered when user can use the tool */}
            {canUse && (
              <>
              <div className="space-y-2.5" role="list" aria-label={question.question}>
                {question.options.map((opt, idx) => (
                  <button
                    key={opt.value}
                    ref={(el) => { optionsRef.current[idx] = el; }}
                    onClick={() => onAnswer(opt)}
                    disabled={isPending}
                    className="w-full text-left p-5 bg-[var(--background-card)]/30 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/5 transition-all group hover:translate-x-1 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:border-[var(--border)] disabled:hover:bg-transparent"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors font-medium">
                          {opt.text}
                        </span>
                        {opt.description && (
                          <p className="text-sm text-[var(--foreground-muted)] mt-1 leading-relaxed">
                            {opt.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="text-[var(--foreground-muted)] group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                    </div>
                  </button>
                ))}
              </div>
              {/* Skip / Don't know button */}
              <div className="flex justify-center mt-3">
                <button
                  onClick={onSkip}
                  disabled={isPending}
                  className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-colors px-4 py-2 min-h-[44px] rounded-lg hover:bg-[var(--background-secondary)]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tr("Não sei / Passar", "Not sure / Skip", "No sé / Pasar")}
                </button>
              </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between">
            {currentQuestion > 0 ? (
              <button
                onClick={onBack}
                disabled={isPending}
                className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors px-3 py-2.5 min-h-[44px] rounded-lg hover:bg-[var(--background-secondary)]/50"
              >
                <ChevronLeft size={18} />
                {t.analise_perfil.previous}
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleReset}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] text-sm px-3 py-2.5 min-h-[44px] rounded-lg hover:bg-[var(--background-secondary)]/50 transition-all"
            >
              {t.analise_perfil.restart}
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
});

export default QuizSection;
