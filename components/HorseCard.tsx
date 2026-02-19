"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import HorseFavoriteButton from "./HorseFavoriteButton";
import { getBlurDataURL } from "@/lib/image-utils";

interface HorseCardProps {
  horse: {
    id: string;
    nome_cavalo: string;
    preco: number;
    image_url?: string;
    slug?: string;
    localizacao?: string;
    idade?: number;
    raca?: string;
    destaque?: boolean;
    nivel?: string;
    disciplinas?: string[] | string | null;
  };
  href: string;
  compact?: boolean;
  /** Set true for the first 2–4 cards visible above the fold to improve LCP */
  priority?: boolean;
}

function getPrimaryDiscipline(disciplinas: string[] | string | null | undefined): string | null {
  if (!disciplinas) return null;
  if (Array.isArray(disciplinas)) return disciplinas[0] || null;
  if (typeof disciplinas === "string") {
    const first = disciplinas.split(",")[0]?.trim();
    return first || null;
  }
  return null;
}

export default function HorseCard({
  horse,
  href,
  compact = false,
  priority = false,
}: HorseCardProps) {
  const favoriteHorse = {
    id: horse.id,
    slug: horse.slug || horse.id,
    name: horse.nome_cavalo,
    price: horse.preco,
    image: horse.image_url,
    location: horse.localizacao,
    age: horse.idade,
    breed: horse.raca,
  };

  const primaryDiscipline = getPrimaryDiscipline(horse.disciplinas);
  const badgeLabel = horse.nivel || primaryDiscipline;

  return (
    <article
      className="group cursor-pointer relative touch-manipulation"
      aria-label={horse.nome_cavalo}
    >
      <Link
        href={href}
        className="block active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        {/* Image Container */}
        <div
          className={`${
            compact ? "aspect-square" : "aspect-[4/5] sm:aspect-[4/5]"
          } bg-[var(--background-secondary)] border border-[var(--border)] overflow-hidden relative transition-colors duration-300 group-hover:border-[var(--gold)]/50`}
        >
          {horse.image_url ? (
            <Image
              src={horse.image_url}
              alt={[
                horse.nome_cavalo,
                horse.raca || "Cavalo Lusitano",
                horse.idade ? `${horse.idade} anos` : null,
                horse.localizacao ? `em ${horse.localizacao}` : null,
              ]
                .filter(Boolean)
                .join(" — ")}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={85}
              priority={priority}
              placeholder={priority ? undefined : "blur"}
              blurDataURL={priority ? undefined : getBlurDataURL("horse")}
              className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)] text-[10px] tracking-widest uppercase"
              role="img"
              aria-label={`${horse.nome_cavalo} — sem fotografia`}
            >
              Sem Foto
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Destaque badge — top left */}
          {horse.destaque && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
              <span className="bg-[var(--gold)] text-black text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 leading-none">
                Destaque
              </span>
            </div>
          )}

          {/* Discipline/level badge — above price, bottom right */}
          {badgeLabel && (
            <div className="absolute bottom-9 sm:bottom-11 right-2 sm:right-3 z-10">
              <span className="bg-black/60 backdrop-blur-sm border border-[var(--border)] text-[var(--foreground-secondary)] text-[8px] sm:text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 leading-none">
                {badgeLabel}
              </span>
            </div>
          )}

          {/* Price badge - visible on image */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <p className="text-[var(--gold)] font-serif text-lg sm:text-xl font-medium drop-shadow-lg">
              {Number(horse.preco).toLocaleString("pt-PT")} €
            </p>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-3 sm:mt-4 px-1">
          <h2 className="font-serif text-base sm:text-lg md:text-xl text-[var(--foreground)] mb-1 line-clamp-1 group-hover:text-[var(--gold)] transition-colors duration-300">
            {horse.nome_cavalo}
          </h2>

          {/* Meta info row */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[var(--foreground-muted)]">
            {horse.idade && (
              <span className="flex items-center gap-1">
                <Calendar size={12} className="hidden sm:inline flex-shrink-0" aria-hidden="true" />
                {horse.idade} anos
              </span>
            )}
            {horse.localizacao && (
              <span className="flex items-center gap-1 truncate">
                <MapPin size={12} className="hidden sm:inline flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{horse.localizacao}</span>
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button — larger touch target on mobile */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
        <HorseFavoriteButton horse={favoriteHorse} size="md" className="shadow-lg" />
      </div>
    </article>
  );
}
