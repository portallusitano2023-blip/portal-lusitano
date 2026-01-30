#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  console.log('\n📧 Enviando email de teste para franciscomariagaspar6@gmail.com...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portal Lusitano <onboarding@resend.dev>',
      to: ['franciscomariagaspar6@gmail.com'],
      subject: '🐴 Teste de Email - Portal Lusitano PRO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFFBEB;">
          <div style="background: linear-gradient(135deg, #D97706 0%, #92400E 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🐴 Portal Lusitano PRO</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #92400E;">✅ Sistema de Emails a Funcionar!</h2>
            
            <p style="color: #1F2937; font-size: 16px; line-height: 1.6;">
              Olá Francisco! 👋
            </p>
            
            <p style="color: #1F2937; font-size: 16px; line-height: 1.6;">
              Se recebeste este email, significa que o <strong>sistema de emails automáticos do Portal Lusitano PRO está 100% operacional</strong>! 🎉
            </p>
            
            <div style="background: #D1FAE5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="color: #065F46; margin: 0; font-weight: bold;">✅ Tudo está a funcionar:</p>
              <ul style="color: #065F46; margin: 10px 0;">
                <li>Resend API ✓</li>
                <li>Envio de emails ✓</li>
                <li>Sistema pronto para produção ✓</li>
              </ul>
            </div>
            
            <p style="color: #1F2937; font-size: 16px; line-height: 1.6;">
              Quando fizeres um pagamento de teste no Stripe, vais receber:
            </p>
            
            <ul style="color: #1F2937; font-size: 16px; line-height: 1.6;">
              <li>📧 Email de boas-vindas</li>
              <li>📧 Email de confirmação de pagamento</li>
            </ul>
            
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              Este é um email de teste do Portal Lusitano PRO<br>
              Desenvolvido com ❤️ para criadores de Cavalos Lusitanos
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.log('❌ ERRO:', error);
      process.exit(1);
    }

    console.log('✅ Email enviado com sucesso!');
    console.log('📧 ID:', data.id);
    console.log('\n🎯 Verifica a tua inbox: franciscomariagaspar6@gmail.com');
    console.log('   (Pode demorar 1-2 minutos)\n');
    
  } catch (err) {
    console.error('❌ Erro:', err);
    process.exit(1);
  }
}

sendTestEmail();
