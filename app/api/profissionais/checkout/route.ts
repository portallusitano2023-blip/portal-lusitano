import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { formData } = await req.json();

    if (!formData || !formData.nome || !formData.email || !formData.categoria) {
      return NextResponse.json({ error: "Dados do formulário incompletos" }, { status: 400 });
    }

    // Guardar contacto em BD antes de criar sessão Stripe
    const { data: submission, error: submissionError } = await supabase
      .from("contact_submissions")
      .insert({
        form_type: "profissional",
        name: formData.nome,
        email: formData.email,
        telefone: formData.telefone || null,
        company: null,
        form_data: formData,
        status: "novo",
        priority: "normal",
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
        user_agent: req.headers.get("user-agent") || null,
      })
      .select()
      .single();

    if (submissionError || !submission) {
      logger.error("Erro ao guardar contacto profissional:", submissionError);
      return NextResponse.json(
        { error: "Erro ao processar formulário. Tente novamente." },
        { status: 500 }
      );
    }

    // Criar sessão de checkout Stripe em modo subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Registo Profissional - Portal Lusitano",
              description: "Perfil verificado no directório de profissionais equestres",
            },
            unit_amount: 600, // €6.00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profissionais/registar/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profissionais/registar`,
      customer_email: formData.email,
      metadata: {
        type: "profissional",
        contact_submission_id: submission.id,
        nome: formData.nome.substring(0, 100),
        categoria: formData.categoria,
        telefone: formData.telefone || "",
        distrito: formData.distrito || "",
        cidade: formData.cidade || "",
        especialidade: formData.especialidade || "",
        anos_experiencia: String(formData.anosExperiencia || 0),
        modalidade: formData.modalidade || "presencial",
        pais: formData.pais || "",
        emergencias_24h: formData.emergencias24h ? "true" : "false",
        seguro_profissional: formData.seguroProfissional ? "true" : "false",
      },
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error("Profissional checkout creation error:", error);
    return NextResponse.json(
      { error: "Erro ao criar checkout. Tente novamente." },
      { status: 500 }
    );
  }
}
