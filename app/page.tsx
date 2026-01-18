// @ts-nocheck
import Navbar from "@/components/Navbar";
import LandingContent from "@/components/LandingContent";

export default async function HomePage({ searchParams }) {
  // Em Next.js 16, searchParams é uma Promise
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  // SE NÃO TIVER O LINK ?dev=true: Mostra apenas manutenção
  if (!isDev) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8 animate-pulse">
          Portal Lusitano
        </span>
        <h1 className="text-4xl md:text-6xl font-serif italic mb-8">The Future of Elite</h1>
        <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase italic">Private Preview — 2026</p>
      </main>
    );
  }

  // SE TIVER O LINK: Mostra a nova página de impacto
  return (
    <>
      <Navbar dev={true} />
      <LandingContent />
    </>
  );
}