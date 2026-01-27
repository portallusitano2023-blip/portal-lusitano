import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

// --- A PEÇA QUE FALTAVA ---
import CartDrawer from "@/components/CartDrawer"; 
// --------------------------

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

export const metadata: Metadata = {
  title: "Portal Lusitano | Heritage & Equestrian Legacy",
  description: "A união perfeita entre a tradição equestre secular e o design contemporâneo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${playfair.variable} ${montserrat.variable} dark`}>
      <body className="bg-[#050505] text-white antialiased selection:bg-[#C5A059] selection:text-black">
        <Providers>
          <Navbar />
          
          {/* --- AQUI É ONDE A GAVETA TEM DE ESTAR --- */}
          {/* Sem isto, o botão do saco grita para o vazio. */}
          <CartDrawer /> 
          {/* ----------------------------------------- */}

          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}