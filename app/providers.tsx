"use client";

import dynamic from "next/dynamic";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { HorseFavoritesProvider } from "@/context/HorseFavoritesContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ReactNode } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import Preloader from "@/components/Preloader";

// Lazy load - carregam apenas quando necessários (reduz bundle inicial)
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });
const NewsletterPopup = dynamic(() => import("@/components/NewsletterPopup"), { ssr: false });

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <HorseFavoritesProvider>
                  <Preloader />
                  {children}
                  <ScrollToTop />
                  <CookieConsent />
                  <NewsletterPopup />
                </HorseFavoritesProvider>
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
