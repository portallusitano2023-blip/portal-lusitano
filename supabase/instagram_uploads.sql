-- Tabela para armazenar info dos uploads do Instagram
CREATE TABLE IF NOT EXISTS instagram_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  caption TEXT,
  hashtags VARCHAR(500),
  link VARCHAR(500),
  observacoes TEXT,
  files_urls TEXT[],
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'published', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  UNIQUE(session_id)
);

CREATE INDEX idx_instagram_uploads_session ON instagram_uploads(session_id);
CREATE INDEX idx_instagram_uploads_status ON instagram_uploads(status);
CREATE INDEX idx_instagram_uploads_created ON instagram_uploads(created_at DESC);

-- Criar bucket no Supabase Storage (executar no Supabase Dashboard > Storage)
-- Nome do bucket: instagram_uploads
-- Public: true (para poderes ver as imagens diretamente)
-- Allowed MIME types: image/*, video/*
-- Max file size: 50MB

-- INSTRUÇÕES:
-- 1. Vai a Supabase Dashboard > Storage
-- 2. Cria um novo bucket chamado "instagram_uploads"
-- 3. Define como Public
-- 4. Max file size: 50MB
-- 5. Allowed MIME types: image/*, video/*
