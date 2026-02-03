-- =============================================
-- TABELA EXPANDIDA: coudelarias v2
-- Sistema Completo de Diretório de Coudelarias
-- =============================================

-- Adicionar novas colunas à tabela existente
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS ano_fundacao INTEGER;
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS historia TEXT;
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS linhagens TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS premios TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS servicos TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS horario VARCHAR(255);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS facebook VARCHAR(255);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS youtube VARCHAR(255);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS foto_capa VARCHAR(500);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS galeria TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS cavalos_destaque JSONB DEFAULT '[]';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS testemunhos JSONB DEFAULT '[]';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT FALSE;
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS ordem_destaque INTEGER DEFAULT 0;

-- Índice para coudelarias em destaque
CREATE INDEX IF NOT EXISTS idx_coudelarias_destaque ON coudelarias(destaque, ordem_destaque);
