// @ts-nocheck
import { createCart, addToCart } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1. Ler o ID que vem do botão
  const body = await request.json();
  const { variantId } = body;

  console.log("----------------------------------------------");
  console.log("🛒 TENTATIVA DE CHECKOUT");
  console.log("🆔 Variant ID recebido:", variantId);

  if (!variantId) {
    console.error("❌ ERRO: Variant ID está vazio!");
    return NextResponse.json({ error: "Falta o ID do produto" }, { status: 400 });
  }

  try {
    // 2. Criar um carrinho novo
    console.log("⏳ A criar carrinho no Shopify...");
    const cart = await createCart();

    if (!cart || !cart.id) {
      throw new Error("Shopify não devolveu carrinho");
    }

    // 3. Adicionar o produto ao carrinho
    console.log("⏳ A adicionar produto ao carrinho...");
    const updatedCart = await addToCart(cart.id, variantId);

    const checkoutUrl = updatedCart?.checkoutUrl || cart.checkoutUrl;

    console.log("✅ Checkout URL:", checkoutUrl ? "Sucesso" : "Vazia");

    if (!checkoutUrl) {
      throw new Error("Shopify não devolveu URL de checkout");
    }

    return NextResponse.json({ checkoutUrl });

  } catch (error) {
    console.error("🔥 ERRO CRÍTICO NO SERVIDOR:", error);
    return NextResponse.json({ error: "Erro ao criar checkout", details: error.message }, { status: 500 });
  }
}
