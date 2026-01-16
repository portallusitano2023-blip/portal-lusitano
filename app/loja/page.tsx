// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export default async function LojaPage() {
  // FILTRO: Pedimos apenas o que é para a loja
  const products = await getProducts("loja"); 

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6">
      <h1 className="text-5xl font-serif italic mb-12 border-b border-zinc-900 pb-8">Loja Portal Lusitano</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {products.map((p) => (
          <div key={p.id} className="border border-zinc-900 p-6">
            <img src={p.images?.edges[0]?.node?.url} className="mb-4 aspect-square object-cover" />
            <h2 className="font-serif text-xl">{p.title}</h2>
            <p className="text-[#C5A059] font-bold mb-4">{Number(p.priceRange.minVariantPrice.amount).toLocaleString('pt-PT')} €</p>
            <Link href={`/loja/${p.handle}`} className="border border-zinc-800 px-6 py-2 text-[10px] uppercase">Ver Detalhes</Link>
          </div>
        ))}
      </div>
    </main>
  );
}