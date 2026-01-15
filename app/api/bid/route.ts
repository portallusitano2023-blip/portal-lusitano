// @ts-nocheck
import { Resend } from 'resend';
import { client } from "@/lib/client";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // DEBUG DE SEGURANÇA (Apenas visível nos logs da Vercel)
    const apiKey = process.env.RESEND_API_KEY;
    console.log("--- DEBUG LOG PORTAL LUSITANO ---");
    console.log("Chave detetada?", !!apiKey);
    if (apiKey) console.log("Comprimento da chave:", apiKey.length);

    if (!apiKey) {
      return NextResponse.json({ 
        error: "O servidor Vercel não detetou a variável RESEND_API_KEY. Verifica se a adicionaste ao PROJETO e fizeste REDEPLOY." 
      }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // 1. REGISTAR NO SANITY
    let sanityId;
    try {
      const sanityResult = await client.withConfig({ 
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false 
      }).create({
        _type: 'licitacao',
        nome,
        email,
        telefone,
        valor: Number(valor),
        cavalo,
        dataHora: new Date().toISOString(),
      });
      sanityId = sanityResult._id;
      console.log("Sucesso: Licitação guardada no Sanity.");
    } catch (sError) {
      console.error("Erro Sanity:", sError.message);
      return NextResponse.json({ error: `Erro na base de dados (Sanity): ${sError.message}` }, { status: 500 });
    }

    // 2. ENVIAR E-MAIL
    try {
      await resend.emails.send({
        from: 'Portal Lusitano <info@portal-lusitano.pt>',
        to: ['portal.lusitano2023@gmail.com'],
        subject: `NOVA LICITAÇÃO: ${cavalo} - ${valor}€`,
        replyTo: email,
        html: `
          <div style="font-family: serif; border: 1px solid #C5A059; padding: 20px;">
            <h1 style="text-align: center;">Portal Lusitano</h1>
            <hr />
            <p><strong>Nova proposta recebida:</strong></p>
            <p>Cavalo: ${cavalo} | Valor: ${valor}€</p>
            <p>Investidor: ${nome} | Tel: ${telefone}</p>
          </div>
        `
      });
      console.log("Sucesso: E-mail enviado.");
    } catch (eError) {
      console.error("Erro Resend:", eError.message);
      return NextResponse.json({ error: `Erro no envio de e-mail: ${eError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, sanityId });

  } catch (error) {
    console.error("Erro Geral:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}