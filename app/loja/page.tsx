// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Navbar from "@/components/Navbar";

export default async function LojaPage({ searchParams }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  if (!isDev) return null; // Proteção extra

  const products = await getProducts("loja");

  return (
    <>
      <Navbar isDev={true} />
      <main className="min-h-screen bg-black text-white pt-40 px-10 pb-20">
        <header className="mb-24 border-b border-zinc-900 pb-10">
          <h1 className="text-6xl font-serif italic text-white">Lifestyle Collection</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((p) => (
            <div key={p.id} className="group">
              <div className="aspect-square bg-zinc-950 overflow-hidden border border-zinc-900 group-hover:border-[#C5A059]/30 transition-all duration-1000">
                <img src={p.images?.[0]?.url || p.images?.edges?.[0]?.node?.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
              </div>
              <div className="mt-6 flex justify-between items-baseline border-b border-zinc-900 pb-4">
                <h2 className="font-serif text-xl italic">{p.title}</h2>
                <p className="text-[#C5A059] font-serif text-lg">{Number(p.priceRange?.minVariantPrice?.amount || 0).toLocaleString('pt-PT')} €</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}