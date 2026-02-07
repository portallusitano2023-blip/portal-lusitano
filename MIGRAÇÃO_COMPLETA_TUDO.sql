-- ===================================================================
-- PORTAL LUSITANO - MIGRAÇÃO ULTRA COMPLETA
-- Sistema Admin COMPLETO - Copia TUDO e executa de uma vez
-- ===================================================================

-- ===================================================================
-- 1. ADMIN USERS (Base de tudo)
-- ===================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  role TEXT DEFAULT 'admin',
  ativo BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO admin_users (email, nome, role, ativo)
VALUES ('portal.lusitano2023@gmail.com', 'Portal Lusitano Admin', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email) WHERE ativo = true;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins podem ver admin_users" ON admin_users;
CREATE POLICY "Admins podem ver admin_users"
  ON admin_users FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');


-- ===================================================================
-- 2. VIEWS COUNT (Analytics)
-- ===================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cavalos_venda' AND column_name = 'views_count'
  ) THEN
    ALTER TABLE cavalos_venda ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'eventos' AND column_name = 'views_count'
  ) THEN
    ALTER TABLE eventos ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_cavalos_venda_views_count ON cavalos_venda(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_views_count ON eventos(views_count DESC);

UPDATE cavalos_venda SET views_count = 0 WHERE views_count IS NULL;
UPDATE eventos SET views_count = 0 WHERE views_count IS NULL;


-- ===================================================================
-- 3. COUDELARIAS (Diretório GRÁTIS)
-- ===================================================================

CREATE TABLE IF NOT EXISTS coudelarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  historia TEXT,
  especialidades TEXT[],
  morada TEXT,
  cidade TEXT,
  distrito TEXT,
  codigo_postal TEXT,
  pais TEXT DEFAULT 'Portugal',
  telefone TEXT,
  telemovel TEXT,
  email TEXT,
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  youtube TEXT,
  logo_url TEXT,
  banner_url TEXT,
  galeria JSONB DEFAULT '[]'::jsonb,
  ano_fundacao INTEGER,
  numero_cavalos INTEGER,
  area_hectares DECIMAL(10, 2),
  status TEXT DEFAULT 'pendente',
  destaque BOOLEAN DEFAULT false,
  ordem_destaque INTEGER DEFAULT 0,
  proprietario_nome TEXT,
  proprietario_email TEXT,
  proprietario_telefone TEXT,
  views_count INTEGER DEFAULT 0,
  clicks_telefone INTEGER DEFAULT 0,
  clicks_email INTEGER DEFAULT 0,
  clicks_website INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by TEXT,
  deleted_at TIMESTAMP,
  deleted_by TEXT
);

-- Adicionar colunas se não existirem (para tabelas existentes)
DO $$
BEGIN
  -- Colunas básicas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'slug') THEN
    ALTER TABLE coudelarias ADD COLUMN slug TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'historia') THEN
    ALTER TABLE coudelarias ADD COLUMN historia TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'especialidades') THEN
    ALTER TABLE coudelarias ADD COLUMN especialidades TEXT[];
  END IF;

  -- Localização
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'distrito') THEN
    ALTER TABLE coudelarias ADD COLUMN distrito TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'codigo_postal') THEN
    ALTER TABLE coudelarias ADD COLUMN codigo_postal TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'pais') THEN
    ALTER TABLE coudelarias ADD COLUMN pais TEXT DEFAULT 'Portugal';
  END IF;

  -- Contactos
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'facebook') THEN
    ALTER TABLE coudelarias ADD COLUMN facebook TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'youtube') THEN
    ALTER TABLE coudelarias ADD COLUMN youtube TEXT;
  END IF;

  -- Imagens
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'logo_url') THEN
    ALTER TABLE coudelarias ADD COLUMN logo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'banner_url') THEN
    ALTER TABLE coudelarias ADD COLUMN banner_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'galeria') THEN
    ALTER TABLE coudelarias ADD COLUMN galeria JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Info adicional
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'ano_fundacao') THEN
    ALTER TABLE coudelarias ADD COLUMN ano_fundacao INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'numero_cavalos') THEN
    ALTER TABLE coudelarias ADD COLUMN numero_cavalos INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'area_hectares') THEN
    ALTER TABLE coudelarias ADD COLUMN area_hectares DECIMAL(10, 2);
  END IF;

  -- Status e destaque
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'destaque') THEN
    ALTER TABLE coudelarias ADD COLUMN destaque BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'ordem_destaque') THEN
    ALTER TABLE coudelarias ADD COLUMN ordem_destaque INTEGER DEFAULT 0;
  END IF;

  -- Proprietário
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'proprietario_nome') THEN
    ALTER TABLE coudelarias ADD COLUMN proprietario_nome TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'proprietario_email') THEN
    ALTER TABLE coudelarias ADD COLUMN proprietario_email TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'proprietario_telefone') THEN
    ALTER TABLE coudelarias ADD COLUMN proprietario_telefone TEXT;
  END IF;

  -- Analytics
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'views_count') THEN
    ALTER TABLE coudelarias ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'clicks_telefone') THEN
    ALTER TABLE coudelarias ADD COLUMN clicks_telefone INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'clicks_email') THEN
    ALTER TABLE coudelarias ADD COLUMN clicks_email INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'clicks_website') THEN
    ALTER TABLE coudelarias ADD COLUMN clicks_website INTEGER DEFAULT 0;
  END IF;

  -- Aprovação
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'approved_at') THEN
    ALTER TABLE coudelarias ADD COLUMN approved_at TIMESTAMP;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'approved_by') THEN
    ALTER TABLE coudelarias ADD COLUMN approved_by TEXT;
  END IF;

  -- Soft delete
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'deleted_at') THEN
    ALTER TABLE coudelarias ADD COLUMN deleted_at TIMESTAMP;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coudelarias' AND column_name = 'deleted_by') THEN
    ALTER TABLE coudelarias ADD COLUMN deleted_by TEXT;
  END IF;
