"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  Star,
  Crown,
  BookOpen,
  Dna,
  Clock,
  Calendar,
  Users,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Linhagem } from "./types";

// Cavalos that exist in /cavalos-famosos with their IDs
const CAVALOS_FAMOSOS_MAP: Record<string, string> = {
  Novilheiro: "1",
  Oxidado: "4",
  Firme: "9",
  Nilo: "10",
  Hucharia: "18",
  "Rubi AR": "26",
};

interface LinhagemModalProps {
  linhagem: Linhagem;
  onClose: () => void;
}

export default function LinhagemModal({ linhagem, onClose }: LinhagemModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "historia" | "caracteristicas" | "cavalos" | "timeline"
  >("historia");
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key + body scroll lock + focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      // Basic focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Focus the modal on open
    modalRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="bg-[var(--background-secondary)] border border-[var(--border)] max-w-4xl w-full my-8 relative outline-none animate-[scaleIn_0.3s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black transition-colors"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="relative h-48 md:h-56 bg-gradient-to-br from-[var(--gold)]/20 via-[var(--background-secondary)] to-[var(--background-secondary)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[100px] font-serif text-[var(--gold)]/10" aria-hidden="true">
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
            <h2 id="modal-title" className="text-3xl font-serif text-[var(--foreground)]">
              {t.linhagens.lineage_prefix} {linhagem.nome}
            </h2>
            <p className="text-[var(--gold)] mt-1">
              {linhagem.origem} &bull; {t.linhagens.since} {linhagem.anoFundacao}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)] px-8" role="tablist">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {[
              { id: "historia" as const, label: t.linhagens.tab_history, icon: BookOpen },
              { id: "caracteristicas" as const, label: t.linhagens.tab_characteristics, icon: Dna },
              { id: "cavalos" as const, label: t.linhagens.tab_notable_horses, icon: Star },
              { id: "timeline" as const, label: t.linhagens.tab_timeline, icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
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
        <div className="p-8 max-h-[60vh] overflow-y-auto" role="tabpanel">
          {activeTab === "historia" && <HistoriaTab linhagem={linhagem} />}
          {activeTab === "caracteristicas" && <CaracteristicasTab linhagem={linhagem} />}
          {activeTab === "cavalos" && <CavalosTab linhagem={linhagem} />}
          {activeTab === "timeline" && <TimelineTab linhagem={linhagem} />}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SUB-TABS
// =============================================================================

function HistoriaTab({ linhagem }: { linhagem: Linhagem }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-[var(--gold)]/10 border border-[var(--gold)]/20">
        <Users className="text-[var(--gold)]" size={24} />
        <div>
          <div className="text-[var(--foreground-muted)] text-xs uppercase">
            {t.linhagens.founder}
          </div>
          <div className="text-[var(--foreground)] font-serif">{linhagem.fundador}</div>
        </div>
      </div>

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
  );
}

function CaracteristicasTab({ linhagem }: { linhagem: Linhagem }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-serif text-[var(--foreground)] mb-3">
          {t.linhagens.morphology}
        </h3>
        <ul className="grid md:grid-cols-2 gap-2">
          {linhagem.caracteristicas.map((car, i) => (
            <li key={i} className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full" />
              {car}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-serif text-[var(--foreground)] mb-3">
          {t.linhagens.temperament_label}
        </h3>
        <p className="text-[var(--foreground-secondary)] leading-relaxed">
          {linhagem.temperamento}
        </p>
      </div>

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
              <span key={apt} className="bg-[var(--gold)]/10 text-[var(--gold)] px-3 py-1 text-sm">
                {apt}
              </span>
            ))}
          </div>
        </div>
      </div>

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
  );
}

function CavalosTab({ linhagem }: { linhagem: Linhagem }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-[var(--foreground)] mb-4 flex items-center gap-2">
        <Award size={18} className="text-[var(--gold)]" />
        {t.linhagens.notable_horses_title}
      </h3>
      {linhagem.cavalosNotaveis.length > 0 ? (
        <div className="space-y-4">
          {linhagem.cavalosNotaveis.map((cavalo, i) => {
            const famososId = CAVALOS_FAMOSOS_MAP[cavalo.nome];
            return (
              <div
                key={i}
                className="p-5 bg-[var(--background-elevated)]/50 border border-[var(--border)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-[var(--gold)] fill-[var(--gold)]" />
                  <span className="text-[var(--foreground)] font-serif text-lg">{cavalo.nome}</span>
                  {cavalo.ano && (
                    <span className="text-[var(--foreground-muted)] text-sm">({cavalo.ano})</span>
                  )}
                </div>
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed pl-6">
                  {cavalo.conquistas}
                </p>
                {famososId && (
                  <Link
                    href={`/cavalos-famosos#cavalo-${famososId}`}
                    className="inline-flex items-center gap-1 mt-3 ml-6 text-xs text-[var(--gold)] hover:underline"
                  >
                    {t.linhagens.view_full_profile}
                    <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--foreground-muted)]">
          <Star size={32} className="mx-auto mb-3 opacity-30" />
          <p>{t.linhagens.no_notable_horses}</p>
        </div>
      )}
    </div>
  );
}

function TimelineTab({ linhagem }: { linhagem: Linhagem }) {
  const { t } = useLanguage();

  return (
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
                    <span className="text-sm font-bold text-[var(--foreground)]">{evento.ano}</span>
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
  );
}
