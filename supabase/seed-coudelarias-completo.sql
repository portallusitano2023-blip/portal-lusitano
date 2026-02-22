-- =============================================
-- SEED COMPLETO: Coudelarias Portuguesas
-- Dados detalhados e completos
-- =============================================

-- Limpar tabela (CUIDADO em produção!)
TRUNCATE TABLE coudelarias CASCADE;

-- =============================================
-- 1. COUDELARIA DE ALTER REAL (HISTÓRICA)
-- =============================================
INSERT INTO coudelarias (
  nome, slug, descricao, historia, localizacao, regiao,
  telefone, email, website, instagram, facebook, youtube,
  num_cavalos, ano_fundacao, especialidades, linhagens, premios, servicos,
  latitude, longitude, horario,
  foto_capa, galeria, video_url,
  cavalos_destaque, testemunhos, tags,
  is_pro, destaque, ordem_destaque, status, plan
) VALUES (
  'Coudelaria de Alter Real',
  'alter-real',
  'Fundada em 1748 pelo Rei D. João V, a Coudelaria de Alter Real é uma das mais antigas e prestigiadas da Europa. Património histórico e cultural de Portugal, berço da raça Alter Real.',
  'A Coudelaria de Alter Real foi fundada em 1748 por ordem do Rei D. João V, com o objetivo de criar cavalos de qualidade superior para a Casa Real Portuguesa. Durante mais de 275 anos, tem sido o berço da raça Alter Real, uma variante nobre do Puro Sangue Lusitano.

A história da coudelaria atravessou períodos de grande esplendor e de dificuldades. Durante as invasões francesas no início do século XIX, grande parte do efetivo foi disperso ou perdido. Mais tarde, no período da República, a coudelaria enfrentou novos desafios.

Foi apenas em 1942 que o Dr. Ruy d''Andrade conseguiu localizar alguns dos últimos exemplares puros da raça, iniciando um programa de recuperação que salvou o Alter Real da extinção. Hoje, a coudelaria é gerida pela Fundação Alter Real e continua a sua missão de preservar e promover esta linhagem única.

As instalações históricas, incluindo as cavalariças reais e o palácio, estão abertas ao público, oferecendo uma experiência única que combina história, cultura e a magnificência do cavalo Lusitano.',
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
  ARRAY['Alta Escola', 'Dressage Clássico', 'Equitação de Tradição Portuguesa', 'Reprodução', 'Turismo Cultural'],
  ARRAY['Alter Real', 'Veiga', 'Andrade'],
  ARRAY[
    'Património Cultural de Portugal',
    'Coudelaria Real mais antiga da Península Ibérica',
    'Centro de Excelência Equestre reconhecido pela FEI',
    'Medalha de Mérito Cultural 2020'
  ],
  ARRAY['Visitas guiadas', 'Espetáculos equestres', 'Venda de cavalos', 'Cobrições', 'Estágio de garanhões', 'Museu do Cavalo', 'Restaurante', 'Alojamento'],
  39.1994,
  -7.6614,
  'Terça a Domingo: 10:00-13:00 / 14:00-18:00',
  '/images/coudelarias/alter-real/capa.jpg',
  ARRAY[
    '/images/coudelarias/alter-real/galeria-1.jpg',
    '/images/coudelarias/alter-real/galeria-2.jpg',
    '/images/coudelarias/alter-real/galeria-3.jpg',
    '/images/coudelarias/alter-real/galeria-4.jpg',
    '/images/coudelarias/alter-real/galeria-5.jpg'
  ],
  'https://youtube.com/watch?v=alterreal',
  '[
    {"nome": "Neptuno AR", "ano": 2018, "pelagem": "Castanho", "aptidao": "Alta Escola", "preco": null, "vendido": false},
    {"nome": "Quixote AR", "ano": 2016, "pelagem": "Tordilho", "aptidao": "Dressage GP", "preco": null, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "Maria Santos", "texto": "Visitar a Coudelaria de Alter Real é uma viagem no tempo. A história respira em cada canto.", "data": "2024-03"},
    {"autor": "João Ferreira", "texto": "Os cavalos são magníficos e o espetáculo equestre emocionante. Recomendo vivamente.", "data": "2024-01"}
  ]'::jsonb,
  ARRAY['histórico', 'real', 'alter real', 'património', 'turismo', 'espetáculo'],
  true,
  true,
  1,
  'active',
  'pro'
),

-- =============================================
-- 2. COMPANHIA DAS LEZÍRIAS
-- =============================================
(
  'Companhia das Lezírias',
  'companhia-das-lezirias',
  'A maior exploração agro-pecuária de Portugal, com mais de 18.000 hectares no coração do Ribatejo. Referência na criação de cavalos Lusitanos de excelência.',
  'A Companhia das Lezírias é a maior exploração agro-pecuária de Portugal, estendendo-se por mais de 18.000 hectares entre o Tejo e o Sorraia. Fundada em 1836, tem uma história intimamente ligada à terra e aos cavalos.

A coudelaria da Companhia das Lezírias é reconhecida pela qualidade excepcional dos seus cavalos Lusitanos. Com um programa de criação rigoroso, baseado nas melhores linhagens portuguesas, produz cavalos que se destacam tanto na morfologia como na funcionalidade.

Os cavalos nascem e crescem em regime extensivo, em contacto com a natureza e os elementos, o que lhes confere rusticidade e um temperamento equilibrado. Esta forma de criação tradicional, combinada com técnicas modernas de seleção genética, resulta em cavalos de qualidade superior.

A Companhia oferece também experiências únicas de ecoturismo e turismo equestre, permitindo aos visitantes conhecer de perto o trabalho diário de uma coudelaria profissional e a beleza natural da lezíria ribatejana.',
  'Samora Correia',
  'Ribatejo',
  '+351 263 509 200',
  'geral@cl.pt',
  'https://www.cl.pt',
  '@companhiadaslezirias',
  'https://facebook.com/companhiadaslezirias',
  'https://youtube.com/@companhiadaslezirias',
  150,
  1836,
  ARRAY['Dressage', 'Equitação de Trabalho', 'Toureio', 'Reprodução', 'Ecoturismo'],
  ARRAY['Veiga', 'Andrade', 'Coudelaria Nacional'],
  ARRAY[
    'Medalha de Ouro Feira Nacional do Cavalo 2023',
    'Campeão Nacional Morfologia 2022',
    'Melhor Criador Nacional 2021',
    'Prémio Sustentabilidade Agrícola 2020'
  ],
  ARRAY['Venda de cavalos', 'Cobrições', 'Passeios a cavalo', 'Safari fotográfico', 'Birdwatching', 'Provas de vinhos', 'Restaurante', 'Eventos empresariais'],
  38.9167,
  -8.8833,
  'Segunda a Sexta: 09:00-17:00 | Sábados: 10:00-14:00',
  '/images/coudelarias/lezirias/capa.jpg',
  ARRAY[
    '/images/coudelarias/lezirias/galeria-1.jpg',
    '/images/coudelarias/lezirias/galeria-2.jpg',
    '/images/coudelarias/lezirias/galeria-3.jpg'
  ],
  'https://youtube.com/watch?v=lezirias',
  '[
    {"nome": "Universo CL", "ano": 2019, "pelagem": "Ruço", "aptidao": "Dressage", "preco": 45000, "vendido": false},
    {"nome": "Tornado CL", "ano": 2017, "pelagem": "Castanho", "aptidao": "Trabalho", "preco": 25000, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "António Costa", "texto": "Os melhores cavalos de trabalho que já montei. Rusticidade e nobreza combinadas.", "data": "2024-02"}
  ]'::jsonb,
  ARRAY['ribatejo', 'lezíria', 'ecoturismo', 'trabalho', 'tradição'],
  true,
  true,
  2,
  'active',
  'pro'
),

