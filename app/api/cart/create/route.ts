import { NextResponse } from "next/server";
import { createCart } from "@/lib/shopify";

export async function POST() {
  try {
    const cart = await createCart();
    if (!cart) {
      return NextResponse.json({ error: "Falha ao criar carrinho" }, { status: 500 });
    }
    return NextResponse.json({ cart });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Erro ao criar carrinho" }, { status: 500 });
  }
}
