import { supabaseAdmin as supabase } from "@/lib/supabase";
import { resend, getCavaloAnuncioConfirmEmail } from "@/lib/resend";
import { CONTACT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { escapeHtml } from "@/lib/sanitize";
import Stripe from "stripe";
import { registerPayment, linkPaymentToSubmission } from "./utils";

export async function handleCavaloAnuncio(
  session: Stripe.Checkout.Session,
  metadata: Stripe.Metadata
): Promise<void> {
  const customerEmail = session.customer_details?.email;
  if (!customerEmail) {
    logger.error("handleCavaloAnuncio: missing customer email", { sessionId: session.id });
    throw new Error("Stripe session missing customer email");
  }

  // Buscar dados da BD
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

  if (!formData) {
    logger.error("Form data not found for session:", session.id);
    throw new Error("Form data not found - unable to process order");
  }

  // Gerar slug único a partir do nome do cavalo
  const baseSlug = String(formData.nomeCavalo || "cavalo")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  // Extrair URLs das imagens
  const imageUrls = Array.isArray(formData.imageUrls) ? (formData.imageUrls as string[]) : [];
  const fotoPrincipal = imageUrls[0] || null;

  // Insert cavalo em cavalos_venda
  const { data, error } = await supabase
    .from("cavalos_venda")
    .insert({
      nome: formData.nomeCavalo,
      slug,
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
      foto_principal: fotoPrincipal,
      fotos: imageUrls,
      status: "pending", // Pending admin approval
    })
    .select()
    .single();

  if (error) {
    logger.error("Error inserting cavalo:", error);
    throw new Error(`Failed to insert cavalo: ${error.message}`);
  }

  // Registar pagamento (com NOVOS campos)
  const { data: payment } = await registerPayment(
    session,
    session.payment_intent as string,
    "cavalo_anuncio",
    {
      package: "anuncio",
      destaque: metadata.destaque === "true",
      nome_cavalo: formData.nomeCavalo,
    },
    `Anúncio: ${formData.nomeCavalo}`
  );

  // Ligar pagamento ao contacto (se existir)
  if (submissionId && payment) {
    await linkPaymentToSubmission(submissionId, payment.id, {
      cavalo_id: data.id,
    });
  }

  // Enviar email de confirmação ao vendedor
  await resend.emails.send({
    from: "Portal Lusitano <anuncios@portal-lusitano.pt>",
    to: customerEmail,
    subject: "Anúncio recebido — Portal Lusitano",
    html: getCavaloAnuncioConfirmEmail(
      String(formData.nomeCavalo),
      String(formData.preco),
      metadata.destaque === "true",
      customerEmail
    ),
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
      <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(String(formData.proprietarioTelefone))}</p>
      <p><strong>Preço:</strong> &euro;${escapeHtml(String(formData.preco))}</p>
      <p><strong>Destaque:</strong> ${metadata.destaque === "true" ? "Sim" : "Não"}</p>
      <p><strong>Pagamento:</strong> €${((session.amount_total ?? 0) / 100).toFixed(2)}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://portal-lusitano.pt"}/admin">Ir para Admin Panel</a></p>
    `,
  });
}
