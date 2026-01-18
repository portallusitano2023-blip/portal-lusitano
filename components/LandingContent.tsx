// @ts-nocheck
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingContent() {
  return (
    <main className="bg-black text-white selection:bg-[#C5A059] selection:text-black">
      
      {/* SECTION 1: HERO IMPACTO TOTAL */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Imagem de fundo com efeito de escala lenta */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 2.5 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="text-[#C5A059] uppercase tracking-[0.6em] text-[12px] font-bold block mb-10 italic"
          >
            A Herança do Cavalo de Reis
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-7xl md:text-[12rem] font-serif tracking-tighter leading-none mb-20"
          >
            <span className="text-white">PORTAL</span>
            <span className="text-[#C5A059] italic block md:inline md:ml-8">LUSITANO</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row gap-8 justify-center items-center"
          >
            <Link href="/comprar?dev=true" className="bg-[#C5A059] text-black px-16 py-6 text-[11px] uppercase font-bold tracking-[0.4em] hover:bg-white transition-all duration-700 w-80 shadow-2xl">
              Explorar Mercado
            </Link>
            <Link href="/vender?dev=true" className="border border-white/20 text-white px-16 py-6 text-[11px] uppercase font-bold tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-700 w-80 backdrop-blur-sm">
              Vender Exemplar
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: MANIFESTO DE ELITE */}
      <section className="py-60 bg-zinc-950/30 text-center px-6 border-y border-zinc-900">
        <div className="max-w-4xl mx-auto space-y-12">
          <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-bold italic">Curadoria Portal Lusitano</span>
          <h2 className="text-5xl md:text-7xl font-serif italic leading-tight text-white/90">
            "Onde a nobreza da tradição equestre encontra o futuro da tecnologia."
          </h2>
          <div className="w-24 h-[1px] bg-[#C5A059] mx-auto opacity-40"></div>
        </div>
      </section>
    </main>
  );
}