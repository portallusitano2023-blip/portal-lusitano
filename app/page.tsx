import HomeContent from "@/components/HomeContent";
import { getProducts } from "@/lib/shopify";

// ISR: Revalidate homepage every hour
export const revalidate = 3600;

export default async function HomePage() {
  const allProducts = await getProducts().catch(() => []);
  const HIDDEN = new Set(["the-crest-case-signature", "the-crest-case-•-signature"]);
  const products = allProducts.filter(
    (p) => !HIDDEN.has(p.handle ?? "") && !p.title.toLowerCase().includes("crest case")
  );
  const featuredProduct = products[0] ?? null;

  return <HomeContent featuredProduct={featuredProduct} />;
}
