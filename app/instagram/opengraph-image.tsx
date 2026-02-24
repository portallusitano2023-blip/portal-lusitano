import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Instagram Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Redes Sociais",
    title: "Instagram Portal Lusitano",
    subtitle: "Promova o seu cavalo ou negócio equestre no nosso Instagram",
  });
}
