// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function Home({ searchParams }) {
  // Await é necessário em Next.js 15+ para searchParams
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";
  const query = isDev ? "?dev=true" : "";

  return (
    <>
      <Navbar dev={isDev} />
      <main className="min-h-screen bg-black text-white selection:bg-[#C5A059] selection:text-black">
        
        {/* 1. HERO SECTION: O CINEMA */}
        <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden border-b border-zinc-900">
          {/* Fundo de Vídeo (Simulado com Imagem + Efeitos) */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1974" 
               className="w-full h-full object-cover grayscale opacity-40 scale-105 animate-slow-zoom" 
               alt="Lusitano Hero"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60"></div>
             {/* Grelha de Engenharia (Overlay) */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>
          </div>

          <div className="relative z-10 text-center max-w-5xl px-6 space-y-8">
            <div className="inline-flex items-center gap-3 border border-[#C5A059]/30 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full mb-6">
               <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
               <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Portal Lusitano v1.0</span>
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none mix-blend-difference">
              O Futuro da <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-white/50">Tradição</span>
            </h1>
            
            <p className="text-zinc-400 text-xl md:text-2xl font-light italic max-w-2xl mx-auto leading-relaxed">
              "Estamos a construir a infraestrutura digital definitiva para o Cavalo Lusitano. Onde a seleção genética encontra a precisão da engenharia."
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center pt-10">
               <Link href={`/comprar${query}`} className="bg-[#C5A059] text-black px-10 py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(197,160,89,0.3)]">
                 Explorar Coleção
               </Link>
               <Link href={`/sobre${query}`} className="border border-zinc-700 text-white px-10 py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:border-white hover:bg-white hover:text-black transition-all duration-500">
                 Ler o Manifesto
               </Link>
            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
             <span className="text-[8px] uppercase tracking-widest text-zinc-500">Scroll</span>
             <div className="w-px h-12 bg-gradient-to-b from-[#C5A059] to-transparent"></div>
          </div>
        </section>

        {/* 2. LIVE DATA TICKER (A MENTALIDADE DE ENGENHARIA) */}
        <div className="border-b border-zinc-900 bg-zinc-950 py-3 overflow-hidden flex relative z-20">
           <div className="whitespace-nowrap flex gap-16 animate-marquee text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-mono">
             <span><strong className="text-white">Status:</strong> Operacional</span>
             <span><strong className="text-white">Leilões Ativos:</strong> 3</span>
             <span><strong className="text-white">Média de Venda:</strong> 42.500€</span>
             <span><strong className="text-white">Visitantes Hoje:</strong> 1.240 (UK, FR, BR, PT)</span>
             <span><strong className="text-white">Novos Registos:</strong> +12%</span>
             {/* Repetição para loop */}
             <span><strong className="text-white">Status:</strong> Operacional</span>
             <span><strong className="text-white">Leilões Ativos:</strong> 3</span>
             <span><strong className="text-white">Média de Venda:</strong> 42.500€</span>
           </div>
        </div>

        {/* 3. O ECOSSISTEMA (NAV GRID) */}
        <section className="py-32 px-6 bg-black">
           <div className="max-w-7xl mx-auto">
             <div className="mb-20 flex justify-between items-end">
                <div>
                  <span className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Arquitetura do Portal</span>
                  <h2 className="text-5xl font-serif italic">Os Três Pilares</h2>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-zinc-500 text-xs font-mono">Select Module below</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
               
               {/* PILAR 1: COMPRAR */}
               <Link href={`/comprar${query}`} className="group bg-zinc-950 p-12 hover:bg-zinc-900 transition-all duration-700 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl font-serif text-[#C5A059] group-hover:opacity-100 transition-opacity transform translate-x-10 group-hover:translate-x-0 duration-500">01</div>
                 <h3 className="text-3xl font-serif italic text-white mb-6">Marketplace</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                   Uma seleção curada de exemplares com Pedigree Visual e dados biométricos completos. Acesso direto aos melhores criadores.
                 </p>
                 <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.3em] font-bold group-hover:text-white transition-colors">Aceder ao Laboratório →</span>
               </Link>

               {/* PILAR 2: LEILÕES */}
               <Link href={`/leiloes${query}`} className="group bg-zinc-950 p-12 hover:bg-zinc-900 transition-all duration-700 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl font-serif text-[#C5A059] group-hover:opacity-100 transition-opacity transform translate-x-10 group-hover:translate-x-0 duration-500">02</div>
                 <h3 className="text-3xl font-serif italic text-white mb-6">Leilões Live</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                   A sala de trading de alta frequência. Licite em tempo real em lotes exclusivos com total transparência e adrenalina.
                 </p>
                 <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.3em] font-bold group-hover:text-white transition-colors">Entrar na Sala →</span>
               </Link>

               {/* PILAR 3: VENDER */}
               <Link href={`/vender${query}`} className="group bg-zinc-950 p-12 hover:bg-zinc-900 transition-all duration-500 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl font-serif text-[#C5A059] group-hover:opacity-100 transition-opacity transform translate-x-10 group-hover:translate-x-0 duration-500">03</div>
                 <h3 className="text-3xl font-serif italic text-white mb-6">Vender</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                   Submeta o seu cavalo ao nosso Protocolo de Admissão. Auditoria veterinária e genética antes da publicação.
                 </p>
                 <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.3em] font-bold group-hover:text-white transition-colors">Iniciar Protocolo →</span>
               </Link>

             </div>
           </div>
        </section>

        {/* 4. O FUTURO (A MENTALIDADE "AINDA HÁ MUITO A FAZER") */}
        <section className="py-40 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
           {/* Efeito de Fundo Tecnológico */}
           <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px]"></div>

           <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <span className="inline-block py-1 px-3 border border-zinc-800 rounded-full text-[9px] text-zinc-500 uppercase tracking-widest mb-8">Roadmap 2026</span>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-10 text-white">
                "Ainda só estamos a <br/> <span className="text-zinc-600">começar.</span>"
              </h2>
              <div className="space-y-8 text-lg font-light text-zinc-400 leading-relaxed italic">
                <p>
                  O que vês hoje é apenas a fundação. A nossa visão vai muito além de um site.
                </p>
                <p>
                  Estamos a desenvolver algoritmos de <strong className="text-white not-italic">previsão genética</strong>, integração de <strong className="text-white not-italic">Blockchain</strong> para certificação de propriedade e uma rede global de <strong className="text-white not-italic">logística equestre</strong>.
                </p>
                <p>
                  O Portal Lusitano não vai parar até que o Cavalo Lusitano seja reconhecido como o ativo mais valioso do mundo equestre.
                </p>
              </div>

              <div className="mt-20 pt-10 border-t border-zinc-900 flex justify-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                 {/* Logos Fictícios de Parceiros Futuros (Ambição) */}
                 <span className="font-serif text-2xl text-zinc-600">NOVA FCT</span>
                 <span className="font-serif text-2xl text-zinc-600">APSL</span>
                 <span className="font-serif text-2xl text-zinc-600">FEI</span>
              </div>
           </div>
        </section>

        {/* 5. FOOTER MINIMALISTA */}
        <footer className="py-20 bg-black border-t border-zinc-900 text-center">
           <div className="mb-8">
             <span className="font-serif text-2xl tracking-tighter uppercase font-bold text-white">PORTAL</span>
             <span className="font-serif text-2xl tracking-tighter uppercase font-bold text-[#C5A059] ml-2">LUSITANO</span>
           </div>
           <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
             Engenharia & Tradição • Est. 2026 • Lisboa
           </p>
        </footer>

      </main>
    </>
  );
}