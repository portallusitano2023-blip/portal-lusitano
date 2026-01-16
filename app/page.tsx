// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export default async function Page({ searchParams }) {
  const isDev = searchParams.dev === "true";

  // SE NÃO FOR O FRANCISCO (DEV), MOSTRA MANUTENÇÃO DE LUXO
  if (!isDev) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8 animate-pulse">
            Portal Lusitano
          </span>
          <h1 className="text-5xl font-serif italic mb-8 text-white">The Future of Elite</h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-12 opacity-40"></div>
          <p className="text-zinc-500 font-light tracking-[0.4em] text-[9px] uppercase">
            Private Development Mode — 2026
          </p>
        </div>
      </main>
    );
  }

  // SE FOR O FRANCISCO (?dev=true), MOSTRA O SITE REAL PARA TRABALHARES
  const products = await getProducts("loja");
  return (
    <main className="min-h-screen bg-black text-white pt-40 px-8">
      <h1 className="text-4xl font-serif italic mb-10">Área de Trabalho (Modo Dev)</h1>
      <div className="grid grid-cols-2 gap-10">
        {products.map(p => (
          <div key={p.id} className="border border-zinc-800 p-4">
            <p>{p.title}</p>
          </div>
        ))}
      </div>
      <p className="mt-20 text-[#C5A059] text-xs uppercase italic">Apenas tu estás a ver isto.</p>
    </main>
  );
}