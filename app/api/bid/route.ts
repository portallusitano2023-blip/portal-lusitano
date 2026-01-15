// @ts-nocheck
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error("ERRO: RESEND_API_KEY não configurada.");
    return NextResponse.json({ error: "Configuração incompleta" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { nome, email, telefone, valor, cavalo } = await req.json();

    // 1. E-MAIL PARA TI (ADMINISTRADOR)
    await resend.emails.send({
      from: 'Portal Lusitano <onboarding@resend.dev>',
      to: 'portal.lusitano2023@gmail.com',
      subject: `🔔 NOVA LICITAÇÃO: ${cavalo}`,
      html: `
        <div style="font-family: serif; color: #000; padding: 20px; border: 1px solid #C5A059;">
          <h1 style="color: #C5A059;">Nova Proposta Recebida</h1>
          <p><strong>Cavalo:</strong> ${cavalo}</p>
          <p><strong>Valor Licidado:</strong> ${valor} €</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Cliente:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${telefone}</p>
        </div>
      `
    });

    // 2. E-MAIL PARA O CLIENTE (CONFIRMAÇÃO DE LUXO)
    await resend.emails.send({
      from: 'Francisco Gaspar | Portal Lusitano <onboarding@resend.dev>',
      to: email, // O e-mail que o cliente inseriu no formulário
      subject: `Confirmação de Proposta: ${cavalo}`,
      html: `
        <div style="font-family: serif; color: #000; padding: 40px; text-align: center; background-color: #fafafa;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border: 1px solid #e5e5e5;">
            <h1 style="font-size: 24px; color: #000; margin-bottom: 20px;">Obrigado pela sua Proposta</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Caro(a) <strong>${nome}</strong>, recebemos com sucesso a sua intenção de licitação para o exemplar <strong>${cavalo}</strong>.
            </p>
            <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #C5A059;">
              <p style="margin: 0; font-size: 14px; color: #888; text-transform: uppercase;">Valor da Proposta</p>
              <p style="margin: 5px 0 0; font-size: 28px; color: #C5A059;">${valor} €</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              A nossa equipa irá analisar a sua proposta e entrará em contacto através do número <strong>${telefone}</strong> nas próximas horas para validar os detalhes do leilão.
            </p>
            <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 2px;">
              Portal Lusitano — Excelência Equestre
            </p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no fluxo de e-mail:", error);
    return NextResponse.json({ error: "Erro ao processar licitação" }, { status: 500 });
  }
}