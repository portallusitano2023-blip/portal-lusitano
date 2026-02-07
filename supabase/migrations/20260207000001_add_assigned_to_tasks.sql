-- Add assigned_to field to admin_tasks table
ALTER TABLE admin_tasks
ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_to ON admin_tasks(assigned_to);

-- Comment
COMMENT ON COLUMN admin_tasks.assigned_to IS 'Email do admin a quem a tarefa está atribuída';
