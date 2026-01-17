// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  if (!isDev) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8 animate-pulse">Portal Lusitano</span>
        <h1 className="text-4xl md:text-6xl font-serif italic mb-8">The Future of Elite</h1>
        <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase">Private Preview — 2026</p>
      </main>
    );
  }

  return (
    <>
      <Navbar dev={true} />
      <main className="relative min-h-screen bg-black overflow-hidden">
        {/* Background Video ou Imagem de Ultra-Qualidade */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071')] bg-cover bg-center opacity-40 scale-105 animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.7em] text-[11px] font-bold block mb-8 italic">A Herança do Cavalo de Reis</span>
          
          <h1 className="text-7xl md:text-[10rem] font-serif tracking-tighter leading-[0.85] mb-16 text-white">
            PORTAL <span className="text-[#C5A059] italic block md:inline">LUSITANO</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <Link href="/leiloes?dev=true" className="group border border-white/10 bg-black/20 backdrop-blur-md p-10 hover:border-[#C5A059]/50 transition-all duration-700">
              <span className="text-[#C5A059] text-[9px] uppercase tracking-widest font-bold block mb-4">Exclusividade</span>
              <h2 className="text-2xl font-serif italic text-white group-hover:text-[#C5A059] transition-colors">Leilões Ativos</h2>
            </Link>
            
            <Link href="/loja?dev=true" className="group border border-white/10 bg-black/20 backdrop-blur-md p-10 hover:border-[#C5A059]/50 transition-all duration-700">
              <span className="text-[#C5A059] text-[9px] uppercase tracking-widest font-bold block mb-4">Boutique</span>
              <h2 className="text-2xl font-serif italic text-white group-hover:text-[#C5A059] transition-colors">Lifestyle Store</h2>
            </Link>

            <Link href="/vender?dev=true" className="group border border-[#C5A059]/30 bg-[#C5A059]/5 backdrop-blur-md p-10 hover:bg-[#C5A059] transition-all duration-700">
              <span className="text-white text-[9px] uppercase tracking-widest font-bold block mb-4 group-hover:text-black">Oportunidade</span>
              <h2 className="text-2xl font-serif italic text-[#C5A059] group-hover:text-black transition-colors">Vender Exemplar</h2>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}