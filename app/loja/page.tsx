// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Navbar from "@/components/Navbar";

export default async function LojaPage({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";
  if (!isDev) return null;

  const products = await getProducts("loja");

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-40 px-6 md:px-20 pb-32">
        
        {/* TÍTULO CENTRALIZADO */}
        <header className="mb-24 text-center relative">
          <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">
            Boutique Exclusiva
          </span>
          <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter text-white mb-8">
            Lifestyle Collection
          </h1>
          {/* Linha decorativa dourada por baixo do título */}
          <div className="w-24 h-[1px] bg-[#C5A059] mx-auto opacity-50"></div>
        </header>

        {/* GRELHA DE 4 COLUNAS (Imagens mais pequenas) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((p) => (
            <div key={p.id} className="group cursor-pointer">
              <div className="aspect-square bg-zinc-950 overflow-hidden border border-zinc-900 group-hover:border-[#C5A059]/40 transition-all duration-500">
                <img 
                  src={p.images?.[0]?.url || p.images?.edges?.[0]?.node?.url} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
              </div>
              <div className="mt-6 text-center">
                <h2 className="font-serif text-lg italic mb-2">{p.title}</h2>
                <p className="text-[#C5A059] font-serif text-md tracking-wider">
                  {Number(p.priceRange?.minVariantPrice?.amount || 0).toLocaleString('pt-PT')} €
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}