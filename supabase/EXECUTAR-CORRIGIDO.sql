-- =============================================
-- PORTAL LUSITANO - DIRETÓRIO DE COUDELARIAS
-- VERSÃO CORRIGIDA
-- =============================================

-- PARTE 1: Adicionar novas colunas
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS ano_fundacao INTEGER;
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS historia TEXT;
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS linhagens TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS premios TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS servicos TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS horario VARCHAR(255);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS facebook VARCHAR(255);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS youtube VARCHAR(255);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS foto_capa VARCHAR(500);
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS galeria TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS cavalos_destaque JSONB DEFAULT '[]';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS testemunhos JSONB DEFAULT '[]';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT FALSE;
ALTER TABLE coudelarias ADD COLUMN IF NOT EXISTS ordem_destaque INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_coudelarias_destaque ON coudelarias(destaque, ordem_destaque);

-- PARTE 2: Limpar e inserir dados
DELETE FROM coudelarias;

-- 1. ALTER REAL
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook, youtube,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa, galeria,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria de Alter Real',
  'alter-real',
  'Fundada em 1748 pelo Rei D. João V, a Coudelaria de Alter Real é uma das mais antigas e prestigiadas da Europa.',
  'A Coudelaria de Alter Real foi fundada em 1748 por ordem do Rei D. João V. Durante mais de 275 anos, tem sido o berço da raça Alter Real, uma variante nobre do Puro Sangue Lusitano. Foi apenas em 1942 que o Dr. Ruy d''Andrade conseguiu salvar a raça da extinção.',
  'Alter do Chão',
  'Alentejo',
  '+351 245 610 060',
  'coudelaria@alterreal.pt',
  'https://www.alterreal.pt',
  '@coudelaria_alter_real',
  'https://facebook.com/coudelariaalterreal',
  'https://youtube.com/@alterreal',
  200,
  1748,
  ARRAY['Alta Escola', 'Dressage Clássico', 'Turismo Cultural'],
  ARRAY['Alter Real', 'Veiga', 'Andrade'],
  ARRAY['Património Cultural de Portugal', 'Coudelaria Real mais antiga da Península Ibérica'],
  ARRAY['Visitas guiadas', 'Espetáculos equestres', 'Venda de cavalos', 'Museu do Cavalo'],
  39.1994, -7.6614,
  'Terça a Domingo: 10:00-18:00',
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  ARRAY['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800'],
  '[{"nome": "Neptuno AR", "ano": 2018, "pelagem": "Castanho", "aptidao": "Alta Escola", "preco": null, "vendido": false}]'::jsonb,
  '[{"autor": "Maria Santos", "texto": "Visitar a Coudelaria de Alter Real é uma viagem no tempo.", "data": "2024-03"}]'::jsonb,
  ARRAY['histórico', 'real', 'património'],
  false, true, 1, 'active', 'gratuito'
);

-- 2. COMPANHIA DAS LEZÍRIAS
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Companhia das Lezírias',
  'companhia-das-lezirias',
  'A maior exploração agro-pecuária de Portugal, com mais de 18.000 hectares no coração do Ribatejo.',
  'Fundada em 1836, a Companhia das Lezírias tem uma história intimamente ligada à terra e aos cavalos. A coudelaria é reconhecida pela qualidade excepcional dos seus cavalos Lusitanos.',
  'Samora Correia',
  'Ribatejo',
  '+351 263 509 200',
  'geral@cl.pt',
  'https://www.cl.pt',
  '@companhiadaslezirias',
  'https://facebook.com/companhiadaslezirias',
  150,
  1836,
  ARRAY['Dressage', 'Equitação de Trabalho', 'Toureio', 'Ecoturismo'],
  ARRAY['Veiga', 'Andrade', 'Coudelaria Nacional'],
  ARRAY['Medalha de Ouro Feira Nacional do Cavalo 2023', 'Melhor Criador Nacional 2021'],
  ARRAY['Venda de cavalos', 'Passeios a cavalo', 'Safari fotográfico'],
  38.9167, -8.8833,
  'Segunda a Sexta: 09:00-17:00',
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  '[{"nome": "Universo CL", "ano": 2019, "pelagem": "Ruço", "aptidao": "Dressage", "preco": 45000, "vendido": false}]'::jsonb,
  '[{"autor": "António Costa", "texto": "Os melhores cavalos de trabalho que já montei.", "data": "2024-02"}]'::jsonb,
  ARRAY['ribatejo', 'lezíria', 'ecoturismo'],
  false, true, 2, 'active', 'gratuito'
);

