/**
 * Página de Favoritos — Loja / Shopify
 *
 * Lista os produtos da loja (/loja) que o utilizador guardou na wishlist.
 * Usa WishlistContext (produtos Shopify da loja).
 *
 * NÃO confundir com /cavalos-favoritos que é para cavalos do marketplace.
 */
"use client";

import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";

export default function FavoritosPage() {
  const { t } = useLanguage();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const txt = t.shop_favoritos;

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-[var(--gold)]" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
            {txt.title}
          </h1>
          <p className="text-[var(--foreground-secondary)] font-serif italic">{txt.subtitle}</p>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="mt-6 text-xs uppercase tracking-widest text-[var(--foreground-muted)] hover:text-red-500 transition-colors"
            >
              {txt.clear_all}
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div
            className="text-center py-20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            <Heart className="text-[var(--foreground-muted)] mx-auto mb-6" size={64} />
            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-3">{txt.empty}</h2>
            <p className="text-[var(--foreground-muted)] mb-8">{txt.empty_subtitle}</p>
            <Link
              href="/loja"
              className="inline-block bg-[var(--gold)] text-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[var(--gold-hover)] transition-colors"
            >
              {txt.explore}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            {wishlist.map((item, index) => (
              <div
                key={item.id}
                className="group border border-[var(--border)] bg-[var(--surface-hover)] overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Imagem */}
                <Link href={`/loja/${item.handle}`} className="block">
                  <div className="aspect-[4/5] bg-[var(--background-secondary)] overflow-hidden relative">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-6">
                  <Link href={`/loja/${item.handle}`}>
                    <h3 className="text-lg font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-[var(--gold)] font-serif mb-4">
                    {Number(item.price).toFixed(2)} EUR
                  </p>

                  {/* Acoes */}
                  <div className="flex gap-3">
                    <Link
                      href={`/loja/${item.handle}`}
                      className="flex-1 bg-[var(--gold)] text-black py-3 text-xs uppercase tracking-widest font-bold hover:bg-[var(--gold-hover)] transition-colors text-center"
                    >
                      {txt.view}
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-12 border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-red-500 hover:border-red-500 transition-colors flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
