import { TabProvider } from "@/contexts/TabContext";

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TabProvider>
      <div className="h-screen bg-[#050505] text-white overflow-hidden">
        {children}
      </div>
    </TabProvider>
  );
}
