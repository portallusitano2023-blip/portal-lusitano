"use client";

import Link from "next/link";
import { UserCheck, Calculator, BarChart3, Heart, ArrowRight, ChevronRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

const journeySteps = (tr: ReturnType<typeof createTranslator>) => [
  {
    icon: UserCheck,
    title: tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
    desc: tr(
      "Descobre o teu perfil de cavaleiro e o tipo de Lusitano ideal para ti.",
      "Discover your rider profile and the ideal Lusitano type for you.",
      "Descubre tu perfil de jinete y el tipo de Lusitano ideal para ti."
    ),
    href: "/analise-perfil",
    color: "emerald",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    glowColor: "shadow-emerald-500/10",
  },
  {
    icon: Calculator,
    title: tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
    desc: tr(
      "Estima o valor de mercado com base em 20+ variáveis especializadas.",
      "Estimate market value based on 20+ specialised variables.",
      "Estima el valor de mercado basado en 20+ variables especializadas."
    ),
    href: "/calculadora-valor",
    color: "amber",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-500/10",
  },
  {
    icon: BarChart3,
    title: tr("Comparador", "Comparator", "Comparador"),
    desc: tr(
      "Compara até 4 cavalos lado a lado com radar e ranking.",
      "Compare up to 4 horses side by side with radar and ranking.",
      "Compara hasta 4 caballos con radar y ranking."
    ),
    href: "/comparador-cavalos",
    color: "blue",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/10",
  },
  {
    icon: Heart,
    title: tr("Compatibilidade", "Compatibility", "Compatibilidad"),
    desc: tr(
      "Verifica compatibilidade genética e prevê a pelagem dos potros.",
      "Check genetic compatibility and predict foal coat colours.",
      "Verifica compatibilidad genética y predice la capa de los potros."
    ),
    href: "/verificador-compatibilidade",
    color: "rose",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    borderColor: "border-rose-500/30",
    glowColor: "shadow-rose-500/10",
  },
];

export default function ToolJourneySection() {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const steps = journeySteps(tr);

  return (
    <section id="jornada" className="px-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <AnimateOnScroll className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
            {tr("Jornada completa", "Complete journey", "Jornada completa")}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
            {tr(
              "As ferramentas ligam-se entre si",
              "Tools connect to each other",
              "Las herramientas se conectan entre sí"
            )}
          </h2>
          <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto text-sm">
            {tr(
              "Cada ferramenta alimenta a seguinte com dados — sem repetir informação. Começa por qualquer uma ou segue a jornada completa.",
              "Each tool feeds the next with data — no repeated input. Start with any tool or follow the full journey.",
              "Cada herramienta alimenta la siguiente con datos — sin repetir información. Empieza por cualquiera o sigue la jornada completa."
            )}
          </p>
        </AnimateOnScroll>

        {/* Journey flow */}
        <div className="relative">
          {/* Desktop connector line */}
          <div
            className="hidden lg:block absolute top-[3.5rem] left-[10%] right-[10%] h-px"
            aria-hidden="true"
          >
            <div className="w-full h-full bg-gradient-to-r from-emerald-500/30 via-[var(--gold)]/30 to-rose-500/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {steps.map((step, i) => (
              <AnimateOnScroll key={step.href} delay={i * 100}>
                <Link
                  href={step.href}
                  className={`group relative block p-6 bg-[var(--background-secondary)]/80 border ${step.borderColor} rounded-2xl hover:shadow-xl ${step.glowColor} hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Step number */}
                  <span className="absolute -top-2.5 -left-1 sm:left-auto sm:-right-1 w-6 h-6 rounded-full bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center z-10">
                    {i + 1}
                  </span>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 ${step.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <step.icon className={step.iconColor} size={26} />
                  </div>

                  <h3 className="text-base font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-[var(--foreground-muted)] text-xs leading-relaxed mb-4">
                    {step.desc}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--gold)] group-hover:gap-2.5 transition-all">
                    {tr("Experimentar", "Try it", "Probar")}
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>

                  {/* Arrow connector (mobile/tablet between cards) */}
                  {i < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center py-2 -mb-8 relative z-10 sm:hidden">
                      <ChevronRight size={20} className="text-[var(--gold)]/40 rotate-90" />
                    </div>
                  )}
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <AnimateOnScroll className="text-center mt-12">
          <Link
            href="/analise-perfil"
            className="group inline-flex items-center gap-2.5 px-8 py-4 min-h-[48px] bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold)]/5 border border-[var(--gold)]/30 text-[var(--gold)] text-sm font-semibold rounded-xl hover:from-[var(--gold)]/25 hover:to-[var(--gold)]/10 hover:border-[var(--gold)]/50 transition-all"
          >
            {tr(
              "Começar a Jornada Completa",
              "Start the Full Journey",
              "Empezar la Jornada Completa"
            )}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-[var(--foreground-muted)] text-xs mt-3">
            {tr(
              "Os dados passam automaticamente de ferramenta em ferramenta",
              "Data passes automatically from tool to tool",
              "Los datos pasan automáticamente de herramienta en herramienta"
            )}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
