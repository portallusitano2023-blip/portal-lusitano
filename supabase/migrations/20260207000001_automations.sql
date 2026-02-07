-- Criar tabela de automações
CREATE TABLE IF NOT EXISTS admin_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Informação da automação
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,

  -- Tipo de trigger
  trigger_type TEXT NOT NULL, -- 'lead_created', 'payment_succeeded', 'review_submitted', 'cavalo_created', 'time_based'
  trigger_conditions JSONB DEFAULT '{}'::jsonb, -- Condições específicas do trigger (ex: {"amount_min": 50})

  -- Tipo de ação
  action_type TEXT NOT NULL, -- 'send_email', 'create_task', 'update_field', 'approve_review', 'send_notification'
  action_config JSONB NOT NULL, -- Configuração da ação (ex: {"to": "email@example.com", "template": "welcome"})

  -- Delay (em minutos)
  delay_minutes INTEGER NOT NULL DEFAULT 0,

  -- Estatísticas
  total_runs INTEGER NOT NULL DEFAULT 0,
  successful_runs INTEGER NOT NULL DEFAULT 0,
  failed_runs INTEGER NOT NULL DEFAULT 0,
  last_run_at TIMESTAMP,
  last_error TEXT,

  -- Metadata
  created_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de logs de execução de automações
CREATE TABLE IF NOT EXISTS admin_automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  automation_id UUID NOT NULL REFERENCES admin_automations(id) ON DELETE CASCADE,

  -- Informação da execução
  status TEXT NOT NULL, -- 'success', 'failed', 'pending'
  trigger_data JSONB, -- Dados que dispararam a automação
  action_result JSONB, -- Resultado da ação executada
  error_message TEXT,

  -- Timestamps
  executed_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX idx_automations_enabled ON admin_automations(enabled);
CREATE INDEX idx_automations_trigger_type ON admin_automations(trigger_type);
CREATE INDEX idx_automations_action_type ON admin_automations(action_type);
CREATE INDEX idx_automation_logs_automation_id ON admin_automation_logs(automation_id);
CREATE INDEX idx_automation_logs_status ON admin_automation_logs(status);
CREATE INDEX idx_automation_logs_executed_at ON admin_automation_logs(executed_at DESC);

-- RLS policies (admin only)
ALTER TABLE admin_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can do everything on automations"
  ON admin_automations
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can do everything on automation logs"
  ON admin_automation_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_automations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER automations_updated_at
  BEFORE UPDATE ON admin_automations
  FOR EACH ROW
  EXECUTE FUNCTION update_automations_updated_at();

-- Inserir algumas automações de exemplo
INSERT INTO admin_automations (name, description, trigger_type, action_type, action_config, delay_minutes, created_by)
VALUES
  (
    'Boas-vindas a novos leads',
    'Enviar email de boas-vindas quando um novo lead se regista',
    'lead_created',
    'send_email',
    '{"template": "welcome", "subject": "Bem-vindo ao Portal Lusitano"}'::jsonb,
    0,
    'system'
  ),
  (
    'Follow-up após pagamento',
    'Criar tarefa de follow-up 24h após pagamento bem-sucedido',
    'payment_succeeded',
    'create_task',
    '{"title": "Follow-up pós-pagamento", "task_type": "follow_up", "priority": "normal"}'::jsonb,
    1440,
    'system'
  ),
  (
    'Notificação de nova review',
    'Enviar notificação ao admin quando uma nova review é submetida',
    'review_submitted',
    'send_notification',
    '{"title": "Nova Review Pendente", "message": "Uma nova review foi submetida e aguarda aprovação"}'::jsonb,
    0,
    'system'
  );

COMMENT ON TABLE admin_automations IS 'Sistema de automações para triggers e ações automáticas';
COMMENT ON TABLE admin_automation_logs IS 'Logs de execução das automações';
