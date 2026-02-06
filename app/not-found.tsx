"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C5A059] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Numero 404 */}
        <div
          className="relative mb-8 opacity-0 animate-[scaleIn_0.8s_ease-out_forwards]"
        >
          <span className="text-[180px] md:text-[250px] font-serif text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-transparent leading-none select-none">
            404
          </span>
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="text-6xl md:text-8xl font-serif text-[#C5A059]">404</span>
          </div>
        </div>

        {/* Titulo */}
        <h1
          className="text-3xl md:text-4xl font-serif text-white mb-4 opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
          style={{ animationDelay: "0.4s" }}
        >
          Pagina Nao Encontrada
        </h1>

        {/* Descricao */}
        <p
          className="text-zinc-500 mb-12 font-serif italic opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
          style={{ animationDelay: "0.5s" }}
        >
          O caminho que procura perdeu-se nas pastagens lusitanas.
          <br />
          Permita-nos guia-lo de volta.
        </p>

        {/* Botoes */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 bg-[#C5A059] text-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors"
          >
            <Home size={16} />
            Voltar ao Inicio
          </Link>

          <Link
            href="/loja"
            className="flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
          >
            <Search size={16} />
            Explorar Loja
          </Link>
        </div>

        {/* Link de voltar */}
        <button
          onClick={() => window.history.back()}
          className="mt-12 inline-flex items-center gap-2 text-zinc-600 hover:text-[#C5A059] transition-colors text-sm opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
          style={{ animationDelay: "0.8s" }}
        >
          <ArrowLeft size={14} />
          Voltar a pagina anterior
        </button>

        {/* Decoracao inferior */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-12 h-[1px] bg-[#C5A059]" />
          <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-600">Portal Lusitano</span>
          <div className="w-12 h-[1px] bg-[#C5A059]" />
        </div>
      </div>
    </main>
  );
}
