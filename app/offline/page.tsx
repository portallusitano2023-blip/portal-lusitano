"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icone */}
        <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
          <WifiOff className="text-zinc-500" size={48} />
        </div>

        {/* Titulo */}
        <h1 className="text-4xl font-serif text-white mb-4">
          Sem Conexão
        </h1>

        {/* Descricao */}
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Parece que está offline. Verifique a sua conexão à internet e tente novamente.
        </p>

        {/* Acoes */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 bg-[#C5A059] text-black px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors"
          >
            <RefreshCw size={16} />
            Tentar Novamente
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
          >
            <Home size={16} />
            Página Inicial
          </Link>
        </div>

        {/* Nota */}
        <p className="mt-12 text-[10px] text-zinc-600 uppercase tracking-widest">
          Portal Lusitano • Disponível Offline
        </p>
      </div>
    </main>
  );
}
