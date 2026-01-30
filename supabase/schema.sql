-- =============================================
-- PORTAL LUSITANO - Database Schema
-- =============================================
-- Execute este script no Supabase SQL Editor

-- Tabela de subscrições (ligada ao Stripe)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  plan_name TEXT NOT NULL, -- 'Aficionado', 'Criador', 'Elite'
  plan_interval TEXT NOT NULL, -- 'monthly', 'yearly'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'past_due', 'trialing'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Tabela de tickets de consultoria
CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY, -- CONS-timestamp-random
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_plan TEXT NOT NULL, -- 'Criador', 'Elite'
  type TEXT NOT NULL, -- 'linhagens', 'acasalamento', 'morfologia', etc.
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[], -- Array de URLs
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'answered', 'closed'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  admin_response TEXT,
  admin_response_at TIMESTAMPTZ,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_priority ON consultations(priority);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);

-- Tabela de progresso de ebooks (gamificação)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id TEXT NOT NULL,
  ebook_title TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN DEFAULT FALSE,
  last_page INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ebook_id)
);

-- Índices
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_completed ON user_progress(completed);

-- Tabela de achievements/conquistas
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Índice
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- Tabela de perfil de utilizador (XP, nível, etc.)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  ebooks_completed INTEGER DEFAULT 0,
  consultations_used INTEGER DEFAULT 0,
  member_since TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de downloads (tracking)
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'ebook', 'template', 'infographic'
  resource_name TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_resource_id ON downloads(resource_id);
CREATE INDEX idx_downloads_downloaded_at ON downloads(downloaded_at DESC);

-- =============================================
-- RLS (Row Level Security) Policies
-- =============================================

-- Enable RLS em todas as tabelas
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Policies para subscriptions
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Policies para consultations
CREATE POLICY "Users can view their own consultations"
  ON consultations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consultations"
  ON consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies para user_progress
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR ALL
  USING (auth.uid() = user_id);

-- Policies para user_achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Policies para user_profiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies para downloads
CREATE POLICY "Users can view their own downloads"
  ON downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads"
  ON downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Functions & Triggers
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente quando um utilizador se regista
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- =============================================
-- Dados de Teste (Opcional)
-- =============================================

-- Descomentar para inserir dados de teste
/*
INSERT INTO consultations (id, user_id, user_email, user_name, user_plan, type, subject, message, status, priority)
VALUES
  ('CONS-TEST-001', '00000000-0000-0000-0000-000000000000', 'test@example.com', 'Teste User', 'Criador', 'linhagens', 'Teste de Consultoria', 'Isto é um teste', 'pending', 'medium'),
  ('CONS-TEST-002', '00000000-0000-0000-0000-000000000000', 'test@example.com', 'Teste User', 'Elite', 'morfologia', 'Avaliação Teste', 'Teste de avaliação', 'answered', 'high');
*/
