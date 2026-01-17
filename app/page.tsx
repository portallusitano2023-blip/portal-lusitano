// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  // SE NÃO FOR O FRANCISCO: Ecrã de Manutenção de Prestígio
  if (!isDev) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6 text-center">
        <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8 animate-pulse">
          Portal Lusitano
        </span>
        <h1 className="text-4xl md:text-6xl font-serif italic mb-8 tracking-tighter text-white">
          The Future of Lusitano Elite
        </h1>
        <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-12 opacity-40"></div>
        <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase">
          Private Preview — Opening Early 2026
        </p>
      </main>
    );
  }

  // SE FOR O FRANCISCO: O Site Real (Workspace)
  return (
    <>
      <Navbar dev={true} />
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
        {/* Fundo de Prestígio */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="text-[#C5A059] uppercase tracking-[0.6em] text-[11px] font-bold block mb-6 italic">
            Excelência Equestre
          </span>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-white mb-12">
            O Mercado de Elite do Cavalo Lusitano
          </h1>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/leiloes?dev=true" className="bg-[#C5A059] text-black px-12 py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all w-full md:w-auto">
              Ver Leilões
            </Link>
            <Link href="/loja?dev=true" className="border border-white/20 px-12 py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all w-full md:w-auto">
              Explorar Loja
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}