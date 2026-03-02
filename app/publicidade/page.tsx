import PublicidadeContent from "@/components/publicidade/PublicidadeContent";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = generatePageMetadata({
  title: "Publicidade — Promova o Seu Negócio Equestre",
  description:
    "Anuncie no Portal Lusitano e alcance a comunidade equestre portuguesa. Banners, artigos patrocinados, destaques no directório e marketplace.",
  path: "/publicidade",
  keywords: [
    "publicidade equestre",
    "anunciar cavalos",
    "publicidade coudelaria",
    "marketing equestre portugal",
  ],
});

export default function PublicidadePage() {
  return <PublicidadeContent />;
}
