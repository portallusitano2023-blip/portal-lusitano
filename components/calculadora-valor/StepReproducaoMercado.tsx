"use client";

import { useMemo } from "react";
import { Star, Check, GitBranch, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MERCADOS } from "./data";
import type { FormData, StepProps } from "./types";

export default function StepReproducaoMercado({ form, update }: StepProps) {
  const { t } = useLanguage();

  const trendOptions = useMemo(
    () => [
      { value: "alta", label: t.calculadora.trend_up, icon: TrendingUp, desc: "+12%" },
      { value: "estavel", label: t.calculadora.trend_stable, icon: Activity, desc: "\u00B10%" },
      { value: "baixa", label: t.calculadora.trend_down, icon: TrendingDown, desc: "-12%" },
    ],
    [t]
  );

  return (
    <section className="space-y-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium rounded-full mb-3">
          <Star size={12} />
          {t.calculadora.step5_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif">{t.calculadora.step5_title}</h2>
        <p className="text-[var(--foreground-muted)] text-sm mt-2">{t.calculadora.step5_desc}</p>
      </div>

      <div className="space-y-6">
        {form.sexo !== "castrado" && (
          <div className="p-5 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="text-[var(--gold)]" size={20} />
              <h3 className="text-sm font-medium text-[var(--foreground-secondary)]">
                {t.calculadora.repro_value}
              </h3>
            </div>

            <button
              onClick={() => update("reproducao", !form.reproducao)}
              className={`w-full py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 mb-4 ${
                form.reproducao
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
              }`}
            >
              {form.reproducao && <Check size={16} />}
              {form.sexo === "garanhao"
                ? t.calculadora.approved_stallion
                : t.calculadora.approved_mare}
            </button>

            {form.reproducao && (
              <div className="grid grid-cols-2 gap-4 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-2">
                    {t.calculadora.label_registered_offspring}
                  </label>
                  <input
                    type="number"
                    value={form.descendentes}
                    onChange={(e) => update("descendentes", Math.max(0, Number(e.target.value)))}
                    min={0}
                    className="w-full bg-transparent border border-[var(--border)] rounded-lg py-2 px-3 focus:border-[var(--gold)] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-2">
                    {t.calculadora.label_approved_offspring}
                  </label>
                  <input
                    type="number"
                    value={form.descendentesAprovados}
                    onChange={(e) =>
                      update("descendentesAprovados", Math.max(0, Number(e.target.value)))
                    }
                    min={0}
                    className="w-full bg-transparent border border-[var(--border)] rounded-lg py-2 px-3 focus:border-[var(--gold)] outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_target_market}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {MERCADOS.map((m) => (
              <button
                key={m.value}
                onClick={() => update("mercado", m.value)}
                className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                  form.mercado === m.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">
            {t.calculadora.market_influence}
          </p>
        </div>

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_market_trend}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {trendOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("tendencia", opt.value as FormData["tendencia"])}
                className={`py-4 px-4 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                  form.tendencia === opt.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                }`}
              >
                <opt.icon size={20} />
                <span>{opt.label}</span>
                <span className="text-xs text-[var(--foreground-muted)]">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
