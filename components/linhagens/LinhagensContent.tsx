"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Award,
  ChevronRight,
  X,
  Star,
  Dna,
  Crown,
  Shield,
  Landmark,
  Heart,
  Target,
  Clock,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Linhagem } from "./types";
import { linhagens, chefesLinhagem, timelineGlobal } from "@/data/linhagens-data";

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function LinhagensContent() {
  const { t } = useLanguage();
  const [selectedLinhagem, setSelectedLinhagem] = useState<Linhagem | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const linhagensPrincipais = linhagens.filter((l) =>
    ["veiga", "andrade", "alter-real", "coudelaria-nacional"].includes(l.id)
  );

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors mb-8 touch-manipulation"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t.linhagens.back}</span>
          </Link>

          <div className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
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
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Introdução */}
        <div
          className="mb-16 p-8 bg-[var(--background-secondary)]/50 border border-[var(--border)] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
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

        {/* Os 6 Chefes de Linhagem */}
        <section
          className="mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.15s" }}
        >
          <h2 className="text-2xl font-serif text-[var(--foreground)] mb-2 text-center">
            {t.linhagens.heads_title}
          </h2>
          <p className="text-[var(--foreground-muted)] text-sm text-center mb-8">
            {t.linhagens.heads_subtitle}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {chefesLinhagem.map((chefe) => (
              <div
                key={chefe.nome}
                className={`text-center p-4 border transition-colors ${
                  chefe.tipo === "Égua"
                    ? "bg-[var(--gold)]/10 border-[var(--gold)]/30"
                    : "bg-[var(--background-secondary)]/50 border-[var(--border)] hover:border-[var(--gold)]/30"
                }`}
              >
                <div className="w-12 h-12 mx-auto bg-[var(--gold)]/10 rounded-full flex items-center justify-center mb-3">
                  {chefe.tipo === "Égua" ? (
                    <Heart className="text-[var(--gold)]" size={20} />
                  ) : (
                    <Crown className="text-[var(--gold)]" size={20} />
                  )}
                </div>
                <h3 className="text-[var(--foreground)] font-serif text-sm mb-1">{chefe.nome}</h3>
                <p className="text-[var(--foreground-muted)] text-xs">{chefe.ano}</p>
                <p className="text-[var(--gold)] text-xs mt-1">{chefe.marca}</p>
                <p className="text-[var(--foreground-muted)] text-[10px] mt-1 uppercase tracking-wider">
                  {chefe.linhagem}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Linhagens Principais */}
        <section className="mb-16">
          <h2
            className="text-lg font-serif text-[var(--gold)] mb-8 flex items-center gap-2 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            <Sparkles size={20} className="fill-[var(--gold)]" />
            {t.linhagens.main_lineages}
          </h2>
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
        <section className="mb-16">
          <div
            className="p-6 bg-[var(--background-secondary)]/30 border border-[var(--border)] rounded opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.25s" }}
          >
            <h3 className="text-sm font-serif text-[var(--foreground-secondary)] mb-2 flex items-center gap-2">
              <BookOpen size={16} />
              {t.linhagens.other_lineages_title}
            </h3>
            <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
              {t.linhagens.other_lineages_text}
            </p>
          </div>
        </section>

        {/* Timeline Histórica */}
        <section
          className="mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.35s" }}
        >
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

        {/* Dicas para Escolher */}
        <section
          className="mt-20 p-8 bg-gradient-to-r from-[var(--gold)]/10 via-transparent to-[var(--gold)]/10 border border-[var(--gold)]/20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.4s" }}
        >
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

        {/* Modal de Linhagem */}
        {selectedLinhagem && (
          <LinhagemModal linhagem={selectedLinhagem} onClose={() => setSelectedLinhagem(null)} />
        )}
      </div>
    </main>
  );
}

// =============================================================================
// CARD DE LINHAGEM (PRINCIPAL)
// =============================================================================

