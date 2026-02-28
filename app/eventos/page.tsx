import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import EventosContent from "@/components/eventos/EventosContent";

// ISR: Revalidate events every hour (matches layout)
export const revalidate = 3600;

export default async function EventosPage() {
  const { data, error } = await supabase
    .from("eventos")
    .select(
      "id, titulo, slug, descricao, tipo, data_inicio, data_fim, localizacao, regiao, imagem_capa, confirmado, destaque, preco_entrada, status"
    )
    .eq("status", "active")
    .gte("data_inicio", new Date().toISOString().split("T")[0])
    .order("data_inicio", { ascending: true });

  if (error) {
    logger.error("[EventosPage] Supabase error:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="h-8 w-48 bg-[var(--background-card)] rounded mx-auto mb-8" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <EventosContent eventos={data || []} />
    </Suspense>
  );
}
