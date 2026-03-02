import { NextRequest, NextResponse } from "next/server";
import { addToCart } from "@/lib/shopify";
import { logger } from "@/lib/logger";
import { cartAddSchema, parseWithZod } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseWithZod(cartAddSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { cartId, variantId, quantity } = parsed.data;

    const cart = await addToCart(cartId, variantId, quantity);
    if (!cart) {
      return NextResponse.json({ error: "Falha ao adicionar ao carrinho" }, { status: 500 });
    }
    return NextResponse.json({ cart });
  } catch (error: unknown) {
    logger.error("[API cart/add] Erro ao adicionar ao carrinho:", error);
    return NextResponse.json({ error: "Erro ao adicionar" }, { status: 500 });
  }
}
