// @ts-nocheck
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal Lusitano | Private Access",
  // ENGENHARIA SEO: Remove o site do Google
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
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}