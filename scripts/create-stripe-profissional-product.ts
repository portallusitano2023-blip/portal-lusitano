/**
 * Script para criar o produto "Registo Profissional" no Stripe.
 *
 * Uso:
 *   npx tsx scripts/create-stripe-profissional-product.ts
 *
 * Requer STRIPE_SECRET_KEY no .env.local
 * Depois de correr, adiciona o STRIPE_PROFISSIONAL_PRICE_ID ao .env.local e ao Vercel.
 */

import Stripe from "stripe";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Carregar .env.local (ESM não tem __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../.env.local") });

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error("❌ STRIPE_SECRET_KEY não encontrada no .env.local");
  process.exit(1);
}

const stripe = new Stripe(secretKey);

async function main() {
  // 1. Criar o produto
  const product = await stripe.products.create({
    name: "Registo Profissional — Portal Lusitano",
    description:
      "Perfil verificado no directório de profissionais equestres. Inclui página dedicada, contacto directo e selo de verificação.",
    metadata: {
      type: "profissional",
    },
  });

  console.log(`✅ Produto criado: ${product.id}`);
  console.log(`   Nome: ${product.name}`);

  // 2. Criar o preço (€6/mês)
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 600, // €6.00
    currency: "eur",
    recurring: {
      interval: "month",
    },
    metadata: {
      type: "profissional_mensal",
    },
  });

  console.log(`✅ Preço criado: ${price.id}`);
  console.log(`   Valor: €${(price.unit_amount! / 100).toFixed(2)}/mês`);
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Adiciona ao .env.local:");
  console.log(`  STRIPE_PROFISSIONAL_PRICE_ID=${price.id}`);
  console.log("");
  console.log("E ao Vercel:");
  console.log(`  npx vercel env add STRIPE_PROFISSIONAL_PRICE_ID`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