-- =============================================
-- 3. COUDELARIA VEIGA
-- =============================================
(
  'Coudelaria Veiga',
  'coudelaria-veiga',
  'Uma das linhagens mais puras e antigas do cavalo Lusitano. Os cavalos Veiga são reconhecidos mundialmente pela sua nobreza, funcionalidade e beleza incomparável.',
  'A Coudelaria Veiga representa mais de um século de criação seletiva e dedicação ao Puro Sangue Lusitano. Fundada pela família Veiga, que dedicou gerações à preservação e melhoramento desta linhagem única.

Os cavalos Veiga são imediatamente reconhecíveis pela sua elegância, pescoço arqueado, e movimentos aéreos. São considerados por muitos especialistas como a expressão mais pura do que deve ser um cavalo Lusitano.

A filosofia de criação da Coudelaria Veiga sempre privilegiou a funcionalidade aliada à beleza. Cada cavalo é selecionado não apenas pela sua conformação, mas também pelo seu temperamento, inteligência e aptidão para o trabalho.

Ao longo dos anos, os cavalos Veiga conquistaram prémios em todo o mundo e são hoje uma referência incontornável no universo do cavalo Lusitano. Muitas das melhores coudelarias do mundo têm sangue Veiga nos seus programas de criação.',
  'Cascais',
  'Lisboa',
  '+351 214 868 000',
  'info@coudelariaveiga.pt',
  'https://www.coudelariaveiga.pt',
  '@coudelariaveiga',
  'https://facebook.com/coudelariaveiga',
  NULL,
  80,
  1920,
  ARRAY['Alta Escola', 'Dressage Clássico', 'Linhagem Pura', 'Reprodução', 'Morfologia'],
  ARRAY['Veiga'],
  ARRAY[
    'Linhagem mais premiada da história do Lusitano',
    'Campeão Mundial de Morfologia (múltiplas vezes)',
    'Reserva de Biosfera reconhecida pela UNESCO'
  ],
  ARRAY['Venda de cavalos selecionados', 'Cobrições com garanhões campeões', 'Visitas privadas'],
  38.6970,
  -9.4223,
  'Por marcação',
  '/images/coudelarias/veiga/capa.jpg',
  ARRAY[
    '/images/coudelarias/veiga/galeria-1.jpg',
    '/images/coudelarias/veiga/galeria-2.jpg'
  ],
  NULL,
  '[]'::jsonb,
  '[
    {"autor": "Pierre Durand", "texto": "Os cavalos Veiga são a personificação da elegância equestre. Incomparáveis.", "data": "2023-11"}
  ]'::jsonb,
  ARRAY['veiga', 'linhagem', 'puro', 'elegância', 'morfologia'],
  true,
  true,
  3,
  'active',
  'pro'
),

-- =============================================
-- 4. MONTE VELHO EQUESTRIAN CENTER
-- =============================================
(
  'Monte Velho Equestrian Center',
  'monte-velho',
  'Centro de excelência para Dressage na Comporta. Formação de cavaleiros e cavalos ao mais alto nível internacional.',
  'O Monte Velho Equestrian Center é um centro hípico de referência situado na deslumbrante região da Comporta. Fundado com a missão de promover a excelência no Dressage com cavalos Lusitanos.

As instalações de classe mundial incluem vários picadeiros cobertos e descobertos, pistas de areia de última geração, e boxes luxuosas para os cavalos. O ambiente tranquilo da Comporta proporciona condições ideais para o treino e desenvolvimento de cavalos e cavaleiros.

A equipa técnica inclui cavaleiros de nível internacional, veterinários especializados em medicina desportiva equina, e tratadores experientes. O programa de formação abrange desde iniciação até preparação para competição de Grande Prémio.

O Monte Velho organiza regularmente clínicas com cavaleiros de renome mundial e hospeda competições de Dressage que atraem participantes de toda a Europa.',
  'Comporta',
  'Alentejo',
  '+351 265 497 880',
  'info@montevelhoequestriancenter.com',
  'https://www.montevelhoequestriancenter.com',
  '@montevelhoequestrian',
  'https://facebook.com/montevelhoequestrian',
  'https://youtube.com/@montevelho',
  55,
  2008,
  ARRAY['Dressage', 'Formação de Cavaleiros', 'Preparação de Cavalos', 'Competição Internacional'],
  ARRAY['Veiga', 'Andrade', 'Coudelaria Nacional', 'Linhas Europeias'],
  ARRAY[
    'Centro de Treino Oficial FEP',
    'Organizador CDI Comporta',
    'Formador de cavaleiros olímpicos',
    'Prémio Excelência Hípica 2022'
  ],
  ARRAY['Aulas de Dressage', 'Treino de cavalos', 'Estágio de cavalos', 'Clínicas internacionais', 'Competições', 'Aluguer de cavalos', 'Alojamento para cavaleiros'],
  38.3833,
  -8.7833,
  'Segunda a Sábado: 08:00-20:00',
  '/images/coudelarias/montevelho/capa.jpg',
  ARRAY[
    '/images/coudelarias/montevelho/galeria-1.jpg',
    '/images/coudelarias/montevelho/galeria-2.jpg',
    '/images/coudelarias/montevelho/galeria-3.jpg',
    '/images/coudelarias/montevelho/galeria-4.jpg'
  ],
  'https://youtube.com/watch?v=montevelho',
  '[
    {"nome": "Elegante MV", "ano": 2020, "pelagem": "Castanho", "aptidao": "Dressage St. Georges", "preco": 65000, "vendido": false},
    {"nome": "Fabuloso MV", "ano": 2018, "pelagem": "Preto", "aptidao": "Dressage GP", "preco": 120000, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "Sarah Miller", "texto": "World-class facilities and training. My horse improved tremendously here.", "data": "2024-01"},
    {"autor": "Carlos Mendes", "texto": "O melhor centro de Dressage de Portugal. Profissionalismo total.", "data": "2023-12"}
  ]'::jsonb,
  ARRAY['dressage', 'competição', 'formação', 'comporta', 'elite'],
  true,
  true,
  4,
  'active',
  'pro'
),

