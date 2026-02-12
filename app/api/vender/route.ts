import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { strictLimiter } from "@/lib/rate-limit";

const venderSchema = z.object({
  nomeCavalo: z.string().min(2).max(100),
  linhagem: z.string().max(100).optional(),
  preco: z.number().positive().max(1_000_000).optional(),
  imageUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    try {
      await strictLimiter.check(3, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = venderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { nomeCavalo, linhagem, preco, imageUrl } = parsed.data;

    const { error } = await supabase.from("cavalos_venda").insert([
      {
        nome_cavalo: nomeCavalo,
        linhagem,
        preco,
        image_url: imageUrl,
        status: "pendente",
      },
    ]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
