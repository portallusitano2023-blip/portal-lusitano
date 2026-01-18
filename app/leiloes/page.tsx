// @ts-nocheck
"use client"; // Necessário para o cronómetro
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

// Componente Cartão de Leilão de Elite
function AuctionCard({ horse, time, status }) {
  return (
    <div className="group relative bg-zinc-950 border border-zinc-900 overflow-hidden hover:border-[#C5A059] transition-all duration-700">
      
      {/* IMAGEM COM EFEITO ZOOM */}
      <div className="aspect-[4/5] relative overflow-hidden">
        <img 
          src={horse.image} 
          className={`w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 ${status === 'future' ? 'blur-sm grayscale opacity-30' : 'grayscale group-hover:grayscale-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        {/* BADGE DE STATUS */}
        <div className="absolute top-4 left-4">
          {status === 'live' ? (
            <div className="flex items-center gap-2 bg-[#C5A059] text-black px-3 py-1 text-[9px] uppercase font-bold tracking-widest animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              Em Direto
            </div>
          ) : (
            <div className="bg-zinc-800 text-zinc-400 px-3 py-1 text-[9px] uppercase font-bold tracking-widest border border-zinc-700">
              Brevemente
            </div>
          )}
        </div>
      </div>

      {/* DADOS DO LEILÃO */}
      <div className="p-8 relative">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[#C5A059] text-[9px] uppercase tracking-widest font-bold mb-2">Lote #{horse.id}</p>
            <h3 className="text-2xl font-serif italic text-white">{horse.name}</h3>
          </div>
          <div className="text-right">
             <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Licitação Atual</p>
             <p className="text-xl font-serif text-white">{status === 'future' ? '---' : horse.price}</p>
          </div>
        </div>

        {/* CRONÓMETRO MECÂNICO */}
        <div className="border-t border-zinc-900 pt-6">
          {status === 'live' ? (
             <div className="flex justify-between text-center font-mono text-zinc-400">
               <div>
                 <span className="text-2xl text-white block">{time.d}</span>
                 <span className="text-[8px] uppercase tracking-widest">Dias</span>
               </div>
               <div className="text-zinc-700">:</div>
               <div>
                 <span className="text-2xl text-white block">{time.h}</span>
                 <span className="text-[8px] uppercase tracking-widest">Horas</span>
               </div>
               <div className="text-zinc-700">:</div>
               <div>
                 <span className="text-2xl text-white block">{time.m}</span>
                 <span className="text-[8px] uppercase tracking-widest">Min</span>
               </div>
               <div className="text-zinc-700">:</div>
               <div>
                 <span className="text-2xl text-[#C5A059] block">{time.s}</span>
                 <span className="text-[8px] uppercase tracking-widest">Seg</span>
               </div>
             </div>
          ) : (
             <div className="text-center py-2">
               <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">Abertura: 25 Jan 2026</p>
             </div>
          )}
        </div>

        {/* BOTÃO DE AÇÃO */}
        <div className="mt-8">
           <button disabled={status === 'future'} className={`
             w-full py-4 text-[10px] uppercase font-bold tracking-[0.4em] transition-all duration-500
             ${status === 'live' 
               ? 'bg-zinc-900 text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#C5A059] hover:text-black' 
               : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'}
           `}>
             {status === 'live' ? 'Entrar na Sala' : 'Acesso Bloqueado'}
           </button>
        </div>
      </div>
    </div>
  );
}

export default function LeiloesPage() {
  // Simulação de Cronómetro
  const [timeLeft, setTimeLeft] = useState({ d: 2, h: 14, m: 35, s: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        return { ...prev, s: 59, m: prev.m - 1 }; // Simplificado para demo
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-40 pb-40 px-6">
        
        {/* HERO: O SENTIMENTO DE MERCADO */}
        <header className="max-w-7xl mx-auto mb-32 text-center border-b border-zinc-900 pb-20">
          <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-8 animate-pulse">Marketplace em Tempo Real</span>
          <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter mb-10">
            Sala de <span className="text-[#C5A059]">Licitações</span>
          </h1>
          <p className="text-zinc-500 text-xl font-light italic max-w-3xl mx-auto">
            "Acesso exclusivo a exemplares de coleção. A transparência do blockchain encontra a tradição da Coudelaria."
          </p>
        </header>

        {/* GRELHA DE ATIVOS (LEILÕES) */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* LEILÃO 1: EM DIRETO (HOT) */}
          <AuctionCard 
            status="live"
            time={timeLeft}
            horse={{
              id: "001",
              name: "Zarathustra MV",
              price: "45.000 €",
              image: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1974"
            }}
          />

          {/* LEILÃO 2: EM DIRETO */}
          <AuctionCard 
            status="live"
            time={{d: 0, h: 4, m: 12, s: 45}}
            horse={{
              id: "002",
              name: "Bucefalo AR",
              price: "28.500 €",
              image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071"
            }}
          />

          {/* LEILÃO 3: FUTURO (MISTÉRIO) */}
          <AuctionCard 
            status="future"
            time={null}
            horse={{
              id: "003",
              name: "Lote Reservado",
              price: "---",
              image: "https://images.unsplash.com/photo-1534073131349-8bc29255f006?q=80&w=1974"
            }}
          />

        </div>

        {/* BARRA DE TICKER (ESTILO BOLSA) */}
        <div className="fixed bottom-0 left-0 w-full bg-[#C5A059] text-black py-2 overflow-hidden z-50">
          <div className="whitespace-nowrap animate-marquee text-[10px] uppercase font-bold tracking-widest flex gap-20">
            <span>Última Licitação: Lote #001 - 45.000€ (Lisboa)</span>
            <span>Novo Registo: Investidor Dubai entrou na sala</span>
            <span>Lote #002: Reserva Atingida</span>
            <span>Próximo Leilão: Coleção Veiga - 25 Jan</span>
            {/* Repetir para efeito infinito visual */}
            <span>Última Licitação: Lote #001 - 45.000€ (Lisboa)</span>
            <span>Novo Registo: Investidor Dubai entrou na sala</span>
          </div>
        </div>

      </main>
      
      {/* CSS para a animação do ticker */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>
  );
}