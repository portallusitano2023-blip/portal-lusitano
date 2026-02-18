import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const {
      packageId,
      nome,
      empresa,
      email,
      instagram,
      mensagem,
      preco: _preco,
    } = await req.json();

    if (!packageId || !email || !nome) {
      return NextResponse.json({ error: "Dados obrigatórios em falta" }, { status: 400 });
    }

    // ===== NOVO: Guardar contacto em BD ANTES de criar sessão Stripe =====
    const { data: submission, error: submissionError } = await supabase
      .from("contact_submissions")
      .insert({
        form_type: "instagram",
        name: nome,
        email: email,
        telefone: null,
        company: empresa || null,
        form_data: {
          package: packageId,
          nome: nome,
          empresa: empresa,
          email: email,
          instagram: instagram,
          mensagem: mensagem,
        },
        status: "novo",
        priority: packageId === "pack" ? "alta" : "normal", // Pack = prioridade alta
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
        user_agent: req.headers.get("user-agent") || null,
      })
      .select()
      .single();

    if (submissionError || !submission) {
      logger.error("Erro ao guardar contacto Instagram:", submissionError);
      return NextResponse.json(
        { error: "Erro ao processar formulário. Tente novamente." },
        { status: 500 }
      );
    }

    const packageNames: Record<string, string> = {
      story: "Story (24h)",
      post: "Post no Feed",
      reels: "Reels",
      pack: "Pack Completo (1 Post + 3 Stories)",
    };

    const packagePrices: Record<string, number> = {
      story: 1000, // €10
      post: 3000, // €30
      reels: 5000, // €50
      pack: 7500, // €75
    };

    const selectedPrice = packagePrices[packageId];
    const selectedName = packageNames[packageId];

    if (!selectedPrice || !selectedName) {
      return NextResponse.json({ error: "Pacote inválido" }, { status: 400 });
    }

    // Criar sessão de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Instagram - ${selectedName}`,
              description: "Publicidade no Instagram do Portal Lusitano",
            },
            unit_amount: selectedPrice,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/instagram/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/instagram`,
      customer_email: email,
      metadata: {
        type: "instagram_ad",
        contact_submission_id: submission.id, // NOVO: ID do contacto na BD
        package: packageId,
        nome: nome.substring(0, 100),
        empresa: empresa?.substring(0, 100) || "",
        instagram: instagram?.substring(0, 100) || "",
        mensagem: mensagem.substring(0, 450),
      },
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error("Instagram checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar checkout" },
      { status: 500 }
    );
  }
}
