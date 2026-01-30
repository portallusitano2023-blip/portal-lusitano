#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║           🧪 TESTE DE CONEXÃO E CHECKOUT DO STRIPE            ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testCheckout() {
  try {
    console.log('1️⃣  Testando conexão ao Stripe...');

    // Testar conexão básica
    const account = await stripe.accounts.retrieve();
    console.log(`   ✅ Conectado! Conta: ${account.id}\n`);

    console.log('2️⃣  Validando Price IDs...\n');

    const priceIds = {
      'Aficionado Monthly': process.env.STRIPE_PRICE_AFICIONADO_MONTHLY,
      'Aficionado Yearly': process.env.STRIPE_PRICE_AFICIONADO_YEARLY,
      'Criador Monthly': process.env.STRIPE_PRICE_CRIADOR_MONTHLY,
      'Criador Yearly': process.env.STRIPE_PRICE_CRIADOR_YEARLY,
      'Elite Monthly': process.env.STRIPE_PRICE_ELITE_MONTHLY,
      'Elite Yearly': process.env.STRIPE_PRICE_ELITE_YEARLY,
    };

    let allValid = true;

    for (const [name, priceId] of Object.entries(priceIds)) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        const amount = (price.unit_amount / 100).toFixed(2);
        const interval = price.recurring?.interval || 'one-time';
        console.log(`   ✅ ${name}: €${amount}/${interval} (${priceId})`);
      } catch (err) {
        console.log(`   ❌ ${name}: INVÁLIDO (${priceId})`);
        console.log(`      Erro: ${err.message}`);
        allValid = false;
      }
    }

    if (!allValid) {
      console.log('\n❌ Alguns Price IDs são inválidos! Ver erros acima.\n');
      process.exit(1);
    }

    console.log('\n3️⃣  Testando criação de sessão de checkout...\n');

    // Tentar criar uma sessão de teste (Criador Monthly)
    const testPriceId = process.env.STRIPE_PRICE_CRIADOR_MONTHLY;

    console.log(`   Price ID: ${testPriceId}`);
    console.log(`   Site URL: ${process.env.NEXT_PUBLIC_SITE_URL}`);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: testPriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pro?canceled=true`,
      customer_email: 'teste@example.com',
      metadata: {
        planId: 'criador',
        period: 'monthly',
      },
      subscription_data: {
        metadata: {
          planId: 'criador',
          period: 'monthly',
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'pt',
    });

    console.log(`   ✅ Sessão criada com sucesso!`);
    console.log(`   Session ID: ${session.id}`);
    console.log(`   Checkout URL: ${session.url}\n`);

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ SUCESSO! Stripe está configurado corretamente!            ║');
    console.log('║                                                                ║');
    console.log('║  O checkout DEVE funcionar agora!                             ║');
    console.log('║                                                                ║');
    console.log('║  Próximos passos:                                             ║');
    console.log('║  1. Reiniciar: npm run dev                                    ║');
    console.log('║  2. Ir a: http://localhost:3000/pro                           ║');
    console.log('║  3. Testar checkout                                           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.log('\n❌ ERRO AO TESTAR CHECKOUT:\n');
    console.error('Tipo:', error.type);
    console.error('Mensagem:', error.message);

    if (error.raw) {
      console.error('\nDetalhes técnicos:');
      console.error(JSON.stringify(error.raw, null, 2));
    }

    console.log('\n💡 POSSÍVEIS SOLUÇÕES:\n');

    if (error.message.includes('No such price')) {
      console.log('   ❌ Price ID inválido!');
      console.log('   ✅ Executar: node scripts/get-prices.js');
      console.log('   ✅ Atualizar .env.local com os IDs corretos');
    } else if (error.message.includes('API key')) {
      console.log('   ❌ Problema com API key!');
      console.log('   ✅ Verificar STRIPE_SECRET_KEY no .env.local');
    } else if (error.message.includes('Invalid URL')) {
      console.log('   ❌ URL inválido!');
      console.log('   ✅ Verificar NEXT_PUBLIC_SITE_URL no .env.local');
    } else {
      console.log('   ❌ Erro desconhecido');
      console.log('   ✅ Verificar todas as variáveis em .env.local');
      console.log('   ✅ Confirmar que estás em Test mode no Stripe');
    }

    console.log('');
    process.exit(1);
  }
}

testCheckout();