-- =============================================
-- 5. HERDADE DA MALHADINHA NOVA
-- =============================================
(
  'Herdade da Malhadinha Nova',
  'malhadinha-nova',
  'Resort de luxo no Alentejo com coudelaria própria. Experiências equestres exclusivas num ambiente de cinco estrelas.',
  'A Herdade da Malhadinha Nova é um destino de luxo no coração do Baixo Alentejo, onde a paixão pelo vinho, pela gastronomia e pelos cavalos se fundem numa experiência única.

A coudelaria da Malhadinha cria cavalos Lusitanos em harmonia com a natureza alentejana. Os cavalos crescem em liberdade nos extensos prados da herdade, desenvolvendo um carácter dócil e uma rusticidade natural.

Os hóspedes podem desfrutar de passeios a cavalo pelas vinhas e olivais, participar em experiências de vindima equestre, ou simplesmente observar os cavalos ao pôr do sol enquanto degustam os vinhos premiados da propriedade.

A Malhadinha oferece também programas de aprendizagem equestre, desde iniciação até equitação de trabalho, sempre num ambiente exclusivo e personalizado.',
  'Albernoa',
  'Alentejo',
  '+351 284 965 432',
  'info@malhadinhanova.pt',
  'https://www.malhadinhanova.pt',
  '@malhadinhanova',
  'https://facebook.com/malhadinhanova',
  'https://youtube.com/@malhadinhanova',
  20,
  2003,
  ARRAY['Turismo Equestre de Luxo', 'Enoturismo', 'Lazer', 'Experiências Exclusivas'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY[
    'Wine Tourism Award 2023',
    'Best Luxury Rural Hotel Portugal 2022',
    'Prémio Enoturismo Sustentável 2021'
  ],
  ARRAY['Passeios a cavalo', 'Vindima a cavalo', 'Aulas de equitação', 'Spa', 'Restaurante gourmet', 'Provas de vinho', 'Alojamento 5 estrelas'],
  37.8167,
  -7.9833,
  'Todos os dias: 09:00-19:00',
  '/images/coudelarias/malhadinha/capa.jpg',
  ARRAY[
    '/images/coudelarias/malhadinha/galeria-1.jpg',
    '/images/coudelarias/malhadinha/galeria-2.jpg',
    '/images/coudelarias/malhadinha/galeria-3.jpg'
  ],
  'https://youtube.com/watch?v=malhadinha',
  '[]'::jsonb,
  '[
    {"autor": "Emma Thompson", "texto": "The most magical experience. Riding through the vineyards at sunset was unforgettable.", "data": "2024-02"},
    {"autor": "Ricardo Almeida", "texto": "Luxo, natureza e cavalos. A combinação perfeita.", "data": "2024-01"}
  ]'::jsonb,
  ARRAY['luxo', 'enoturismo', 'experiência', 'alentejo', 'vinhos'],
  true,
  true,
  5,
  'active',
  'pro'
),

-- =============================================
-- 6. COUDELARIA ANDRADE
-- =============================================
(
  'Coudelaria Andrade',
  'coudelaria-andrade',
  'Fundada por Ruy d''Andrade, um dos maiores estudiosos do cavalo Ibérico. Linhagem sinónimo de funcionalidade e tradição.',
  'A Coudelaria Andrade tem as suas raízes no trabalho monumental de Ruy d''Andrade, considerado um dos maiores estudiosos e preservadores do cavalo Lusitano do século XX.

Ruy d''Andrade dedicou a sua vida ao estudo e preservação do cavalo Ibérico. Foi ele quem, durante as invasões francesas, conseguiu salvar alguns dos últimos exemplares puros da raça Alter Real, contribuindo decisivamente para a sua preservação.

A linhagem Andrade é caracterizada por cavalos de grande funcionalidade, com aptidão natural para o trabalho de campo e para as artes equestres tradicionais. São cavalos nobres, corajosos e inteligentes.

Hoje, a Coudelaria Andrade continua o legado do seu fundador, mantendo os mais elevados padrões de seleção e criação, e contribuindo para a preservação das características originais do Puro Sangue Lusitano.',
  'Elvas',
  'Alentejo',
  '+351 268 628 000',
  'info@coudelariaandrade.pt',
  'https://www.coudelariaandrade.pt',
  '@coudelariaandrade',
  NULL,
  NULL,
  60,
  1910,
  ARRAY['Equitação de Trabalho', 'Toureio', 'Tradição Ibérica', 'Reprodução', 'Morfologia'],
  ARRAY['Andrade', 'Alter Real'],
  ARRAY[
    'Linhagem histórica preservada há mais de 100 anos',
    'Campeão Nacional Equitação de Trabalho (múltiplos)',
    'Reconhecimento APSL pela preservação genética'
  ],
  ARRAY['Venda de cavalos', 'Cobrições', 'Visitas à coudelaria'],
  38.8833,
  -7.1667,
  'Por marcação',
  '/images/coudelarias/andrade/capa.jpg',
  ARRAY[
    '/images/coudelarias/andrade/galeria-1.jpg',
    '/images/coudelarias/andrade/galeria-2.jpg'
  ],
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['andrade', 'tradição', 'trabalho', 'toureio', 'história'],
  false,
  false,
  0,
  'active',
  'gratuito'
),

