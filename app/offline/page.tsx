"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-6 text-center">
      {/* Linha decorativa */}
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent mb-10" />

      <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)] mb-6 block">
        Sem Ligação
      </span>

      <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mb-6 leading-tight">
        Está Offline
      </h1>

      <p className="text-[var(--foreground-secondary)] font-serif italic text-sm md:text-base max-w-sm leading-relaxed mb-12">
        &ldquo;A ligação à internet foi perdida. Verifique a sua rede e tente novamente.&rdquo;
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 text-[10px] uppercase tracking-widest bg-[var(--gold)] text-black hover:bg-white transition-colors font-bold"
        >
          Tentar Novamente
        </button>
        <Link
          href="/"
          className="px-8 py-3 text-[10px] uppercase tracking-widest border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)] transition-colors"
        >
          Página Inicial
        </Link>
      </div>

      <div className="mt-20 flex items-center gap-4">
        <div className="w-8 h-px bg-[var(--gold)]" />
        <span className="text-[9px] uppercase tracking-widest text-[var(--foreground-muted)]">
          Portal Lusitano
        </span>
        <div className="w-8 h-px bg-[var(--gold)]" />
      </div>
    </main>
  );
}
