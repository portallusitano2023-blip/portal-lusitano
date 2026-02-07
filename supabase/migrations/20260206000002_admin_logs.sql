-- Sistema completo de Logs e Auditoria Admin

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Quem fez a ação
  admin_email TEXT NOT NULL,
  admin_nome TEXT,

  -- Que tipo de ação
  action_type TEXT NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject', 'login', 'export'
  entity_type TEXT NOT NULL, -- 'cavalo', 'evento', 'review', 'coudelaria', 'profissional', 'message', 'payment'
  entity_id TEXT,
  entity_name TEXT, -- Nome do item para facilitar leitura

  -- Detalhes da mudança
  changes JSONB, -- {before: {...}, after: {...}}
  description TEXT, -- Descrição human-readable

  -- Contexto técnico
  ip_address TEXT,
  user_agent TEXT,
  request_method TEXT, -- 'GET', 'POST', 'PATCH', 'DELETE'
  request_url TEXT,

  -- Severidade (para filtrar)
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_logs_admin ON admin_activity_logs(admin_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_entity ON admin_activity_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_action ON admin_activity_logs(action_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON admin_activity_logs(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_created ON admin_activity_logs(created_at DESC);

-- Função helper para criar logs facilmente
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_admin_email TEXT,
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_entity_name TEXT DEFAULT NULL,
  p_changes JSONB DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_activity_logs (
    admin_email,
    action_type,
    entity_type,
    entity_id,
    entity_name,
    changes,
    description,
    severity
  ) VALUES (
    p_admin_email,
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_entity_name,
    p_changes,
    p_description,
    p_severity
  ) RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso:
-- SELECT log_admin_activity(
--   'admin@portal.pt',
--   'approve',
--   'cavalo',
--   '123-uuid',
--   'Cavalo Belo',
--   '{"status": {"before": "pendente", "after": "aprovado"}}'::jsonb,
--   'Cavalo aprovado para publicação',
--   'info'
-- );

-- RLS Policy
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Só admin pode ver logs
CREATE POLICY "Admin pode ver logs"
  ON admin_activity_logs FOR SELECT
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- View para estatísticas de atividade
CREATE OR REPLACE VIEW admin_activity_stats AS
SELECT
  admin_email,
  DATE(created_at) as date,
  COUNT(*) as total_actions,
  COUNT(*) FILTER (WHERE action_type = 'create') as creates,
  COUNT(*) FILTER (WHERE action_type = 'update') as updates,
  COUNT(*) FILTER (WHERE action_type = 'delete') as deletes,
  COUNT(*) FILTER (WHERE action_type = 'approve') as approvals,
  COUNT(*) FILTER (WHERE severity = 'critical') as critical_actions
FROM admin_activity_logs
GROUP BY admin_email, DATE(created_at);
