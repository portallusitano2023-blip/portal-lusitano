// @ts-nocheck
import { Resend } from 'resend';
import { client } from "@/lib/client";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // DIAGNÓSTICO DE ENGENHARIA (Aparecerá nos logs da Vercel)
    console.log("--- INÍCIO DO PROCESSAMENTO ---");
    console.log("Verificando variáveis de ambiente no servidor...");
    
    // Tentamos ler as chaves de todas as formas possíveis
    const resendKey = process.env.RESEND_API_KEY || process.env['RESEND_API_KEY'];
    const sanityToken = process.env.SANITY_API_WRITE_TOKEN || process.env['SANITY_API_WRITE_TOKEN'];

    if (!resendKey) {
      console.error("ERRO CRÍTICO: RESEND_API_KEY não foi encontrada pelo servidor Vercel.");
      return NextResponse.json({ 
        error: "O servidor não detetou a chave do Resend. Verifica se a variável está ligada ao PROJETO no Vercel e faz Redeploy." 
      }, { status: 500 });
    }

    const resend = new Resend(resendKey);

    // 1. REGISTAR NO SANITY
    let sanityId;
    try {
      // Configuramos o cliente com o token explicitamente para este pedido
      const sanityResult = await client.withConfig({ token: sanityToken }).create({
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
      console.error("Erro no Resend:", eError.message);
      return NextResponse.json({ error: `Erro no envio de e-mail: ${eError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, sanityId });

  } catch (error) {
    console.error("Erro Geral:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}