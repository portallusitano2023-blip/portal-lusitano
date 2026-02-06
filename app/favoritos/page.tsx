"use client";

import { Heart, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function FavoritosPage() {
  const { language } = useLanguage();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { showToast } = useToast();

  const text = {
    pt: {
      title: "Os Seus Favoritos",
      subtitle: "Pecas que capturaram a sua atencao",
      empty: "A sua lista de favoritos esta vazia",
      emptySubtitle: "Explore a nossa colecao e guarde as pecas que mais gosta",
      explore: "Explorar Colecao",
      clearAll: "Limpar Tudo",
      remove: "Remover",
      view: "Ver Produto",
    },
    en: {
      title: "Your Favorites",
      subtitle: "Pieces that caught your attention",
      empty: "Your wishlist is empty",
      emptySubtitle: "Explore our collection and save the pieces you like",
      explore: "Explore Collection",
      clearAll: "Clear All",
      remove: "Remove",
      view: "View Product",
    },
  };

  const t = text[language];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
        >
          <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-[#C5A059]" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{t.title}</h1>
          <p className="text-zinc-400 font-serif italic">{t.subtitle}</p>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="mt-6 text-xs uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors"
            >
              {t.clearAll}
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div
            className="text-center py-20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            <Heart className="text-zinc-800 mx-auto mb-6" size={64} />
            <h2 className="text-2xl font-serif text-white mb-3">{t.empty}</h2>
            <p className="text-zinc-500 mb-8">{t.emptySubtitle}</p>
            <Link
              href="/loja"
              className="inline-block bg-[#C5A059] text-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors"
            >
              {t.explore}
            </Link>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          >
            {wishlist.map((item, index) => (
              <div
                key={item.id}
                className="group border border-white/5 bg-white/[0.02] overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Imagem */}
                <Link href={`/loja/${item.handle}`} className="block">
                  <div className="aspect-[4/5] bg-zinc-900 overflow-hidden relative">
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
                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-[#C5A059] transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-[#C5A059] font-serif mb-4">
                    {Number(item.price).toFixed(2)} EUR
                  </p>

                  {/* Acoes */}
                  <div className="flex gap-3">
                    <Link
                      href={`/loja/${item.handle}`}
                      className="flex-1 bg-[#C5A059] text-black py-3 text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors text-center"
                    >
                      {t.view}
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-12 border border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-500 transition-colors flex items-center justify-center"
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
