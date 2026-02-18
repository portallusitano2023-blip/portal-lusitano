import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySession } from "@/lib/auth";
import { strictLimiter } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// Cliente Supabase com service role para upload
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Rate limit: 5 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await strictLimiter.check(5, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente novamente em breve." },
        { status: 429 }
      );
    }
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "Ficheiro nao fornecido" }, { status: 400 });
    }

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de ficheiro nao permitido. Use JPEG, PNG, WebP ou GIF." },
        { status: 400 }
      );
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ficheiro demasiado grande. Maximo 5MB." },
        { status: 400 }
      );
    }

    // Gerar nome unico
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload para Supabase Storage
    const { data, error } = await supabaseAdmin.storage.from("images").upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      logger.error("Erro no upload:", error);
      return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 });
    }

    // Obter URL publica
    const { data: urlData } = supabaseAdmin.storage.from("images").getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE - Remover imagem
export async function DELETE(request: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Rate limit: 5 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await strictLimiter.check(5, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente novamente em breve." },
        { status: 429 }
      );
    }
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Path da imagem nao fornecido" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage.from("images").remove([path]);

    if (error) {
      logger.error("Erro ao remover:", error);
      return NextResponse.json({ error: "Erro ao remover imagem" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
