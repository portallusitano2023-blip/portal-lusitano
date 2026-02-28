"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Scale, Dna, Target, ChevronRight, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

type Tr = ReturnType<typeof createTranslator>;

function getOptions(tr: Tr) {
  return [
    {
      id: "preco",
      label: tr(
        "Avaliar o preço de um cavalo",
        "Assess a horse's price",
        "Evaluar el precio de un caballo"
      ),
      icon: Calculator,
      color: "#C5A059",
      tool: tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
      href: "/calculadora-valor",
      description: tr(
        "Estimativa profissional do valor de mercado com base em 48 parâmetros: treino, linhagem, competições, saúde e mais.",
        "Professional market value estimate based on 48 parameters: training, bloodline, competitions, health and more.",
        "Estimación profesional del valor de mercado basada en 48 parámetros: entrenamiento, linaje, competiciones, salud y más."
      ),
    },
    {
      id: "comparar",
      label: tr(
        "Comparar cavalos lado a lado",
        "Compare horses side by side",
        "Comparar caballos lado a lado"
      ),
      icon: Scale,
      color: "#3b82f6",
      tool: tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
      href: "/comparador-cavalos",
      description: tr(
        "Compare até 4 cavalos com radar de 8 dimensões, score global, aptidão por disciplina e análise de valor.",
        "Compare up to 4 horses with 8-dimension radar, global score, discipline aptitude and value analysis.",
        "Compare hasta 4 caballos con radar de 8 dimensiones, puntuación global, aptitud por disciplina y análisis de valor."
      ),
    },
    {
      id: "cruzamento",
      label: tr("Planear um cruzamento", "Plan a breeding", "Planear un cruce"),
      icon: Dna,
      color: "#a855f7",
      tool: tr(
        "Verificador de Compatibilidade",
        "Compatibility Checker",
        "Verificador de Compatibilidad"
      ),
      href: "/verificador-compatibilidade",
      description: tr(
        "Avaliação genética de compatibilidade: COI previsto, pelagens da descendência, riscos hereditários e aptidão.",
        "Genetic compatibility assessment: predicted COI, offspring coat colours, hereditary risks and aptitude.",
        "Evaluación genética de compatibilidad: COI previsto, capas de la descendencia, riesgos hereditarios y aptitud."
      ),
    },
    {
      id: "perfil",
      label: tr(
        "Descobrir o meu perfil equestre",
        "Discover my equestrian profile",
        "Descubrir mi perfil ecuestre"
      ),
      icon: Target,
      color: "#22c55e",
      tool: tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
      href: "/analise-perfil",
      description: tr(
        "Quiz de 10 perguntas que identifica o seu perfil (competidor, criador, amador, investidor) com recomendações personalizadas.",
        "10-question quiz that identifies your profile (competitor, breeder, amateur, investor) with personalized recommendations.",
        "Quiz de 10 preguntas que identifica su perfil (competidor, criador, aficionado, inversor) con recomendaciones personalizadas."
      ),
    },
  ];
}

export default function ToolRecommender() {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const options = getOptions(tr);

  const [selected, setSelected] = useState<string>("preco");
  const active = options.find((o) => o.id === selected);

  return (
    <section id="recomendador" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-full mb-4">
          <HelpCircle size={14} className="text-[var(--gold)]" />
          <span className="text-xs font-semibold text-[var(--gold)]">
            {tr("Guia Rápido", "Quick Guide", "Guía Rápida")}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif text-[var(--foreground)]">
          {tr(
            "Qual ferramenta devo usar?",
            "Which tool should I use?",
            "¿Qué herramienta debo usar?"
          )}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
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
        <div
          key={selected}
          className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-5 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
        >
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
                {tr("Usar Ferramenta", "Use Tool", "Usar Herramienta")} <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
