// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LeiloesPage() {
  const auctions = await getProducts("leilao");

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 px-8 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-24 border-b border-zinc-900 pb-12">
          <div>
            <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold block mb-2">Auction House</span>
            <h1 className="text-7xl font-serif italic tracking-tighter text-white">Leilões Ativos</h1>
          </div>
          <p className="text-zinc-500 font-serif italic text-lg max-w-xs text-right hidden md:block opacity-60">
            Linhagens rigorosamente selecionadas para distinção.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {auctions.map((a) => (
            <div key={a.id} className="group border border-zinc-900 bg-zinc-950/20 p-4">
              <div className="aspect-[3/4] overflow-hidden mb-8 relative">
                <img 
                  src={a.images?.edges[0]?.node?.url} 
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-60"></div>
              </div>
              <h3 className="font-serif text-3xl mb-8 italic text-white">{a.title}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-zinc-600 text-[8px] uppercase tracking-widest mb-1 font-bold">Base de Licitação</p>
                  <p className="text-[#C5A059] font-serif text-2xl tracking-tighter">
                    {Number(a.priceRange.minVariantPrice.amount).toLocaleString('pt-PT')}€
                  </p>
                </div>
                <Link 
                  href={`/leiloes/${a.handle}`} 
                  className="bg-white text-black px-10 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-all duration-500"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}