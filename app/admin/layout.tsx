import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administração",
  description: "Painel de administração do Portal Lusitano.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
