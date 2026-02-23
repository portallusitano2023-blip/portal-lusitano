import { NextRequest, NextResponse } from "next/server";
import { updateCartLines } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const { cartId, lineId, quantity } = await request.json();

    if (!cartId || !lineId || typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { error: "cartId, lineId e quantity (≥1) são obrigatórios" },
        { status: 400 }
      );
    }

    const cart = await updateCartLines(cartId, lineId, quantity);
    if (!cart) {
      return NextResponse.json({ error: "Falha ao atualizar carrinho" }, { status: 500 });
    }
    return NextResponse.json({ cart });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
