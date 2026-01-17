// @ts-nocheck
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Vamos criar este componente abaixo

export const metadata: Metadata = {
  title: "Portal Lusitano | Private Access",
  robots: { index: false, follow: false }, // Bloqueio total de Google
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-black text-white antialiased">
        {/* A Navbar só deve aparecer no site real, trataremos isso nas páginas */}
        {children}
      </body>
    </html>
  );
}