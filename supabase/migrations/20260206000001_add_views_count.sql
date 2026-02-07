-- Adicionar coluna views_count às tabelas para tracking de visualizações

-- Adicionar views_count à tabela cavalos_venda (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cavalos_venda' AND column_name = 'views_count'
  ) THEN
    ALTER TABLE cavalos_venda ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Adicionar views_count à tabela eventos (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'eventos' AND column_name = 'views_count'
  ) THEN
    ALTER TABLE eventos ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Criar índices para performance nas queries de top views
CREATE INDEX IF NOT EXISTS idx_cavalos_venda_views_count
  ON cavalos_venda(views_count DESC);

CREATE INDEX IF NOT EXISTS idx_eventos_views_count
  ON eventos(views_count DESC);

-- Inicializar views_count com 0 para registos existentes
UPDATE cavalos_venda SET views_count = 0 WHERE views_count IS NULL;
UPDATE eventos SET views_count = 0 WHERE views_count IS NULL;
