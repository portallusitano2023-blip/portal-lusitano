import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { apiLimiter } from "@/lib/rate-limit";
import { reviewSchema, toolReviewSchema, parseWithZod } from "@/lib/schemas";
import { logger } from "@/lib/logger";

const VALID_TOOL_SLUGS = [
  "calculadora-valor",
  "comparador-cavalos",
  "verificador-compatibilidade",
  "analise-perfil",
];

// GET - Listar reviews de uma coudelaria ou ferramenta
export async function GET(request: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await apiLimiter.check(10, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente novamente em breve." },
        { status: 429 }
      );
    }
    const { searchParams } = new URL(request.url);
    const coudelariaId = searchParams.get("coudelaria_id");
    const ferramentaSlug = searchParams.get("ferramenta_slug");

    if (!coudelariaId && !ferramentaSlug) {
      return NextResponse.json(
        { error: "ID da coudelaria ou slug da ferramenta é obrigatório" },
        { status: 400 }
      );
    }

    let query = supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (ferramentaSlug) {
      if (ferramentaSlug === "all") {
        query = query.not("ferramenta_slug", "is", null);
      } else {
        query = query.eq("ferramenta_slug", ferramentaSlug);
      }
    } else {
      query = query.eq("coudelaria_id", coudelariaId!);
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Erro ao buscar reviews:", error);
      return NextResponse.json({ error: "Erro ao buscar reviews" }, { status: 500 });
    }

    // Calcular média
    const total = data?.length || 0;
    const soma = data?.reduce((acc, r) => acc + r.avaliacao, 0) || 0;
    const media = total > 0 ? soma / total : 0;

    return NextResponse.json(
      {
        reviews: data,
        stats: {
          total,
          media: Math.round(media * 10) / 10,
        },
      },
      {
        headers: {
          // Public approved reviews — cache 5 min at CDN, stale up to 15 min
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
          Vary: "Accept-Encoding",
        },
      }
    );
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST - Criar nova review (coudelaria ou ferramenta)
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 reviews per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await apiLimiter.check(10, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente novamente em breve." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot: reject if the hidden field is filled (bots fill all fields)
    if (body.website || body.phone || body.company) {
      logger.warn("Honeypot triggered - bot detected", { ip });
      return NextResponse.json({ message: "Review submitted successfully" }, { status: 200 });
    }

    // Detect review type based on presence of ferramenta_slug
    const isToolReview = "ferramenta_slug" in body && body.ferramenta_slug;

    if (isToolReview) {
      // Validate tool slug
      if (!VALID_TOOL_SLUGS.includes(body.ferramenta_slug)) {
        return NextResponse.json({ error: "Ferramenta inválida" }, { status: 400 });
      }

      const parsed = parseWithZod(toolReviewSchema, body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }

      const { ferramenta_slug, autor_nome, avaliacao, comentario, recomenda } = parsed.data;

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          ferramenta_slug,
          autor_nome,
          avaliacao,
          comentario,
          recomenda: recomenda ?? true,
          status: "approved",
        })
        .select()
        .single();

      if (error) {
        logger.error("Erro ao criar review de ferramenta:", error);
        return NextResponse.json({ error: "Erro ao submeter avaliação" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        review: data,
        message: "Avaliação submetida para aprovação",
      });
    } else {
      // Coudelaria review (original logic)
      const parsed = parseWithZod(reviewSchema, body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      const {
        coudelaria_id,
        autor_nome,
        autor_email,
        autor_localizacao,
        avaliacao,
        titulo,
        comentario,
        data_visita,
        tipo_visita,
        recomenda,
      } = parsed.data;

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          coudelaria_id,
          autor_nome,
          autor_email,
          autor_localizacao,
          avaliacao,
          titulo,
          comentario,
          data_visita,
          tipo_visita,
          recomenda: recomenda ?? true,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        logger.error("Erro ao criar review:", error);
        return NextResponse.json({ error: "Erro ao submeter avaliação" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        review: data,
        message: "Avaliação submetida para aprovação",
      });
    }
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