-- =============================================
-- 7. FONTE BOA DOS NABOS
-- =============================================
(
  'Coudelaria Fonte Boa dos Nabos',
  'fonte-boa-dos-nabos',
  'Referência internacional em cavalos para Dressage de Grande Prémio. Exportação para os quatro cantos do mundo.',
  'A Coudelaria Fonte Boa dos Nabos é uma das mais prestigiadas coudelarias portuguesas no panorama internacional do Dressage. Fundada com a visão de produzir cavalos Lusitanos capazes de competir ao mais alto nível.

O programa de criação combina as melhores linhagens portuguesas com técnicas modernas de seleção e treino. Cada cavalo é avaliado criteriosamente quanto à sua conformação, movimentos, temperamento e potencial desportivo.

Os cavalos Fonte Boa têm conquistado pódios em competições internacionais e são procurados por cavaleiros de elite de todo o mundo. A coudelaria exporta regularmente para a Europa, Estados Unidos e Brasil.

As instalações incluem infraestruturas de competição, centro de reprodução com tecnologia de ponta, e programas de treino para cavalos jovens supervisionados por cavaleiros experientes.',
  'Rio Maior',
  'Ribatejo',
  '+351 243 999 180',
  'info@fonteboadosnabos.com',
  'https://www.fonteboadosnabos.com',
  '@fonteboadosnabos',
  'https://facebook.com/fonteboadosnabos',
  'https://youtube.com/@fonteboadosnabos',
  100,
  1990,
  ARRAY['Dressage Grande Prémio', 'Competição Internacional', 'Exportação', 'Reprodução de Elite'],
  ARRAY['Veiga', 'Andrade', 'Coudelaria Nacional', 'Linhas Alemãs'],
  ARRAY[
    'Produtor de múltiplos cavalos de Grande Prémio',
    'Exportação para mais de 20 países',
    'Campeão do Mundo WBFSH Dressage Breeding',
    'Prémio Excelência FEP 2023'
  ],
  ARRAY['Venda de cavalos de competição', 'Cobrições', 'Transferência de embriões', 'Treino de cavalos jovens', 'Visitas técnicas'],
  39.3333,
  -8.9333,
  'Segunda a Sexta: 09:00-18:00 | Sábados: 09:00-13:00',
  '/images/coudelarias/fonteboanaabos/capa.jpg',
  ARRAY[
    '/images/coudelarias/fonteboanaabos/galeria-1.jpg',
    '/images/coudelarias/fonteboanaabos/galeria-2.jpg',
    '/images/coudelarias/fonteboanaabos/galeria-3.jpg'
  ],
  'https://youtube.com/watch?v=fonteboanaabos',
  '[
    {"nome": "Lusitano FBN", "ano": 2019, "pelagem": "Castanho", "aptidao": "Dressage GP", "preco": 150000, "vendido": false},
    {"nome": "Magnífico FBN", "ano": 2020, "pelagem": "Preto", "aptidao": "Dressage St. Georges", "preco": 85000, "vendido": false},
    {"nome": "Nobre FBN", "ano": 2021, "pelagem": "Ruço", "aptidao": "Dressage M", "preco": 55000, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "Charlotte Dujardin", "texto": "Exceptional quality horses. The movement and trainability are outstanding.", "data": "2023-10"},
    {"autor": "Nuno Palma Santos", "texto": "Cavalos de classe mundial. Parceria de sucesso há muitos anos.", "data": "2024-01"}
  ]'::jsonb,
  ARRAY['dressage', 'grande prémio', 'exportação', 'competição', 'elite'],
  true,
  true,
  6,
  'active',
  'pro'
),

-- =============================================
-- 8. QUINTA DOS LOBOS
-- =============================================
(
  'Quinta dos Lobos',
  'quinta-dos-lobos',
  'Pequena coudelaria familiar em Mafra dedicada à criação de cavalos de qualidade superior com temperamento excepcional.',
  'A Quinta dos Lobos é uma coudelaria familiar situada nas colinas de Mafra, onde a paixão pelo cavalo Lusitano passa de geração em geração.

Com um efetivo reduzido, cada cavalo recebe atenção individual desde o nascimento. O foco está em produzir cavalos com temperamento excepcional, adequados tanto para amadores exigentes como para cavaleiros em início de carreira.

A filosofia da Quinta dos Lobos privilegia a qualidade sobre a quantidade. Os cavalos são criados em ambiente familiar, com muito contacto humano, o que resulta em animais dóceis, confiantes e fáceis de trabalhar.

A coudelaria oferece também um programa de apadrinhamento, onde entusiastas podem acompanhar o desenvolvimento de um poldro desde o nascimento.',
  'Mafra',
  'Lisboa',
  '+351 261 812 300',
  'quintadoslobos@gmail.com',
  NULL,
  '@quintadoslobos',
  NULL,
  NULL,
  15,
  1995,
  ARRAY['Lazer', 'Dressage Amador', 'Cavalos Família', 'Iniciação'],
  ARRAY['Veiga', 'Coudelaria Nacional'],
  ARRAY[
    'Cavalos campeões em concursos regionais',
    'Prémio Criador Revelação 2019'
  ],
  ARRAY['Venda de cavalos', 'Apadrinhamento de poldros', 'Visitas familiares'],
  38.9333,
  -9.3333,
  'Fins de semana por marcação',
  '/images/coudelarias/quintadoslobos/capa.jpg',
  ARRAY[
    '/images/coudelarias/quintadoslobos/galeria-1.jpg',
    '/images/coudelarias/quintadoslobos/galeria-2.jpg'
  ],
  NULL,
  '[
    {"nome": "Amigo QL", "ano": 2022, "pelagem": "Tordilho", "aptidao": "Lazer/Iniciação", "preco": 12000, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "Ana Rodrigues", "texto": "Compramos o nosso primeiro cavalo aqui. Apoio fantástico antes e depois da compra.", "data": "2023-09"}
  ]'::jsonb,
  ARRAY['família', 'amador', 'iniciação', 'mafra', 'qualidade'],
  false,
  false,
  0,
  'active',
  'gratuito'
),

