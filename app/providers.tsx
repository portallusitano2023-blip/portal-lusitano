"use client";

import dynamic from "next/dynamic";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { HorseFavoritesProvider } from "@/context/HorseFavoritesContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { type ReactNode, type FC } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load - carregam apenas quando necessários (reduz bundle inicial)
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });
const NewsletterPopup = dynamic(() => import("@/components/NewsletterPopup"), { ssr: false });
const PushNotificationPrompt = dynamic(() => import("@/components/PushNotificationPrompt"), {
  ssr: false,
});
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
const AnalyticsScripts = dynamic(() => import("@/components/AnalyticsScripts"), { ssr: false });
const Analytics = dynamic(() => import("@/components/Analytics"), { ssr: false });
const ServiceWorkerRegistration = dynamic(() => import("@/components/ServiceWorkerRegistration"), {
  ssr: false,
});
const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"), { ssr: false });
const AdSenseScript = dynamic(
  () => import("@/components/AdSenseScript").then((m) => ({ default: m.AdSenseScript })),
  { ssr: false }
);
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
        <ScrollToTop />
        <CookieConsent />
        <NewsletterPopup />
        <PushNotificationPrompt />
        <WhatsAppButton />
        <CartDrawer />
        <ServiceWorkerRegistration />
        <Analytics />
        <MobileBottomNav />
        <AnalyticsScripts />
        <AdSenseScript />
      </ComposedProviders>
    </LanguageProvider>
  );
}
