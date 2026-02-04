"use client";

import { Heart } from "lucide-react";
import { useHorseFavorites, FavoriteHorse } from "@/context/HorseFavoritesContext";

interface HorseFavoriteButtonProps {
  horse: FavoriteHorse;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function HorseFavoriteButton({
  horse,
  size = "md",
  className = "",
}: HorseFavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useHorseFavorites();
  const isLiked = isFavorite(horse.id);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      removeFromFavorites(horse.id);
    } else {
      addToFavorites(horse);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-300
        ${
          isLiked
            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
            : "bg-black/50 text-white/70 hover:text-white hover:bg-black/70"
        }
        backdrop-blur-sm
        ${className}
      `}
      aria-label={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        size={iconSizes[size]}
        fill={isLiked ? "currentColor" : "none"}
        className="transition-transform duration-200 hover:scale-110"
      />
    </button>
  );
}
