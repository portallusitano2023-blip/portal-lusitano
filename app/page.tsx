import { getProducts } from "@/lib/shopify";
import HomeContent from "@/components/HomeContent"; // Importa o visual novo

export default async function HomePage() {
  // Busca os produtos no servidor (rápido e seguro)
  const products = (await getProducts()).slice(0, 2);

  // Entrega os produtos ao componente visual que sabe traduzir
  return <HomeContent products={products} />;
}