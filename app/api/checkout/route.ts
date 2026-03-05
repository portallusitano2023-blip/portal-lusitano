import { createCart, addToCart } from "@/lib/shopify";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  let body: { variantId?: string };
  try {
    body = await request.json();
  } catch {
    return apiError("Corpo do pedido inválido", 400);
  }

  const { variantId } = body;

  if (!variantId) {
    return apiError("Falta o ID do produto", 400);
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

    return apiSuccess({ checkoutUrl });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    logger.error("[Checkout] Error:", detail);
    return apiError("Erro ao criar checkout", 500, `checkout: ${detail}`);
  }
}
