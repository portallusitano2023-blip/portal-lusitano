"use client";

import dynamic from "next/dynamic";

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

export default function ClientOverlays() {
  return (
    <>
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
    </>
  );
}
