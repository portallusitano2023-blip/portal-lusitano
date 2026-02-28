"use client";

import { useMemo } from "react";
import { Check, Crown, Heart, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import Tooltip from "@/components/tools/Tooltip";
import type { StepProps } from "./types";

const COAT_IMPACT: Record<string, { label: string; type: "pos" | "neg" | "base" }> = {
  Ruço: { label: "+8%", type: "pos" },
  Castanho: { label: "base", type: "base" },
  Preto: { label: "+6%", type: "pos" },
  Baio: { label: "base", type: "base" },
  Tordilho: { label: "base", type: "base" },
  Isabela: { label: "+4%", type: "pos" },
  Palomino: { label: "+5%", type: "pos" },
};

export default function StepIdentificacao({ form, update }: StepProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const pelagens = useMemo(
    () => [
      { value: "Ruço", label: t.calculadora.coat_ruco, desc: t.calculadora.coat_ruco_desc },
      {
        value: "Castanho",
        label: t.calculadora.coat_castanho,
        desc: t.calculadora.coat_castanho_desc,
      },
      { value: "Preto", label: t.calculadora.coat_preto, desc: t.calculadora.coat_preto_desc },
      { value: "Baio", label: t.calculadora.coat_baio, desc: t.calculadora.coat_baio_desc },
      {
        value: "Tordilho",
        label: t.calculadora.coat_tordilho,
        desc: t.calculadora.coat_tordilho_desc,
      },
      {
        value: "Isabela",
        label: t.calculadora.coat_isabela,
        desc: t.calculadora.coat_isabela_desc,
      },
      {
        value: "Palomino",
        label: t.calculadora.coat_palomino,
        desc: t.calculadora.coat_palomino_desc,
      },
    ],
    [t]
  );

  const sexOptions = useMemo(
    () => [
      { value: "garanhao", label: t.calculadora.sex_stallion, icon: Crown },
      { value: "egua", label: t.calculadora.sex_mare, icon: Heart },
      { value: "castrado", label: t.calculadora.sex_gelding, icon: Shield },
    ],
    [t]
  );

  const bookOptions = useMemo(
    () => [
      { value: "definitivo", label: t.calculadora.book_definitive },
      { value: "provisorio", label: t.calculadora.book_provisional },
      { value: "auxiliar", label: t.calculadora.book_auxiliary },
    ],
    [t]
  );

  return (
    <section className="space-y-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium rounded-full mb-3">
          <Shield size={12} />
          {t.calculadora.step1_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif">{t.calculadora.step1_title}</h2>
        <p className="text-[var(--foreground-muted)] text-sm mt-2">{t.calculadora.step1_desc}</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
            {t.calculadora.label_horse_name}{" "}
            <span className="text-[var(--foreground-muted)]">{t.calculadora.label_optional}</span>
          </label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => update("nome", e.target.value)}
            placeholder={tr(
              "Ex: Ícaro III, Novilheiro, Opus",
              "E.g.: Ícaro III, Novilheiro, Opus",
              "Ej: Ícaro III, Novilheiro, Opus"
            )}
            className="w-full bg-transparent border-b border-[var(--border)] py-3 text-lg focus:border-[var(--gold)] outline-none transition-colors placeholder:text-[var(--foreground-muted)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.calculadora.label_age}
            </label>
            <div className="relative">
              <input
                type="number"
                value={form.idade}
                onChange={(e) => update("idade", Math.max(0, Math.min(30, Number(e.target.value))))}
                min={0}
                max={30}
                className="w-full bg-transparent border-b border-[var(--border)] py-3 text-lg focus:border-[var(--gold)] outline-none transition-colors"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] text-sm">
                {t.calculadora.label_years}
              </span>
            </div>
            <span className="text-xs text-[var(--foreground-muted)] mt-1 block">
              {t.calculadora.label_ideal_age}
            </span>
          </div>

          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.calculadora.label_height}
            </label>
            <div className="relative">
              <input
                type="number"
                value={form.altura}
                onChange={(e) => update("altura", Number(e.target.value))}
                min={140}
                max={180}
                className="w-full bg-transparent border-b border-[var(--border)] py-3 text-lg focus:border-[var(--gold)] outline-none transition-colors"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] text-sm">
                {t.calculadora.label_cm}
              </span>
            </div>
            <span
              className={`text-xs mt-1 block font-medium ${
                form.altura >= 155 && form.altura <= 170
                  ? "text-emerald-400"
                  : form.altura >= 150 && form.altura <= 175
                    ? "text-amber-400"
                    : "text-red-400"
              }`}
            >
              {form.altura >= 155 && form.altura <= 170
                ? tr(
                    "Dentro do padrão APSL (155–170cm)",
                    "Within APSL standard (155–170cm)",
                    "Dentro del estándar APSL (155–170cm)"
                  )
                : form.altura >= 150 && form.altura <= 175
                  ? tr(
                      "Ligeiramente fora do padrão ideal",
                      "Slightly outside ideal standard",
                      "Ligeramente fuera del estándar ideal"
                    )
                  : tr(
                      "Fora do padrão ideal APSL",
                      "Outside APSL ideal standard",
                      "Fuera del estándar ideal APSL"
                    )}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_sex}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sexOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("sexo", opt.value as typeof form.sexo)}
                className={`py-3 px-2 sm:px-4 rounded-lg border text-xs sm:text-sm font-medium transition-all flex flex-col items-center gap-1 min-h-[44px] ${
                  form.sexo === opt.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                }`}
              >
                <opt.icon size={18} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_coat}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {pelagens.map((p) => (
              <button
                key={p.value}
                onClick={() => update("pelagem", p.value)}
                className={`py-3 px-4 rounded-lg border text-left transition-all ${
                  form.pelagem === p.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-sm font-medium ${form.pelagem === p.value ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
                  >
                    {p.label}
                  </span>
                  {COAT_IMPACT[p.value] && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                        COAT_IMPACT[p.value].type === "pos"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {COAT_IMPACT[p.value].label}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[var(--foreground-muted)]">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--background-secondary)]">
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.calculadora.label_apsl_reg}
            </label>
            <Tooltip
              text={tr(
                "Cavalo com registo oficial na Associação Portuguesa de Criadores do Cavalo Puro Sangue Lusitano. Aumenta o valor e a credibilidade do cavalo no mercado nacional e internacional.",
                "Horse with official registration at APSL (Portuguese Lusitano Breeders Association). Increases value and credibility in national and international markets.",
                "Caballo con registro oficial en la Asociación Portuguesa de Criadores del Caballo Puro Sangre Lusitano. Aumenta el valor y la credibilidad en el mercado nacional e internacional."
              )}
              position="top"
            />
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
              +20%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => update("registoAPSL", true)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                form.registoAPSL
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
              }`}
            >
              {form.registoAPSL && <Check size={16} />}
              {t.calculadora.btn_registered}
            </button>
            <button
              onClick={() => update("registoAPSL", false)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                !form.registoAPSL
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
              }`}
            >
              {t.calculadora.btn_no_reg}
            </button>
          </div>

          {form.registoAPSL && (
            <div className="mt-4 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
              <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
                {t.calculadora.label_book_type}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bookOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("livroAPSL", opt.value as typeof form.livroAPSL)}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all min-h-[44px] ${
                      form.livroAPSL === opt.value
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                        : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
