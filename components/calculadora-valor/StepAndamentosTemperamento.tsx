"use client";

import { useMemo } from "react";
import { Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { FormData, StepProps } from "./types";

export default function StepAndamentosTemperamento({ form, update }: StepProps) {
  const { t } = useLanguage();

  const gaitItems = useMemo(
    () => [
      {
        key: "andamentos",
        label: t.calculadora.gait_general,
        desc: t.calculadora.gait_general_desc,
      },
      {
        key: "elevacao",
        label: t.calculadora.gait_elevation,
        desc: t.calculadora.gait_elevation_desc,
      },
      {
        key: "suspensao",
        label: t.calculadora.gait_suspension,
        desc: t.calculadora.gait_suspension_desc,
      },
      {
        key: "regularidade",
        label: t.calculadora.gait_regularity,
        desc: t.calculadora.gait_regularity_desc,
      },
    ],
    [t]
  );

  const temperamentItems = useMemo(
    () => [
      {
        key: "temperamento",
        label: t.calculadora.temp_balance,
        desc: t.calculadora.temp_balance_desc,
      },
      {
        key: "sensibilidade",
        label: t.calculadora.temp_sensitivity,
        desc: t.calculadora.temp_sensitivity_desc,
      },
      {
        key: "vontadeTrabalho",
        label: t.calculadora.temp_willingness,
        desc: t.calculadora.temp_willingness_desc,
      },
    ],
    [t]
  );

  return (
    <section className="space-y-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium rounded-full mb-3">
          <Zap size={12} />
          {t.calculadora.step3_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif">{t.calculadora.step3_title}</h2>
        <p className="text-[var(--foreground-muted)] text-sm mt-2">{t.calculadora.step3_desc}</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--foreground-secondary)]">
              {t.calculadora.gait_quality}
            </h3>
            <span className="text-xs text-[var(--foreground-muted)]">
              {t.calculadora.gait_functional}
            </span>
          </div>

          {gaitItems.map((item) => (
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

        <div className="pt-4 border-t border-[var(--background-secondary)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--foreground-secondary)]">
              {t.calculadora.temperament_title}
            </h3>
            <span className="text-xs text-[var(--foreground-muted)]">
              {t.calculadora.temperament_attitude}
            </span>
          </div>

          {temperamentItems.map((item) => (
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
