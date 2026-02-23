"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ProductListing } from "@/types/product";

export default function LojaContent({ products }: { products: ProductListing[] }) {
  const { t } = useLanguage();
  const isSingle = products.length === 1;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* CABECALHO EDITORIAL DE LUXO */}
        <div className="flex flex-col items-center text-center mb-20 md:mb-32 relative opacity-0 animate-[fadeSlideIn_0.8s_ease-out_forwards]">
          {/* Linha vertical decorativa */}
          <div
            className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          />

          <span
            className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[var(--gold)] mb-6 ml-1 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.4s" }}
          >
            {t.shop.collection}
          </span>

          <h1
            className="text-5xl md:text-7xl font-serif italic text-[var(--foreground)] mb-8 tracking-wide opacity-90 selection:bg-[var(--gold)] selection:text-black opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.5s" }}
          >
            {t.shop.legacy}
          </h1>

          <p
            className="text-[9px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] max-w-lg leading-relaxed opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.7s" }}
          >
            {t.shop.legacy_subtitle}
          </p>
        </div>

        {/* PRODUTOS */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-32 space-y-6">
            <div className="w-16 h-[1px] bg-[var(--gold)] opacity-30" />
            <p className="text-[var(--foreground-secondary)] font-serif text-xl italic">
              {t.shop.not_found || "Nenhum produto disponível de momento."}
            </p>
            <p className="text-[var(--foreground-muted)] text-xs uppercase tracking-[0.3em]">
              {t.shop.back_collection || "Volte em breve"}
            </p>
          </div>
        ) : isSingle ? (
          /* LAYOUT PRODUTO ÚNICO — centrado e premium */
          <div
            className="flex flex-col items-center opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href={`/loja/${products[0].handle}`} className="group block w-full max-w-[520px]">
              {/* MOLDURA DA IMAGEM — maior para produto único */}
              <div className="aspect-[4/5] w-full bg-[var(--background-secondary)] border border-[var(--border)] overflow-hidden relative mb-10">
                <div className="absolute inset-0 z-10 shadow-[inset_0_0_60px_rgba(0,0,0,0.2)] pointer-events-none transition-opacity duration-700 group-hover:opacity-40" />

                {products[0].images[0]?.url ? (
                  <Image
                    src={products[0].images[0].url}
                    alt={products[0].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)] text-xs uppercase tracking-widest">
                    Sem Imagem
                  </div>
                )}
              </div>

              {/* INFO DO PRODUTO */}
              <div className="flex flex-col items-center text-center">
                <h3 className="text-2xl md:text-3xl font-serif italic mb-3 group-hover:text-[var(--foreground-secondary)] transition-colors">
                  {products[0].title}
                </h3>

                {products[0].description && (
                  <p className="text-sm text-[var(--foreground-muted)] max-w-md mb-4 leading-relaxed">
                    {products[0].description}
                  </p>
                )}

                <p className="text-[var(--gold)] font-serif text-xl mb-8">
                  {Number(products[0].priceRange?.minVariantPrice.amount || 0).toFixed(2)}{" "}
                  {t.shop.price_suffix}
                </p>

                <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)] border border-[var(--border)] px-8 py-3 group-hover:border-[var(--gold)] group-hover:text-[var(--gold)] transition-all duration-500">
                  {t.shop.discover}
                </span>
              </div>
            </Link>
          </div>
        ) : (
          /* GRELHA MULTI-PRODUTO */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-14 sm:gap-y-20 md:gap-y-32">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex flex-col items-center opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${Math.min(index * 0.1, 0.6) + 0.3}s` }}
              >
                <Link href={`/loja/${product.handle}`} className="group block w-full max-w-[380px]">
                  {/* MOLDURA DA IMAGEM */}
                  <div className="aspect-[4/5] w-full bg-[var(--background-secondary)] border border-[var(--border)] overflow-hidden relative mb-6">
                    <div className="absolute inset-0 z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none transition-opacity duration-700 group-hover:opacity-40" />

                    {product.images[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={index < 2}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)] text-xs uppercase tracking-widest">
                        Sem Imagem
                      </div>
                    )}
                  </div>

                  {/* INFO DO PRODUTO */}
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-serif italic mb-2 group-hover:text-[var(--foreground-secondary)] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-[var(--gold)] font-serif text-base mb-5">
                      {Number(product.priceRange?.minVariantPrice.amount || 0).toFixed(2)}{" "}
                      {t.shop.price_suffix}
                    </p>

                    <span className="text-[8px] uppercase tracking-[0.35em] text-[var(--foreground-muted)] border-b border-transparent pb-1 group-hover:border-[var(--gold)] group-hover:text-[var(--gold)] transition-all duration-500">
                      {t.shop.discover}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
