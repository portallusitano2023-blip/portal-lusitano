// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export default async function Page({ searchParams }) {
  // Ativa o modo de trabalho apenas para ti
  const isDev = searchParams?.dev === "true";

  if (!isDev) {
    // O que o MUNDO e o GOOGLE veem (Manutenção de Luxo)
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8">
            Portal Lusitano
          </span>
          <h1 className="text-5xl font-serif italic mb-8">The Future of Elite</h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-10 opacity-40"></div>
          <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase">
            Private Preview — Opening 2026
          </p>
        </div>
      </main>
    );
  }

  // O TEU SITE REAL (O que só tu vês para continuar a trabalhar)
  const products = await getProducts("loja");
  
  return (
    <main className="min-h-screen bg-black text-white pt-40 px-10">
      <header className="mb-20 border-b border-zinc-900 pb-10">
        <p className="text-[#C5A059] text-[10px] uppercase font-bold mb-2">Modo de Edição</p>
        <h1 className="text-6xl font-serif italic">Loja Portal Lusitano</h1>
      </header>

      <div className="grid grid-cols-2 gap-16">
        {products.map((p) => (
          <div key={p.id} className="border border-zinc-900 p-8">
            <h2 className="text-2xl font-serif mb-4">{p.title}</h2>
            <p className="text-[#C5A059] font-bold">
              {Number(p.priceRange.minVariantPrice.amount).toLocaleString('pt-PT')} €
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}