END $$;

-- Atualizar slug se necessário
UPDATE coudelarias SET slug = lower(regexp_replace(nome, '[^a-zA-Z0-9\s-]', '', 'g'))
WHERE slug IS NULL OR slug = '';

-- Tornar slug unique (criar constraint se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'coudelarias_slug_key'
  ) THEN
    ALTER TABLE coudelarias ADD CONSTRAINT coudelarias_slug_key UNIQUE (slug);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_coudelarias_slug ON coudelarias(slug);
CREATE INDEX IF NOT EXISTS idx_coudelarias_status ON coudelarias(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_coudelarias_destaque ON coudelarias(destaque, ordem_destaque) WHERE status = 'aprovado' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_coudelarias_distrito ON coudelarias(distrito) WHERE status = 'aprovado' AND deleted_at IS NULL;

-- Função para gerar slug
CREATE OR REPLACE FUNCTION generate_coudelaria_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(regexp_replace(NEW.nome, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM coudelarias WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_coudelaria_slug ON coudelarias;
CREATE TRIGGER set_coudelaria_slug
  BEFORE INSERT OR UPDATE OF nome ON coudelarias
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_coudelaria_slug();

-- Função para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_coudelarias_updated_at ON coudelarias;
CREATE TRIGGER update_coudelarias_updated_at
  BEFORE UPDATE ON coudelarias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE coudelarias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Coudelarias aprovadas visíveis para todos" ON coudelarias;
CREATE POLICY "Coudelarias aprovadas visíveis para todos"
  ON coudelarias FOR SELECT
  USING (status = 'aprovado' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Admin acesso total coudelarias" ON coudelarias;
CREATE POLICY "Admin acesso total coudelarias"
  ON coudelarias FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));


-- ===================================================================
-- 4. PROFISSIONAIS PREMIUM (€10/€20/€40) - SISTEMA COMPLETO
-- ===================================================================

CREATE TABLE IF NOT EXISTS profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Info básica
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL,
  especialidade TEXT,
  titulo_profissional TEXT,
  descricao_curta TEXT,
  descricao_completa TEXT,
  anos_experiencia INTEGER,

  -- Localização
  morada TEXT,
  cidade TEXT,
  distrito TEXT,
  codigo_postal TEXT,
  pais TEXT DEFAULT 'Portugal',
  zonas_atuacao TEXT[],
  raio_deslocacao INTEGER,
  aceita_deslocacoes BOOLEAN DEFAULT false,
  valor_deslocacao DECIMAL(10, 2),

  -- Contactos
  telefone TEXT,
  telemovel TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  linkedin TEXT,

  -- Imagens e portfolio
  foto_perfil_url TEXT,
  banner_url TEXT,
  portfolio JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,

  -- Info profissional
  formacao_academica TEXT,
  certificacoes JSONB DEFAULT '[]'::jsonb,
  premios_reconhecimentos TEXT[],
  linguas TEXT[] DEFAULT ARRAY['Português'],
  especialidades_detalhadas TEXT[],
  servicos_oferecidos JSONB DEFAULT '[]'::jsonb,

  -- Horário
  horario_atendimento JSONB DEFAULT '{}'::jsonb,
  disponibilidade_urgencias BOOLEAN DEFAULT false,
  tempo_resposta_medio TEXT,

  -- Planos (PREÇOS AJUSTADOS: €10/€20/€40)
  plano TEXT DEFAULT 'gratis',
  plano_valor DECIMAL(10, 2) DEFAULT 0,
  plano_inicio TIMESTAMP,
  plano_fim TIMESTAMP,
  plano_ativo BOOLEAN DEFAULT false,
  plano_renovacao_automatica BOOLEAN DEFAULT false,
  plano_metodo_pagamento TEXT,

  -- Status
  status TEXT DEFAULT 'pendente',
  verificado BOOLEAN DEFAULT false,
  verificado_em TIMESTAMP,
  verificado_por TEXT,
  destaque BOOLEAN DEFAULT false,
  ordem_destaque INTEGER DEFAULT 0,

  -- Analytics
  views_count INTEGER DEFAULT 0,
  profile_views_last_30d INTEGER DEFAULT 0,
  clicks_telefone INTEGER DEFAULT 0,
  clicks_email INTEGER DEFAULT 0,
  clicks_whatsapp INTEGER DEFAULT 0,
  clicks_website INTEGER DEFAULT 0,
  leads_gerados INTEGER DEFAULT 0,

  -- Reviews
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  reviews_aprovadas INTEGER DEFAULT 0,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  canonical_url TEXT,

  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by TEXT,
  last_activity TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  deleted_by TEXT
);

-- Adicionar colunas se não existirem (para tabelas existentes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profissionais' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE profissionais ADD COLUMN deleted_at TIMESTAMP;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profissionais' AND column_name = 'deleted_by'
  ) THEN
    ALTER TABLE profissionais ADD COLUMN deleted_by TEXT;
  END IF;
END $$;

-- Reviews de clientes
CREATE TABLE IF NOT EXISTS profissionais_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefone TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  titulo TEXT,
  comentario TEXT NOT NULL,
  servico_utilizado TEXT,
  status TEXT DEFAULT 'pendente',
  moderado_em TIMESTAMP,
  moderado_por TEXT,
  motivo_rejeicao TEXT,
  resposta_profissional TEXT,
  respondido_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leads (contactos recebidos)
CREATE TABLE IF NOT EXISTS profissionais_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  servico_interesse TEXT,
  urgencia TEXT,
  origem TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'novo',
  notas_profissional TEXT,
  contactado_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics diário
CREATE TABLE IF NOT EXISTS profissionais_analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  views INTEGER DEFAULT 0,
  clicks_telefone INTEGER DEFAULT 0,
  clicks_email INTEGER DEFAULT 0,
  clicks_whatsapp INTEGER DEFAULT 0,
  clicks_website INTEGER DEFAULT 0,
  leads_gerados INTEGER DEFAULT 0,
  UNIQUE(profissional_id, data)
);

