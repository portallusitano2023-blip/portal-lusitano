import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

// --- IMPORTS DOS CONTEXTOS (O que faltava) ---
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext"; 

// --- IMPORTS DOS COMPONENTES GLOBAIS ---
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

// Configuração das Fontes
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({ 
  weight: ["300", "400", "700"],
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal Lusitano | O Nobre Legado",
  description: "A primeira plataforma digital de elite dedicada ao Cavalo Lusitano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${playfair.variable} ${lato.variable}`}>
      <body className="bg-[#050505] text-white antialiased">
        
        {/* 1. O Cérebro do Idioma */}
        <LanguageProvider>
          
          {/* 2. O Cérebro do Carrinho */}
          <CartProvider>
            
            <Navbar />
            <CartDrawer />
            
            {/* O conteúdo das tuas páginas entra aqui */}
            {children}
            
            <Footer />

          </CartProvider>
        </LanguageProvider>
        
      </body>
    </html>
  );
}