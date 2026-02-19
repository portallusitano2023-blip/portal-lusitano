-- Migração: adicionar user_id à tabela favoritos
-- Mantém user_email como nullable para compatibilidade com registos antigos.
-- Novos registos usam user_id (FK para auth.users) como identificador principal.

-- 1. Adicionar coluna user_id (nullable para não quebrar registos existentes)
ALTER TABLE favoritos
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Tornar user_email nullable (era NOT NULL, agora só necessário para registos antigos)
ALTER TABLE favoritos
  ALTER COLUMN user_email DROP NOT NULL;

-- 3. Índice único para favoritos baseados em user_id (novos registos)
CREATE UNIQUE INDEX IF NOT EXISTS idx_favoritos_user_id_item
  ON favoritos(user_id, item_id, item_type)
  WHERE user_id IS NOT NULL;

-- 4. Índice de pesquisa por user_id
CREATE INDEX IF NOT EXISTS idx_favoritos_user_id
  ON favoritos(user_id)
  WHERE user_id IS NOT NULL;

-- Comentário
COMMENT ON COLUMN favoritos.user_id IS 'ID do utilizador autenticado (auth.users). Substitui user_email para novos registos.';