-- 3. COUDELARIA VEIGA
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios,
  latitude, longitude, foto_capa, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Veiga',
  'coudelaria-veiga',
  'Uma das linhagens mais puras e antigas do cavalo Lusitano. Reconhecida mundialmente pela nobreza e beleza.',
  'A Coudelaria Veiga representa mais de um século de criação seletiva. Os cavalos Veiga são considerados a expressão mais pura do Lusitano.',
  'Cascais',
  'Lisboa',
  80,
  1920,
  ARRAY['Alta Escola', 'Dressage Clássico', 'Linhagem Pura'],
  ARRAY['Veiga'],
  ARRAY['Linhagem mais premiada da história do Lusitano', 'Campeão Mundial de Morfologia'],
  38.6970, -9.4223,
  'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200',
  '[{"autor": "Pierre Durand", "texto": "Os cavalos Veiga são a personificação da elegância equestre.", "data": "2023-11"}]'::jsonb,
  ARRAY['veiga', 'linhagem', 'elegância'],
  false, true, 3, 'active', 'gratuito'
);

-- 4. MONTE VELHO
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Monte Velho Equestrian Center',
  'monte-velho',
  'Centro de excelência para Dressage na Comporta. Formação de cavaleiros e cavalos ao mais alto nível.',
  'O Monte Velho é um centro hípico de referência na Comporta, com instalações de classe mundial.',
  'Comporta',
  'Alentejo',
  '+351 265 497 880',
  'info@montevelhoequestriancenter.com',
  'https://www.montevelhoequestriancenter.com',
  '@montevelhoequestrian',
  'https://facebook.com/montevelhoequestrian',
  55,
  2008,
  ARRAY['Dressage', 'Formação de Cavaleiros', 'Competição Internacional'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Centro de Treino Oficial FEP', 'Organizador CDI Comporta'],
  ARRAY['Aulas de Dressage', 'Treino de cavalos', 'Clínicas internacionais'],
  38.3833, -8.7833,
  'Segunda a Sábado: 08:00-20:00',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  '[{"nome": "Elegante MV", "ano": 2020, "pelagem": "Castanho", "aptidao": "Dressage", "preco": 65000, "vendido": false}]'::jsonb,
  '[{"autor": "Sarah Miller", "texto": "World-class facilities. My horse improved tremendously.", "data": "2024-01"}]'::jsonb,
  ARRAY['dressage', 'competição', 'comporta'],
  false, true, 4, 'active', 'gratuito'
);

-- 5. MALHADINHA NOVA
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, premios, servicos,
  latitude, longitude, horario, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Herdade da Malhadinha Nova',
  'malhadinha-nova',
  'Resort de luxo no Alentejo com coudelaria própria. Experiências equestres exclusivas.',
  'A Malhadinha Nova é um destino de luxo onde a paixão pelo vinho e pelos cavalos se fundem.',
  'Albernoa',
  'Alentejo',
  '+351 284 965 432',
  'info@malhadinhanova.pt',
  'https://www.malhadinhanova.pt',
  '@malhadinhanova',
  'https://facebook.com/malhadinhanova',
  20,
  2003,
  ARRAY['Turismo Equestre de Luxo', 'Enoturismo', 'Lazer'],
  ARRAY['Wine Tourism Award 2023', 'Best Luxury Rural Hotel 2022'],
  ARRAY['Passeios a cavalo', 'Vindima a cavalo', 'Spa', 'Restaurante gourmet'],
  37.8167, -7.9833,
  'Todos os dias: 09:00-19:00',
  'https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=1200',
  '[{"autor": "Emma Thompson", "texto": "Riding through the vineyards at sunset was unforgettable.", "data": "2024-02"}]'::jsonb,
  ARRAY['luxo', 'enoturismo', 'alentejo'],
  false, true, 5, 'active', 'gratuito'
);

