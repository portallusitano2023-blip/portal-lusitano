"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { useLanguage } from "./LanguageContext";

interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("wishlist");
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return [];
  });
  const { showToast } = useToast();
  const { language } = useLanguage();

  // Guardar wishlist no localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item: WishlistItem) => {
    if (!isInWishlist(item.id)) {
      setWishlist((prev) => [...prev, item]);
      showToast(
        "success",
        language === "pt"
          ? `${item.title} adicionado aos favoritos`
          : `${item.title} added to wishlist`
      );
    }
  };

  const removeFromWishlist = (id: string) => {
    const item = wishlist.find((i) => i.id === id);
    setWishlist((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      showToast(
        "info",
        language === "pt"
          ? `${item.title} removido dos favoritos`
          : `${item.title} removed from wishlist`
      );
    }
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
