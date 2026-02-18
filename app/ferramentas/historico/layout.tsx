import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histórico PRO | Ferramentas | Portal Lusitano",
  description: "Consulte o histórico das suas análises e cálculos PRO.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
