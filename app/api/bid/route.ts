// @ts-nocheck
import { Resend } from 'resend';
import { client } from "@/lib/client";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // 1. VERIFICAÇÃO DE CHAVE (Prevenção de erro de Build)
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("ERRO: RESEND_API_KEY não configurada no Vercel");
      return NextResponse.json({ error: "Configuração do servidor incompleta" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // 2. REGISTAR NO SANITY (Base de dados para o teu Dashboard)
    // Usamos o Token de Escrita que configuraste no Vercel
    const sanityResult = await client.create({
      _type: 'licitacao',
      nome: nome,
      email: email,
      telefone: telefone,
      valor: Number(valor),
      cavalo: cavalo,
      dataHora: new Date().toISOString(),
    });

    // 3. ENVIAR E-MAIL VIA RESEND
    const emailResult = await resend.emails.send({
      from: 'Portal Lusitano <info@portal-lusitano.pt>',
      to: ['portal.lusitano2023@gmail.com'],
      subject: `NOVA LICITAÇÃO: ${cavalo} - ${valor}€`,
      replyTo: email,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; border: 1px solid #C5A059; padding: 40px; background-color: #fff;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 3px;">Portal Lusitano</h1>
          <hr style="border: 0; border-top: 1px solid #C5A059;" />
          <h2 style="font-style: italic;">Nova Proposta Recebida</h2>
          <p><strong>Exemplar:</strong> ${cavalo}</p>
          <p><strong>Valor:</strong> ${Number(valor).toLocaleString('pt-PT')} €</p>
          <div style="background: #f9f9f9; padding: 20px; margin-top: 20px;">
            <p><strong>Investidor:</strong> ${nome}</p>
            <p><strong>Contacto:</strong> ${telefone}</p>
            <p><strong>E-mail:</strong> ${email}</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true, 
      sanityId: sanityResult._id,
      emailId: emailResult.id 
    });

  } catch (error) {
    console.error('Erro crítico na API:', error);
    return NextResponse.json(
      { error: 'Falha ao processar licitação no servidor' }, 
      { status: 500 }
    );
  }
}