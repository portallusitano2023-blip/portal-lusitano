"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { useLanguage } from "./LanguageContext";

export interface FavoriteHorse {
  id: string;
  slug: string;
  name: string;
  breed?: string;
  age?: number;
  price?: number;
  image?: string;
  location?: string;
}

interface HorseFavoritesContextType {
  favorites: FavoriteHorse[];
  addToFavorites: (horse: FavoriteHorse) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
}

const HorseFavoritesContext = createContext<HorseFavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "horse_favorites";

export function HorseFavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteHorse[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Error loading horse favorites:", error);
    }
    return [];
  });
  const [isHydrated, setIsHydrated] = useState(typeof window !== "undefined");
  const { showToast } = useToast();
  const { language } = useLanguage();

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving horse favorites:", error);
      }
    }
  }, [favorites, isHydrated]);

  const addToFavorites = (horse: FavoriteHorse) => {
    if (!isFavorite(horse.id)) {
      setFavorites((prev) => [...prev, horse]);
      showToast(
        "success",
        language === "pt"
          ? `${horse.name} adicionado aos favoritos`
          : `${horse.name} added to favorites`
      );
    }
  };

  const removeFromFavorites = (id: string) => {
    const horse = favorites.find((h) => h.id === id);
    setFavorites((prev) => prev.filter((h) => h.id !== id));
    if (horse) {
      showToast(
        "info",
        language === "pt"
          ? `${horse.name} removido dos favoritos`
          : `${horse.name} removed from favorites`
      );
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some((horse) => horse.id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
    showToast("info", language === "pt" ? "Favoritos limpos" : "Favorites cleared");
  };

  return (
    <HorseFavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </HorseFavoritesContext.Provider>
  );
}

export function useHorseFavorites() {
  const context = useContext(HorseFavoritesContext);
  if (!context) {
    throw new Error("useHorseFavorites must be used within a HorseFavoritesProvider");
  }
  return context;
}
