-- ========================================
-- MIGRAÇÃO: Sistema de Definições
-- Tabela para armazenar configurações do sistema
-- ========================================

-- 1. Criar tabela de definições
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identificador único da definição
  key TEXT UNIQUE NOT NULL,

  -- Valor da definição (flexível - JSON)
  value JSONB NOT NULL DEFAULT '{}',

  -- Categoria da definição
  category TEXT NOT NULL CHECK (category IN (
    'email_templates',
    'notifications',
    'payment',
    'metadata',
    'general',
    'social_media',
    'analytics'
  )),

  -- Descrição amigável
  label TEXT NOT NULL,
  description TEXT,

  -- Tipo de input para a UI
  input_type TEXT NOT NULL CHECK (input_type IN (
    'text',
    'textarea',
    'number',
    'boolean',
    'json',
    'select',
    'email',
    'url',
    'html'
  )),

  -- Opções para select (se aplicável)
  options JSONB,

  -- Validação
  is_required BOOLEAN DEFAULT false,
  validation_regex TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_key ON site_settings(key);

-- 3. Trigger para updated_at
CREATE TRIGGER tr_settings_updated
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON site_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Inserir definições padrão
INSERT INTO site_settings (key, value, category, label, description, input_type, is_required) VALUES

-- Email Templates
('email_template_welcome',
 '{"subject": "Bem-vindo ao Portal Lusitano", "html": "<h1>Bem-vindo!</h1>"}',
 'email_templates',
 'Template Email de Boas-vindas',
 'Template HTML para email de boas-vindas',
 'html',
 true),

('email_template_anuncio_aprovado',
 '{"subject": "Anúncio Aprovado!", "html": "<h1>O seu anúncio foi aprovado</h1>"}',
 'email_templates',
 'Template Anúncio Aprovado',
 'Template HTML para notificação de aprovação',
 'html',
 true),

('email_template_payment_received',
 '{"subject": "Pagamento Confirmado", "html": "<h1>Pagamento recebido com sucesso</h1>"}',
 'email_templates',
 'Template Pagamento Confirmado',
 'Template HTML para confirmação de pagamento',
 'html',
 true),

-- Notifications
('notifications_admin_email',
 '{"emails": ["portal.lusitano2023@gmail.com"]}',
 'notifications',
 'Emails de Notificação Admin',
 'Emails que recebem notificações de novos contactos, pagamentos, etc.',
 'json',
 true),

('notifications_enabled',
 '{"enabled": true}',
 'notifications',
 'Notificações Ativadas',
 'Ativar/desativar todas as notificações por email',
 'boolean',
 true),

('notifications_new_contact',
 '{"enabled": true}',
 'notifications',
 'Notificar Novos Contactos',
 'Enviar email quando houver novo contacto',
 'boolean',
 false),

('notifications_new_payment',
 '{"enabled": true}',
 'notifications',
 'Notificar Novos Pagamentos',
 'Enviar email quando houver novo pagamento',
 'boolean',
 false),

-- Payment
('payment_stripe_test_mode',
 '{"enabled": true}',
 'payment',
 'Modo de Teste Stripe',
 'Usar chaves de teste do Stripe',
 'boolean',
 false),

('payment_currency',
 '{"currency": "EUR"}',
 'payment',
 'Moeda Padrão',
 'Moeda usada para pagamentos',
 'text',
 true),

('payment_tax_rate',
 '{"rate": 0.23}',
 'payment',
 'Taxa de IVA',
 'Taxa de IVA aplicada (0.23 = 23%)',
 'number',
 false),

-- Metadata
('site_name',
 '{"value": "Portal Lusitano"}',
 'metadata',
 'Nome do Site',
 'Nome exibido no site e emails',
 'text',
 true),

('site_description',
 '{"value": "O melhor portal de cavalos Lusitanos em Portugal"}',
 'metadata',
 'Descrição do Site',
 'Meta description para SEO',
 'textarea',
 false),

('site_url',
 '{"value": "https://portal-lusitano.pt"}',
 'metadata',
 'URL do Site',
 'URL principal do site',
 'url',
 true),

('site_logo_url',
 '{"value": ""}',
 'metadata',
 'URL do Logo',
 'URL do logo do site',
 'url',
 false),

-- Social Media
('social_instagram',
 '{"username": "@portal_lusitano", "url": "https://instagram.com/portal_lusitano"}',
 'social_media',
 'Instagram',
 'Username e URL do Instagram',
 'json',
 false),

('social_facebook',
 '{"url": ""}',
 'social_media',
 'Facebook',
 'URL da página do Facebook',
 'url',
 false),

-- General
('maintenance_mode',
 '{"enabled": false, "message": "Site em manutenção"}',
 'general',
 'Modo de Manutenção',
 'Ativar modo de manutenção',
 'json',
 false),

('max_upload_size_mb',
 '{"value": 10}',
 'general',
 'Tamanho Máximo de Upload (MB)',
 'Tamanho máximo para uploads de imagens',
 'number',
 false),

('items_per_page',
 '{"value": 20}',
 'general',
 'Items por Página',
 'Número de items mostrados por página no marketplace',
 'number',
 false)

ON CONFLICT (key) DO NOTHING;

-- 6. Comentários
COMMENT ON TABLE site_settings IS 'Configurações gerais do site (email templates, notificações, pagamentos, etc.)';
COMMENT ON COLUMN site_settings.key IS 'Identificador único da definição (snake_case)';
COMMENT ON COLUMN site_settings.value IS 'Valor JSON flexível da definição';
COMMENT ON COLUMN site_settings.category IS 'Categoria para organização na UI';
COMMENT ON COLUMN site_settings.input_type IS 'Tipo de input a usar na interface admin';
