// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* HERO SECTION - ECRÃ INTEIRO */}
      <main className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-center items-center">
        
        {/* 1. IMAGEM DE FUNDO (Otimizada) */}
        <div className="absolute inset-0 z-0">
          {/* Película escura para o texto brilhar */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          
          <Image 
            src="https://images.unsplash.com/photo-1598556776374-0a37466d34b3?q=80&w=2560" 
            alt="Lusitano Hero" 
            fill
            className="object-cover"
            priority // Carrega instantaneamente
            quality={90}
          />
          
          {/* Grelha subtil (efeito "Engenharia") */}
          <div className="absolute inset-0 z-10 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>

        {/* 2. CONTEÚDO CENTRAL */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto space-y-8 mt-10">
          
          {/* Título Principal */}
          <h1 className="text-7xl md:text-9xl font-serif italic text-white tracking-tighter leading-none animate-fade-in">
            O Futuro da <br/>
            <span className="text-[#C5A059]">Tradição</span>
          </h1>
          
          {/* Texto / Manifesto */}
          <p className="text-zinc-300 text-lg md:text-xl font-light italic max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            "Estamos a construir a infraestrutura digital definitiva para o Cavalo Lusitano. 
            Onde a seleção genética encontra a precisão da engenharia."
          </p>

          {/* Botões de Ação */}
          <div className="pt-10 flex flex-col md:flex-row gap-6 justify-center items-center animate-fade-in-up delay-200">
            {/* Botão Dourado -> Vai para a Loja */}
            <Link 
              href="/loja"
              className="px-8 py-4 bg-[#C5A059] text-black text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white transition-all duration-300 min-w-[200px] shadow-[0_0_20px_rgba(197,160,89,0.3)]"
            >
              Explorar Coleção
            </Link>
            
            {/* Botão Transparente -> Vai para o Sobre */}
            <Link 
              href="/sobre"
              className="px-8 py-4 border border-white/20 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 min-w-[200px]"
            >
              Ler o Manifesto
            </Link>
          </div>
        </div>

        {/* 3. RODAPÉ DE DADOS (STATS BAR) */}
        <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-white/10 z-30">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-5 divide-x divide-white/10 text-[9px] uppercase tracking-widest text-zinc-400 font-mono">
             
             <div className="py-4 px-6 text-center md:text-left">
               <span className="text-white font-bold block md:inline">Média de Venda:</span> 42.500€
             </div>
             
             <div className="py-4 px-6 text-center md:text-left hidden md:block">
               <span className="text-white font-bold block md:inline">Visitantes Hoje:</span> 1.240
             </div>

             <div className="py-4 px-6 text-center md:text-left hidden md:block">
               <span className="text-white font-bold block md:inline">Novos Registos:</span> +12%
             </div>
             
             <div className="py-4 px-6 text-center md:text-left hidden md:block">
               <span className="text-white font-bold block md:inline">Leilões Ativos:</span> 3
             </div>

             <div className="py-4 px-6 text-center md:text-left">
               <span className="text-white font-bold block md:inline">Status:</span> <span className="text-green-500 animate-pulse">Operacional</span>
             </div>

          </div>
        </div>

      </main>
    </>
  );
}