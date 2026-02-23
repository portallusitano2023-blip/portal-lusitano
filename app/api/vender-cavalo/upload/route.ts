import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { strictLimiter } from "@/lib/rate-limit";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const BUCKET = "cavalos-imagens";

// Derive extension from MIME type — never trust user-supplied filename extension
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  // Verificar origin — bloquear pedidos de domínios externos
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
    "https://portal-lusitano.pt",
    "http://localhost:3000",
  ].filter(Boolean);

  if (!origin || !allowedOrigins.some((o) => origin.startsWith(o!))) {
    return NextResponse.json({ error: "Origem não autorizada." }, { status: 403 });
  }

  // Rate limit: 10 uploads per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    await strictLimiter.check(10, ip);
  } catch {
    return NextResponse.json(
      { error: "Demasiados pedidos. Tente novamente mais tarde." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem enviada" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Máximo ${MAX_FILES} imagens permitidas` },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de ficheiro inválido: ${file.type}. Use JPEG, PNG ou WebP.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Ficheiro "${file.name}" demasiado grande. Máximo 5MB por imagem.` },
          { status: 400 }
        );
      }

      const ext = MIME_TO_EXT[file.type] || "jpg";
      const uniqueName = `${Date.now()}-${crypto.randomUUID().replace(/-/g, "").substring(0, 8)}.${ext}`;
      const path = `pending/${uniqueName}`;

      const buffer = await file.arrayBuffer();
      const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

      if (uploadError) {
        logger.error("Storage upload error:", uploadError);
        return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 });
      }

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

      urls.push(publicUrl);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    logger.error("Upload route error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
