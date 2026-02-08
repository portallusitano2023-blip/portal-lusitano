import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { error } = await supabase.from("cavalos_venda").insert([
      {
        nome_cavalo: data.nomeCavalo,
        linhagem: data.linhagem,
        preco: data.preco,
        image_url: data.imageUrl, // A nova coluna para a foto
        status: "pendente",
      },
    ]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
