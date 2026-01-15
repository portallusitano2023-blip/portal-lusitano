// @ts-nocheck
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nome, email, telefone, valor, cavalo } = await req.json();

    await resend.emails.send({
      from: 'Portal Lusitano <onboarding@resend.dev>', // Depois podes configurar o teu domínio
      to: 'portal.lusitano2023@gmail.com', // O teu e-mail
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
    return NextResponse.json({ error: "Erro ao enviar licitação" }, { status: 500 });
  }
}