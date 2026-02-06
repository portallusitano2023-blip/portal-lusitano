-- Criar tabela de tarefas/follow-ups do admin
CREATE TABLE IF NOT EXISTS admin_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Informação da tarefa
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL DEFAULT 'follow_up', -- 'follow_up', 'call', 'email', 'meeting', 'other'

  -- Datas
  due_date TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,

  -- Status
  status TEXT NOT NULL DEFAULT 'pendente', -- 'pendente', 'em_andamento', 'concluida', 'cancelada'
  priority TEXT NOT NULL DEFAULT 'normal', -- 'baixa', 'normal', 'alta', 'urgente'

  -- Ligação a outros registos
  related_email TEXT, -- Email do cliente relacionado
  related_contact_id UUID, -- ID do contact_submission se houver
  related_message_id UUID, -- ID da mensagem se houver

  -- Notas e tracking
  notes TEXT,
  admin_email TEXT NOT NULL, -- Quem criou a tarefa

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_admin_tasks_due_date ON admin_tasks(due_date DESC);
CREATE INDEX idx_admin_tasks_status ON admin_tasks(status);
CREATE INDEX idx_admin_tasks_admin ON admin_tasks(admin_email, created_at DESC);
CREATE INDEX idx_admin_tasks_related_email ON admin_tasks(related_email);

-- RLS policies (admin only)
ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can do everything on tasks"
  ON admin_tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_admin_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_tasks_updated_at
  BEFORE UPDATE ON admin_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_tasks_updated_at();

-- Inserir algumas tarefas de exemplo (opcional - remover em produção)
INSERT INTO admin_tasks (title, description, task_type, due_date, status, priority, admin_email, notes)
VALUES
  ('Follow-up: João Silva - Interesse em cavalo PRE', 'Cliente interessado em cavalo PRE de dressage, orçamento até €15k', 'follow_up', NOW() + INTERVAL '2 days', 'pendente', 'alta', 'portal.lusitano2023@gmail.com', 'Cliente viu Novilheiro e pediu mais fotos'),
  ('Call: Maria Costa - Publicidade Instagram', 'Agendar reunião para discutir campanha de publicidade', 'call', NOW() + INTERVAL '1 day', 'pendente', 'normal', 'portal.lusitano2023@gmail.com', 'Orçamento €500-1000'),
  ('Email: Pedro Santos - Venda de cavalo', 'Enviar documentação e contrato de venda', 'email', NOW() + INTERVAL '5 days', 'pendente', 'normal', 'portal.lusitano2023@gmail.com', NULL);

COMMENT ON TABLE admin_tasks IS 'Tarefas e lembretes do admin para gestão de follow-ups e calendário';
