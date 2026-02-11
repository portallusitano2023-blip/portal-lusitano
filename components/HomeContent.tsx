"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  images: { url: string; altText?: string }[];
  variants: { id: string; price: { amount: string } }[];
  priceRange?: { minVariantPrice: { amount: string; currencyCode?: string } };
}

export default function HomeContent({ products }: { products: ShopifyProduct[] }) {
  const { t } = useLanguage();

  return (
    <main className="bg-[var(--background)] min-h-screen text-[var(--foreground)] selection:bg-[var(--gold)] selection:text-black">
      {/* HERO SECTION - VOLTA AO ESTILO NOBREZA */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/30 via-[var(--background)] to-[var(--background)] z-0"></div>

        <div className="relative z-10 text-center flex flex-col items-center animate-fade-in-up max-w-4xl">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)] mb-8 font-medium">
            {t.home.est}
          </span>

          {/* TÍTULO CLÁSSICO DE MARCA */}
          <h1 className="text-5xl md:text-8xl font-serif text-[var(--foreground)] mb-8 tracking-wide leading-tight">
            {/* O "The" pequeno e itálico */}
            <span className="block italic font-light text-[var(--foreground-muted)] text-3xl md:text-4xl mb-2">
              {t.home.title_prefix}
            </span>
            {/* O Título Principal */}
            {t.home.title_main}
          </h1>

          <p className="max-w-md text-[var(--foreground-secondary)] font-serif italic text-sm md:text-base leading-relaxed mb-12">
            &ldquo;{t.home.hero_text}&rdquo;
          </p>

          <Link
            href="/loja"
            className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] border border-[var(--border-hover)] px-10 py-4 hover:bg-[var(--gold)] hover:border-[var(--gold)] hover:text-black transition-all duration-500"
          >
            {t.home.cta}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* DESTAQUES (Mantém-se igual) */}
      <section className="py-32 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6 pb-8">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--gold)] mb-3 block">
              {t.home.curation}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-[var(--foreground)]">
              {t.home.featured}
            </h2>
          </div>
          <Link
            href="/loja"
            className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors pb-1"
          >
            {t.home.view_all} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {products.map((product) => (
            <Link key={product.id} href={`/loja/${product.handle}`} className="group block">
              <div className="aspect-[4/5] w-full bg-[var(--background-secondary)] border border-[var(--border)] overflow-hidden relative mb-8">
                <div className="absolute inset-0 z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none transition-opacity duration-700 group-hover:opacity-30"></div>
                {product.images[0]?.url && (
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-serif italic text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors">
                  {product.title}
                </h3>
                <p className="text-[var(--foreground-secondary)] font-serif text-sm tracking-widest">
                  {Number(
                    product.priceRange?.minVariantPrice?.amount ||
                      product.variants[0]?.price?.amount ||
                      0
                  ).toFixed(2)}{" "}
                  EUR
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MANIFESTO (Rodapé) */}
      <section className="py-40 bg-[var(--background-secondary)] text-center px-6 mt-20 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto">
          <span className="text-3xl text-[var(--gold)] font-serif mb-8 block opacity-80">❦</span>
          <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-[var(--foreground-secondary)]">
            &ldquo;{t.home.manifesto}&rdquo;
          </p>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] mt-10 block">
            Portal Lusitano • Heritage
          </span>
        </div>
      </section>
    </main>
  );
}
