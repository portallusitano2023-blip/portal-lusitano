import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const BUCKET = "cavalos-imagens";

export async function POST(req: NextRequest) {
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

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
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
