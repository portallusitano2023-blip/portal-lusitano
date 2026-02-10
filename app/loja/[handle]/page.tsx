import { getProduct } from "@/lib/shopify";
import ProductDisplay from "@/components/ProductDisplay";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const handle = decodeURIComponent(resolvedParams.handle);

  const product = await getProduct(handle);

  if (!product) {
    return (
      <main className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-10">
        <h1 className="text-2xl font-serif italic mb-4 text-[#C5A059]">Peça não encontrada</h1>
        <p className="text-zinc-500 mb-8 text-center max-w-md">
          O sistema não encontrou a peça com o handle: <br />
          <span className="text-white font-mono text-xs italic">&ldquo;{handle}&rdquo;</span>
        </p>
        <Link
          href="/loja"
          className="border border-white/20 px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Voltar à Coleção
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#050505] min-h-screen pt-40 pb-20 selection:bg-[#C5A059] selection:text-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Componente Principal */}
        <ProductDisplay product={product} />

        {/* Secção de Texto Puro (O Manifesto) */}
        <div className="mt-32 max-w-2xl border-t border-zinc-900 pt-12">
          <div
            className="prose prose-invert prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-light prose-strong:text-white"
            dangerouslySetInnerHTML={{
              __html: product.descriptionHtml || "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
