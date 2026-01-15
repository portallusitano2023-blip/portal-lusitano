import type { Metadata } from "next";
import "./globals.css";
// Importações corrigidas de acordo com a tua estrutura
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// METADADOS DE ELITE PARA SEO
export const metadata: Metadata = {
  title: {
    default: 'Portal Lusitano | O Mercado de Elite do Cavalo Lusitano',
    template: '%s | Portal Lusitano'
  },
  description: 'A plataforma líder para compra, venda e leilão de cavalos Puro Sangue Lusitano. Linhagens exclusivas, cavalos Veiga e Andrade, e exemplares selecionados.',
  keywords: ['cavalo lusitano', 'comprar cavalo lusitano', 'leilão de cavalos', 'puro sangue lusitano', 'linhagens veiga e andrade', 'investimento equestre'],
  authors: [{ name: 'Francisco Gaspar' }],
  metadataBase: new URL('https://portal.lusitano.pt'), // Substitui pelo teu domínio final quando o tiveres
  
  // Como o link aparece no WhatsApp/Instagram
  openGraph: {
    title: 'Portal Lusitano | Tradição e Excelência',
    description: 'Explore a melhor seleção de cavalos Lusitanos. Leilões ativos e exemplares de linhagens exclusivas.',
    url: 'https://portal.lusitano.pt',
    siteName: 'Portal Lusitano',
    images: [
      {
        url: '/logo.png', // Certifica-te que tens o logo.png na pasta /public
        width: 1200,
        height: 630,
        alt: 'Logo Portal Lusitano',
      },
    ],
    locale: 'pt_PT',
    type: 'website',
  },
  
  // Para aparecer bem em iPhones (Apple)
  appleWebApp: {
    title: 'Portal Lusitano',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="bg-black text-white min-h-screen flex flex-col font-sans antialiased">
        
        {/* 1. O Menu fica fixo no topo */}
        <Navbar />
        
        {/* 2. O conteúdo do site carrega aqui */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* 3. O Rodapé fica no fundo */}
        <Footer />
        
      </body>
    </html>
  );
}