import type { Metadata } from "next";
import { getProducts } from "@/lib/shopify";
import LojaContent from "@/components/loja/LojaContent";
import { generatePageMetadata } from "@/lib/seo";

// Revalidar a cada 30 minutos — produtos Shopify mudam com pouca frequência
export const revalidate = 1800;

export const metadata: Metadata = generatePageMetadata({
  title: "Loja — Produtos Equestres Premium",
  description:
    "Loja online do Portal Lusitano. Produtos exclusivos para cavaleiros — equipamento, vestuário e acessórios equestres de qualidade premium.",
  path: "/loja",
  keywords: [
    "loja equestre online",
    "produtos cavalos lusitanos",
    "equipamento equestre portugal",
    "vestuário equitação",
    "acessórios cavalos",
  ],
});

// Produtos a esconder da loja (por handle OU título)
const HIDDEN_PRODUCTS = new Set(["the-crest-case-signature", "the-crest-case-•-signature"]);

export default async function LojaPage() {
  const allProducts = await getProducts();
  const products = allProducts.filter(
    (p) => !HIDDEN_PRODUCTS.has(p.handle ?? "") && !p.title.toLowerCase().includes("crest case")
  );

  return <LojaContent products={products} />;
}
