import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Publicidade — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Para Empresas",
    title: "Publicidade no Portal Lusitano",
    subtitle: "Alcance a comunidade equestre premium de Portugal",
  });
}
