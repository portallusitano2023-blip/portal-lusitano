// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function LeiloesPage({ searchParams }) {
  // Estado para o cronómetro (Ex: termina em 4 dias)
  const [timeLeft, setTimeLeft] = useState({ dias: 4, horas: 12, minutos: 45, segundos: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.segundos > 0) return { ...prev, segundos: prev.segundos - 1 };
        return { ...prev, segundos: 59, minutos: prev.minutos - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-24 text-center">
            <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-4 animate-pulse">Live Auction</span>
            <h1 className="text-7xl font-serif italic mb-4 text-white">Próximos <span className="text-[#C5A059]">Eventos</span></h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 bg-zinc-950 border border-zinc-900 overflow-hidden">
            <div className="aspect-square bg-zinc-900 relative group">
               <img src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-all duration-[4s]" />
               <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>
            </div>
            
            <div className="p-20 flex flex-col justify-center bg-zinc-950">
              <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.6em] mb-6 font-bold">Lote #001 — Ouro Lusitano</span>
              <h2 className="text-5xl font-serif italic mb-12">Garanhão de Elite</h2>
              
              <div className="grid grid-cols-4 gap-6 mb-16 border-y border-zinc-900 py-12">
                <div className="text-center">
                  <p className="text-4xl font-serif text-white">{timeLeft.dias}</p>
                  <p className="text-[8px] uppercase text-zinc-600 tracking-widest mt-2">Dias</p>
                </div>
                <div className="text-center border-x border-zinc-900">
                  <p className="text-4xl font-serif text-white">{timeLeft.horas}</p>
                  <p className="text-[8px] uppercase text-zinc-600 tracking-widest mt-2">Horas</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-serif text-white">{timeLeft.minutos}</p>
                  <p className="text-[8px] uppercase text-zinc-600 tracking-widest mt-2">Minutos</p>
                </div>
                <div className="text-center border-l border-zinc-900">
                  <p className="text-4xl font-serif text-[#C5A059]">{timeLeft.segundos}</p>
                  <p className="text-[8px] uppercase text-zinc-600 tracking-widest mt-2">Segs</p>
                </div>
              </div>

              <button className="w-full bg-[#C5A059] text-black py-7 text-[11px] font-bold uppercase tracking-[0.6em] hover:bg-white transition-all duration-700">
                Registar para Licitar
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}