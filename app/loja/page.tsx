// @ts-nocheck
import Navbar from "@/components/Navbar";
import { getProducts } from "@/lib/shopify";
import Image from "next/image"; // Importar componente Image
// Adiciona logo a seguir aos imports
export const dynamic = 'force-dynamic';
export default async function LojaPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
        
        <header className="max-w-7xl mx-auto mb-20 text-center border-b border-zinc-900 pb-10">
          <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-8 animate-pulse">
            Loja Oficial
          </span>
          <h1 className="text-5xl font-serif italic text-white mb-4">
            Portal <span className="text-[#C5A059]">Collection</span>
          </h1>
        </header>

        {products.length > 0 ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
            {products.map((product) => {
              const image = product.images?.edges?.[0]?.node?.url;
              const price = product.priceRange?.minVariantPrice?.amount;

              return (
                <div key={product.id} className="group bg-black p-10 hover:bg-zinc-950 transition-colors relative flex flex-col">
                  <div className="absolute top-6 left-6 z-10">
                    <span className={`text-[9px] uppercase font-bold px-3 py-1 tracking-widest ${product.availableForSale ? 'bg-white text-black' : 'bg-red-900 text-white'}`}>
                      {product.availableForSale ? "Disponível" : "Esgotado"}
                    </span>
                  </div>

                  {/* IMAGEM OTIMIZADA NEXT.JS */}
                  <div className="aspect-square overflow-hidden mb-8 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                    {image ? (
                      <Image 
                        src={image} 
                        alt={product.title} 
                        fill // Ocupa o quadrado
                        sizes="(max-width: 768px) 100vw, 33vw" // Diz ao browser qual o tamanho real
                        className="object-cover transform group-hover:scale-110 transition-transform duration-[2s]" 
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600 text-xs">Sem Imagem</div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-xl font-serif italic text-white line-clamp-1">{product.title}</h3>
                      <p className="text-lg text-zinc-400">{Number(price).toFixed(2)} €</p>
                    </div>
                    <button className="w-full border border-zinc-800 text-white py-4 text-[10px] uppercase font-bold tracking-[0.3em] group-hover:bg-[#C5A059] group-hover:text-black group-hover:border-[#C5A059] transition-all duration-300">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800">
            <p className="text-zinc-500">A carregar inventário...</p>
          </div>
        )}

      </main>
    </>
  );
}