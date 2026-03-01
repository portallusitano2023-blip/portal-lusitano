import { supabase } from "@/lib/supabase-admin";
import { logger } from "@/lib/logger";
import DirectorioContent from "@/components/directorio/DirectorioContent";

// ISR: Revalidate directory every hour (matches layout)
export const revalidate = 3600;

export default async function DirectorioPage() {
  const { data, error } = await supabase
    .from("coudelarias")
    .select(
      "id, slug, nome, localizacao, regiao, foto_capa, destaque, ordem_destaque, ano_fundacao, num_cavalos, descricao, especialidades, views_count, is_pro, coordenadas_lat, coordenadas_lng"
    )
    .eq("status", "active")
    .order("destaque", { ascending: false })
    .order("ordem_destaque", { ascending: true })
    .order("views_count", { ascending: false })
    .order("nome", { ascending: true });

  if (error) {
    logger.error("[DirectorioPage] Supabase error:", error);
  }

  return <DirectorioContent coudelarias={data || []} />;
}
