// @ts-nocheck
import type { Metadata } from "next";
import "./globals.css";

// ENGENHARIA SEO: Remove a descrição e bloqueia o Google
export const metadata: Metadata = {
  title: "Portal Lusitano",
  description: "Acesso Privado", 
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-black antialiased selection:bg-[#C5A059] selection:text-black">
        {children}
      </body>
    </html>
  );
}