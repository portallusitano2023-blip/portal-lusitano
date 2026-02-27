"use client";

import Link from "next/link";
import { Sparkles, ClipboardList, Zap, ArrowRight, Clock } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

export default function HowItWorksSection() {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  const steps = [
    {
      step: "01",
      title: tr("Escolhe a ferramenta", "Choose the tool", "Elige la herramienta"),
      desc: tr(
        "Calculadora de Valor para estimativa de preço, Comparador para decidir entre cavalos, Compatibilidade para planear cruzamentos, ou Análise de Perfil para descobrir o teu tipo de cavaleiro.",
        "Value Calculator for price estimation, Comparator to decide between horses, Compatibility to plan crossings, or Profile Analysis to discover your rider type.",
        "Calculadora de Valor para estimación de precio, Comparador para decidir entre caballos, Compatibilidad para planificar cruzamientos, o Análisis de Perfil para descubrir tu tipo de jinete."
      ),
      icon: Sparkles,
      time: tr("30 seg", "30 sec", "30 seg"),
    },
    {
      step: "02",
      title: tr(
        "Preenche o formulário guiado",
        "Fill in the guided form",
        "Rellena el formulario guiado"
      ),
      desc: tr(
        "Introduz linhagem, morfologia, treino e certificações do teu Lusitano. Cada campo tem explicações e exemplos — não precisas de ser especialista.",
        "Enter bloodline, morphology, training and certifications of your Lusitano. Each field has explanations and examples — no expertise needed.",
        "Introduce linaje, morfología, entrenamiento y certificaciones de tu Lusitano. Cada campo tiene explicaciones y ejemplos — no necesitas ser experto."
      ),
      icon: ClipboardList,
      time: tr("2–3 min", "2–3 min", "2–3 min"),
    },
    {
      step: "03",
      title: tr(
        "Recebe o relatório instantâneo",
        "Get your instant report",
        "Recibe el informe instantáneo"
      ),
      desc: tr(
        "O relatório aparece de imediato com scores, gráficos e recomendações. Com PRO, exporta em PDF, guarda no histórico e partilha com um link.",
        "Your report appears instantly with scores, charts and recommendations. With PRO, export as PDF, save to history and share with a link.",
        "El informe aparece al instante con puntuaciones, gráficos y recomendaciones. Con PRO, exporta en PDF, guarda en el historial y comparte con un enlace."
      ),
      icon: Zap,
      time: tr("instantâneo", "instant", "instantáneo"),
    },
  ];

  return (
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <AnimateOnScroll className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
            {tr("Simples e rápido", "Simple and fast", "Simple y rápido")}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
            {tr("Como funciona", "How it works", "Cómo funciona")}
          </h2>
          <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto text-sm">
            {tr(
              "Resultados profissionais em menos de 3 minutos, sem necessidade de conta.",
              "Professional results in under 3 minutes, no account needed.",
              "Resultados profesionales en menos de 3 minutos, sin necesidad de cuenta."
            )}
          </p>
          {/* Total time badge */}
          <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-full text-xs text-[var(--gold)] font-medium">
            <Clock size={12} />
            {tr("Tempo total: ~3 minutos", "Total time: ~3 minutes", "Tiempo total: ~3 minutos")}
          </div>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

          {steps.map((item, i) => (
            <AnimateOnScroll key={item.step} delay={i * 120}>
              <div className="relative flex flex-col items-center text-center p-6">
                {/* Step number circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-[var(--background-secondary)] border border-[var(--gold)]/30 flex items-center justify-center shadow-lg shadow-[var(--gold)]/5">
                    <item.icon size={28} className="text-[var(--gold)]" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">
                    {item.step.replace("0", "")}
                  </span>
                </div>

                <h3 className="text-base font-serif text-[var(--foreground)] mb-2">{item.title}</h3>

                {/* Time indicator */}
                <span className="inline-flex items-center gap-1 text-[10px] text-[var(--foreground-muted)] mb-3">
                  <Clock size={10} />
                  {item.time}
                </span>

                <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Mini CTA below steps */}
        <AnimateOnScroll className="text-center mt-10">
          <Link
            href="/analise-perfil"
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] text-sm font-medium rounded-full hover:bg-[var(--gold)]/20 transition-colors"
          >
            <Sparkles size={15} />
            {tr(
              "Experimentar agora — é grátis",
              "Try it now — it's free",
              "Probar ahora — es gratis"
            )}
            <ArrowRight size={15} />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
