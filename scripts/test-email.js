#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║              🧪 TESTE DE EMAIL COM RESEND                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('1️⃣  Verificando API Key...');

    if (!process.env.RESEND_API_KEY) {
      console.log('   ❌ RESEND_API_KEY não encontrada no .env.local\n');
      process.exit(1);
    }

    if (!process.env.RESEND_API_KEY.startsWith('re_')) {
      console.log('   ⚠️  API Key parece inválida (não começa com "re_")\n');
    }

    console.log(`   ✅ API Key encontrada: ${process.env.RESEND_API_KEY.substring(0, 10)}...\n`);

    console.log('2️⃣  Enviando email de teste...\n');

    const { data, error } = await resend.emails.send({
      from: 'Portal Lusitano <onboarding@resend.dev>',
      to: ['delivered@resend.dev'], // Email de teste do Resend
      subject: '🐴 Teste de Email - Portal Lusitano',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D97706;">🐴 Portal Lusitano PRO</h1>
          <h2>Teste de Email</h2>
          <p>Se recebeste este email, o Resend está a funcionar corretamente!</p>
          <p style="color: #059669;">✅ Sistema de emails operacional</p>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #6B7280; font-size: 14px;">
            Este é um email de teste do Portal Lusitano PRO
          </p>
        </div>
      `,
    });

    if (error) {
      console.log('   ❌ ERRO ao enviar email:\n');
      console.error(JSON.stringify(error, null, 2));
      console.log('\n💡 POSSÍVEIS CAUSAS:\n');
      console.log('   1. API Key inválida ou expirada');
      console.log('   2. Domínio não verificado no Resend');
      console.log('   3. Limite de emails excedido (plano free: 3000/mês)');
      console.log('   4. Email "from" não autorizado\n');
      process.exit(1);
    }

    console.log('   ✅ Email enviado com sucesso!\n');
    console.log('📧 Detalhes do envio:');
    console.log(`   ID: ${data.id}`);
    console.log(`   Para: delivered@resend.dev`);
    console.log(`   Status: Enviado\n`);

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ RESEND ESTÁ A FUNCIONAR!                                   ║');
    console.log('║                                                                ║');
    console.log('║  Verifica a inbox de delivered@resend.dev (se tiveres acesso) ║');
    console.log('║  ou testa com o teu próprio email alterando o código.         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('💡 PRÓXIMO PASSO: Testar com o teu email\n');
    console.log('   Editar scripts/test-email.js:');
    console.log('   Linha 29: to: ["TEU_EMAIL@example.com"]\n');

  } catch (error) {
    console.log('\n❌ ERRO INESPERADO:\n');
    console.error(error);
    console.log('');
    process.exit(1);
  }
}

testEmail();
