-- Sistema SIMPLIFICADO de Coudelarias (SEM PAGAMENTOS - Apenas informação grátis)

-- Criar tabela de coudelarias (versão simplificada)
CREATE TABLE IF NOT EXISTS coudelarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Informação básica
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  historia TEXT,
  especialidades TEXT[], -- Ex: ['Dressage', 'Working Equitation']

  -- Localização
  morada TEXT,
  cidade TEXT,
  distrito TEXT,
  codigo_postal TEXT,
  pais TEXT DEFAULT 'Portugal',

  -- Contactos
  telefone TEXT,
  telemovel TEXT,
  email TEXT,
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  youtube TEXT,

  -- Imagens
  logo_url TEXT,
  banner_url TEXT,
  galeria JSONB DEFAULT '[]'::jsonb,

  -- Informação adicional
  ano_fundacao INTEGER,
  numero_cavalos INTEGER,
  area_hectares DECIMAL(10, 2),

  -- Status e gestão (SEM PLANOS PAGOS)
  status TEXT DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado'
  destaque BOOLEAN DEFAULT false, -- Admin pode destacar gratuitamente
  ordem_destaque INTEGER DEFAULT 0,

  -- Proprietário
  proprietario_nome TEXT,
  proprietario_email TEXT,
  proprietario_telefone TEXT,

  -- Analytics
  views_count INTEGER DEFAULT 0,
  clicks_telefone INTEGER DEFAULT 0,
  clicks_email INTEGER DEFAULT 0,
  clicks_website INTEGER DEFAULT 0,

  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by TEXT,

  -- Soft delete
  deleted_at TIMESTAMP,
  deleted_by TEXT
);

-- Índices
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

-- Trigger para gerar slug
DROP TRIGGER IF EXISTS set_coudelaria_slug ON coudelarias;
CREATE TRIGGER set_coudelaria_slug
  BEFORE INSERT OR UPDATE OF nome ON coudelarias
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_coudelaria_slug();

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_coudelarias_updated_at ON coudelarias;
CREATE TRIGGER update_coudelarias_updated_at
  BEFORE UPDATE ON coudelarias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE coudelarias ENABLE ROW LEVEL SECURITY;

-- Policy: Todos podem ver coudelarias aprovadas
CREATE POLICY "Coudelarias aprovadas visíveis para todos"
  ON coudelarias FOR SELECT
  USING (status = 'aprovado' AND deleted_at IS NULL);

-- Policy: Admin pode fazer tudo
CREATE POLICY "Admin acesso total coudelarias"
  ON coudelarias FOR ALL
  USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM admin_users
  ));
