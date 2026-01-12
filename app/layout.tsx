import type { Metadata } from "next";
import "./globals.css";
// Importamos o nosso componente novo!
import Navbar from "../components/Navbar"; 

export const metadata: Metadata = {
  title: "Portal Lusitano | Cavalos Premium",
  description: "O maior marketplace de Cavalos Lusitanos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="bg-zinc-950 text-zinc-200 antialiased">
        
        {/* AQUI ESTÁ ELA: A Navbar Componentizada */}
        <Navbar />

        {/* O children é a página que estás a ver (Home, Detalhes, etc) */}
        {children}

        {/* RODAPÉ (Podes componentizar este depois também!) */}
        <footer className="bg-black py-12 text-center border-t border-zinc-900 mt-20">
          <p className="text-zinc-600 text-sm">
            &copy; 2023 Portal Lusitano. Todos os direitos reservados.
          </p>
          <p className="text-zinc-800 text-xs mt-2">
            Desenvolvido por Portal Lusitano
          </p>
        </footer>
      </body>
    </html>
  );
}