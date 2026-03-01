import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

// Rate limiting: simple in-memory store (use Redis in production for multiple instances)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

// Cleanup old entries periodically (every 5 minutes)
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  },
  5 * 60 * 1000
);

// GET - Get ratings for a specific cavalo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("seller_ratings")
      .select("id, rating, comment, created_at")
      .eq("cavalo_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Erro ao buscar avaliações:", error);
      return NextResponse.json(
        { error: "Erro ao buscar avaliações" },
        { status: 500 }
      );
    }

    // Calculate average rating
    const total = data?.length || 0;
    const average =
      total > 0
        ? data!.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    return NextResponse.json({
      ratings: data,
      media: Math.round(average * 10) / 10,
      total,
    });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Create a new rating
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting check
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Muitos pedidos. Aguarda um momento antes de tentar novamente." },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { buyer_email, rating, comment } = body;

    // Validate required fields
    if (!buyer_email || !rating) {
      return NextResponse.json(
        { error: "Email e avaliação são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyer_email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Validate rating range
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Avaliação deve ser um número inteiro entre 1 e 5" },
        { status: 400 }
      );
    }

    // Validate comment length if provided
    if (comment && comment.length > 1000) {
      return NextResponse.json(
        { error: "Comentário não pode exceder 1000 caracteres" },
        { status: 400 }
      );
    }

    // Check if cavalo exists
    const { data: cavalo, error: cavaloError } = await supabase
      .from("cavalos_venda")
      .select("id")
      .eq("id", id)
      .single();

    if (cavaloError || !cavalo) {
      return NextResponse.json(
        { error: "Cavalo não encontrado" },
        { status: 404 }
      );
    }

    // Check if this buyer already rated this cavalo
    const { data: existingRating } = await supabase
      .from("seller_ratings")
      .select("id")
      .eq("cavalo_id", id)
      .eq("buyer_email", buyer_email.toLowerCase().trim())
      .single();

    if (existingRating) {
      return NextResponse.json(
        { error: "Já submeteste uma avaliação para este cavalo" },
        { status: 409 }
      );
    }

    // Insert the rating
    const { data: newRating, error: insertError } = await supabase
      .from("seller_ratings")
      .insert({
        cavalo_id: id,
        buyer_email: buyer_email.toLowerCase().trim(),
        rating: ratingNum,
        comment: comment?.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      logger.error("Erro ao criar avaliação:", insertError);
      return NextResponse.json(
        { error: "Erro ao criar avaliação" },
        { status: 500 }
      );
    }

    // Update the average rating on cavalos_venda
    const { data: allRatings } = await supabase
      .from("seller_ratings")
      .select("rating")
      .eq("cavalo_id", id);

    if (allRatings && allRatings.length > 0) {
      const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
      await supabase
        .from("cavalos_venda")
        .update({ rating_media: Math.round(avg * 10) / 10 })
        .eq("id", id);
    }

    logger.info("Nova avaliação criada", { cavalo_id: id, rating: ratingNum });

    return NextResponse.json(
      { rating: newRating },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
