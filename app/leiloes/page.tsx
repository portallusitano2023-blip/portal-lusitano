// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LeiloesPage() {
  // Filtramos apenas os produtos que têm a tag 'leilao' ou 'cavalo'
  const allProducts = await getProducts();
  const auctions = allProducts || [];

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-serif italic mb-12 border-b border-zinc-900 pb-8">Leilões Ativos</h1>
        
        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {auctions.map((item) => (
              <div key={item.id} className="border border-zinc-900 p-6 hover:border-[#C5A059] transition-all">
                <h2 className="font-serif text-xl mb-4">{item.title}</h2>
                <p className="text-[#C5A059] font-bold mb-6">
                  {item.priceRange?.minVariantPrice?.amount 
                    ? `${Number(item.priceRange.minVariantPrice.amount).toLocaleString('pt-PT')} €`
                    : "Sob Consulta"}
                </p>
                <Link href={`/leiloes/${item.handle}`} className="text-[10px] uppercase tracking-widest border border-zinc-800 px-6 py-2">
                  Ver Proposta
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-zinc-900">
            <p className="text-zinc-500 font-serif italic text-lg">Sincronizando leilões com o Shopify...</p>
          </div>
        )}
      </div>
    </main>
  );
}