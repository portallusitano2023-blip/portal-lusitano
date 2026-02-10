"use client";

import { Heart, Trash2, MapPin, Calendar, ExternalLink, Share2, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useHorseFavorites } from "@/context/HorseFavoritesContext";
import Navbar from "@/components/Navbar";

export default function CavalosFavoritosPage() {
  const { language } = useLanguage();
  const { favorites, removeFromFavorites, clearFavorites, favoritesCount } = useHorseFavorites();
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc">("recent");

  const text = {
    pt: {
      title: "Cavalos Favoritos",
      subtitle: "Os exemplares que guardaste",
      empty: "Ainda não guardaste nenhum cavalo",
      emptySubtitle: "Explora o marketplace e guarda os cavalos que te interessam",
      explore: "Ver Cavalos à Venda",
      clearAll: "Limpar Tudo",
      remove: "Remover",
      view: "Ver Detalhes",
      share: "Partilhar",
      years: "anos",
      sortRecent: "Mais Recentes",
      sortPriceAsc: "Preço: Menor",
      sortPriceDesc: "Preço: Maior",
      total: "cavalos guardados",
    },
    en: {
      title: "Favorite Horses",
      subtitle: "The horses you've saved",
      empty: "You haven't saved any horses yet",
      emptySubtitle: "Explore the marketplace and save the horses that interest you",
      explore: "View Horses for Sale",
      clearAll: "Clear All",
      remove: "Remove",
      view: "View Details",
      share: "Share",
      years: "years",
      sortRecent: "Most Recent",
      sortPriceAsc: "Price: Low",
      sortPriceDesc: "Price: High",
      total: "horses saved",
    },
    es: {
      title: "Caballos Favoritos",
      subtitle: "Los ejemplares que ha guardado",
      empty: "Aun no ha guardado ningun caballo",
      emptySubtitle: "Explore el marketplace y guarde los caballos que le interesen",
      explore: "Ver Caballos en Venta",
      clearAll: "Limpiar Todo",
      remove: "Eliminar",
      view: "Ver Detalles",
      share: "Compartir",
      years: "anos",
      sortRecent: "Mas Recientes",
      sortPriceAsc: "Precio: Menor",
      sortPriceDesc: "Precio: Mayor",
      total: "caballos guardados",
    },
  };

  const t = text[language];

  // Sort favorites
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.price || 0) - (b.price || 0);
      case "price-desc":
        return (b.price || 0) - (a.price || 0);
      default:
        return 0; // Keep original order (most recent)
    }
  });

  const handleShare = async (horse: (typeof favorites)[0]) => {
    const url = `${window.location.origin}/comprar/${horse.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: horse.name,
          text: `Vê este cavalo: ${horse.name}`,
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-24 sm:pt-32 pb-24 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Heart className="text-[#C5A059]" size={28} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-2 sm:mb-4">
              {t.title}
            </h1>
            <p className="text-zinc-400 font-serif italic text-sm sm:text-base">{t.subtitle}</p>

            {favoritesCount > 0 && (
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                <span className="text-zinc-500 text-sm">
                  {favoritesCount} {t.total}
                </span>
                <button
                  onClick={clearFavorites}
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors active:scale-95"
                >
                  {t.clearAll}
                </button>
              </div>
            )}
          </div>

          {favorites.length === 0 ? (
            <div
              className="text-center py-16 sm:py-20 px-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: "0.2s" }}
            >
              <Heart className="text-zinc-800 mx-auto mb-6" size={56} />
              <h2 className="text-xl sm:text-2xl font-serif text-white mb-3">{t.empty}</h2>
              <p className="text-zinc-500 mb-8 text-sm sm:text-base max-w-md mx-auto">
                {t.emptySubtitle}
              </p>
              <Link
                href="/comprar"
                className="inline-block bg-[#C5A059] text-black px-6 sm:px-8 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors active:scale-95"
              >
                {t.explore}
              </Link>
            </div>
          ) : (
            <>
              {/* Sort Controls - Mobile Optimized */}
              <div
                className="flex items-center justify-between mb-6 sm:mb-8 px-1 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-zinc-500" />
                  <span className="text-zinc-500 text-xs uppercase tracking-wider hidden sm:inline">
                    Ordenar:
                  </span>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  {[
                    { key: "recent", label: t.sortRecent },
                    { key: "price-asc", label: t.sortPriceAsc },
                    { key: "price-desc", label: t.sortPriceDesc },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSortBy(option.key as typeof sortBy)}
                      className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs uppercase tracking-wider transition-all active:scale-95 ${
                        sortBy === option.key
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid - Mobile First */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {sortedFavorites.map((horse, index) => (
                  <div
                    key={horse.id}
                    className="group bg-zinc-900/50 border border-white/5 overflow-hidden touch-manipulation opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    {/* Image */}
                    <Link href={`/comprar/${horse.id}`} className="block">
                      <div className="aspect-[4/3] sm:aspect-[4/5] bg-zinc-950 overflow-hidden relative">
                        {horse.image ? (
                          <Image
                            src={horse.image}
                            alt={horse.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700">
                            <Heart size={40} />
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Quick info overlay - Mobile */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                          {horse.price && (
                            <p className="text-[#C5A059] font-serif text-lg sm:text-xl font-medium">
                              {Number(horse.price).toLocaleString("pt-PT")} €
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-4 sm:p-5">
                      <Link href={`/comprar/${horse.id}`}>
                        <h3 className="text-lg sm:text-xl font-serif text-white mb-2 group-hover:text-[#C5A059] transition-colors line-clamp-1">
                          {horse.name}
                        </h3>
                      </Link>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mb-4">
                        {horse.age && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {horse.age} {t.years}
                          </span>
                        )}
                        {horse.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {horse.location}
                          </span>
                        )}
                        {horse.breed && <span className="text-zinc-600">{horse.breed}</span>}
                      </div>

                      {/* Actions - Touch Optimized */}
                      <div className="flex gap-2">
                        <Link
                          href={`/comprar/${horse.id}`}
                          className="flex-1 bg-[#C5A059] text-black py-3 text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors text-center active:scale-[0.98] touch-manipulation"
                        >
                          {t.view}
                        </Link>
                        <button
                          onClick={() => handleShare(horse)}
                          className="w-12 border border-white/10 text-zinc-400 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-colors flex items-center justify-center active:scale-95 touch-manipulation"
                          aria-label={t.share}
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => removeFromFavorites(horse.id)}
                          className="w-12 border border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors flex items-center justify-center active:scale-95 touch-manipulation"
                          aria-label={t.remove}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA - Mobile */}
              <div
                className="mt-8 sm:mt-12 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.5s" }}
              >
                <Link
                  href="/comprar"
                  className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#C5A059] transition-colors text-sm"
                >
                  <span>Continuar a explorar</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