-- 6. FONTE BOA DOS NABOS
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Fonte Boa dos Nabos',
  'fonte-boa-dos-nabos',
  'Referência internacional em cavalos para Dressage de Grande Prémio. Exportação mundial.',
  'Uma das mais prestigiadas coudelarias portuguesas no panorama internacional do Dressage.',
  'Rio Maior',
  'Ribatejo',
  '+351 243 999 180',
  'info@fonteboadosnabos.com',
  'https://www.fonteboadosnabos.com',
  '@fonteboadosnabos',
  'https://facebook.com/fonteboadosnabos',
  100,
  1990,
  ARRAY['Dressage Grande Prémio', 'Competição Internacional', 'Exportação'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Exportação para mais de 20 países', 'Prémio Excelência FEP 2023'],
  ARRAY['Venda de cavalos de competição', 'Cobrições', 'Treino de cavalos jovens'],
  39.3333, -8.9333,
  'Segunda a Sexta: 09:00-18:00',
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  '[{"nome": "Lusitano FBN", "ano": 2019, "pelagem": "Castanho", "aptidao": "Dressage GP", "preco": 150000, "vendido": false}]'::jsonb,
  '[{"autor": "Nuno Palma Santos", "texto": "Cavalos de classe mundial.", "data": "2024-01"}]'::jsonb,
  ARRAY['dressage', 'grande prémio', 'exportação'],
  false, true, 6, 'active', 'gratuito'
);

-- 7. COUDELARIA ANDRADE (Gratuita)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios,
  latitude, longitude, foto_capa, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Andrade',
  'coudelaria-andrade',
  'Fundada por Ruy d''Andrade, um dos maiores estudiosos do cavalo Ibérico.',
  'A Coudelaria Andrade tem raízes no trabalho de Ruy d''Andrade, que salvou a raça Alter Real da extinção.',
  'Elvas',
  'Alentejo',
  60,
  1910,
  ARRAY['Equitação de Trabalho', 'Toureio', 'Tradição Ibérica'],
  ARRAY['Andrade', 'Alter Real'],
  ARRAY['Linhagem histórica preservada há mais de 100 anos'],
  38.8833, -7.1667,
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  ARRAY['andrade', 'tradição', 'trabalho'],
  false, true, 7, 'active', 'gratuito'
);

-- 8. QUINTA DOS LOBOS (Gratuita)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Quinta dos Lobos',
  'quinta-dos-lobos',
  'Coudelaria familiar em Mafra dedicada a cavalos com temperamento excepcional.',
  'Coudelaria familiar onde a paixão pelo Lusitano passa de geração em geração.',
  'Mafra',
  'Lisboa',
  '+351 261 812 300',
  'quintadoslobos@gmail.com',
  '@quintadoslobos',
  15,
  1995,
  ARRAY['Lazer', 'Dressage Amador', 'Cavalos Família'],
  ARRAY['Veiga', 'Coudelaria Nacional'],
  ARRAY['Venda de cavalos', 'Visitas familiares'],
  38.9333, -9.3333,
  'Fins de semana por marcação',
  'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200',
  '[{"nome": "Amigo QL", "ano": 2022, "pelagem": "Tordilho", "aptidao": "Lazer", "preco": 12000, "vendido": false}]'::jsonb,
  '[{"autor": "Ana Rodrigues", "texto": "Compramos o nosso primeiro cavalo aqui. Apoio fantástico.", "data": "2023-09"}]'::jsonb,
  ARRAY['família', 'amador', 'mafra'],
  false, true, 8, 'active', 'gratuito'
);

