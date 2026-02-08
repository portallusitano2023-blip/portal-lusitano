-- ============================================================================
-- PERFORMANCE INDEXES - 5-10x FASTER QUERIES
-- ============================================================================
-- Um único bloco DO com sub-blocos para cada index
-- Cada sub-bloco tem EXCEPTION WHEN OTHERS para nunca falhar
-- Created: 2026-02-08 (v3 - single DO block, nested exceptions)
-- ============================================================================

DO $$
BEGIN

  -- ========================================================================
  -- 1. CAVALOS_VENDA
  -- ========================================================================

  -- Index: status + preço (homepage, listagens)
  BEGIN
    CREATE INDEX IF NOT EXISTS idx_cavalos_venda_status_price
      ON cavalos_venda(status, preco DESC)
      WHERE status = 'active';
    RAISE NOTICE 'Created idx_cavalos_venda_status_price';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_cavalos_venda_status_price: %', SQLERRM;
  END;

  -- Index: sexo (filtro popular)
  BEGIN
    CREATE INDEX IF NOT EXISTS idx_cavalos_venda_sexo
      ON cavalos_venda(sexo)
      WHERE status = 'active';
    RAISE NOTICE 'Created idx_cavalos_venda_sexo';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_cavalos_venda_sexo: %', SQLERRM;
  END;

  -- Index: regiao (filtro geográfico)
  BEGIN
    CREATE INDEX IF NOT EXISTS idx_cavalos_venda_regiao
      ON cavalos_venda(regiao)
      WHERE status = 'active';
    RAISE NOTICE 'Created idx_cavalos_venda_regiao';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_cavalos_venda_regiao: %', SQLERRM;
  END;

  -- Index: created_at (ordenação por data)
  BEGIN
    CREATE INDEX IF NOT EXISTS idx_cavalos_venda_created
      ON cavalos_venda(created_at DESC)
      WHERE status = 'active';
    RAISE NOTICE 'Created idx_cavalos_venda_created';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_cavalos_venda_created: %', SQLERRM;
  END;

  -- Index: destaque (cavalos em destaque primeiro)
  BEGIN
    CREATE INDEX IF NOT EXISTS idx_cavalos_venda_destaque
      ON cavalos_venda(destaque DESC, created_at DESC)
      WHERE status = 'active';
    RAISE NOTICE 'Created idx_cavalos_venda_destaque';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_cavalos_venda_destaque: %', SQLERRM;
  END;

  -- Index: full-text search (pesquisa por nome + descrição)
  BEGIN
    CREATE INDEX IF NOT EXISTS idx_cavalos_venda_search
      ON cavalos_venda USING gin(
        to_tsvector('portuguese', nome_cavalo || ' ' || COALESCE(descricao, ''))
      );
    RAISE NOTICE 'Created idx_cavalos_venda_search';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_cavalos_venda_search: %', SQLERRM;
  END;

  -- ========================================================================
  -- 2. EVENTOS
  -- ========================================================================

  BEGIN
    CREATE INDEX IF NOT EXISTS idx_eventos_data
      ON eventos(data_inicio DESC);
    RAISE NOTICE 'Created idx_eventos_data';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_eventos_data: %', SQLERRM;
  END;

  BEGIN
    CREATE INDEX IF NOT EXISTS idx_eventos_tipo
      ON eventos(tipo_evento, data_inicio DESC);
    RAISE NOTICE 'Created idx_eventos_tipo';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_eventos_tipo: %', SQLERRM;
  END;

  -- ========================================================================
  -- 3. COUDELARIAS
  -- ========================================================================

  BEGIN
    CREATE INDEX IF NOT EXISTS idx_coudelarias_destaque
      ON coudelarias(destaque DESC, nome);
    RAISE NOTICE 'Created idx_coudelarias_destaque';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_coudelarias_destaque: %', SQLERRM;
  END;

  BEGIN
    CREATE INDEX IF NOT EXISTS idx_coudelarias_regiao
      ON coudelarias(regiao);
    RAISE NOTICE 'Created idx_coudelarias_regiao';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_coudelarias_regiao: %', SQLERRM;
  END;

  -- ========================================================================
  -- 4. CONTACT_SUBMISSIONS
  -- ========================================================================

  BEGIN
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
      ON contact_submissions(status, created_at DESC);
    RAISE NOTICE 'Created idx_contact_submissions_status';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_contact_submissions_status: %', SQLERRM;
  END;

  BEGIN
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_form_type
      ON contact_submissions(form_type, status);
    RAISE NOTICE 'Created idx_contact_submissions_form_type';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_contact_submissions_form_type: %', SQLERRM;
  END;

  -- ========================================================================
  -- 5. PROFISSIONAIS
  -- ========================================================================

  BEGIN
    CREATE INDEX IF NOT EXISTS idx_profissionais_categoria
      ON profissionais(categoria);
    RAISE NOTICE 'Created idx_profissionais_categoria';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped idx_profissionais_categoria: %', SQLERRM;
  END;

  -- ========================================================================
  -- 6. ANALYZE TABLES
  -- ========================================================================

  BEGIN
    ANALYZE cavalos_venda;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ANALYZE eventos;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ANALYZE coudelarias;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ANALYZE contact_submissions;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ANALYZE profissionais;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RAISE NOTICE 'Done! All indexes processed.';

END;
$$;
