-- Criar bucket de imagens para cavalos à venda
-- Executar no Supabase Dashboard > Storage > Buckets OU via SQL Editor

-- Nota: buckets de storage não podem ser criados via SQL directamente.
-- Executar no Supabase Dashboard > Storage > New bucket:
--   Nome: cavalos-imagens
--   Public: true (para URLs públicas)
--   File size limit: 5MB
--   Allowed MIME types: image/jpeg, image/png, image/webp

-- Policies de acesso (executar após criar o bucket):

-- Permitir upload anónimo (antes do pagamento, sem auth obrigatória)
CREATE POLICY "Anon upload to cavalos-imagens pending"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'cavalos-imagens'
  AND (storage.foldername(name))[1] = 'pending'
);

-- Leitura pública de todas as imagens
CREATE POLICY "Public read cavalos-imagens"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cavalos-imagens');

-- Deleção apenas por service_role (admin/webhook)
CREATE POLICY "Service role delete cavalos-imagens"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'cavalos-imagens');
