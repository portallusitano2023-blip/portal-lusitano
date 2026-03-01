import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/resend";
import { logger } from "@/lib/logger";
import { apiLimiter } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/sanitize";

const TOOL_NAMES: Record<string, string> = {
  calculadora: "Calculadora de Valor",
  comparador: "Comparador de Cavalos",
  compatibilidade: "Verificador de Compatibilidade",
  perfil: "Análise de Perfil",
};

const TOOL_LINKS: Record<string, string> = {
  calculadora: "/calculadora-valor",
  comparador: "/comparador-cavalos",
  compatibilidade: "/verificador-compatibilidade",
  perfil: "/analise-perfil",
};

// POST /api/tools/send-results
// Envia resultados por email — exclusivo para utilizadores com subscrição PRO activa
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await apiLimiter.check(5, ip);
    } catch {
      return NextResponse.json({ error: "Demasiados pedidos." }, { status: 429 });
    }

    // Autenticação obrigatória
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user?.email) {
      return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
    }

    // Verificar subscrição PRO
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("tools_subscription_status")
      .eq("id", user.id)
      .single();

    if (profile?.tools_subscription_status !== "active") {
      return NextResponse.json(
        { error: "Funcionalidade exclusiva do plano PRO." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { toolName, resultSummary } = body as {
      toolName: string;
      resultSummary: Record<string, unknown>;
    };

    if (!toolName || !resultSummary) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://portal-lusitano.pt";
    const html = buildResultEmail(toolName, resultSummary, baseUrl);

    const result = await sendEmail({
      to: user.email,
      subject: `Resultados: ${TOOL_NAMES[toolName] || toolName} — Portal Lusitano`,
      html,
      template: "tool-results",
    });

    if (!result.success) {
      logger.error("Erro ao enviar email de resultados:", result.error);
      return NextResponse.json({ error: "Erro ao enviar email." }, { status: 500 });
    }

    return NextResponse.json({ success: true, sentTo: user.email });
  } catch (error) {
    logger.error("Erro em /api/tools/send-results:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

function buildResultEmail(
  toolName: string,
  summary: Record<string, unknown>,
  baseUrl: string
): string {
  const displayName = TOOL_NAMES[toolName] || toolName;
  const toolPath = TOOL_LINKS[toolName] || "/ferramentas";
  const toolUrl = `${baseUrl}${toolPath}`;

  // Gerar linhas de resumo a partir do objecto de resultado
  const summaryLines = Object.entries(summary)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .slice(0, 8) // Máximo 8 campos no email
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:6px 12px;color:#999;font-size:13px;border-bottom:1px solid #222;">${escapeHtml(k)}</td>
          <td style="padding:6px 12px;color:#fff;font-size:13px;font-weight:600;border-bottom:1px solid #222;">${escapeHtml(String(v))}</td>
        </tr>`
    )
    .join("");

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
      <p style="margin:8px 0 0;color:#000;font-size:14px;opacity:0.75;">Os seus resultados da ${displayName}</p>
    </div>

    <!-- Body -->
    <div style="background:#111;padding:28px 24px;border:1px solid #222;border-top:none;">
      <h2 style="margin:0 0 20px;color:#C5A059;font-size:18px;">${displayName}</h2>

      <!-- Summary table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tbody>
          ${summaryLines || '<tr><td colspan="2" style="padding:12px;color:#999;text-align:center;">Ver resultados completos no portal</td></tr>'}
        </tbody>
      </table>

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="${toolUrl}" style="display:inline-block;background:#C5A059;color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
          Ver análise completa →
        </a>
      </div>

      <p style="color:#666;font-size:12px;margin:16px 0 0;line-height:1.6;">
        Os resultados apresentados são estimativas baseadas nos dados fornecidos e na metodologia do Portal Lusitano.
        Não substituem avaliações profissionais de médicos veterinários ou especialistas equestres.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#0a0a0a;padding:20px 24px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #222;border-top:none;">
      <p style="color:#555;font-size:12px;margin:0;">
        Portal Lusitano PRO — <a href="${baseUrl}/ferramentas" style="color:#C5A059;text-decoration:none;">Ferramentas</a>
      </p>
      <p style="color:#333;font-size:11px;margin:8px 0 0;">
        Recebeu este email porque tem uma subscrição PRO activa.
      </p>
    </div>

  </div>
</body>
</html>`;
}
