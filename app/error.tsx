"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry captura automaticamente em produção
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-[#C5A059] text-6xl mb-6">!</div>

        <h1 className="text-2xl font-serif text-white mb-4">Algo correu mal</h1>

        <p className="text-zinc-400 mb-8">
          Pedimos desculpa pelo inconveniente. Ocorreu um erro inesperado.
        </p>

        {error.digest && <p className="text-zinc-400 text-xs mb-6">Referência: {error.digest}</p>}

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

        <p className="text-zinc-400 text-xs mt-12">
          Se o problema persistir, contacta-nos em{" "}
          <a href="mailto:suporte@portal-lusitano.pt" className="text-[#C5A059] hover:underline">
            suporte@portal-lusitano.pt
          </a>
        </p>
      </div>
    </main>
  );
}
