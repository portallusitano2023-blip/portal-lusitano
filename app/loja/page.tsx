// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LojaPage() {
  const products = await getProducts("loja"); 

  return (
    <main className="min-h-screen bg-black text-white pt-40 px-8 pb-32">
      <div className="max-w-5xl mx-auto">
        <header className="mb-32 text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.6em] text-[10px] font-bold block mb-4">Boutique</span>
          <h1 className="text-6xl font-serif italic tracking-tight text-white text-center">Lifestyle Collection</h1>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mt-8 opacity-30"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
          {products.map((p) => (
            <Link href={`/loja/${p.handle}`} key={p.id} className="group">
              <div className="aspect-[4/5] bg-[#0A0A0A] overflow-hidden border border-zinc-900 group-hover:border-[#C5A059]/40 transition-all duration-1000">
                <img 
                  src={p.images?.edges[0]?.node?.url} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]" 
                />
              </div>
              <div className="mt-8 flex justify-between items-baseline border-b border-zinc-900 pb-4">
                <h2 className="font-serif text-2xl italic tracking-wide">{p.title}</h2>
                <p className="text-[#C5A059] font-serif text-xl">
                  {Number(p.priceRange.minVariantPrice.amount).toLocaleString('pt-PT')}€
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}