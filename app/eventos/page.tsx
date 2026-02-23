import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import EventosContent from "@/components/eventos/EventosContent";

// ISR: Revalidate events every hour (matches layout)
export const revalidate = 3600;

export default async function EventosPage() {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("status", "active")
    .gte("data_inicio", new Date().toISOString().split("T")[0])
    .order("data_inicio", { ascending: true });

  if (error) {
    logger.error("[EventosPage] Supabase error:", error);
  }

  return (
    <Suspense>
      <EventosContent eventos={data || []} />
    </Suspense>
  );
}
