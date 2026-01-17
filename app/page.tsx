// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function HomePage({ searchParams }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  if (!isDev) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold mb-8 animate-pulse">Portal Lusitano</span>
        <h1 className="text-4xl md:text-6xl font-serif italic mb-8">The Future of Elite</h1>
        <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase">Private Preview — 2026</p>
      </main>
    );
  }

  return (
    <>
      <Navbar dev={true} />
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Imagem de Fundo de Luxo */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        
        <div className="relative z-10 text-center px-6">
          <span className="text-[#C5A059] uppercase tracking-[0.6em] text-[12px] font-bold block mb-6">Bem-vindo ao</span>
          <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter mb-12">Portal Lusitano</h1>
          <div className="flex gap-6 justify-center">
            <Link href="/leiloes?dev=true" className="bg-[#C5A059] text-black px-12 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-white transition-all">Ver Leilões</Link>
            <Link href="/loja?dev=true" className="border border-white/20 px-12 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-all">Explorar Loja</Link>
          </div>
        </div>
      </main>
    </>
  );
}