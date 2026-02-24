import { createOgImage, ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Vender Cavalo Lusitano — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage({
    label: "Marketplace Premium",
    title: "Venda o Seu Cavalo",
    subtitle: "Anúncio verificado com documentos APSL no Portal Lusitano",
  });
}
