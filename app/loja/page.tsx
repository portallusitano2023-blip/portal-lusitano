import { getProducts } from "@/lib/shopify";
import LojaContent from "@/components/loja/LojaContent";

// Revalidar a cada 30 minutos — produtos Shopify mudam com pouca frequência
export const revalidate = 1800;

export default async function LojaPage() {
  const products = await getProducts();

  return <LojaContent products={products} />;
}
