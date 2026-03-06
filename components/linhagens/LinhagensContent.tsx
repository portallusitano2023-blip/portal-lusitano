"use client";

import { useState } from "react";
import LocalizedLink from "@/components/LocalizedLink";
import Breadcrumb from "@/components/Breadcrumb";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Star,
  Dna,
  Clock,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ChefesGrid from "./ChefesGrid";
import LinhagemCard from "./LinhagemCard";
import LinhagemModal from "./LinhagemModal";
import type { Linhagem } from "./types";
import { linhagens, chefesLinhagem, timelineGlobal } from "@/data/linhagens-data";

export default function LinhagensContent() {
  const { t } = useLanguage();
  const [selectedLinhagem, setSelectedLinhagem] = useState<Linhagem | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const linhagensPrincipais = linhagens.filter((l) =>
    ["veiga", "andrade", "alter-real", "coudelaria-nacional"].includes(l.id)
  );

  return (
    <main className="min-h-screen bg-[var(--background)]" id="main-content">
      {/* Hero */}
      <section className="relative pt-20 sm:pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <LocalizedLink
            href="/"
            className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors mb-8 touch-manipulation"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t.linhagens.back}</span>
          </LocalizedLink>

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Linhagens" },
            ]}
          />

          <RevealOnScroll>
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-4">
                {t.linhagens.badge}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mb-6">
                {t.linhagens.title}
              </h1>
              <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto text-lg">
                {t.linhagens.subtitle}
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Introdução */}
        <RevealOnScroll delay={100}>
          <div className="mb-16 p-8 bg-[var(--background-secondary)]/50 border border-[var(--border)]">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0 hidden sm:flex">
                <Dna className="text-[var(--gold)]" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-[var(--foreground)] mb-4">
                  {t.linhagens.importance_title}
                </h2>
                <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
                  {t.linhagens.importance_p1}
                </p>
                <p className="text-[var(--foreground-secondary)] leading-relaxed">
                  {t.linhagens.importance_p2_prefix}{" "}
                  <span className="text-[var(--gold)] font-medium">
                    {t.linhagens.importance_p2_highlight}
                  </span>{" "}
                  {t.linhagens.importance_p2_suffix}
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Os 6 Chefes de Linhagem */}
        <ChefesGrid chefes={chefesLinhagem} />

        {/* Linhagens Principais */}
        <section className="mb-16">
          <RevealOnScroll>
            <h2 className="text-lg font-serif text-[var(--gold)] mb-8 flex items-center gap-2">
              <Sparkles size={20} className="fill-[var(--gold)]" />
              {t.linhagens.main_lineages}
            </h2>
          </RevealOnScroll>
          <div className="grid md:grid-cols-2 gap-8">
            {linhagensPrincipais.map((linhagem, index) => (
              <LinhagemCard
                key={linhagem.id}
                linhagem={linhagem}
                index={index}
                onSelect={() => setSelectedLinhagem(linhagem)}
              />
            ))}
          </div>
        </section>

        {/* Nota sobre outras linhagens */}
        <RevealOnScroll>
          <section className="mb-16">
            <div className="p-6 bg-[var(--background-secondary)]/30 border border-[var(--border)] rounded">
              <h3 className="text-sm font-serif text-[var(--foreground-secondary)] mb-2 flex items-center gap-2">
                <BookOpen size={16} />
                {t.linhagens.other_lineages_title}
              </h3>
              <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                {t.linhagens.other_lineages_text}
              </p>
            </div>
          </section>
        </RevealOnScroll>

        {/* Timeline Histórica */}
        <RevealOnScroll>
          <section className="mb-16">
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="w-full text-left p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] hover:border-[var(--gold)]/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Clock className="text-[var(--gold)]" size={24} />
                <div>
                  <h2 className="text-xl font-serif text-[var(--foreground)]">
                    {t.linhagens.timeline_title}
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-sm">
                    {t.linhagens.timeline_subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={20}
                className={`text-[var(--gold)] transition-transform ${showTimeline ? "rotate-90" : ""}`}
              />
            </button>

            {showTimeline && (
              <div className="mt-4 p-6 bg-[var(--background-secondary)]/30 border border-[var(--border)]">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />
                  <div className="space-y-4">
                    {timelineGlobal
                      .sort((a, b) => a.ano - b.ano)
                      .map((evento, i) => (
                        <div key={i} className="flex items-start gap-4 relative">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                              evento.destaque
                                ? "bg-[var(--gold)] text-black"
                                : "bg-[var(--background-elevated)] text-[var(--foreground-secondary)]"
                            }`}
                          >
                            {evento.destaque ? <Star size={14} /> : <Calendar size={14} />}
                          </div>
                          <div
                            className={`flex-1 ${
                              evento.destaque
                                ? "bg-[var(--gold)]/10 border-[var(--gold)]/30"
                                : "bg-[var(--background-elevated)]/30 border-[var(--border)]"
                            } border p-3`}
                          >
                            <span className="text-sm font-bold text-[var(--foreground)]">
                              {evento.ano}
                            </span>
                            <p
                              className={`text-sm ${
                                evento.destaque
                                  ? "text-[var(--foreground)]"
                                  : "text-[var(--foreground-secondary)]"
                              }`}
                            >
                              {evento.evento}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </RevealOnScroll>

        {/* Dicas para Escolher */}
        <RevealOnScroll>
          <section className="mt-20 p-8 bg-gradient-to-r from-[var(--gold)]/10 via-transparent to-[var(--gold)]/10 border border-[var(--gold)]/20">
            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
              {t.linhagens.choose_title}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-[var(--gold)] rounded-full flex items-center justify-center mb-4">
                  <span className="text-black font-bold">1</span>
                </div>
                <h3 className="text-[var(--foreground)] font-serif mb-2">
                  {t.linhagens.choose_step1_title}
                </h3>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  {t.linhagens.choose_step1_desc}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-[var(--gold)] rounded-full flex items-center justify-center mb-4">
                  <span className="text-black font-bold">2</span>
                </div>
                <h3 className="text-[var(--foreground)] font-serif mb-2">
                  {t.linhagens.choose_step2_title}
                </h3>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  {t.linhagens.choose_step2_desc}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-[var(--gold)] rounded-full flex items-center justify-center mb-4">
                  <span className="text-black font-bold">3</span>
                </div>
                <h3 className="text-[var(--foreground)] font-serif mb-2">
                  {t.linhagens.choose_step3_title}
                </h3>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  {t.linhagens.choose_step3_desc}
                </p>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* Modal de Linhagem */}
        {selectedLinhagem && (
          <LinhagemModal linhagem={selectedLinhagem} onClose={() => setSelectedLinhagem(null)} />
        )}
      </div>
    </main>
  );
}
