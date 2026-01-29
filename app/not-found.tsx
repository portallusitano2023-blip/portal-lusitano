"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[180px] md:text-[250px] font-serif text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-transparent leading-none select-none">
            404
          </span>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="text-6xl md:text-8xl font-serif text-[#C5A059]">404</span>
          </motion.div>
        </motion.div>

        {/* Titulo */}
        <motion.h1
          className="text-3xl md:text-4xl font-serif text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Pagina Nao Encontrada
        </motion.h1>

        {/* Descricao */}
        <motion.p
          className="text-zinc-500 mb-12 font-serif italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          O caminho que procura perdeu-se nas pastagens lusitanas.
          <br />
          Permita-nos guia-lo de volta.
        </motion.p>

        {/* Botoes */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
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
        </motion.div>

        {/* Link de voltar */}
        <motion.button
          onClick={() => window.history.back()}
          className="mt-12 inline-flex items-center gap-2 text-zinc-600 hover:text-[#C5A059] transition-colors text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <ArrowLeft size={14} />
          Voltar a pagina anterior
        </motion.button>

        {/* Decoracao inferior */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
        >
          <div className="w-12 h-[1px] bg-[#C5A059]" />
          <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-600">Portal Lusitano</span>
          <div className="w-12 h-[1px] bg-[#C5A059]" />
        </motion.div>
      </div>
    </main>
  );
}
