import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Comparador de Cavalos — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Ferramenta PRO",
    title: "Comparador de Cavalos",
    subtitle: "Compare características, linhagem e potencial entre dois Lusitanos",
  });
}
