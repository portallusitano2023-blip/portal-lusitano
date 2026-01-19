// @ts-nocheck
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function LeiloesPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
        
        {/* CABEÇALHO DO LEILÃO */}
        <header className="max-w-7xl mx-auto text-center mb-20">
          <span className="inline-flex items-center gap-2 px-3 py-1 border border-red-900 bg-red-900/20 rounded-full text-red-500 text-[9px] uppercase font-bold tracking-widest mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Live Bidding Offline
          </span>
          
          <h1 className="text-5xl md:text-7xl font-serif italic mb-6">
            Sala de <span className="text-[#C5A059]">Leilões</span>
          </h1>
          
          <p className="text-zinc-400 font-light max-w-xl mx-auto">
            Os leilões do Portal Lusitano são eventos exclusivos. 
            O próximo evento está agendado para <span className="text-white font-bold">Março de 2026</span>.
          </p>
        </header>

        {/* MOCKUP DE UM LOTE (Exemplo Visual) */}
        <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col md:flex-row opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-not-allowed">
          
          {/* Imagem do Cavalo */}
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <Image 
              src="https://images.unsplash.com/photo-1534057376664-d6a4a4030615?q=80&w=1000" 
              alt="Lote 1" 
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/80 px-4 py-2 text-white text-xs font-bold uppercase tracking-widest border border-white/10">
              Lote #01
            </div>
          </div>

          {/* Dados do Leilão */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-2xl font-serif italic text-white">Imperador d'Atela</h3>
              <p className="text-[#C5A059] text-xs uppercase tracking-widest mt-1">Linhagem Veiga / Coimbra</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-zinc-500 font-mono border-t border-b border-white/5 py-4">
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-zinc-600">Última Licitação</span>
                <span className="text-white text-lg">--- €</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-zinc-600">Tempo Restante</span>
                <span className="text-white text-lg">Fechado</span>
              </div>
            </div>

            <button disabled className="w-full py-4 border border-zinc-700 text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] cursor-not-allowed">
              Leilão Encerrado
            </button>
          </div>

        </div>

        {/* RODAPÉ DE AVISO */}
        <div className="text-center mt-20">
          <p className="text-zinc-600 text-xs font-mono">
            Para licitar, é necessário ter a conta verificada e caução ativa.
          </p>
        </div>

      </main>
    </>
  );
}