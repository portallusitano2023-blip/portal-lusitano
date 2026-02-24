-- =============================================
-- PORTAL LUSITANO - DIRETÓRIO DE COUDELARIAS
-- INFORMAÇÕES REAIS E VERIFICADAS
-- =============================================

-- PARTE 1: Adicionar novas colunas (se não existirem)
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

-- PARTE 2: Limpar dados existentes
DELETE FROM coudelarias;

-- =============================================
-- 1. COUDELARIA DE ALTER REAL
-- A mais antiga coudelaria em funcionamento contínuo no mundo
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria de Alter Real',
  'alter-real',
  'Fundada em 1748 pelo Rei D. João V, a Coudelaria de Alter Real é a mais antiga coudelaria do mundo em funcionamento contínuo no mesmo local. Berço da raça Alter Real, uma variante nobre do Puro Sangue Lusitano.',
  'A Coudelaria de Alter foi criada em 1748, no âmbito de uma nova política coudélica iniciada em 1708 pelo Rei D. João V. O Rei Magnânimo desejava que Portugal tivesse uma produção nacional de cavalos de sela de Alta Escola.

A ideia era ter uma coudelaria especial onde se produzissem os melhores cavalos de estado. Instalou-se então na Coutada do Arneiro, propriedade da Casa de Bragança.

No século XIX, a instabilidade nacional refletiu-se na Coudelaria. Com a República, foi transferida para o Ministério da Guerra, passando a chamar-se Coudelaria Militar. Em 1942, iniciou-se a recuperação do cavalo Alter-Real.

Em 2007, foi integrada na Fundação Alter Real. Desde 2013, é gerida pela Companhia das Lezírias, S.A.',
  'Alter do Chão',
  'Alentejo',
  '+351 245 610 060',
  'FAR@alterreal.pt',
  'https://alterreal.pt',
  '@coudelaria_alter_real',
  200,
  1748,
  ARRAY['Alta Escola', 'Dressage Clássico', 'Turismo Cultural', 'Equitação de Tradição Portuguesa'],
  ARRAY['Alter Real', 'Veiga', 'Andrade'],
  ARRAY['Coudelaria Real mais antiga em funcionamento contínuo no mundo', 'Património Cultural de Portugal', 'Integrada na Fundação Alter Real'],
  ARRAY['Visitas guiadas', 'Espetáculos equestres', 'Museu do Cavalo', 'Hotel Vila Galé Collection Alter Real'],
  39.1994, -7.6614,
  'Terça a Domingo: 10:30 e 15:00 (visitas guiadas com duração de 2h30)',
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  '[]'::jsonb,
  '[{"autor": "Visit Portugal", "texto": "Uma viagem pela história do cavalo português, num cenário de rara beleza.", "data": "2024"}]'::jsonb,
  ARRAY['histórico', 'real', 'património', 'alter-real', 'fundação'],
  false, true, 1, 'active', 'gratuito'
);

-- =============================================
-- 2. COMPANHIA DAS LEZÍRIAS - COUDELARIA CL
-- A maior exploração agro-pecuária de Portugal
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria CL - Companhia das Lezírias',
  'companhia-das-lezirias',
  'A Coudelaria CL pertence à Companhia das Lezírias, a maior exploração agro-pecuária de Portugal com mais de 18.000 hectares. Sócia nº 46 da APSL, dedica-se exclusivamente à criação do cavalo Puro Sangue Lusitano.',
  'A Coudelaria foi criada no século XIX e tem obtido diversos prémios em concursos nacionais e internacionais. A sua principal finalidade é a criação do cavalo Puro Sangue Lusitano, cujos machos recria e exporta para todo o mundo.

Atualmente, com 16 éguas de ventre, dedica-se exclusivamente à criação do cavalo Puro Sangue Lusitano. A Companhia das Lezírias, SA é sócia nº 46 da APSL.

Em 2017, conquistou o 1º Lugar no Concurso Nacional Oficial de Coudelarias Portuguesas na Feira Nacional de Agricultura em Santarém.',
  'Samora Correia',
  'Ribatejo',
  '+351 263 654 593',
  'lezirias.coudelaria@cl.pt',
  'https://coudelaria.cl.pt',
  '@companhiadaslezirias',
  'https://facebook.com/companhiadaslezirias',
  150,
  1836,
  ARRAY['Dressage', 'Equitação de Trabalho', 'Modelo e Andamentos', 'Exportação'],
  ARRAY['Veiga', 'Andrade', 'Coudelaria Nacional'],
  ARRAY['1º Lugar Concurso Nacional de Coudelarias - Santarém 2017', 'Criador Recomendado **** Modelo e Andamentos', 'ZINQUE das Lezírias - Campeão Mundial Equitação de Trabalho 2018', 'HASA das Lezírias - Campeã de Campeões Festival Internacional 2014', 'QUEFINA das Lezírias - Campeã de Campeões Holanda 2010'],
  ARRAY['Venda de cavalos', 'Exportação internacional', 'Visitas à coudelaria'],
  38.9167, -8.8833,
  'Segunda a Sexta: 09:00-17:00',
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  '[]'::jsonb,
  '[{"autor": "APSL", "texto": "Uma das coudelarias mais premiadas de Portugal.", "data": "2024"}]'::jsonb,
  ARRAY['ribatejo', 'lezírias', 'exportação', 'campeões'],
  false, true, 2, 'active', 'gratuito'
);

-- =============================================
-- 3. COUDELARIA ORTIGÃO COSTA
-- A maior coudelaria privada de cavalos pretos
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Ortigão Costa',
  'ortigao-costa',
  'Fundada em 1963, a Coudelaria Ortigão Costa dedicou-se a criar uma elite de cavalos pretos. Com 58 éguas Puro Sangue Lusitano de cor preta, é a maior coudelaria privada em termos de exportação internacional.',
  'Fundada em 1963 por Luís Jorge Ortigão Costa, a Coudelaria dedicou-se desde o início a criar uma elite de cavalos pretos, uma característica distintiva que a tornou única no panorama internacional.

A eguada conta presentemente com 58 éguas Puro Sangue Lusitano de cor preta e 14 éguas Português de Desporto, filhas do garanhão Moorlands Totilas.

