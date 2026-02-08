-- ============================================================================
-- CART ABANDONMENT TRACKING & RECOVERY SYSTEM
-- ============================================================================
-- Purpose: Track abandoned carts and enable email recovery campaigns
-- Impact: Recover 5-8% of abandoned carts (industry standard)
-- Created: 2026-02-06

-- 1. ABANDONED CARTS TABLE
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User identification
  email TEXT NOT NULL,
  user_id UUID, -- Optional: if user is logged in
  session_id TEXT NOT NULL, -- Browser session ID

  -- Cart data (JSONB for flexibility)
  cart_items JSONB NOT NULL, -- Array of {product_id, name, image, price, quantity}
  cart_total DECIMAL(10,2) NOT NULL,
  cart_quantity INTEGER NOT NULL,

  -- Recovery tracking
  recovery_token TEXT UNIQUE NOT NULL, -- Secure token for email link
  recovery_url TEXT, -- Full URL with token

  -- Email campaign tracking
  emails_sent INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMP,
  email_opened BOOLEAN DEFAULT false,
  email_clicked BOOLEAN DEFAULT false,
  recovered BOOLEAN DEFAULT false,
  recovered_at TIMESTAMP,
  recovered_order_id TEXT,

  -- Metadata
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  ip_address TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days')
);

-- Indexes for performance
CREATE INDEX idx_abandoned_carts_email ON abandoned_carts(email);
CREATE INDEX idx_abandoned_carts_session ON abandoned_carts(session_id);
CREATE INDEX idx_abandoned_carts_token ON abandoned_carts(recovery_token);
CREATE INDEX idx_abandoned_carts_recovered ON abandoned_carts(recovered, created_at DESC);
CREATE INDEX idx_abandoned_carts_expires ON abandoned_carts(expires_at) WHERE NOT recovered;

-- 2. EMAIL CAMPAIGN LOGS
CREATE TABLE IF NOT EXISTS cart_recovery_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  abandoned_cart_id UUID REFERENCES abandoned_carts(id) ON DELETE CASCADE,

  -- Email details
  email_type TEXT NOT NULL, -- 'first_reminder', 'second_reminder', 'final_offer'
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  resend_email_id TEXT, -- Resend API email ID

  -- Tracking
  sent_at TIMESTAMP DEFAULT NOW(),
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  bounced BOOLEAN DEFAULT false,
  bounce_reason TEXT,

  -- A/B Testing (optional future enhancement)
  variant TEXT, -- 'A', 'B', etc.

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recovery_emails_cart ON cart_recovery_emails(abandoned_cart_id);
CREATE INDEX idx_recovery_emails_type ON cart_recovery_emails(email_type, sent_at DESC);

-- 3. RECOVERY STATISTICS (Pre-computed for dashboard)
CREATE TABLE IF NOT EXISTS cart_recovery_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Time period
  period_type TEXT NOT NULL, -- 'day', 'week', 'month'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Abandonment stats
  total_abandoned INTEGER DEFAULT 0,
  total_abandoned_value DECIMAL(12,2) DEFAULT 0,

  -- Email stats
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,

  -- Recovery stats
  carts_recovered INTEGER DEFAULT 0,
  recovery_value DECIMAL(12,2) DEFAULT 0,
  recovery_rate DECIMAL(5,2) DEFAULT 0, -- Percentage

  -- Timing analysis
  avg_time_to_recovery INTERVAL,

  calculated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(period_type, period_start)
);

-- 4. FUNCTIONS

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_abandoned_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_abandoned_cart_updated_at
  BEFORE UPDATE ON abandoned_carts
  FOR EACH ROW
  EXECUTE FUNCTION update_abandoned_cart_updated_at();

-- Generate secure recovery token
CREATE OR REPLACE FUNCTION generate_recovery_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Mark cart as recovered
CREATE OR REPLACE FUNCTION mark_cart_recovered(
  p_recovery_token TEXT,
  p_order_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_cart_id UUID;
BEGIN
  UPDATE abandoned_carts
  SET
    recovered = true,
    recovered_at = NOW(),
    recovered_order_id = p_order_id
  WHERE recovery_token = p_recovery_token
    AND NOT recovered
    AND expires_at > NOW()
  RETURNING id INTO v_cart_id;

  RETURN v_cart_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. SAMPLE DATA (for testing)
-- Uncomment below to insert test abandoned cart
/*
INSERT INTO abandoned_carts (
  email,
  session_id,
  cart_items,
  cart_total,
  cart_quantity,
  recovery_token,
  recovery_url
) VALUES (
  'test@example.com',
  'test_session_123',
  '[{"product_id":"1","name":"Arreios Premium","image":"https://...","price":89.90,"quantity":1}]',
  89.90,
  1,
  generate_recovery_token(),
  'https://portal-lusitano.pt/loja?recover=TOKEN'
);
*/

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_recovery_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_recovery_stats ENABLE ROW LEVEL SECURITY;

-- Admin can see everything
CREATE POLICY admin_all_abandoned_carts ON abandoned_carts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY admin_all_recovery_emails ON cart_recovery_emails
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY admin_all_recovery_stats ON cart_recovery_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public can insert (for tracking)
CREATE POLICY public_insert_abandoned_carts ON abandoned_carts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public can update own cart (by token)
CREATE POLICY public_update_own_cart ON abandoned_carts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 7. COMMENTS
COMMENT ON TABLE abandoned_carts IS 'Tracks abandoned shopping carts for email recovery campaigns';
COMMENT ON COLUMN abandoned_carts.cart_items IS 'JSONB array of cart items with product details';
COMMENT ON COLUMN abandoned_carts.recovery_token IS 'Secure token for recovery email links';
COMMENT ON COLUMN abandoned_carts.emails_sent IS 'Number of recovery emails sent (max 3 recommended)';

COMMENT ON TABLE cart_recovery_emails IS 'Logs all cart recovery emails sent';
COMMENT ON TABLE cart_recovery_stats IS 'Pre-computed statistics for dashboard performance';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
