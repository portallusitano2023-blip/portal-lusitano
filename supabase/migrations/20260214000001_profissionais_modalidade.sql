-- Adicionar coluna modalidade à tabela profissionais
-- Valores: 'presencial' (default), 'online', 'clinicas_internacionais'
ALTER TABLE profissionais ADD COLUMN IF NOT EXISTS modalidade TEXT DEFAULT 'presencial';

-- Profissionais existentes são presenciais
UPDATE profissionais SET modalidade = 'presencial' WHERE modalidade IS NULL;
