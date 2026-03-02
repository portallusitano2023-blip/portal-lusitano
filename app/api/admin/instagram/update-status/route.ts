import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID e status são obrigatórios" }, { status: 400 });
    }

    if (!["published", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    // Buscar o upload para obter o email do cliente
    const { data: upload, error: fetchError } = await supabase
      .from("instagram_uploads")
      .select("id, customer_email, status")
      .eq("id", id)
      .single();

    if (fetchError || !upload) {
      return NextResponse.json({ error: "Upload não encontrado" }, { status: 404 });
    }

    // Atualizar status
    const updateData: Record<string, unknown> = {
      status,
    };

    if (status === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("instagram_uploads")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Enviar email ao cliente se tiver email e for publicado
    if (status === "published" && upload.customer_email) {
      try {
        await resend.emails.send({
          from: "Portal Lusitano <instagram@portal-lusitano.pt>",
          to: upload.customer_email,
          subject: "🎉 O seu post foi publicado no Instagram!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%); padding: 30px; text-align: center;">
                <h1 style="color: #fff; margin: 0;">🎉 Post Publicado!</h1>
              </div>

              <div style="padding: 30px; background: #fff;">
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                  Boa notícia! O seu post acabou de ser publicado no Instagram do <strong>Portal Lusitano</strong>.
                </p>

                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #666;">
                    📸 Visite o nosso Instagram para ver o post:
                  </p>
                  <a href="https://www.instagram.com/portal_lusitano/"
                     style="display: inline-block; margin-top: 15px; background: linear-gradient(135deg, #833AB4, #FD1D1D); color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Ver no Instagram @portal_lusitano
                  </a>
                </div>

                <p style="color: #666; line-height: 1.6;">
                  Obrigado por escolher o Portal Lusitano para a sua publicidade!
                </p>

                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                  Se tiver alguma dúvida, responda a este email.
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        logger.error("Erro ao enviar email:", emailError);
        // Não falhar a operação se o email falhar
      }
    }

    return NextResponse.json({
      success: true,
      message: `Status atualizado para ${status}`,
    });
  } catch (error) {
    logger.error("Update status error:", error);
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}
