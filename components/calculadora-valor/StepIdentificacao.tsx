"use client";

import { useMemo } from "react";
import { Check, Crown, Heart, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { StepProps } from "./types";

export default function StepIdentificacao({ form, update }: StepProps) {
  const { t } = useLanguage();

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
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
          <Shield size={12} />
          {t.calculadora.step1_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif">{t.calculadora.step1_title}</h2>
        <p className="text-zinc-500 text-sm mt-2">{t.calculadora.step1_desc}</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
            {t.calculadora.label_horse_name}{" "}
            <span className="text-zinc-600">{t.calculadora.label_optional}</span>
          </label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => update("nome", e.target.value)}
            placeholder="Ex: Ícaro III, Novilheiro, Opus"
            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors placeholder:text-zinc-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
              {t.calculadora.label_age}
            </label>
            <div className="relative">
              <input
                type="number"
                value={form.idade}
                onChange={(e) => update("idade", Math.max(0, Math.min(30, Number(e.target.value))))}
                min={0}
                max={30}
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                {t.calculadora.label_years}
              </span>
            </div>
            <span className="text-xs text-zinc-600 mt-1 block">
              {t.calculadora.label_ideal_age}
            </span>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
              {t.calculadora.label_height}
            </label>
            <div className="relative">
              <input
                type="number"
                value={form.altura}
                onChange={(e) => update("altura", Number(e.target.value))}
                min={140}
                max={180}
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                {t.calculadora.label_cm}
              </span>
            </div>
            <span className="text-xs text-zinc-600 mt-1 block">
              {t.calculadora.label_standard_height}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
            {t.calculadora.label_sex}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sexOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("sexo", opt.value as typeof form.sexo)}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  form.sexo === opt.value
                    ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <opt.icon size={18} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
            {t.calculadora.label_coat}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {pelagens.map((p) => (
              <button
                key={p.value}
                onClick={() => update("pelagem", p.value)}
                className={`py-3 px-4 rounded-lg border text-left transition-all ${
                  form.pelagem === p.value
                    ? "border-[#C5A059] bg-[#C5A059]/10"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <span
                  className={`block text-sm font-medium ${form.pelagem === p.value ? "text-[#C5A059]" : "text-zinc-300"}`}
                >
                  {p.label}
                </span>
                <span className="text-xs text-zinc-500">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900">
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
            {t.calculadora.label_apsl_reg}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => update("registoAPSL", true)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                form.registoAPSL
                  ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              {form.registoAPSL && <Check size={16} />}
              {t.calculadora.btn_registered}
            </button>
            <button
              onClick={() => update("registoAPSL", false)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                !form.registoAPSL
                  ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              {t.calculadora.btn_no_reg}
            </button>
          </div>

          {form.registoAPSL && (
            <div className="mt-4 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                {t.calculadora.label_book_type}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bookOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("livroAPSL", opt.value as typeof form.livroAPSL)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      form.livroAPSL === opt.value
                        ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                        : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
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
