"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LojaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Loja error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-[var(--gold)] text-6xl mb-6">!</div>
        <h1 className="text-2xl font-serif text-[var(--foreground)] mb-4">Erro na Loja</h1>
        <p className="text-[var(--foreground-secondary)] mb-8">
          Não foi possível carregar os produtos. Tente novamente.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={reset}
            className="bg-[var(--gold)] text-black font-bold uppercase text-xs tracking-[0.2em] py-4 px-8 hover:bg-white transition-all"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="text-[var(--foreground-muted)] text-sm hover:text-[var(--gold)] transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
