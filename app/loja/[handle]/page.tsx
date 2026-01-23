// @ts-nocheck
import { getProduct } from "@/lib/shopify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDisplay from "@/components/ProductDisplay";

export default async function ProductPage({ params }) {
  // 1. Resolvemos os params (Next.js 15+)
  const resolvedParams = await params;
  
  // 2. IMPORTANTE: Descodificamos o handle (converte %C2%AE de volta para ®)
  const handle = decodeURIComponent(resolvedParams.handle);

  const product = await getProduct(handle);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-10">
          <h1 className="text-2xl font-serif italic mb-4 text-[#C5A059]">Peça não encontrada</h1>
          <p className="text-zinc-500 mb-8 text-center max-w-md">
            O sistema não encontrou a peça com o handle: <br/>
            <span className="text-white font-mono text-xs italic">"{handle}"</span>
          </p>
          <a href="/loja" className="border border-white/20 px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Voltar à Coleção
          </a>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#050505] min-h-screen pt-40 pb-20 selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-7xl mx-auto px-6">
          
          <ProductDisplay product={product} />

          {/* Secção de Detalhes Técnicos */}
          <div className="mt-32 max-w-2xl border-t border-zinc-900 pt-12">
             <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-[#C5A059]"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                    Manifesto da Peça
                  </span>
             </div>
             
             <div 
                className="prose prose-invert prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-light prose-strong:text-white"
                dangerouslySetInnerHTML={{ 
                  __html: product.descriptionHtml || product.description || "" 
                }} 
             />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}