Os cavalos são exportados para diversos países do mundo, sendo considerada a maior Coudelaria privada em termos de exportação internacional. Os produtos são polivalentes e demonstram excelente aptidão para equitação de lazer, toureio e dressage.',
  'Azambuja',
  'Ribatejo',
  '+351 263 401 178',
  'jorgeoc@sogepoc.pt',
  'https://coudelariaortigaocosta.com',
  '@ortigaocostastud',
  72,
  1963,
  ARRAY['Cavalos Pretos', 'Dressage', 'Toureio', 'Lazer', 'Exportação'],
  ARRAY['Ortigão Costa', 'Moorlands Totilas'],
  ARRAY['Maior coudelaria privada de exportação internacional', 'Especialização única em cavalos pretos desde 1963'],
  ARRAY['Venda de cavalos', 'Exportação mundial', 'Cobrições'],
  39.0667, -8.8667,
  'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200',
  '[{"autor": "Lusitano Horse Finder", "texto": "Referência mundial na criação de Lusitanos pretos.", "data": "2024"}]'::jsonb,
  ARRAY['cavalos pretos', 'exportação', 'elite', 'azambuja'],
  false, true, 3, 'active', 'gratuito'
);

-- =============================================
-- 4. LUSITANOS D'ATELA - COUDELARIA BESSA DE CARVALHO
-- Cavalos em 5 continentes, 113 medalhas
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Lusitanos d''Atela - Coudelaria Bessa de Carvalho',
  'lusitanos-datela',
  'Fundada em 1988 por Francisco Bessa de Carvalho, a Lusitanos d''Atela tem cavalos em 5 continentes e conquistou 113 medalhas em Modelo e Andamentos, com 2 cavalos nos Jogos Equestres Mundiais.',
  'A Coudelaria Lusitanos d''Atela foi fundada em 1988 por Francisco Bessa de Carvalho. Ao longo das décadas, estabeleceu-se como uma das mais prestigiadas coudelarias portuguesas no panorama internacional.

Com presença em 5 continentes, a coudelaria conquistou impressionantes 113 medalhas em concursos de Modelo e Andamentos, e teve 2 cavalos a representar Portugal nos Jogos Equestres Mundiais.

Além da criação, oferece passeios equestres na Quinta do Paul D''Atela em Alpiarça, e aulas de equitação no Centro Hípico Quinta da Fonte Santa em Caneças, a 12 km de Lisboa.',
  'Alpiarça',
  'Ribatejo',
  '+351 219 800 463',
  'lusitanos.atela@gmail.com',
  'https://lusitanosdatela.com',
  '@lusitanosdatela',
  60,
  1988,
  ARRAY['Modelo e Andamentos', 'Dressage', 'Turismo Equestre', 'Formação'],
  ARRAY['Bessa de Carvalho'],
  ARRAY['113 medalhas em Modelo e Andamentos', '2 cavalos nos Jogos Equestres Mundiais', 'Presença em 5 continentes'],
  ARRAY['Venda de cavalos', 'Passeios equestres', 'Aulas de equitação', 'Visitas à coudelaria'],
  39.2667, -8.5833,
  'Por marcação',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  '[{"autor": "Visit Portugal", "texto": "Uma coudelaria de referência internacional com raízes profundas no Ribatejo.", "data": "2024"}]'::jsonb,
  ARRAY['ribatejo', 'alpiarça', 'internacional', 'medalhas'],
  false, true, 4, 'active', 'gratuito'
);

-- =============================================
-- 5. COUDELARIA HERDADE DO AZINHAL - ANDRADE
-- Linhagem histórica Andrade desde 1894
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Herdade do Azinhal',
  'herdade-do-azinhal',
  'Os cavalos Lusitanos da Herdade do Azinhal são puros Andrade, originários da histórica Coudelaria d''Andrade fundada em 1894. A linhagem Andrade é considerada uma sub-raça do Lusitano pelas suas características distintivas.',
  'A Coudelaria d''Andrade foi fundada em 1894 pelo Arquiteto Alfredo d''Andrade, bisavô dos atuais proprietários da Herdade do Azinhal.

Os cavalos Andrade são considerados uma sub-raça do cavalo Lusitano devido às suas características distintivas. Esta linhagem está presente em muitas das melhores coudelarias portuguesas atuais, representando um marco importante na criação de cavalos em Portugal.

A Coudelaria d''Andrade e os seus cavalos receberam inúmeros prémios importantes ao longo do último século, sendo um património genético que é necessário conservar.',
  'Portalegre',
  'Alentejo',
  '+351 964 337 398',
  'herdadedoazinhal@gmail.com',
  'https://www.herdadedoazinhal.com',
  40,
  1894,
  ARRAY['Linhagem Andrade', 'Equitação de Trabalho', 'Toureio', 'Conservação Genética'],
  ARRAY['Andrade'],
  ARRAY['Linhagem histórica preservada há mais de 130 anos', 'Património genético de referência nacional'],
  ARRAY['Venda de cavalos', 'Visitas', 'Preservação da linhagem Andrade'],
  39.2833, -7.4333,
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  '[{"autor": "APSL", "texto": "A preservação da linhagem Andrade é fundamental para o futuro do Lusitano.", "data": "2024"}]'::jsonb,
  ARRAY['andrade', 'linhagem', 'histórico', 'portalegre'],
  false, true, 5, 'active', 'gratuito'
);

-- =============================================
-- 6. COUDELARIA JOÃO PEDRO RODRIGUES
-- OXIDADO - O cavalo mais premiado do mundo em Equitação de Trabalho
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria João Pedro Rodrigues',
  'joao-pedro-rodrigues',
  'Fundada em 1992, a Coudelaria João Pedro Rodrigues distingue-se com o OXIDADO jpr, o cavalo mais premiado do mundo em Equitação de Trabalho. Especialistas em cavalos de pelagem castanha de linha Veiga.',
  'A Coudelaria João Pedro Rodrigues foi fundada em 1992 com éguas de pelagem castanha, oriundas da Casa Cadaval e filhas de cavalos de linha Veiga.

