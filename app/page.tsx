// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { client } from "@/lib/client";
import Newsletter from "@/components/Newsletter";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  
  // 1. Buscar PRODUTOS ao Shopify (Apenas os primeiros 4)
  let products = [];
  try {
    const allProducts = await getProducts();
    products = allProducts.slice(0, 4); // Pegar só 4
  } catch (e) {
    console.error("Erro Shopify na Home:", e);
  }

  // 2. Buscar NOTÍCIAS ao Sanity (Apenas as primeiras 3)
  let posts = [];
  try {
    posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...3] {
      title,
      publishedAt,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url
    }`);
  } catch (e) {
    console.error("Erro Sanity na Home:", e);
  }

  return (
    <>
      <Navbar />
      
      <main className="bg-[#050505] text-white selection:bg-[#C5A059] selection:text-black">
        
        {/* --- HERO SECTION (Capa do Site) --- */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Imagem de Fundo (Se tiveres vídeo, troca a tag img por video) */}
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://images.unsplash.com/photo-1534069376673-81b0a514d7a8?q=80&w=2000&auto=format&fit=crop" 
                 className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
                 alt="Lusitano Hero"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]"></div>
            </div>

            <div className="relative z-10 text-center max-w-4xl px-6">
                <span className="text-[#C5A059] text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold block mb-6 animate-fade-in-up">
                    Est. 2023 • Portugal
                </span>
                <h1 className="text-6xl md:text-9xl font-serif text-white tracking-tighter mb-8 drop-shadow-2xl">
                    Portal <span className="italic text-[#C5A059]">Lusitano</span>
                </h1>
                <p className="text-zinc-300 font-light text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                    A primeira plataforma digital dedicada exclusivamente à arte, cultura e comércio do cavalo mais antigo do mundo.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <Link href="/loja" className="px-8 py-4 bg-[#C5A059] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-white transition-all duration-500">
                        Visitar Loja
                    </Link>
                    <Link href="/coudelarias" className="px-8 py-4 border border-white/20 text-white font-bold uppercase text-xs tracking-[0.2em] hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-500">
                        Descobrir Coudelarias
                    </Link>
                </div>
            </div>
        </section>

        {/* --- DESTAQUES DA LOJA --- */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16 border-b border-zinc-900 pb-6">
                <div>
                    <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.3em] font-bold block mb-2">Shopify</span>
                    <h2 className="text-3xl md:text-4xl font-serif italic text-white">Coleção em Destaque</h2>
                </div>
                <Link href="/loja" className="hidden md:block text-[9px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Ver Tudo →</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                    products.map(product => (
                        <Link key={product.id} href={`/loja/${product.handle}`} className="group block">
                            <div className="aspect-[3/4] bg-[#F2F2F2] overflow-hidden mb-4 relative">
                                {product.images?.edges?.[0]?.node?.url && (
                                    <img 
                                        src={product.images.edges[0].node.url} 
                                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                                        alt={product.title}
                                    />
                                )}
                                <div className="absolute bottom-0 left-0 w-full bg-white/90 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-black text-[9px] uppercase tracking-widest font-bold">Comprar Agora</span>
                                </div>
                            </div>
                            <h3 className="text-white font-serif italic text-lg">{product.title}</h3>
                            <p className="text-[#C5A059] text-xs font-mono mt-1">
                                {Number(product.priceRange?.minVariantPrice?.amount).toFixed(2)} €
                            </p>
                        </Link>
                    ))
                ) : (
                    <p className="text-zinc-600 text-xs">A carregar produtos...</p>
                )}
            </div>
            
            <div className="mt-10 text-center md:hidden">
                <Link href="/loja" className="text-[10px] uppercase tracking-widest text-white border-b border-[#C5A059] pb-1">Ver Coleção Completa</Link>
            </div>
        </section>

        {/* --- DESTAQUES DO JORNAL --- */}
        <section className="py-32 bg-zinc-900/20 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.3em] font-bold block mb-4">Editorial</span>
                    <h2 className="text-4xl md:text-6xl font-serif text-white">Jornal Lusitano</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                                <div className="aspect-[16/10] overflow-hidden mb-6 bg-black border border-white/5 relative">
                                    {post.imageUrl && (
                                        <img 
                                            src={post.imageUrl} 
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                                            alt={post.title}
                                        />
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/80 text-[#C5A059] text-[8px] uppercase tracking-widest px-2 py-1">
                                            {new Date(post.publishedAt).toLocaleDateString('pt-PT')}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-serif text-zinc-200 group-hover:text-white transition-colors leading-tight mb-3">
                                    {post.title}
                                </h3>
                                <span className="text-[9px] uppercase tracking-widest text-zinc-500 group-hover:text-[#C5A059] transition-colors">Ler Artigo →</span>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-3 text-center text-zinc-600">Sem notícias recentes.</div>
                    )}
                </div>
            </div>
        </section>

        {/* --- NEWSLETTER & FOOTER --- */}
        <div className="pt-20 pb-10">
            <Newsletter />
            
            <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] uppercase tracking-widest">
                <p>&copy; 2026 Portal Lusitano. Francisco Gaspar.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="/termos" className="hover:text-white">Termos</Link>
                    <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
                    <a href="https://instagram.com/portal_lusitano" target="_blank" className="hover:text-[#C5A059]">Instagram</a>
                </div>
            </div>
        </div>

      </main>
    </>
  );
}