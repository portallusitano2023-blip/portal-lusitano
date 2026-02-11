"use client";

import dynamic from "next/dynamic";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { HorseFavoritesProvider } from "@/context/HorseFavoritesContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { type ReactNode, type FC } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import Preloader from "@/components/Preloader";

// Lazy load - carregam apenas quando necessários (reduz bundle inicial)
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });
const NewsletterPopup = dynamic(() => import("@/components/NewsletterPopup"), { ssr: false });
const PushNotificationPrompt = dynamic(() => import("@/components/PushNotificationPrompt"), {
  ssr: false,
});

// Compose multiple providers to avoid deeply nested JSX
// Each provider only re-renders its own consumers, not siblings
function composeProviders(...providers: FC<{ children: ReactNode }>[]) {
  return function ComposedProviders({ children }: { children: ReactNode }) {
    return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);
  };
}

// Providers ordered by dependency:
// ErrorBoundary > Auth > Language > Toast > Cart > Wishlist > HorseFavorites
const ComposedProviders = composeProviders(
  ErrorBoundary as unknown as FC<{ children: ReactNode }>,
  AuthProvider,
  LanguageProvider,
  ToastProvider,
  CartProvider,
  WishlistProvider,
  HorseFavoritesProvider
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ComposedProviders>
      <Preloader />
      {children}
      <ScrollToTop />
      <CookieConsent />
      <NewsletterPopup />
      <PushNotificationPrompt />
    </ComposedProviders>
  );
}
