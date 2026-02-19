import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { strictLimiter } from "@/lib/rate-limit";
import { CONTACT_EMAIL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { escapeHtml } from "@/lib/sanitize";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    try {
      await strictLimiter.check(5, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { nome, empresa, email, instagram, pacote, preco, mensagem } = body;

    // Sanitize all user input before inserting into HTML emails
    const sNome = escapeHtml(String(nome ?? ""));
    const sEmpresa = escapeHtml(String(empresa ?? ""));
    const sEmail = escapeHtml(String(email ?? ""));
    const sInstagram = escapeHtml(String(instagram ?? ""));
    const sPacote = escapeHtml(String(pacote ?? ""));
    const sPreco = escapeHtml(String(preco ?? ""));
    const sMensagem = escapeHtml(String(mensagem ?? ""));

    // Validações básicas
    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: "Campos obrigatórios em falta" }, { status: 400 });
    }

    // Enviar email para ti (dono do site)
    await resend.emails.send({
      from: "Portal Lusitano <noreply@portal-lusitano.pt>",
      to: [CONTACT_EMAIL],
      subject: `💰 Novo Pedido Instagram: ${sPacote} - €${sPreco}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C5A059, #8B6914); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Novo Pedido de Promoção</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #C5A059; margin-top: 0;">📦 Pacote: ${sPacote}</h2>
              <p style="font-size: 24px; font-weight: bold; color: #333;">€${sPreco}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #333;">Dados do Cliente:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Nome:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${sNome}</td>
                </tr>
                ${
                  empresa
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Empresa:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${sEmpresa}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email:</td>
                  <td style="padding: 8px 0; font-weight: bold;">
                    <a href="mailto:${sEmail}">${sEmail}</a>
                  </td>
                </tr>
                ${
                  instagram
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Instagram:</td>
                  <td style="padding: 8px 0; font-weight: bold;">
                    <a href="https://instagram.com/${sInstagram.replace("@", "")}">${sInstagram}</a>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>

              <h3 style="color: #333; margin-top: 20px;">O que pretende promover:</h3>
              <p style="background: #f5f5f5; padding: 15px; border-radius: 4px; color: #333;">
                ${sMensagem}
              </p>
            </div>

            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${sEmail}?subject=Re: Pedido de Promoção no Instagram"
                 style="display: inline-block; background: #C5A059; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Responder ao Cliente
              </a>
            </div>
          </div>

          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            Portal Lusitano - Promoção Instagram
          </div>
        </div>
      `,
    });

    // Enviar email de confirmação para o cliente
    await resend.emails.send({
      from: "Portal Lusitano <noreply@portal-lusitano.pt>",
      to: [email],
      subject: "Recebemos o seu pedido de promoção - Portal Lusitano",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C5A059, #8B6914); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Obrigado pelo seu pedido!</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <p style="color: #333; font-size: 16px;">
              Olá ${sNome},
            </p>
            <p style="color: #333; font-size: 16px;">
              Recebemos o seu pedido de promoção no Instagram do Portal Lusitano.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #C5A059;">Resumo do Pedido:</h3>
              <p><strong>Pacote:</strong> ${sPacote}</p>
              <p><strong>Valor:</strong> €${sPreco}</p>
            </div>

            <p style="color: #333; font-size: 16px;">
              Vamos analisar o seu pedido e entraremos em contacto em menos de 24 horas para combinar os detalhes.
            </p>

            <p style="color: #333; font-size: 16px;">
              Cumprimentos,<br>
              <strong>Equipa Portal Lusitano</strong>
            </p>
          </div>

          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <a href="https://instagram.com/portal_lusitano" style="color: #C5A059;">@portal_lusitano</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Pedido enviado com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao processar pedido Instagram:", error);
    return NextResponse.json({ error: "Erro ao enviar pedido" }, { status: 500 });
  }
}
