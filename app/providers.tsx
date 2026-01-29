"use client";

import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ReactNode } from "react";

// Componentes globais
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import CookieConsent from "@/components/CookieConsent";
import NewsletterPopup from "@/components/NewsletterPopup";
import ScrollToTop from "@/components/ScrollToTop";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            {/* Preloader inicial */}
            <Preloader />

            {/* Cursor personalizado */}
            <CustomCursor />

            {/* Conteudo principal */}
            {children}

            {/* Componentes globais */}
            <ScrollToTop />
            <CookieConsent />
            <NewsletterPopup />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
