import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import CartDrawer from "@/components/CartDrawer";
import { OrganizationSchema, WebsiteSchema } from "@/components/JsonLd";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portallusitano.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portal Lusitano | Cavalos Lusitanos de Elite",
    template: "%s | Portal Lusitano"
  },
  description: "Marketplace premium de cavalos Lusitanos. Loja equestre, leilões exclusivos, coudelarias certificadas e o maior arquivo editorial sobre o cavalo Português.",
  keywords: ["cavalo lusitano", "cavalos portugueses", "equitação", "dressage", "coudelaria", "PRE", "cavalo ibérico", "leilão cavalos", "equestre portugal"],
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
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "Portal Lusitano",
    title: "Portal Lusitano | Cavalos Lusitanos de Elite",
    description: "Marketplace premium de cavalos Lusitanos. Loja equestre, leilões exclusivos e arquivo editorial.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Portal Lusitano - Cavalos Lusitanos de Elite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal Lusitano | Cavalos Lusitanos de Elite",
    description: "Marketplace premium de cavalos Lusitanos. Loja equestre, leilões exclusivos e arquivo editorial.",
    images: ["/og-image.jpg"],
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
      "pt-PT": siteUrl,
      "en-US": `${siteUrl}/en`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${playfair.variable} ${montserrat.variable} dark`}>
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className="bg-[#050505] text-white antialiased selection:bg-[#C5A059] selection:text-black">
        <Providers>
          <Navbar />
          <CartDrawer />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}