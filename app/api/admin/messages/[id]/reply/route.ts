import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { verifySession } from "@/lib/auth";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verificar autenticação
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Assunto e mensagem são obrigatórios" }, { status: 400 });
    }

    // Buscar contacto
    const { data: contact, error: fetchError } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !contact) {
      return NextResponse.json({ error: "Mensagem não encontrada" }, { status: 404 });
    }

    // Determinar tipo de formulário para personalizar email
    const formTypeLabels: Record<string, string> = {
      vender_cavalo: "Vender Cavalo",
      publicidade: "Publicidade",
      instagram: "Instagram",
      contact_general: "Contacto Geral",
    };

    const formTypeLabel = formTypeLabels[contact.form_type] || "Portal Lusitano";

    // Enviar email via Resend
    await resend.emails.send({
      from: `Portal Lusitano <${SUPPORT_EMAIL}>`,
      to: contact.email,
      subject: subject,
      replyTo: adminEmail,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C5A059 0%, #8B7042 100%); padding: 30px; text-align: center;">
            <h1 style="color: #000; margin: 0;">Portal Lusitano</h1>
          </div>
          <div style="padding: 40px 30px; background: #fff;">
            <p style="color: #666; margin-bottom: 20px;">Olá ${contact.name},</p>

            <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">
              ${message}
            </div>

            ${
              contact.form_data && Object.keys(contact.form_data).length > 0
                ? `
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 12px;">
                  <strong>Em resposta ao seu pedido:</strong> ${formTypeLabel}
                </p>
                <p style="margin: 0; color: #999; font-size: 12px;">
                  Enviado em ${new Date(contact.created_at).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            `
                : ""
            }

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                Atenciosamente,<br>
                <strong>Equipa Portal Lusitano</strong>
              </p>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 0;">
              Para responder, basta responder a este email.<br>
              Portal Lusitano - O melhor portal de cavalos Lusitanos em Portugal
            </p>
          </div>
        </div>
      `,
    });

    // Atualizar contacto
    await supabase
      .from("contact_submissions")
      .update({
        status: "respondido",
        admin_response: message,
        responded_at: new Date().toISOString(),
        responded_by: adminEmail,
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      message: "Email enviado com sucesso",
    });
  } catch (error) {
    logger.error("Reply error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao enviar email" },
      { status: 500 }
    );
  }
}
