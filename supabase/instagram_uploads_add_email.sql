-- Adicionar coluna customer_email à tabela instagram_uploads
ALTER TABLE instagram_uploads
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Criar índice para facilitar pesquisas
CREATE INDEX IF NOT EXISTS idx_instagram_uploads_email ON instagram_uploads(customer_email);
