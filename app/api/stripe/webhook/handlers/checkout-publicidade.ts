 
import { resend } from "@/lib/resend";
import { CONTACT_EMAIL } from "@/lib/constants";
import { escapeHtml } from "@/lib/sanitize";
import Stripe from "stripe";
import { registerPayment, linkPaymentToSubmission } from "./utils";

export async function handlePublicidade(
  session: Stripe.Checkout.Session,
  metadata: Stripe.Metadata
): Promise<void> {
  // Registar pagamento (com NOVOS campos)
  const { data: payment } = await registerPayment(
    session,
    session.payment_intent as string,
    "publicidade",
    {
      package: metadata.package,
      company: metadata.company,
      recurring: session.mode === "subscription",
    },
    `Publicidade: ${metadata.package}`
  );

  // Ligar pagamento ao contacto
  if (metadata.contact_submission_id && payment) {
    await linkPaymentToSubmission(metadata.contact_submission_id, payment.id);
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
