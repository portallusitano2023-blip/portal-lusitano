#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('\n🔍 Buscando Price IDs do Stripe...\n');

async function main() {
  try {
    // Buscar todos os preços ativos
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      limit: 100
    });

    console.log(`Encontrados ${prices.data.length} preços ativos:\n`);

    // Agrupar por produto
    const byProduct = {};

    for (const price of prices.data) {
      const productName = price.product.name;
      const interval = price.recurring?.interval || 'one-time';
      const amount = (price.unit_amount / 100).toFixed(2);

      if (!byProduct[productName]) {
        byProduct[productName] = {};
      }

      byProduct[productName][interval] = {
        id: price.id,
        amount: amount
      };

      console.log(`📦 ${productName}`);
      console.log(`   ${interval}: €${amount} → ${price.id}\n`);
    }

    // Montar .env
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('COPIAR PARA .env.local:');
    console.log('═══════════════════════════════════════════════════════\n');

    const envLines = [];

    // Tentar encontrar cada plano
    Object.entries(byProduct).forEach(([productName, intervals]) => {
      const monthly = intervals.month || intervals.monthly;
      const yearly = intervals.year || intervals.yearly;

      if (productName.toLowerCase().includes('aficionado')) {
        if (monthly) envLines.push(`STRIPE_PRICE_AFICIONADO_MONTHLY=${monthly.id}`);
        if (yearly) envLines.push(`STRIPE_PRICE_AFICIONADO_YEARLY=${yearly.id}`);
      } else if (productName.toLowerCase().includes('criador')) {
        if (monthly) envLines.push(`STRIPE_PRICE_CRIADOR_MONTHLY=${monthly.id}`);
        if (yearly) envLines.push(`STRIPE_PRICE_CRIADOR_YEARLY=${yearly.id}`);
      } else if (productName.toLowerCase().includes('elite')) {
        if (monthly) envLines.push(`STRIPE_PRICE_ELITE_MONTHLY=${monthly.id}`);
        if (yearly) envLines.push(`STRIPE_PRICE_ELITE_YEARLY=${yearly.id}`);
      }
    });

    envLines.forEach(line => console.log(line));

    console.log('\n═══════════════════════════════════════════════════════\n');

    if (envLines.length === 6) {
      console.log('✅ Perfeito! Todos os 6 Price IDs encontrados!');
      console.log('\n📝 Próximos passos:');
      console.log('   1. Copiar as linhas acima');
      console.log('   2. Colar no .env.local (substituir as linhas STRIPE_PRICE_*)');
      console.log('   3. Reiniciar: npm run dev');
      console.log('   4. Testar checkout em http://localhost:3000/pro\n');
    } else {
      console.log(`⚠️  Encontrados apenas ${envLines.length}/6 Price IDs`);
      console.log('   Verifica se criaste todos os produtos no Stripe Dashboard.\n');
    }

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error('\n💡 Soluções:');
    console.error('   - Verifica STRIPE_SECRET_KEY no .env.local');
    console.error('   - Confirma que estás em Test mode no Stripe');
    console.error('   - Verifica conexão à internet\n');
  }
}

main();