function LinhagemCard({
  linhagem,
  index,
  onSelect,
}: {
  linhagem: Linhagem;
  index: number;
  onSelect: () => void;
}) {
  const { t } = useLanguage();
  const iconMap: Record<string, typeof Shield> = {
    veiga: Target,
    andrade: Award,
    "alter-real": Landmark,
    "coudelaria-nacional": Shield,
  };
  const Icon = iconMap[linhagem.id] || Dna;

  return (
    <button
      onClick={onSelect}
      className="text-left group relative overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      <div className="relative h-96 bg-gradient-to-br from-[var(--background-secondary)] via-[var(--background-secondary)]/80 to-[var(--gold)]/5">
        {/* Background icon */}
        <div className="absolute top-8 right-8 opacity-10">
          <Icon size={120} className="text-[var(--gold)]" />
        </div>

        <div className="absolute inset-0 border border-[var(--border)] group-hover:border-[var(--gold)]/50 transition-colors" />

        {/* Badge de data */}
        <div className="absolute top-4 left-4 bg-black/60 text-[var(--gold)] px-3 py-1 text-sm flex items-center gap-2">
          <Calendar size={14} />
          {t.linhagens.since} {linhagem.anoFundacao}
        </div>

        {/* Nível de confiança */}
        <div className="absolute top-4 right-4 bg-black/60 text-[var(--foreground-secondary)] px-2 py-1 text-[10px] uppercase tracking-wider">
          {linhagem.confianca}
        </div>

        {/* Conteúdo */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Chefe de Linhagem */}
          {linhagem.cabecaLinhagem && (
            <div className="flex items-center gap-2 mb-3">
              <Crown size={14} className="text-[var(--gold)]" />
              <span className="text-xs text-[var(--gold)]">
                {t.linhagens.lineage_head}: {linhagem.cabecaLinhagem}
              </span>
            </div>
          )}

          <h3 className="text-2xl font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors mb-2">
            {t.linhagens.lineage_prefix} {linhagem.nome}
          </h3>

          <div className="flex items-center gap-2 text-[var(--foreground-secondary)] text-sm mb-3">
            <MapPin size={14} className="text-[var(--gold)]" />
            {linhagem.origem}
          </div>

          <p className="text-[var(--foreground-secondary)] text-sm line-clamp-2 mb-4">
            {linhagem.descricao}
          </p>

          {/* Aptidões */}
          <div className="flex flex-wrap gap-2 mb-4">
            {linhagem.aptidoes.slice(0, 4).map((apt) => (
              <span
                key={apt}
                className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-0.5"
              >
                {apt}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[var(--gold)] text-sm">
            {t.linhagens.explore_lineage}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// MODAL DE LINHAGEM (EXPANDIDO)
// =============================================================================

function LinhagemModal({ linhagem, onClose }: { linhagem: Linhagem; onClose: () => void }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "historia" | "caracteristicas" | "cavalos" | "timeline"
  >("historia");

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto animate-[fadeSlideIn_0.3s_ease-out_forwards]"
      onClick={onClose}
    >
      <div
        className="bg-[var(--background-secondary)] border border-[var(--border)] max-w-4xl w-full my-8 relative opacity-0 animate-[scaleIn_0.3s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="relative h-48 md:h-56 bg-gradient-to-br from-[var(--gold)]/20 via-[var(--background-secondary)] to-[var(--background-secondary)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[100px] font-serif text-[var(--gold)]/10">
              {linhagem.nome.charAt(0)}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-secondary)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-2">
              {linhagem.cabecaLinhagem && (
                <span className="text-xs bg-[var(--gold)]/20 text-[var(--gold)] px-2 py-1 flex items-center gap-1">
                  <Crown size={12} />
                  {linhagem.cabecaLinhagem}
                </span>
              )}
              <span className="text-xs bg-[var(--background-elevated)] text-[var(--foreground-secondary)] px-2 py-1">
                {t.linhagens.confidence_label}: {linhagem.confianca}
              </span>
            </div>
            <h2 className="text-3xl font-serif text-[var(--foreground)]">
              {t.linhagens.lineage_prefix} {linhagem.nome}
            </h2>
            <p className="text-[var(--gold)] mt-1">
              {linhagem.origem} &bull; {t.linhagens.since} {linhagem.anoFundacao}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)] px-8">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {[
              { id: "historia" as const, label: t.linhagens.tab_history, icon: BookOpen },
              {
                id: "caracteristicas" as const,
                label: t.linhagens.tab_characteristics,
                icon: Dna,
              },
              { id: "cavalos" as const, label: t.linhagens.tab_notable_horses, icon: Star },
              { id: "timeline" as const, label: t.linhagens.tab_timeline, icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[var(--gold)] text-[var(--gold)]"
                    : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {/* Tab: História */}
          {activeTab === "historia" && (
            <div className="space-y-6">
              {/* Fundador */}
              <div className="flex items-center gap-3 p-4 bg-[var(--gold)]/10 border border-[var(--gold)]/20">
                <Users className="text-[var(--gold)]" size={24} />
                <div>
                  <div className="text-[var(--foreground-muted)] text-xs uppercase">
                    {t.linhagens.founder}
                  </div>
                  <div className="text-[var(--foreground)] font-serif">{linhagem.fundador}</div>
                </div>
              </div>

              {/* Cabeça de Linhagem Info */}
              {linhagem.cabecaLinhagemInfo && (
                <div className="flex items-center gap-3 p-4 bg-[var(--background-elevated)]/50 border border-[var(--border)]">
                  <Crown className="text-[var(--gold)]" size={24} />
                  <div>
                    <div className="text-[var(--foreground-muted)] text-xs uppercase">
                      {t.linhagens.lineage_head}
                    </div>
                    <div className="text-[var(--foreground-secondary)] text-sm">
                      {linhagem.cabecaLinhagemInfo}
                    </div>
                  </div>
                </div>
              )}

              {/* História Completa */}
              <div>
                <h3 className="text-lg font-serif text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-[var(--gold)]" />
                  {t.linhagens.history}
                </h3>
                <div className="space-y-4">
                  {linhagem.historiaCompleta.map((paragrafo, i) => (
                    <p key={i} className="text-[var(--foreground-secondary)] leading-relaxed">
                      {paragrafo}
                    </p>
                  ))}
                </div>
              </div>

              {/* Factos Chave */}
              <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/20 p-4">
                <h3 className="text-sm font-semibold text-[var(--gold)] mb-3 flex items-center gap-2">
                  <Sparkles size={14} />
                  {t.linhagens.key_facts}
                </h3>
                <ul className="space-y-2">
                  {linhagem.factosChave.map((facto, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                      <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full mt-1.5 flex-shrink-0" />
                      {facto}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab: Características */}
          {activeTab === "caracteristicas" && (
            <div className="space-y-8">
              {/* Morfologia */}
              <div>
                <h3 className="text-lg font-serif text-[var(--foreground)] mb-3">
                  {t.linhagens.morphology}
                </h3>
                <ul className="grid md:grid-cols-2 gap-2">
                  {linhagem.caracteristicas.map((car, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[var(--foreground-secondary)]"
                    >
                      <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full" />
                      {car}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Temperamento */}
              <div>
                <h3 className="text-lg font-serif text-[var(--foreground)] mb-3">
                  {t.linhagens.temperament_label}
                </h3>
                <p className="text-[var(--foreground-secondary)] leading-relaxed">
                  {linhagem.temperamento}
                </p>
              </div>

              {/* Cores e Aptidões */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-serif text-[var(--foreground)] mb-3">
                    {t.linhagens.common_colors}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linhagem.coresComuns.map((cor) => (
                      <span
                        key={cor}
                        className="bg-[var(--background-elevated)] text-[var(--foreground-secondary)] px-3 py-1 text-sm"
                      >
                        {cor}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif text-[var(--foreground)] mb-3">
                    {t.linhagens.aptitudes}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linhagem.aptidoes.map((apt) => (
                      <span
                        key={apt}
                        className="bg-[var(--gold)]/10 text-[var(--gold)] px-3 py-1 text-sm"
                      >
                        {apt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coudelarias */}
              {linhagem.coudelariasPrincipais.length > 0 && (
                <div>
                  <h3 className="text-lg font-serif text-[var(--foreground)] mb-3">
                    {t.linhagens.reference_studs}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linhagem.coudelariasPrincipais.map((coud) => (
                      <span
                        key={coud}
                        className="bg-[var(--background-elevated)] text-[var(--foreground-secondary)] px-3 py-1 text-sm"
                      >
                        {coud}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Cavalos Notáveis */}
          {activeTab === "cavalos" && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Award size={18} className="text-[var(--gold)]" />
                {t.linhagens.notable_horses_title}
              </h3>
              {linhagem.cavalosNotaveis.length > 0 ? (
                <div className="space-y-4">
                  {linhagem.cavalosNotaveis.map((cavalo, i) => (
                    <div
                      key={i}
                      className="p-5 bg-[var(--background-elevated)]/50 border border-[var(--border)]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={16} className="text-[var(--gold)] fill-[var(--gold)]" />
                        <span className="text-[var(--foreground)] font-serif text-lg">
                          {cavalo.nome}
                        </span>
                        {cavalo.ano && (
                          <span className="text-[var(--foreground-muted)] text-sm">
                            ({cavalo.ano})
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed pl-6">
                        {cavalo.conquistas}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--foreground-muted)]">
                  <Star size={32} className="mx-auto mb-3 opacity-30" />
                  <p>{t.linhagens.no_notable_horses}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Timeline */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Clock size={18} className="text-[var(--gold)]" />
                {t.linhagens.historic_moments}
              </h3>
              {linhagem.timeline.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />
                  <div className="space-y-4">
                    {linhagem.timeline
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
              ) : (
                <div className="text-center py-8 text-[var(--foreground-muted)]">
                  <Clock size={32} className="mx-auto mb-3 opacity-30" />
                  <p>{t.linhagens.no_timeline}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
