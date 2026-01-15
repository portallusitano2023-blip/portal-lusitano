// @ts-nocheck
export const dynamic = 'force-dynamic';

import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export default async function HomePage() {
  // Tentamos obter os produtos, mas se falhar (401), o site não crasha
  const products = await getProducts() || [];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* CABEÇALHO */}
      <section className="pt-40 pb-20 px-6 text-center">
        <h1 className="text-6xl font-serif italic mb-6">Portal Lusitano</h1>
        <p className="text-zinc-500 uppercase tracking-[0.5em] text-[10px]">Excelência Equestre</p>
      </section>

      {/* PRODUTOS / CAVALOS */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border border-zinc-900 p-6 hover:border-[#C5A059] transition-all">
              <h3 className="font-serif text-xl">{product.title}</h3>
              <Link href={`/cavalos/${product.handle}`} className="text-[#C5A059] text-[10px] uppercase mt-4 block">Ver Detalhes</Link>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-20 border border-dashed border-zinc-800">
            <p className="text-zinc-600 font-serif italic">Catálogo temporariamente indisponível.</p>
          </div>
        )}
      </section>
    </main>
  );
}