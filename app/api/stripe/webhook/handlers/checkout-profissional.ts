import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { resend, getProfissionalConfirmEmail } from "@/lib/resend";
import { CONTACT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { escapeHtml } from "@/lib/sanitize";
import Stripe from "stripe";
import { registerPayment, linkPaymentToSubmission } from "./utils";

export async function handleProfissional(
  session: Stripe.Checkout.Session,
  metadata: Stripe.Metadata
): Promise<void> {
  const customerEmail = session.customer_details?.email;
  if (!customerEmail) {
    logger.error("handleProfissional: missing customer email", { sessionId: session.id });
    throw new Error("Stripe session missing customer email");
  }

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
      email: customerEmail,
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
  const { data: payment } = await registerPayment(
    session,
    session.subscription as string,
    "profissional",
    {
      nome: metadata.nome,
      categoria: metadata.categoria,
      subscription_id: session.subscription as string,
      customer_id: session.customer as string,
    },
    `Profissional: ${metadata.nome} (€6/mês)`
  );

  // Ligar pagamento ao contacto
  if (submissionId && payment) {
    await linkPaymentToSubmission(submissionId, payment.id);
  }

  // Email ao profissional - perfil em análise
  await resend.emails.send({
    from: "Portal Lusitano <profissionais@portal-lusitano.pt>",
    to: customerEmail,
    subject: "Registo recebido — Perfil em análise",
    html: getProfissionalConfirmEmail(metadata.nome || "", metadata.categoria || "", customerEmail),
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
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://portal-lusitano.pt"}/admin">Ir para Admin Panel para aprovar</a></p>
    `,
  });
}
