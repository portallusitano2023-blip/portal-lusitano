import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Portal Lusitano",
  description: "O Mercado Premium do Cavalo Lusitano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-zinc-950 text-zinc-200 antialiased`}>

        {/* --- MENU SUPERIOR (NAVBAR) - PRETO --- */}
        <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md fixed top-0 w-full z-50 transition-all">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

            {/* Lado Esquerdo: Logo e Nome */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/logo.png"
                alt="Portal Lusitano"
                className="h-10 w-auto object-contain"
              />
              <span className="text-lg font-serif text-white tracking-widest hidden md:block">
                PORTAL LUSITANO
              </span>
            </Link>

            {/* Lado Direito: Links */}
            <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
              <Link href="#" className="text-zinc-300 hover:text-white transition-colors">Comprar</Link>
              <Link href="#" className="text-zinc-300 hover:text-white transition-colors">Leilões</Link>
              <Link href="#" className="text-zinc-300 hover:text-white transition-colors">Vender</Link>
              <button className="px-6 py-2 border border-white/30 hover:bg-white hover:text-black text-white transition-all">
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* --- CONTEÚDO PRINCIPAL --- */}
        <div className="pt-20 min-h-screen flex flex-col">
          {children}
        </div>

        {/* --- RODAPÉ (FOOTER) - CORRIGIDO (SEM LIQUEN) --- */}
        <footer className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10 mt-auto">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

            {/* Coluna 1: Marca */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" className="h-8 w-auto opacity-80" alt="Logo" />
                <span className="text-lg font-serif text-white tracking-widest">PORTAL LUSITANO</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                A plataforma de excelência dedicada exclusivamente ao Cavalo Puro Sangue Lusitano.
              </p>
            </div>

            {/* Coluna 2: Explorar */}
            <div>
              <h4 className="text-white font-serif mb-6">Explorar</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-yellow-600 transition-colors">Cavalos à Venda</Link></li>
                <li><Link href="#" className="hover:text-yellow-600 transition-colors">Leilões Online</Link></li>
                <li><Link href="#" className="hover:text-yellow-600 transition-colors">Vender Cavalo</Link></li>
              </ul>
            </div>

            {/* Coluna 3: Institucional (Corrigido) */}
            <div>
              <h4 className="text-white font-serif mb-6">Institucional</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-yellow-600 transition-colors">Sobre Nós</Link></li>
                <li><Link href="#" className="hover:text-yellow-600 transition-colors">Contactos</Link></li>
                <li><Link href="#" className="hover:text-yellow-600 transition-colors">Termos e Condições</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pt-8 border-t border-zinc-900 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600">
            <p>&copy; 2026 Portal Lusitano. Todos os direitos reservados.</p>
            <p className="mt-2 md:mt-0">Desenvolvido por Francisco Gaspar</p>
          </div>
        </footer>

      </body>
    </html>
  );
}