import { NextRequest, NextResponse } from "next/server";
import { updateCartLines } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const { cartId, lineId, quantity } = await request.json();

    if (!cartId || !lineId || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "cartId, lineId e quantity são obrigatórios" },
        { status: 400 }
      );
    }

    const cart = await updateCartLines(cartId, lineId, quantity);
    if (!cart) {
      return NextResponse.json({ error: "Falha ao atualizar carrinho" }, { status: 500 });
    }
    return NextResponse.json({ cart });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao atualizar" },
      { status: 500 }
    );
  }
}
