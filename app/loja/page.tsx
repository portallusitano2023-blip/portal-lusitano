import { getProducts } from "../../lib/shopify";

export default async function LojaPage() {
  const products = await getProducts();

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      {/* Container Principal com espaçamento para o menu fixo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Cabeçalho da Página */}
        <div className="text-center mb-20 space-y-4 animate-fadeIn">
          <span className="text-[#C5A059] text-xs font-bold tracking-[0.3em] uppercase">
            Loja Oficial
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide">
            COLEÇÃO <span className="italic text-[#C5A059]">PORTAL LUSITANO</span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mt-6 opacity-50"></div>
        </div>

        {/* Aviso se não houver produtos */}
        {(!products || products.length === 0) && (
          <div className="text-center text-gray-500 py-20 border border-gray-900 rounded-lg">
            <p className="font-serif text-xl">A carregar coleção...</p>
            <p className="text-sm mt-2 opacity-50">Se demorar, verifica o estado no Shopify.</p>
          </div>
        )}

        {/* Grelha de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products && products.map((item: any) => {
            const product = item.node;
            const price = product.priceRange?.minVariantPrice?.amount || "0.00";
            const currency = product.priceRange?.minVariantPrice?.currencyCode || "EUR";
            const image = product.images?.edges[0]?.node?.url;

            return (
              <a 
                key={product.id} 
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/products/${product.handle}`} 
                target="_blank" 
                className="group block"
              >
                {/* Imagem do Produto */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111] mb-6 border border-gray-900 group-hover:border-[#C5A059]/50 transition-colors duration-500">
                  {image ? (
                    <img 
                      src={image} 
                      alt={product.title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600 font-serif text-sm tracking-widest uppercase">
                      Imagem Indisponível
                    </div>
                  )}
                  
                  {/* Etiqueta "Ver no Shopify" ao passar o rato */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="border border-white/30 text-white px-6 py-2 text-xs tracking-widest uppercase backdrop-blur-sm">
                      Ver Detalhes
                    </span>
                  </div>
                </div>

                {/* Detalhes do Produto */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium text-gray-200 group-hover:text-[#C5A059] transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="font-serif italic text-[#C5A059] text-xl">
                    {price} {currency === 'EUR' ? '€' : currency}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}