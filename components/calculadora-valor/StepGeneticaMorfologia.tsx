"use client";

import { useMemo } from "react";
import { Dna } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Tooltip from "@/components/tools/Tooltip";
import { LINHAGENS_FAMOSAS } from "./data";
import type { FormData, StepProps } from "./types";

export default function StepGeneticaMorfologia({ form, update }: StepProps) {
  const { t } = useLanguage();

  const lineageOptions = useMemo(
    () => [
      {
        value: "desconhecida",
        label: t.calculadora.lineage_unknown,
        desc: t.calculadora.lineage_unknown_desc,
      },
      {
        value: "comum",
        label: t.calculadora.lineage_common,
        desc: t.calculadora.lineage_common_desc,
      },
      {
        value: "registada",
        label: t.calculadora.lineage_registered,
        desc: t.calculadora.lineage_registered_desc,
      },
      {
        value: "certificada",
        label: t.calculadora.lineage_certified,
        desc: t.calculadora.lineage_certified_desc,
      },
      {
        value: "premium",
        label: t.calculadora.lineage_premium,
        desc: t.calculadora.lineage_premium_desc,
      },
      {
        value: "elite",
        label: t.calculadora.lineage_elite,
        desc: t.calculadora.lineage_elite_desc,
      },
    ],
    [t]
  );

  const morphologyItems = useMemo(
    () => [
      {
        key: "morfologia",
        label: t.calculadora.morph_general,
        desc: t.calculadora.morph_general_desc,
      },
      { key: "cabeca", label: t.calculadora.morph_head, desc: t.calculadora.morph_head_desc },
      {
        key: "espádua",
        label: t.calculadora.morph_shoulder,
        desc: t.calculadora.morph_shoulder_desc,
      },
      { key: "garupa", label: t.calculadora.morph_croup, desc: t.calculadora.morph_croup_desc },
      { key: "membros", label: t.calculadora.morph_limbs, desc: t.calculadora.morph_limbs_desc },
    ],
    [t]
  );

  return (
    <section className="space-y-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium rounded-full mb-3">
          <Dna size={12} />
          {t.calculadora.step2_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif">{t.calculadora.step2_title}</h2>
        <p className="text-[var(--foreground-muted)] text-sm mt-2">{t.calculadora.step2_desc}</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.calculadora.label_lineage_quality}
            </label>
            <Tooltip
              text="Família de criação do cavalo. As principais linhagens lusitanas são: Veiga, Andrade, Alter Real, Coudelaria Nacional e Interagro. Uma linhagem certificada ou premium aumenta significativamente o valor de mercado."
              position="bottom"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {lineageOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("linhagem", opt.value as FormData["linhagem"])}
                className={`py-3 px-3 rounded-lg border text-left transition-all ${
                  form.linhagem === opt.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <span
                  className={`block text-sm font-medium ${form.linhagem === opt.value ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
                >
                  {opt.label}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {(form.linhagem === "premium" || form.linhagem === "elite") && (
          <div className="animate-[fadeSlideIn_0.3s_ease-out_forwards]">
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              {t.calculadora.label_main_lineage}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LINHAGENS_FAMOSAS.map((lin) => (
                <button
                  key={lin.value}
                  onClick={() => update("linhagemPrincipal", lin.value)}
                  className={`py-3 px-4 rounded-lg border text-left transition-all ${
                    form.linhagemPrincipal === lin.value
                      ? "border-[var(--gold)] bg-[var(--gold)]/10"
                      : "border-[var(--border)] hover:border-[var(--border)]"
                  }`}
                >
                  <span
                    className={`block text-sm font-medium ${form.linhagemPrincipal === lin.value ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
                  >
                    {lin.label}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">{lin.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--background-secondary)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--foreground-secondary)]">
              {t.calculadora.morph_title}
            </h3>
            <span className="text-xs text-[var(--foreground-muted)]">
              {t.calculadora.morph_apsl_standards}
            </span>
          </div>

          {morphologyItems.map((item) => (
            <div key={item.key} className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <label className="text-sm text-[var(--foreground-secondary)]">{item.label}</label>
                  <span className="text-xs text-[var(--foreground-muted)] ml-2">{item.desc}</span>
                </div>
                <span className="text-[var(--gold)] font-medium text-lg">
                  {form[item.key as keyof FormData] as number}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={form[item.key as keyof FormData] as number}
                onChange={(e) =>
                  update(item.key as keyof FormData, Number(e.target.value) as never)
                }
                className="w-full h-2 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer accent-[var(--gold)]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
