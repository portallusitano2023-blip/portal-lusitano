"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function OfflinePage() {
  const { t } = useLanguage();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-[var(--background-card)]/50 rounded-full flex items-center justify-center mx-auto mb-8">
          <WifiOff className="text-[var(--foreground-muted)]" size={48} />
        </div>

        <h1 className="text-4xl font-serif text-[var(--foreground)] mb-4">
          {t.errors.no_connection}
        </h1>

        <p className="text-[var(--foreground-secondary)] mb-8 leading-relaxed">
          {t.errors.offline_message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-black px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-[var(--gold-hover)] transition-colors"
          >
            <RefreshCw size={16} />
            {t.errors.try_again}
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--foreground)] px-8 py-4 text-xs uppercase tracking-widest hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
          >
            <Home size={16} />
            {t.errors.home_page}
          </Link>
        </div>

        <p className="mt-12 text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest">
          {t.errors.available_offline}
        </p>
      </div>
    </main>
  );
}
