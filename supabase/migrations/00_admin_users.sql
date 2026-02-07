-- Criar tabela de utilizadores admin (EXECUTAR PRIMEIRO!)

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  role TEXT DEFAULT 'admin', -- 'admin', 'super_admin'
  ativo BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir o teu email como admin
INSERT INTO admin_users (email, nome, role, ativo)
VALUES ('portal.lusitano2023@gmail.com', 'Portal Lusitano Admin', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- Índice
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email) WHERE ativo = true;

-- RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Admins podem ver outros admins
DROP POLICY IF EXISTS "Admins podem ver admin_users" ON admin_users;
CREATE POLICY "Admins podem ver admin_users"
  ON admin_users FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');
