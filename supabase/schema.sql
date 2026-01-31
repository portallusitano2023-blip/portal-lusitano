-- ============================================================================
-- PORTAL LUSITANO - SCHEMA SUPABASE
-- ============================================================================
-- Executar este SQL no Supabase Dashboard > SQL Editor
-- ============================================================================

-- 1. LEADS (Ebook Downloads + Newsletter)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'free-ebook',
  sequence_step INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  converted_to_pro BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_sequence ON public.leads(sequence_step, status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON public.leads(utm_source) WHERE utm_source IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_active ON public.leads(status, converted_to_pro) WHERE status = 'active';

-- 2. SUBSCRIPTIONS (PRO Members)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  billing_period TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  coupon_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON public.subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON public.subscriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON public.subscriptions(plan_id, status);

-- 3. CONSULTATION_TICKETS
CREATE TABLE IF NOT EXISTS public.consultation_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT UNIQUE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_plan TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.consultation_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_user_email ON public.consultation_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.consultation_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.consultation_tickets(priority, status);

-- 4. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_payment_intent_id TEXT UNIQUE,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- 5. Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

CREATE TRIGGER tr_leads_updated BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_subs_updated BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_tickets_updated BEFORE UPDATE ON public.consultation_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
