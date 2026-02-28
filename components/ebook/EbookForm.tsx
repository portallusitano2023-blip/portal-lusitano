"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { trackEbookFunnel, trackEmailSubscription, trackEbookDownload } from "@/lib/analytics";
import { Download, Check } from "lucide-react";

interface EbookFormProps {
  variant?: "hero" | "cta";
}

export default function EbookForm({ variant = "hero" }: EbookFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formStartedRef = useRef(false);

  const handleFormStart = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEbookFunnel("start_form");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ebook-gratis/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nome }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.errors.error_processing);
      }

      trackEbookFunnel("submit_form");
      trackEmailSubscription("free-ebook");
      trackEbookDownload("introducao-lusitano", "free");

      setLoading(false);
      setSubmitted(true);

      setTimeout(() => {
        window.location.href = "/ebook-gratis/download";
      }, 2000);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[EbookGratis]", error);
      setLoading(false);
      alert(error instanceof Error ? error.message : t.errors.error_processing);
    }
  };

  if (submitted) {
    return (
      <div className="text-center max-w-md mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
        <div
          className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          <Check className="text-green-400" size={44} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
          {t.ebook_page.success}
        </h2>
        <p className="text-[var(--foreground-secondary)] mb-2 text-lg">
          {t.ebook_page.sent_download_link}
        </p>
        <p className="text-[var(--gold)] font-medium text-lg mb-6">{email}</p>
        <div className="flex items-center justify-center gap-2 text-[var(--foreground-muted)] text-sm">
          <div className="w-4 h-4 border-2 border-[var(--border)] border-t-[var(--gold)] rounded-full animate-spin" />
          {t.ebook_page.redirecting_download}
        </div>
      </div>
    );
  }

  const isCta = variant === "cta";
  const idPrefix = isCta ? "ebook-cta" : "ebook";
  const inputBg = isCta
    ? "bg-black/40 focus:bg-black/60"
    : "bg-[var(--surface-hover)] focus:bg-[var(--surface-hover)]";

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-3 ${isCta ? "max-w-lg mx-auto" : "max-w-lg"}`}
    >
      <label htmlFor={`${idPrefix}-nome`} className="sr-only">
        {t.ebook_page.your_name}
      </label>
      <input
        id={`${idPrefix}-nome`}
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onFocus={handleFormStart}
        placeholder={t.ebook_page.your_name}
        required
        autoComplete="name"
        className={`w-full ${inputBg} border border-[var(--border)] text-[var(--foreground)] px-5 py-4 text-[15px] focus:outline-none focus:border-[var(--gold)]/50 transition-all placeholder:text-[var(--foreground-muted)]`}
      />
      <label htmlFor={`${idPrefix}-email`} className="sr-only">
        {t.ebook_page.your_email}
      </label>
      <input
        id={`${idPrefix}-email`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={handleFormStart}
        placeholder={t.ebook_page.your_email}
        required
        autoComplete="email"
        inputMode="email"
        className={`w-full ${inputBg} border border-[var(--border)] text-[var(--foreground)] px-5 py-4 text-[15px] focus:outline-none focus:border-[var(--gold)]/50 transition-all placeholder:text-[var(--foreground-muted)]`}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--gold)] text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-h-[56px] active:scale-[0.98] touch-manipulation"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            {t.ebook_page.processing}
          </>
        ) : (
          <>
            <Download size={18} />
            {isCta ? t.ebook_page.want_ebook : t.ebook_page.download_free}
          </>
        )}
      </button>
      <p className="text-[var(--foreground-muted)] text-[11px] text-center pt-1">
        {t.ebook_page.no_spam}
      </p>
    </form>
  );
}
