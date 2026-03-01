import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import ComprarContent from "@/components/ComprarContent";

// ISR: Revalidate marketplace every hour (cavalos can be added/updated)
export const revalidate = 3600;

// PPR: serve the static shell instantly, stream dynamic content
export const experimental_ppr = true;

export default async function ComprarPage() {
  const { data: cavalos, error } = await supabase
    .from("cavalos_venda")
    .select(
      "id, nome_cavalo, preco, image_url, slug, localizacao, idade, raca, sexo, disciplinas, nivel, destaque, created_at, status"
    )
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("[ComprarPage] Supabase error:", error);
  }

  return <ComprarContent cavalos={cavalos || []} />;
}
