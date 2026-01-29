"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">

      {/* 1. IMAGEM DE FUNDO (HERO BACKGROUND) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1920&auto=format&fit=crop"
          alt="Nobreza Lusitana"
          className="w-full h-full object-cover opacity-50"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-black/40"></div>
      </motion.div>

      {/* 2. CONTEUDO (Texto e Botoes) */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">

        <motion.p
          className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#C5A059]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t.home.est}
        </motion.p>

        <motion.h1
          className="text-6xl md:text-8xl font-serif text-white leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <span className="block text-2xl md:text-4xl italic font-light mb-2 text-zinc-300"></span>
          {t.home.title_main.split(' ')[0]} <br />
          {t.home.title_main.split(' ').slice(1).join(' ')}
        </motion.h1>

        <motion.p
          className="text-sm md:text-base font-serif italic text-zinc-200 max-w-lg mx-auto leading-relaxed drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          "{t.home.hero_text}"
        </motion.p>

        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link
            href="/loja"
            className="inline-block border border-white/30 bg-black/20 backdrop-blur-md px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-white hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-500"
          >
            {t.home.cta}
          </Link>
        </motion.div>

      </div>

      {/* Decoracao Rodape (Scroll Indicator) */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.2 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <span className="text-[10px] tracking-widest uppercase">{t.home.scroll}</span>
      </motion.div>

    </main>
  );
}
