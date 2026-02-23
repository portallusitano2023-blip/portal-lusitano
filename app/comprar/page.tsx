import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import ComprarContent from "@/components/ComprarContent";

// ISR: Revalidate marketplace every hour (cavalos can be added/updated)
export const revalidate = 3600;

export default async function ComprarPage() {
  const { data: cavalos, error } = await supabase
    .from("cavalos_venda")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("[ComprarPage] Supabase error:", error);
  }

  return <ComprarContent cavalos={cavalos || []} />;
}
