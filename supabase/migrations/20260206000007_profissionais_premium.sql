-- Sistema SUPER PROFISSIONAL de Gestão de Profissionais
-- Preços ajustados: Bronze €10/mês, Prata €20/mês, Ouro €40/mês

-- Tabela principal de profissionais
CREATE TABLE IF NOT EXISTS profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Informação básica
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL, -- 'veterinario', 'treinador', 'ferrador', 'nutricionista', 'fisioterapeuta', 'outro'
  especialidade TEXT,
  titulo_profissional TEXT, -- Ex: "Dr.", "Mestre", etc
  descricao_curta TEXT, -- 160 caracteres para SEO
  descricao_completa TEXT,
  anos_experiencia INTEGER,

  -- Localização e zona de atuação
  morada TEXT,
  cidade TEXT,
  distrito TEXT,
  codigo_postal TEXT,
  pais TEXT DEFAULT 'Portugal',
  zonas_atuacao TEXT[], -- Distritos onde atua
  raio_deslocacao INTEGER, -- Em km
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
  portfolio JSONB DEFAULT '[]'::jsonb, -- [{url, titulo, descricao, antes_depois, order}]
  videos JSONB DEFAULT '[]'::jsonb, -- [{url, titulo, plataforma}]

  -- Informação profissional AVANÇADA
  formacao_academica TEXT,
  certificacoes JSONB DEFAULT '[]'::jsonb, -- [{nome, entidade, ano, url_certificado, verificado}]
  premios_reconhecimentos TEXT[],
  linguas TEXT[] DEFAULT ARRAY['Português'],
  especialidades_detalhadas TEXT[],
  servicos_oferecidos JSONB DEFAULT '[]'::jsonb, -- [{nome, descricao, preco_desde, duracao}]

  -- Horário e disponibilidade
  horario_atendimento JSONB DEFAULT '{}'::jsonb, -- {segunda: "9h-18h", ...}
  disponibilidade_urgencias BOOLEAN DEFAULT false,
  tempo_resposta_medio TEXT, -- "< 24h", "< 48h"

  -- Planos e subscrição (PREÇOS AJUSTADOS)
  plano TEXT DEFAULT 'gratis', -- 'gratis', 'bronze' (€10), 'prata' (€20), 'ouro' (€40)
  plano_valor DECIMAL(10, 2) DEFAULT 0,
  plano_inicio TIMESTAMP,
  plano_fim TIMESTAMP,
  plano_ativo BOOLEAN DEFAULT false,
  plano_renovacao_automatica BOOLEAN DEFAULT false,
  plano_metodo_pagamento TEXT, -- 'stripe', 'mbway', 'transferencia'

  -- Features premium por plano
  -- Bronze (€10): Perfil completo, contacto direto, 3 fotos portfolio
  -- Prata (€20): + Badge verificado, galeria ilimitada, analytics básico, destaque
  -- Ouro (€40): + Topo lista, analytics avançado, lead generation, reviews, vídeos

  -- Status e verificação
  status TEXT DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado', 'suspenso'
  verificado BOOLEAN DEFAULT false, -- Badge de verificado (só Prata/Ouro)
  verificado_em TIMESTAMP,
  verificado_por TEXT,
  destaque BOOLEAN DEFAULT false,
  ordem_destaque INTEGER DEFAULT 0,

  -- Analytics e performance
  views_count INTEGER DEFAULT 0,
  profile_views_last_30d INTEGER DEFAULT 0,
  clicks_telefone INTEGER DEFAULT 0,
  clicks_email INTEGER DEFAULT 0,
  clicks_whatsapp INTEGER DEFAULT 0,
  clicks_website INTEGER DEFAULT 0,
  leads_gerados INTEGER DEFAULT 0, -- Quantas pessoas contactaram

  -- Avaliações e reviews
  rating_average DECIMAL(3, 2) DEFAULT 0, -- Média de 0 a 5
  rating_count INTEGER DEFAULT 0,
  reviews_aprovadas INTEGER DEFAULT 0,

  -- SEO otimizado
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

  -- Soft delete
  deleted_at TIMESTAMP,
  deleted_by TEXT
);

-- Tabela de reviews/avaliações de clientes
CREATE TABLE IF NOT EXISTS profissionais_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,

  -- Cliente que avaliou
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefone TEXT,

  -- Avaliação
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  titulo TEXT,
  comentario TEXT NOT NULL,
  servico_utilizado TEXT, -- Qual serviço foi avaliado

  -- Moderação
  status TEXT DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado'
  moderado_em TIMESTAMP,
  moderado_por TEXT,
  motivo_rejeicao TEXT,

  -- Resposta do profissional
  resposta_profissional TEXT,
  respondido_em TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de leads (contactos recebidos)
CREATE TABLE IF NOT EXISTS profissionais_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,

  -- Cliente interessado
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  servico_interesse TEXT,
  urgencia TEXT, -- 'baixa', 'media', 'alta'

  -- Tracking
  origem TEXT, -- 'perfil', 'search', 'destaque'
  ip_address TEXT,
  user_agent TEXT,

  -- Status de follow-up
  status TEXT DEFAULT 'novo', -- 'novo', 'contactado', 'convertido', 'perdido'
  notas_profissional TEXT,
  contactado_em TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de analytics diário (para dashboard do profissional)
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

-- Índices otimizados
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

-- Trigger para atualizar rating médio quando há nova review
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

-- Todos podem ver profissionais aprovados
CREATE POLICY "Profissionais aprovados visíveis"
  ON profissionais FOR SELECT
  USING (status = 'aprovado' AND deleted_at IS NULL);

-- Todos podem ver reviews aprovadas
CREATE POLICY "Reviews aprovadas visíveis"
  ON profissionais_reviews FOR SELECT
  USING (status = 'aprovado');

-- Admin acesso total
CREATE POLICY "Admin acesso total profissionais"
  ON profissionais FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "Admin acesso total reviews"
  ON profissionais_reviews FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "Admin acesso total leads"
  ON profissionais_leads FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));
