import { NextRequest, NextResponse } from "next/server";
import { getCart } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const { cartId } = await request.json();

    if (!cartId) {
      return NextResponse.json({ error: "cartId é obrigatório" }, { status: 400 });
    }

    const cart = await getCart(cartId);
    if (!cart) {
      return NextResponse.json({ error: "Carrinho não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ cart });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar carrinho" },
      { status: 500 }
    );
  }
}
