import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta | Portal Lusitano",
  description: "Registe-se no Portal Lusitano para comprar, vender e acompanhar cavalos Lusitanos.",
  robots: { index: false, follow: false },
};

export default function RegistarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
