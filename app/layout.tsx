import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { OrganizationSchema, WebsiteSchema } from "@/components/JsonLd";
import SkipLinks from "@/components/SkipLinks";
import ErrorBoundary from "@/components/ErrorBoundary";

// Apenas pesos necessários - reduz tamanho do bundle de fontes
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "optional",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export const viewport: Viewport = {
  themeColor: "#C5A059",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Portal Lusitano",
  },
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portal Lusitano | Cavalos Lusitanos de Elite",
    template: "%s | Portal Lusitano",
  },
  description:
    "O maior marketplace de cavalos Lusitanos em Portugal. Compre cavalos PSL certificados, explore coudelarias, linhagens, eventos equestres e glossário gratuito.",
  keywords: [
    "cavalo lusitano",
    "comprar cavalo lusitano",
    "cavalos lusitanos à venda portugal",
    "cavalo lusitano preço",
    "coudelaria lusitano",
    "cavalo ibérico",
    "lusitano dressage",
    "lusitano working equitation",
    "garanhão lusitano",
    "linhagem lusitano veiga",
    "cavalos portugueses",
    "equestre portugal",
  ],
  authors: [{ name: "Portal Lusitano" }],
  creator: "Portal Lusitano",
  publisher: "Portal Lusitano",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    alternateLocale: ["en_GB", "es_ES"],
    url: siteUrl,
    siteName: "Portal Lusitano",
    title: "Portal Lusitano | Cavalos Lusitanos de Elite",
    description:
      "Marketplace premium de cavalos Lusitanos. Loja equestre, coudelarias certificadas e arquivo editorial.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Portal Lusitano - Cavalos Lusitanos de Elite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal Lusitano | Cavalos Lusitanos de Elite",
    description:
      "Marketplace premium de cavalos Lusitanos. Loja equestre, coudelarias certificadas e arquivo editorial.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google19f6731f9a1a4711",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      // Site usa troca de idioma client-side — todas as línguas servem a mesma URL
      "pt-PT": siteUrl,
      en: siteUrl,
      es: siteUrl,
      "x-default": siteUrl,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "pt";
  const lang = ["pt", "en", "es"].includes(locale) ? locale : "pt";

  return (
    <html lang={lang} className={`${playfair.variable} ${montserrat.variable} dark`}>
      <head>
        {/* Inline script to set theme before React hydration (prevents FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portal-lusitano-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light')}}catch(e){}})()`,
          }}
        />
        {/* Preconnect para recursos críticos — reduz latência de first requests */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        {/* dns-prefetch para recursos secundários */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://ofrzpaxa.api.sanity.io" />
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Providers initialLanguage={lang as "pt" | "en" | "es"}>
          <ErrorBoundary>
            <SkipLinks />
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </ErrorBoundary>
        </Providers>
        {/* Google AdSense - afterInteractive carrega após hidratação */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7254357453133228"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
