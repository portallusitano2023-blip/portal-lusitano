// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";

// 👇 1. IMPORTANTE: Confirma se o caminho da tua função está correto aqui
// Se guardaste em lib/shopify.ts, isto deve funcionar:
import { getProducts } from "@/lib/shopify"; 

export default async function LojaPage() {
  
  // 👇 2. Busca os produtos reais ao teu Shopify
  const products = await getProducts(); 

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
        
        {/* HERO SECTION (Mantém o design de luxo) */}
        <header className="max-w-7xl mx-auto mb-32 text-center border-b border-zinc-900 pb-20">
          <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-8 animate-pulse">
            Merchandising Oficial
          </span>
          <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter mb-10">
            Lifestyle & <span className="text-[#C5A059]">Legado</span>
          </h1>
          <p className="text-zinc-500 text-xl font-light italic max-w-2xl mx-auto">
            "A coleção exclusiva do Portal Lusitano. Integrada com o nosso armazém global."
          </p>
        </header>

        {/* GRELHA DE PRODUTOS (Com dados Reais) */}
        {products && products.length > 0 ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
            
            {products.map((product) => {
              // Preparação de dados (para evitar erros se faltar imagem)
              const image = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url || "";
              const price = product.priceRange?.minVariantPrice?.amount || "---";
              const currency = product.priceRange?.minVariantPrice?.currencyCode === "EUR" ? "€" : "€";

              return (
                <Link 
                  key={product.id} 
                  href={`/loja/${product.handle}`} // Assume que tens uma página de detalhe
                  className="group bg-black p-10 hover:bg-zinc-950 transition-colors relative flex flex-col"
                >
                  
                  {/* TAG DE STOCK */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-white text-black text-[9px] uppercase font-bold px-3 py-1 tracking-widest">
                      {product.availableForSale ? "Disponível" : "Esgotado"}
                    </span>
                  </div>

                  {/* IMAGEM DO PRODUTO */}
                  <div className="aspect-square overflow-hidden mb-8 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                    {image ? (
                      <img 
                        src={image} 
                        alt={product.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" 
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs">Sem Imagem</div>
                    )}
                  </div>

                  {/* INFORMAÇÃO */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-2xl font-serif italic text-white line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-xl font-light text-zinc-400">
                        {price} {currency}
                      </p>
                    </div>
                    
                    <button className="w-full border border-zinc-800 text-white py-4 text-[10px] uppercase font-bold tracking-[0.3em] group-hover:bg-[#C5A059] group-hover:text-black group-hover:border-[#C5A059] transition-all duration-300">
                      Ver Detalhes
                    </button>
                  </div>

                </Link>
              );
            })}
          </div>
        ) : (
          // ESTADO DE ERRO OU CARREGAMENTO
          <div className="text-center py-20 border border-dashed border-zinc-800 bg-zinc-900/20">
            <p className="text-white text-lg font-serif italic mb-2">A carregar coleção...</p>
            <p className="text-zinc-600 text-xs font-mono">
              Se isto demorar, verifica se a função <code>getProducts()</code> está a devolver dados corretamente.
            </p>
          </div>
        )}

      </main>
    </>
  );
}