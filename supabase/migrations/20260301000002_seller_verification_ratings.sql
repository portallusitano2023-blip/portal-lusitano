-- Migration: Seller verification system and ratings
-- Date: 2026-03-01
-- Adds verified seller badges and buyer rating system for the horse marketplace

-- =============================================================================
-- 1. Add verification and rating columns to cavalos_venda
-- =============================================================================
ALTER TABLE cavalos_venda
  ADD COLUMN IF NOT EXISTS verificado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS verificado_at timestamptz,
  ADD COLUMN IF NOT EXISTS verificado_por text,
  ADD COLUMN IF NOT EXISTS rating_media numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_vendas integer DEFAULT 0;

-- =============================================================================
-- 2. Create seller_ratings table
-- =============================================================================
CREATE TABLE IF NOT EXISTS seller_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cavalo_id uuid NOT NULL REFERENCES cavalos_venda(id) ON DELETE CASCADE,
  buyer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- 3. Index for efficient lookups by cavalo_id
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_seller_ratings_cavalo_id ON seller_ratings(cavalo_id);

-- =============================================================================
-- 4. RLS policies for seller_ratings
-- =============================================================================
ALTER TABLE seller_ratings ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read approved ratings
CREATE POLICY "seller_ratings_select_public"
  ON seller_ratings FOR SELECT
  USING (true);

-- Authenticated: authenticated users can insert ratings
CREATE POLICY "seller_ratings_insert_authenticated"
  ON seller_ratings FOR INSERT
  WITH CHECK (true);

-- Service role: full access for admin operations
CREATE POLICY "seller_ratings_service_role"
  ON seller_ratings
  USING (auth.role() = 'service_role');