-- 9. COUDELARIA LUSITANUS (PRO)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Lusitanus',
  'coudelaria-lusitanus',
  'No coração da Golegã, terra do cavalo, cria cavalos de elite para desporto e lazer.',
  'Situada na Golegã, a Capital do Cavalo, beneficia de localização privilegiada.',
  'Golegã',
  'Ribatejo',
  '+351 249 976 234',
  'info@lusitanus.pt',
  'https://www.lusitanus.pt',
  '@coudelarialusitanus',
  'https://facebook.com/coudelarialusitanus',
  70,
  1985,
  ARRAY['Dressage', 'Lazer', 'Cavalos Jovens'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Presença constante na Feira da Golegã'],
  ARRAY['Venda de cavalos', 'Cobrições', 'Desbaste de poldros'],
  39.4000, -8.4833,
  'Segunda a Sábado: 09:00-18:00',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  '[{"nome": "Valente L", "ano": 2020, "pelagem": "Castanho", "aptidao": "Dressage", "preco": 28000, "vendido": false}]'::jsonb,
  '[{"autor": "Manuel Sousa", "texto": "Cavalos bem preparados e honestos.", "data": "2024-02"}]'::jsonb,
  ARRAY['golegã', 'tradição', 'ribatejo'],
  false, true, 9, 'active', 'gratuito'
);

-- 10. HERDADE DO ROCIM (PRO)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, premios, servicos,
  latitude, longitude, horario, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Rocim',
  'coudelaria-rocim',
  'Integrada na Herdade do Rocim, conhecida pelos seus vinhos, cria Lusitanos em regime extensivo.',
  'A Herdade do Rocim é conhecida pelos seus vinhos, mas a paixão pelos cavalos é igualmente profunda.',
  'Cuba',
  'Alentejo',
  '+351 284 415 295',
  'rocim@rocim.pt',
  'https://www.rocim.pt',
  '@herdadedorocim',
  'https://facebook.com/herdadedorocim',
  22,
  1998,
  ARRAY['Equitação de Trabalho', 'Enoturismo', 'Lazer'],
  ARRAY['Vinhos premiados internacionalmente', 'Prémio Turismo Sustentável 2022'],
  ARRAY['Passeios a cavalo', 'Vindima equestre', 'Provas de vinho'],
  38.1833, -7.9000,
  'Todos os dias: 10:00-18:00',
  'https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=1200',
  '[{"autor": "Sofia Martins", "texto": "Experiência única. Passeio pelas vinhas ao pôr do sol.", "data": "2023-08"}]'::jsonb,
  ARRAY['vinhos', 'enoturismo', 'alentejo'],
  false, true, 10, 'active', 'gratuito'
);

-- 11. COUDELARIA RAPOSA (PRO)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Raposa',
  'coudelaria-raposa',
  'Especialistas em cavalos para Dressage de competição. Treino profissional no Ribatejo.',
  'Centro de treino e criação especializado em Dressage.',
  'Benavente',
  'Ribatejo',
  '+351 263 519 800',
  'coudelariaraposa@gmail.com',
  'https://www.coudelariaraposa.pt',
  '@coudelariaraposa',
  'https://facebook.com/coudelariaraposa',
  48,
  2005,
  ARRAY['Dressage', 'Competição', 'Cavalos Jovens', 'Treino'],
  ARRAY['Veiga', 'Coudelaria Nacional'],
  ARRAY['Múltiplos campeões nacionais', 'Representação em CDI internacionais'],
  ARRAY['Treino de cavalos', 'Venda de cavalos preparados', 'Aulas de Dressage'],
  38.9833, -8.8167,
  'Segunda a Sábado: 08:00-19:00',
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  '[{"nome": "Horizonte R", "ano": 2019, "pelagem": "Castanho", "aptidao": "Dressage PSG", "preco": 75000, "vendido": false}]'::jsonb,
  '[{"autor": "Teresa Gonçalves", "texto": "Treino de excelência. O meu cavalo evoluiu imenso.", "data": "2024-01"}]'::jsonb,
  ARRAY['dressage', 'competição', 'treino'],
  false, true, 11, 'active', 'gratuito'
);

