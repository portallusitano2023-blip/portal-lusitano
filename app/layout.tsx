import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Importamos fontes bonitas
import "./globals.css";
import Link from "next/link";

// Configuração das Fontes
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Portal Lusitano",
  description: "O mercado premium do Cavalo Lusitano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-zinc-950 text-white`}>
        
        {/* --- INÍCIO DO MENU GLOBAL (NAVBAR) --- */}
        <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md fixed top-0 w-full z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            
            {/* Logótipo (Agora com imagem) */}
<Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
  {/* A imagem do logótipo */}
  <img 
    src="/logo.png" 
    alt="Portal Lusitano" 
    className="h-12 w-auto object-contain rounded-sm" 
  />
  
  {/* O Texto ao lado (Opcional - se quiseres só o símbolo, apaga as linhas abaixo) */}
  <span className="text-xl font-serif text-yellow-600 tracking-widest hidden md:block">
    PORTAL LUSITANO
  </span>
</Link>

            {/* Links do Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-zinc-400">
              <Link href="/" className="hover:text-yellow-600 transition-colors">Leilão</Link>
              <Link href="#" className="hover:text-yellow-600 transition-colors">Vender</Link>
              <Link href="#" className="hover:text-yellow-600 transition-colors">Sobre Nós</Link>
              <button className="px-6 py-2 border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black transition-all">
                Login
              </button>
            </div>
          </div>
        </nav>
        {/* --- FIM DO MENU GLOBAL --- */}

        {/* O 'children' é a página que estás a ver (Home ou Detalhe) */}
        <div className="pt-20"> 
          {children}
        </div>
        
      </body>
    </html>
  );
}