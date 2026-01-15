// @ts-nocheck
import { Resend } from 'resend';
import { createClient } from "next-sanity";
import { NextResponse } from 'next/server';

// CONFIGURAÇÃO DIRETA DO SANITY
const sanityClient = createClient({
  projectId: "ofrzpaxa", // Do teu ficheiro local
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: "sk7A0Gf0q2GvNsy8wP95TgNruFrLcej1ZwBrFWrxpE2958742", // Token da tua imagem
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // TESTE HARDCODED: Substituímos o process.env pela chave real só para testar
    // Copiei exatamente da tua imagem
    const CHAVE_TESTE = "re_cPTyybFU_EbRvBA6oCJ9a6LWGMJ8gjqDi"; 
    
    const resend = new Resend(CHAVE_TESTE);

    console.log("A iniciar teste com chave hardcoded...");

    // 1. REGISTAR NO SANITY
    const sanityResult = await sanityClient.create({
      _type: 'licitacao',
      nome, email, telefone, valor: Number(valor), cavalo,
      dataHora: new Date().toISOString(),
    });

    // 2. ENVIAR E-MAIL
    await resend.emails.send({
      from: 'Portal Lusitano <info@portal-lusitano.pt>',
      to: ['portal.lusitano2023@gmail.com'],
      subject: `TESTE REAL: ${cavalo} - ${valor}€`,
      html: `<p>Nova proposta de ${nome} no valor de ${valor}€</p>`
    });

    return NextResponse.json({ success: true, sanityId: sanityResult._id });

  } catch (error) {
    console.error("ERRO NO TESTE:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}