-- Histórico de subscrições
CREATE TABLE IF NOT EXISTS profissionais_subscription_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,
  plano TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  inicio TIMESTAMP NOT NULL,
  fim TIMESTAMP NOT NULL,
  payment_id UUID,
  status TEXT DEFAULT 'ativo',
  renovado_para_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_profissionais_slug ON profissionais(slug);
CREATE INDEX IF NOT EXISTS idx_profissionais_tipo ON profissionais(tipo) WHERE deleted_at IS NULL AND status = 'aprovado';
CREATE INDEX IF NOT EXISTS idx_profissionais_plano_ativo ON profissionais(plano, plano_ativo) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profissionais_destaque ON profissionais(destaque, ordem_destaque, rating_average DESC) WHERE status = 'aprovado' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profissionais_rating ON profissionais(rating_average DESC, rating_count DESC) WHERE status = 'aprovado' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profissionais_distrito ON profissionais(distrito) WHERE status = 'aprovado' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profissionais_zonas ON profissionais USING GIN(zonas_atuacao);

CREATE INDEX IF NOT EXISTS idx_reviews_profissional ON profissionais_reviews(profissional_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_profissional ON profissionais_leads(profissional_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_profissional_data ON profissionais_analytics_daily(profissional_id, data DESC);

-- Função para gerar slug de profissional
CREATE OR REPLACE FUNCTION generate_profissional_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(regexp_replace(NEW.nome, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM profissionais WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profissional_slug ON profissionais;
CREATE TRIGGER set_profissional_slug
  BEFORE INSERT OR UPDATE OF nome ON profissionais
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_profissional_slug();

DROP TRIGGER IF EXISTS update_profissionais_updated_at ON profissionais;
CREATE TRIGGER update_profissionais_updated_at
  BEFORE UPDATE ON profissionais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar rating médio
CREATE OR REPLACE FUNCTION update_profissional_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profissionais
  SET
    rating_average = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM profissionais_reviews
      WHERE profissional_id = NEW.profissional_id AND status = 'aprovado'
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM profissionais_reviews
      WHERE profissional_id = NEW.profissional_id AND status = 'aprovado'
    ),
    reviews_aprovadas = (
      SELECT COUNT(*)
      FROM profissionais_reviews
      WHERE profissional_id = NEW.profissional_id AND status = 'aprovado'
    )
  WHERE id = NEW.profissional_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_rating_on_review ON profissionais_reviews;
CREATE TRIGGER update_rating_on_review
  AFTER INSERT OR UPDATE OF status ON profissionais_reviews
  FOR EACH ROW
  WHEN (NEW.status = 'aprovado')
  EXECUTE FUNCTION update_profissional_rating();

-- Trigger para incrementar leads_gerados
CREATE OR REPLACE FUNCTION increment_leads_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profissionais
  SET leads_gerados = leads_gerados + 1
  WHERE id = NEW.profissional_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_leads ON profissionais_leads;
CREATE TRIGGER increment_leads
  AFTER INSERT ON profissionais_leads
  FOR EACH ROW
  EXECUTE FUNCTION increment_leads_count();

-- RLS Policies
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profissionais aprovados visíveis" ON profissionais;
CREATE POLICY "Profissionais aprovados visíveis"
  ON profissionais FOR SELECT
  USING (status = 'aprovado' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Reviews aprovadas visíveis" ON profissionais_reviews;
CREATE POLICY "Reviews aprovadas visíveis"
  ON profissionais_reviews FOR SELECT
  USING (status = 'aprovado');

DROP POLICY IF EXISTS "Admin acesso total profissionais" ON profissionais;
CREATE POLICY "Admin acesso total profissionais"
  ON profissionais FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "Admin acesso total reviews" ON profissionais_reviews;
CREATE POLICY "Admin acesso total reviews"
  ON profissionais_reviews FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "Admin acesso total leads" ON profissionais_leads;
CREATE POLICY "Admin acesso total leads"
  ON profissionais_leads FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));


-- ===================================================================
-- 5. ADMIN LOGS (Auditoria completa)
-- ===================================================================

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  admin_nome TEXT,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_name TEXT,
  changes JSONB,
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  request_method TEXT,
  request_url TEXT,
  severity TEXT DEFAULT 'info',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_admin ON admin_activity_logs(admin_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_entity ON admin_activity_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_action ON admin_activity_logs(action_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON admin_activity_logs(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_created ON admin_activity_logs(created_at DESC);

-- Função helper para criar logs
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_admin_email TEXT,
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_entity_name TEXT DEFAULT NULL,
  p_changes JSONB DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_activity_logs (
    admin_email, action_type, entity_type, entity_id, entity_name,
    changes, description, severity
  ) VALUES (
    p_admin_email, p_action_type, p_entity_type, p_entity_id, p_entity_name,
    p_changes, p_description, p_severity
  ) RETURNING id INTO log_id;
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin pode ver logs" ON admin_activity_logs;
CREATE POLICY "Admin pode ver logs"
  ON admin_activity_logs FOR SELECT
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));


-- ===================================================================
-- 6. CUPÕES DE DESCONTO
-- ===================================================================

CREATE TABLE IF NOT EXISTS cupoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT,
  tipo_desconto TEXT NOT NULL,
  valor_desconto DECIMAL(10, 2) NOT NULL,
  aplica_a TEXT[] DEFAULT ARRAY['all'],
  valor_minimo DECIMAL(10, 2),
  uso_maximo INTEGER,
  uso_atual INTEGER DEFAULT 0,
  uso_por_cliente INTEGER DEFAULT 1,
  data_inicio TIMESTAMP DEFAULT NOW(),
  data_fim TIMESTAMP,
  ativo BOOLEAN DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cupoes_uso_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cupao_id UUID REFERENCES cupoes(id) ON DELETE CASCADE,
  cliente_email TEXT NOT NULL,
  cliente_nome TEXT,
  payment_id UUID,
  valor_original DECIMAL(10, 2) NOT NULL,
  valor_desconto DECIMAL(10, 2) NOT NULL,
  valor_final DECIMAL(10, 2) NOT NULL,
  produto_tipo TEXT,
  ip_address TEXT,
  usado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cupoes_codigo ON cupoes(codigo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_cupoes_ativo ON cupoes(ativo, data_fim DESC);
CREATE INDEX IF NOT EXISTS idx_cupoes_uso_cupao ON cupoes_uso_historico(cupao_id, usado_em DESC);
CREATE INDEX IF NOT EXISTS idx_cupoes_uso_cliente ON cupoes_uso_historico(cliente_email, usado_em DESC);

-- Função para validar cupão
CREATE OR REPLACE FUNCTION validar_cupao(
  p_codigo TEXT,
  p_cliente_email TEXT,
  p_valor_compra DECIMAL,
  p_produto_tipo TEXT
) RETURNS JSONB AS $$
DECLARE
  cupao RECORD;
  usos_cliente INTEGER;
BEGIN
  SELECT * INTO cupao
  FROM cupoes
  WHERE codigo = p_codigo
    AND ativo = true
    AND (data_inicio IS NULL OR data_inicio <= NOW())
    AND (data_fim IS NULL OR data_fim >= NOW())
    AND (uso_maximo IS NULL OR uso_atual < uso_maximo);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valido', false, 'erro', 'Cupão inválido ou expirado');
  END IF;

  IF NOT ('all' = ANY(cupao.aplica_a) OR p_produto_tipo = ANY(cupao.aplica_a)) THEN
    RETURN jsonb_build_object('valido', false, 'erro', 'Cupão não aplicável a este produto');
  END IF;

  IF cupao.valor_minimo IS NOT NULL AND p_valor_compra < cupao.valor_minimo THEN
    RETURN jsonb_build_object('valido', false, 'erro', format('Valor mínimo: €%.2f', cupao.valor_minimo / 100));
  END IF;

  SELECT COUNT(*) INTO usos_cliente
  FROM cupoes_uso_historico
  WHERE cupao_id = cupao.id AND cliente_email = p_cliente_email;

  IF usos_cliente >= cupao.uso_por_cliente THEN
    RETURN jsonb_build_object('valido', false, 'erro', 'Cupão já usado');
  END IF;

  DECLARE
    valor_desconto DECIMAL;
    valor_final DECIMAL;
  BEGIN
    IF cupao.tipo_desconto = 'percentagem' THEN
      valor_desconto := (p_valor_compra * cupao.valor_desconto / 100);
    ELSE
      valor_desconto := cupao.valor_desconto;
    END IF;

    valor_desconto := LEAST(valor_desconto, p_valor_compra);
    valor_final := p_valor_compra - valor_desconto;

    RETURN jsonb_build_object(
      'valido', true,
      'cupao_id', cupao.id,
      'codigo', cupao.codigo,
      'tipo_desconto', cupao.tipo_desconto,
      'valor_desconto', valor_desconto,
      'valor_final', valor_final,
      'economia', valor_desconto
    );
  END;
END;
$$ LANGUAGE plpgsql;

-- Função para aplicar cupão
CREATE OR REPLACE FUNCTION aplicar_cupao(
  p_cupao_id UUID,
  p_cliente_email TEXT,
  p_cliente_nome TEXT,
  p_payment_id UUID,
  p_valor_original DECIMAL,
  p_valor_desconto DECIMAL,
  p_valor_final DECIMAL,
  p_produto_tipo TEXT,
  p_ip_address TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  uso_id UUID;
BEGIN
  UPDATE cupoes SET uso_atual = uso_atual + 1 WHERE id = p_cupao_id;

  INSERT INTO cupoes_uso_historico (
    cupao_id, cliente_email, cliente_nome, payment_id,
    valor_original, valor_desconto, valor_final, produto_tipo, ip_address
  ) VALUES (
    p_cupao_id, p_cliente_email, p_cliente_nome, p_payment_id,
    p_valor_original, p_valor_desconto, p_valor_final, p_produto_tipo, p_ip_address
  ) RETURNING id INTO uso_id;

  RETURN uso_id;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE cupoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupoes_uso_historico ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin acesso cupoes" ON cupoes;
CREATE POLICY "Admin acesso cupoes"
  ON cupoes FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "Admin acesso historico cupoes" ON cupoes_uso_historico;
CREATE POLICY "Admin acesso historico cupoes"
  ON cupoes_uso_historico FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));


-- ===================================================================
-- ✅ MIGRAÇÃO COMPLETA FINALIZADA!
-- Todas as tabelas, triggers, funções e policies criadas
-- ===================================================================