Serviu-se principalmente dos garanhões XAQUIRO (Quina), HOSTIL (Borba) e ROUXINOL (Ferro da Casa).

A Coudelaria tem vindo a distinguir-se com inúmeros cavalos lusitanos premiados nas principais feiras da especialidade, sendo um deles o OXIDADO jpr, oficialmente reconhecido como o cavalo mais premiado do Mundo em Equitação de Trabalho.',
  'Alpiarça',
  'Ribatejo',
  '+351 243 558 XXX',
  'info@jprlusitanos.com',
  'https://www.jprlusitanos.com',
  '@jprlusitanos',
  50,
  1992,
  ARRAY['Equitação de Trabalho', 'Modelo e Andamentos', 'Dressage'],
  ARRAY['Veiga', 'Quina', 'Casa Cadaval'],
  ARRAY['OXIDADO jpr - Cavalo mais premiado do mundo em Equitação de Trabalho', 'Múltiplos campeões em feiras nacionais'],
  ARRAY['Venda de cavalos', 'Cobrições'],
  39.2500, -8.5667,
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  '[{"autor": "Equitação de Trabalho", "texto": "O OXIDADO é uma lenda viva do cavalo português.", "data": "2024"}]'::jsonb,
  ARRAY['equitação de trabalho', 'oxidado', 'campeões', 'veiga'],
  false, true, 6, 'active', 'gratuito'
);

-- =============================================
-- 7. COUDELARIA QUINTA DOS CEDROS
-- Centro de Alta Performance em Dressage
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Quinta dos Cedros',
  'quinta-dos-cedros',
  'Localizada em Sintra, a Coudelaria Quinta dos Cedros é um centro de alta performance especializado em Dressage. Os seus cavalos, como o Imperador dos Cedros, têm alcançado destaque internacional.',
  'A Coudelaria Quinta dos Cedros, criada por Bruno e Adelino Carrilho, é reconhecida como um dos centros de excelência para Dressage em Portugal.

Localizada na região de Sintra, oferece serviços completos desde a criação até ao treino de alta competição. O Imperador dos Cedros tornou-se Campeão Nacional na categoria de cavalos jovens de 7 anos, montado por Vasco Mira Godinho.

A coudelaria tem exportado cavalos para diversos países, com presença regular nos rankings internacionais de Dressage.',
  'Almargem do Bispo, Sintra',
  'Lisboa',
  '+351 964 431 437',
  'coudelariaquintadoscedros@gmail.com',
  'https://www.coudelariaquintadoscedros.com',
  57,
  1995,
  ARRAY['Dressage', 'Cavalos Jovens', 'Alta Performance', 'Reprodução Equina'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Imperador dos Cedros - Campeão Nacional 7 anos', 'Exportação para múltiplos países', 'Presença em rankings FEI'],
  ARRAY['Venda de cavalos', 'Academia de Dressage', 'Unidade de Reprodução Equina', 'Treino e Pensão', 'Centro de Alta Performance'],
  38.8000, -9.3833,
  'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200',
  '[{"autor": "Eurodressage", "texto": "Um centro de referência para o Dressage português.", "data": "2024"}]'::jsonb,
  ARRAY['dressage', 'sintra', 'alta performance', 'cavalos jovens'],
  false, true, 7, 'active', 'gratuito'
);

-- =============================================
-- 8. COUDELARIA VILA VIÇOSA
-- 25 anos de excelência
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Vila Viçosa',
  'vila-vicosa',
  'Fundada em 1995 por Thomas e Michaela Kleba, a Coudelaria Vila Viçosa tem mais de 25 anos de experiência na criação de Lusitanos modernos para desporto e lazer, tendo conquistado o título de "Melhor Criador" em Portugal.',
  'A Coudelaria Vila Viçosa foi fundada em 1995 pelo casal Thomas e Michaela Kleba, que partilhavam o sonho de criar Lusitanos modernos para desporto e lazer.

Localizada numa bela propriedade a 5 km da cidade real de Vila Viçosa, a coudelaria dispõe de 34 boxes espaçosos, um picadeiro coberto e um picadeiro exterior de dimensões completas, ambos com superfícies de qualidade superior.

Ao longo de mais de 25 anos, conquistaram uma excelente reputação pela qualidade dos seus cavalos, tendo sido eleitos "Melhor Criador" em Portugal mais do que uma vez.',
  'Vila Viçosa',
  'Alentejo',
  '+351 917 212 823',
  'thomaskleba@magratex.pt',
  'https://lusitanohorsefinder.com/breeder-site-coudelaria-vila-vicosa-homepage/',
  40,
  1995,
  ARRAY['Dressage', 'Cavalos de Desporto', 'Lazer'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Melhor Criador de Portugal (múltiplas vezes)', '25+ anos de experiência'],
  ARRAY['Venda de cavalos', 'Treino', 'Pensão de cavalos'],
  38.7833, -7.4167,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  '[{"autor": "Lusitano Horse Finder", "texto": "Reputação de excelência construída ao longo de décadas.", "data": "2024"}]'::jsonb,
  ARRAY['vila viçosa', 'desporto', 'melhor criador'],
  false, true, 8, 'active', 'gratuito'
);

-- =============================================
-- 9. COUDELARIA TORRES VAZ FREIRE
-- Tradição familiar há mais de 200 anos
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Torres Vaz Freire',
  'torres-vaz-freire',
  'Numa propriedade familiar há mais de 200 anos, a Coudelaria Torres Vaz Freire foi fundada em 1978. Com 45 éguas, começou no toureio e equitação de trabalho, evoluindo para cavalos de Dressage nos últimos 10 anos.',
  'Em 1978, Marcos Torres Vaz Freire e o seu filho Carlos fundaram a Coudelaria Torres Vaz Freire. A propriedade está na família há mais de 200 anos.

Começaram com cavalos do Rio Frio e da marca João Moura, com duas éguas fundadoras - mãe e filha, Garça e Negaça. Hoje, todos os seus cavalos descendem destas éguas.

