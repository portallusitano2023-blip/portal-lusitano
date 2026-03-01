"use client";

import { Percent, BarChart3, Activity } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { results } from "@/components/analise-perfil/data/results";
import Tooltip from "@/components/tools/Tooltip";
import type { Result, AnswerDetail, ScorePercentage } from "@/components/analise-perfil/types";

interface AnalysisTabProps {
  result: Result;
  answerDetails: AnswerDetail[];
  scorePercentages: ScorePercentage[];
  confidence: number;
}

const PROFILE_COLORS: Record<string, string> = {
  competidor: "bg-amber-500",
  tradicional: "bg-emerald-500",
  criador: "bg-purple-500",
  amador: "bg-rose-500",
};

export default function AnalysisTab({
  result,
  answerDetails,
  scorePercentages,
  confidence,
}: AnalysisTabProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  return (
    <div key="analise" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="bg-gradient-to-b from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/20 p-8">
        <h3 className="flex items-center gap-2 text-xl font-serif text-[var(--foreground)] mb-6">
          <Percent className="text-[var(--gold)]" size={24} />
          {t.analise_perfil.confidence_index}
          <Tooltip
            text={
              (t.analise_perfil as Record<string, string>).tooltip_confidence ??
              tr(
                "Indica quão completas e consistentes são as suas respostas. Valores altos indicam um perfil bem definido.",
                "Indicates how complete and consistent your answers are. High values indicate a well-defined profile.",
                "Indica cuán completas y consistentes son sus respuestas. Valores altos indican un perfil bien definido."
              )
            }
          />
        </h3>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-[var(--gold)] relative">
            <span className="text-4xl font-bold text-[var(--foreground)]">{confidence}%</span>
          </div>
          <p className="text-[var(--foreground-secondary)] mt-4 max-w-md mx-auto text-sm">
            {t.analise_perfil.confidence_desc}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[var(--background-secondary)]/50 p-4 border border-[var(--border)]">
            <p className="text-2xl font-bold text-[var(--foreground)]">{answerDetails.length}</p>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.analise_perfil.questions_label}
            </p>
          </div>
          <div className="bg-[var(--background-secondary)]/50 p-4 border border-[var(--border)]">
            <p className="text-2xl font-bold text-[var(--gold)]">
              {scorePercentages[0]?.percentage || 0}%
            </p>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.analise_perfil.main_profile}
            </p>
          </div>
          <div className="bg-[var(--background-secondary)]/50 p-4 border border-[var(--border)]">
            <p className="text-2xl font-bold text-[var(--foreground-secondary)]">
              {scorePercentages[1]?.percentage || 0}%
            </p>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.analise_perfil.secondary_profile_label}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <BarChart3 className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.question_analysis}
        </h3>
        <div className="space-y-4">
          {answerDetails.map((detail, i) => {
            const maxProfile = Object.entries(detail.points).reduce(
              (a, b) => (b[1] > a[1] ? b : a),
              ["", 0]
            );
            return (
              <div
                key={i}
                className="bg-[var(--background-card)]/30 border border-[var(--border)] p-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-[var(--foreground-muted)] mb-1">
                      {t.analise_perfil.question_prefix} {detail.questionId}
                    </p>
                    <p className="text-[var(--foreground)] text-sm font-medium">
                      {detail.answerText}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 text-xs font-medium text-white rounded ${PROFILE_COLORS[maxProfile[0] as string] || "bg-zinc-600"}`}
                  >
                    {(maxProfile[0] as string).charAt(0).toUpperCase() +
                      (maxProfile[0] as string).slice(1)}
                  </div>
                </div>
                <div className="flex gap-1 h-2">
                  {Object.entries(detail.points).map(([profile, pts]) => (
                    <div
                      key={profile}
                      className={PROFILE_COLORS[profile]}
                      style={{ width: `${(pts / 10) * 100}%`, opacity: pts / 10 }}
                      title={`${profile}: ${pts}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <Activity className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.other_profiles_comparison}
        </h3>
        <div className="space-y-6">
          {Object.entries(results)
            .filter(([k]) => k !== result.profile)
            .map(([key, r]) => (
              <div
                key={key}
                className="bg-[var(--background-card)]/30 border border-[var(--border)] p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--surface-hover)] rounded-full flex items-center justify-center">
                    {r.icon}
                  </div>
                  <div>
                    <h4 className="text-[var(--foreground)] font-medium">{r.title}</h4>
                    <p className="text-xs text-[var(--foreground-muted)]">{r.subtitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--foreground-muted)]">
                      {t.analise_perfil.costs_label}
                    </span>{" "}
                    <span className="text-[var(--foreground-secondary)]">
                      {r.annualCosts.min.toLocaleString()}-{r.annualCosts.max.toLocaleString()}/
                      {tr("ano", "year", "año")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">
                      {t.analise_perfil.price_label}
                    </span>{" "}
                    <span className="text-[var(--foreground-secondary)]">
                      {r.idealHorse.priceRange}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
