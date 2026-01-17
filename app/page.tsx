// @ts-nocheck
"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage({ searchParams }) {
  // Verificação de segurança para o modo de desenvolvimento
  const isDev = searchParams?.dev === "true";

  if (!isDev) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8 animate-pulse"
        >
          Portal Lusitano
        </motion.span>
        <h1 className="text-4xl md:text-6xl font-serif italic mb-8">The Future of Elite</h1>
        <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase">Private Preview — 2026</p>
      </main>
    );
  }

  return (
    <>
      <Navbar dev={true} />
      <main className="bg-black text-white selection:bg-[#C5A059] selection:text-black">
        
        {/* SECTION 1: HERO - IMPACTO VISUAL */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071')] bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          
          <div className="relative z-10 text-center px-6">
            <motion.span 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="text-[#C5A059] uppercase tracking-[0.6em] text-[12px] font-bold block mb-8 italic"
            >
              A Nobreza do Cavalo Lusitano
            </motion.span>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-7xl md:text-[11rem] font-serif tracking-tighter leading-none mb-16"
            >
              <span className="text-white">PORTAL</span>
              <span className="text-[#C5A059] italic block md:inline md:ml-6">LUSITANO</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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

        {/* SECTION 2: OS TRÊS PILARES */}
        <section className="py-40 px-6 md:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="group space-y-8">
              <div className="aspect-[3/4] overflow-hidden border border-zinc-900 group-hover:border-[#C5A059]/30 transition-all duration-1000">
                <img src="https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1974" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
              </div>
              <h3 className="text-3xl font-serif italic">Lifestyle Store</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-light">Equipamento de elite e moda equestre desenhada para quem exige o topo da performance e elegância.</p>
              <Link href="/loja?dev=true" className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold block pt-4 border-t border-zinc-900 w-fit">Ver Coleção —</Link>
            </div>

            <div className="group space-y-8 md:mt-20">
              <div className="aspect-[3/4] overflow-hidden border border-zinc-900 group-hover:border-[#C5A059]/30 transition-all duration-1000">
                <img src="https://images.unsplash.com/photo-1601985705804-d247d2beabd0?q=80&w=1974" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
              </div>
              <h3 className="text-3xl font-serif italic">Leilões Ativos</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-light">Acesso exclusivo aos exemplares mais premiados das melhores coudelarias de Portugal.</p>
              <Link href="/leiloes?dev=true" className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold block pt-4 border-t border-zinc-900 w-fit">Licitar Agora —</Link>
            </div>

            <div className="group space-y-8 md:mt-40">
              <div className="aspect-[3/4] overflow-hidden border border-zinc-900 group-hover:border-[#C5A059]/30 transition-all duration-1000">
                <img src="https://images.unsplash.com/photo-1534073131349-8bc29255f006?q=80&w=1974" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
              </div>
              <h3 className="text-3xl font-serif italic">Marketplace</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-light">A maior rede de compra e venda direta de Cavalos Lusitanos entre criadores e investidores globais.</p>
              <Link href="/comprar?dev=true" className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold block pt-4 border-t border-zinc-900 w-fit">Ver Exemplares —</Link>
            </div>
          </div>
        </section>

        {/* SECTION 3: MANIFESTO */}
        <section className="py-60 bg-zinc-950/50 text-center px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-bold italic">A Nossa Missão</span>
            <h2 className="text-5xl md:text-7xl font-serif italic leading-tight">"Preservar a herança lusitana através da tecnologia e exclusividade."</h2>
            <div className="w-20 h-[1px] bg-[#C5A059] mx-auto opacity-40"></div>
          </div>
        </section>
      </main>
    </>
  );
}