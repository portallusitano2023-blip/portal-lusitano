import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Verificador de Compatibilidade — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Ferramenta PRO",
    title: "Verificador de Compatibilidade",
    subtitle: "Analise a compatibilidade genética entre garanhão e égua Lusitana",
  });
}