-- =============================================
-- 9. COUDELARIA LUSITANUS (GOLEGÃ)
-- =============================================
(
  'Coudelaria Lusitanus',
  'coudelaria-lusitanus',
  'No coração da Golegã, terra do cavalo, a Coudelaria Lusitanus cria cavalos de elite para desporto e lazer.',
  'Situada na Golegã, a "Capital do Cavalo", a Coudelaria Lusitanus beneficia de uma localização privilegiada no coração da tradição equestre portuguesa.

Fundada por uma família com gerações de experiência na criação de cavalos, a Lusitanus combina conhecimento tradicional com técnicas modernas. O programa de criação está focado em produzir cavalos versáteis, com bons movimentos e temperamento equilibrado.

A proximidade à Feira Nacional do Cavalo, realizada anualmente na Golegã, permite à coudelaria participar ativamente neste evento emblemático e apresentar a sua produção aos apreciadores de todo o mundo.

A Lusitanus oferece cavalos para diferentes níveis e objectivos, desde lazer até competição, sempre com a garantia de qualidade e o acompanhamento personalizado.',
  'Golegã',
  'Ribatejo',
  '+351 249 976 234',
  'info@lusitanus.pt',
  'https://www.lusitanus.pt',
  '@coudelarialusitanus',
  'https://facebook.com/coudelarialusitanus',
  NULL,
  70,
  1985,
  ARRAY['Dressage', 'Lazer', 'Cavalos Jovens', 'Formação', 'Versatilidade'],
  ARRAY['Veiga', 'Andrade', 'Coudelaria Nacional'],
  ARRAY[
    'Presença constante na Feira da Golegã',
    'Múltiplos prémios em concursos morfológicos',
    'Reconhecimento APSL pela qualidade da produção'
  ],
  ARRAY['Venda de cavalos', 'Cobrições', 'Desbaste de poldros', 'Estágios', 'Visitas à coudelaria'],
  39.4000,
  -8.4833,
  'Segunda a Sábado: 09:00-18:00',
  '/images/coudelarias/lusitanus/capa.jpg',
  ARRAY[
    '/images/coudelarias/lusitanus/galeria-1.jpg',
    '/images/coudelarias/lusitanus/galeria-2.jpg',
    '/images/coudelarias/lusitanus/galeria-3.jpg'
  ],
  NULL,
  '[
    {"nome": "Valente L", "ano": 2020, "pelagem": "Castanho", "aptidao": "Dressage L/M", "preco": 28000, "vendido": false},
    {"nome": "Xerife L", "ano": 2021, "pelagem": "Ruço", "aptidao": "Lazer/Dressage", "preco": 18000, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "Manuel Sousa", "texto": "Cavalos bem preparados e honestos. Relação qualidade-preço excelente.", "data": "2024-02"}
  ]'::jsonb,
  ARRAY['golegã', 'tradição', 'feira', 'versátil', 'ribatejo'],
  true,
  false,
  0,
  'active',
  'pro'
),

-- =============================================
-- 10. HERDADE DO ROCIM
-- =============================================
(
  'Coudelaria Rocim',
  'coudelaria-rocim',
  'Integrada na premiada Herdade do Rocim, conhecida pelos seus vinhos, esta coudelaria cria Lusitanos em regime extensivo no Alentejo profundo.',
  'A Herdade do Rocim é conhecida internacionalmente pelos seus vinhos, mas a paixão pelos cavalos é igualmente profunda nesta propriedade alentejana.

A coudelaria cria cavalos Lusitanos em regime extensivo, em harmonia com a paisagem de montado que caracteriza a região. Os cavalos crescem em liberdade, desenvolvendo rusticidade e um carácter equilibrado.

A filosofia da Rocim está intimamente ligada à terra e à sustentabilidade. Os cavalos fazem parte integrante do ecossistema da herdade, contribuindo para a gestão dos pastos e para a biodiversidade.

Os visitantes podem combinar a experiência equestre com provas dos vinhos premiados da Rocim, num programa que celebra o melhor do Alentejo.',
  'Cuba',
  'Alentejo',
  '+351 284 415 295',
  'rocim@rocim.pt',
  'https://www.rocim.pt',
  '@herdadedorocim',
  'https://facebook.com/herdadedorocim',
  'https://youtube.com/@rocim',
  22,
  1998,
  ARRAY['Equitação de Trabalho', 'Enoturismo', 'Lazer', 'Sustentabilidade'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY[
    'Vinhos premiados internacionalmente',
    'Prémio Turismo Sustentável 2022',
    'Herdade integrada na Reserva da Biosfera'
  ],
  ARRAY['Passeios a cavalo', 'Vindima equestre', 'Provas de vinho', 'Visitas guiadas', 'Piqueniques'],
  38.1833,
  -7.9000,
  'Todos os dias: 10:00-18:00 (Abril-Outubro)',
  '/images/coudelarias/rocim/capa.jpg',
  ARRAY[
    '/images/coudelarias/rocim/galeria-1.jpg',
    '/images/coudelarias/rocim/galeria-2.jpg'
  ],
  'https://youtube.com/watch?v=rocim',
  '[]'::jsonb,
  '[
    {"autor": "Sofia Martins", "texto": "Experiência única. Passeio pelas vinhas ao pôr do sol seguido de prova de vinhos.", "data": "2023-08"}
  ]'::jsonb,
  ARRAY['vinhos', 'enoturismo', 'alentejo', 'sustentável', 'natureza'],
  true,
  false,
  0,
  'active',
  'pro'
),

-- =============================================
-- 11. COUDELARIA RAPOSA
-- =============================================
(
  'Coudelaria Raposa',
  'coudelaria-raposa',
  'Especialistas em cavalos para Dressage de competição. Treino profissional e preparação de cavalos jovens no Ribatejo.',
  'A Coudelaria Raposa é um centro de treino e criação especializado em Dressage, situado no coração do Ribatejo.

Com instalações profissionais e uma equipa técnica experiente, a Raposa prepara cavalos para competição desde as provas de iniciação até ao Grande Prémio. O programa de treino é personalizado para cada cavalo, respeitando o seu desenvolvimento físico e mental.

A coudelaria tem representação regular em competições nacionais e internacionais, com cavalos e cavaleiros que ostentam a sua bandeira em provas CDI por toda a Europa.

Além do treino de cavalos próprios, a Raposa oferece serviços de estágio e preparação para cavalos de clientes, sempre com o mesmo nível de profissionalismo e dedicação.',
  'Benavente',
  'Ribatejo',
  '+351 263 519 800',
  'coudelariaraposa@gmail.com',
  'https://www.coudelariaraposa.pt',
  '@coudelariaraposa',
  'https://facebook.com/coudelariaraposa',
  NULL,
  48,
  2005,
  ARRAY['Dressage', 'Competição', 'Cavalos Jovens', 'Treino Profissional'],
  ARRAY['Veiga', 'Coudelaria Nacional', 'Linhas Europeias'],
  ARRAY[
    'Múltiplos campeões nacionais',
    'Representação em CDI internacionais',
    'Centro de treino reconhecido FEP'
  ],
  ARRAY['Treino de cavalos', 'Estágio de cavalos', 'Venda de cavalos preparados', 'Aulas de Dressage'],
  38.9833,
  -8.8167,
  'Segunda a Sábado: 08:00-19:00',
  '/images/coudelarias/raposa/capa.jpg',
  ARRAY[
    '/images/coudelarias/raposa/galeria-1.jpg',
    '/images/coudelarias/raposa/galeria-2.jpg',
    '/images/coudelarias/raposa/galeria-3.jpg'
  ],
  NULL,
  '[
    {"nome": "Horizonte R", "ano": 2019, "pelagem": "Castanho", "aptidao": "Dressage Prix St. Georges", "preco": 75000, "vendido": false},
    {"nome": "Imperial R", "ano": 2020, "pelagem": "Preto", "aptidao": "Dressage M/S", "preco": 45000, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "Teresa Gonçalves", "texto": "Treino de excelência. O meu cavalo evoluiu imenso em 6 meses.", "data": "2024-01"}
  ]'::jsonb,
  ARRAY['dressage', 'competição', 'treino', 'ribatejo', 'profissional'],
  true,
  false,
  0,
  'active',
  'pro'
),

