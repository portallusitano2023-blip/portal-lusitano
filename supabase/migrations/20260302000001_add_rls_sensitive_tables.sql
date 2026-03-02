-- Migration: Add/Review RLS on sensitive tables
-- Date: 2026-03-02
-- Purpose: Ensure all sensitive tables have proper Row Level Security policies

-- Note: The following tables were already checked:
-- - contact_submissions: Already has RLS with service_role policy
-- - crm_leads: Already has RLS with service_role policy
-- - instagram_uploads: Already has RLS with service_role policy
-- - This migration ensures consistency and adds any missing policies

-- =============================================================================
-- contact_submissions: Service role only (no public access)
-- =============================================================================
-- RLS already enabled, just verify the policy exists
ALTER TABLE IF EXISTS contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Allow all for service role" ON contact_submissions;

-- Service role policy
CREATE POLICY "contact_submissions_service_role"
  ON contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- crm_leads: Service role only (no public access)
-- =============================================================================
ALTER TABLE IF EXISTS crm_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Admin can do everything on CRM leads" ON crm_leads;

-- Service role only policy
CREATE POLICY "crm_leads_service_role"
  ON crm_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- instagram_uploads: Service role only (sensitive customer email and session IDs)
-- =============================================================================
ALTER TABLE IF EXISTS instagram_uploads ENABLE ROW LEVEL SECURITY;

-- Drop existing overly permissive policy if any
DROP POLICY IF EXISTS "instagram_uploads_service_role" ON instagram_uploads;

-- Service role only
CREATE POLICY "instagram_uploads_service_role"
  ON instagram_uploads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- professionais_leads: Service role only (customer contact information)
-- =============================================================================
ALTER TABLE IF EXISTS profissionais_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin acesso total leads" ON profissionais_leads;

-- Service role policy
CREATE POLICY "profissionais_leads_service_role"
  ON profissionais_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- profissionais_reviews: Service role for moderation + public for approved
-- =============================================================================
ALTER TABLE IF EXISTS profissionais_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin acesso total reviews" ON profissionais_reviews;
DROP POLICY IF EXISTS "Reviews aprovadas visíveis" ON profissionais_reviews;

-- Public can see approved reviews only
CREATE POLICY "profissionais_reviews_select_approved"
  ON profissionais_reviews
  FOR SELECT
  USING (status = 'aprovado');

-- Service role for full access
CREATE POLICY "profissionais_reviews_service_role"
  ON profissionais_reviews
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- profissionais: Service role + public read for approved professionals
-- =============================================================================
ALTER TABLE IF EXISTS profissionais ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin acesso total profissionais" ON profissionais;
DROP POLICY IF EXISTS "Profissionais aprovados visíveis" ON profissionais;

-- Public can see approved professionals only
CREATE POLICY "profissionais_select_approved"
  ON profissionais
  FOR SELECT
  USING (status = 'aprovado' AND deleted_at IS NULL);

-- Service role for full access
CREATE POLICY "profissionais_service_role"
  ON profissionais
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- profissionais_subscription_historico: Service role only (financial data)
-- =============================================================================
ALTER TABLE IF EXISTS profissionais_subscription_historico ENABLE ROW LEVEL SECURITY;

-- Service role only
CREATE POLICY "profissionais_subscription_historico_service_role"
  ON profissionais_subscription_historico
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- cart_recovery_emails: Service role only (customer emails and session data)
-- =============================================================================
ALTER TABLE IF EXISTS cart_recovery_emails ENABLE ROW LEVEL SECURITY;

-- Service role only
CREATE POLICY "cart_recovery_emails_service_role"
  ON cart_recovery_emails
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- admin_activity_logs: Service role only (sensitive audit data)
-- =============================================================================
ALTER TABLE IF EXISTS admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Service role only
CREATE POLICY "admin_activity_logs_service_role"
  ON admin_activity_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
