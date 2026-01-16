// @ts-nocheck
import { getProducts } from "@/lib/shopify";

export default async function Page({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
  // NOVIDADE TÉCNICA: Nas versões recentes do Next.js, temos de fazer await disto
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  if (!isDev) {
    // LAYOUT DE MANUTENÇÃO (O que o mundo vê)
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8">
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

  // ÁREA DE TRABALHO PRIVADA (Só o Francisco vê)
  const products = await getProducts();
  
  return (
    <main className="min-h-screen bg-black text-white pt-40 px-10">
      <header className="mb-20 border-b border-zinc-900 pb-10 flex justify-between items-end">
        <div>
          <p className="text-[#C5A059] text-[10px] uppercase font-bold mb-2 italic">Dashboard de Engenharia</p>
          <h1 className="text-6xl font-serif italic">Portal Lusitano</h1>
        </div>
        <p className="text-zinc-500 text-[9px] uppercase tracking-widest">Modo Dev Ativo</p>
      </header>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {products.map((p) => (
            <div key={p.id} className="border border-zinc-900 p-8 hover:border-[#C5A059]/30 transition-all duration-700">
              <div className="aspect-square bg-zinc-950 mb-6 overflow-hidden">
                <img src={p.images?.[0]?.url || p.images?.edges?.[0]?.node?.url} alt={p.title} className="w-full h-full object-cover opacity-80" />
              </div>
              <h2 className="text-2xl font-serif mb-4 italic">{p.title}</h2>
              <p className="text-[#C5A059] font-serif text-xl">
                {Number(p.priceRange?.minVariantPrice?.amount || 0).toLocaleString('pt-PT')} €
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 border border-zinc-900 bg-zinc-950/20">
          <p className="text-zinc-500 italic">O catálogo está vazio ou a ligação ao Shopify falhou.</p>
          <p className="text-[9px] uppercase tracking-widest mt-4">Verifica se o Token Private está ativo no Shopify</p>
        </div>
      )}
    </main>
  );
}