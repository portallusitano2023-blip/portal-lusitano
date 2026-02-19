import { resend } from "@/lib/resend";
import { CONTACT_EMAIL } from "@/lib/constants";
import { escapeHtml } from "@/lib/sanitize";
import Stripe from "stripe";
import { registerPayment, linkPaymentToSubmission } from "./utils";
import { logger } from "@/lib/logger";

export async function handleInstagramAd(
  session: Stripe.Checkout.Session,
  metadata: Stripe.Metadata
): Promise<void> {
  const customerEmail = session.customer_details?.email;
  if (!customerEmail) {
    logger.error("handleInstagramAd: missing customer email", { sessionId: session.id });
    throw new Error("Stripe session missing customer email");
  }
  // Registar pagamento (com NOVOS campos)
  const { data: payment } = await registerPayment(
    session,
    session.payment_intent as string,
    "instagram",
    {
      package: metadata.package,
      nome: metadata.nome,
      empresa: metadata.empresa,
    },
    `Instagram - ${metadata.package}`
  );

  // Ligar pagamento ao contacto
  if (metadata.contact_submission_id && payment) {
    await linkPaymentToSubmission(metadata.contact_submission_id, payment.id);
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
      <p><strong>Valor:</strong> €${((session.amount_total ?? 0) / 100).toFixed(2)}</p>
      <hr>
      <p><strong>PRÓXIMO PASSO:</strong> Cliente deve fazer upload dos materiais em:</p>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/instagram/upload/${session.id}">${process.env.NEXT_PUBLIC_BASE_URL}/instagram/upload/${session.id}</a></p>
    `,
  });

  // Email de confirmação ao cliente
  await resend.emails.send({
    from: "Portal Lusitano <instagram@portal-lusitano.pt>",
    to: customerEmail,
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
            <p style="margin: 5px 0; color: #666;"><strong>Valor:</strong> €${((session.amount_total ?? 0) / 100).toFixed(2)}</p>
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