-- =============================================
-- 12. BARROCA D'ALVA
-- =============================================
(
  'Barroca d''Alva',
  'barroca-dalva',
  'No coração do Douro Vinhateiro, experiências equestres únicas entre vinhas em socalcos e paisagens Património Mundial.',
  'A Barroca d''Alva oferece uma experiência equestre única no coração da região demarcada do Douro, classificada como Património Mundial pela UNESCO.

Os cavalos Lusitanos da propriedade são companheiros perfeitos para explorar as espetaculares paisagens de vinhas em socalcos que caracterizam esta região mágica. Os passeios a cavalo atravessam as vinhas centenárias, proporcionando vistas deslumbrantes sobre o rio Douro.

A experiência pode ser complementada com visitas às caves de vinho do Porto, provas de vinhos DOC Douro, e refeições típicas com produtos locais. É a combinação perfeita entre o cavalo, o vinho e a paisagem.

Para os mais aventureiros, a Barroca d''Alva organiza expedições equestres de vários dias, percorrendo aldeias vinhateiras e quintas históricas do Douro.',
  'São João da Pesqueira',
  'Douro',
  '+351 254 730 100',
  'info@barrocadalva.pt',
  'https://www.barrocadalva.pt',
  '@barrocadalva',
  'https://facebook.com/barrocadalva',
  NULL,
  18,
  2010,
  ARRAY['Turismo Equestre', 'Enoturismo', 'Passeios a Cavalo', 'Expedições'],
  ARRAY['Veiga', 'Coudelaria Nacional'],
  ARRAY[
    'Melhor Experiência Turística Douro 2022',
    'Certificação Turismo de Portugal',
    'Prémio Inovação Enoturismo 2021'
  ],
  ARRAY['Passeios a cavalo', 'Expedições equestres', 'Provas de vinho', 'Piqueniques nas vinhas', 'Alojamento'],
  41.1500,
  -7.4000,
  'Todos os dias: 09:00-18:00 (Março-Novembro)',
  '/images/coudelarias/barrocadalva/capa.jpg',
  ARRAY[
    '/images/coudelarias/barrocadalva/galeria-1.jpg',
    '/images/coudelarias/barrocadalva/galeria-2.jpg',
    '/images/coudelarias/barrocadalva/galeria-3.jpg'
  ],
  'https://youtube.com/watch?v=barrocadalva',
  '[]'::jsonb,
  '[
    {"autor": "James Wilson", "texto": "Breathtaking scenery. The best way to experience the Douro Valley.", "data": "2023-09"},
    {"autor": "Inês Ferreira", "texto": "Uma experiência inesquecível. Os cavalos são dóceis e as vistas magníficas.", "data": "2024-01"}
  ]'::jsonb,
  ARRAY['douro', 'vinhos', 'unesco', 'passeios', 'turismo'],
  true,
  false,
  0,
  'active',
  'pro'
),

-- =============================================
-- 13. COUDELARIA SÃO TIAGO
-- =============================================
(
  'Coudelaria São Tiago',
  'sao-tiago',
  'Centro de referência no Norte de Portugal para criação e formação de cavalos Lusitanos.',
  'A Coudelaria São Tiago é a principal referência equestre no Norte de Portugal. Situada em Vila do Conde, combina a tradição da criação de cavalos Lusitanos com um centro de formação moderno.

O programa de criação está focado em cavalos jovens com potencial para Dressage, mas também para outras disciplinas equestres. A seleção privilegia cavalos com bons movimentos, temperamento equilibrado e facilidade de treino.

O centro de formação oferece programas para cavaleiros de todos os níveis, desde iniciação até alta competição. A equipa técnica inclui cavaleiros experientes e instrutores certificados pela Federação Equestre Portuguesa.

A São Tiago organiza regularmente clínicas e eventos equestres, contribuindo para o desenvolvimento da equitação no Norte do país.',
  'Vila do Conde',
  'Porto',
  '+351 252 631 400',
  'coudelaria@saotiago.pt',
  'https://www.saotiago.pt',
  '@coudelariasaotiago',
  'https://facebook.com/coudelariasaotiago',
  NULL,
  40,
  1992,
  ARRAY['Dressage', 'Formação', 'Cavalos Jovens', 'Desbaste', 'Centro Hípico'],
  ARRAY['Veiga', 'Coudelaria Nacional'],
  ARRAY[
    'Principal centro equestre do Norte',
    'Formador de cavaleiros federados',
    'Organizador de provas regionais FEP'
  ],
  ARRAY['Aulas de equitação', 'Treino de cavalos', 'Desbaste de poldros', 'Venda de cavalos', 'Estágio de cavalos', 'Eventos equestres'],
  41.3500,
  -8.7500,
  'Segunda a Sábado: 08:00-20:00',
  '/images/coudelarias/saotiago/capa.jpg',
  ARRAY[
    '/images/coudelarias/saotiago/galeria-1.jpg',
    '/images/coudelarias/saotiago/galeria-2.jpg'
  ],
  NULL,
  '[
    {"nome": "Gladiador ST", "ano": 2021, "pelagem": "Castanho", "aptidao": "Dressage E/L", "preco": 22000, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "Pedro Oliveira", "texto": "O melhor centro hípico do Norte. Profissionais competentes e dedicados.", "data": "2023-11"}
  ]'::jsonb,
  ARRAY['norte', 'formação', 'centro hípico', 'vila do conde', 'aulas'],
  true,
  false,
  0,
  'active',
  'pro'
),

