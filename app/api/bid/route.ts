// @ts-nocheck
import { Resend } from 'resend';
import { createClient } from "next-sanity";
import { NextResponse } from 'next/server';

// CONFIGURAÇÃO DIRETA (Evita erros de importação)
const sanityClient = createClient({
  projectId: "ofrzpaxa", // O teu ID
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // 1. VERIFICAÇÃO DA CHAVE DO RESEND
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("ERRO: RESEND_API_KEY não encontrada no servidor.");
      return NextResponse.json({ 
        error: "O servidor não detetou a chave. Verifica se ligaste a variável ao PROJETO no Vercel (campo 'Link to Projects')." 
      }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // 2. REGISTAR NO SANITY
    let sanityId;
    try {
      const sanityResult = await sanityClient.create({
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
      console.error("Erro no Sanity:", sError.message);
      return NextResponse.json({ error: `Erro na base de dados: ${sError.message}` }, { status: 500 });
    }

    // 3. ENVIAR E-MAIL
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
      console.error("Erro no Resend:", eError.message);
      return NextResponse.json({ error: `Erro no envio de e-mail: ${eError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, sanityId });

  } catch (error) {
    console.error("Erro Geral:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}