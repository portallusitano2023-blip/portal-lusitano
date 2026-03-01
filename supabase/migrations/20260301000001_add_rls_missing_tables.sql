-- Migration: Add RLS to unprotected tables
-- Date: 2026-03-01
-- Fixes: Security audit finding #2 - Missing RLS on sensitive tables

-- =============================================================================
-- 1. cavalos_venda - Contains seller PII (email, phone, WhatsApp)
-- =============================================================================
ALTER TABLE IF EXISTS cavalos_venda ENABLE ROW LEVEL SECURITY;

-- Public: only active listings visible
CREATE POLICY "cavalos_venda_select_active"
  ON cavalos_venda FOR SELECT
  USING (status = 'active');

-- Service role: full access for admin operations
CREATE POLICY "cavalos_venda_service_role"
  ON cavalos_venda
  USING (auth.role() = 'service_role');

-- =============================================================================
-- 2. reviews - Contains author emails
-- =============================================================================
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;

-- Public: only approved reviews visible
CREATE POLICY "reviews_select_approved"
  ON reviews FOR SELECT
  USING (status = 'approved');

-- Public: anyone can insert a review (will be moderated)
CREATE POLICY "reviews_insert_public"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Service role: full access
CREATE POLICY "reviews_service_role"
  ON reviews
  USING (auth.role() = 'service_role');

-- =============================================================================
-- 3. eventos - Contains organizer email and phone
-- =============================================================================
ALTER TABLE IF EXISTS eventos ENABLE ROW LEVEL SECURITY;

-- Public: only published events visible
CREATE POLICY "eventos_select_published"
  ON eventos FOR SELECT
  USING (status = 'publicado' OR status = 'published');

-- Service role: full access
CREATE POLICY "eventos_service_role"
  ON eventos
  USING (auth.role() = 'service_role');

-- =============================================================================
-- 4. linhagens - Lower risk (no PII) but should still have RLS
-- =============================================================================
ALTER TABLE IF EXISTS linhagens ENABLE ROW LEVEL SECURITY;

-- Public: all lineages are readable
CREATE POLICY "linhagens_select_all"
  ON linhagens FOR SELECT
  USING (true);

-- Service role: full access
CREATE POLICY "linhagens_service_role"
  ON linhagens
  USING (auth.role() = 'service_role');

-- =============================================================================
-- 5. instagram_uploads - Contains session IDs and customer emails
-- =============================================================================
ALTER TABLE IF EXISTS instagram_uploads ENABLE ROW LEVEL SECURITY;

-- No public access - only service role
CREATE POLICY "instagram_uploads_service_role"
  ON instagram_uploads
  USING (auth.role() = 'service_role');

-- =============================================================================
-- 6. push_subscriptions - Contains browser push endpoints and IPs
-- =============================================================================
ALTER TABLE IF EXISTS push_subscriptions ENABLE ROW LEVEL SECURITY;

-- No public access - only service role
CREATE POLICY "push_subscriptions_service_role"
  ON push_subscriptions
  USING (auth.role() = 'service_role');