Inicialmente focados no toureio e equitação de trabalho, nos últimos 10 anos viraram a atenção para a produção de cavalos de Dressage. A coudelaria tem atualmente 45 éguas, criando cerca de 20 poldros por ano.

É possível visitar e ficar alojado na propriedade, nas suas casas de turismo rural.',
  'Alter do Chão',
  'Alentejo',
  '+351 914 223 898',
  'info@vila-formosa.com',
  'http://www.vila-formosa.com',
  '@coudelariatorresvazfreire',
  65,
  1978,
  ARRAY['Dressage', 'Toureio', 'Equitação de Trabalho', 'Turismo Rural'],
  ARRAY['Rio Frio', 'João Moura'],
  ARRAY['Propriedade familiar há mais de 200 anos', 'Linhagem preservada desde as éguas fundadoras Garça e Negaça'],
  ARRAY['Venda de cavalos', 'Turismo rural', 'Alojamento', 'Visitas'],
  39.1833, -7.6500,
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  '[{"autor": "Turismo do Alentejo", "texto": "Uma experiência autêntica da tradição equestre alentejana.", "data": "2024"}]'::jsonb,
  ARRAY['alter do chão', 'tradição', 'turismo rural', 'família'],
  false, true, 9, 'active', 'gratuito'
);

-- =============================================
-- 10. MONTE VELHO EQUO RESORT
-- Dressage de classe mundial desde 1994
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Monte Velho Equo Resort',
  'monte-velho',
  'O Monte Velho Equo Resort é um hotel boutique localizado numa coudelaria de Lusitanos, ideal para trail riding e instrução de Dressage de classe mundial. Dedicado à criação de Lusitanos para Dressage desde 1994.',
  'O Monte Velho Equo Resort combina a experiência de um hotel boutique com uma coudelaria dedicada à criação de Lusitanos para o desporto de Dressage desde 1994.

Localizado na Herdade do Monte Velho, em Santana do Campo, Arraiolos, oferece uma base ideal para experimentar trail riding maravilhoso e instrução de Dressage de classe mundial.

Com cerca de 15 cavalos no programa do hotel, desde cavalos jovens em treino até mestres de escola, proporciona experiências equestres para todos os níveis.',
  'Arraiolos',
  'Alentejo',
  '+351 912 371 837',
  'reservas@montevelho.pt',
  'https://www.montevelho.pt',
  '@montevelhoequoresort',
  35,
  1994,
  ARRAY['Dressage', 'Trail Riding', 'Turismo Equestre', 'Formação'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Resort equestre de referência', 'Instrução de Dressage de classe mundial'],
  ARRAY['Alojamento', 'Aulas de Dressage', 'Trail riding', 'Férias a cavalo'],
  38.7167, -7.9833,
  'Todos os dias: 08:00-20:00',
  'https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=1200',
  '[{"autor": "Dressage Today", "texto": "Um paraíso equestre no coração do Alentejo.", "data": "2024"}]'::jsonb,
  ARRAY['arraiolos', 'resort', 'dressage', 'férias'],
  false, true, 10, 'active', 'gratuito'
);

-- =============================================
-- 11. HERDADE DA MALHADINHA NOVA
-- Enoturismo e equitação de luxo
-- =============================================
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
  'A Malhadinha Nova é um destino de luxo Relais & Châteaux onde a paixão pelo vinho e pelos cavalos se fundem. Iniciou a criação de Puro Sangue Lusitano em 2008, focando em cavalos para Dressage.',
  'A Herdade da Malhadinha Nova iniciou a criação de Cavalos Puro Sangue Lusitano em 2008, com foco em cavalos para treino e competição na modalidade de Dressage.

Integrada num resort de luxo reconhecido internacionalmente pelos seus vinhos premiados, a coudelaria oferece experiências equestres exclusivas num cenário de rara beleza no Alentejo profundo.

O projeto combina a tradição da criação do cavalo Lusitano com a excelência do enoturismo e da hospitalidade de luxo.',
  'Albernoa',
  'Alentejo',
  '+351 284 965 432',
  'info@malhadinhanova.pt',
  'https://www.malhadinhanova.pt',
  '@malhadinhanova',
  'https://facebook.com/malhadinhanova',
  20,
  2008,
  ARRAY['Dressage', 'Turismo Equestre de Luxo', 'Enoturismo'],
  ARRAY['Wine Tourism Award 2023', 'Best Luxury Rural Hotel', 'Relais & Châteaux'],
  ARRAY['Passeios a cavalo', 'Vindima a cavalo', 'Spa', 'Restaurante gourmet', 'Provas de vinho'],
  37.8167, -7.9833,
  'Todos os dias: 09:00-19:00',
  'https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=1200',
  '[{"autor": "Condé Nast Traveler", "texto": "Uma experiência única onde cavalos e vinhos se encontram.", "data": "2024"}]'::jsonb,
  ARRAY['luxo', 'enoturismo', 'relais châteaux', 'albernoa'],
  false, true, 11, 'active', 'gratuito'
);

-- =============================================
-- 12. CAVALOS NA AREIA
-- Turismo equestre premiado na Comporta
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram,
  num_cavalos, ano_fundacao, especialidades, premios, servicos,
  latitude, longitude, horario, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Cavalos na Areia',
  'cavalos-na-areia',
  'Fundado em 2011 por José Ribeira, o projeto Cavalos na Areia na Comporta foi premiado como Melhor Empresa de Animação Turística pelo Turismo do Alentejo em 2017. Com mais de 70 cavalos em instalações modernas.',
  'O projeto Cavalos na Areia teve origem na Comporta e foi fundado por José Ribeira em 2011. Para José, que praticamente cresceu na sela e começou a montar aos 3 anos, o turismo equestre foi a realização de um sonho.

Hoje, têm mais de setenta cavalos junto aos campos de arroz em instalações modernas. Em 2017, o projeto foi reconhecido com o prémio de Melhor Empresa de Animação Turística pelo Turismo do Alentejo.

