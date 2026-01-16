// @ts-nocheck
import { getProducts } from "@/lib/shopify";

export default async function Page({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
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

  // ÁREA DE TRABALHO DO FRANCISCO (Só tu vês com ?dev=true)
  // Filtramos pela tag 'loja' que acabaste de criar
  const products = await getProducts("loja");
  
  return (
    <main className="min-h-screen bg-black text-white pt-40 px-10 pb-20">
      <header className="mb-24 border-b border-zinc-900 pb-10">
        <p className="text-[#C5A059] text-[10px] uppercase font-bold mb-2 italic">Modo de Engenharia Ativo</p>
        <h1 className="text-6xl font-serif italic">Lifestyle Collection</h1>
      </header>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
          {products.map((p) => (
            <div key={p.id} className="group cursor-default">
              <div className="aspect-[4/5] bg-zinc-950 overflow-hidden border border-zinc-900 group-hover:border-[#C5A059]/30 transition-all duration-1000">
                <img 
                  src={p.images?.[0]?.url || p.images?.edges?.[0]?.node?.url} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" 
                />
              </div>
              <div className="mt-8 flex justify-between items-baseline border-b border-zinc-900 pb-4">
                <h2 className="font-serif text-2xl italic">{p.title}</h2>
                <p className="text-[#C5A059] font-serif text-xl">
                  {Number(p.priceRange?.minVariantPrice?.amount || 0).toLocaleString('pt-PT')} €
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 border border-zinc-900 bg-zinc-950/20">
          <p className="text-zinc-500 italic">Nenhum produto com a tag "loja" encontrado.</p>
        </div>
      )}
    </main>
  );
}