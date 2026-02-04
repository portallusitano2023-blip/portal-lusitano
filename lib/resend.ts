import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: "Portal Lusitano <noreply@portal-lusitano.pt>",
  replyTo: "suporte@portal-lusitano.pt",
};

// Email types
export const EMAIL_TEMPLATES = {
  WELCOME: "welcome",
  NEWSLETTER_WEEKLY: "newsletter-weekly",
  EBOOK_DOWNLOAD: "ebook-download",
} as const;

// Helper function to send emails
export async function sendEmail({
  to,
  subject,
  html,
  template,
}: {
  to: string | string[];
  subject: string;
  html: string;
  template?: string;
}) {
  try {
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: EMAIL_CONFIG.replyTo,
      tags: template ? [{ name: "template", value: template }] : undefined,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

// Email workflows
export const EmailWorkflows = {
  async sendEbookWelcome(email: string, name: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await sendEmail({
      to: email,
      subject: "O teu Ebook Gratuito - Portal Lusitano",
      html: getEbookWelcomeEmail(name, baseUrl),
      template: EMAIL_TEMPLATES.EBOOK_DOWNLOAD,
    });
  },
};

// Email templates
function getEbookWelcomeEmail(name: string, baseUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #C5A059 0%, #8B6914 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; }
    .button { display: inline-block; background: #C5A059; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo ao Portal Lusitano!</h1>
      <p>Obrigado por descarregares o nosso ebook, ${name}!</p>
    </div>

    <div class="content">
      <h2>O Teu Ebook Está Pronto</h2>
      <p>Podes aceder ao teu ebook gratuito "Introdução ao Cavalo Lusitano" a qualquer momento.</p>

      <a href="${baseUrl}/ebook-gratis/download" class="button">
        Ver Ebook
      </a>

      <h3>O Que Vais Aprender:</h3>
      <ul>
        <li>A história e origem do Cavalo Lusitano</li>
        <li>Características únicas da raça</li>
        <li>Temperamento e aptidões</li>
        <li>Como identificar um Lusitano puro</li>
      </ul>

      <h3>Explora Mais no Portal:</h3>
      <ul>
        <li><a href="${baseUrl}/cavalos-venda">Cavalos à Venda</a></li>
        <li><a href="${baseUrl}/eventos">Eventos</a></li>
        <li><a href="${baseUrl}/directorio">Diretório de Coudelarias</a></li>
        <li><a href="${baseUrl}/linhagens">Linhagens</a></li>
      </ul>

      <p><strong>Precisas de ajuda?</strong><br>
      Responde a este email ou contacta-nos em suporte@portal-lusitano.pt</p>

      <p>Abraço,<br>
      <em>Equipa Portal Lusitano</em></p>
    </div>

    <div class="footer">
      <p>Portal Lusitano - O Mundo do Cavalo Lusitano</p>
      <p>www.portal-lusitano.pt</p>
    </div>
  </div>
</body>
</html>
  `;
}