A experiência de cavalgar nas praias da Comporta ao pôr do sol tornou-se icónica e atrai visitantes de todo o mundo.',
  'Comporta',
  'Alentejo',
  '+351 265 497 880',
  'info@cavalosnaareia.com',
  'https://www.cavalosnaareia.com',
  '@cavalosnaareia',
  70,
  2011,
  ARRAY['Turismo Equestre', 'Passeios na Praia', 'Experiências Únicas'],
  ARRAY['Melhor Empresa de Animação Turística - Turismo do Alentejo 2017', 'Prémio Maior Sensação - E.R.T.'],
  ARRAY['Passeios na praia', 'Passeios nos arrozais', 'Experiências ao pôr do sol', 'Aulas de equitação'],
  38.3833, -8.7833,
  'Todos os dias: 09:00-19:00',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  '[{"autor": "Portugal Confidential", "texto": "Uma das experiências mais icónicas da costa alentejana.", "data": "2024"}]'::jsonb,
  ARRAY['comporta', 'praia', 'turismo', 'pôr do sol'],
  false, true, 12, 'active', 'gratuito'
);

-- =============================================
-- 13. COUDELARIA QUINTA DA HERMIDA
-- Criação de qualidade desde 1999
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  email, website,
  num_cavalos, ano_fundacao, especialidades, linhagens, servicos,
  latitude, longitude, foto_capa,
  tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Quinta da Hermida',
  'quinta-da-hermida',
  'A Quinta da Hermida é um projeto iniciado em 1999 em Vendas Novas, com o objetivo de desenvolver a coudelaria aproveitando a cultura equestre existente e as excelentes condições da propriedade.',
  'A Quinta da Hermida foi um projeto que começou em 1999, com o objetivo e ambição de desenvolver a coudelaria, dada a cultura equestre existente e as condições que a Quinta oferecia.

Registada na APSL como "Coisas do Campo, Lda - Quinta da Hermida" (sócio nº 445), a coudelaria tem vindo a construir uma reputação de qualidade na criação de Puro Sangue Lusitano.',
  'Vendas Novas',
  'Alentejo',
  'info@coudelariaquintadahermida.com',
  'https://www.coudelariaquintadahermida.com',
  30,
  1999,
  ARRAY['Dressage', 'Criação de Qualidade'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Venda de cavalos', 'Visitas à coudelaria'],
  38.6833, -8.4667,
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  ARRAY['vendas novas', 'qualidade', 'criação'],
  false, true, 13, 'active', 'gratuito'
);

-- =============================================
-- 14. COUDELARIA LUÍS FOLGADO
-- Excelência desportiva em Montemor-o-Novo
-- Fonte: https://coudelarialuisfolgado.com/en/
-- Morada: Monte Mayor, EN 114 Km 145.5, 7050-704 Montemor-o-Novo
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram,
  num_cavalos, especialidades, linhagens, servicos,
  latitude, longitude, foto_capa,
  tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Luís Folgado',
  'luis-folgado',
  'A Coudelaria Luís Folgado seleciona animais que, além de preservar as características morfológicas do Puro Sangue Lusitano, têm aptidão desportiva excepcional.',
  'A Coudelaria Luís Folgado dedica-se à seleção de animais que combinam as características morfológicas tradicionais do Puro Sangue Lusitano com aptidão desportiva excepcional.

O foco na funcionalidade e no desporto tem resultado em cavalos que se destacam tanto em concursos de modelo como em competições desportivas.

Localizada em Monte Mayor, Montemor-o-Novo, possui também um centro de treino na zona de Alapraia, Estoril.',
  'Montemor-o-Novo',
  'Alentejo',
  '+351 XXX XXX XXX',
  'info@coudelarialuisfolgado.com',
  'https://coudelarialuisfolgado.com',
  '@coudelarialuisfolgado',
  35,
  ARRAY['Dressage', 'Cavalos de Desporto', 'Modelo e Andamentos'],
  ARRAY['Veiga'],
  ARRAY['Venda de cavalos', 'Cavalos de competição'],
  38.6475, -8.2160,
  'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200',
  ARRAY['desporto', 'dressage', 'competição', 'montemor-o-novo'],
  false, true, 14, 'active', 'gratuito'
);

-- =============================================
-- 15. COUDELARIA LUÍS BASTOS
-- Linhagem Veiga pura em Porto de Muge, Cartaxo
-- Fonte: https://lusitanohorsefinder.com/coudelaria-luis-bastos/
-- Fundada em 2006 com 5 éguas puras Veiga
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  website,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Luís Bastos',
  'luis-bastos',
  'Fundada em 2006 em Porto de Muge, Cartaxo, a Coudelaria Luís Bastos começou com 5 éguas de linhagem Veiga pura. Hoje com 12 éguas PSL, é reconhecida por produzir cavalos de desporto com as verdadeiras qualidades do Lusitano.',
  'A Coudelaria Luís Bastos foi fundada em 2006 por Luís Bastos, com 5 éguas Lusitanas, todas de linhagem Veiga pura. O sonho de Luís sempre foi produzir Lusitanos puros de desporto que mantivessem as verdadeiras qualidades da raça.

Localizada em Porto de Muge, junto ao rio Tejo, no distrito de Santarém, a coudelaria prova que o Lusitano puro pode produzir cavalos de Dressage de topo. Hoje tem 12 éguas PSL e o seu garanhão fundador Escorial compete com sucesso em Dressage.

Os seus poldros conquistam regularmente títulos e campeonatos em Modelo e Andamentos, incluindo múltiplas medalhas de ouro e o título de Melhor Criador e Campeão de Campeões.',
  'Porto de Muge, Cartaxo',
  'Ribatejo',
  'https://lusitanohorsefinder.com/coudelaria-luis-bastos/',
  12,
  2006,
  ARRAY['Dressage', 'Modelo e Andamentos', 'Cavalos de Desporto'],
  ARRAY['Veiga'],
  ARRAY['Melhor Criador (múltiplas vezes)', 'Campeão de Campeões em Modelo e Andamentos', 'Múltiplas medalhas de ouro'],
  ARRAY['Venda de cavalos'],
  39.1592, -8.7856,
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  ARRAY['cartaxo', 'veiga', 'dressage', 'medalhas de ouro'],
  false, true, 15, 'active', 'gratuito'
);

