"use client";

import { useMemo } from "react";
import { Target, Check, Medal, Award, Globe, Crown, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import Tooltip from "@/components/tools/Tooltip";
import { DISCIPLINAS_DETAILED } from "./data";
import type { FormData, StepProps } from "./types";

// ---------------------------------------------------------------------------
// Training level order (for progression bar)
// ---------------------------------------------------------------------------

const TRAINING_ORDER: FormData["treino"][] = [
  "potro",
  "desbravado",
  "iniciado",
  "elementar",
  "medio",
  "avancado",
  "alta_escola",
  "grand_prix",
];

const TRAINING_SHORT: Record<string, string> = {
  potro: "P",
  desbravado: "D",
  iniciado: "I",
  elementar: "E",
  medio: "M",
  avancado: "A",
  alta_escola: "AE",
  grand_prix: "GP",
};

// ---------------------------------------------------------------------------
// Competition impact percentages (from MULT_COMP in data.ts)
// ---------------------------------------------------------------------------

const COMP_IMPACT: Record<string, string> = {
  nenhuma: "",
  regional: "+12%",
  nacional: "+30%",
  cdi1: "+45%",
  cdi3: "+60%",
  cdi5: "+80%",
  campeonato_mundo: "+100%",
};

// ---------------------------------------------------------------------------
// Health impact percentages (from MULT_SAUDE in data.ts)
// ---------------------------------------------------------------------------

const HEALTH_IMPACT: Record<string, string> = {
  excelente: "+20%",
  muito_bom: "+8%",
  bom: "base",
  regular: "−30%",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StepTreinoSaude({ form, update }: StepProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const trainingOptions = useMemo(
    () => [
      {
        value: "potro" as const,
        label: t.calculadora.training_foal,
        desc: t.calculadora.training_foal_desc,
        fei: t.calculadora.training_foal_fei,
        price: "8.000\u20AC+",
      },
      {
        value: "desbravado" as const,
        label: t.calculadora.training_broken,
        desc: t.calculadora.training_broken_desc,
        fei: t.calculadora.training_broken_fei,
        price: "15.000\u20AC+",
      },
      {
        value: "iniciado" as const,
        label: t.calculadora.training_started,
        desc: t.calculadora.training_started_desc,
        fei: t.calculadora.training_started_fei,
        price: "25.000\u20AC+",
      },
      {
        value: "elementar" as const,
        label: t.calculadora.training_elementary,
        desc: t.calculadora.training_elementary_desc,
        fei: t.calculadora.training_elementary_fei,
        price: "40.000\u20AC+",
      },
      {
        value: "medio" as const,
        label: t.calculadora.training_medium,
        desc: t.calculadora.training_medium_desc,
        fei: t.calculadora.training_medium_fei,
        price: "65.000\u20AC+",
      },
      {
        value: "avancado" as const,
        label: t.calculadora.training_advanced,
        desc: t.calculadora.training_advanced_desc,
        fei: t.calculadora.training_advanced_fei,
        price: "100.000\u20AC+",
      },
      {
        value: "alta_escola" as const,
        label: t.calculadora.training_haute_ecole,
        desc: t.calculadora.training_haute_ecole_desc,
        fei: t.calculadora.training_haute_ecole_fei,
        price: "150.000\u20AC+",
      },
      {
        value: "grand_prix" as const,
        label: t.calculadora.training_gp,
        desc: t.calculadora.training_gp_desc,
        fei: t.calculadora.training_gp_fei,
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
      {
        value: "cdi1",
        label: tr(
          "CDI1* \u2014 Dressage Internacional",
          "CDI1* \u2014 International Dressage",
          "CDI1* \u2014 Doma Internacional"
        ),
        icon: Globe,
      },
      {
        value: "cdi3",
        label: tr(
          "CDI3* \u2014 Grand Prix Internacional",
          "CDI3* \u2014 International Grand Prix",
          "CDI3* \u2014 Grand Prix Internacional"
        ),
        icon: Globe,
      },
      {
        value: "cdi5",
        label: tr(
          "CDI5*/CDI-O \u2014 Elite Mundial",
          "CDI5*/CDI-O \u2014 World Elite",
          "CDI5*/CDI-O \u2014 Elite Mundial"
        ),
        icon: Globe,
      },
      {
        value: "campeonato_mundo",
        label: tr(
          "Campeonato do Mundo / Europeu",
          "World / European Championship",
          "Campeonato del Mundo / Europeo"
        ),
        icon: Crown,
      },
    ],
    [t, tr]
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

  // Discipline options with translations
  const disciplineOptions = useMemo(() => {
    return DISCIPLINAS_DETAILED.map((d) => ({
      value: d.value,
      label: language === "en" ? d.labelEn : language === "es" ? d.labelEs : d.labelPt,
      impact: d.impact,
      impactValue: d.impactValue,
    }));
  }, [language]);

  // Movement tags for selected training level
  const movementTags = useMemo(() => {
    const tags: Record<string, string[]> = {
      potro: [
        tr("Guia", "Lunge line", "Cuerda"),
        tr("Cabeçada", "Halter", "Cabezada"),
        tr("Maneio de cascos", "Hoof handling", "Manejo de cascos"),
      ],
      desbravado: [
        tr("Embocadura", "Bitting", "Embocadura"),
        tr("Transições passo-trote", "Walk-trot transitions", "Transiciones paso-trote"),
        tr("Linha recta", "Straight line", "Línea recta"),
      ],
      iniciado: [
        tr("3 Andamentos", "All 3 gaits", "3 Aires"),
        tr("Círculos 20m", "20m circles", "Círculos 20m"),
        tr("Mudanças de mão", "Changes of rein", "Cambios de mano"),
        tr("Passo livre", "Free walk", "Paso libre"),
      ],
      elementar: [
        tr("Cessão à perna", "Leg yield", "Cesión a la pierna"),
        tr("Trote alongado", "Lengthened trot", "Trote alargado"),
        tr("Contra-galope", "Counter-canter", "Contra-galope"),
        tr("Círculos 15m", "15m circles", "Círculos 15m"),
      ],
      medio: [
        tr("Espádua adentro", "Shoulder-in", "Espalda adentro"),
        tr("Travers", "Travers", "Travers"),
        tr("Meia-passada", "Half-pass", "Media vuelta"),
        tr("Galope médio", "Medium canter", "Galope medio"),
      ],
      avancado: [
        tr("Mudanças em voo", "Flying changes", "Cambios en el aire"),
        tr("Semi-piruetas", "Half-pirouettes", "Semi-piruetas"),
        tr("Galope reunido", "Collected canter", "Galope reunido"),
        tr("Extensões", "Extensions", "Extensiones"),
      ],
      alta_escola: [
        tr("Piaffe", "Piaffe", "Piaffe"),
        tr("Passage", "Passage", "Passage"),
        tr("Tempi 2 em 2", "Tempi every 2nd", "Tempi cada 2"),
        tr("Piruetas completas", "Full pirouettes", "Piruetas completas"),
      ],
      grand_prix: [
        tr("Piaffe (15t)", "Piaffe (15 steps)", "Piaffe (15t)"),
        tr("Passage", "Passage", "Passage"),
        tr("Tempi a 1", "Tempi every stride", "Tempi a 1"),
        tr("Transições P↔P", "P↔P transitions", "Transiciones P↔P"),
      ],
    };
    return tags;
  }, [tr]);

  // Contextual help for selected training level
  const trainingContext = useMemo(() => {
    const ctx: Record<string, string> = {
      potro: tr(
        "Cavalo jovem sem trabalho montado. O valor reflecte o potencial genético e morfológico.",
        "Young horse with no saddle work. Value reflects genetic and morphological potential.",
        "Caballo joven sin trabajo montado. El valor refleja el potencial genético y morfológico."
      ),
      desbravado: tr(
        "Primeiros passos sob sela. O investimento em desbaste foi feito, mas o cavalo ainda não executa figuras.",
        "First steps under saddle. Breaking investment is done, but the horse doesn't execute figures yet.",
        "Primeros pasos bajo silla. La inversión en doma está hecha, pero el caballo aún no ejecuta figuras."
      ),
      iniciado: tr(
        "Nível de entrada para cavalos de lazer. Executa os 3 andamentos com transições básicas.",
        "Entry level for leisure horses. Performs all 3 gaits with basic transitions.",
        "Nivel de entrada para caballos de ocio. Ejecuta los 3 aires con transiciones básicas."
      ),
      elementar: tr(
        "Nível mais comum para cavalos de ensino. Começa a executar trabalho lateral e alongamentos.",
        "Most common level for riding school horses. Starts lateral work and lengthened strides.",
        "Nivel más común para caballos de enseñanza. Empieza trabajo lateral y alargamientos."
      ),
      medio: tr(
        "Cavalo de desporto com trabalho lateral completo. Apto para competições nacionais de dressage.",
        "Sport horse with complete lateral work. Suitable for national dressage competitions.",
        "Caballo de deporte con trabajo lateral completo. Apto para competiciones nacionales de doma."
      ),
      avancado: tr(
        "Nível de competição internacional. Executa mudanças em voo e movimentos de reunião avançada.",
        "International competition level. Performs flying changes and advanced collection movements.",
        "Nivel de competición internacional. Ejecuta cambios en el aire y movimientos de reunión avanzada."
      ),
      alta_escola: tr(
        "Nível de excelência da equitação clássica. Piaffe e passage são as marcas desta formação.",
        "Classical riding excellence. Piaffe and passage are the hallmarks of this training.",
        "Nivel de excelencia de la equitación clásica. Piaffe y passage son las marcas de esta formación."
      ),
      grand_prix: tr(
        "O mais alto nível da dressage. Cavalo comprovado em competição Grand Prix FEI.",
        "The highest level of dressage. Horse proven in FEI Grand Prix competition.",
        "El nivel más alto de la doma. Caballo probado en competición Grand Prix FEI."
      ),
    };
    return ctx;
  }, [tr]);

  const selectedIndex = TRAINING_ORDER.indexOf(form.treino);
  const selectedTags = movementTags[form.treino] ?? [];
  const selectedContext = trainingContext[form.treino] ?? "";

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
        {/* ===== TRAINING LEVEL ===== */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.calculadora.label_training}{" "}
              <span className="text-[var(--foreground-muted)]">
                {t.calculadora.label_fei_scale}
              </span>
            </label>
            <Tooltip
              text={tr(
                "O nível de treino é o factor mais importante no valor base do cavalo. Seleccione o nível que melhor descreve o trabalho actual.",
                "Training level is the most important factor in the horse's base value. Select the level that best describes current work.",
                "El nivel de entrenamiento es el factor más importante en el valor base del caballo. Seleccione el nivel que mejor describe el trabajo actual."
              )}
              position="bottom"
            />
          </div>

          {/* Training progression bar */}
          <div className="mb-5 px-1">
            <div className="relative flex items-center justify-between">
              {/* Connector line */}
              <div
                className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2"
                aria-hidden="true"
              />
              <div
                className="absolute top-1/2 left-0 h-px bg-[var(--gold)]/50 -translate-y-1/2 transition-all duration-300"
                style={{ width: `${(selectedIndex / (TRAINING_ORDER.length - 1)) * 100}%` }}
                aria-hidden="true"
              />
              {/* Dots */}
              {TRAINING_ORDER.map((level, i) => {
                const isActive = i <= selectedIndex;
                const isCurrent = level === form.treino;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => update("treino", level)}
                    className="relative z-10 flex flex-col items-center gap-1 group"
                    aria-label={trainingOptions[i]?.label}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                        isCurrent
                          ? "bg-[var(--gold)] border-[var(--gold)] scale-125 shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                          : isActive
                            ? "bg-[var(--gold)]/60 border-[var(--gold)]/60"
                            : "bg-transparent border-white/20 group-hover:border-white/40"
                      }`}
                    />
                    <span
                      className={`text-[9px] font-medium transition-colors ${
                        isCurrent
                          ? "text-[var(--gold)]"
                          : isActive
                            ? "text-[var(--foreground-muted)]"
                            : "text-white/20"
                      }`}
                    >
                      {TRAINING_SHORT[level]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Training level cards */}
          <div className="grid grid-cols-2 gap-2">
            {trainingOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("treino", opt.value)}
                className={`py-3 px-3 rounded-lg border text-left transition-all min-h-[44px] ${
                  form.treino === opt.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <div className="flex justify-between items-start gap-1">
                  <span
                    className={`text-xs sm:text-sm font-medium leading-tight ${form.treino === opt.value ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-[var(--foreground-muted)] shrink-0 mt-0.5">
                    {opt.price}
                  </span>
                </div>
                {opt.fei && (
                  <span className="text-[10px] text-[var(--foreground-muted)]/60 block mt-0.5">
                    {opt.fei}
                  </span>
                )}
                <span className="text-[10px] sm:text-xs text-[var(--foreground-muted)] mt-0.5 block leading-snug">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Selected level detail panel */}
          <div
            key={form.treino}
            className="mt-3 p-4 rounded-xl border border-[var(--gold)]/15 bg-[var(--gold)]/5 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
          >
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20"
                >
                  <Sparkles size={8} />
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              {selectedContext}
            </p>
          </div>
        </div>

        {/* ===== DISCIPLINE ===== */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.calculadora.label_discipline}
            </label>
            <Tooltip
              text={tr(
                "A disciplina principal influencia o valor de mercado. Alta Escola e Equitação de Trabalho comandam os maiores prémios no Lusitano.",
                "The main discipline influences market value. Haute Ecole and Working Equitation command the highest premiums for Lusitanos.",
                "La disciplina principal influye en el valor de mercado. Alta Escuela y Equitación de Trabajo tienen los mayores premios en Lusitanos."
              )}
              position="bottom"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {disciplineOptions.map((d, i) => {
              const isPositive = d.impactValue > 1;
              const isNegative = d.impactValue < 1;
              const isNeutral = d.impactValue === 1;
              return (
                <button
                  key={d.value}
                  onClick={() => update("disciplina", d.value)}
                  className={`py-3 px-3 rounded-lg border text-left transition-all min-h-[44px] ${
                    form.disciplina === d.value
                      ? "border-[var(--gold)] bg-[var(--gold)]/10"
                      : "border-[var(--border)] hover:border-[var(--border)]"
                  } ${i === disciplineOptions.length - 1 && disciplineOptions.length % 2 !== 0 ? "col-span-2" : ""}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs sm:text-sm font-medium leading-tight ${form.disciplina === d.value ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
                    >
                      {d.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : isNegative
                            ? "bg-red-500/10 text-red-400"
                            : "bg-white/5 text-[var(--foreground-muted)]"
                      }`}
                    >
                      {isNeutral ? "—" : d.impact}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== COMPETITION HISTORY ===== */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.calculadora.label_competition_history}
            </label>
            <Tooltip
              text={tr(
                "Resultados comprovados em competição aumentam significativamente o valor. CDI = Concours de Dressage International (nível FEI).",
                "Proven competition results significantly increase value. CDI = Concours de Dressage International (FEI level).",
                "Resultados comprobados en competición aumentan significativamente el valor. CDI = Concours de Dressage International (nivel FEI)."
              )}
              position="bottom"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {competitionOptions.map((opt) => {
              const impact = COMP_IMPACT[opt.value];
              return (
                <button
                  key={opt.value}
                  onClick={() => update("competicoes", opt.value as FormData["competicoes"])}
                  className={`py-3 px-3 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 min-h-[44px] ${
                    form.competicoes === opt.value
                      ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                      : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                  } ${opt.value === "campeonato_mundo" ? "col-span-2" : ""}`}
                >
                  {opt.icon && <opt.icon size={14} className="shrink-0" />}
                  <span className="leading-tight flex-1">{opt.label}</span>
                  {impact && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">
                      {impact}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== HEALTH ===== */}
        <div className="pt-4 border-t border-[var(--background-secondary)]">
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              {t.calculadora.label_health}
            </label>
            <Tooltip
              text={tr(
                "A saúde é fundamental para compradores. Documentação veterinária completa (raio-X + exame) aumenta a confiança do mercado em +10%.",
                "Health is critical for buyers. Complete veterinary documentation (X-ray + exam) increases market confidence by +10%.",
                "La salud es fundamental para compradores. Documentación veterinaria completa (radiografía + examen) aumenta la confianza del mercado en +10%."
              )}
              position="bottom"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {healthOptions.map((opt) => {
              const impact = HEALTH_IMPACT[opt.value];
              const isPositive = impact?.startsWith("+");
              const isNegative = impact?.startsWith("−") || impact?.startsWith("-");
              return (
                <button
                  key={opt.value}
                  onClick={() => update("saude", opt.value as FormData["saude"])}
                  className={`py-3 px-4 rounded-lg border text-left transition-all ${
                    form.saude === opt.value
                      ? "border-[var(--gold)] bg-[var(--gold)]/10"
                      : "border-[var(--border)] hover:border-[var(--border)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-sm font-medium ${form.saude === opt.value ? "text-[var(--gold)]" : "text-[var(--foreground-secondary)]"}`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : isNegative
                            ? "bg-red-500/10 text-red-400"
                            : "bg-white/5 text-[var(--foreground-muted)]"
                      }`}
                    >
                      {impact}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)] leading-snug">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => update("raioX", !form.raioX)}
              className={`py-3 px-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                form.raioX
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
              }`}
            >
              {form.raioX && <Check size={16} className="shrink-0" />}
              {t.calculadora.btn_xray}
            </button>
            <button
              onClick={() => update("exameVeterinario", !form.exameVeterinario)}
              className={`py-3 px-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                form.exameVeterinario
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
              }`}
            >
              {form.exameVeterinario && <Check size={16} className="shrink-0" />}
              {t.calculadora.btn_vet_exam}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
