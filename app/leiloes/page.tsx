// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export default async function LeiloesPage() {
  // FILTRO: Pedimos apenas os cavalos para leilão
  const auctions = await getProducts("leilao");

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 px-6">
      <h1 className="text-5xl font-serif italic mb-12 border-b border-zinc-900 pb-8">Leilões Ativos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {auctions.map((a) => (
          <div key={a.id} className="bg-zinc-950 border border-zinc-900 p-6 hover:border-[#C5A059] transition-all">
            <img src={a.images?.edges[0]?.node?.url} className="mb-4 aspect-[4/5] object-cover" />
            <h2 className="font-serif text-2xl mb-2">{a.title}</h2>
            <p className="text-zinc-500 text-[9px] uppercase tracking-widest mb-1">Licitação Inicial</p>
            <p className="text-[#C5A059] font-serif text-2xl font-bold mb-6">{Number(a.priceRange.minVariantPrice.amount).toLocaleString('pt-PT')} €</p>
            <Link href={`/leiloes/${a.handle}`} className="bg-white text-black block text-center py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C5A059] transition-colors">
              Efetuar Licitação
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}