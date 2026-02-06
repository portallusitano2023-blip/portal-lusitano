-- ========================================
-- MIGRAÇÃO 002: Melhorar Tabela de Pagamentos
-- Adiciona tracking de produtos e metadata
-- ========================================

-- 1. Adicionar novas colunas à tabela payments
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS product_type TEXT,
  ADD COLUMN IF NOT EXISTS product_metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS refund_amount INTEGER;

-- 2. Criar índices para as novas colunas
CREATE INDEX IF NOT EXISTS idx_payments_product_type ON payments(product_type);
CREATE INDEX IF NOT EXISTS idx_payments_session ON payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_date_status ON payments(created_at DESC, status);

-- 3. Adicionar comentários explicativos
COMMENT ON COLUMN payments.product_type IS 'Tipo de produto: cavalo_anuncio, instagram, publicidade, profissional';
COMMENT ON COLUMN payments.product_metadata IS 'Metadata adicional do produto (pacote, detalhes)';
COMMENT ON COLUMN payments.stripe_session_id IS 'ID da sessão Stripe Checkout para referência';
COMMENT ON COLUMN payments.refunded_at IS 'Data de reembolso se aplicável';
COMMENT ON COLUMN payments.refund_amount IS 'Valor reembolsado em cêntimos';
