import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Perguntas Frequentes — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Ajuda",
    title: "Perguntas Frequentes",
    subtitle: "Tudo o que precisa de saber sobre cavalos Lusitanos e o Portal",
  });
}
