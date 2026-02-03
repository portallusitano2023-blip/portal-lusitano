-- =============================================
-- TABELA: coudelarias
-- Diretório de Coudelarias do Portal Lusitano
-- =============================================

-- Criar tabela de coudelarias
CREATE TABLE IF NOT EXISTS coudelarias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Informações básicas
  nome VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descricao TEXT NOT NULL,

  -- Localização
  localizacao VARCHAR(255) NOT NULL,
  regiao VARCHAR(100) NOT NULL,

  -- Contactos (só visíveis para PRO)
  telefone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  instagram VARCHAR(100),

  -- Detalhes
  num_cavalos INTEGER,
  especialidades TEXT[] DEFAULT '{}',
  logo VARCHAR(500),
  fotos TEXT[] DEFAULT '{}',

  -- Plano e status
  plan VARCHAR(50) DEFAULT 'gratuito', -- 'gratuito', 'pro', 'pro_instagram'
  is_pro BOOLEAN DEFAULT FALSE,
  has_instagram_promo BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'inactive'

  -- Stripe (para subscrições)
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),

  -- Estatísticas
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- Para planos PRO
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_coudelarias_slug ON coudelarias(slug);
CREATE INDEX IF NOT EXISTS idx_coudelarias_regiao ON coudelarias(regiao);
CREATE INDEX IF NOT EXISTS idx_coudelarias_is_pro ON coudelarias(is_pro);
CREATE INDEX IF NOT EXISTS idx_coudelarias_status ON coudelarias(status);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coudelarias_updated_at
  BEFORE UPDATE ON coudelarias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE coudelarias ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública de coudelarias ativas
CREATE POLICY "Coudelarias ativas são públicas" ON coudelarias
  FOR SELECT
  USING (status = 'active');

-- Permitir inserção via API (service role)
CREATE POLICY "Service role pode inserir" ON coudelarias
  FOR INSERT
  WITH CHECK (true);

-- Permitir atualização via API (service role)
CREATE POLICY "Service role pode atualizar" ON coudelarias
  FOR UPDATE
  USING (true);

-- =============================================
-- DADOS DE EXEMPLO (opcional - remove se não quiseres)
-- =============================================

INSERT INTO coudelarias (nome, slug, descricao, localizacao, regiao, telefone, email, website, instagram, num_cavalos, especialidades, is_pro, has_instagram_promo, status, plan)
VALUES
(
  'Coudelaria Vale do Tejo',
  'vale-do-tejo',
  'Criação de cavalos Lusitanos de alta linhagem desde 1985. Especialistas em cavalos para Dressage e Alta Escola.',
  'Santarém',
  'Ribatejo',
  '+351 912 345 678',
  'info@valedotejo.pt',
  'https://valedotejo.pt',
  '@valedotejo_lusitanos',
  45,
  ARRAY['Dressage', 'Alta Escola', 'Reprodução'],
  true,
  true,
  'active',
  'pro_instagram'
),
(
  'Herdade dos Lusitanos',
  'herdade-dos-lusitanos',
  'Coudelaria familiar dedicada à preservação das linhagens tradicionais do Puro Sangue Lusitano.',
  'Évora',
  'Alentejo',
  '+351 923 456 789',
  'geral@herdadelusitanos.pt',
  NULL,
  NULL,
  32,
  ARRAY['Equitação de Trabalho', 'Toureio'],
  true,
  false,
  'active',
  'pro'
),
(
  'Quinta da Serra',
  'quinta-da-serra',
  'Pequena coudelaria focada em qualidade. Cavalos para lazer e competição.',
  'Sintra',
  'Lisboa',
  NULL,
  'quinta.serra@email.pt',
  NULL,
  NULL,
  12,
  ARRAY['Lazer', 'Saltos'],
  false,
  false,
  'active',
  'gratuito'
);

-- =============================================
-- VERIFICAR SE FUNCIONOU
-- =============================================
-- SELECT * FROM coudelarias;
