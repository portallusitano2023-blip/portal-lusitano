import type { Metadata } from "next";
import "./globals.css";
// Importar as duas peças: Menu e Rodapé
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";  // <--- Muda de ".." para "."

export const metadata: Metadata = {
  title: "Portal Lusitano",
  description: "Cavalos Lusitanos de Elite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="bg-black text-white min-h-screen flex flex-col">
        
        {/* 1. O Menu fica fixo no topo */}
        <Navbar />
        
        {/* 2. O conteúdo do site carrega aqui */}
        {children}
        
        {/* 3. O Rodapé fica no fundo */}
        <Footer />
        
      </body>
    </html>
  );
}