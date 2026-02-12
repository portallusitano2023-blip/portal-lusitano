"use client";

import { useMemo } from "react";
import { Target, Check, Medal, Award, Globe, Crown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DISCIPLINAS } from "./data";
import type { FormData, StepProps } from "./types";

export default function StepTreinoSaude({ form, update }: StepProps) {
  const { t } = useLanguage();

  const trainingOptions = useMemo(
    () => [
      {
        value: "potro",
        label: t.calculadora.training_foal,
        desc: t.calculadora.training_foal_desc,
        price: "8.000\u20AC+",
      },
      {
        value: "desbravado",
        label: t.calculadora.training_broken,
        desc: t.calculadora.training_broken_desc,
        price: "15.000\u20AC+",
      },
      {
        value: "iniciado",
        label: t.calculadora.training_started,
        desc: t.calculadora.training_started_desc,
        price: "25.000\u20AC+",
      },
      {
        value: "elementar",
        label: t.calculadora.training_elementary,
        desc: t.calculadora.training_elementary_desc,
        price: "40.000\u20AC+",
      },
      {
        value: "medio",
        label: t.calculadora.training_medium,
        desc: t.calculadora.training_medium_desc,
        price: "65.000\u20AC+",
      },
      {
        value: "avancado",
        label: t.calculadora.training_advanced,
        desc: t.calculadora.training_advanced_desc,
        price: "100.000\u20AC+",
      },
      {
        value: "alta_escola",
        label: t.calculadora.training_haute_ecole,
        desc: t.calculadora.training_haute_ecole_desc,
        price: "150.000\u20AC+",
      },
      {
        value: "grand_prix",
        label: t.calculadora.training_gp,
        desc: t.calculadora.training_gp_desc,
        price: "250.000\u20AC+",
      },
    ],
    [t]
  );

  const competitionOptions = useMemo(
    () => [
      { value: "nenhuma", label: t.calculadora.comp_none, icon: null },
      { value: "regional", label: t.calculadora.comp_regional, icon: Medal },
      { value: "nacional", label: t.calculadora.comp_national, icon: Award },
      { value: "internacional", label: t.calculadora.comp_international, icon: Globe },
      { value: "campeonato_mundo", label: t.calculadora.comp_world_champ, icon: Crown },
    ],
    [t]
  );

  const healthOptions = useMemo(
    () => [
      {
        value: "excelente",
        label: t.calculadora.health_excellent,
        desc: t.calculadora.health_excellent_desc,
        color: "text-green-400",
      },
      {
        value: "muito_bom",
        label: t.calculadora.health_very_good,
        desc: t.calculadora.health_very_good_desc,
        color: "text-emerald-400",
      },
      {
        value: "bom",
        label: t.calculadora.health_good,
        desc: t.calculadora.health_good_desc,
        color: "text-yellow-400",
      },
      {
        value: "regular",
        label: t.calculadora.health_regular,
        desc: t.calculadora.health_regular_desc,
        color: "text-orange-400",
      },
    ],
    [t]
  );

  return (
    <section className="space-y-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium rounded-full mb-3">
          <Target size={12} />
          {t.calculadora.step4_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif">{t.calculadora.step4_title}</h2>
        <p className="text-[var(--foreground-muted)] text-sm mt-2">{t.calculadora.step4_desc}</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_training}{" "}
            <span className="text-[var(--foreground-muted)]">{t.calculadora.label_fei_scale}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {trainingOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("treino", opt.value as FormData["treino"])}
                className={`py-3 px-4 rounded-lg border text-left transition-all ${
                  form.treino === opt.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-sm font-medium ${form.treino === opt.value ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">{opt.price}</span>
                </div>
                <span className="text-xs text-[var(--foreground-muted)]">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_discipline}
          </label>
          <select
            value={form.disciplina}
            onChange={(e) => update("disciplina", e.target.value)}
            className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg py-3 px-4 text-[var(--foreground-secondary)] focus:border-[var(--gold)] outline-none transition-colors"
          >
            {DISCIPLINAS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_competition_history}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {competitionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("competicoes", opt.value as FormData["competicoes"])}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                  form.competicoes === opt.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                } ${opt.value === "campeonato_mundo" ? "col-span-2" : ""}`}
              >
                {opt.icon && <opt.icon size={16} />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--background-secondary)]">
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_health}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {healthOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("saude", opt.value as FormData["saude"])}
                className={`py-3 px-4 rounded-lg border text-left transition-all ${
                  form.saude === opt.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <span
                  className={`block text-sm font-medium ${form.saude === opt.value ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
                >
                  {opt.label}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">{opt.desc}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => update("raioX", !form.raioX)}
              className={`py-3 px-4 rounded-lg border text-sm transition-all flex items-center justify-center gap-2 ${
                form.raioX
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
              }`}
            >
              {form.raioX && <Check size={16} />}
              {t.calculadora.btn_xray}
            </button>
            <button
              onClick={() => update("exameVeterinario", !form.exameVeterinario)}
              className={`py-3 px-4 rounded-lg border text-sm transition-all flex items-center justify-center gap-2 ${
                form.exameVeterinario
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
              }`}
            >
              {form.exameVeterinario && <Check size={16} />}
              {t.calculadora.btn_vet_exam}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
