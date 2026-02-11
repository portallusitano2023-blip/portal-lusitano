"use client";

import { Percent, BarChart3, Activity } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { results } from "@/components/analise-perfil/data/results";
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
  const { t } = useLanguage();

  return (
    <div key="analise" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Confidence Index */}
      <div className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 p-8">
        <h3 className="flex items-center gap-2 text-xl font-serif text-white mb-6">
          <Percent className="text-[#C5A059]" size={24} />
          {t.analise_perfil.confidence_index}
        </h3>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-[#C5A059] relative">
            <span className="text-4xl font-bold text-white">{confidence}%</span>
          </div>
          <p className="text-zinc-400 mt-4 max-w-md mx-auto text-sm">
            {t.analise_perfil.confidence_desc}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-zinc-900/50 p-4 border border-white/5">
            <p className="text-2xl font-bold text-white">{answerDetails.length}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              {t.analise_perfil.questions_label}
            </p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-white/5">
            <p className="text-2xl font-bold text-[#C5A059]">
              {scorePercentages[0]?.percentage || 0}%
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              {t.analise_perfil.main_profile}
            </p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-white/5">
            <p className="text-2xl font-bold text-zinc-400">
              {scorePercentages[1]?.percentage || 0}%
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              {t.analise_perfil.secondary_profile_label}
            </p>
          </div>
        </div>
      </div>
      {/* Breakdown by Question */}
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <BarChart3 className="text-[#C5A059]" size={20} />
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
                className="bg-zinc-800/30 border border-white/5 p-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-zinc-500 mb-1">
                      {t.analise_perfil.question_prefix} {detail.questionId}
                    </p>
                    <p className="text-white text-sm font-medium">{detail.answerText}</p>
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
      {/* Profile Comparison */}
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <Activity className="text-[#C5A059]" size={20} />
          {t.analise_perfil.other_profiles_comparison}
        </h3>
        <div className="space-y-6">
          {Object.entries(results)
            .filter(([k]) => k !== result.profile)
            .map(([key, r]) => (
              <div key={key} className="bg-zinc-800/30 border border-white/5 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-zinc-700/50 rounded-full flex items-center justify-center">
                    {r.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{r.title}</h4>
                    <p className="text-xs text-zinc-500">{r.subtitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500">{t.analise_perfil.costs_label}</span>{" "}
                    <span className="text-zinc-300">
                      {r.annualCosts.min.toLocaleString()}-{r.annualCosts.max.toLocaleString()}/ano
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">{t.analise_perfil.price_label}</span>{" "}
                    <span className="text-zinc-300">{r.idealHorse.priceRange}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
