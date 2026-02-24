import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Mapa de Coudelarias — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Mapa Interativo",
    title: "Coudelarias de Portugal",
    subtitle: "Encontre coudelarias de cavalos Lusitanos em todo o país",
  });
}
