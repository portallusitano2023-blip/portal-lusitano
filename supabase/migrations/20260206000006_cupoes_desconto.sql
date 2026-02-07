-- Sistema de Cupões de Desconto

CREATE TABLE IF NOT EXISTS cupoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Código do cupão
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT,

  -- Tipo de desconto
  tipo_desconto TEXT NOT NULL, -- 'percentagem', 'valor_fixo'
  valor_desconto DECIMAL(10, 2) NOT NULL, -- 10 (para 10%) ou 500 (para €5.00)

  -- Aplicação
  aplica_a TEXT[] DEFAULT ARRAY['all'], -- ['all'], ['cavalo_anuncio'], ['profissional_bronze'], etc
  valor_minimo DECIMAL(10, 2), -- Compra mínima para usar cupão

  -- Limites de uso
  uso_maximo INTEGER, -- NULL = ilimitado
  uso_atual INTEGER DEFAULT 0,
  uso_por_cliente INTEGER DEFAULT 1, -- Quantas vezes cada pessoa pode usar

  -- Validade
  data_inicio TIMESTAMP DEFAULT NOW(),
  data_fim TIMESTAMP,
  ativo BOOLEAN DEFAULT true,

  -- Criação
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de histórico de uso de cupões
CREATE TABLE IF NOT EXISTS cupoes_uso_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cupao_id UUID REFERENCES cupoes(id) ON DELETE CASCADE,

  -- Quem usou
  cliente_email TEXT NOT NULL,
  cliente_nome TEXT,

  -- Compra
  payment_id UUID REFERENCES payments(id),
  valor_original DECIMAL(10, 2) NOT NULL,
  valor_desconto DECIMAL(10, 2) NOT NULL,
  valor_final DECIMAL(10, 2) NOT NULL,
  produto_tipo TEXT, -- 'cavalo_anuncio', 'profissional_bronze', etc

  -- Tracking
  ip_address TEXT,
  usado_em TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cupoes_codigo ON cupoes(codigo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_cupoes_ativo ON cupoes(ativo, data_fim DESC);
CREATE INDEX IF NOT EXISTS idx_cupoes_uso_cupao ON cupoes_uso_historico(cupao_id, usado_em DESC);
CREATE INDEX IF NOT EXISTS idx_cupoes_uso_cliente ON cupoes_uso_historico(cliente_email, usado_em DESC);

-- Função para validar cupão
CREATE OR REPLACE FUNCTION validar_cupao(
  p_codigo TEXT,
  p_cliente_email TEXT,
  p_valor_compra DECIMAL,
  p_produto_tipo TEXT
) RETURNS JSONB AS $$
DECLARE
  cupao RECORD;
  usos_cliente INTEGER;
  resultado JSONB;
BEGIN
  -- Buscar cupão
  SELECT * INTO cupao
  FROM cupoes
  WHERE codigo = p_codigo
    AND ativo = true
    AND (data_inicio IS NULL OR data_inicio <= NOW())
    AND (data_fim IS NULL OR data_fim >= NOW())
    AND (uso_maximo IS NULL OR uso_atual < uso_maximo);

  -- Cupão não existe ou inválido
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valido', false,
      'erro', 'Cupão inválido ou expirado'
    );
  END IF;

  -- Verificar se aplica ao produto
  IF NOT ('all' = ANY(cupao.aplica_a) OR p_produto_tipo = ANY(cupao.aplica_a)) THEN
    RETURN jsonb_build_object(
      'valido', false,
      'erro', 'Cupão não aplicável a este produto'
    );
  END IF;

  -- Verificar valor mínimo
  IF cupao.valor_minimo IS NOT NULL AND p_valor_compra < cupao.valor_minimo THEN
    RETURN jsonb_build_object(
      'valido', false,
      'erro', format('Valor mínimo de compra: €%.2f', cupao.valor_minimo / 100)
    );
  END IF;

  -- Verificar usos por cliente
  SELECT COUNT(*) INTO usos_cliente
  FROM cupoes_uso_historico
  WHERE cupao_id = cupao.id AND cliente_email = p_cliente_email;

  IF usos_cliente >= cupao.uso_por_cliente THEN
    RETURN jsonb_build_object(
      'valido', false,
      'erro', 'Você já usou este cupão o máximo de vezes permitido'
    );
  END IF;

  -- Calcular desconto
  DECLARE
    valor_desconto DECIMAL;
    valor_final DECIMAL;
  BEGIN
    IF cupao.tipo_desconto = 'percentagem' THEN
      valor_desconto := (p_valor_compra * cupao.valor_desconto / 100);
    ELSE
      valor_desconto := cupao.valor_desconto;
    END IF;

    -- Garantir que desconto não é maior que valor
    valor_desconto := LEAST(valor_desconto, p_valor_compra);
    valor_final := p_valor_compra - valor_desconto;

    RETURN jsonb_build_object(
      'valido', true,
      'cupao_id', cupao.id,
      'codigo', cupao.codigo,
      'tipo_desconto', cupao.tipo_desconto,
      'valor_desconto', valor_desconto,
      'valor_final', valor_final,
      'economia', valor_desconto
    );
  END;
END;
$$ LANGUAGE plpgsql;

-- Função para aplicar cupão (incrementar uso)
CREATE OR REPLACE FUNCTION aplicar_cupao(
  p_cupao_id UUID,
  p_cliente_email TEXT,
  p_cliente_nome TEXT,
  p_payment_id UUID,
  p_valor_original DECIMAL,
  p_valor_desconto DECIMAL,
  p_valor_final DECIMAL,
  p_produto_tipo TEXT,
  p_ip_address TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  uso_id UUID;
BEGIN
  -- Incrementar uso atual do cupão
  UPDATE cupoes
  SET uso_atual = uso_atual + 1
  WHERE id = p_cupao_id;

  -- Registar uso no histórico
  INSERT INTO cupoes_uso_historico (
    cupao_id,
    cliente_email,
    cliente_nome,
    payment_id,
    valor_original,
    valor_desconto,
    valor_final,
    produto_tipo,
    ip_address
  ) VALUES (
    p_cupao_id,
    p_cliente_email,
    p_cliente_nome,
    p_payment_id,
    p_valor_original,
    p_valor_desconto,
    p_valor_final,
    p_produto_tipo,
    p_ip_address
  ) RETURNING id INTO uso_id;

  RETURN uso_id;
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE cupoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupoes_uso_historico ENABLE ROW LEVEL SECURITY;

-- Admin acesso total
CREATE POLICY "Admin acesso cupoes"
  ON cupoes FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "Admin acesso historico cupoes"
  ON cupoes_uso_historico FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));
