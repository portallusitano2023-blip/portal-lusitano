"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Scale, Dna, Target, ChevronRight, HelpCircle } from "lucide-react";

const OPTIONS = [
  {
    id: "preco",
    label: "Avaliar o preço de um cavalo",
    icon: Calculator,
    color: "#C5A059",
    tool: "Calculadora de Valor",
    href: "/calculadora-valor",
    description:
      "Estimativa profissional do valor de mercado com base em 48 parâmetros: treino, linhagem, competições, saúde e mais.",
  },
  {
    id: "comparar",
    label: "Comparar cavalos lado a lado",
    icon: Scale,
    color: "#3b82f6",
    tool: "Comparador de Cavalos",
    href: "/comparador-cavalos",
    description:
      "Compare até 4 cavalos com radar de 8 dimensões, score global, aptidão por disciplina e análise de valor.",
  },
  {
    id: "cruzamento",
    label: "Planear um cruzamento",
    icon: Dna,
    color: "#a855f7",
    tool: "Verificador de Compatibilidade",
    href: "/verificador-compatibilidade",
    description:
      "Avaliação genética de compatibilidade: COI previsto, pelagens da descendência, riscos hereditários e aptidão.",
  },
  {
    id: "perfil",
    label: "Descobrir o meu perfil equestre",
    icon: Target,
    color: "#22c55e",
    tool: "Análise de Perfil",
    href: "/analise-perfil",
    description:
      "Quiz de 10 perguntas que identifica o seu perfil (competidor, criador, amador, investidor) com recomendações personalizadas.",
  },
];

export default function ToolRecommender() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = OPTIONS.find((o) => o.id === selected);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-full mb-4">
          <HelpCircle size={14} className="text-[var(--gold)]" />
          <span className="text-xs font-semibold text-[var(--gold)]">Guia Rápido</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif text-[var(--foreground)]">
          Qual ferramenta devo usar?
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(isActive ? null : opt.id)}
              className={`px-3 py-3 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-2 text-center min-h-[80px] ${
                isActive
                  ? "border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--foreground-muted)]"
              }`}
            >
              <Icon size={20} style={isActive ? { color: opt.color } : {}} />
              <span className="leading-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-5 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
          <div className="flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${active.color}15` }}
            >
              <active.icon size={20} style={{ color: active.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
                {active.tool}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-3">
                {active.description}
              </p>
              <Link
                href={active.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: active.color }}
              >
                Usar Ferramenta <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
