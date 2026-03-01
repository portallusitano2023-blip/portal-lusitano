-- Add listing tier columns to cavalos_venda
-- Supports: basico, standard, destaque, premium

-- Tier identifier (defaults to 'standard' to match the existing EUR 49 offering)
ALTER TABLE cavalos_venda
  ADD COLUMN IF NOT EXISTS listing_tier TEXT NOT NULL DEFAULT 'standard';

-- When the listing expires (based on tier durationDays)
ALTER TABLE cavalos_venda
  ADD COLUMN IF NOT EXISTS listing_expires_at TIMESTAMPTZ;

-- When the featured/highlight period ends (only relevant for destaque and premium tiers)
ALTER TABLE cavalos_venda
  ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;

-- Constrain listing_tier to known values
ALTER TABLE cavalos_venda
  ADD CONSTRAINT cavalos_venda_listing_tier_check
  CHECK (listing_tier IN ('basico', 'standard', 'destaque', 'premium'));

-- Index for quickly finding active featured listings
CREATE INDEX IF NOT EXISTS idx_cavalos_venda_featured_until
  ON cavalos_venda (featured_until DESC)
  WHERE featured_until IS NOT NULL;

-- Index for quickly finding soon-to-expire listings
CREATE INDEX IF NOT EXISTS idx_cavalos_venda_listing_expires_at
  ON cavalos_venda (listing_expires_at ASC)
  WHERE listing_expires_at IS NOT NULL;
