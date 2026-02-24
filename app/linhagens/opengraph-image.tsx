import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Linhagens do Cavalo Lusitano — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Genealogia",
    title: "Linhagens Lusitanas",
    subtitle: "As grandes famílias e linhas de sangue do cavalo Lusitano",
  });
}
