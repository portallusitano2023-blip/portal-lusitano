// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export default async function Page({ searchParams }) {
  // Verificamos se és tu a aceder através do parâmetro ?dev=true
  const isDev = searchParams?.dev === "true";

  if (!isDev) {
    // LAYOUT DE MANUTENÇÃO (O que o público e o Google veem)
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8 animate-pulse">
            Portal Lusitano
          </span>
          <h1 className="text-5xl font-serif italic mb-8">The Future of Elite</h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-12 opacity-40"></div>
          <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase">
            Private Preview — Opening 2026
          </p>
        </div>
      </main>
    );
  }

  // SITE REAL (O que só tu vês para continuar a trabalhar)
  const products = await getProducts("loja");
  return (
    <main className="min-h-screen bg-black text-white pt-40 px-8 pb-20">
      <div className="max-w-5xl mx-auto">
        <header className="mb-20">
          <p className="text-[#C5A059] text-[10px] uppercase font-bold tracking-widest italic mb-2">Modo Programador Ativo</p>
          <h1 className="text-6xl font-serif italic">Portal Lusitano — Dashboard</h1>
        </header>
        
        <div className="grid grid-cols-2 gap-10">
          {products.map(p => (
            <div key={p.id} className="border border-zinc-900 p-6">
              <h2 className="font-serif text-xl">{p.title}</h2>
              <p className="text-[#C5A059]">{Number(p.priceRange.minVariantPrice.amount).toLocaleString('pt-PT')}€</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}