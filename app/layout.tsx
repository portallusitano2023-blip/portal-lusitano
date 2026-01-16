// @ts-nocheck
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Título e descrição neutros para não atrair atenção
  title: "Portal Lusitano | Em Manutenção",
  description: "Plataforma em desenvolvimento. Brevemente disponível para acesso privado.",
  // Mantemos o bloqueio total aos motores de busca
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      {/* Adicionei a cor de fundo preta aqui para garantir que não há flashes brancos */}
      <body className="bg-black antialiased selection:bg-[#C5A059] selection:text-black">
        {children}
      </body>
    </html>
  );
}