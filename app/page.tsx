import HomeContent from "@/components/HomeContent";
import { getProducts } from "@/lib/shopify";
import { supabasePublic } from "@/lib/supabase-admin";
import type { HomeProfissional } from "@/components/HomeContent";

// ISR: Revalidate homepage every hour
export const revalidate = 3600;

export default async function HomePage() {
  const [allProducts, profResult] = await Promise.allSettled([
    getProducts(),
    supabasePublic
      .from("profissionais")
      .select("id, nome, slug, tipo, especialidade, cidade, distrito, foto_perfil_url, rating_average, rating_count, verificado, destaque")
      .eq("status", "aprovado")
      .is("deleted_at", null)
      .order("destaque", { ascending: false })
      .order("rating_average", { ascending: false })
      .limit(4),
  ]);

  const allProductsList = allProducts.status === "fulfilled" ? allProducts.value : [];
  const HIDDEN = new Set(["the-crest-case-signature", "the-crest-case-•-signature"]);
  const products = allProductsList.filter(
    (p) => !HIDDEN.has(p.handle ?? "") && !p.title.toLowerCase().includes("crest case")
  );
  const featuredProduct = products[0] ?? null;

  const rawProfs = profResult.status === "fulfilled" ? (profResult.value.data ?? []) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profissionais: HomeProfissional[] = rawProfs.map((r: any) => ({
    id: r.id,
    nome: r.nome ?? "",
    especialidade: r.especialidade ?? r.tipo ?? "",
    categoria: r.tipo ?? "",
    localizacao: [r.cidade, r.distrito].filter(Boolean).join(", ") || "Portugal",
    avaliacao: r.rating_average ?? 0,
    numAvaliacoes: r.rating_count ?? 0,
    fotoUrl: r.foto_perfil_url ?? null,
    nivelVerificacao: r.verificado ? "verificado" : "basico",
    destaque: r.destaque ?? false,
    slug: r.slug ?? r.id,
  }));

  return <HomeContent featuredProduct={featuredProduct} profissionais={profissionais} />;
}
