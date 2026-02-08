import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Conta | Portal Lusitano",
  description: "Gerir a sua conta, encomendas e favoritos no Portal Lusitano.",
  robots: { index: false, follow: false },
};

export default function MinhaContaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
