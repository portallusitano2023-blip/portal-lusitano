import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase-admin";
import EventoDetail from "@/components/eventos/EventoDetail";

export default async function EventoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: evento } = await supabase
    .from("eventos")
    .select(
      "id, titulo, slug, descricao, descricao_completa, tipo, data_inicio, data_fim, hora_inicio, hora_fim, localizacao, regiao, organizador, website, preco_entrada, imagem_capa, tags, destaque, confirmado, views_count, status"
    )
    .eq("slug", slug)
    .single();
  if (!evento) notFound();

  // Related events (same type, future, excluding current)
  const { data: relacionados } = await supabase
    .from("eventos")
    .select("id, titulo, slug, tipo, data_inicio, localizacao, imagem_capa")
    .eq("tipo", evento.tipo)
    .neq("id", evento.id)
    .eq("status", "active")
    .gte("data_inicio", new Date().toISOString().split("T")[0])
    .order("data_inicio", { ascending: true })
    .limit(3);

  // View count fire-and-forget
  supabase
    .from("eventos")
    .update({ views_count: (evento.views_count || 0) + 1 })
    .eq("id", evento.id)
    .then(() => {});

  return <EventoDetail evento={evento} relacionados={relacionados || []} />;
}
