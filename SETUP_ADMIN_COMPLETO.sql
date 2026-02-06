-- ============================================
-- SETUP COMPLETO ADMIN PORTAL LUSITANO
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. CRIAR TABELA payments PRIMEIRO (se não existir)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  email TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending',
  description TEXT,
  product_type TEXT,
  product_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MELHORAR TABELA payments (adicionar colunas se não existirem)
DO $$
BEGIN
  -- Adicionar colunas se não existirem
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'product_type') THEN
    ALTER TABLE public.payments ADD COLUMN product_type TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'product_metadata') THEN
    ALTER TABLE public.payments ADD COLUMN product_metadata JSONB DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'stripe_session_id') THEN
    ALTER TABLE public.payments ADD COLUMN stripe_session_id TEXT;
  END IF;
END $$;

-- Índices para payments
CREATE INDEX IF NOT EXISTS idx_payments_product_type ON public.payments(product_type);
CREATE INDEX IF NOT EXISTS idx_payments_date_status ON public.payments(created_at DESC, status);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 3. CRIAR TABELA contact_submissions (Inbox de Mensagens)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Dados básicos
  form_type TEXT NOT NULL, -- 'vender_cavalo', 'publicidade', 'instagram', 'contact_general'
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  company TEXT,
  form_data JSONB NOT NULL DEFAULT '{}',

  -- Gestão de estado
  status TEXT DEFAULT 'novo', -- 'novo', 'lido', 'respondido', 'arquivado'
  priority TEXT DEFAULT 'normal', -- 'baixa', 'normal', 'alta', 'urgente'
  tags TEXT[],
  admin_notes TEXT,
  admin_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by TEXT,
  assigned_to TEXT,

  -- Ligações
  payment_id UUID,
  cavalo_id UUID,

  -- Tracking
  ip_address TEXT,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE
);

-- Índices para contact_submissions
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_form_type ON public.contact_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_contact_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_submissions(created_at DESC);

-- 4. CRIAR TABELA leads (se não existir)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nome TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at DESC);

-- 5. RLS (Row Level Security) - Permitir tudo para service role
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy para permitir tudo via service role (usado no admin)
DROP POLICY IF EXISTS "Enable all for service role" ON public.contact_submissions;
CREATE POLICY "Enable all for service role" ON public.contact_submissions
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for service role" ON public.payments;
CREATE POLICY "Enable all for service role" ON public.payments
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for service role" ON public.leads;
CREATE POLICY "Enable all for service role" ON public.leads
  FOR ALL USING (true);

-- 6. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SETUP
-- ============================================

-- Verificar se tudo foi criado corretamente
SELECT 'contact_submissions' as tabela, count(*) as registos FROM public.contact_submissions
UNION ALL
SELECT 'payments' as tabela, count(*) as registos FROM public.payments
UNION ALL
SELECT 'leads' as tabela, count(*) as registos FROM public.leads;
