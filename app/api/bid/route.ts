// @ts-nocheck
import { Resend } from 'resend';
import { client } from "@/lib/client";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // 1. VERIFICAÇÃO DE SEGURANÇA: RESEND
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("ERRO: RESEND_API_KEY não configurada no Vercel");
      return NextResponse.json({ error: "Configuração do servidor incompleta (Resend)." }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    // 2. REGISTAR NO SANITY
    // Usamos o Token de Escrita (Editor) configurado no Vercel
    let sanityId;
    try {
      const sanityResult = await client.create({
        _type: 'licitacao',
        nome: nome,
        email: email,
        telefone: telefone,
        valor: Number(valor),
        cavalo: cavalo,
        dataHora: new Date().toISOString(),
      });
      sanityId = sanityResult._id;
    } catch (sError) {
      console.error("Erro Sanity:", sError.message);
      return NextResponse.json({ error: `Erro no Sanity: ${sError.message}` }, { status: 500 });
    }

    // 3. ENVIAR E-MAIL PROFISSIONAL
    try {
      await resend.emails.send({
        from: 'Portal Lusitano <info@portal-lusitano.pt>',
        to: ['portal.lusitano2023@gmail.com'],
        subject: `NOVA LICITAÇÃO: ${cavalo} - ${valor}€`,
        replyTo: email,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; border: 1px solid #C5A059; padding: 40px; background-color: #fff;">
            <h1 style="color: #000; text-transform: uppercase; letter-spacing: 3px; text-align: center;">Portal Lusitano</h1>
            <hr style="border: 0; border-top: 1px solid #C5A059; margin: 20px 0;" />
            <h2 style="font-style: italic; color: #1a1a1a;">Nova Proposta Recebida</h2>
            <p><strong>Exemplar:</strong> ${cavalo}</p>
            <p><strong>Valor da Proposta:</strong> ${Number(valor).toLocaleString('pt-PT')} €</p>
            <div style="background: #f9f9f9; padding: 25px; margin-top: 25px; border-left: 3px solid #C5A059;">
              <h3 style="font-size: 12px; text-transform: uppercase; margin-bottom: 10px;">Dados do Interessado</h3>
              <p style="margin: 5px 0;"><strong>Nome:</strong> ${nome}</p>
              <p style="margin: 5px 0;"><strong>E-mail:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Telefone:</strong> ${telefone}</p>
            </div>
            <p style="text-align: center; color: #888; font-size: 10px; margin-top: 30px; text-transform: uppercase;">
              Registo oficial processado via Portal Lusitano Cloud
            </p>
          </div>
        `
      });
    } catch (eError) {
      console.error("Erro Resend:", eError.message);
      return NextResponse.json({ error: `Erro no envio de e-mail: ${eError.message}` }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      sanityId: sanityId
    });

  } catch (error) {
    console.error('Erro Crítico:', error);
    return NextResponse.json(
      { error: 'Falha crítica no processamento da licitação.' }, 
      { status: 500 }
    );
  }
}