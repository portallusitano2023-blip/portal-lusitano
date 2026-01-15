// @ts-nocheck
import { Resend } from 'resend';
import { createClient } from "next-sanity";
import { NextResponse } from 'next/server';

// CONFIGURAÇÃO DO CLIENTE SANITY (Isolado para evitar erros de importação)
const sanityClient = createClient({
  projectId: "ofrzpaxa", // O teu ID
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || "sk7A0Gf0q2GvNsy8wP95TgNruFrLcej1ZwBrFWrxpE2958742",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // Diagnóstico rápido para os logs da Vercel
    console.log(`>>> Processando licitação de ${nome} para ${cavalo}`);

    // CHAVE DO RESEND: Usa a variável de ambiente ou o valor direto em caso de falha crítica
    const apiKey = process.env.RESEND_API_KEY || "re_cPTyybFU_EbRvBA6oCJ9a6LWGMJ8gjqDi";
    
    if (!apiKey) {
       return NextResponse.json({ error: "Configuração de e-mail ausente." }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // 1. REGISTO NO SANITY (Para o teu Dashboard de Performance)
    const sanityResult = await sanityClient.create({
      _type: 'licitacao',
      nome,
      email,
      telefone,
      valor: Number(valor),
      cavalo,
      dataHora: new Date().toISOString(),
    });

    // 2. ENVIO DE E-MAIL PROFISSIONAL VIA RESEND
    await resend.emails.send({
      from: 'Portal Lusitano <info@portal-lusitano.pt>',
      to: ['portal.lusitano2023@gmail.com'],
      subject: `NOVA LICITAÇÃO: ${cavalo} - ${valor}€`,
      replyTo: email,
      html: `
        <div style="font-family: serif; border: 1px solid #C5A059; padding: 40px; color: #000;">
          <h1 style="text-align: center; text-transform: uppercase;">Portal Lusitano</h1>
          <hr style="border-top: 1px solid #C5A059;" />
          <h2 style="font-style: italic;">Nova Proposta Recebida</h2>
          <p><strong>Exemplar:</strong> ${cavalo}</p>
          <p><strong>Valor Oferecido:</strong> ${Number(valor).toLocaleString('pt-PT')} €</p>
          <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #C5A059; margin-top: 20px;">
            <p><strong>Investidor:</strong> ${nome}</p>
            <p><strong>Contacto:</strong> ${telefone}</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, id: sanityResult._id });

  } catch (error) {
    console.error("ERRO CRÍTICO NA API:", error.message);
    return NextResponse.json({ error: "Erro ao processar licitação. Verifique os logs do servidor." }, { status: 500 });
  }
}