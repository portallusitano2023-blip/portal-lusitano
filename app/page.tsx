import { client } from "@/lib/client";
import { getProducts } from "../lib/shopify"; // Importa os produtos do Shopify
import Image from "next/image";
import Link from "next/link";

const QUERY = `*[_type == "cavalo"] | order(_createdAt desc) {
  _id, nome, preco, localizacao, disciplina, "slug": slug.current, "imagemUrl": fotografiaPrincipal.asset->url
}`;

export default async function Home() {
  // 1. Buscar Cavalos (Sanity)
  const cavalos: any[] = await client.fetch(QUERY);
  const destaque = cavalos[0];

  // 2. Buscar Produtos (Shopify)
  // Se não houver produtos, evita erro com um array vazio
  const products = (await getProducts()) || [];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#C5A059] selection:text-black">
      
      {/* === SECÇÃO 1: HERO (O Cavalo) === */}
      {destaque && (
        <section className="relative h-[95vh] w-full flex items-end justify-start p-8 lg:p-20 border-b border-gray-900">
          {/* Imagem de Fundo */}
          <div className="absolute inset-0 z-0">
             {destaque.imagemUrl && (
               <Image 
                 src={destaque.imagemUrl} 
                 alt={destaque.nome} 
                 fill 
                 className="object-cover opacity-70" 
                 priority 
               />
             )}
             {/* Gradiente para o texto se ler melhor */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          {/* Texto do Hero */}
          <div className="relative z-10 max-w-4xl animate-fadeIn">
             <span className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-bold mb-4 block pl-1">
               Destaque da Semana
             </span>
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 leading-none text-white">
               {destaque.nome}
             </h1>
             <Link href={`/cavalo/${destaque.slug}`}>
               <button className="bg-[#C5A059] text-black px-12 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition duration-500 ease-out">
                 Ver Cavalo
               </button>
             </Link>
          </div>
        </section>
      )}

      {/* === SECÇÃO 2: BOUTIQUE (Destaques da Loja) === */}
      {products.length > 0 && (
        <section className="py-32 px-4 max-w-7xl mx-auto">
          
          {/* Cabeçalho da Secção */}
          <div className="text-center mb-20 space-y-4">
            {/* MUDANÇA AQUI: Texto corrigido para português e com classe */}
            <span className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase">
              Coleção Exclusiva
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white">
              BOUTIQUE <span className="text-[#C5A059] italic">LUSITANO</span>
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto opacity-50"></div>
          </div>

          {/* Grelha de Produtos (Mostra apenas os 3 primeiros) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((item: any) => {
               const product = item.node;
               const price = product.priceRange?.minVariantPrice?.amount || "0.00";
               const currency = product.priceRange?.minVariantPrice?.currencyCode === 'EUR' ? '€' : product.priceRange?.minVariantPrice?.currencyCode;
               const image = product.images?.edges[0]?.node?.url;

               return (
                 <a 
                   key={product.id} 
                   href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/products/${product.handle}`} 
                   target="_blank" 
                   className="group block bg-[#0a0a0a] border border-gray-900 hover:border-[#C5A059]/50 transition-all duration-500"
                 >
                   {/* Imagem */}
                   <div className="relative aspect-[4/5] overflow-hidden">
                     {image ? (
                       <img 
                         src={image} 
                         alt={product.title} 
                         className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600 text-xs uppercase tracking-widest">
                         Sem Imagem
                       </div>
                     )}
                     
                     {/* Botão Overlay */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        <span className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest">
                          Comprar
                        </span>
                     </div>
                   </div>
                   
                   {/* Informação */}
                   <div className="p-8 text-center">
                     <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2 group-hover:text-white transition-colors">
                       {product.title}
                     </h3>
                     <p className="text-[#C5A059] font-serif text-xl italic">
                       {price} {currency}
                     </p>
                   </div>
                 </a>
               );
            })}
          </div>

          {/* Botão Ver Toda a Loja */}
          <div className="text-center mt-20">
            <Link href="/loja">
              <button className="border border-white/20 text-white px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white hover:text-black transition duration-300">
                Ver Coleção Completa
              </button>
            </Link>
          </div>

        </section>
      )}

    </main>
  );
}