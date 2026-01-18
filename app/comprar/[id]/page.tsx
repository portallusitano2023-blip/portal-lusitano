// @ts-nocheck
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

// Componente do Gráfico de Aptidão
function AptidaoGraph({ stats }) {
  // Transformamos os valores de 0-100 em coordenadas SVG
  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Teia de Fundo */}
        <polygon points="100,20 180,80 150,170 50,170 20,80" fill="none" stroke="#27272a" strokeWidth="0.5" />
        <polygon points="100,60 140,90 125,135 75,135 60,90" fill="none" stroke="#27272a" strokeWidth="0.5" />
        
        {/* Eixos */}
        <line x1="100" y1="100" x2="100" y2="20" stroke="#27272a" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="180" y2="80" stroke="#27272a" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="150" y2="170" stroke="#27272a" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="50" y2="170" stroke="#27272a" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="20" y2="80" stroke="#27272a" strokeWidth="0.5" />

        {/* ÁREA DE PERFORMANCE (Dinamizada pelos dados) */}
        <polygon 
          points={`
            100,${100 - stats.dressage * 0.8} 
            ${100 + stats.toureio * 0.8},${100 - stats.toureio * 0.2} 
            ${100 + stats.trabalho * 0.5},${100 + stats.trabalho * 0.7} 
            ${100 - stats.obstaculos * 0.5},${100 + stats.obstaculos * 0.7} 
            ${100 - stats.modelo * 0.8},${100 - stats.modelo * 0.2}
          `}
          fill="rgba(197, 160, 89, 0.3)"
          stroke="#C5A059"
          strokeWidth="2"
        />
      </svg>
      {/* Legendas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] uppercase font-bold tracking-widest">Dressage</div>
      <div className="absolute top-[35%] right-0 text-[8px] uppercase font-bold tracking-widest">Toureio</div>
      <div className="absolute bottom-0 right-1/4 text-[8px] uppercase font-bold tracking-widest">Equi. Trabalho</div>
      <div className="absolute bottom-0 left-1/4 text-[8px] uppercase font-bold tracking-widest">Obstáculos</div>
      <div className="absolute top-[35%] left-0 text-[8px] uppercase font-bold tracking-widest">Modelo</div>
    </div>
  );
}

export default async function DetalhePage({ params }) {
  const { id } = await params;
  const { data: c } = await supabase.from('cavalos_venda').select('*').eq('id', id).single();

  if (!c) return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-40 px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-7xl mx-auto">
          {/* FOTO E INFO BÁSICA */}
          <div className="space-y-12">
            <img src={c.image_url} className="w-full aspect-square object-cover grayscale" />
            <h1 className="text-6xl font-serif italic">{c.nome_cavalo}</h1>
          </div>

          {/* ANÁLISE TÉCNICA E GRÁFICO */}
          <div className="bg-zinc-950 p-12 border border-zinc-900 flex flex-col justify-center">
            <h3 className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold mb-10 text-center">Gráfico de Aptidão Funcional</h3>
            
            <AptidaoGraph stats={{
              dressage: c.score_dressage || 80,
              toureio: c.score_toureio || 60,
              trabalho: c.score_trabalho || 90,
              obstaculos: c.score_obstaculos || 40,
              modelo: c.pontuacao_apsl || 70
            }} />

            <div className="mt-16 border-t border-zinc-900 pt-10 text-center">
               <p className="text-zinc-500 font-serif italic text-lg leading-relaxed">
                 "Exemplar com elevado índice de submissão e impulsão, ideal para progressão em Dressage nível Médio/Avançado."
               </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}