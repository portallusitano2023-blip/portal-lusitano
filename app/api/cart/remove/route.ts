import { NextRequest, NextResponse } from "next/server";
import { removeFromCart } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const { cartId, lineId } = await request.json();

    if (!cartId || !lineId) {
      return NextResponse.json({ error: "cartId e lineId são obrigatórios" }, { status: 400 });
    }

    const cart = await removeFromCart(cartId, lineId);
    if (!cart) {
      return NextResponse.json({ error: "Falha ao remover do carrinho" }, { status: 500 });
    }
    return NextResponse.json({ cart });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Erro ao remover" }, { status: 500 });
  }
}
