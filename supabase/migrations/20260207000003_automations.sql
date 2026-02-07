-- Tabela de Automações
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'lead_created',
    'payment_succeeded', 
    'review_submitted',
    'cavalo_created',
    'event_created',
    'time_based'
  )),
  trigger_conditions JSONB DEFAULT '{}',
  
  -- Ação
  action_type TEXT NOT NULL CHECK (action_type IN (
    'send_email',
    'create_task',
    'update_field',
    'approve_review',
    'send_notification'
  )),
  action_config JSONB NOT NULL,
  
  -- Delay
  delay_minutes INTEGER DEFAULT 0,
  
  -- Estado
  enabled BOOLEAN DEFAULT true,
  last_run TIMESTAMP,
  run_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Logs de Automações
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
  
  trigger_data JSONB,
  executed_at TIMESTAMP DEFAULT NOW(),
  success BOOLEAN,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_automations_trigger ON automations(trigger_type) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_automation_logs_automation ON automation_logs(automation_id, created_at DESC);

-- RLS
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON automations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for service role" ON automation_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMENT ON TABLE automations IS 'Sistema de automações e workflows';
COMMENT ON TABLE automation_logs IS 'Histórico de execuções de automações';
