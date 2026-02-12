import { getProduct } from "@/lib/shopify";
import ProductDisplay from "@/components/ProductDisplay";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const handle = decodeURIComponent(resolvedParams.handle);

  const product = await getProduct(handle);

  if (!product) {
    return (
      <main className="bg-[var(--background)] min-h-screen flex flex-col items-center justify-center text-[var(--foreground)] p-10">
        <h1 className="text-2xl font-serif italic mb-4 text-[var(--gold)]">Peça não encontrada</h1>
        <p className="text-[var(--foreground-muted)] mb-8 text-center max-w-md">
          O sistema não encontrou a peça com o handle: <br />
          <span className="text-[var(--foreground)] font-mono text-xs italic">
            &ldquo;{handle}&rdquo;
          </span>
        </p>
        <Link
          href="/loja"
          className="border border-[var(--border)] px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-[var(--gold)] hover:text-black transition-all"
        >
          Voltar à Coleção
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[var(--background)] min-h-screen pt-40 pb-20 selection:bg-[var(--gold)] selection:text-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Componente Principal */}
        <ProductDisplay product={product} />

        {/* Secção de Texto Puro (O Manifesto) */}
        <div className="mt-32 max-w-2xl border-t border-[var(--background-secondary)] pt-12">
          <div
            className="prose prose-invert prose-p:text-[var(--foreground-secondary)] prose-p:leading-relaxed prose-p:font-light prose-strong:text-[var(--foreground)]"
            dangerouslySetInnerHTML={{
              __html: product.descriptionHtml || "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
