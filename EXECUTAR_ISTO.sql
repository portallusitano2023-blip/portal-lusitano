-- ===================================================================
-- PORTAL LUSITANO - COPIA TUDO E COLA NO SUPABASE SQL EDITOR
-- ===================================================================

-- 1. ADMIN LOGS
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
  severity TEXT DEFAULT 'info',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_admin ON admin_activity_logs(admin_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_created ON admin_activity_logs(created_at DESC);


-- 2. CUPÕES DE DESCONTO
-- ===================================================================

CREATE TABLE IF NOT EXISTS cupoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT,
  tipo_desconto TEXT NOT NULL,
  valor_desconto DECIMAL(10, 2) NOT NULL,
  aplica_a TEXT[] DEFAULT ARRAY['all'],
  uso_maximo INTEGER,
  uso_atual INTEGER DEFAULT 0,
  data_inicio TIMESTAMP DEFAULT NOW(),
  data_fim TIMESTAMP,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cupoes_uso_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cupao_id UUID REFERENCES cupoes(id),
  cliente_email TEXT NOT NULL,
  valor_desconto DECIMAL(10, 2) NOT NULL,
  usado_em TIMESTAMP DEFAULT NOW()
);


-- 3. PROFISSIONAIS PREMIUM (€10/€20/€40)
-- ===================================================================

CREATE TABLE IF NOT EXISTS profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE,
  tipo TEXT NOT NULL,
  especialidade TEXT,
  descricao TEXT,
  cidade TEXT,
  distrito TEXT,
  telefone TEXT,
  telemovel TEXT,
  email TEXT,
  website TEXT,
  foto_perfil_url TEXT,
  portfolio JSONB DEFAULT '[]'::jsonb,
  certificacoes JSONB DEFAULT '[]'::jsonb,
  plano TEXT DEFAULT 'gratis',
  plano_valor DECIMAL(10, 2) DEFAULT 0,
  plano_inicio TIMESTAMP,
  plano_fim TIMESTAMP,
  plano_ativo BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pendente',
  verificado BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  leads_gerados INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profissionais_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id),
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comentario TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profissionais_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  status TEXT DEFAULT 'novo',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profissionais_slug ON profissionais(slug);
CREATE INDEX IF NOT EXISTS idx_profissionais_tipo ON profissionais(tipo);
CREATE INDEX IF NOT EXISTS idx_profissionais_plano ON profissionais(plano, plano_ativo);


-- ===================================================================
-- PRONTO! Tudo executado!
-- ===================================================================
