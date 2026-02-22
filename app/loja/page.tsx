import { getProducts } from "@/lib/shopify";
import LojaContent from "@/components/loja/LojaContent";

// Revalidar a cada 30 minutos — produtos Shopify mudam com pouca frequência
export const revalidate = 1800;

// Produtos a esconder da loja (por handle OU título)
const HIDDEN_PRODUCTS = new Set(["the-crest-case-signature", "the-crest-case-•-signature"]);

export default async function LojaPage() {
  const allProducts = await getProducts();
  const products = allProducts.filter(
    (p) => !HIDDEN_PRODUCTS.has(p.handle ?? "") && !p.title.toLowerCase().includes("crest case")
  );

  return <LojaContent products={products} />;
}
