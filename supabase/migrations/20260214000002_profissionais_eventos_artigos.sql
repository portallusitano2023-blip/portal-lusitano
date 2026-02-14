-- Tabela de eventos criados por profissionais
CREATE TABLE IF NOT EXISTS profissionais_eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('clinica', 'workshop', 'conferencia', 'curso', 'webinar')),
  descricao TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  local TEXT,
  pais TEXT,
  online BOOLEAN DEFAULT false,
  link_inscricao TEXT,
  preco TEXT,
  vagas INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de artigos escritos por profissionais
CREATE TABLE IF NOT EXISTS profissionais_artigos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  resumo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  leituras INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_prof_eventos_prof ON profissionais_eventos(profissional_id);
CREATE INDEX IF NOT EXISTS idx_prof_eventos_data ON profissionais_eventos(data_inicio DESC);
CREATE INDEX IF NOT EXISTS idx_prof_artigos_prof ON profissionais_artigos(profissional_id);
CREATE INDEX IF NOT EXISTS idx_prof_artigos_created ON profissionais_artigos(created_at DESC);

-- RLS
ALTER TABLE profissionais_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais_artigos ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Public can view events" ON profissionais_eventos
  FOR SELECT USING (true);

CREATE POLICY "Public can view articles" ON profissionais_artigos
  FOR SELECT USING (true);

-- Admin acesso total
CREATE POLICY "Admin full access events" ON profissionais_eventos
  FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "Admin full access articles" ON profissionais_artigos
  FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));
