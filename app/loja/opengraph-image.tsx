import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Loja Portal Lusitano — Coleção Heritage";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Cole\u00e7\u00e3o Heritage",
    title: "Loja Portal Lusitano",
    subtitle: "Peças exclusivas que unem a tradição equestre Lusitana ao design contemporâneo",
  });
}
