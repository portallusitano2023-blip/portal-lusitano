// @ts-nocheck
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Verificação de segurança: Se a chave não existir, avisamos o sistema
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error("ERRO: RESEND_API_KEY não configurada no Vercel.");
    return NextResponse.json({ error: "Configuração incompleta" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { nome, email, telefone, valor, cavalo } = await req.json();

    await resend.emails.send({
      from: 'Portal Lusitano <onboarding@resend.dev>',
      to: 'portal.lusitano2023@gmail.com', // O teu e-mail de contacto
      subject: `NOVA LICITAÇÃO: ${cavalo}`,
      html: `
        <div style="font-family: serif; color: #000; padding: 20px; border: 1px solid #C5A059;">
          <h1 style="color: #C5A059;">Nova Proposta Recebida</h1>
          <p><strong>Cavalo:</strong> ${cavalo}</p>
          <p><strong>Valor Licidado:</strong> ${valor} €</p>
          <hr />
          <p><strong>Cliente:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${telefone}</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no Resend:", error);
    return NextResponse.json({ error: "Erro ao enviar licitação" }, { status: 500 });
  }
}