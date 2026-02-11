/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error(
      `Webhook signature verification failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error(
      `Webhook handler error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata) {
    return;
  }

  // Handle cavalo anuncio
  if (metadata.type === "cavalo_anuncio") {
    // Buscar dados da BD
    let formData: Record<string, string | boolean | number> | null = null;
    let submissionId: string | null = null;

    if (metadata.contact_submission_id) {
      const { data: submission } = await supabase
        .from("contact_submissions")
        .select("*")
        .eq("id", metadata.contact_submission_id)
        .single();

      if (submission) {
        formData = submission.form_data;
        submissionId = submission.id;
      }
    }

    if (!formData) {
      console.error("Form data not found for session:", session.id);
      throw new Error("Form data not found - unable to process order");
    }

    // Insert cavalo em cavalos_venda
    const { data, error } = await supabase
      .from("cavalos_venda")
      .insert({
        nome: formData.nomeCavalo,
        sexo: formData.sexo,
        idade: formData.idade,
        cor: formData.pelagem,
        altura: formData.altura,
        preco: formData.preco,
        preco_negociavel: formData.precoNegociavel || false,
        destaque: metadata.destaque === "true",
        vendedor_email: session.customer_details?.email,
        vendedor_nome: formData.proprietarioNome,
        vendedor_telefone: formData.proprietarioTelefone,
        vendedor_whatsapp: formData.proprietarioWhatsapp,
        localizacao: formData.localizacao,
        regiao: formData.regiao,
        descricao: formData.descricao,
        linhagem: formData.linhagem,
        pai: formData.pai,
        mae: formData.mae,
        nivel_treino: formData.nivelTreino,
        disciplinas: formData.disciplinas || [],
        registro_apsl: formData.registoAPSL,
        documentos_em_dia: formData.documentosEmDia || true,
        status: "pending", // Pending admin approval
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting cavalo:", error);
      throw new Error(`Failed to insert cavalo: ${error.message}`);
    }

    // Registar pagamento (com NOVOS campos)
    const { data: payment } = await supabase
      .from("payments")
      .insert({
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id: session.id, // NOVO
        email: session.customer_details?.email!,
        amount: session.amount_total!,
        currency: session.currency!,
        status: "succeeded",
        product_type: "cavalo_anuncio", // NOVO
        product_metadata: {
          // NOVO
          package: "anuncio",
          destaque: metadata.destaque === "true",
          nome_cavalo: formData.nomeCavalo,
        },
        description: `Anúncio: ${formData.nomeCavalo}`,
      })
      .select()
      .single();

    // Ligar pagamento ao contacto (se existir)
    if (submissionId && payment) {
      await supabase
        .from("contact_submissions")
        .update({
          payment_id: payment.id,
          cavalo_id: data.id, // Ligar ao cavalo criado
        })
        .eq("id", submissionId);
    }

    // Enviar email de confirmação ao vendedor
    await resend.emails.send({
      from: "Portal Lusitano <anuncios@portal-lusitano.pt>",
      to: session.customer_details?.email!,
      subject: "Anúncio Publicado com Sucesso! 🐴",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C5A059 0%, #8B7042 100%); padding: 30px; text-align: center;">
            <h1 style="color: #000; margin: 0;">Portal Lusitano</h1>
          </div>
          <div style="padding: 40px 30px; background: #fff;">
            <h2 style="color: #333;">Anúncio Recebido!</h2>
            <p style="color: #666; line-height: 1.6;">
              O seu anúncio do cavalo <strong>${formData.nomeCavalo}</strong> foi recebido e está em análise.
            </p>
            <p style="color: #666; line-height: 1.6;">
              Estará visível no marketplace após verificação dos documentos (máximo 24 horas).
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Detalhes do Anúncio:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Cavalo:</strong> ${formData.nomeCavalo}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Preço:</strong> €${formData.preco}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Destaque:</strong> ${metadata.destaque === "true" ? "Sim (7 dias no topo)" : "Não"}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Validade:</strong> 30 dias</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Receberá um email assim que o anúncio for aprovado.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://portal-lusitano.pt/marketplace" style="background: #C5A059; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Ver Marketplace
              </a>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>Portal Lusitano - O melhor portal de cavalos Lusitanos em Portugal</p>
          </div>
        </div>
      `,
    });

    // Notificar admin
    await resend.emails.send({
      from: "Portal Lusitano <admin@portal-lusitano.pt>",
      to: "portal.lusitano2023@gmail.com",
      subject: `Novo Anúncio: ${formData.nomeCavalo} - Aprovação Pendente`,
      html: `
        <h2>Novo anúncio aguarda aprovação</h2>
        <p><strong>Cavalo:</strong> ${formData.nomeCavalo}</p>
        <p><strong>Vendedor:</strong> ${formData.proprietarioNome}</p>
        <p><strong>Email:</strong> ${session.customer_details?.email}</p>
        <p><strong>Telefone:</strong> ${formData.proprietarioTelefone}</p>
        <p><strong>Preço:</strong> €${formData.preco}</p>
        <p><strong>Destaque:</strong> ${metadata.destaque === "true" ? "Sim" : "Não"}</p>
        <p><strong>Pagamento:</strong> €${(session.amount_total! / 100).toFixed(2)}</p>
        <p><a href="https://portal-lusitano.pt/admin">Ir para Admin Panel</a></p>
      `,
    });
  }

  // Handle Instagram ad
  if (metadata.type === "instagram_ad") {
    // Registar pagamento (com NOVOS campos)
    const { data: payment } = await supabase
      .from("payments")
      .insert({
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id: session.id, // NOVO
        email: session.customer_details?.email!,
        amount: session.amount_total!,
        currency: session.currency!,
        status: "succeeded",
        product_type: "instagram", // NOVO
        product_metadata: {
          // NOVO
          package: metadata.package,
          nome: metadata.nome,
          empresa: metadata.empresa,
        },
        description: `Instagram - ${metadata.package}`,
      })
      .select()
      .single();

    // Ligar pagamento ao contacto
    if (metadata.contact_submission_id && payment) {
      await supabase
        .from("contact_submissions")
        .update({ payment_id: payment.id })
        .eq("id", metadata.contact_submission_id);
    }

    // Notificar admin com todos os detalhes
    await resend.emails.send({
      from: "Portal Lusitano <instagram@portal-lusitano.pt>",
      to: "portal.lusitano2023@gmail.com",
      subject: `Nova Compra Instagram: ${metadata.package} - ${metadata.nome}`,
      html: `
        <h2>Nova compra de publicidade no Instagram</h2>
        <p><strong>Pacote:</strong> ${metadata.package}</p>
        <p><strong>Nome:</strong> ${metadata.nome}</p>
        <p><strong>Empresa:</strong> ${metadata.empresa || "N/A"}</p>
        <p><strong>Email:</strong> ${session.customer_details?.email}</p>
        <p><strong>Instagram:</strong> ${metadata.instagram || "N/A"}</p>
        <p><strong>Mensagem:</strong><br>${metadata.mensagem}</p>
        <p><strong>Valor:</strong> €${(session.amount_total! / 100).toFixed(2)}</p>
        <hr>
        <p><strong>PRÓXIMO PASSO:</strong> Cliente deve fazer upload dos materiais em:</p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/instagram/upload/${session.id}">${process.env.NEXT_PUBLIC_BASE_URL}/instagram/upload/${session.id}</a></p>
      `,
    });

    // Email de confirmação ao cliente
    await resend.emails.send({
      from: "Portal Lusitano <instagram@portal-lusitano.pt>",
      to: session.customer_details?.email!,
      subject: "Pagamento Confirmado - Instagram Portal Lusitano 📸",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%); padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Portal Lusitano</h1>
          </div>
          <div style="padding: 40px 30px; background: #fff;">
            <h2 style="color: #333;">Pagamento Confirmado!</h2>
            <p style="color: #666; line-height: 1.6;">
              Obrigado pela sua compra! Recebemos o seu pagamento para publicidade no nosso Instagram.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Detalhes:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Pacote:</strong> ${metadata.package}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Valor:</strong> €${(session.amount_total! / 100).toFixed(2)}</p>
            </div>
            <h3 style="color: #333;">Próximos Passos:</h3>
            <ol style="color: #666; line-height: 1.8;">
              <li>Aceda ao link abaixo para fazer upload das imagens/vídeos</li>
              <li>Inclua instruções sobre caption, hashtags, etc.</li>
              <li>Publicaremos nas próximas 48 horas</li>
            </ol>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/instagram/upload/${session.id}" style="background: linear-gradient(135deg, #833AB4, #FD1D1D); color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Fazer Upload dos Materiais
              </a>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>Portal Lusitano - Instagram @portal_lusitano</p>
          </div>
        </div>
      `,
    });
  }

  // Handle publicidade
  if (metadata.type === "publicidade") {
    // Registar pagamento (com NOVOS campos)
    const { data: payment } = await supabase
      .from("payments")
      .insert({
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id: session.id, // NOVO
        email: session.customer_details?.email!,
        amount: session.amount_total!,
        currency: session.currency!,
        status: "succeeded",
        product_type: "publicidade", // NOVO
        product_metadata: {
          // NOVO
          package: metadata.package,
          company: metadata.company,
          recurring: session.mode === "subscription",
        },
        description: `Publicidade: ${metadata.package}`,
      })
      .select()
      .single();

    // Ligar pagamento ao contacto
    if (metadata.contact_submission_id && payment) {
      await supabase
        .from("contact_submissions")
        .update({ payment_id: payment.id })
        .eq("id", metadata.contact_submission_id);
    }

    // Notificar admin
    await resend.emails.send({
      from: "Portal Lusitano <admin@portal-lusitano.pt>",
      to: "portal.lusitano2023@gmail.com",
      subject: `Nova Compra de Publicidade: ${metadata.package}`,
      html: `
        <h2>Nova compra de publicidade</h2>
        <p><strong>Pacote:</strong> ${metadata.package}</p>
        <p><strong>Empresa:</strong> ${metadata.company}</p>
        <p><strong>Email:</strong> ${session.customer_details?.email}</p>
        <p><strong>Telefone:</strong> ${metadata.telefone}</p>
        <p><strong>Valor:</strong> €${(session.amount_total! / 100).toFixed(2)}</p>
        <p><strong>Tipo:</strong> ${session.mode === "subscription" ? "Recorrente (mensal)" : "Pagamento único"}</p>
      `,
    });
  }

  // Handle profissional
  if (metadata.type === "profissional") {
    const { error } = await supabase.from("profissionais").insert({
      nome: metadata.nome,
      categoria: metadata.categoria,
      email: session.customer_details?.email!,
      telefone: metadata.telefone,
      localizacao: metadata.localizacao,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      plano: metadata.plano,
      destaque: metadata.plano === "premium",
      status: "active",
    });

    if (error) {
      console.error("Error inserting profissional:", error);
      throw new Error(`Failed to insert profissional: ${error.message}`);
    }

    // Email de boas-vindas
    await resend.emails.send({
      from: "Portal Lusitano <profissionais@portal-lusitano.pt>",
      to: session.customer_details?.email!,
      subject: "Bem-vindo ao Directório de Profissionais! 👨‍⚕️",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C5A059 0%, #8B7042 100%); padding: 30px; text-align: center;">
            <h1 style="color: #000; margin: 0;">Portal Lusitano</h1>
          </div>
          <div style="padding: 40px 30px; background: #fff;">
            <h2 style="color: #333;">O seu perfil está activo!</h2>
            <p style="color: #666; line-height: 1.6;">
              Parabéns, <strong>${metadata.nome}</strong>! O seu perfil no Directório de Profissionais está agora visível.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Detalhes da Subscrição:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Plano:</strong> ${metadata.plano === "premium" ? "Premium" : "Básico"}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Categoria:</strong> ${metadata.categoria}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Valor:</strong> €${metadata.plano === "premium" ? "30" : "20"}/mês</p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://portal-lusitano.pt/profissionais" style="background: #C5A059; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Ver o Meu Perfil
              </a>
            </div>
          </div>
        </div>
      `,
    });
  }

  // Handle tools subscription
  if (metadata.type === "tools_subscription") {
    const userId = metadata.user_id;
    const subscriptionId = session.subscription as string;

    if (!userId) {
      console.error("tools_subscription: missing user_id in metadata");
      return;
    }

    // Update user profile with active subscription
    const { error } = await supabase
      .from("user_profiles")
      .update({
        tools_subscription_status: "active",
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: session.customer as string,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating tools subscription:", error);
      throw new Error(`Failed to activate tools subscription: ${error.message}`);
    }

    // Register payment
    await supabase.from("payments").insert({
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_session_id: session.id,
      email: session.customer_details?.email!,
      amount: session.amount_total!,
      currency: session.currency!,
      status: "succeeded",
      product_type: "tools_subscription",
      product_metadata: {
        user_id: userId,
        subscription_id: subscriptionId,
      },
      description: "Ferramentas PRO - Subscrição Mensal",
    });

    // Confirmation email to user
    await resend.emails.send({
      from: "Portal Lusitano <ferramentas@portal-lusitano.pt>",
      to: session.customer_details?.email!,
      subject: "Ferramentas PRO Activadas! 🛠️",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C5A059 0%, #8B7042 100%); padding: 30px; text-align: center;">
            <h1 style="color: #000; margin: 0;">Portal Lusitano</h1>
          </div>
          <div style="padding: 40px 30px; background: #fff;">
            <h2 style="color: #333;">Ferramentas PRO Activadas!</h2>
            <p style="color: #666; line-height: 1.6;">
              A sua subscrição PRO está agora activa. Tem acesso ilimitado a todas as ferramentas:
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Calculadora de Valor</li>
              <li>Comparador de Cavalos</li>
              <li>Verificador de Compatibilidade</li>
              <li>Análise de Perfil</li>
            </ul>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #666;"><strong>Plano:</strong> PRO Mensal</p>
              <p style="margin: 5px 0; color: #666;"><strong>Valor:</strong> 4,99 EUR/mês</p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://portal-lusitano.pt/ferramentas" style="background: #C5A059; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Usar Ferramentas
              </a>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>Portal Lusitano - Ferramentas PRO para cavalos Lusitanos</p>
          </div>
        </div>
      `,
    });

    // Notify admin
    await resend.emails.send({
      from: "Portal Lusitano <admin@portal-lusitano.pt>",
      to: "portal.lusitano2023@gmail.com",
      subject: `Nova Subscrição PRO: ${session.customer_details?.email}`,
      html: `
        <h2>Nova subscrição Ferramentas PRO</h2>
        <p><strong>Email:</strong> ${session.customer_details?.email}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Valor:</strong> €${((session.amount_total || 0) / 100).toFixed(2)}/mês</p>
        <p><strong>Subscription ID:</strong> ${subscriptionId}</p>
      `,
    });
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  if (customerId) {
    // Reactivate tools subscription on renewal if needed
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id, tools_subscription_status")
      .eq("stripe_customer_id", customerId)
      .single();

    if (profile && profile.tools_subscription_status !== "active") {
      await supabase
        .from("user_profiles")
        .update({ tools_subscription_status: "active" })
        .eq("id", profile.id);
    }
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Deactivate profissional if applicable
  await supabase
    .from("profissionais")
    .update({ status: "cancelled" })
    .eq("stripe_customer_id", customerId);

  // Deactivate tools subscription if applicable
  await supabase
    .from("user_profiles")
    .update({ tools_subscription_status: "cancelled" })
    .eq("stripe_customer_id", customerId);
}
