import { createSupabaseServerClient } from "@/lib/supabase-server";
import MapaClient from "@/components/MapaClient";
import type { Coudelaria } from "@/components/MapaClient";

export default async function MapaPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("coudelarias")
    .select(
      "id, slug, nome, descricao, localizacao, regiao, telefone, email, website, foto_capa, destaque, is_pro, coordenadas_lat, coordenadas_lng, num_cavalos, especialidades"
    )
    .eq("status", "active")
    .order("destaque", { ascending: false })
    .order("nome", { ascending: true });

  const coudelarias: Coudelaria[] = (data ?? []).map((c) => ({
    id: c.id,
    nome: c.nome,
    slug: c.slug,
    descricao: c.descricao ?? "",
    localizacao: c.localizacao ?? "",
    regiao: c.regiao ?? "",
    telefone: c.telefone ?? undefined,
    email: c.email ?? undefined,
    website: c.website ?? undefined,
    foto_capa: c.foto_capa ?? undefined,
    is_pro: c.is_pro ?? false,
    destaque: c.destaque ?? false,
    coordenadas_lat: c.coordenadas_lat ?? undefined,
    coordenadas_lng: c.coordenadas_lng ?? undefined,
    num_cavalos: c.num_cavalos ?? undefined,
    especialidades: c.especialidades ?? undefined,
  }));

  return <MapaClient coudelarias={coudelarias} />;
}
