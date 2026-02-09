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
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-[#C5A059] text-6xl mb-6">!</div>
        <h1 className="text-2xl font-serif text-white mb-4">Erro na Loja</h1>
        <p className="text-zinc-400 mb-8">
          Não foi possível carregar os produtos. Tente novamente.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={reset}
            className="bg-[#C5A059] text-black font-bold uppercase text-xs tracking-[0.2em] py-4 px-8 hover:bg-white transition-all"
          >
            Tentar novamente
          </button>
          <Link href="/" className="text-zinc-500 text-sm hover:text-[#C5A059] transition-colors">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
