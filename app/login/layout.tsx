import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sessão | Portal Lusitano",
  description: "Aceda à sua conta no Portal Lusitano - o maior portal dedicado ao cavalo Lusitano.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
