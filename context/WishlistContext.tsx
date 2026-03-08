"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
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
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { showToast } = useToast();
  const { language } = useLanguage();

  // Hydrate from localStorage after mount — avoids SSR/client mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setWishlist(parsed); // eslint-disable-line react-hooks/set-state-in-effect
      }
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  // Guardar wishlist no localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = useCallback(
    (id: string) => wishlist.some((item) => item.id === id),
    [wishlist]
  );

  const addToWishlist = useCallback(
    (item: WishlistItem) => {
      setWishlist((prev) => {
        if (prev.some((i) => i.id === item.id)) return prev;
        showToast(
          "success",
          language === "pt"
            ? `${item.title} adicionado aos favoritos`
            : `${item.title} added to wishlist`
        );
        return [...prev, item];
      });
    },
    [showToast, language]
  );

  const removeFromWishlist = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item) {
          showToast(
            "info",
            language === "pt"
              ? `${item.title} removido dos favoritos`
              : `${item.title} removed from wishlist`
          );
        }
        return prev.filter((i) => i.id !== id);
      });
    },
    [showToast, language]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const value = useMemo(
    () => ({ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }),
    [wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
