"use client";

import Link from "next/link";
import { Compass, Briefcase, ChevronRight, BarChart3, Heart, Calculator, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import ToolCrossCTA from "@/components/tools/ToolCrossCTA";
import type { Result } from "@/components/analise-perfil/types";

const PROFILE_CONTEXT_KEY = "tool_context_profile";

interface NextStepsTabProps {
  result: Result;
  subProfile?: string | null;
}

export default function NextStepsTab({ result, subProfile }: NextStepsTabProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const ap = t.analise_perfil as Record<string, string>;

  const pushProfileContext = () => {
    try {
      sessionStorage.setItem(
        PROFILE_CONTEXT_KEY,
        JSON.stringify({
          source: "analise_perfil",
          profile: result.profile,
          subProfile: subProfile ?? null,
          priceRange: result.idealHorse.priceRange,
          training: result.idealHorse.training,
        })
      );
    } catch {}
  };

  return (
    <div key="proximos" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] rounded-2xl p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <Compass className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.recommended_next_steps}
        </h3>
        <div className="space-y-3">
          {result.nextSteps.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-[var(--background-card)]/30 border border-[var(--border)] rounded-xl opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards] hover:border-[var(--gold)]/25 transition-colors"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--gold)] to-[#B8956F] text-black rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-sm shadow-[var(--gold)]/20">
                {i + 1}
              </div>
              <p className="text-[var(--foreground-secondary)] pt-1 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ferramentas Recomendadas */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] rounded-2xl p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-2">
          <Briefcase className="text-[var(--gold)]" size={20} />
          {ap.next_tools_title ??
            tr("Ferramentas Recomendadas", "Recommended Tools", "Herramientas Recomendadas")}
        </h3>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          {subProfile
            ? `${ap.next_tools_subtitle_with_profile ?? tr("Usa as ferramentas certas para o teu perfil de", "Use the right tools for your profile of", "Usa las herramientas correctas para tu perfil de")} ${subProfile.replace(/_/g, " ")}.`
            : `${ap.next_tools_subtitle ?? tr("Usa as ferramentas certas para o teu perfil", "Use the right tools for your profile", "Usa las herramientas correctas para tu perfil")}.`}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Calculadora de Valor */}
          <Link
            href={`/calculadora-valor?perfil=${result.profile}`}
            onClick={pushProfileContext}
            className="group flex items-start gap-4 p-4 bg-[var(--background-card)]/30 border border-[var(--border)] hover:border-[var(--gold)]/50 transition-all rounded-xl"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/15 flex items-center justify-center shrink-0 group-hover:bg-[var(--gold)]/25 transition-colors">
              <Calculator size={18} className="text-[var(--gold)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] mb-0.5">
                {ap.next_calc_title ??
                  tr(
                    "Calcular Valor de um Cavalo",
                    "Calculate Horse Value",
                    "Calcular Valor de un Caballo"
                  )}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] leading-snug">
                {ap.next_calc_desc ??
                  tr(
                    "Avalia se o preço de um cavalo corresponde ao seu perfil ideal — orçamento",
                    "Evaluates whether a horse's price matches your ideal profile — budget",
                    "Evalúa si el precio de un caballo corresponde a tu perfil ideal — presupuesto"
                  )}{" "}
                {result.idealHorse.priceRange}.
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-[var(--foreground-muted)] group-hover:text-[var(--gold)] shrink-0 mt-0.5 transition-colors"
            />
          </Link>

          {/* Comparador de Cavalos */}
          <button
            onClick={() => {
              pushProfileContext();
              window.location.href = "/comparador-cavalos";
            }}
            className="group flex items-start gap-4 p-4 bg-[var(--background-card)]/30 border border-[var(--border)] hover:border-blue-500/50 transition-all rounded-xl text-left w-full"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 transition-colors">
              <BarChart3 size={18} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] mb-0.5">
                {ap.next_compare_title ??
                  tr(
                    "Comparar Cavalos Candidatos",
                    "Compare Candidate Horses",
                    "Comparar Caballos Candidatos"
                  )}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] leading-snug">
                {ap.next_compare_desc ??
                  tr(
                    "Compara lado a lado os cavalos que estás a considerar para o teu perfil.",
                    "Compare side by side the horses you're considering for your profile.",
                    "Compara lado a lado los caballos que estás considerando para tu perfil."
                  )}
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-[var(--foreground-muted)] group-hover:text-blue-400 shrink-0 mt-0.5 transition-colors"
            />
          </button>

          {/* Verificador (só para criador) */}
          {result.profile === "criador" && (
            <Link
              href="/verificador-compatibilidade"
              onClick={pushProfileContext}
              className="group flex items-start gap-4 p-4 bg-[var(--background-card)]/30 border border-[var(--border)] hover:border-pink-500/50 transition-all rounded-xl sm:col-span-2"
            >
              <div className="w-10 h-10 rounded-lg bg-pink-500/15 flex items-center justify-center shrink-0 group-hover:bg-pink-500/25 transition-colors">
                <Heart size={18} className="text-pink-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] mb-0.5">
                  {ap.next_verify_title ??
                    tr(
                      "Verificar Compatibilidade para Reprodução",
                      "Check Breeding Compatibility",
                      "Verificar Compatibilidad para Reproducción"
                    )}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] leading-snug">
                  {ap.next_verify_desc ??
                    tr(
                      "O teu perfil de Criador beneficia da análise genética e compatibilidade de reprodução entre garanhão e égua.",
                      "Your Breeder profile benefits from genetic analysis and breeding compatibility between stallion and mare.",
                      "Tu perfil de Criador se beneficia del análisis genético y compatibilidad de reproducción entre semental y yegua."
                    )}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-[var(--foreground-muted)] group-hover:text-pink-400 shrink-0 mt-0.5 transition-colors"
              />
            </Link>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[var(--gold)]/15 to-transparent border border-[var(--gold)]/30 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-serif text-[var(--foreground)] mb-4">
          {t.analise_perfil.ready_title}
        </h3>
        <p className="text-[var(--foreground-secondary)] mb-8 max-w-md mx-auto">
          {t.analise_perfil.ready_desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/directorio"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black px-8 py-4 font-bold uppercase tracking-wider text-sm rounded-xl hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all shadow-md shadow-[var(--gold)]/20 hover:shadow-[var(--gold)]/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Briefcase size={18} />
            {t.analise_perfil.explore_studs}
          </Link>
          <Link
            href={`/calculadora-valor?perfil=${result.profile}&min=${result.idealHorse.priceRange.split(" ")[0].replace(".", "").replace(",", "")}`}
            onClick={pushProfileContext}
            className="inline-flex items-center justify-center gap-2 border border-[var(--gold)] text-[var(--gold)] px-8 py-4 font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[var(--gold)]/10 transition-all"
          >
            {t.analise_perfil.value_calculator}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <ToolCrossCTA
        currentTool="analise-perfil"
        chainPayload={{
          key: PROFILE_CONTEXT_KEY,
          data: {
            source: "analise_perfil",
            profile: result.profile,
            subProfile: subProfile ?? null,
          },
        }}
      />

      {/* Revisão Recomendada */}
      <div className="mt-4 p-3 bg-[var(--background-card)]/40 rounded-lg border border-[var(--border)]/40 flex items-start gap-2">
        <Info size={13} className="text-[var(--foreground-muted)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          <strong className="text-[var(--foreground-secondary)]">
            {ap.next_review_label ??
              tr("Revisão recomendada:", "Recommended review:", "Revisión recomendada:")}
          </strong>{" "}
          {ap.next_review_text ??
            tr(
              "Os perfis equestres evoluem com a experiência. Refaça esta análise em 6-12 meses para acompanhar o seu desenvolvimento.",
              "Equestrian profiles evolve with experience. Redo this analysis in 6-12 months to track your development.",
              "Los perfiles ecuestres evolucionan con la experiencia. Rehaga este análisis en 6-12 meses para seguir su desarrollo."
            )}
        </p>
      </div>
    </div>
  );
}
