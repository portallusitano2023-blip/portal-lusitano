-- Criar tabela de leads do CRM (pipeline de vendas)
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Informação do lead
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  company TEXT,

  -- Pipeline stage
  stage TEXT NOT NULL DEFAULT 'novo', -- 'novo', 'contactado', 'qualificado', 'proposta', 'negociacao', 'ganho', 'perdido'

  -- Valor estimado
  estimated_value INTEGER DEFAULT 0, -- Em cêntimos
  probability INTEGER DEFAULT 50, -- 0-100%

  -- Origem
  source TEXT, -- utm_source ou outro
  source_type TEXT, -- 'vender_cavalo', 'publicidade', 'instagram', 'direto'

  -- Detalhes
  notes TEXT,
  interests TEXT, -- Ex: "cavalo dressage", "publicidade Instagram"
  budget_min INTEGER,
  budget_max INTEGER,

  -- Follow-up
  next_follow_up TIMESTAMP,
  last_contact TIMESTAMP,
  contact_count INTEGER DEFAULT 0,

  -- Resultado final (se perdido ou ganho)
  outcome_reason TEXT, -- Razão de ganho/perda
  actual_value INTEGER, -- Valor real se ganho

  -- Ligações
  related_contact_id UUID, -- ID do contact_submission
  related_payment_id UUID, -- ID do payment se converteu

  -- Admin responsável
  owner_email TEXT NOT NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP -- Quando movido para ganho/perdido
);

-- Criar índices para performance
CREATE INDEX idx_crm_leads_stage ON crm_leads(stage);
CREATE INDEX idx_crm_leads_owner ON crm_leads(owner_email, created_at DESC);
CREATE INDEX idx_crm_leads_next_followup ON crm_leads(next_follow_up);
CREATE INDEX idx_crm_leads_email ON crm_leads(email);

-- RLS policies (admin only)
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can do everything on CRM leads"
  ON crm_leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_crm_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();

  -- Se mudou para ganho/perdido, atualizar closed_at
  IF NEW.stage IN ('ganho', 'perdido') AND OLD.stage NOT IN ('ganho', 'perdido') THEN
    NEW.closed_at = NOW();
  END IF;

  -- Se mudou de ganho/perdido para outro stage, limpar closed_at
  IF NEW.stage NOT IN ('ganho', 'perdido') AND OLD.stage IN ('ganho', 'perdido') THEN
    NEW.closed_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER crm_leads_updated_at
  BEFORE UPDATE ON crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_leads_updated_at();

-- Inserir alguns leads de exemplo
INSERT INTO crm_leads (name, email, telefone, stage, estimated_value, probability, source_type, interests, notes, budget_min, budget_max, next_follow_up, owner_email)
VALUES
  ('João Silva', 'joao.silva@exemplo.com', '+351 912 345 678', 'qualificado', 1500000, 70, 'vender_cavalo', 'Cavalo PRE para dressage', 'Cliente sério, quer comprar até março', 1000000, 2000000, NOW() + INTERVAL '2 days', 'portal.lusitano2023@gmail.com'),
  ('Maria Costa', 'maria.costa@exemplo.com', '+351 918 765 432', 'proposta', 75000, 60, 'publicidade', 'Campanha Instagram 3 meses', 'Coudelaria com 50 cavalos', 50000, 100000, NOW() + INTERVAL '1 day', 'portal.lusitano2023@gmail.com'),
  ('Pedro Santos', 'pedro.santos@exemplo.com', '+351 935 123 456', 'contactado', 4900, 40, 'vender_cavalo', 'Vender cavalo de ensino', 'Respondeu ao primeiro email', NULL, NULL, NOW() + INTERVAL '5 days', 'portal.lusitano2023@gmail.com'),
  ('Ana Rodrigues', 'ana.rodrigues@exemplo.com', NULL, 'novo', 200000, 30, 'instagram', 'Instagram marketing premium', 'Pediu orçamento via Instagram', 150000, 250000, NOW() + INTERVAL '1 day', 'portal.lusitano2023@gmail.com'),
  ('Carlos Mendes', 'carlos.mendes@exemplo.com', '+351 966 789 123', 'negociacao', 3000000, 80, 'vender_cavalo', 'Cavalo competição internacional', 'Negociação avançada, quer visitar coudelaria', 2500000, 3500000, NOW() + INTERVAL '3 days', 'portal.lusitano2023@gmail.com');

COMMENT ON TABLE crm_leads IS 'Leads do CRM para gestão de pipeline de vendas';
COMMENT ON COLUMN crm_leads.stage IS 'Estágio no pipeline: novo, contactado, qualificado, proposta, negociacao, ganho, perdido';
COMMENT ON COLUMN crm_leads.estimated_value IS 'Valor estimado da venda em cêntimos';
COMMENT ON COLUMN crm_leads.probability IS 'Probabilidade de conversão (0-100%)';
