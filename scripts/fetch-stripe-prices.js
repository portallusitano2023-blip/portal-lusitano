#!/usr/bin/env node

/**
 * Script para buscar automaticamente os Price IDs do Stripe
 * Executar: node scripts/fetch-stripe-prices.js
 */

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║        🔍 BUSCANDO PRICE IDs DO STRIPE AUTOMATICAMENTE        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

async function fetchPrices() {
  try {
    console.log('📡 Conectando ao Stripe...\n');

    // Buscar todos os produtos
    const products = await stripe.products.list({
      active: true,
      limit: 100
    });

    console.log(`✅ Encontrados ${products.data.length} produtos ativos\n`);

    // Mapear produtos por nome
    const priceMap = {};

    for (const product of products.data) {
      console.log(`📦 Produto: ${product.name}`);

      // Buscar preços deste produto
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      console.log(`   └─ ${prices.data.length} preços encontrados:`);

      prices.data.forEach(price => {
        const interval = price.recurring?.interval || 'one-time';
        const amount = (price.unit_amount / 100).toFixed(2);
        const currency = price.currency.toUpperCase();

        console.log(`      • ${currency} ${amount} / ${interval} → ${price.id}`);

        // Mapear por nome do produto e intervalo
        if (!priceMap[product.name]) {
          priceMap[product.name] = {};
        }
        priceMap[product.name][interval] = price.id;
      });

      console.log('');
    }

    // Identificar os Price IDs corretos
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    📋 PRICE IDs ENCONTRADOS                    ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const envVars = {};

    // Aficionado
    const aficionado = priceMap['Portal Lusitano - Aficionado'] ||
                       priceMap['Aficionado'] ||
                       Object.values(priceMap).find(p => p.month && parseFloat(getPriceAmount(products.data.find(prod => priceMap[prod.name] === p), 'month')) < 15);

    if (aficionado) {
      envVars.STRIPE_PRICE_AFICIONADO_MONTHLY = aficionado.month || aficionado.monthly;
      envVars.STRIPE_PRICE_AFICIONADO_YEARLY = aficionado.year || aficionado.yearly;
      console.log('✅ Aficionado:');
      console.log(`   Monthly: ${envVars.STRIPE_PRICE_AFICIONADO_MONTHLY}`);
      console.log(`   Yearly:  ${envVars.STRIPE_PRICE_AFICIONADO_YEARLY}\n`);
    }

    // Criador
    const criador = priceMap['Portal Lusitano - Criador'] ||
                    priceMap['Criador'] ||
                    Object.values(priceMap).find(p => p.month && parseFloat(getPriceAmount(products.data.find(prod => priceMap[prod.name] === p), 'month')) >= 40 && parseFloat(getPriceAmount(products.data.find(prod => priceMap[prod.name] === p), 'month')) < 100);

    if (criador) {
      envVars.STRIPE_PRICE_CRIADOR_MONTHLY = criador.month || criador.monthly;
      envVars.STRIPE_PRICE_CRIADOR_YEARLY = criador.year || criador.yearly;
      console.log('✅ Criador:');
      console.log(`   Monthly: ${envVars.STRIPE_PRICE_CRIADOR_MONTHLY}`);
      console.log(`   Yearly:  ${envVars.STRIPE_PRICE_CRIADOR_YEARLY}\n`);
    }

    // Elite
    const elite = priceMap['Portal Lusitano - Elite'] ||
                  priceMap['Elite'] ||
                  Object.values(priceMap).find(p => p.month && parseFloat(getPriceAmount(products.data.find(prod => priceMap[prod.name] === p), 'month')) >= 100);

    if (elite) {
      envVars.STRIPE_PRICE_ELITE_MONTHLY = elite.month || elite.monthly;
      envVars.STRIPE_PRICE_ELITE_YEARLY = elite.year || elite.yearly;
      console.log('✅ Elite:');
      console.log(`   Monthly: ${envVars.STRIPE_PRICE_ELITE_MONTHLY}`);
      console.log(`   Yearly:  ${envVars.STRIPE_PRICE_ELITE_YEARLY}\n`);
    }

    // Gerar conteúdo para .env.local
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              📝 COPIAR PARA .env.local                         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('# Price IDs - Atualizados automaticamente');
    Object.entries(envVars).forEach(([key, value]) => {
      if (value) {
        console.log(`${key}=${value}`);
      }
    });

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ SUCESSO! Copiar as linhas acima para .env.local           ║');
    console.log('║  📝 Substituir as linhas STRIPE_PRICE_* existentes            ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Contar quantos foram encontrados
    const foundCount = Object.values(envVars).filter(v => v).length;
    if (foundCount === 6) {
      console.log('🎉 Perfeito! Todos os 6 Price IDs foram encontrados!\n');
      process.exit(0);
    } else {
      console.log(`⚠️  Aviso: Apenas ${foundCount}/6 Price IDs foram encontrados.`);
      console.log('   Verifica se criaste todos os produtos no Stripe Dashboard.\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('\n💡 Verifica se:');
    console.error('   1. STRIPE_SECRET_KEY está correto no .env.local');
    console.error('   2. Estás conectado à internet');
    console.error('   3. A chave Stripe é válida (não expirou)\n');
    process.exit(1);
  }
}

function getPriceAmount(product, prices, interval) {
  // Helper para obter o valor do preço (não usado na versão simplificada)
  return '0';
}

// Executar
fetchPrices();
