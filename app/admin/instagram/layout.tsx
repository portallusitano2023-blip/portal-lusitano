import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Instagram - Admin | Portal Lusitano",
  description: "Gestão de materiais de publicidade do Instagram",
  robots: "noindex, nofollow",
};

export default function AdminInstagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
