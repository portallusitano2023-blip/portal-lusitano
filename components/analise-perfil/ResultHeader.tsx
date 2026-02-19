"use client";

import { RefObject } from "react";
import {
  Check,
  Save,
  FileDown,
  Download,
  MessageCircle,
  Facebook,
  Instagram,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result, ScorePercentage } from "@/components/analise-perfil/types";

const SUB_PROFILE_LABELS: Record<string, string> = {
  competidor_elite: "Alta Competição FEI",
  competidor_nacional: "Competição Nacional",
  competidor_trabalho: "Equitação de Trabalho",
  amador_projeto: "Projecto Jovem",
};

interface ResultHeaderProps {
  result: Result;
  scorePercentages: ScorePercentage[];
  saved: boolean;
  copied: boolean;
  badgeRef: RefObject<HTMLDivElement | null>;
  subProfile?: string | null;
  confidence?: number;
  onSave: () => void;
  onDownloadPDF: () => void;
  onDownloadBadge: () => void;
  onShareWhatsApp: () => void;
  onShareFacebook: () => void;
  onShareInstagram: () => void;
  onCopyLink: () => void;
}

export default function ResultHeader({
  result,
  scorePercentages,
  saved,
  copied,
  badgeRef,
  subProfile,
  confidence,
  onSave,
  onDownloadPDF,
  onDownloadBadge,
  onShareWhatsApp,
  onShareFacebook,
  onShareInstagram,
  onCopyLink,
}: ResultHeaderProps) {
  const { t } = useLanguage();

  return (
    <section
      className={`relative pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b ${result.color} to-transparent`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="opacity-0 animate-[scaleIn_0.5s_ease-out_forwards]">
          <div className="w-24 h-24 mx-auto bg-[var(--background-secondary)]/50 border border-[var(--gold)]/30 rounded-full flex items-center justify-center mb-6">
            {result.icon}
          </div>
          <span className="text-[var(--gold)] text-xs uppercase tracking-[0.3em] block mb-3">
            {t.analise_perfil.your_profile_is}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
            {result.title}
          </h1>

          {/* Sub-profile badge */}
          {subProfile && SUB_PROFILE_LABELS[subProfile] && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--gold)]/15 border border-[var(--gold)]/40 rounded-full text-xs font-medium text-[var(--gold)]">
                <Sparkles size={11} />
                Especialização: {SUB_PROFILE_LABELS[subProfile]}
              </span>
            </div>
          )}

          {/* Prominent percentage score */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
            <span className="text-5xl font-serif text-[#C5A059] tabular-nums leading-none">
              {scorePercentages[0]?.percentage ?? 0}%
            </span>
            <span className="text-sm text-[var(--foreground-muted)] leading-tight text-left">
              de
              <br />
              afinidade
            </span>
            {confidence !== undefined && confidence > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  confidence >= 80
                    ? "bg-emerald-500/15 text-emerald-400"
                    : confidence >= 65
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-orange-500/15 text-orange-400"
                }`}
              >
                {confidence}% confiança
              </span>
            )}
          </div>

          {/* Perfil Secundário — sempre visível se houver segundo perfil */}
          {scorePercentages[1] && (
            <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 text-xs font-semibold text-[var(--gold)]">
                {scorePercentages[0]?.label ?? result.title} {scorePercentages[0]?.percentage ?? 0}%
              </span>
              <span className="text-[var(--foreground-muted)] text-xs">+</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--foreground-secondary)]">
                {scorePercentages[1].label} {scorePercentages[1].percentage}%
              </span>
            </div>
          )}

          {/* Low confidence note */}
          {confidence !== undefined && confidence < 65 && scorePercentages[1] && (
            <p className="text-xs text-[var(--foreground-muted)] mb-3 italic">
              O seu perfil tem também características de{" "}
              <span className="text-[var(--foreground-secondary)]">
                {scorePercentages[1].label}
              </span>{" "}
              — leia ambas as análises.
            </p>
          )}

          {/* Distribuição completa dos 4 perfis */}
          {scorePercentages.length >= 3 && (
            <div className="max-w-xs mx-auto mb-5 mt-2 space-y-2">
              {scorePercentages.map((sp, idx) => (
                <div key={sp.profile} className="flex items-center gap-2">
                  <span className="text-xs text-[var(--foreground-muted)] w-28 text-right shrink-0 truncate">
                    {sp.label}
                  </span>
                  <div className="flex-1 h-1.5 bg-[var(--background-card)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${sp.percentage}%`,
                        backgroundColor: idx === 0 ? "#C5A059" : idx === 1 ? "#6b7280" : "#374151",
                        opacity: idx === 0 ? 1 : idx === 1 ? 0.7 : 0.4,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-medium tabular-nums w-8 text-left shrink-0"
                    style={{
                      color: idx === 0 ? "#C5A059" : "var(--foreground-muted)",
                      opacity: idx === 0 ? 1 : 0.6,
                    }}
                  >
                    {sp.percentage}%
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-base sm:text-lg text-[var(--gold)] italic mb-6">{result.subtitle}</p>
          <p className="text-sm sm:text-base text-[var(--foreground-secondary)] max-w-2xl mx-auto leading-relaxed mb-8">
            {result.description}
          </p>
          {/* Action buttons — grouped by category */}
          <div className="flex flex-col items-center gap-3 mb-6">
            {/* Primary actions */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={onSave}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-all ${
                  saved
                    ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
                    : "border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]/50"
                }`}
              >
                {saved ? <Check size={15} /> : <Save size={15} />}
                {saved ? t.analise_perfil.saved : t.analise_perfil.save}
              </button>
              <button
                onClick={onDownloadPDF}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] transition-all"
              >
                <FileDown size={15} />
                PDF
              </button>
              <button
                onClick={onDownloadBadge}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]/50 transition-all"
              >
                <Download size={15} />
                Badge
              </button>
              <button
                onClick={onCopyLink}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-all ${
                  copied
                    ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
                    : "border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]/50"
                }`}
              >
                {copied ? <Check size={15} /> : <LinkIcon size={15} />}
                {copied ? t.analise_perfil.copied : t.analise_perfil.link}
              </button>
            </div>
            {/* Social share row */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={onShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-green-600/40 text-green-500 hover:bg-green-600/10 hover:border-green-600/70 transition-all"
              >
                <MessageCircle size={13} />
                WhatsApp
              </button>
              <button
                onClick={onShareFacebook}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-blue-600/40 text-blue-400 hover:bg-blue-600/10 hover:border-blue-600/70 transition-all"
              >
                <Facebook size={13} />
                Facebook
              </button>
              <button
                onClick={onShareInstagram}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-pink-500/40 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/70 transition-all"
              >
                <Instagram size={13} />
                Instagram
              </button>
            </div>
          </div>
          {/* Downloadable Badge (hidden, used for export) */}
          <div className="hidden">
            <div
              ref={badgeRef}
              className="w-[540px] h-[540px] bg-[var(--background)] p-8 flex flex-col items-center justify-center"
            >
              <div className="w-full h-full border-4 border-[var(--gold)] p-8 flex flex-col items-center justify-center">
                <p className="text-[var(--gold)] text-sm uppercase tracking-[0.3em] mb-4">
                  Portal Lusitano
                </p>
                <div className="w-20 h-20 bg-[var(--background-secondary)] border-2 border-[var(--gold)]/50 rounded-full flex items-center justify-center mb-4">
                  {result.icon}
                </div>
                <p className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider mb-2">
                  {t.analise_perfil.my_equestrian_profile}
                </p>
                <h2 className="text-3xl font-serif text-[var(--foreground)] mb-2 text-center">
                  {result.title}
                </h2>
                <p className="text-[var(--gold)] italic mb-6">{result.subtitle}</p>
                <div className="bg-[var(--gold)] text-black px-6 py-2 text-2xl font-bold">
                  {scorePercentages[0]?.percentage || 0}%
                </div>
                <p className="text-[var(--foreground-muted)] text-xs mt-6">
                  portallusitano.pt/analise-perfil
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
