"use client";

import { forwardRef } from "react";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
import Paywall from "@/components/tools/Paywall";
import type { Question, QuestionOption } from "@/components/analise-perfil/types";

interface QuizSectionProps {
  questions: Question[];
  currentQuestion: number;
  canUse: boolean;
  isSubscribed: boolean;
  freeUsesLeft: number;
  requiresAuth: boolean;
  accessLoading: boolean;
  onAnswer: (option: QuestionOption) => void;
  onBack: () => void;
  onReset: () => void;
  dominantProfile: string | null;
  dominantProfileLabel: string;
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
    onAnswer,
    onBack,
    onReset,
    dominantProfile,
    dominantProfileLabel,
  },
  ref
) {
  const { t } = useLanguage();
  const progressCompleted = Math.round((currentQuestion / questions.length) * 100);
  const question = questions[currentQuestion];

  return (
    <div
      key="quiz"
      ref={ref}
      className="min-h-screen pt-24 pb-20 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
    >
      <div className="max-w-3xl mx-auto px-6">
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

        {/* Barra de progresso rica */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--foreground-muted)]">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-xs font-medium text-[#C5A059]">
              {progressCompleted}% concluído
            </span>
          </div>
          <div className="h-1.5 bg-[var(--background-card)]/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C5A059]/70 to-[#C5A059] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.round((currentQuestion / questions.length) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
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
                ~{Math.ceil(((questions.length - currentQuestion - 1) * 20) / 60)} min restantes
              </span>
            )}
          </div>
          {question?.category && (
            <p className="text-[10px] text-[var(--foreground-muted)] mt-1.5 text-center">
              Categoria: <span className="text-[#C5A059]/80">{question.category}</span>
            </p>
          )}
        </div>

        {/* Preview do perfil (a partir de metade do quiz) */}
        {currentQuestion >= Math.floor(questions.length / 2) && dominantProfile && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-[var(--background-secondary)]/40 rounded-lg border border-[var(--border)]/50">
            <Sparkles size={12} className="text-[#C5A059] shrink-0" />
            <p className="text-xs text-[var(--foreground-muted)]">
              Com base nas suas respostas, o seu perfil indica:{" "}
              <span className="text-[var(--foreground)] font-semibold">{dominantProfileLabel}</span>
            </p>
          </div>
        )}

        <div
          key={currentQuestion}
          className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
        >
          <div className="bg-gradient-to-b from-[var(--background-secondary)]/80 to-[var(--background-secondary)]/40 border border-[var(--border)] rounded-2xl p-8 md:p-10 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[var(--gold)]/20">
                {question.icon}
              </div>
              <div className="flex-1">
                {/* Badge "Questão-Chave" para perguntas de alto peso */}
                {question.weight >= 1.5 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C5A059]/15 border border-[#C5A059]/40 rounded-full text-[10px] font-semibold text-[#C5A059] mb-3">
                    <Sparkles size={9} />
                    Questão-Chave
                  </span>
                )}
                <h3 className="text-xl md:text-2xl font-serif text-[var(--foreground)] leading-tight">
                  {question.question}
                </h3>
                {question.description && (
                  <p className="text-sm text-[var(--foreground-muted)] mt-2">
                    {question.description}
                  </p>
                )}
              </div>
            </div>
            {!canUse ? (
              <div className="mt-4">
                <Paywall
                  toolName={t.analise_perfil.title_line1}
                  requiresAuth={requiresAuth}
                  proFeatures={[
                    "Análise completa com 14 perguntas e 4 perfis",
                    "Sub-perfil especializado (Elite FEI, Trabalho, etc.)",
                    "Percentagem de confiança no resultado",
                    "Guia de cavalos recomendados por perfil",
                    "Plano de custos e timeline personalizada",
                  ]}
                />
              </div>
            ) : (
              <div className="space-y-2.5">
                {question.options.map((opt, idx) => (
                  <button
                    key={opt.value}
                    onClick={() => onAnswer(opt)}
                    className="w-full text-left p-5 bg-[var(--background-card)]/30 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/5 transition-all group hover:translate-x-1 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
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
            )}
          </div>
          <div className="flex items-center justify-between">
            {currentQuestion > 0 ? (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--background-secondary)]/50"
              >
                <ChevronLeft size={18} />
                {t.analise_perfil.previous}
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={onReset}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] text-sm px-3 py-1.5 rounded-lg hover:bg-[var(--background-secondary)]/50 transition-all"
            >
              {t.analise_perfil.restart}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default QuizSection;
