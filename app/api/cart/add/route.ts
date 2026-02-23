import { NextRequest, NextResponse } from "next/server";
import { addToCart } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const { cartId, variantId, quantity = 1 } = await request.json();

    if (!cartId || !variantId) {
      return NextResponse.json({ error: "cartId e variantId são obrigatórios" }, { status: 400 });
    }

    const cart = await addToCart(cartId, variantId, quantity);
    if (!cart) {
      return NextResponse.json({ error: "Falha ao adicionar ao carrinho" }, { status: 500 });
    }
    return NextResponse.json({ cart });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Erro ao adicionar" }, { status: 500 });
  }
}
