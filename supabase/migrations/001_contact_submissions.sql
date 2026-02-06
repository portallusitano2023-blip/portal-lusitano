-- ========================================
-- MIGRAÇÃO 001: Sistema de Contactos Centralizado
-- Previne perda de dados dos formulários
-- ========================================

-- 1. Criar tabela de contactos
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Metadata da submissão
  form_type TEXT NOT NULL, -- 'vender_cavalo', 'publicidade', 'instagram', 'contact_general'
  session_id TEXT, -- Para tracking de forms multi-step

  -- Informação de contacto
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  company TEXT,

  -- Dados do formulário (flexível JSONB para diferentes tipos)
  form_data JSONB NOT NULL DEFAULT '{}',

  -- Gestão de estado
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'lido', 'em_progresso', 'respondido', 'arquivado')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('baixa', 'normal', 'alta', 'urgente')),
  assigned_to TEXT,

  -- Tags para organização
  tags TEXT[] DEFAULT '{}',

  -- Comunicação
  admin_notes TEXT,
  admin_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by TEXT,

  -- Ligações a outras entidades
  payment_id UUID,
  cavalo_id UUID,

  -- Tracking de origem
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_contact_form_type ON contact_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_priority ON contact_submissions(priority, status);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_assigned ON contact_submissions(assigned_to) WHERE assigned_to IS NOT NULL;

-- 3. Criar índice de full-text search (português)
CREATE INDEX IF NOT EXISTS idx_contact_search ON contact_submissions
  USING gin(to_tsvector('portuguese',
    COALESCE(name, '') || ' ' ||
    COALESCE(email, '') || ' ' ||
    COALESCE(company, '') || ' ' ||
    COALESCE(admin_notes, '')
  ));

-- 4. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para updated_at
DROP TRIGGER IF EXISTS tr_contact_updated ON contact_submissions;
CREATE TRIGGER tr_contact_updated
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. Comentários explicativos
COMMENT ON TABLE contact_submissions IS 'Centraliza todos os contactos recebidos via formulários do site (vender cavalo, publicidade, Instagram, etc.)';
COMMENT ON COLUMN contact_submissions.form_type IS 'Tipo de formulário: vender_cavalo, publicidade, instagram, contact_general';
COMMENT ON COLUMN contact_submissions.form_data IS 'Dados completos do formulário em JSONB para flexibilidade';
COMMENT ON COLUMN contact_submissions.status IS 'Workflow: novo → lido → em_progresso → respondido → arquivado';
COMMENT ON COLUMN contact_submissions.payment_id IS 'Ligação ao pagamento Stripe se aplicável';
COMMENT ON COLUMN contact_submissions.cavalo_id IS 'Ligação ao anúncio de cavalo criado (se aplicável)';

-- 7. Row Level Security (RLS) - acesso apenas via service role
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 8. Policy para permitir tudo via service role (APIs protegidas por auth admin)
CREATE POLICY "Allow all for service role" ON contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
