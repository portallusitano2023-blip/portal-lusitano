import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase-admin";
import CoudelariaDetail from "@/components/directorio/CoudelariaDetail";

export default async function CoudelariaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: coudelaria } = await supabase
    .from("coudelarias")
    .select(
      "id, nome, slug, descricao, historia, localizacao, regiao, telefone, email, website, instagram, facebook, youtube, num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos, horario, coordenadas_lat, coordenadas_lng, foto_capa, galeria, video_url, cavalos_destaque, testemunhos, is_pro, destaque, views_count"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!coudelaria) notFound();

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select(
      "id, autor_nome, autor_localizacao, avaliacao, titulo, comentario, data_visita, tipo_visita, recomenda, created_at"
    )
    .eq("status", "approved")
    .eq("coudelaria_id", coudelaria.id)
    .order("created_at", { ascending: false });

  const reviews = reviewsData || [];
  const total = reviews.length;
  const media =
    total > 0
      ? Math.round(
          (reviews.reduce((s: number, r: { avaliacao: number }) => s + r.avaliacao, 0) / total) * 10
        ) / 10
      : 0;

  // View count fire-and-forget
  supabase
    .from("coudelarias")
    .update({ views_count: (coudelaria.views_count || 0) + 1 })
    .eq("id", coudelaria.id)
    .then(() => {});

  return (
    <CoudelariaDetail
      coudelaria={coudelaria}
      initialReviews={reviews}
      initialReviewStats={{ total, media }}
    />
  );
}
