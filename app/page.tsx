// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* --- HERO SECTION (O CINEMA) --- */}
      <main className="relative h-screen w-full overflow-hidden bg-black text-white">
        
        {/* VIDEO / IMAGEM DE FUNDO */}
        <div className="absolute inset-0 z-0">
          {/* Estou a usar uma imagem de alta qualidade. Se tiveres vídeo, substituímos depois */}
          <img 
            src="https://images.unsplash.com/photo-1598556776374-0a37466d34b3?q=80&w=2560" 
            alt="Cavalo Lusitano Hero" 
            className="w-full h-full object-cover opacity-60 grayscale"
          />
          {/* Gradiente para o texto brilhar */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          
          <span className="text-[#C5A059] uppercase tracking-[0.5em] text-xs md:text-sm font-bold mb-6 animate-pulse">
            Est. 2026 • Portugal
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif italic tracking-tighter mb-8">
            Portal <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#C5A059] to-[#8A6E36]">Lusitano</span>
          </h1>
          
          <p className="max-w-xl text-zinc-300 text-lg md:text-xl font-light italic mb-12 leading-relaxed">
            "Onde a tradição secular encontra a inovação digital. 
            O palco mundial do Cavalo Puro Sangue Lusitano."
          </p>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex flex-col md:flex-row gap-6">
            <Link 
              href="/comprar"
              className="px-8 py-4 bg-[#C5A059] text-black text-xs uppercase font-bold tracking-[0.2em] hover:bg-white transition-all duration-500"
            >
              Explorar Coleção
            </Link>
            
            <Link 
              href="/leiloes"
              className="px-8 py-4 border border-white/20 text-white text-xs uppercase font-bold tracking-[0.2em] hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-500 backdrop-blur-sm"
            >
              Leilões ao Vivo
            </Link>
          </div>
        </div>

        {/* RODAPÉ DO HERO (Dados de Mercado) */}
        <div className="absolute bottom-10 left-0 w-full px-10 hidden md:flex justify-between items-end text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
          <div>
            <span className="block text-zinc-700">Market Cap</span>
            <span className="text-white">€12.4M Volume</span>
          </div>
          <div className="text-center animate-bounce">
            Scroll para descobrir
          </div>
          <div className="text-right">
            <span className="block text-zinc-700">Membros Ativos</span>
            <span className="text-white">1,240 Investidores</span>
          </div>
        </div>

      </main>

      {/* --- SEGUNDA SECÇÃO (O MANIFESTO) --- */}
      <section className="bg-black py-32 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center space-y-12">
           <h2 className="text-4xl md:text-5xl font-serif text-white">
             Mais do que uma plataforma, <br/> 
             <span className="italic text-[#C5A059]">um legado.</span>
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12">
             <div className="space-y-4">
               <div className="text-[#C5A059] text-3xl">🏛️</div>
               <h3 className="text-white font-bold uppercase tracking-widest text-xs">História</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">Preservamos as linhagens mais antigas, conectando o passado ao futuro através da tecnologia blockchain.</p>
             </div>
             <div className="space-y-4">
               <div className="text-[#C5A059] text-3xl">💎</div>
               <h3 className="text-white font-bold uppercase tracking-widest text-xs">Exclusividade</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">Acesso restrito aos melhores exemplares da raça. Cada cavalo é selecionado rigorosamente.</p>
             </div>
             <div className="space-y-4">
               <div className="text-[#C5A059] text-3xl">🌍</div>
               <h3 className="text-white font-bold uppercase tracking-widest text-xs">Alcance Global</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">Levamos o Cavalo Lusitano aos 4 cantos do mundo, facilitando a exportação e a burocracia.</p>
             </div>
           </div>
        </div>
      </section>
    </>
  );
}