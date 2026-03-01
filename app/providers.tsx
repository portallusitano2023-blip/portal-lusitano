"use client";

import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { HorseFavoritesProvider } from "@/context/HorseFavoritesContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { type ReactNode, type FC } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import ClientOverlays from "@/components/ClientOverlays";

// Compose multiple providers to avoid deeply nested JSX
// Each provider only re-renders its own consumers, not siblings
function composeProviders(...providers: FC<{ children: ReactNode }>[]) {
  return function ComposedProviders({ children }: { children: ReactNode }) {
    return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);
  };
}

// Providers ordered by dependency:
// ErrorBoundary > Theme > Auth > Toast > Cart > Wishlist > HorseFavorites
// LanguageProvider extracted from compose because it needs initialLanguage prop
const ComposedProviders = composeProviders(
  ErrorBoundary as unknown as FC<{ children: ReactNode }>,
  ThemeProvider,
  AuthProvider,
  ToastProvider,
  CartProvider,
  WishlistProvider,
  HorseFavoritesProvider
);

export function Providers({
  children,
  initialLanguage = "pt",
}: {
  children: ReactNode;
  initialLanguage?: "pt" | "en" | "es";
}) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <ComposedProviders>
        {children}
        <ClientOverlays />
      </ComposedProviders>
    </LanguageProvider>
  );
}
