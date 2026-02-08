import { getProducts } from "@/lib/shopify";
import LojaContent from "./LojaContent";

export default async function LojaPage() {
  const products = await getProducts();

  return <LojaContent products={products} />;
}
