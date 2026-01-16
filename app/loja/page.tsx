// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LojaPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 border-b border-zinc-900 pb-8">
          <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold block mb-2">Shopping</span>
          <h1 className="text-5xl font-serif italic text-white">Loja Portal Lusitano</h1>
        </div>
        
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.map((product) => (
              <div key={product.id} className="group border border-zinc-900 p-6 hover:border-[#C5A059] transition-all duration-500">
                <div className="aspect-square bg-zinc-950 mb-6 overflow-hidden">
                  {product.images?.[0]?.url || product.images?.edges?.[0]?.node?.url ? (
                    <img 
                      src={product.images?.[0]?.url || product.images?.edges?.[0]?.node?.url} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-800 text-[9px] uppercase tracking-widest">Sem Imagem</div>
                  )}
                </div>
                
                <h2 className="font-serif text-xl mb-2 text-white">{product.title}</h2>
                
                {/* LÓGICA DO PRICERANGE: Opcional Chaining (?.) garante que não crasha */}
                <p className="text-[#C5A059] font-bold text-lg mb-6">
                  {product.priceRange?.minVariantPrice?.amount 
                    ? `${Number(product.priceRange.minVariantPrice.amount).toLocaleString('pt-PT')} €`
                    : "Preço sob consulta"}
                </p>

                <Link 
                  href={`/loja/${product.handle}`} 
                  className="inline-block border border-zinc-800 px-8 py-3 text-[10px] uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-300"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-zinc-900 bg-zinc-950/30">
            <p className="text-zinc-500 font-serif italic text-xl mb-4">A sincronizar catálogo...</p>
            <p className="text-[9px] text-zinc-700 uppercase tracking-widest">A aguardar resposta do Shopify Headless</p>
          </div>
        )}
      </div>
    </main>
  );
}