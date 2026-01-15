// @ts-nocheck
import { Resend } from 'resend';
import { client } from "@/lib/client";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    // --- DEBUG DE ENGENHARIA ---
    // Isto vai imprimir no log da Vercel se as chaves existem (sem mostrar o valor secreto)
    console.log("Verificando chaves de ambiente...");
    console.log("RESEND_API_KEY presente?", !!process.env.RESEND_API_KEY);
    console.log("SANITY_API_WRITE_TOKEN presente?", !!process.env.SANITY_API_WRITE_TOKEN);

    // 1. VERIFICAÇÃO DE SEGURANÇA: RESEND
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("ERRO: RESEND_API_KEY não configurada no Vercel");
      return NextResponse.json({ 
        error: "Configuração incompleta: RESEND_API_KEY em falta no servidor Vercel." 
      }, { status: 500 });
    }
    
    const resend = new Resend(apiKey);

    // 2. REGISTAR NO SANITY (Base de dados para o teu Dashboard)
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
      console.log("Sucesso no Sanity: Documento criado.");
    } catch (sError) {
      console.error("Erro Sanity:", sError.message);
      return NextResponse.json({ 
        error: `Erro ao gravar no Sanity: ${sError.message}. Verifica se o token tem permissão de Editor.` 
      }, { status: 500 });
    }

    // 3. ENVIAR E-MAIL VIA RESEND
    try {
      const emailResult = await resend.emails.send({
        from: 'Portal Lusitano <info@portal-lusitano.pt>',
        to: ['portal.lusitano2023@gmail.com'],
        subject: `NOVA LICITAÇÃO: ${cavalo} - ${valor}€`,
        replyTo: email,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; border: 1px solid #C5A059; padding: 40px; background-color: #fff; color: #000;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="letter-spacing: 5px; text-transform: uppercase; margin: 0;">Portal Lusitano</h1>
              <p style="color: #C5A059; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Excelência Equestre</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #C5A059; margin-bottom: 30px;" />
            <h2 style="font-style: italic;">Nova Proposta de Aquisição</h2>
            <p><strong>Exemplar:</strong> ${cavalo}</p>
            <p><strong>Valor:</strong> ${Number(valor).toLocaleString('pt-PT')} €</p>
            <div style="background-color: #f9f9f9; padding: 20px; margin-top: 20px; border-left: 4px solid #C5A059;">
              <p style="margin: 5px 0;"><strong>Investidor:</strong> ${nome}</p>
              <p style="margin: 5px 0;"><strong>Contacto:</strong> ${telefone}</p>
              <p style="margin: 5px 0;"><strong>E-mail:</strong> ${email}</p>
            </div>
          </div>
        `
      });
      console.log("Sucesso no Resend: E-mail enviado.");
    } catch (eError) {
      console.error("Erro Resend:", eError.message);
      return NextResponse.json({ 
        error: `Erro ao enviar e-mail: ${eError.message}. Verifica se o domínio está verificado no painel do Resend.` 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      sanityId: sanityId
    });

  } catch (error) {
    console.error('Erro Crítico no Servidor:', error);
    return NextResponse.json(
      { error: 'Falha crítica no processamento. Verifica os logs da Vercel.' }, 
      { status: 500 }
    );
  }
}