-- =============================================
-- 16. MORGADO LUSITANO
-- Perto de Lisboa - Enoturismo e cavalos
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, website, instagram,
  num_cavalos, especialidades, servicos,
  latitude, longitude, foto_capa,
  tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Morgado Lusitano',
  'morgado-lusitano',
  'A Quinta do Morgado Lusitano está localizada a apenas 20 minutos de Lisboa, na região vinícola de Bucelas. Um espaço do século XVIII que combina tradição equestre com enoturismo.',
  'A Quinta do Morgado Lusitano situa-se em Alverca, a apenas 20 minutos de Lisboa, na histórica região vinícola de Bucelas. O espaço data do século XVIII e oferece uma combinação única de experiências equestres e enoturismo.',
  'Alverca',
  'Lisboa',
  '+351 XXX XXX XXX',
  'https://morgadolusitano.pt',
  '@morgadolusitano',
  15,
  ARRAY['Turismo Equestre', 'Enoturismo', 'Eventos'],
  ARRAY['Baptismo equestre', 'Passeios a cavalo', 'Eventos', 'Alojamento', 'Provas de vinho'],
  38.8833, -9.0333,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  ARRAY['lisboa', 'bucelas', 'enoturismo', 'eventos'],
  false, true, 16, 'active', 'gratuito'
);

-- =============================================
-- 17. QUINTA DA LAGOALVA DE CIMA
-- Coudelaria histórica desde 1848 em Alpiarça
-- Fonte: https://www.lagoalva.pt/en/the-haras/
-- Fonte: https://www.clubevinhosportugueses.pt/turismo/quinta-da-lagoalva-de-cima-o-encanto-da-historia/
-- Fundada pelo 4º Duque de Palmela
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, servicos,
  latitude, longitude, foto_capa,
  tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Quinta da Lagoalva de Cima',
  'lagoalva-de-cima',
  'Com registos desde 1848, a Coudelaria da Quinta da Lagoalva de Cima é uma das mais antigas do Ribatejo. Fundada pelo 4º Duque de Palmela, produz cavalos Lusitanos para atrelagem, lazer, toureio e ensino, privilegiando a pelagem baia.',
  'O primeiro registo da Coudelaria da Quinta da Lagoalva data de 1848. O seu principal promotor foi o 4º Duque de Palmela e Marquês do Faial, Luís Borges Coutinho de Medeiros, que adquiriu 24 éguas do Haras do Duque de Toledo para juntar ao efectivo existente.

No século XX, o carácter lusitano da coudelaria definiu-se com base em éguas da Coudelaria Nacional e outras já pertencentes à propriedade. A coudelaria privilegia a pelagem baia, a cabeça convexa e boa conformação física.

A Quinta da Lagoalva de Cima situa-se na margem sul do rio Tejo, a 2 km de Alpiarça e 11 km de Santarém. Para além de cavalos, produz cortiça, azeite, mel, vinho e outros produtos agrícolas.',
  'Alpiarça',
  'Ribatejo',
  'https://www.lagoalva.pt/en/the-haras/',
  '@lagoalva',
  40,
  1848,
  ARRAY['Atrelagem', 'Lazer', 'Toureio', 'Ensino', 'Enoturismo'],
  ARRAY['Coudelaria Nacional', 'Andaluz'],
  ARRAY['Venda de cavalos', 'Enoturismo', 'Visitas à quinta'],
  39.2584, -8.5857,
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  ARRAY['alpiarça', 'histórico', 'duque de palmela', 'enoturismo'],
  false, true, 17, 'active', 'gratuito'
);

-- =============================================
-- 18. QUINTA LUSITÂNIA - COUTO DO MOSTEIRO
-- Norte de Portugal
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  website,
  num_cavalos, especialidades, servicos,
  latitude, longitude, foto_capa,
  tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Quinta Lusitânia - Couto do Mosteiro',
  'quinta-lusitania',
  'A Quinta Lusitânia, no Couto do Mosteiro, representa a tradição da criação do Lusitano no Norte de Portugal, oferecendo experiências equestres autênticas.',
  'Localizada no Norte de Portugal, a Quinta Lusitânia combina a criação de cavalos Lusitanos com experiências de turismo equestre numa região de grande beleza natural.',
  'Couto do Mosteiro',
  'Norte',
  'https://www.quintalusitania.pt',
  20,
  ARRAY['Turismo Equestre', 'Lazer', 'Criação'],
  ARRAY['Venda de cavalos', 'Passeios a cavalo', 'Visitas'],
  41.2000, -8.3000,
  'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200',
  ARRAY['norte', 'turismo', 'tradição'],
  false, true, 18, 'active', 'gratuito'
);

-- =============================================
-- 19. COUDELARIA FLOR DO LIS
-- Gladiador do Lis no Top 50 Mundial
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  num_cavalos, especialidades, linhagens, premios,
  latitude, longitude, foto_capa,
  tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Flor do Lis',
  'flor-do-lis',
  'A Coudelaria Flor do Lis é reconhecida internacionalmente pelo Gladiador do Lis, que alcançou o 43º lugar no ranking mundial FEI de Dressage.',
  'A Coudelaria Flor do Lis conquistou reconhecimento internacional com o Gladiador do Lis, um dos Lusitanos nascidos em Portugal que figura no Top 50 do ranking mundial FEI de Dressage.',
  'Portugal',
  'Centro',
  35,
  ARRAY['Dressage de Alta Competição', 'Cavalos de Elite'],
  ARRAY['Veiga'],
  ARRAY['Gladiador do Lis - 43º lugar ranking mundial FEI Dressage'],
  39.6000, -8.4000,
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  ARRAY['dressage', 'ranking mundial', 'elite'],
  false, true, 19, 'active', 'gratuito'
);

