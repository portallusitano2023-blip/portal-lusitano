#!/bin/bash
# ============================================================
# Script para configurar variáveis de ambiente no Vercel
# Uso: bash scripts/push-env-to-vercel.sh
# Requer: npx vercel login (fazer primeiro)
# ============================================================

set -e

PROJECT_NAME="portal-lusitano"
DOMAIN="https://portal-lusitano.pt"

echo "🔗 A ligar ao projecto Vercel..."
npx vercel link --yes --project "$PROJECT_NAME" 2>/dev/null || true

echo ""
echo "📦 A enviar variáveis de ambiente para produção..."
echo ""

add_env() {
  local key="$1"
  local value="$2"
  local env="${3:-production}"
  echo "  → $key"
  echo "$value" | npx vercel env add "$key" "$env" --force 2>/dev/null || \
  echo "    ⚠️  Falhou (pode já existir) — actualiza manualmente no dashboard"
}

# ---- URLs do Site (PRODUÇÃO) ----
add_env "NEXT_PUBLIC_SITE_URL"   "$DOMAIN"
add_env "NEXT_PUBLIC_BASE_URL"   "$DOMAIN"
add_env "NEXT_PUBLIC_APP_URL"    "$DOMAIN"

# ---- Sanity CMS ----
add_env "NEXT_PUBLIC_SANITY_PROJECT_ID"  "ofrzpaxa"
add_env "NEXT_PUBLIC_SANITY_DATASET"     "production"
add_env "SANITY_API_WRITE_TOKEN"         "$(grep SANITY_API_WRITE_TOKEN .env.local | cut -d'=' -f2- | tr -d '\"')"
# SANITY_API_TOKEN — se for diferente do WRITE_TOKEN, adiciona aqui
# add_env "SANITY_API_TOKEN" "..."

# ---- Shopify ----
add_env "NEXT_PUBLIC_SHOPIFY_DOMAIN"  "portal-lusitano.myshopify.com"
add_env "NEXT_PUBLIC_SHOPIFY_TOKEN"   "$(grep NEXT_PUBLIC_SHOPIFY_TOKEN .env.local | cut -d'=' -f2- | tr -d '\"')"

# ---- Supabase ----
add_env "NEXT_PUBLIC_SUPABASE_URL"      "$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d'=' -f2- | tr -d '\"')"
add_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d'=' -f2- | tr -d '\"')"
add_env "SUPABASE_SERVICE_ROLE_KEY"     "$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d'=' -f2- | tr -d '\"')"

# ---- Email (Resend) ----
add_env "RESEND_API_KEY" "$(grep RESEND_API_KEY .env.local | cut -d'=' -f2- | tr -d '\"')"

# ---- Analytics ----
add_env "NEXT_PUBLIC_GA4_MEASUREMENT_ID" "$(grep NEXT_PUBLIC_GA4_MEASUREMENT_ID .env.local | cut -d'=' -f2- | tr -d '\"')"
# Meta Pixel — substituir pelo ID real se ainda não tiveres
add_env "NEXT_PUBLIC_META_PIXEL_ID" "$(grep NEXT_PUBLIC_META_PIXEL_ID .env.local | cut -d'=' -f2- | tr -d '\"')"

# ---- Sentry ----
add_env "NEXT_PUBLIC_SENTRY_DSN" "$(grep NEXT_PUBLIC_SENTRY_DSN .env.local | cut -d'=' -f2- | tr -d '\"')"

# ---- Upstash Redis (Rate Limiting) ----
add_env "UPSTASH_REDIS_REST_URL"   "$(grep UPSTASH_REDIS_REST_URL .env.local | cut -d'=' -f2- | tr -d '\"')"
add_env "UPSTASH_REDIS_REST_TOKEN" "$(grep UPSTASH_REDIS_REST_TOKEN .env.local | cut -d'=' -f2- | tr -d '\"')"

# ---- Admin Auth ----
add_env "ADMIN_EMAIL"    "$(grep ADMIN_EMAIL .env.local | cut -d'=' -f2- | tr -d '\"')"
add_env "ADMIN_PASSWORD" "$(grep ADMIN_PASSWORD .env.local | cut -d'=' -f2- | tr -d '\"')"
add_env "ADMIN_SECRET"   "$(grep ADMIN_SECRET .env.local | cut -d'=' -f2- | tr -d '\"')"

# ---- Cron ----
add_env "CRON_SECRET" "$(grep CRON_SECRET .env.local | cut -d'=' -f2- | tr -d '\"')"

# ---- Stripe (TEST por agora — actualizar para LIVE depois) ----
echo ""
echo "⚠️  STRIPE: A usar chaves de TESTE. Actualiza para LIVE antes de aceitar pagamentos reais."
add_env "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "$(grep NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY .env.local | cut -d'=' -f2- | tr -d '\"')"
add_env "STRIPE_SECRET_KEY"                  "$(grep STRIPE_SECRET_KEY .env.local | cut -d'=' -f2- | tr -d '\"')"
add_env "STRIPE_WEBHOOK_SECRET"              "$(grep STRIPE_WEBHOOK_SECRET .env.local | cut -d'=' -f2- | tr -d '\"')"
add_env "STRIPE_PRICE_FERRAMENTAS_PRO"       "$(grep STRIPE_PRICE_FERRAMENTAS_PRO .env.local | cut -d'=' -f2- | tr -d '\"')"

echo ""
echo "✅ Concluído!"
echo ""
echo "⚠️  AINDA FALTA (adicionar manualmente no dashboard Vercel):"
echo "   - STRIPE_PRICE_PRO_MONTHLY"
echo "   - STRIPE_PRICE_PRO_YEARLY"
echo "   - STRIPE_PRICE_PRO_INSTAGRAM_MONTHLY"
echo "   - STRIPE_PRICE_PRO_INSTAGRAM_YEARLY"
echo "   - STRIPE_PRICE_PROFISSIONAL"
echo "   - SANITY_API_TOKEN (se diferente de SANITY_API_WRITE_TOKEN)"
echo ""
echo "🔗 Dashboard Vercel: https://vercel.com/dashboard"
echo "🚀 Faz re-deploy depois de actualizar as variáveis."