-- =============================================
-- 14. MORGADO LUSITANO
-- =============================================
(
  'Morgado Lusitano',
  'morgado-lusitano',
  'Coudelaria familiar no Minho com três gerações dedicadas à criação de cavalos Lusitanos de qualidade.',
  'O Morgado Lusitano é uma coudelaria familiar situada no verde Minho, onde três gerações da mesma família têm dedicado a sua vida ao cavalo Lusitano.

A filosofia de criação é artesanal: cada cavalo é tratado como membro da família, com atenção individualizada desde o nascimento. O resultado são cavalos com temperamento excepcional, confiantes e bem socializados.

A coudelaria é especialista em cavalos para amadores e famílias. São cavalos honestos, seguros e fáceis de montar, ideais para quem procura um companheiro para passeios e lazer.

O acompanhamento pós-venda é uma marca distintiva do Morgado Lusitano. Os compradores podem contar com apoio e aconselhamento muito depois de levarem o seu cavalo para casa.',
  'Ponte de Lima',
  'Minho',
  '+351 258 941 200',
  'morgadolusitano@gmail.com',
  NULL,
  '@morgadolusitano',
  NULL,
  NULL,
  25,
  1970,
  ARRAY['Lazer', 'Dressage Amador', 'Cavalos Família', 'Iniciação'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY[
    'Três gerações de criadores',
    'Especialistas em cavalos para amadores',
    'Reconhecimento pela qualidade do temperamento'
  ],
  ARRAY['Venda de cavalos', 'Acompanhamento pós-venda', 'Visitas à coudelaria'],
  41.7667,
  -8.5833,
  'Por marcação',
  '/images/coudelarias/morgado/capa.jpg',
  ARRAY[
    '/images/coudelarias/morgado/galeria-1.jpg'
  ],
  NULL,
  '[
    {"nome": "Caramelo ML", "ano": 2021, "pelagem": "Palomino", "aptidao": "Lazer", "preco": 10000, "vendido": false},
    {"nome": "Dançarino ML", "ano": 2020, "pelagem": "Tordilho", "aptidao": "Lazer/Iniciação", "preco": 12000, "vendido": false}
  ]'::jsonb,
  '[
    {"autor": "Família Pereira", "texto": "O nosso primeiro cavalo. O Sr. Manuel ajudou-nos em tudo. Recomendamos.", "data": "2023-06"}
  ]'::jsonb,
  ARRAY['família', 'minho', 'amador', 'lazer', 'tradição'],
  false,
  false,
  0,
  'active',
  'gratuito'
),

-- =============================================
-- 15. QUINTA DA FOZ
-- =============================================
(
  'Quinta da Foz',
  'quinta-da-foz',
  'Criação tradicional de Lusitanos no Ribatejo desde 1985. Cavalos funcionais com aptidão para múltiplas disciplinas.',
  'A Quinta da Foz é uma coudelaria tradicional do Ribatejo, região historicamente ligada ao cavalo em Portugal. Desde 1985, dedica-se à criação de cavalos Lusitanos funcionais e versáteis.

O programa de criação está baseado nas melhores famílias portuguesas, com foco em cavalos que combinem beleza, bons movimentos e temperamento equilibrado. São cavalos adequados para diferentes disciplinas: Dressage, equitação de trabalho, ou simplesmente lazer.

A Quinta da Foz participa regularmente nos concursos morfológicos e funcionais organizados pela APSL, tendo conquistado vários prémios ao longo dos anos.

A coudelaria mantém um efetivo criteriosamente selecionado, privilegiando sempre a qualidade sobre a quantidade.',
  'Santarém',
  'Ribatejo',
  '+351 243 429 100',
  'quintadafoz@mail.pt',
  NULL,
  '@quintadafoz_lusitanos',
  NULL,
  NULL,
  35,
  1985,
  ARRAY['Dressage', 'Equitação de Trabalho', 'Versatilidade', 'Morfologia'],
  ARRAY['Veiga', 'Andrade', 'Coudelaria Nacional'],
  ARRAY[
    'Prémios em concursos morfológicos APSL',
    'Cavalos funcionais reconhecidos'
  ],
  ARRAY['Venda de cavalos', 'Cobrições', 'Visitas'],
  39.2333,
  -8.6833,
  'Por marcação',
  '/images/coudelarias/quintadafoz/capa.jpg',
  ARRAY[
    '/images/coudelarias/quintadafoz/galeria-1.jpg'
  ],
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['ribatejo', 'tradição', 'versátil', 'morfologia', 'funcional'],
  false,
  false,
  0,
  'active',
  'gratuito'
),

