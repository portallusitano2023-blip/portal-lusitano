// @ts-nocheck
import { Resend } from 'resend';
import { createClient } from "next-sanity";
import { NextResponse } from 'next/server';

const sanityClient = createClient({
  projectId: "ofrzpaxa", 
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
    if (!apiKey) throw new Error("RESEND_API_KEY ausente.");

    const resend = new Resend(apiKey);

    await sanityClient.create({
      _type: 'licitacao',
      nome, email, telefone, valor: Number(valor), cavalo,
      dataHora: new Date().toISOString(),
    });

    await resend.emails.send({
      from: 'Portal Lusitano <info@portal-lusitano.pt>',
      to: ['portal.lusitano2023@gmail.com'],
      subject: `NOVA LICITAÇÃO: ${cavalo} - ${valor}€`,
      html: `<div style="font-family:serif;padding:20px;border:1px solid #C5A059;">
              <h1>Portal Lusitano</h1>
              <p>Nova proposta de ${nome} para ${cavalo}: ${valor}€</p>
             </div>`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}