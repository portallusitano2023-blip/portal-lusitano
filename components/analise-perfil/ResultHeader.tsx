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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result, ScorePercentage } from "@/components/analise-perfil/types";

interface ResultHeaderProps {
  result: Result;
  scorePercentages: ScorePercentage[];
  saved: boolean;
  copied: boolean;
  badgeRef: RefObject<HTMLDivElement | null>;
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
    <section className={`relative pt-32 pb-16 bg-gradient-to-b ${result.color} to-transparent`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="opacity-0 animate-[scaleIn_0.5s_ease-out_forwards]">
          <div className="w-24 h-24 mx-auto bg-[var(--background-secondary)]/50 border border-[var(--gold)]/30 rounded-full flex items-center justify-center mb-6">
            {result.icon}
          </div>
          <span className="text-[var(--gold)] text-xs uppercase tracking-[0.3em] block mb-3">
            {t.analise_perfil.your_profile_is}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-2">
            {result.title}
          </h1>
          <p className="text-lg text-[var(--gold)] italic mb-6">{result.subtitle}</p>
          <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto leading-relaxed mb-8">
            {result.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={onSave}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm border transition-colors ${saved ? "border-green-500 text-green-500" : "border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"}`}
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? t.analise_perfil.saved : t.analise_perfil.save}
            </button>
            <button
              onClick={onDownloadPDF}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors"
            >
              <FileDown size={16} />
              PDF
            </button>
            <button
              onClick={onDownloadBadge}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              <Download size={16} />
              Badge
            </button>
            <button
              onClick={onShareWhatsApp}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-green-600/50 text-green-500 hover:bg-green-600 hover:text-white transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
            <button
              onClick={onShareFacebook}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-blue-600/50 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Facebook size={16} />
              Facebook
            </button>
            <button
              onClick={onShareInstagram}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-pink-500/50 text-pink-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-colors"
            >
              <Instagram size={16} />
              Instagram
            </button>
            <button
              onClick={onCopyLink}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm border transition-colors ${copied ? "border-green-500 text-green-500" : "border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"}`}
            >
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
              {copied ? t.analise_perfil.copied : t.analise_perfil.link}
            </button>
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
