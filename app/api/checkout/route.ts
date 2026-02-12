import { createCart, addToCart } from "@/lib/shopify";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const body = await request.json();
  const { variantId } = body;

  if (!variantId) {
    return NextResponse.json({ error: "Falta o ID do produto" }, { status: 400 });
  }

  try {
    const cart = await createCart();

    if (!cart || !cart.id) {
      throw new Error("Shopify não devolveu carrinho");
    }

    const updatedCart = await addToCart(cart.id, variantId);

    const checkoutUrl = updatedCart?.checkoutUrl || cart.checkoutUrl;

    if (!checkoutUrl) {
      throw new Error("Shopify não devolveu URL de checkout");
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error: unknown) {
    logger.error("Erro no checkout:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar checkout",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
