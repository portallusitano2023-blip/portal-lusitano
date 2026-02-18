"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      void error;
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-[var(--gold)] text-6xl mb-6">!</div>

        <h1 className="text-2xl font-serif text-[var(--foreground)] mb-4">
          {t.error_page.something_wrong}
        </h1>

        <p className="text-[var(--foreground-secondary)] mb-8">{t.error_page.apology}</p>

        {error.digest && (
          <p className="text-[var(--foreground-secondary)] text-xs mb-6">
            {t.error_page.reference} {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={reset}
            className="bg-[var(--gold)] text-black font-bold uppercase text-xs tracking-[0.2em] py-4 px-8 hover:bg-white transition-all"
          >
            {t.error_page.try_again}
          </button>

          <Link
            href="/"
            className="text-[var(--foreground-muted)] text-sm hover:text-[var(--gold)] transition-colors"
          >
            {t.error_page.back_home}
          </Link>
        </div>

        <p className="text-[var(--foreground-secondary)] text-xs mt-12">
          {t.error_page.persist_contact}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[var(--gold)] hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}
