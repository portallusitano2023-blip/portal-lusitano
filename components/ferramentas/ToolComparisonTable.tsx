"use client";

import { Check, X } from "lucide-react";

const TOOLS = [
  { name: "Calculadora", short: "Calc." },
  { name: "Comparador", short: "Comp." },
  { name: "Compatibilidade", short: "Compat." },
  { name: "Perfil", short: "Perfil" },
];

const FEATURES: { label: string; tools: boolean[] }[] = [
  { label: "Avaliação de valor em €", tools: [true, false, false, false] },
  { label: "Comparação lado a lado", tools: [false, true, false, false] },
  { label: "Score global (0-100)", tools: [false, true, false, false] },
  { label: "Radar multi-dimensão", tools: [false, true, false, false] },
  { label: "Aptidão por disciplina", tools: [false, true, false, false] },
  { label: "Previsão de pelagem", tools: [false, false, true, false] },
  { label: "COI / Consanguinidade", tools: [false, false, true, false] },
  { label: "Análise genética", tools: [false, false, true, false] },
  { label: "Perfil de comprador", tools: [false, false, false, true] },
  { label: "Recomendações personalizadas", tools: [true, true, true, true] },
  { label: "Exportar PDF", tools: [true, true, true, true] },
  { label: "Histórico de análises", tools: [true, true, true, true] },
];

export default function ToolComparisonTable() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-serif text-[var(--foreground)]">
          Comparação de Funcionalidades
        </h2>
        <p className="text-sm text-[var(--foreground-muted)] mt-2">
          Cada ferramenta resolve uma necessidade diferente
        </p>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-sm border-collapse" style={{ minWidth: "480px" }}>
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left text-xs text-[var(--foreground-muted)] pb-3 pr-4 font-medium">
                Funcionalidade
              </th>
              {TOOLS.map((tool, i) => (
                <th
                  key={i}
                  className="text-center text-xs pb-3 px-2 font-semibold text-[var(--foreground-secondary)]"
                >
                  <span className="hidden sm:inline">{tool.name}</span>
                  <span className="sm:hidden">{tool.short}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/30">
            {FEATURES.map((feature, fi) => (
              <tr key={fi} className="hover:bg-[var(--background-secondary)]/30 transition-colors">
                <td className="py-2.5 pr-4 text-xs text-[var(--foreground-secondary)]">
                  {feature.label}
                </td>
                {feature.tools.map((has, ti) => (
                  <td key={ti} className="py-2.5 px-2 text-center">
                    {has ? (
                      <Check size={14} className="text-emerald-400 mx-auto" />
                    ) : (
                      <X size={14} className="text-[var(--foreground-muted)]/30 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
