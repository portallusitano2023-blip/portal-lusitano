import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/resend";
import { logger } from "@/lib/logger";
import { apiLimiter } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/sanitize";
import { createTranslator } from "@/lib/tr";

const TOOL_NAMES_I18N: Record<string, Record<string, string>> = {
  calculadora: { pt: "Calculadora de Valor", en: "Value Calculator", es: "Calculadora de Valor" },
  comparador: { pt: "Comparador de Cavalos", en: "Horse Comparator", es: "Comparador de Caballos" },
  compatibilidade: { pt: "Verificador de Compatibilidade", en: "Compatibility Checker", es: "Verificador de Compatibilidad" },
  perfil: { pt: "Análise de Perfil", en: "Profile Analysis", es: "Análisis de Perfil" },
};

function getToolName(toolKey: string, language: string): string {
  const names = TOOL_NAMES_I18N[toolKey];
  if (!names) return toolKey;
  return names[language] ?? names["pt"] ?? toolKey;
}

const TOOL_LINKS: Record<string, string> = {
  calculadora: "/calculadora-valor",
  comparador: "/comparador-cavalos",
  compatibilidade: "/verificador-compatibilidade",
  perfil: "/analise-perfil",
};

// POST /api/tools/send-results
// Send tool results via email — exclusive to users with active PRO subscription
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await apiLimiter.check(5, ip);
    } catch {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    // Authentication required
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user?.email) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    // Check PRO subscription
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("tools_subscription_status")
      .eq("id", user.id)
      .single();

    if (profile?.tools_subscription_status !== "active") {
      return NextResponse.json(
        { error: "PRO plan exclusive feature." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { toolName, resultSummary, language: reqLanguage } = body as {
      toolName: string;
      resultSummary: Record<string, unknown>;
      language?: string;
    };

    const language = (reqLanguage === "en" || reqLanguage === "es") ? reqLanguage : "pt";
    const tr = createTranslator(language);

    if (!toolName || !resultSummary) {
      return NextResponse.json({ error: tr("Dados incompletos.", "Incomplete data.", "Datos incompletos.") }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://portal-lusitano.pt";
    const html = buildResultEmail(toolName, resultSummary, baseUrl, language, tr);

    const displayName = getToolName(toolName, language);
    const result = await sendEmail({
      to: user.email,
      subject: `${tr("Resultados", "Results", "Resultados")}: ${escapeHtml(displayName)} — Portal Lusitano`,
      html,
      template: "tool-results",
    });

    if (!result.success) {
      logger.error("Error sending results email:", result.error);
      return NextResponse.json({ error: tr("Erro ao enviar email.", "Error sending email.", "Error al enviar email.") }, { status: 500 });
    }

    return NextResponse.json({ success: true, sentTo: user.email });
  } catch (error) {
    logger.error("Error in /api/tools/send-results:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

function buildResultEmail(
  toolName: string,
  summary: Record<string, unknown>,
  baseUrl: string,
  language: string,
  tr: ReturnType<typeof createTranslator>
): string {
  const displayName = escapeHtml(getToolName(toolName, language));
  const toolPath = TOOL_LINKS[toolName] || "/ferramentas";
  const toolUrl = escapeHtml(`${baseUrl}${toolPath}`);

  // Generate summary rows from the result object
  const summaryLines = Object.entries(summary)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .slice(0, 8) // Max 8 fields in the email
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:6px 12px;color:#999;font-size:13px;border-bottom:1px solid #222;">${escapeHtml(k)}</td>
          <td style="padding:6px 12px;color:#fff;font-size:13px;font-weight:600;border-bottom:1px solid #222;">${escapeHtml(String(v))}</td>
        </tr>`
    )
    .join("");

  const emptyFallback = tr(
    "Ver resultados completos no portal",
    "View full results on the portal",
    "Ver resultados completos en el portal"
  );

  const headerSubtitle = tr(
    `Os seus resultados da ${displayName}`,
    `Your ${displayName} results`,
    `Sus resultados de ${displayName}`
  );

  const ctaLabel = tr(
    "Ver análise completa",
    "View full analysis",
    "Ver análisis completo"
  );

  const disclaimer = tr(
    "Os resultados apresentados são estimativas baseadas nos dados fornecidos e na metodologia do Portal Lusitano. Não substituem avaliações profissionais de médicos veterinários ou especialistas equestres.",
    "The results presented are estimates based on the data provided and the Portal Lusitano methodology. They do not replace professional evaluations by veterinarians or equestrian specialists.",
    "Los resultados presentados son estimaciones basadas en los datos proporcionados y la metodología de Portal Lusitano. No sustituyen evaluaciones profesionales de veterinarios o especialistas ecuestres."
  );

  const toolsLabel = tr("Ferramentas", "Tools", "Herramientas");

  const footerNotice = tr(
    "Recebeu este email porque tem uma subscrição PRO activa.",
    "You received this email because you have an active PRO subscription.",
    "Recibió este email porque tiene una suscripción PRO activa."
  );

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#C5A059 0%,#8B6914 100%);padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="margin:0;color:#000;font-size:22px;font-weight:700;">Portal Lusitano</h1>
      <p style="margin:8px 0 0;color:#000;font-size:14px;opacity:0.75;">${escapeHtml(headerSubtitle)}</p>
    </div>

    <!-- Body -->
    <div style="background:#111;padding:28px 24px;border:1px solid #222;border-top:none;">
      <h2 style="margin:0 0 20px;color:#C5A059;font-size:18px;">${displayName}</h2>

      <!-- Summary table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tbody>
          ${summaryLines || `<tr><td colspan="2" style="padding:12px;color:#999;text-align:center;">${escapeHtml(emptyFallback)}</td></tr>`}
        </tbody>
      </table>

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="${toolUrl}" style="display:inline-block;background:#C5A059;color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
          ${escapeHtml(ctaLabel)} &rarr;
        </a>
      </div>

      <p style="color:#666;font-size:12px;margin:16px 0 0;line-height:1.6;">
        ${escapeHtml(disclaimer)}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#0a0a0a;padding:20px 24px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #222;border-top:none;">
      <p style="color:#555;font-size:12px;margin:0;">
        Portal Lusitano PRO — <a href="${baseUrl}/ferramentas" style="color:#C5A059;text-decoration:none;">${escapeHtml(toolsLabel)}</a>
      </p>
      <p style="color:#333;font-size:11px;margin:8px 0 0;">
        ${escapeHtml(footerNotice)}
      </p>
    </div>

  </div>
</body>
</html>`;
}