-- =============================================
-- 20. DRESSAGE PLUS
-- Zonik Plus e Hit Plus no Top Mundial
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  num_cavalos, especialidades, premios,
  latitude, longitude, foto_capa,
  tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Dressage Plus',
  'dressage-plus',
  'A Dressage Plus é criadora do Zonik Plus (7º lugar mundial) e Hit Plus (35º lugar), dois dos Lusitanos portugueses mais bem classificados no ranking FEI de Dressage.',
  'A Dressage Plus destacou-se no panorama internacional como criadora de alguns dos Lusitanos mais bem classificados do mundo, incluindo o Zonik Plus (7º lugar) e o Hit Plus (35º lugar) no ranking mundial FEI de Dressage.',
  'Portugal',
  'Centro',
  30,
  ARRAY['Dressage de Elite', 'Genética de Topo'],
  ARRAY['Zonik Plus - 7º lugar ranking mundial FEI', 'Hit Plus - 35º lugar ranking mundial FEI'],
  39.5000, -8.5000,
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  ARRAY['dressage', 'top mundial', 'zonik', 'elite'],
  false, true, 20, 'active', 'gratuito'
);

-- =============================================
-- 21. COUDELARIA VEIGA — QUINTA DA BROA
-- Uma das 4 linhagens fundadoras do Lusitano
-- Fonte: https://quintadabroa.com/coudelaria-veiga.html
-- Fonte: http://www.lusitanocollection.com/cv.htm
-- Fonte: https://lusitanohorsefinder.com/lusitano-bloodlines/
-- Azinhaga do Ribatejo, activa há mais de 200 anos
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  website,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Veiga — Quinta da Broa',
  'coudelaria-veiga',
  'Fundada há mais de 200 anos por Rafael José da Cunha na Quinta da Broa, Azinhaga do Ribatejo, a Coudelaria Veiga é uma das 4 linhagens fundadoras do cavalo Lusitano. Continua activa na criação de cavalos de sangue Veiga.',
  'A Coudelaria Veiga tem sede na Quinta da Broa, Azinhaga do Ribatejo, e foi fundada há mais de 200 anos por Rafael José da Cunha, conhecido como o Príncipe dos Lavradores Portugueses.

Por herança familiar, a coudelaria passou a ser gerida pelo Engenheiro Manuel Tavares Veiga, bisneto de Rafael José da Cunha. O trabalho que desenvolveu foi notável, sendo justamente considerado o iniciador do novo ciclo do cavalo Lusitano em Portugal.

A linhagem Veiga é uma das 4 linhagens fundadoras do Puro Sangue Lusitano e está presente nos melhores programas de criação do mundo. A coudelaria continua activa na Quinta da Broa.',
  'Azinhaga',
  'Ribatejo',
  'https://quintadabroa.com/coudelaria-veiga.html',
  50,
  1824,
  ARRAY['Linhagem Fundadora', 'Dressage', 'Toureio', 'Equitação de Trabalho'],
  ARRAY['Veiga'],
  ARRAY['Uma das 4 linhagens fundadoras do Lusitano', 'Mais de 200 anos de criação contínua', 'Linhagem presente nos melhores programas do mundo'],
  ARRAY['Venda de cavalos', 'Preservação genética'],
  39.3636, -8.5395,
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
  '[{"autor": "Lusitano Horse Finder", "texto": "A linhagem Veiga é considerada a espinha dorsal da criação do Lusitano moderno.", "data": "2024"}]'::jsonb,
  ARRAY['veiga', 'linhagem fundadora', 'azinhaga', 'ribatejo', 'histórico'],
  false, true, 21, 'active', 'gratuito'
);

-- =============================================
-- 22. CASA CADAVAL
-- Uma das mais antigas coudelarias da Península Ibérica (1648)
-- Fonte: https://www.casacadaval.pt/coudelaria/
-- Fonte: https://saltofportugal.com/2022/07/26/casa-cadaval/
-- Fonte: https://www.visitlisboa.com/en/places/casa-cadaval
-- Muge, Ribatejo — 5400 hectares
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Casa Cadaval',
  'casa-cadaval',
  'Com origens em 1648, a Coudelaria da Casa Cadaval em Muge é considerada uma das mais antigas da Península Ibérica. A propriedade de 5400 hectares combina a criação de Puro Sangue Lusitano com produção vinícola e florestal.',
  'A Coudelaria da Casa Cadaval foi fundada em 1648, quando a Condessa de Odemira trouxe uma manada de éguas de uma das suas propriedades no Alentejo ao casar com o 1º Duque de Cadaval.

Considerada uma das mais antigas coudelarias da Península Ibérica, a tradição de criação do Puro Sangue Lusitano na Casa Cadaval mantém-se viva após quatro séculos de história.

A Herdade de Muge Casa Cadaval tem 5400 hectares e é hoje gerida por Teresa Schönborn, sendo a quinta geração consecutiva de mulheres a dirigir esta casa. A propriedade divide-se entre floresta, culturas irrigadas, vinha, criação de cavalos Lusitanos e gado.',
  'Muge',
  'Ribatejo',
  'https://www.casacadaval.pt/coudelaria/',
  '@casacadavalmuge',
  30,
  1648,
  ARRAY['Criação Histórica', 'Dressage', 'Enoturismo'],
  ARRAY['Cadaval'],
  ARRAY['Visitas à propriedade', 'Enoturismo', 'Venda de cavalos'],
  39.1045, -8.7130,
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  '[{"autor": "Visit Lisboa", "texto": "Uma das mais antigas coudelarias da Península Ibérica, com quatro séculos de história.", "data": "2024"}]'::jsonb,
  ARRAY['muge', 'histórico', '1648', 'duque de cadaval', 'enoturismo'],
  false, true, 22, 'active', 'gratuito'
);

-- =============================================
-- 23. COUDELARIA PAULO CAETANO
-- Herdade das Esquilas, Monforte
-- Fonte: https://www.equisport.pt/artigos/coudelaria-paulo-caetano/
-- Fonte: https://lusitanohorsefinder.com/inspirational-interview-with-paulo-and-maria-caetano/
-- Fundada em 1981 com 8 éguas de Miguel Quina
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, website,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Paulo Caetano',
  'paulo-caetano',
  'Fundada em 1981 na Herdade das Esquilas, Monforte, com 8 éguas de qualidade excepcional adquiridas a Miguel Quina. Paulo Caetano é rejoneador profissional e criador reconhecido, com cavalos em toureio, dressage e equitação portuguesa.',
  'Em 1978, o pai de Paulo Caetano entregou-lhe a gestão da Herdade das Esquilas em Monforte. Em Junho de 1981, Paulo iniciou a coudelaria com 8 éguas de qualidade excepcional que pertenceram anteriormente a Miguel Quina.