-- =============================================
-- 16. COUDELARIA ORTIGÃO COSTA
-- FONTE: https://coudelariaortigaocosta.com/en/history
-- FONTE: https://www.equisport.pt/noticias/faleceu-dr-luis-jorge-ortigao-costa/
-- FONTE: https://www.eurodressage.com/2023/04/03/ilegivel-oc-exciting-lusitano-grand-prix-prospect-dawn-white-o-connor
-- FONTE: https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage (Ripado OC)
-- VERIFICADO: 2026-02-22
-- =============================================
(
  'Coudelaria Ortigão Costa',
  'ortigao-costa',
  'Fundada em 1963, a Coudelaria Ortigão Costa é uma das maiores coudelarias privadas de Lusitanos em Portugal. Especializada na criação de cavalos pretos de elite, tem produzido cavalos de topo para Dressage, Toureio e exportação internacional.',
  'A Coudelaria Ortigão Costa foi fundada em 1963 pelo Dr. Luís Jorge Roldan Ortigão Blanck da Costa, médico veterinário natural de Alcantarilha, Silves. O fundador iniciou a coudelaria com um grupo de éguas pretas adquiridas das melhores coudelarias portuguesas e um garanhão fundador chamado Fúria, proveniente da Coudelaria Ferro Coimbra.

O Dr. Luís Ortigão Costa foi uma figura multifacetada — além de criador de Lusitanos, foi também ganadeiro de toiros bravos na Herdade de Alcobaça em Elvas e gestor da Praça de Toiros do Campo Pequeno em Lisboa. Recebeu a primeira Medalha de Ouro da Câmara Municipal de Azambuja e foi Comendador da Ordem do Mérito Agrícola. Faleceu a 1 de Dezembro de 2010, aos 83 anos.

Ao longo das décadas, a coudelaria produziu cavalos que marcaram a história do Lusitano. Ripado (OC), montado por Carlos Pinto, foi um dos primeiros Lusitanos a competir ao nível de Grand Prix de Dressage internacional, participando no Campeonato Europeu de 1990. Mais recentemente, Xelim OC alcançou o 1.º lugar entre os Lusitanos no ranking WBFSH em 2015, e Ilusionista OC foi eleito Melhor Cavalo Lusitano de Toureio em 2019 (Debutantes) e 2020 (Consagrados).

A égua Ordenança OC, matriarca da coudelaria, produziu 18 descendentes Lusitanos incluindo Xelim OC, Cartaxo OC e Ilusionista OC, antes de falecer em Abril de 2023 aos 28 anos.

Hoje, a coudelaria é gerida por Jorge Ortigão Costa e mantém um efetivo de cerca de 50 éguas Lusitanas pretas, além de um programa de criação de cavalos Portugueses de Desporto.',
  'Azambuja',
  'Ribatejo',
  '+351 917 232 410',
  'jorgeoc@sogepoc.pt',
  'https://coudelariaortigaocosta.com',
  '@ortigaocostastud',
  'https://facebook.com/coudelariaortigaocosta',
  NULL,
  50,
  1963,
  ARRAY['Dressage', 'Toureio', 'Reprodução', 'Exportação Internacional', 'Lusitanos Pretos'],
  ARRAY['Fúria (fundador)', 'Elmo MV'],
  ARRAY[
    'Ripado OC — Campeonato Europeu de Dressage 1990 (Carlos Pinto)',
    'Babel OC — Campeão Ibérico 1972',
    'Xelim OC — 1.º Lusitano no ranking WBFSH 2015',
    'Ilusionista OC — Melhor Lusitano de Toureio 2019 e 2020',
    'Ilegível OC — Grand Prix prospect, vendido para os EUA 2022'
  ],
  ARRAY['Venda de cavalos', 'Cobrições', 'Exportação'],
  39.0636,
  -8.8869,
  'Por marcação',
  '/images/coudelarias/ortigao-costa/capa.jpg',
  ARRAY[
    '/images/coudelarias/ortigao-costa/galeria-1.jpg'
  ],
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['ribatejo', 'azambuja', 'pretos', 'dressage', 'toureio', 'exportação', 'ortigão costa'],
  false,
  false,
  0,
  'active',
  'gratuito'
);

-- =============================================
-- 17. COUDELARIA JOÃO PEDRO RODRIGUES
-- FONTE: Conteúdo fornecido pelo proprietário / equitador.pt
-- NOTA: João Pedro Rodrigues é Mestre Picador Chefe da EPAE,
--       ex-juiz da raça PSL, Melhor Criador FIPSL 2004,
--       criador com mais títulos de Campeão dos Campeões
--       dos últimos 40 anos na Feira da Golegã.
-- VERIFICADO: 2026-02-22
-- =============================================
(
  'Coudelaria João Pedro Rodrigues',
  'joao-pedro-rodrigues',
  'Fundada em 1992, a Coudelaria João Pedro Rodrigues é criadora do OXIDADO, o cavalo mais premiado do mundo em Equitação de Trabalho. Especialista em cavalos castanhos de linha Veiga, com dezenas de prémios nas principais feiras da especialidade.',
  'A Coudelaria João Pedro Rodrigues foi fundada em 1992 com éguas de pelagem castanha, oriundas da Casa Cadaval e filhas de cavalos de linha Veiga. Serviu-se principalmente dos garanhões XAQUIRO (Quina), HOSTIL (Borba), ROUXINOL (Ferro da Casa) e mais recentemente RUBI (Alter Real).

João Pedro Rodrigues iniciou-se na equitação aos 10 anos. Foi cavaleiro federado em três modalidades: obstáculos, ensino desportivo (dressage) e concurso completo. Foi aluno de João Trigueiros de Aragão, D. Diogo de Lafões, Mestre Nuno de Oliveira e do Dr. Guilherme Borba. Em 1980, estagiou na Escola Espanhola de Equitação de Viena.

Entrou para a Escola Portuguesa de Arte Equestre em 1980, um ano após a sua fundação, onde hoje é Mestre Picador Chefe. Foi também Membro da Direção da APSL e Juiz da Raça durante 10 anos, tendo viajado por todo o mundo.

Em 2004, conquistou a distinção de Melhor Criador da Raça no FIPSL e é atualmente o criador com mais títulos de Campeão dos Campeões dos últimos 40 anos na Feira da Golegã.

A Coudelaria tem vindo a distinguir-se com inúmeros cavalos lusitanos premiados, sendo um deles o OXIDADO, oficialmente reconhecido como o cavalo mais premiado do Mundo em Equitação de Trabalho. A eguada conta com 15 éguas de ventre, predominantemente de pelagem castanha, de linhagem Veiga/Alter com sangue Andrade.

Todos os anos, a Coudelaria tem novas piaras de poldros a nascerem entre Janeiro e Maio. O Monte dos Apupos proporciona condições ideais para a criação desde o nascimento até ao momento em que são recolhidos para serem montados ou selecionados como reprodutores.',
  'Samora Correia',
  'Ribatejo',
  '+351 917 568 819',
  'jprlusitanos@sapo.pt',
  'https://equitador.pt',
  '@jprlusitanos',
  NULL,
  NULL,
  50,
  1992,
  ARRAY['Equitação de Trabalho', 'Dressage', 'Ensino Clássico', 'Modelo e Andamentos', 'Reprodução'],
  ARRAY['Veiga', 'Alter Real', 'Casa Cadaval', 'Quina'],
  ARRAY[
    'OXIDADO jpr — Cavalo mais premiado do mundo em Equitação de Trabalho',
    'Melhor Criador da Raça — FIPSL 2004',
    'Criador com mais títulos de Campeão dos Campeões (40 anos Feira da Golegã)',
    'Múltiplos campeões em feiras nacionais'
  ],
  ARRAY['Venda de cavalos', 'Cobrições', 'Aulas de equitação', 'Estágios internacionais'],
  38.9341,
  -8.8828,
  'Por marcação',
  '/images/coudelarias/joao-pedro-rodrigues/capa.jpg',
  ARRAY[
    '/images/coudelarias/joao-pedro-rodrigues/galeria-1.jpg'
  ],
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['equitação de trabalho', 'oxidado', 'veiga', 'samora correia', 'golegã', 'campeões', 'dressage clássico', 'epae'],
  false,
  true,
  6,
  'active',
  'gratuito'
);

-- =============================================
-- VERIFICAR INSERÇÕES
-- =============================================
SELECT
  nome,
  regiao,
  is_pro,
  destaque,
  status
FROM coudelarias
ORDER BY destaque DESC, ordem_destaque, nome;
