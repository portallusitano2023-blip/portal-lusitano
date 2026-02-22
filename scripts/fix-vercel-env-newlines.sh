#!/bin/bash
# ============================================================
# Corrige variáveis com \n indevido no Vercel
# Uso: bash scripts/fix-vercel-env-newlines.sh
# ============================================================

set -e

update_env() {
  local key="$1"
  local value="$2"
  echo "  → A corrigir $key"
  printf '%s' "$value" | npx vercel env update "$key" production --force 2>/dev/null \
    || printf '%s' "$value" | npx vercel env add "$key" production --force 2>/dev/null \
    || echo "    ⚠️  Falhou — actualiza manualmente: $key"
}

echo "🔧 A corrigir variáveis com newlines indevidos..."
echo ""

# URLs
update_env "NEXT_PUBLIC_SITE_URL"  "https://portal-lusitano.pt"
update_env "NEXT_PUBLIC_BASE_URL"  "https://portal-lusitano.pt"
update_env "NEXT_PUBLIC_APP_URL"   "https://portal-lusitano.pt"

# Shopify
update_env "NEXT_PUBLIC_SHOPIFY_DOMAIN" "portal-lusitano.myshopify.com"

# Supabase
update_env "NEXT_PUBLIC_SUPABASE_URL"      "https://yrfcepsagtzkxwnnrztd.supabase.co"
update_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZmNlcHNhZ3R6a3h3bm5yenRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NjYzNTksImV4cCI6MjA4NDI0MjM1OX0.tpeAeeQIYlVT7V1tUGEO9Iek4jZ1NQzyWDVzhjDFLY0"
update_env "SUPABASE_SERVICE_ROLE_KEY"     "sb_secret_Wz00ehTwag548_1kaYVF3g_Oj_d5CYl"

# Admin
update_env "ADMIN_EMAIL"    "portal.lusitano2023@gmail.com"
update_env "ADMIN_PASSWORD" "Gg940142222222.@"
update_env "ADMIN_SECRET"   "8120f07efced5e1d7c401b43276b0f2d186ff17f6a4a247da0d4ba63078aac09"

# Stripe (já em modo LIVE)
update_env "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "pk_live_51SSfGUHg30b3S8YAZdsr3q7LOkp4mT03HAXEis882D1AtRO0Vn3KG0NYRWtJXjMZ3GunD61CZQKqlD6wBY3n1Pvf00DshpwsGS"
update_env "STRIPE_SECRET_KEY"                  "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"
update_env "STRIPE_WEBHOOK_SECRET"              "whsec_mY4BL1PY2Ir0hAiom3SjGRAK3qDbO74D"
update_env "STRIPE_PRICE_FERRAMENTAS_PRO"       "price_1SzKhnHJ6j8c50QzQFYjhpwk"

# Outros
update_env "CRON_SECRET"               "7f9a2e8d1c4b6f3a9e5d8c2b7a4f1e6d9c3b8a5f2e7d1c6b4a9f3e8d2c7b5a"
update_env "ADMIN_SECRET"              "8120f07efced5e1d7c401b43276b0f2d186ff17f6a4a247da0d4ba63078aac09"
update_env "NEXT_PUBLIC_GA4_MEASUREMENT_ID" "G-6L4X5CDRZN"
update_env "NEXT_PUBLIC_SENTRY_DSN"    "https://f87049dc89cf63205a2400866b7bbc95@o4510852415815681.ingest.de.sentry.io/4510852420468816"

echo ""
echo "✅ Correcções aplicadas!"
echo ""
echo "⚠️  Nota: NEXT_PUBLIC_META_PIXEL_ID ainda tem valor placeholder."
echo "   Se não tens Meta Pixel, ignora. Se tens, actualiza no Vercel dashboard."
echo ""
echo "🚀 Faz um novo deploy para aplicar as alterações:"
echo "   npx vercel --prod"
