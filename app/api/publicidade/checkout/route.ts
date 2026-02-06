import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { package: pkg, email, company, telefone } = await req.json();

    if (!pkg || !email || !company) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // ===== NOVO: Guardar contacto em BD ANTES de criar sessão Stripe =====
    const { data: submission, error: submissionError } = await supabase
      .from('contact_submissions')
      .insert({
        form_type: 'publicidade',
        name: company, // Nome da empresa
        email: email,
        telefone: telefone || null,
        company: company,
        form_data: {
          package: pkg,
          company: company,
          telefone: telefone,
          email: email,
        },
        status: 'novo',
        priority: pkg === 'anual' ? 'alta' : 'normal', // Pacote anual = prioridade alta
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        user_agent: req.headers.get('user-agent') || null,
      })
      .select()
      .single();

    if (submissionError || !submission) {
      console.error('Erro ao guardar contacto publicidade:', submissionError);
      return NextResponse.json(
        { error: 'Erro ao processar formulário. Tente novamente.' },
        { status: 500 }
      );
    }

    const packages: Record<string, {
      price: number;
      name: string;
      description: string;
      recurring: boolean;
    }> = {
      lateral: {
        price: 2500, // €25/mês
        name: "Banner Lateral",
        description: "300x250px em todas as páginas + relatório mensal",
        recurring: true,
      },
      premium: {
        price: 7500, // €75/mês
        name: "Destaque Premium",
        description: "Banner topo + lateral + newsletter + redes sociais",
        recurring: true,
      },
      anual: {
        price: 60000, // €600/ano
        name: "Parceria Anual",
        description: "Tudo incluído + artigo patrocinado + logo footer",
        recurring: false,
      },
    };

    const selected = packages[pkg];

    if (!selected) {
      return NextResponse.json(
        { error: "Pacote inválido" },
        { status: 400 }
      );
    }

    // Criar sessão de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: selected.name,
              description: selected.description,
            },
            unit_amount: selected.price,
            ...(selected.recurring && {
              recurring: { interval: "month" },
            }),
          },
          quantity: 1,
        },
      ],
      mode: selected.recurring ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/publicidade/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/publicidade`,
      customer_email: email,
      metadata: {
        type: "publicidade",
        contact_submission_id: submission.id, // NOVO: ID do contacto na BD
        package: pkg,
        company: company.substring(0, 100),
        telefone: telefone || "N/A",
      },
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar checkout" },
      { status: 500 }
    );
  }
}
