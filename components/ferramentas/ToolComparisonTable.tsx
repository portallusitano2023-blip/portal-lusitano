"use client";

import { Check, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

type Tr = ReturnType<typeof createTranslator>;

function getTools(tr: Tr) {
  return [
    { name: tr("Calculadora", "Calculator", "Calculadora"), short: tr("Calc.", "Calc.", "Calc.") },
    { name: tr("Comparador", "Comparator", "Comparador"), short: tr("Comp.", "Comp.", "Comp.") },
    {
      name: tr("Compatibilidade", "Compatibility", "Compatibilidad"),
      short: tr("Compat.", "Compat.", "Compat."),
    },
    { name: tr("Perfil", "Profile", "Perfil"), short: tr("Perfil", "Profile", "Perfil") },
  ];
}

function getFeatures(tr: Tr) {
  return [
    {
      label: tr("Avaliação de valor em €", "Value assessment in €", "Evaluación de valor en €"),
      tools: [true, false, false, false],
    },
    {
      label: tr("Comparação lado a lado", "Side-by-side comparison", "Comparación lado a lado"),
      tools: [false, true, false, false],
    },
    { label: "Score global (0-100)", tools: [false, true, false, false] },
    {
      label: tr("Radar multi-dimensão", "Multi-dimension radar", "Radar multi-dimensión"),
      tools: [false, true, false, false],
    },
    {
      label: tr("Aptidão por disciplina", "Discipline aptitude", "Aptitud por disciplina"),
      tools: [false, true, false, false],
    },
    {
      label: tr("Previsão de pelagem", "Coat prediction", "Predicción de capa"),
      tools: [false, false, true, false],
    },
    {
      label: tr("COI / Consanguinidade", "COI / Inbreeding", "COI / Consanguinidad"),
      tools: [false, false, true, false],
    },
    {
      label: tr("Análise genética", "Genetic analysis", "Análisis genético"),
      tools: [false, false, true, false],
    },
    {
      label: tr("Perfil de comprador", "Buyer profile", "Perfil de comprador"),
      tools: [false, false, false, true],
    },
    {
      label: tr(
        "Recomendações personalizadas",
        "Personalized recommendations",
        "Recomendaciones personalizadas"
      ),
      tools: [true, true, true, true],
    },
    { label: tr("Exportar PDF", "Export PDF", "Exportar PDF"), tools: [true, true, true, true] },
    {
      label: tr("Histórico de análises", "Analysis history", "Historial de análisis"),
      tools: [true, true, true, true],
    },
  ];
}

export default function ToolComparisonTable() {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const tools = getTools(tr);
  const features = getFeatures(tr);

  const yesLabel = tr("Sim", "Yes", "Sí");
  const noLabel = tr("Não", "No", "No");

  return (
    <section id="comparacao" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-serif text-[var(--foreground)]">
          {tr(
            "Comparação de Funcionalidades",
            "Feature Comparison",
            "Comparación de Funcionalidades"
          )}
        </h2>
        <p className="text-sm text-[var(--foreground-muted)] mt-2">
          {tr(
            "Cada ferramenta resolve uma necessidade diferente",
            "Each tool solves a different need",
            "Cada herramienta resuelve una necesidad diferente"
          )}
        </p>
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th
                scope="col"
                className="text-left text-xs text-[var(--foreground-muted)] pb-3 pr-4 font-medium"
              >
                {tr("Funcionalidade", "Feature", "Funcionalidad")}
              </th>
              {tools.map((tool, i) => (
                <th
                  key={i}
                  scope="col"
                  className="text-center text-xs pb-3 px-2 font-semibold text-[var(--foreground-secondary)]"
                >
                  <span className="hidden md:inline">{tool.name}</span>
                  <span className="md:hidden">{tool.short}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/30">
            {features.map((feature, fi) => (
              <tr key={fi} className="hover:bg-[var(--background-secondary)]/30 transition-colors">
                <td className="py-2.5 pr-4 text-xs text-[var(--foreground-secondary)]">
                  {feature.label}
                </td>
                {feature.tools.map((has, ti) => (
                  <td
                    key={ti}
                    className="py-2.5 px-2 text-center"
                    aria-label={has ? yesLabel : noLabel}
                  >
                    {has ? (
                      <Check size={14} className="text-emerald-400 mx-auto" aria-hidden="true" />
                    ) : (
                      <X
                        size={14}
                        className="text-[var(--foreground-muted)]/30 mx-auto"
                        aria-hidden="true"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card layout */}
      <div className="sm:hidden space-y-3">
        {features.map((feature, fi) => (
          <div
            key={fi}
            className="p-3 bg-[var(--background-secondary)]/30 border border-[var(--border)] rounded-lg"
          >
            <p className="text-xs text-[var(--foreground)] font-medium mb-2">{feature.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {tools.map((tool, ti) => (
                <span
                  key={ti}
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    feature.tools[ti]
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-[var(--background-card)] text-[var(--foreground-muted)]/40"
                  }`}
                >
                  {tool.short}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
