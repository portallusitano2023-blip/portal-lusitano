import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { z } from "zod";

const CavaloSchema = z.object({
  nome: z.string().min(1).max(200),
  nome_cavalo: z.string().min(1).max(200),
  descricao: z.string().max(5000).optional(),
  preco: z.number().positive().optional(),
  linhagem: z.string().max(200).optional(),
  idade: z.number().int().min(0).max(50).optional(),
  sexo: z.enum(["macho", "femea", "castrado"]).optional(),
  pelagem: z.string().max(100).optional(),
  altura: z.number().min(100).max(200).optional(),
  peso: z.number().min(200).max(1000).optional(),
  disciplinas: z.array(z.string()).optional(),
  nivel: z.string().max(100).optional(),
  localizacao: z.string().max(200).optional(),
  coudelaria: z.string().max(200).optional(),
  imagens: z.array(z.string().url()).optional(),
  image_url: z.string().url().optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(200)
    .optional(),
  destaque: z.boolean().optional(),
  contacto_nome: z.string().max(200).optional(),
  contacto_email: z.string().email().optional(),
  contacto_telefone: z.string().max(30).optional(),
});

// GET - Listar todos os cavalos (admin)
export async function GET() {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("cavalos_venda")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      logger.error("Erro ao buscar cavalos:", error);
      return NextResponse.json({ error: "Erro ao buscar cavalos" }, { status: 500 });
    }

    return NextResponse.json({ cavalos: data });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST - Criar novo anúncio de cavalo
export async function POST(request: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const raw = await request.json();
    const parsed = CavaloSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    const body = parsed.data;

    const { data, error } = await supabase
      .from("cavalos_venda")
      .insert({
        nome: body.nome,
        nome_cavalo: body.nome_cavalo,
        descricao: body.descricao,
        preco: body.preco,
        linhagem: body.linhagem,
        idade: body.idade,
        sexo: body.sexo,
        pelagem: body.pelagem,
        altura: body.altura,
        peso: body.peso,
        disciplinas: body.disciplinas,
        nivel: body.nivel,
        localizacao: body.localizacao,
        coudelaria: body.coudelaria,
        imagens: body.imagens,
        image_url: body.image_url,
        slug: body.slug,
        destaque: body.destaque,
        contacto_nome: body.contacto_nome,
        contacto_email: body.contacto_email,
        contacto_telefone: body.contacto_telefone,
        status: "active",
        views_count: 0,
      })
      .select()
      .single();

    if (error) {
      logger.error("Erro ao criar anúncio:", error);
      return NextResponse.json({ error: "Erro ao criar anúncio" }, { status: 500 });
    }

    return NextResponse.json({ cavalo: data });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
