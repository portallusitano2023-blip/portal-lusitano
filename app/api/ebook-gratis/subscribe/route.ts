import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import { supabase } from "@/lib/supabase";

// Rate limiting: simple in-memory store (use Redis in production for multiple instances)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// RFC 5322 compliant email validation (simplified but robust)
function isValidEmail(email: string): boolean {
  // Max length per RFC 5321
  if (email.length > 254) return false;

  // More comprehensive regex that catches common issues
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) return false;

  // Check local part length (max 64 chars)
  const [localPart, domain] = email.split("@");
  if (localPart.length > 64) return false;

  // Check for valid TLD (at least 2 chars)
  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) return false;

  // Block common disposable email domains
  const disposableDomains = ["tempmail.com", "throwaway.com", "mailinator.com", "guerrillamail.com", "10minutemail.com"];
  if (disposableDomains.includes(domain.toLowerCase())) return false;

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Muitos pedidos. Aguarda um momento antes de tentar novamente." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, nome } = body;

    // Validate inputs
    if (!email || !nome) {
      return NextResponse.json(
        { error: "Email e nome são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate input lengths (security)
    if (nome.length > 100 || email.length > 255) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Validate email format with improved validation
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { error: "Por favor, insere um email válido" },
        { status: 400 }
      );
    }

    // Get metadata from request (ip already defined above for rate limiting)
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";

    // Parse UTM params from referer
    let utmSource = null, utmMedium = null, utmCampaign = null;
    try {
      const refUrl = new URL(referer);
      utmSource = refUrl.searchParams.get("utm_source");
      utmMedium = refUrl.searchParams.get("utm_medium");
      utmCampaign = refUrl.searchParams.get("utm_campaign");
    } catch {
      // Referer not a valid URL, ignore
    }

    // Save lead to Supabase
    const { error: dbError } = await supabase.from("leads").upsert(
      {
        email: email.toLowerCase().trim(),
        name: nome.trim(),
        source: "free-ebook",
        sequence_step: 0,
        status: "active",
        ip_address: ip,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      },
      { onConflict: "email" }
    );

    if (dbError) {
      console.error("Failed to save lead:", dbError);
      // Continue anyway - don't block email send if DB fails
    }

    // Send email with ebook download link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const emailResult = await sendEmail({
      to: email,
      subject: "🎁 O Teu Ebook Gratuito: Introdução ao Cavalo Lusitano",
      html: getEbookDownloadEmail(nome, email, baseUrl),
      template: "ebook-free-download",
    });

    if (!emailResult.success) {
      console.error("Failed to send ebook email:", emailResult.error);
      return NextResponse.json(
        { error: "Erro ao enviar email. Tenta novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email enviado com sucesso!",
    });
  } catch (error) {
    console.error("Error processing ebook subscription:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Email template for free ebook download
function getEbookDownloadEmail(name: string, email: string, baseUrl: string) {
  const safeName = escapeHtml(name);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
    }
    .header {
      background: linear-gradient(135deg, #C5A059 0%, #8B6914 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
      background: white;
    }
    .download-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #C5A059;
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background: #C5A059;
      color: white !important;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
      font-size: 16px;
    }
    .button:hover {
      background: #8B6914;
    }
    .ebook-preview {
      background: #f9f9f9;
      border-left: 4px solid #C5A059;
      padding: 20px;
      margin: 20px 0;
    }
    .feature-list {
      list-style: none;
      padding: 0;
    }
    .feature-list li {
      padding: 10px 0;
      padding-left: 30px;
      position: relative;
    }
    .feature-list li:before {
      content: "✅";
      position: absolute;
      left: 0;
    }
    .bonus-box {
      background: #fef3c7;
      border: 2px dashed #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .footer {
      background: #1a1a1a;
      color: #999;
      padding: 30px;
      text-align: center;
      font-size: 13px;
    }
    .footer a {
      color: #C5A059;
      text-decoration: none;
    }
    .divider {
      border: 0;
      height: 1px;
      background: #e5e5e5;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🐴 O Teu Ebook Gratuito!</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">Introdução ao Cavalo Lusitano</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p style="font-size: 18px;">Olá <strong>${safeName}</strong>,</p>

      <p>Bem-vindo à família Portal Lusitano! 🎉</p>

      <p>Estamos muito felizes por te receber. O teu ebook gratuito está pronto para download!</p>

      <!-- Download Box -->
      <div class="download-box">
        <h2 style="margin-top: 0; color: #1a1a1a;">📚 Introdução ao Cavalo Lusitano</h2>
        <p style="color: #666; margin: 10px 0;">30 páginas de conhecimento essencial em PDF de alta qualidade</p>

        <a href="${baseUrl}/ebook-gratis/download" class="button">
          📥 Descarregar Ebook Agora
        </a>

        <p style="font-size: 13px; color: #666; margin: 20px 0 0 0;">
          Também podes aceder ao ebook a qualquer momento em:<br>
          <a href="${baseUrl}/ebook-gratis/download" style="color: #C5A059; text-decoration: none;">
            ${baseUrl}/ebook-gratis/download
          </a>
        </p>
      </div>

      <!-- What's Inside -->
      <h3>📖 O Que Vais Encontrar:</h3>
      <div class="ebook-preview">
        <ul class="feature-list">
          <li><strong>Capítulo 1:</strong> O Que É o Cavalo Lusitano? (8 páginas)</li>
          <li><strong>Capítulo 2:</strong> História em 10 Minutos (8 páginas)</li>
          <li><strong>Capítulo 3:</strong> Características Únicas (10 páginas)</li>
          <li><strong>Capítulo 4:</strong> Próximos Passos (4 páginas)</li>
        </ul>
      </div>

      <hr class="divider">

      <!-- Bonus -->
      <div class="bonus-box">
        <h3 style="margin-top: 0;">🎁 Bónus Incluídos:</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Newsletter Semanal:</strong> Dicas e artigos exclusivos no teu email</li>
          <li><strong>Desconto PRO:</strong> 20% OFF com o código <strong>LUSITANO20</strong></li>
          <li><strong>Acesso à Comunidade:</strong> Grupo privado de aficionados (link em breve)</li>
        </ul>
      </div>

      <!-- Next Steps -->
      <h3>🚀 Próximos Passos:</h3>
      <ol>
        <li><strong>Descarrega o ebook</strong> usando o botão acima</li>
        <li><strong>Lê com calma</strong> (leva apenas 20 minutos)</li>
        <li><strong>Aplica o conhecimento</strong> na tua jornada com Lusitanos</li>
        <li><strong>Explora a biblioteca PRO</strong> se quiseres aprofundar (50+ ebooks)</li>
      </ol>

      <hr class="divider">

      <!-- Upgrade CTA -->
      <h3>💎 Queres Mais?</h3>
      <p>Este ebook gratuito é apenas o início! A nossa <strong>Biblioteca PRO</strong> contém:</p>
      <ul class="feature-list" style="margin-bottom: 20px;">
        <li>50+ Ebooks completos (criação, linhagens, treino, saúde)</li>
        <li>Templates profissionais (contratos, fichas, planners)</li>
        <li>Consultoria expert por email</li>
        <li>Comunidade exclusiva de criadores</li>
      </ul>

      <p style="text-align: center;">
        <a href="${baseUrl}/pro" class="button">
          👑 Explorar Portal Lusitano PRO
        </a>
      </p>

      <p style="text-align: center; color: #666; font-size: 14px;">
        Usa o código <strong style="color: #C5A059;">LUSITANO20</strong> para 20% de desconto na primeira subscrição
      </p>

      <hr class="divider">

      <!-- Support -->
      <p><strong>💬 Precisas de Ajuda?</strong></p>
      <p>Responde a este email ou contacta-nos em <a href="mailto:suporte@portal-lusitano.pt" style="color: #C5A059;">suporte@portal-lusitano.pt</a></p>

      <p style="margin-top: 30px;">
        Bem-vindo à família! 🐴<br>
        <em>Equipa Portal Lusitano</em>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>Portal Lusitano</strong></p>
      <p style="margin: 0 0 10px 0;">O Mundo do Cavalo Lusitano</p>
      <p style="margin: 0 0 10px 0;">
        <a href="${baseUrl}">www.portal-lusitano.pt</a>
      </p>
      <p style="margin: 20px 0 0 0; font-size: 11px; color: #666;">
        Recebeste este email porque te inscreveste para descarregar o ebook gratuito.<br>
        Podes <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #999;">cancelar a subscrição</a> a qualquer momento.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
