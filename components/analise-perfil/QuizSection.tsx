"use client";

import { forwardRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
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
  },
  ref
) {
  const { t } = useLanguage();
  const progress = ((currentQuestion + 1) / questions.length) * 100;
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
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-2">
            {question.category}
          </span>
          <h2 className="text-2xl font-serif text-[var(--foreground)]">
            {t.analise_perfil.quiz_title}
          </h2>
        </div>
        <div className="mb-10">
          <div className="flex justify-between text-sm text-[var(--foreground-muted)] mb-3">
            <span>
              {t.analise_perfil.question_of
                .replace("{current}", String(currentQuestion + 1))
                .replace("{total}", String(questions.length))}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-[var(--background-card)]/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i < currentQuestion ? "bg-[var(--gold)]" : i === currentQuestion ? "bg-[var(--gold)]/50 ring-2 ring-[var(--gold)]/30" : "bg-[var(--background-card)]"}`}
              />
            ))}
          </div>
        </div>

        <div key={currentQuestion} className="animate-[fadeSlideIn_0.3s_ease-out_forwards]">
          <div className="bg-gradient-to-b from-[var(--background-secondary)]/80 to-[var(--background-secondary)]/40 border border-[var(--border)] p-8 md:p-10 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                {question.icon}
              </div>
              <div>
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
                <Paywall toolName={t.analise_perfil.title_line1} requiresAuth={requiresAuth} />
              </div>
            ) : (
              <div className="space-y-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={opt.value}
                    onClick={() => onAnswer(opt)}
                    className="w-full text-left p-5 bg-[var(--background-card)]/30 border border-[var(--border)] hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/5 transition-all group hover:translate-x-1 transition-transform opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors font-medium">
                          {opt.text}
                        </span>
                        {opt.description && (
                          <p className="text-sm text-[var(--foreground-muted)] mt-1">
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
                className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <ChevronLeft size={18} />
                {t.analise_perfil.previous}
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={onReset}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] text-sm"
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
