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
  SUBSCRIPTION_CONFIRMED: "subscription-confirmed",
  PAYMENT_SUCCESS: "payment-success",
  PAYMENT_FAILED: "payment-failed",
  SUBSCRIPTION_RENEWED: "subscription-renewed",
  SUBSCRIPTION_CANCELLED: "subscription-cancelled",
  CONSULTATION_RECEIVED: "consultation-received",
  CONSULTATION_ANSWERED: "consultation-answered",
  NEWSLETTER_WEEKLY: "newsletter-weekly",
  UPGRADE_OFFER: "upgrade-offer",
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

// Automated email workflows
export const EmailWorkflows = {
  // Welcome series (10 emails over 30 days)
  async sendWelcomeSeries(email: string, name: string, plan: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Email 1: Immediate welcome
    await sendEmail({
      to: email,
      subject: "🐴 Bem-vindo ao Portal Lusitano PRO!",
      html: getWelcomeEmail(name, plan, baseUrl),
      template: EMAIL_TEMPLATES.WELCOME,
    });

    // Schedule remaining emails (in production, use job queue like Bull/BullMQ)
    // For now, we'll create the templates
  },

  async sendPaymentSuccess(
    email: string,
    name: string,
    plan: string,
    amount: number
  ) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await sendEmail({
      to: email,
      subject: "✅ Pagamento Confirmado - Portal Lusitano PRO",
      html: getPaymentSuccessEmail(name, plan, amount, baseUrl),
      template: EMAIL_TEMPLATES.PAYMENT_SUCCESS,
    });
  },

  async sendPaymentFailed(email: string, name: string) {
    await sendEmail({
      to: email,
      subject: "⚠️ Problema com o Pagamento - Portal Lusitano",
      html: getPaymentFailedEmail(name),
      template: EMAIL_TEMPLATES.PAYMENT_FAILED,
    });
  },

  async sendSubscriptionCancelled(email: string, name: string, endDate: string) {
    await sendEmail({
      to: email,
      subject: "Subscrição Cancelada - Portal Lusitano",
      html: getSubscriptionCancelledEmail(name, endDate),
      template: EMAIL_TEMPLATES.SUBSCRIPTION_CANCELLED,
    });
  },

  async sendConsultationReceived(
    email: string,
    name: string,
    ticketId: string
  ) {
    await sendEmail({
      to: email,
      subject: "Pedido de Consultoria Recebido #" + ticketId,
      html: getConsultationReceivedEmail(name, ticketId),
      template: EMAIL_TEMPLATES.CONSULTATION_RECEIVED,
    });
  },

  async sendConsultationAnswered(
    email: string,
    name: string,
    ticketId: string
  ) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await sendEmail({
      to: email,
      subject: "✅ Resposta à Consultoria #" + ticketId,
      html: getConsultationAnsweredEmail(name, ticketId, baseUrl),
      template: EMAIL_TEMPLATES.CONSULTATION_ANSWERED,
    });
  },
};

