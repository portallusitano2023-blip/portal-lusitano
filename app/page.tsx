// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  // SE NÃO FOR O FRANCISCO: Ecrã de Manutenção de Prestígio
  if (!isDev) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-[#C5A059]/20 blur-xl rounded-full opacity-50 animate-pulse"></div>
          <span className="relative text-[#C5A059] uppercase tracking-[0.8em] text-[11px] font-bold block">
            Portal Lusitano
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter text-white leading-tight">
          The Future of <span className="text-[#C5A059]">Elite</span>
        </h1>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mb-12 opacity-60"></div>
        <p className="text-zinc-400 font-light tracking-[0.4em] text-[10px] uppercase">
          Private Preview — Opening Early 2026
        </p>
      </main>
    );
  }

  // SE FOR O FRANCISCO: Landing Page Real (Modo Engenharia)
  return (
    <>
      <Navbar dev={true} />
      <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Imagem de Fundo com Efeito de Luxo */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071')] bg-cover bg-center opacity-30 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mt-20">
          <span className="text-[#C5A059] uppercase tracking-[0.6em] text-[12px] font-bold block mb-8 italic">
            Excelência Equestre
          </span>
          
          {/* TÍTULO PRINCIPAL COM AS CORES PEDIDAS */}
          <h1 className="text-7xl md:text-9xl font-serif tracking-tighter text-white mb-16 leading-[0.9]">
            <span className="block">PORTAL</span>
            <span className="text-[#C5A059] italic">LUSITANO</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link href="/leiloes?dev=true" className="bg-[#C5A059] text-black px-16 py-5 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all duration-700 w-72 hover:scale-105">
              Ver Leilões
            </Link>
            <Link href="/loja?dev=true" className="border border-white/20 text-white px-16 py-5 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-700 w-72 hover:scale-105">
              Explorar Loja
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}