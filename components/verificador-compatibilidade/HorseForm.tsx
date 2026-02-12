"use client";

import { Crown, Heart, Dna, CheckCircle, Palette } from "lucide-react";
import Paywall from "@/components/tools/Paywall";
import { useLanguage } from "@/context/LanguageContext";
import type { Cavalo, GeneticaPelagem } from "@/components/verificador-compatibilidade/types";
import {
  COUDELARIAS,
  LINHAGENS,
  LINHAGENS_FAMOSAS,
  TEMPERAMENTOS,
  FERTILIDADES,
  DEFEITOS_GENETICOS,
} from "@/components/verificador-compatibilidade/data";

interface HorseFormProps {
  garanhao: Cavalo;
  egua: Cavalo;
  setGaranhao: React.Dispatch<React.SetStateAction<Cavalo>>;
  setEgua: React.Dispatch<React.SetStateAction<Cavalo>>;
  tab: "garanhao" | "egua";
  setTab: (tab: "garanhao" | "egua") => void;
  canUse: boolean;
  requiresAuth: boolean;
  isCalculating: boolean;
  onCalcular: () => void;
}

export default function HorseForm({
  garanhao,
  egua,
  setGaranhao,
  setEgua,
  tab,
  setTab,
  canUse,
  requiresAuth,
  isCalculating,
  onCalcular,
}: HorseFormProps) {
  const { t } = useLanguage();

  const cavalo = tab === "garanhao" ? garanhao : egua;
  const setCavalo = tab === "garanhao" ? setGaranhao : setEgua;

  const update = (field: keyof Cavalo, value: Cavalo[keyof Cavalo]) => {
    setCavalo((prev) => ({ ...prev, [field]: value }));
  };

  const updateGen = (gene: keyof GeneticaPelagem, value: string) => {
    setCavalo((prev) => ({ ...prev, genetica: { ...prev.genetica, [gene]: value } }));
  };

  const toggleDefeito = (d: string) => {
    const lista = cavalo.defeitos.includes(d)
      ? cavalo.defeitos.filter((x) => x !== d)
      : [...cavalo.defeitos, d];
    update("defeitos", lista);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("garanhao")}
          className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all ${
            tab === "garanhao"
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--foreground-muted)]"
          }`}
        >
          <Crown size={20} />
          <div className="text-left">
            <span className="block font-semibold">{t.verificador.tab_stallion}</span>
            <span className="text-xs opacity-70">
              {garanhao.nome || t.verificador.not_defined_m}
            </span>
          </div>
        </button>
        <button
          onClick={() => setTab("egua")}
          className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all ${
            tab === "egua"
              ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/20"
              : "bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--foreground-muted)]"
          }`}
        >
          <Heart size={20} />
          <div className="text-left">
            <span className="block font-semibold">{t.verificador.tab_mare}</span>
            <span className="text-xs opacity-70">{egua.nome || t.verificador.not_defined_f}</span>
          </div>
        </button>
      </div>

      {/* Formulario do Cavalo */}
      <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-6 border border-[var(--border)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
          {tab === "garanhao" ? (
            <Crown className="text-blue-400" size={24} />
          ) : (
            <Heart className="text-pink-400" size={24} />
          )}
          <div>
            <h2 className="text-xl font-serif text-[var(--foreground)]">
              {t.verificador.horse_data} {cavalo.sexo}
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">{t.verificador.form_desc}</p>
          </div>
        </div>

        {/* Identificacao */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_name}
            </label>
            <input
              type="text"
              value={cavalo.nome}
              onChange={(e) => update("nome", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
              placeholder={`Nome do ${cavalo.sexo}`}
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_age}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="30"
                value={cavalo.idade}
                onChange={(e) => update("idade", +e.target.value || 1)}
                className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] text-sm">
                {t.verificador.label_years}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_height}
            </label>
            <div className="relative">
              <input
                type="number"
                min="140"
                max="180"
                value={cavalo.altura}
                onChange={(e) => update("altura", +e.target.value || 160)}
                className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] text-sm">
                {t.verificador.label_cm}
              </span>
            </div>
          </div>
        </div>

        {/* Origem e Linhagem */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_origin}
            </label>
            <select
              value={cavalo.coudelaria}
              onChange={(e) => update("coudelaria", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
            >
              {COUDELARIAS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_lineage_quality}
            </label>
            <select
              value={cavalo.linhagem}
              onChange={(e) => update("linhagem", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
            >
              {LINHAGENS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Linhagem Famosa */}
        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.verificador.label_main_lineage}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LINHAGENS_FAMOSAS.map((lin) => (
              <button
                key={lin.value}
                onClick={() => update("linhagemFamosa", lin.value)}
                className={`py-2 px-3 rounded-lg border text-left transition-all ${
                  cavalo.linhagemFamosa === lin.value
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-[var(--border)] hover:border-[var(--foreground-muted)]"
                }`}
              >
                <span
                  className={`block text-sm font-medium ${cavalo.linhagemFamosa === lin.value ? "text-pink-400" : "text-[var(--foreground-secondary)]"}`}
                >
                  {lin.label}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">{lin.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Genetica de Pelagem */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="text-purple-400" size={18} />
            <label className="text-sm font-medium text-[var(--foreground-secondary)]">
              {t.verificador.label_coat_genetics}
            </label>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { gene: "extension" as const, label: "Extension", options: ["EE", "Ee", "ee"] },
              { gene: "agouti" as const, label: "Agouti", options: ["AA", "Aa", "aa"] },
              { gene: "grey" as const, label: "Grey", options: ["GG", "Gg", "gg"] },
              { gene: "cream" as const, label: "Cream", options: ["CrCr", "CrN", "NN"] },
              { gene: "dun" as const, label: "Dun", options: ["DD", "Dd", "dd"] },
            ].map(({ gene, label, options }) => (
              <div key={gene}>
                <label className="block text-xs text-[var(--foreground-muted)] mb-1">{label}</label>
                <select
                  value={cavalo.genetica[gene]}
                  onChange={(e) => updateGen(gene, e.target.value)}
                  className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded px-2 py-2 text-sm focus:border-purple-500 outline-none"
                >
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">
            {t.verificador.coat_genetics_hint}
          </p>
        </div>

        {/* Avaliacoes */}
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              field: "conformacao" as const,
              label: t.verificador.label_conformation,
              desc: t.verificador.label_conformation_desc,
            },
            {
              field: "andamentos" as const,
              label: t.verificador.label_gaits,
              desc: t.verificador.label_gaits_desc,
            },
            {
              field: "saude" as const,
              label: t.verificador.label_health,
              desc: t.verificador.label_health_desc,
            },
          ].map(({ field, label, desc }) => (
            <div key={field}>
              <div className="flex justify-between mb-2">
                <div>
                  <label className="text-sm text-[var(--foreground-secondary)]">{label}</label>
                  <span className="text-xs text-[var(--foreground-muted)] ml-2">{desc}</span>
                </div>
                <span className="text-pink-400 font-medium">{cavalo[field]}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={cavalo[field]}
                onChange={(e) => update(field, +e.target.value)}
                className="w-full h-2 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_blup}
            </label>
            <input
              type="number"
              min="50"
              max="150"
              value={cavalo.blup}
              onChange={(e) => update("blup", +e.target.value || 100)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none"
            />
            <p className="text-xs text-[var(--foreground-muted)] mt-1">{t.verificador.blup_avg}</p>
          </div>
        </div>

        {/* Temperamento e Fertilidade */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_temperament}
            </label>
            <select
              value={cavalo.temperamento}
              onChange={(e) => update("temperamento", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none"
            >
              {TEMPERAMENTOS.map((temp) => (
                <option key={temp.value} value={temp.value}>
                  {temp.label} - {temp.desc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_fertility}
            </label>
            <select
              value={cavalo.fertilidade}
              onChange={(e) => update("fertilidade", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none"
            >
              {FERTILIDADES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {t.verificador.label_coi}
            </label>
            <input
              type="number"
              min="0"
              max="25"
              step="0.5"
              value={cavalo.coi}
              onChange={(e) => update("coi", +e.target.value || 0)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none"
            />
          </div>
        </div>

        {/* Aprovacao */}
        <div>
          <button
            onClick={() => update("aprovado", !cavalo.aprovado)}
            className={`w-full py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              cavalo.aprovado
                ? "border-green-500 bg-green-500/10 text-green-400"
                : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--foreground-muted)]"
            }`}
          >
            {cavalo.aprovado && <CheckCircle size={16} />}
            {cavalo.aprovado ? t.verificador.btn_approved : t.verificador.btn_not_approved}
          </button>
        </div>

        {/* Defeitos Geneticos */}
        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.verificador.label_defects}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEFEITOS_GENETICOS.map((d) => (
              <button
                key={d.value}
                onClick={() => toggleDefeito(d.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  cavalo.defeitos.includes(d.value)
                    ? d.risco === "alto"
                      ? "border-red-500 bg-red-500/10"
                      : d.risco === "medio"
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-yellow-500 bg-yellow-500/10"
                    : "border-[var(--border)] hover:border-[var(--foreground-muted)]"
                }`}
              >
                <span
                  className={`block text-sm font-medium ${
                    cavalo.defeitos.includes(d.value)
                      ? d.risco === "alto"
                        ? "text-red-400"
                        : d.risco === "medio"
                          ? "text-amber-400"
                          : "text-yellow-400"
                      : "text-[var(--foreground-secondary)]"
                  }`}
                >
                  {d.label}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Paywall */}
      {!canUse && (
        <div className="mt-8">
          <Paywall toolName={t.verificador.tool_name} requiresAuth={requiresAuth} />
        </div>
      )}

      {/* Botao Analisar */}
      {canUse && (
        <button
          onClick={onCalcular}
          disabled={isCalculating}
          className="w-full mt-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-pink-500 hover:to-purple-500 transition-all disabled:opacity-50"
        >
          {isCalculating ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t.verificador.btn_analysing}
            </>
          ) : (
            <>
              <Dna size={22} />
              {t.verificador.btn_analyse}
            </>
          )}
        </button>
      )}
    </div>
  );
}
