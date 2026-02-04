"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import HorseFavoriteButton from "./HorseFavoriteButton";

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
  };
  href: string;
  compact?: boolean;
}

export default function HorseCard({ horse, href, compact = false }: HorseCardProps) {
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

  return (
    <div className="group cursor-pointer relative touch-manipulation">
      <Link href={href} className="block active:scale-[0.98] transition-transform">
        {/* Image Container - More square on mobile for better grid layout */}
        <div className={`${compact ? "aspect-square" : "aspect-[4/5] sm:aspect-[4/5]"} bg-zinc-950 border border-zinc-900 overflow-hidden relative`}>
          {horse.image_url ? (
            <Image
              src={horse.image_url}
              alt={horse.nome_cavalo}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 text-[10px] tracking-widest uppercase">
              Sem Foto
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Price badge - visible on image for mobile */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <p className="text-[#C5A059] font-serif text-lg sm:text-xl font-medium drop-shadow-lg">
              {Number(horse.preco).toLocaleString("pt-PT")} €
            </p>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-3 sm:mt-4 px-1">
          <h2 className="font-serif text-base sm:text-lg md:text-xl text-white mb-1 line-clamp-1 group-hover:text-[#C5A059] transition-colors">
            {horse.nome_cavalo}
          </h2>

          {/* Meta info row */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-500">
            {horse.idade && (
              <span className="flex items-center gap-1">
                <Calendar size={12} className="hidden sm:inline" />
                {horse.idade} anos
              </span>
            )}
            {horse.localizacao && (
              <span className="flex items-center gap-1 truncate">
                <MapPin size={12} className="hidden sm:inline flex-shrink-0" />
                <span className="truncate">{horse.localizacao}</span>
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button - larger touch target on mobile */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
        <HorseFavoriteButton
          horse={favoriteHorse}
          size="md"
          className="shadow-lg"
        />
      </div>
    </div>
  );
}
