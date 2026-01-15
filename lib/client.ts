// @ts-nocheck
import { Resend } from 'resend';
import { createClient } from "next-sanity";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // --- CONFIGURAÇÃO DIRETA DO CLIENTE SANITY ---
    // Isto ignora o ficheiro lib/client.ts para garantir que o token é lido aqui
    const sanityClient = createClient({
      projectId: "ofrzpaxa", // O teu Project ID da imagem image_d9c62d.png
      dataset: "production",
      apiVersion: "2024-01-01",
      useCdn: false,
      token: process.env.SANITY_API_WRITE_TOKEN, // Lê a variável do Vercel
    });

    // --- DIAGNÓSTICO DE SEGURANÇA ---
    const resendKey = process.env.RESEND_API_KEY;
    
    if (!resendKey) {
      console.error("ERRO DE AMBIENTE: RESEND_API_KEY não detetada no servidor.");
      return NextResponse.json({ 
        error: "O servidor não detetou as chaves. Por favor, garante que ligaste as variáveis ao PROJETO no Vercel e fizeste REDEPLOY." 
      }, { status: 500 });
    }

    const resend = new Resend(resendKey);

    // 1. REGISTO NO SANITY
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
    } catch (sError) {
      console.error("Falha no Sanity:", sError.message);
      return NextResponse.json({ error: `Erro na base de dados: ${sError.message}` }, { status: 500 });
    }

    // 2. ENVIO DE E-MAIL
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
    } catch (eError) {
      console.error("Falha no Resend:", eError.message);
      return NextResponse.json({ error: `Erro no envio de e-mail: ${eError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, sanityId });

  } catch (error) {
    console.error("Erro Crítico:", error);
    return NextResponse.json({ error: "Erro interno de servidor." }, { status: 500 });
  }
}