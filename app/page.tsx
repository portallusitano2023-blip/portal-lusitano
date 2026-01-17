// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  // SE NÃO FOR O FRANCISCO: Ecrã de Manutenção Blindado
  if (!isDev) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6 text-center">
        <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8 animate-pulse">
          Portal Lusitano
        </span>
        <h1 className="text-4xl md:text-6xl font-serif italic mb-8 tracking-tighter text-white leading-tight">
          The Future of Lusitano Elite
        </h1>
        <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-12 opacity-40"></div>
        <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase">
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
        {/* Imagem de Fundo de Elite */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071')] bg-cover bg-center opacity-30 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <span className="text-[#C5A059] uppercase tracking-[0.6em] text-[11px] font-bold block mb-8 italic">
            Excelência Equestre
          </span>
          <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter text-white mb-16 leading-[0.9]">
            O Mercado de Elite do Cavalo Lusitano
          </h1>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link href="/leiloes?dev=true" className="bg-[#C5A059] text-black px-16 py-5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all duration-700 w-64">
              Ver Leilões
            </Link>
            <Link href="/loja?dev=true" className="border border-white/20 text-white px-16 py-5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-700 w-64">
              Explorar Loja
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}