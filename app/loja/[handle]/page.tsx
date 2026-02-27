import type { Metadata } from "next";
import { getProduct } from "@/lib/shopify";
import ProductDisplay from "@/components/ProductDisplay";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import sanitize from "sanitize-html";
import { SITE_URL } from "@/lib/constants";

/** Sanitize Shopify product HTML — allow only safe formatting tags */
function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading"],
    },
    allowedSchemes: ["https", "http"],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(decodeURIComponent(handle));

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  const price = product.variants?.[0]?.price?.amount;
  const image = product.images?.[0]?.url;
  const description = `${product.title} — disponível na Loja Portal Lusitano.${price ? ` Desde ${parseFloat(price).toFixed(2)}€.` : ""}`;

  return {
    title: product.title,
    description,
    alternates: { canonical: `${SITE_URL}/loja/${handle}` },
    openGraph: {
      title: `${product.title} | Loja Portal Lusitano`,
      description,
      url: `${SITE_URL}/loja/${handle}`,
      siteName: "Portal Lusitano",
      locale: "pt_PT",
      type: "website",
      ...(image && { images: [{ url: image, width: 800, height: 800, alt: product.title }] }),
    },
  };
}

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

  // Preload da imagem principal — browser começa download antes de React renderizar o <Image>
  const heroImage = product.images[0]?.url;

  return (
    <>
      {heroImage && <link rel="preload" as="image" href={heroImage} fetchPriority="high" />}
      <main className="bg-[var(--background)] min-h-screen pt-40 pb-20 selection:bg-[var(--gold)] selection:text-black">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Loja", href: "/loja" },
              { label: product.title },
            ]}
          />

          {/* Componente Principal */}
          <ProductDisplay product={product} />

          {/* Secção de Texto Puro (O Manifesto) */}
          <div className="mt-32 max-w-2xl border-t border-[var(--background-secondary)] pt-12">
            <div
              className="prose prose-invert prose-p:text-[var(--foreground-secondary)] prose-p:leading-relaxed prose-p:font-light prose-strong:text-[var(--foreground)]"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(product.descriptionHtml || ""),
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
