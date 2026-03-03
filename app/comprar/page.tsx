import type { Metadata } from "next";
import { supabase } from "@/lib/supabase-admin";
import { logger } from "@/lib/logger";
import ComprarContent from "@/components/ComprarContent";
import { generatePageMetadata } from "@/lib/seo";

// ISR: Revalidate marketplace every hour (cavalos can be added/updated)
export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: "Comprar Cavalos Lusitanos — Marketplace Equestre",
  description:
    "Compre cavalos Lusitanos de criadores certificados em Portugal. Marketplace com filtros de raça, idade, disciplina e preço. Exemplares selecionados com pedigree verificado.",
  path: "/comprar",
  keywords: [
    "comprar cavalo lusitano",
    "cavalos lusitanos à venda",
    "marketplace cavalos portugal",
    "venda cavalos puro-sangue lusitano",
    "cavalos dressage portugal",
    "comprar PSL",
  ],
});

export default async function ComprarPage() {
  const { data: cavalos, error } = await supabase
    .from("cavalos_venda")
    .select(
      "id, nome_cavalo, preco, image_url, slug, localizacao, idade, raca, sexo, disciplinas, nivel, destaque, created_at, status"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("[ComprarPage] Supabase error:", error);
  }

  return <ComprarContent cavalos={cavalos || []} hasError={!!error} />;
}
