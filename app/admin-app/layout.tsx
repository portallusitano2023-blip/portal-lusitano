import type { Metadata } from "next";
import { TabProvider } from "@/context/TabContext";

export const metadata: Metadata = {
  title: "Administração",
  description: "Painel de administração do Portal Lusitano.",
  robots: { index: false, follow: false },
};

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TabProvider>
      <div className="h-screen bg-[#050505] text-white overflow-hidden">{children}</div>
    </TabProvider>
  );
}