-- 12. BARROCA D'ALVA (PRO)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, premios, servicos,
  latitude, longitude, horario, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Barroca d''Alva',
  'barroca-dalva',
  'No coração do Douro Vinhateiro, experiências equestres únicas entre vinhas em socalcos.',
  'Experiência equestre única no Douro, Património Mundial da UNESCO.',
  'São João da Pesqueira',
  'Douro',
  '+351 254 730 100',
  'info@barrocadalva.pt',
  'https://www.barrocadalva.pt',
  '@barrocadalva',
  'https://facebook.com/barrocadalva',
  18,
  2010,
  ARRAY['Turismo Equestre', 'Enoturismo', 'Passeios a Cavalo'],
  ARRAY['Melhor Experiência Turística Douro 2022'],
  ARRAY['Passeios a cavalo', 'Expedições equestres', 'Provas de vinho'],
  41.1500, -7.4000,
  'Todos os dias: 09:00-18:00',
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  '[{"autor": "James Wilson", "texto": "Breathtaking scenery. The best way to experience the Douro.", "data": "2023-09"}]'::jsonb,
  ARRAY['douro', 'vinhos', 'unesco', 'turismo'],
  false, true, 12, 'active', 'gratuito'
);

-- 13. SÃO TIAGO (PRO)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria São Tiago',
  'sao-tiago',
  'Centro de referência no Norte de Portugal para criação e formação de cavalos.',
  'Principal referência equestre no Norte de Portugal.',
  'Vila do Conde',
  'Porto',
  '+351 252 631 400',
  'coudelaria@saotiago.pt',
  'https://www.saotiago.pt',
  '@coudelariasaotiago',
  'https://facebook.com/coudelariasaotiago',
  40,
  1992,
  ARRAY['Dressage', 'Formação', 'Cavalos Jovens', 'Centro Hípico'],
  ARRAY['Veiga', 'Coudelaria Nacional'],
  ARRAY['Principal centro equestre do Norte'],
  ARRAY['Aulas de equitação', 'Treino de cavalos', 'Venda de cavalos'],
  41.3500, -8.7500,
  'Segunda a Sábado: 08:00-20:00',
  'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200',
  '[{"nome": "Gladiador ST", "ano": 2021, "pelagem": "Castanho", "aptidao": "Dressage", "preco": 22000, "vendido": false}]'::jsonb,
  '[{"autor": "Pedro Oliveira", "texto": "O melhor centro hípico do Norte.", "data": "2023-11"}]'::jsonb,
  ARRAY['norte', 'formação', 'vila do conde'],
  false, true, 13, 'active', 'gratuito'
);

-- 14. MORGADO LUSITANO (Gratuita)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Morgado Lusitano',
  'morgado-lusitano',
  'Coudelaria familiar no Minho com três gerações dedicadas ao Lusitano.',
  'Três gerações dedicadas ao cavalo Lusitano no verde Minho.',
  'Ponte de Lima',
  'Minho',
  '+351 258 941 200',
  'morgadolusitano@gmail.com',
  '@morgadolusitano',
  25,
  1970,
  ARRAY['Lazer', 'Dressage Amador', 'Cavalos Família'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Venda de cavalos', 'Acompanhamento pós-venda'],
  41.7667, -8.5833,
  'Por marcação',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  '[{"nome": "Caramelo ML", "ano": 2021, "pelagem": "Palomino", "aptidao": "Lazer", "preco": 10000, "vendido": false}]'::jsonb,
  '[{"autor": "Família Pereira", "texto": "O nosso primeiro cavalo. Apoio fantástico.", "data": "2023-06"}]'::jsonb,
  ARRAY['família', 'minho', 'lazer'],
  false, true, 14, 'active', 'gratuito'
);

-- 15. QUINTA DA FOZ (Gratuita)
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, servicos,
  latitude, longitude, foto_capa, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Quinta da Foz',
  'quinta-da-foz',
  'Criação tradicional de Lusitanos no Ribatejo desde 1985. Cavalos funcionais e versáteis.',
  'Coudelaria tradicional do Ribatejo dedicada a cavalos funcionais.',
  'Santarém',
  'Ribatejo',
  '+351 243 429 100',
  'quintadafoz@mail.pt',
  '@quintadafoz_lusitanos',
  35,
  1985,
  ARRAY['Dressage', 'Equitação de Trabalho', 'Versatilidade'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Venda de cavalos', 'Cobrições', 'Visitas'],
  39.2333, -8.6833,
  'https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=1200',
  ARRAY['ribatejo', 'tradição', 'versátil'],
  false, true, 15, 'active', 'gratuito'
);

-- VERIFICAR
SELECT nome, regiao, is_pro, destaque, status FROM coudelarias ORDER BY destaque DESC, ordem_destaque, nome;
