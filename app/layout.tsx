// @ts-nocheck
import type { Metadata } from "next";
import "./globals.css";

// ENGENHARIA SEO: Bloqueia o site no Google imediatamente
export const metadata: Metadata = {
  title: "Portal Lusitano | Private Access",
  description: "Mercado de Elite do Cavalo Lusitano",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-black antialiased selection:bg-[#C5A059] selection:text-black">
        {children}
      </body>
    </html>
  );
}