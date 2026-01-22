// @ts-nocheck
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/context/CartContext";

// Configuração das fontes para o look de luxo
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: 'swap',
});

export const metadata = {
  title: "Portal Lusitano | A Nobreza da Raça",
  description: "A plataforma definitiva para a cultura, comércio e linhagem do cavalo Lusitano.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="bg-[#050505] text-white antialiased min-h-screen flex flex-col">
        {/* O CartProvider envolve tudo para que o carrinho funcione em qualquer parte do site */}
        <CartProvider>
          <Navbar />
          
          {/* Painel lateral do carrinho (invisível até ser aberto) */}
          <CartDrawer />
          
          {/* Onde o conteúdo das páginas (Home, Loja, Sobre, etc.) é injetado */}
          <div className="flex-grow">
            {children}
          </div>
          
          {/* Rodapé de elite com ícones sociais e links jurídicos */}
          <Footer />
          
          {/* Botão flutuante para voltar ao topo */}
          <ScrollToTop />
        </CartProvider>
      </body>
    </html>
  );
}