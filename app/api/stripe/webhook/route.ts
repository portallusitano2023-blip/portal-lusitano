/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import Stripe from "stripe";
import { CONTACT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { escapeHtml } from "@/lib/sanitize";

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
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    logger.error(`Webhook signature verification failed: ${errorMsg}`);

    // Alert admin on signature failure — may indicate replay attack or misconfiguration
    resend.emails
      .send({
        from: "Portal Lusitano <admin@portal-lusitano.pt>",
        to: CONTACT_EMAIL,
        subject: "[ALERTA SEGURANÇA] Falha de verificação Stripe Webhook",
        html: `
        <h2>⚠️ Falha de Assinatura Stripe Webhook</h2>
        <p>Uma tentativa de webhook falhou na verificação de assinatura.</p>
        <p><strong>Erro:</strong> ${errorMsg}</p>
        <p><strong>Hora:</strong> ${new Date().toISOString()}</p>
        <p>Isto pode indicar:</p>
        <ul>
          <li>Tentativa de replay attack</li>
          <li>Webhook secret incorreto</li>
          <li>Request de fonte não autorizada</li>
        </ul>
        <p>Verifique o dashboard Stripe para actividade suspeita.</p>
      `,
      })
      .catch(() => {}); // fire-and-forget, don't block the response

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
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    logger.error(
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
      logger.error("Form data not found for session:", session.id);
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
      logger.error("Error inserting cavalo:", error);
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
              O seu anúncio do cavalo <strong>${escapeHtml(String(formData.nomeCavalo))}</strong> foi recebido e está em análise.
            </p>
            <p style="color: #666; line-height: 1.6;">
              Estará visível no marketplace após verificação dos documentos (máximo 24 horas).
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Detalhes do Anúncio:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Cavalo:</strong> ${escapeHtml(String(formData.nomeCavalo))}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Preço:</strong> &euro;${escapeHtml(String(formData.preco))}</p>
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
      to: CONTACT_EMAIL,
      subject: `Novo Anúncio: ${escapeHtml(String(formData.nomeCavalo))} - Aprovação Pendente`,
      html: `
        <h2>Novo anúncio aguarda aprovação</h2>
        <p><strong>Cavalo:</strong> ${escapeHtml(String(formData.nomeCavalo))}</p>
        <p><strong>Vendedor:</strong> ${escapeHtml(String(formData.proprietarioNome))}</p>
        <p><strong>Email:</strong> ${escapeHtml(session.customer_details?.email || "")}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(String(formData.proprietarioTelefone))}</p>
        <p><strong>Preço:</strong> &euro;${escapeHtml(String(formData.preco))}</p>
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
      to: CONTACT_EMAIL,
      subject: `Nova Compra Instagram: ${escapeHtml(metadata.package || "")} - ${escapeHtml(metadata.nome || "")}`,
      html: `
        <h2>Nova compra de publicidade no Instagram</h2>
        <p><strong>Pacote:</strong> ${escapeHtml(metadata.package || "")}</p>
        <p><strong>Nome:</strong> ${escapeHtml(metadata.nome || "")}</p>
        <p><strong>Empresa:</strong> ${escapeHtml(metadata.empresa || "N/A")}</p>
        <p><strong>Email:</strong> ${escapeHtml(session.customer_details?.email || "")}</p>
        <p><strong>Instagram:</strong> ${escapeHtml(metadata.instagram || "N/A")}</p>
        <p><strong>Mensagem:</strong><br>${escapeHtml(metadata.mensagem || "")}</p>
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
      to: CONTACT_EMAIL,
      subject: `Nova Compra de Publicidade: ${escapeHtml(metadata.package || "")}`,
      html: `
        <h2>Nova compra de publicidade</h2>
        <p><strong>Pacote:</strong> ${escapeHtml(metadata.package || "")}</p>
        <p><strong>Empresa:</strong> ${escapeHtml(metadata.company || "")}</p>
        <p><strong>Email:</strong> ${escapeHtml(session.customer_details?.email || "")}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(metadata.telefone || "")}</p>
        <p><strong>Valor:</strong> €${(session.amount_total! / 100).toFixed(2)}</p>
        <p><strong>Tipo:</strong> ${session.mode === "subscription" ? "Recorrente (mensal)" : "Pagamento único"}</p>
      `,
    });
  }

  // Handle profissional
  if (metadata.type === "profissional") {
    // Buscar dados completos do formulário
    let formData: Record<string, string | boolean | number | string[]> | null = null;
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

    // Gerar slug único a partir do nome
    const baseSlug = (metadata.nome || "profissional")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const { data: profissional, error } = await supabase
      .from("profissionais")
      .insert({
        nome: metadata.nome,
        slug,
        tipo: metadata.categoria,
        especialidade: metadata.especialidade || (formData?.especialidade as string) || null,
        descricao_curta: formData?.descricao ? String(formData.descricao).substring(0, 160) : null,
        descricao_completa: (formData?.descricao as string) || null,
        cidade: metadata.cidade || (formData?.cidade as string) || null,
        distrito: metadata.distrito || (formData?.distrito as string) || null,
        telemovel: metadata.telefone || (formData?.telefone as string) || "",
        email: session.customer_details?.email!,
        website: (formData?.website as string) || null,
        instagram: (formData?.instagram as string) || null,
        facebook: (formData?.facebook as string) || null,
        linkedin: (formData?.linkedin as string) || null,
        servicos_oferecidos: formData?.servicos || "[]",
        foto_perfil_url: (formData?.fotoBase64 as string) || null,
        anos_experiencia: formData?.anosExperiencia ? Number(formData.anosExperiencia) : null,
        formacao_academica: (formData?.formacaoAcademica as string) || null,
        certificacoes: formData?.certificacoes ? JSON.stringify(formData.certificacoes) : "[]",
        linguas: formData?.idiomas || ["Português"],
        morada: (formData?.morada as string) || null,
        codigo_postal: (formData?.codigoPostal as string) || null,
        raio_deslocacao: formData?.raioServico ? Number(formData.raioServico) : null,
        aceita_deslocacoes: formData?.aceitaDeslocacoes || false,
        disponibilidade_urgencias: formData?.emergencias24h || false,
        horario_atendimento: formData?.disponibilidade
          ? JSON.stringify(formData.disponibilidade)
          : "{}",
        plano: "bronze",
        plano_valor: 6.0,
        plano_inicio: new Date().toISOString(),
        plano_ativo: true,
        plano_renovacao_automatica: true,
        modalidade: metadata.modalidade || "presencial",
        pais: metadata.pais || null,
        plano_metodo_pagamento: "stripe",
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        status: "pendente",
        destaque: false,
      })
      .select()
      .single();

    if (error) {
      logger.error("Error inserting profissional:", error);
      throw new Error(`Failed to insert profissional: ${error.message}`);
    }

    // Registar pagamento
    const { data: payment } = await supabase
      .from("payments")
      .insert({
        stripe_payment_intent_id: session.subscription as string,
        stripe_session_id: session.id,
        email: session.customer_details?.email!,
        amount: session.amount_total!,
        currency: session.currency!,
        status: "succeeded",
        product_type: "profissional",
        product_metadata: {
          nome: metadata.nome,
          categoria: metadata.categoria,
          subscription_id: session.subscription as string,
          customer_id: session.customer as string,
        },
        description: `Profissional: ${metadata.nome} (€6/mês)`,
      })
      .select()
      .single();

    // Ligar pagamento ao contacto
    if (submissionId && payment) {
      await supabase
        .from("contact_submissions")
        .update({ payment_id: payment.id })
        .eq("id", submissionId);
    }

    // Email ao profissional - perfil em análise
    await resend.emails.send({
      from: "Portal Lusitano <profissionais@portal-lusitano.pt>",
      to: session.customer_details?.email!,
      subject: "Registo Recebido - Perfil em Análise",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C5A059 0%, #8B7042 100%); padding: 30px; text-align: center;">
            <h1 style="color: #000; margin: 0;">Portal Lusitano</h1>
          </div>
          <div style="padding: 40px 30px; background: #fff;">
            <h2 style="color: #333;">Pagamento Confirmado!</h2>
            <p style="color: #666; line-height: 1.6;">
              Obrigado, <strong>${escapeHtml(metadata.nome || "")}</strong>! O seu pagamento foi processado com sucesso.
            </p>
            <p style="color: #666; line-height: 1.6;">
              O seu perfil profissional está agora <strong>em análise</strong> e será aprovado pela nossa equipa nas próximas 24 horas.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Detalhes:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Categoria:</strong> ${escapeHtml(metadata.categoria || "")}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Subscrição:</strong> €6/mês</p>
              <p style="margin: 5px 0; color: #666;"><strong>Estado:</strong> Em análise</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Receberá um email assim que o seu perfil for aprovado e estiver visível no directório.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://portal-lusitano.pt/profissionais" style="background: #C5A059; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Ver Directório
              </a>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>Portal Lusitano - Rede Profissional Equestre</p>
          </div>
        </div>
      `,
    });

    // Notificar admin - aprovação pendente
    await resend.emails.send({
      from: "Portal Lusitano <admin@portal-lusitano.pt>",
      to: CONTACT_EMAIL,
      subject: `Novo Profissional: ${escapeHtml(metadata.nome || "")} - Aprovação Pendente`,
      html: `
        <h2>Novo profissional aguarda aprovação</h2>
        <p><strong>Nome:</strong> ${escapeHtml(metadata.nome || "")}</p>
        <p><strong>Categoria:</strong> ${escapeHtml(metadata.categoria || "")}</p>
        <p><strong>Email:</strong> ${escapeHtml(session.customer_details?.email || "")}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(metadata.telefone || "N/A")}</p>
        <p><strong>Distrito:</strong> ${escapeHtml(metadata.distrito || "N/A")}</p>
        <p><strong>Modalidade:</strong> ${escapeHtml(metadata.modalidade || "presencial")}</p>
        <p><strong>Especialidade:</strong> ${escapeHtml(metadata.especialidade || "N/A")}</p>
        <p><strong>Pagamento:</strong> €6/mês (subscrição activa)</p>
        <hr>
        <p><strong>ID:</strong> ${profissional?.id || "N/A"}</p>
        <p><a href="https://portal-lusitano.pt/admin">Ir para Admin Panel para aprovar</a></p>
      `,
    });
  }

  // Handle tools subscription
  if (metadata.type === "tools_subscription") {
    const userId = metadata.user_id;
    const subscriptionId = session.subscription as string;

    if (!userId) {
      logger.error("tools_subscription: missing user_id in metadata");
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
      logger.error("Error updating tools subscription:", error);
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
      to: CONTACT_EMAIL,
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
    .update({ status: "cancelled", plano_ativo: false })
    .eq("stripe_customer_id", customerId);

  // Deactivate tools subscription if applicable
  await supabase
    .from("user_profiles")
    .update({ tools_subscription_status: "cancelled" })
    .eq("stripe_customer_id", customerId);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  logger.error(`Payment failed for customer ${customerId}, invoice ${invoice.id}`);

  // Notify admin
  await resend.emails.send({
    from: "Portal Lusitano <admin@portal-lusitano.pt>",
    to: CONTACT_EMAIL,
    subject: `Pagamento Falhado - ${escapeHtml(invoice.customer_email || customerId)}`,
    html: `
      <h2>Pagamento falhado</h2>
      <p><strong>Cliente:</strong> ${escapeHtml(invoice.customer_email || customerId)}</p>
      <p><strong>Valor:</strong> &euro;${((invoice.amount_due || 0) / 100).toFixed(2)}</p>
      <p><strong>Invoice ID:</strong> ${escapeHtml(invoice.id)}</p>
      <p>O Stripe tentará novamente automaticamente.</p>
    `,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  // Update profissional status based on subscription status
  if (status === "past_due" || status === "unpaid") {
    await supabase
      .from("profissionais")
      .update({ plano_ativo: false })
      .eq("stripe_customer_id", customerId);

    await supabase
      .from("user_profiles")
      .update({ tools_subscription_status: status })
      .eq("stripe_customer_id", customerId);
  } else if (status === "active") {
    await supabase
      .from("profissionais")
      .update({ plano_ativo: true })
      .eq("stripe_customer_id", customerId);

    await supabase
      .from("user_profiles")
      .update({ tools_subscription_status: "active" })
      .eq("stripe_customer_id", customerId);
  }
}
