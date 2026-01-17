// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Navbar from "@/components/Navbar";

export default async function LojaPage({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";
  
  if (!isDev) return null; // Proteção adicional

  const products = await getProducts("loja");

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 px-10 pb-32">
        <header className="mb-24 border-b border-zinc-900 pb-12 flex justify-between items-end">
          <h1 className="text-6xl font-serif italic tracking-tighter">Lifestyle Collection</h1>
          <p className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold italic mb-3">
            Engenharia Ativa
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
          {products.map((p) => (
            <div key={p.id} className="group">
              <div className="aspect-square bg-zinc-950 overflow-hidden border border-zinc-900 group-hover:border-[#C5A059]/40 transition-all duration-1000">
                <img 
                  src={p.images?.[0]?.url || p.images?.edges?.[0]?.node?.url} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]" 
                />
              </div>
              <div className="mt-8 flex justify-between items-baseline border-b border-zinc-900 pb-5">
                <h2 className="font-serif text-2xl italic tracking-wide">{p.title}</h2>
                <p className="text-[#C5A059] font-serif text-xl tracking-tighter">
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