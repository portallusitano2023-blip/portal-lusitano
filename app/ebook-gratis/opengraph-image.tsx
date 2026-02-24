import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "eBook Grátis — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Download Gratuito",
    title: "eBook Cavalo Lusitano",
    subtitle: "O guia essencial para conhecer a raça mais nobre de Portugal",
  });
}
