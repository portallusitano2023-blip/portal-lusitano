// @ts-nocheck
import { Resend } from 'resend';
import { client } from "@/lib/client";
import { NextResponse } from 'next/server';

// Inicialização do Resend com a tua chave de API
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, valor, cavalo } = body;

    console.log(`Processando licitação de ${nome} para o exemplar ${cavalo}`);

    // 1. REGISTAR NO SANITY (Para aparecer no Dashboard de Performance)
    // Certifica-te de que o teu token do Sanity tem permissões de "Editor" ou "Admin"
    const sanityResult = await client.create({
      _type: 'licitacao',
      nome: nome,
      email: email,
      telefone: telefone,
      valor: Number(valor),
      cavalo: cavalo,
      dataHora: new Date().toISOString(),
    });

    console.log('Registo criado no Sanity com sucesso:', sanityResult._id);

    // 2. ENVIAR E-MAIL PROFISSIONAL VIA RESEND
    // Enviamos para o teu e-mail de gestão e usamos o teu domínio verificado
    const emailResult = await resend.emails.send({
      from: 'Portal Lusitano <info@portal-lusitano.pt>',
      to: ['portal.lusitano2023@gmail.com'],
      subject: `NOVA LICITAÇÃO: ${cavalo} - ${valor}€`,
      replyTo: email,
      html: `
        <div style="font-family: 'Times New Roman', serif; max-width: 600px; margin: 0 auto; border: 1px solid #C5A059; padding: 40px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; letter-spacing: 5px; text-transform: uppercase; font-size: 24px; margin: 0;">Portal Lusitano</h1>
            <p style="color: #C5A059; text-transform: uppercase; letter-spacing: 2px; font-size: 10px; margin-top: 5px;">Excelência Equestre</p>
          </div>
          
          <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0; margin-bottom: 30px;">
            <h2 style="font-style: italic; color: #1a1a1a; margin-bottom: 20px;">Nova Proposta de Aquisição</h2>
            
            <table style="width: 100%; font-size: 14px; line-height: 2;">
              <tr>
                <td style="color: #888; text-transform: uppercase; font-size: 10px; width: 40%;">Exemplar</td>
                <td style="font-weight: bold;">${cavalo}</td>
              </tr>
              <tr>
                <td style="color: #888; text-transform: uppercase; font-size: 10px;">Valor da Proposta</td>
                <td style="color: #C5A059; font-size: 18px; font-weight: bold;">${Number(valor).toLocaleString('pt-PT')} €</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; margin-bottom: 30px;">
            <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Dados do Investidor</h3>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Nome:</strong> ${nome}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>E-mail:</strong> ${email}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Telefone:</strong> ${telefone}</p>
          </div>

          <div style="text-align: center; color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
            <p>Este é um registo oficial gerado pelo sistema do Portal Lusitano.</p>
            <p>Por favor, valide a proposta num prazo de 12 horas.</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true, 
      sanityId: sanityResult._id,
      emailId: emailResult.id 
    });

  } catch (error) {
    console.error('Erro crítico na API de Licitação:', error);
    return NextResponse.json(
      { error: 'Falha ao processar a licitação. Verifique os logs do servidor.' }, 
      { status: 500 }
    );
  }
}