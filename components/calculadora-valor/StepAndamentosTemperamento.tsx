"use client";

import { Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import Tooltip from "@/components/tools/Tooltip";
import type { NumericFormKey, StepProps } from "./types";

export default function StepAndamentosTemperamento({ form, update }: StepProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const gaitItems: Array<{ key: NumericFormKey; label: string; desc: string; tooltip: string }> = [
    {
      key: "andamentos",
      label: t.calculadora.gait_general,
      desc: t.calculadora.gait_general_desc,
      tooltip: tr(
        "Avalie a qualidade geral dos 3 andamentos (passo, trote, galope). 1-3: Abaixo do padrão, 4-6: Aceitável, 7-8: Bom, 9-10: Excepcional.",
        "Rate the overall quality of the 3 gaits (walk, trot, canter). 1-3: Below standard, 4-6: Acceptable, 7-8: Good, 9-10: Exceptional.",
        "Evalúe la calidad general de los 3 aires (paso, trote, galope). 1-3: Inferior, 4-6: Aceptable, 7-8: Bueno, 9-10: Excepcional."
      ),
    },
    {
      key: "elevacao",
      label: t.calculadora.gait_elevation,
      desc: t.calculadora.gait_elevation_desc,
      tooltip: tr(
        "Altura que o cavalo eleva os membros no trote. Essencial para dressage e Alta Escola.",
        "Height the horse lifts its limbs at trot. Essential for dressage and Haute Ecole.",
        "Altura a la que el caballo eleva los miembros al trote. Esencial para doma y Alta Escuela."
      ),
    },
    {
      key: "suspensao",
      label: t.calculadora.gait_suspension,
      desc: t.calculadora.gait_suspension_desc,
      tooltip: tr(
        "Tempo em que todos os membros estão no ar. Maior suspensão = andamentos mais expressivos.",
        "Time when all limbs are airborne. Greater suspension = more expressive gaits.",
        "Tiempo en que todos los miembros están en el aire. Mayor suspensión = aires más expresivos."
      ),
    },
    {
      key: "regularidade",
      label: t.calculadora.gait_regularity,
      desc: t.calculadora.gait_regularity_desc,
      tooltip: tr(
        "Consistência do ritmo nos 3 andamentos. Andamento regular = equilíbrio e treino correcto.",
        "Rhythm consistency across the 3 gaits. Regular gaits indicate balance and correct training.",
        "Consistencia del ritmo en los 3 aires. Aire regular = equilibrio y entrenamiento correcto."
      ),
    },
  ];

  const temperamentItems: Array<{
    key: NumericFormKey;
    label: string;
    desc: string;
    tooltip: string;
  }> = [
    {
      key: "temperamento",
      label: t.calculadora.temp_balance,
      desc: t.calculadora.temp_balance_desc,
      tooltip: tr(
        "Equilíbrio emocional e capacidade de aprendizagem. Cavalos equilibrados são mais valorizados.",
        "Emotional balance and learning ability. Well-balanced horses command higher value.",
        "Equilibrio emocional y capacidad de aprendizaje. Caballos equilibrados son más valorados."
      ),
    },
    {
      key: "sensibilidade",
      label: t.calculadora.temp_sensitivity,
      desc: t.calculadora.temp_sensitivity_desc,
      tooltip: tr(
        "Resposta às ajudas do cavaleiro. 1=Pouco reactivo, 5=Equilibrado, 10=Hipersensível.",
        "Response to rider aids. 1=Unresponsive, 5=Balanced, 10=Hypersensitive.",
        "Respuesta a las ayudas del jinete. 1=Poco reactivo, 5=Equilibrado, 10=Hipersensible."
      ),
    },
    {
      key: "vontadeTrabalho",
      label: t.calculadora.temp_willingness,
      desc: t.calculadora.temp_willingness_desc,
      tooltip: tr(
        "Cooperação e energia durante o trabalho. Cavalos com boa vontade progridem mais rápido.",
        "Cooperation and energy during work. Willing horses progress faster in training.",
        "Cooperación y energía durante el trabajo. Caballos con buena voluntad progresan más rápido."
      ),
    },
  ];

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
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-1">
                    <label className="text-sm text-[var(--foreground-secondary)]">
                      {item.label}
                    </label>
                    <Tooltip text={item.tooltip} position="top" />
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)] block mt-0.5">
                    {item.desc}
                  </span>
                </div>
                <span className="text-[var(--gold)] font-medium text-lg shrink-0">
                  {form[item.key]}/10
                </span>
              </div>
              <div className="py-2">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form[item.key]}
                  onChange={(e) => update(item.key, Number(e.target.value))}
                  className="w-full h-2 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer accent-[var(--gold)]"
                  style={{ touchAction: "manipulation" }}
                />
              </div>
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
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-1">
                    <label className="text-sm text-[var(--foreground-secondary)]">
                      {item.label}
                    </label>
                    <Tooltip text={item.tooltip} position="top" />
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)] block mt-0.5">
                    {item.desc}
                  </span>
                </div>
                <span className="text-[var(--gold)] font-medium text-lg shrink-0">
                  {form[item.key]}/10
                </span>
              </div>
              <div className="py-2">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form[item.key]}
                  onChange={(e) => update(item.key, Number(e.target.value))}
                  className="w-full h-2 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer accent-[var(--gold)]"
                  style={{ touchAction: "manipulation" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
