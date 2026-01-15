// @ts-nocheck
import { Resend } from 'resend';
import { createClient } from "next-sanity";
import { NextResponse } from 'next/server';

// CONFIGURAÇÃO DIRETA (Evita erros de importação de ficheiros externos)
const sanityClient = createClient({
  projectId: "ofrzpaxa", // O teu ID da imagem d9c62d.png
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    const apiKey = process.env.RESEND_API_KEY;
    
    // Log de diagnóstico para o teu painel Vercel
    if (!apiKey) {
      console.error("ERRO: O servidor ainda não detetou a RESEND_API_KEY.");
      return NextResponse.json({ error: "Configuração incompleta no Vercel: Variável não ligada ao projeto." }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // 1. GRAVAR NO SANITY
    const sanityResult = await sanityClient.create({
      _type: 'licitacao',
      nome,
      email,
      telefone,
      valor: Number(valor),
      cavalo,
      dataHora: new Date().toISOString(),
    });

    // 2. ENVIAR E-MAIL
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

    return NextResponse.json({ success: true, sanityId: sanityResult._id });

  } catch (error) {
    console.error("Erro Crítico:", error.message);
    return NextResponse.json({ error: `Erro no servidor: ${error.message}` }, { status: 500 });
  }
}