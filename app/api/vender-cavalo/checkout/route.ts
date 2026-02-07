import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// Armazenamento temporário em memória (DEPRECATED - mantido apenas para backward compatibility)
// Agora guardamos em BD permanentemente
const tempStorage = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const { anuncio, destaque, formData } = await req.json();

    if (!anuncio) {
      return NextResponse.json(
        { error: "Anúncio é obrigatório" },
        { status: 400 }
      );
    }

    if (!formData || !formData.nomeCavalo) {
      return NextResponse.json(
        { error: "Dados do formulário inválidos" },
        { status: 400 }
      );
    }

    // ===== NOVO: Guardar contacto em BD ANTES de criar sessão Stripe =====
    const { data: submission, error: submissionError } = await supabase
      .from('contact_submissions')
      .insert({
        form_type: 'vender_cavalo',
        name: formData.proprietarioNome || 'N/A',
        email: formData.proprietarioEmail,
        telefone: formData.proprietarioTelefone || null,
        company: null,
        form_data: {
          ...formData,
          destaque: destaque,
          anuncio: anuncio,
        },
        status: 'novo',
        priority: destaque ? 'alta' : 'normal', // Destaque = prioridade alta
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        user_agent: req.headers.get('user-agent') || null,
      })
      .select()
      .single();

    if (submissionError || !submission) {
      console.error('Erro ao guardar contacto:', submissionError);
      return NextResponse.json(
        { error: 'Erro ao processar formulário. Tente novamente.' },
        { status: 500 }
      );
    }

    const lineItems: any[] = [];

    // Anúncio base (€49)
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Anúncio de Cavalo - 30 dias",
          description: "Anúncio verificado com documentos APSL no Portal Lusitano",
        },
        unit_amount: 4900, // €49.00
      },
      quantity: 1,
    });

    // Destaque Premium adicional (€29)
    if (destaque) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Destaque Premium - 7 dias",
            description: "Topo da lista + 3x mais visualizações",
          },
          unit_amount: 2900, // €29.00
        },
        quantity: 1,
      });
    }

    // Gerar um ID único para esta sessão (DEPRECATED - mantido para backward compatibility)
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Guardar dados completos temporariamente (DEPRECATED - dual write durante migração)
    tempStorage.set(tempId, {
      formData,
      destaque,
      createdAt: Date.now(),
    });

    // Limpar dados antigos (mais de 1 hora)
    for (const [key, value] of tempStorage.entries()) {
      if (Date.now() - value.createdAt > 3600000) {
        tempStorage.delete(key);
      }
    }

    // Criar sessão de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/vender-cavalo/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/vender-cavalo`,
      customer_email: formData.proprietarioEmail,
      metadata: {
        type: "cavalo_anuncio",
        contact_submission_id: submission.id, // NOVO: ID do contacto na BD
        temp_id: tempId, // DEPRECATED: mantido para fallback
        destaque: destaque ? "true" : "false",
        nome: formData.nomeCavalo.substring(0, 100),
      },
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar checkout" },
      { status: 500 }
    );
  }
}

// Export do storage para o webhook poder aceder
export { tempStorage };