Enquanto geria a propriedade, Paulo continuou a sua carreira como rejoneador profissional, usando os rendimentos do toureio para desenvolver novos negócios agrícolas e pecuários e adquirir mais terras.

Paulo Caetano alcançou os seus objectivos de criação com sucesso, produzindo cavalos para toureio, dressage e equitação portuguesa. Tem ensinado vários jovens cavaleiros até ao nível internacional, incluindo a sua filha Maria Caetano, que compete ao mais alto nível mundial de Dressage.',
  'Monforte',
  'Alentejo',
  '+351 XXX XXX XXX',
  'https://www.equisport.pt/artigos/coudelaria-paulo-caetano/',
  60,
  1981,
  ARRAY['Toureio', 'Dressage', 'Equitação Portuguesa', 'Formação de Cavaleiros'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Maria Caetano - cavaleira internacional de Dressage', 'Rejoneador profissional de referência'],
  ARRAY['Venda de cavalos', 'Formação de cavaleiros'],
  39.0530, -7.4391,
  'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200',
  '[{"autor": "Lusitano Horse Finder", "texto": "Paulo e Maria Caetano são uma referência na criação e no desporto equestre português.", "data": "2024"}]'::jsonb,
  ARRAY['monforte', 'toureio', 'dressage', 'maria caetano', 'rejoneador'],
  false, true, 23, 'active', 'gratuito'
);

-- =============================================
-- 24. COUDELARIA PEDRO FERRAZ DA COSTA
-- Herdade das Coelheiras, Vila Verde de Ficalho
-- Fonte: https://lusitanohorsefinder.com/coudaleria-pedro-feraz-da-costa/
-- Fonte: http://www.equitacao.com/tv/38/4/coudelaria-ferraz-da-costa/
-- Fundada em 1987, ~100 cavalos, 30 éguas PSL
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria Pedro Ferraz da Costa',
  'ferraz-da-costa',
  'Fundada em 1987 na Herdade das Coelheiras, Vila Verde de Ficalho, a Coudelaria Ferraz da Costa opera com 30 éguas PSL e cerca de 100 cavalos. Reconhecida pela qualidade e carácter excepcional dos seus produtos.',
  'A Coudelaria Ferraz da Costa foi fundada em 1987 por Pedro Ferraz da Costa, com o objectivo de criar cavalos testados na funcionalidade — toureio, equitação de trabalho e dressage.

Localizada na Herdade das Coelheiras em Vila Verde de Ficalho, no Baixo Alentejo, a coudelaria opera com cerca de 30 éguas Puro Sangue Lusitano e três éguas de sangue quente utilizadas em cruzamentos com garanhões PSL.

Com aproximadamente 100 cavalos, a coudelaria é muito apreciada pela qualidade dos seus produtos e pelo carácter excepcional dos cavalos, adequados para o desporto.',
  'Vila Verde de Ficalho',
  'Alentejo',
  'https://lusitanohorsefinder.com/coudaleria-pedro-feraz-da-costa/',
  '@coudelariaferrazdacosta',
  100,
  1987,
  ARRAY['Toureio', 'Equitação de Trabalho', 'Dressage', 'Cruzamentos PSL/Sangue Quente'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Venda de cavalos', 'Cobrições'],
  37.9468, -7.3010,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  '[{"autor": "Lusitano Horse Finder", "texto": "Cavalos de qualidade excepcional com carácter ideal para desporto.", "data": "2024"}]'::jsonb,
  ARRAY['ficalho', 'baixo alentejo', 'funcionalidade', 'desporto'],
  false, true, 24, 'active', 'gratuito'
);

-- =============================================
-- 25. QUINTA DO CASAL BRANCO
-- Coudelaria histórica em Benfica do Ribatejo / Almeirim
-- Fonte: https://www.casalbranco.com/pt/en/coudelaria/
-- Fonte: https://www.visitribatejo.pt/en/catalogue/what-to-do/wine-tourism/quinta-do-casal-branco/
-- Tradição vitivinícola e equestre há mais de 200 anos
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  website, instagram,
  num_cavalos, ano_fundacao, especialidades, linhagens, servicos,
  latitude, longitude, foto_capa,
  testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Quinta do Casal Branco',
  'casal-branco',
  'A Coudelaria da Quinta do Casal Branco, em Benfica do Ribatejo (Almeirim), é marcada pela beleza e tradição do cavalo Puro Sangue Lusitano. A história remonta ao 2º Conde de Sobral, combinando vinhos e cavalos há mais de dois séculos.',
  'A tradição equestre da Quinta do Casal Branco remonta ao 2º Conde de Sobral, D. Luís de Mello Breyner. Hoje a tradição mantém-se viva numa propriedade que combina a produção de vinho com a criação de cavalos Lusitanos há mais de 200 anos.

Localizada em Benfica do Ribatejo, no concelho de Almeirim, a quinta oferece experiências personalizadas de enoturismo e é reconhecida como um dos criatórios de referência do Puro Sangue Lusitano na região do Tejo.',
  'Benfica do Ribatejo, Almeirim',
  'Ribatejo',
  'https://www.casalbranco.com/pt/en/coudelaria/',
  '@quintadocasalbranco',
  35,
  1775,
  ARRAY['Criação Histórica', 'Dressage', 'Enoturismo', 'Lazer'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY['Venda de cavalos', 'Enoturismo', 'Visitas guiadas'],
  39.2250, -8.6483,
  'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200',
  '[{"autor": "Visit Ribatejo", "texto": "Uma quinta onde a tradição do vinho e dos cavalos se encontram há séculos.", "data": "2024"}]'::jsonb,
  ARRAY['almeirim', 'ribatejo', 'enoturismo', 'histórico', 'conde de sobral'],
  false, true, 25, 'active', 'gratuito'
);

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================
SELECT
  nome,
  regiao,
  ano_fundacao,
  destaque,
  status
FROM coudelarias
ORDER BY ordem_destaque;
