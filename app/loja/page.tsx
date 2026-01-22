// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function LojaPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {products.map((product) => (
            <div key={product.id} className="border border-zinc-900 p-10 flex flex-col items-center group">
              <div className="aspect-square w-full bg-zinc-900 mb-8 overflow-hidden border border-zinc-800 group-hover:border-[#C5A059]/50 transition-all">
                <img 
                  src={product.images[0]?.url} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                />
              </div>
              <h3 className="text-2xl font-serif italic mb-2">{product.title}</h3>
              <p className="text-[#C5A059] font-serif mb-8">
                {Number(product.priceRange.minVariantPrice.amount).toFixed(2)} €
              </p>
              
              <a 
                href={`/loja/${product.handle}`} 
                className="bg-white text-black px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-all"
              >
                Ver Detalhes
              </a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}