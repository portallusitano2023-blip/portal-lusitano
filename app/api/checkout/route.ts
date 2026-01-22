// @ts-nocheck
import { createCheckout } from "@/lib/shopify";
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
    // 2. Pedir ao Shopify para criar o carrinho
    console.log("⏳ A contactar Shopify...");
    const checkoutUrl = await createCheckout(variantId);
    
    console.log("✅ Resposta Shopify:", checkoutUrl ? "Sucesso" : "Vazia");

    if (!checkoutUrl) {
        throw new Error("Shopify não devolveu URL");
    }

    return NextResponse.json({ checkoutUrl });

  } catch (error) {
    console.error("🔥 ERRO CRÍTICO NO SERVIDOR:", error);
    return NextResponse.json({ error: "Erro ao criar checkout", details: error.message }, { status: 500 });
  }
}