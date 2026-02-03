-- Tabela de favoritos para persistir preferencias dos utilizadores
CREATE TABLE IF NOT EXISTS favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('cavalo', 'coudelaria', 'evento')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indice unico para evitar duplicados
  UNIQUE(user_email, item_id, item_type)
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_favoritos_user ON favoritos(user_email);
CREATE INDEX IF NOT EXISTS idx_favoritos_item ON favoritos(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_favoritos_created ON favoritos(created_at DESC);

-- Comentarios
COMMENT ON TABLE favoritos IS 'Favoritos/wishlist dos utilizadores';
COMMENT ON COLUMN favoritos.user_email IS 'Email do utilizador';
COMMENT ON COLUMN favoritos.item_id IS 'ID do item (cavalo, coudelaria ou evento)';
COMMENT ON COLUMN favoritos.item_type IS 'Tipo do item: cavalo, coudelaria ou evento';

-- RLS (Row Level Security)
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Politica para permitir utilizadores ver apenas os seus favoritos
CREATE POLICY "Users can view own favorites" ON favoritos
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own favorites" ON favoritos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own favorites" ON favoritos
  FOR DELETE USING (true);
