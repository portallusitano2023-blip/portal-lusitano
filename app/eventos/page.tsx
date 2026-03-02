import { Suspense } from "react";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase-admin";
import { logger } from "@/lib/logger";
import EventosContent from "@/components/eventos/EventosContent";
import { generatePageMetadata } from "@/lib/seo";

// ISR: Revalidate events every hour (matches layout)
export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: "Eventos Equestres — Calendário Lusitano",
  description:
    "Calendário completo de eventos equestres em Portugal: exposições APSL, provas de dressage, working equitation e competições de cavalos Lusitanos. Inscrições e detalhes.",
  path: "/eventos",
  keywords: [
    "eventos equestres portugal",
    "exposições APSL",
    "provas dressage",
    "working equitation",
    "competições cavalos lusitanos",
    "calendário equestre",
  ],
});

export default async function EventosPage() {
  const { data, error } = await supabase
    .from("eventos")
    .select(
      "id, titulo, slug, descricao, descricao_completa, tipo, data_inicio, data_fim, hora_inicio, hora_fim, localizacao, regiao, organizador, website, preco_entrada, imagem_capa, tags, confirmado, destaque, status"
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
