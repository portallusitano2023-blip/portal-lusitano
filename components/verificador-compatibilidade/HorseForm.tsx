"use client";

import { Crown, Heart, Dna, CheckCircle, Palette } from "lucide-react";
import Paywall from "@/components/tools/Paywall";
import Tooltip from "@/components/tools/Tooltip";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
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
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const cavalo = tab === "garanhao" ? garanhao : egua;
  const setCavalo = tab === "garanhao" ? setGaranhao : setEgua;

  // Calcula completude do perfil do cavalo (0-100%)
  const calcCompletude = (c: Cavalo): number => {
    let filled = 0;
    const total = 7;
    if (c.nome.trim().length > 0) filled++;
    if (c.pelagem && c.pelagem !== "Ruço") filled++;
    if (c.linhagem && c.linhagem !== "Certificada") filled++;
    if (c.linhagemFamosa && c.linhagemFamosa !== "veiga") filled++;
    if (c.blup !== 100) filled++;
    if (c.saude !== 7) filled++;
    if (c.conformacao !== 7 || c.andamentos !== 7) filled++;
    return Math.round((filled / total) * 100);
  };

  const completudeGaranhao = calcCompletude(garanhao);
  const completudeEgua = calcCompletude(egua);

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
          <div className="text-left flex-1 min-w-0">
            <span className="block font-semibold">{t.verificador.tab_stallion}</span>
            <span className="text-xs opacity-70">
              {garanhao.nome || t.verificador.not_defined_m}
            </span>
          </div>
          {completudeGaranhao >= 100 ? (
            <CheckCircle size={16} className="text-emerald-300 shrink-0" />
          ) : completudeGaranhao >= 70 ? (
            <span className="text-[10px] font-bold text-amber-300 shrink-0">
              {completudeGaranhao}%
            </span>
          ) : (
            <span className="text-[10px] font-bold text-red-300/70 shrink-0">
              {completudeGaranhao}%
            </span>
          )}
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
          <div className="text-left flex-1 min-w-0">
            <span className="block font-semibold">{t.verificador.tab_mare}</span>
            <span className="text-xs opacity-70">{egua.nome || t.verificador.not_defined_f}</span>
          </div>
          {completudeEgua >= 100 ? (
            <CheckCircle size={16} className="text-emerald-300 shrink-0" />
          ) : completudeEgua >= 70 ? (
            <span className="text-[10px] font-bold text-amber-300 shrink-0">{completudeEgua}%</span>
          ) : (
            <span className="text-[10px] font-bold text-red-300/70 shrink-0">
              {completudeEgua}%
            </span>
          )}
        </button>
      </div>

      {/* Formulário do Cavalo */}
      <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-4 sm:p-6 border border-[var(--border)] space-y-6">
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

        {/* Identificação */}
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
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.verificador.label_main_lineage}
            </label>
            <Tooltip
              text={tr(
                "Família de criação — principais: Veiga, Andrade, Alter Real, Coudelaria Nacional, Interagro. Afecta o COI estimado e o score de compatibilidade.",
                "Breeding line — main: Veiga, Andrade, Alter Real, National Stud, Interagro. Affects estimated COI and compatibility score.",
                "Línea de cría — principales: Veiga, Andrade, Alter Real, Yeguada Nacional, Interagro. Afecta el COI estimado y la puntuación de compatibilidad."
              )}
              position="top"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LINHAGENS_FAMOSAS.map((lin) => (
              <button
                key={lin.value}
                onClick={() => update("linhagemFamosa", lin.value)}
                className={`py-2 px-3 min-h-[44px] rounded-lg border text-left transition-all ${
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

        {/* Genética de Pelagem */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="text-purple-400" size={18} />
            <label className="text-sm font-medium text-[var(--foreground-secondary)]">
              {t.verificador.label_coat_genetics}
            </label>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
                  className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded px-2 py-2.5 min-h-[44px] text-sm focus:border-purple-500 outline-none"
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

        {/* Avaliações */}
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
                className="w-full h-2 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer accent-pink-500 touch-pan-y py-3"
              />
            </div>
          ))}

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
                {t.verificador.label_blup}
              </label>
              <Tooltip
                text={tr(
                  "Índice de mérito genético oficial (APSL). Média da raça: 100. Acima de 120 é excelente para criação.",
                  "Official genetic merit index (APSL). Breed average: 100. Above 120 is excellent for breeding.",
                  "Índice de mérito genético oficial (APSL). Media de la raza: 100. Por encima de 120 es excelente para cría."
                )}
                position="top"
              />
            </div>
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
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 min-h-[44px] focus:border-pink-500 outline-none"
            >
              {TEMPERAMENTOS.map((temp) => (
                <option key={temp.value} value={temp.value}>
                  {temp.label} - {temp.desc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
                {t.verificador.label_fertility}
              </label>
              <Tooltip
                text={tr(
                  "Historial reprodutivo — afecta a probabilidade de sucesso de cobrição. Valores mais altos aumentam o score de compatibilidade.",
                  "Reproductive history — affects breeding success probability. Higher values increase the compatibility score.",
                  "Historial reproductivo — afecta la probabilidad de éxito de cubrición. Valores más altos aumentan la puntuación de compatibilidad."
                )}
                position="top"
              />
            </div>
            <select
              value={cavalo.fertilidade}
              onChange={(e) => update("fertilidade", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 min-h-[44px] focus:border-pink-500 outline-none"
            >
              {FERTILIDADES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
                {t.verificador.label_coi}
              </label>
              <Tooltip
                text={tr(
                  "Coeficiente de Consanguinidade — mede o grau de parentesco genético. Valores abaixo de 3% são excelentes; acima de 6.25% aumentam risco hereditário.",
                  "Inbreeding Coefficient — measures genetic relatedness. Values below 3% are excellent; above 6.25% increase hereditary risk.",
                  "Coeficiente de Consanguinidad — mide el grado de parentesco genético. Valores por debajo de 3% son excelentes; por encima de 6.25% aumentan el riesgo hereditario."
                )}
                position="top"
              />
            </div>
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

        {/* Historial Reprodutivo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {tr("Coberturas Realizadas", "Breedings Performed", "Cubriciones Realizadas")}
            </label>
            <input
              type="number"
              min={0}
              value={cavalo.matingsRealizados ?? 0}
              onChange={(e) => update("matingsRealizados", Math.max(0, Number(e.target.value)))}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
              {tr("Potros Nascidos Vivos", "Live Foals Born", "Potros Nacidos Vivos")}
            </label>
            <input
              type="number"
              min={0}
              value={cavalo.potradasNascidos ?? 0}
              onChange={(e) => update("potradasNascidos", Math.max(0, Number(e.target.value)))}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Aprovação */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {tr("Aprovação APSL", "APSL Approval", "Aprobación APSL")}
            </span>
            <Tooltip
              text={tr(
                "Cavalo com aprovação oficial da APSL — aumenta score de compatibilidade e valor de mercado.",
                "Horse with official APSL approval — increases compatibility score and market value.",
                "Caballo con aprobación oficial de la APSL — aumenta la puntuación de compatibilidad y el valor de mercado."
              )}
              position="top"
            />
          </div>
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

        {/* Defeitos Genéticos */}
        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.verificador.label_defects}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEFEITOS_GENETICOS.map((d) => (
              <button
                key={d.value}
                onClick={() => toggleDefeito(d.value)}
                className={`p-3 min-h-[44px] rounded-lg border text-left transition-all ${
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
          <Paywall
            toolName={t.verificador.tool_name}
            requiresAuth={requiresAuth}
            proFeatures={[
              tr(
                "Análise genética completa com 5 loci de pelagem",
                "Complete genetic analysis with 5 coat loci",
                "Análisis genético completo con 5 loci de pelaje"
              ),
              tr(
                "Cálculo de COI e risco de consanguinidade",
                "COI calculation and inbreeding risk",
                "Cálculo de COI y riesgo de consanguinidad"
              ),
              tr(
                "Probabilidades reais de pelagens dos descendentes",
                "Real coat colour probabilities for offspring",
                "Probabilidades reales de pelajes de los descendientes"
              ),
              tr(
                "10 factores de compatibilidade reprodutiva",
                "10 reproductive compatibility factors",
                "10 factores de compatibilidad reproductiva"
              ),
              tr(
                "Exportação PDF com relatório completo do par",
                "PDF export with complete pair report",
                "Exportación PDF con informe completo del par"
              ),
            ]}
          />
        </div>
      )}

      {/* COI Estimado em Tempo Real */}
      {garanhao.linhagemFamosa &&
        egua.linhagemFamosa &&
        (() => {
          const COI_ESTIMADOS: Record<string, Record<string, number>> = {
            veiga: {
              veiga: 6.25,
              andrade: 1.5,
              alter: 1.5,
              coudelaria_nacional: 2.0,
              infante_camara: 1.5,
              interagro: 1.0,
              outra: 1.0,
            },
            andrade: {
              veiga: 1.5,
              andrade: 4.0,
              alter: 1.5,
              coudelaria_nacional: 2.0,
              infante_camara: 1.5,
              interagro: 1.0,
              outra: 1.0,
            },
            alter: {
              veiga: 1.5,
              andrade: 1.5,
              alter: 5.0,
              coudelaria_nacional: 2.5,
              infante_camara: 2.0,
              interagro: 1.0,
              outra: 1.0,
            },
            coudelaria_nacional: {
              veiga: 2.0,
              andrade: 2.0,
              alter: 2.5,
              coudelaria_nacional: 5.0,
              infante_camara: 2.0,
              interagro: 1.5,
              outra: 1.0,
            },
            infante_camara: {
              veiga: 1.5,
              andrade: 1.5,
              alter: 2.0,
              coudelaria_nacional: 2.0,
              infante_camara: 4.5,
              interagro: 1.0,
              outra: 1.0,
            },
            interagro: {
              veiga: 1.0,
              andrade: 1.0,
              alter: 1.0,
              coudelaria_nacional: 1.5,
              infante_camara: 1.0,
              interagro: 3.0,
              outra: 0.8,
            },
            outra: {
              veiga: 1.0,
              andrade: 1.0,
              alter: 1.0,
              coudelaria_nacional: 1.0,
              infante_camara: 1.0,
              interagro: 0.8,
              outra: 2.0,
            },
          };
          const coi = COI_ESTIMADOS[garanhao.linhagemFamosa]?.[egua.linhagemFamosa] ?? 2.0;
          const nivel =
            coi <= 3
              ? tr("Baixo", "Low", "Bajo")
              : coi <= 6.25
                ? tr("Moderado", "Moderate", "Moderado")
                : tr("Alto", "High", "Alto");
          const color =
            coi <= 3
              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
              : coi <= 6.25
                ? "text-amber-400 border-amber-500/30 bg-amber-500/5"
                : "text-red-400 border-red-500/30 bg-red-500/5";
          return (
            <div className="mt-6 mb-2">
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${color}`}>
                <Dna size={16} className="shrink-0" />
                <p className="text-xs">
                  <strong>{tr("COI estimado", "Estimated COI", "COI estimado")}:</strong> ~
                  {coi.toFixed(1)}% — {tr("Consanguinidade", "Inbreeding", "Consanguinidad")}{" "}
                  {nivel}
                  {coi > 6.25 &&
                    ` — ${tr("Considere linhagens diferentes para maior diversidade genética", "Consider different lineages for greater genetic diversity", "Considere linajes diferentes para mayor diversidad genética")}`}
                </p>
              </div>
            </div>
          );
        })()}

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
