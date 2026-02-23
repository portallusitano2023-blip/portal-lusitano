import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { CONTACT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { escapeHtml } from "@/lib/sanitize";

const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
const MAX_FILES = 10;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const sessionId = formData.get("sessionId") as string;
    const caption = formData.get("caption") as string;
    const hashtags = formData.get("hashtags") as string;
    const link = formData.get("link") as string;
    const observacoes = formData.get("observacoes") as string;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID é obrigatório" }, { status: 400 });
    }

    // Verify Stripe payment before accepting upload
    let customerEmail: string | null = null;
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        return NextResponse.json({ error: "Pagamento não confirmado" }, { status: 403 });
      }
      customerEmail = session.customer_details?.email || null;
    } catch {
      return NextResponse.json({ error: "Sessão de pagamento inválida" }, { status: 400 });
    }

    // Recolher e validar ficheiros
    const files: File[] = [];
    let index = 0;
    while (formData.get(`file${index}`)) {
      files.push(formData.get(`file${index}`) as File);
      index++;
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "Nenhum ficheiro enviado" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Máximo de ${MAX_FILES} ficheiros permitidos` },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `Tipo de ficheiro não permitido: ${file.type}. Apenas imagens e vídeos.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Ficheiro demasiado grande: ${file.name}. Máximo 50MB.` },
          { status: 400 }
        );
      }
    }

    // Upload ficheiros para Supabase Storage
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
      const fileName = `${sessionId}/${Date.now()}_${safeName}`;

      const { error } = await supabase.storage.from("instagram_uploads").upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

      if (error) {
        logger.error("Supabase upload error:", error);
        throw new Error(`Erro ao fazer upload: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("instagram_uploads").getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    // Guardar info na base de dados
    await supabase.from("instagram_uploads").insert({
      session_id: sessionId,
      caption,
      hashtags,
      link,
      observacoes,
      files_urls: uploadedUrls,
      status: "pending",
      customer_email: customerEmail,
    });

    // Enviar email para admin com TODOS os detalhes
    const filesListHtml = uploadedUrls
      .map((url, i) => {
        const file = files[i];
        const isImage = file.type.startsWith("image/");
        return `
        <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          <p style="margin: 0 0 5px 0;"><strong>${isImage ? "📷 Imagem" : "🎥 Vídeo"} ${i + 1}:</strong></p>
          ${isImage ? `<img src="${url}" style="max-width: 300px; border-radius: 4px; display: block; margin: 5px 0;">` : ""}
          <a href="${url}" style="color: #007bff; text-decoration: none; font-size: 12px;" download>
            ⬇️ Download ${escapeHtml(file.name)}
          </a>
        </div>
      `;
      })
      .join("");

    await resend.emails.send({
      from: "Portal Lusitano <instagram@portal-lusitano.pt>",
      to: CONTACT_EMAIL,
      subject: `📸 Materiais Instagram Recebidos - ${sessionId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%); padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">📸 Materiais Instagram Recebidos</h1>
          </div>

          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #333; border-bottom: 2px solid #833AB4; padding-bottom: 10px;">
              Informação Completa para Publicação
            </h2>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333;">📝 Caption:</h3>
              <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(caption || "(Não especificado)")}</p>

              ${
                hashtags
                  ? `
                <h3 style="margin: 15px 0 10px 0; color: #333;">#️⃣ Hashtags:</h3>
                <p style="color: #666;">${escapeHtml(hashtags)}</p>
              `
                  : ""
              }

              ${
                link
                  ? `
                <h3 style="margin: 15px 0 10px 0; color: #333;">🔗 Link:</h3>
                <p style="color: #666;"><a href="${escapeHtml(link)}" style="color: #007bff;">${escapeHtml(link)}</a></p>
              `
                  : ""
              }

              ${
                observacoes
                  ? `
                <h3 style="margin: 15px 0 10px 0; color: #333;">💬 Observações:</h3>
                <p style="color: #666; white-space: pre-wrap;">${escapeHtml(observacoes)}</p>
              `
                  : ""
              }
            </div>

            <h3 style="color: #333; margin: 30px 0 15px 0;">📁 Ficheiros (${files.length}):</h3>
            ${filesListHtml}

            <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; color: #0066cc;">
                <strong>✅ Próximo passo:</strong> Fazer download dos ficheiros e publicar no Instagram @portal_lusitano
              </p>
            </div>

            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              ID da Sessão: ${escapeHtml(sessionId)}
            </p>
          </div>
        </div>
      `,
    });

    // Email de confirmação ao cliente
    if (customerEmail) {
      await resend.emails.send({
        from: "Portal Lusitano <instagram@portal-lusitano.pt>",
        to: customerEmail,
        subject: "Materiais Recebidos - Instagram Portal Lusitano",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #833AB4, #FD1D1D); padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Materiais Recebidos!</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <p style="color: #666; line-height: 1.6;">
              Obrigado! Recebemos os seus materiais com sucesso.
            </p>
            <p style="color: #666; line-height: 1.6;">
              Vamos publicar no nosso Instagram <strong>@portal_lusitano</strong> nas próximas 48 horas.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #666;"><strong>Ficheiros enviados:</strong> ${files.length}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Caption:</strong> ${caption ? "✅ Sim" : "❌ Não"}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Hashtags:</strong> ${hashtags ? "✅ Sim" : "❌ Não"}</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Será notificado quando publicarmos!
            </p>
          </div>
        </div>
      `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Materiais enviados com sucesso",
      filesCount: files.length,
    });
  } catch (error) {
    logger.error("Instagram upload error:", error);
    return NextResponse.json({ error: "Erro ao processar upload" }, { status: 500 });
  }
}
