"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PRO area error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/40 backdrop-blur-md border border-white/5 p-10 text-center">
        <div className="text-[#C5A059] text-5xl mb-4">!</div>

        <h1 className="text-2xl font-serif text-white mb-4">
          Erro na Área PRO
        </h1>

        <p className="text-zinc-400 mb-6">
          Ocorreu um erro ao carregar o conteúdo. Pedimos desculpa pelo inconveniente.
        </p>

        {error.digest && (
          <p className="text-zinc-600 text-xs mb-6 font-mono">
            Ref: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="bg-[#C5A059] text-black font-bold uppercase text-xs tracking-[0.2em] py-4 hover:bg-white transition-all"
          >
            Tentar novamente
          </button>

          <Link
            href="/pro/dashboard"
            className="bg-zinc-800 text-white font-bold uppercase text-xs tracking-[0.2em] py-4 hover:bg-zinc-700 transition-all"
          >
            Ir para Dashboard
          </Link>
        </div>

        <p className="text-zinc-600 text-xs mt-8">
          Precisas de ajuda?{" "}
          <Link href="/pro/consultoria" className="text-[#C5A059] hover:underline">
            Contacta o suporte
          </Link>
        </p>
      </div>
    </main>
  );
}
