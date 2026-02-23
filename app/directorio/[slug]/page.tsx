import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CoudelariaDetail from "@/components/directorio/CoudelariaDetail";

export default async function CoudelariaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: coudelaria } = await supabase
    .from("coudelarias")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!coudelaria) notFound();

  // Approved reviews
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
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