// Email templates
function getWelcomeEmail(name: string, plan: string, baseUrl: string) {
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
    .ebook-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .ebook-card { background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #C5A059; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐴 Bem-vindo ao Portal Lusitano PRO!</h1>
      <p>Estamos entusiasmados por te receber, ${name}!</p>
    </div>

    <div class="content">
      <h2>Plano ${plan} Ativado ✅</h2>
      <p>A tua subscrição está ativa e tens acesso imediato a todo o conteúdo premium.</p>

      <h3>📚 Os Teus Primeiros Passos:</h3>

      <div class="ebook-grid">
        <div class="ebook-card">
          <strong>1. Guia Completo</strong>
          <p style="font-size: 13px; color: #666;">Começa pelo essencial sobre Cavalos Lusitanos</p>
        </div>
        <div class="ebook-card">
          <strong>2. Linhagens</strong>
          <p style="font-size: 13px; color: #666;">Entende as principais famílias</p>
        </div>
        <div class="ebook-card">
          <strong>3. Templates</strong>
          <p style="font-size: 13px; color: #666;">Usa os contratos e fichas prontas</p>
        </div>
        <div class="ebook-card">
          <strong>4. Comunidade</strong>
          <p style="font-size: 13px; color: #666;">Junta-te ao Discord exclusivo</p>
        </div>
      </div>

      <a href="${baseUrl}/pro/biblioteca" class="button">
        Aceder à Biblioteca →
      </a>

      <h3>🎁 O Que Tens de Novo:</h3>
      <ul>
        <li>✅ ${plan === "Aficionado" ? "5" : plan === "Criador" ? "50+" : "Todos os"} Ebooks disponíveis</li>
        <li>✅ ${plan === "Elite" ? "Consultoria ilimitada" : plan === "Criador" ? "2 consultorias/mês" : "Templates básicos"}</li>
        <li>✅ Newsletter semanal exclusiva</li>
        <li>✅ Comunidade privada de membros</li>
      </ul>

      <p><strong>💬 Precisas de ajuda?</strong><br>
      Responde a este email ou contacta-nos em suporte@portal-lusitano.pt</p>

      <p>Bem-vindo à família! 🐴<br>
      <em>Equipa Portal Lusitano</em></p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO - O Mundo do Cavalo Lusitano</p>
      <p>www.portal-lusitano.pt</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getPaymentSuccessEmail(
  name: string,
  plan: string,
  amount: number,
  baseUrl: string
) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #22c55e; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; }
    .invoice { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: #C5A059; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Pagamento Confirmado!</h1>
    </div>

    <div class="content">
      <p>Olá ${name},</p>
      <p>O teu pagamento foi processado com sucesso!</p>

      <div class="invoice">
        <h3>📄 Detalhes do Pagamento</h3>
        <table style="width: 100%;">
          <tr>
            <td><strong>Plano:</strong></td>
            <td style="text-align: right;">${plan}</td>
          </tr>
          <tr>
            <td><strong>Valor:</strong></td>
            <td style="text-align: right;">€${amount}</td>
          </tr>
          <tr>
            <td><strong>Data:</strong></td>
            <td style="text-align: right;">${new Date().toLocaleDateString("pt-PT")}</td>
          </tr>
        </table>
      </div>

      <p>O teu acesso ao Portal Lusitano PRO está ativo!</p>

      <a href="${baseUrl}/pro/dashboard" class="button">
        Aceder ao Dashboard →
      </a>

      <p><small>Podes descarregar a fatura na tua área de membro.</small></p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getPaymentFailedEmail(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #C5A059; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Problema com o Pagamento</h1>
    </div>

    <div class="content">
      <p>Olá ${name},</p>

      <div class="warning">
        <strong>⚠️ O pagamento da tua subscrição não foi processado.</strong>
        <p>Isto pode acontecer por:</p>
        <ul>
          <li>Cartão expirado</li>
          <li>Fundos insuficientes</li>
          <li>Problema com o banco</li>
        </ul>
      </div>

      <p><strong>O que fazer agora?</strong></p>
      <p>Por favor, atualiza os teus dados de pagamento para manteres o acesso ao Portal Lusitano PRO.</p>

      <p>⏰ Tens 3 dias para atualizar o pagamento antes do acesso ser suspenso.</p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/pro/settings/billing" class="button">
        Atualizar Método de Pagamento →
      </a>

      <p>Precisas de ajuda? Contacta-nos em suporte@portal-lusitano.pt</p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getSubscriptionCancelledEmail(name: string, endDate: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #64748b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; }
    .info { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #C5A059; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Subscrição Cancelada</h1>
    </div>

    <div class="content">
      <p>Olá ${name},</p>
      <p>Confirmamos o cancelamento da tua subscrição do Portal Lusitano PRO.</p>

      <div class="info">
        <strong>ℹ️ Acesso Mantido até ${endDate}</strong>
        <p>Podes continuar a aceder a todo o conteúdo até ao fim do período já pago.</p>
      </div>

      <p><strong>Sentimos ver-te partir! 😢</strong></p>
      <p>Podias partilhar connosco o motivo? A tua opinião ajuda-nos a melhorar.</p>

      <p><strong>Mudaste de ideias?</strong><br>
      Podes reativar a subscrição a qualquer momento!</p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/pro" class="button">
        Reativar Subscrição →
      </a>

      <p>Obrigado por teres feito parte da nossa comunidade! 🐴</p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getConsultationReceivedEmail(name: string, ticketId: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #C5A059; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; }
    .ticket { background: white; padding: 20px; border-radius: 8px; border: 2px solid #C5A059; margin: 20px 0; text-align: center; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎫 Pedido de Consultoria Recebido</h1>
    </div>

    <div class="content">
      <p>Olá ${name},</p>
      <p>Recebemos o teu pedido de consultoria!</p>

      <div class="ticket">
        <h2>Ticket #${ticketId}</h2>
        <p>Estado: <strong style="color: #f59e0b;">⏳ Em Análise</strong></p>
      </div>

      <p><strong>⏰ Tempo de Resposta:</strong><br>
      Vamos responder em até 24-48 horas úteis.</p>

      <p><strong>📧 Notificação Automática:</strong><br>
      Receberás um email assim que a resposta estiver pronta.</p>

      <p>Obrigado pela tua paciência! 🐴</p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getConsultationAnsweredEmail(
  name: string,
  ticketId: string,
  baseUrl: string
) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #22c55e; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; }
    .ticket { background: white; padding: 20px; border-radius: 8px; border: 2px solid #22c55e; margin: 20px 0; text-align: center; }
    .button { display: inline-block; background: #C5A059; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Consultoria Respondida!</h1>
    </div>

    <div class="content">
      <p>Olá ${name},</p>
      <p>A tua consultoria foi analisada e respondida!</p>

      <div class="ticket">
        <h2>Ticket #${ticketId}</h2>
        <p>Estado: <strong style="color: #22c55e;">✅ Resolvido</strong></p>
      </div>

      <p>A resposta detalhada está disponível na tua área de membro.</p>

      <a href="${baseUrl}/pro/consultorias/${ticketId}" class="button">
        Ver Resposta Completa →
      </a>

      <p><strong>📄 Documento PDF anexado</strong><br>
      Inclui análise detalhada e recomendações personalizadas.</p>

      <p>Tens mais dúvidas? Podes submeter nova consultoria a qualquer momento!</p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO</p>
    </div>
  </div>
</body>
</html>
  `;
}
