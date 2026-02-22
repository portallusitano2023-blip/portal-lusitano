-- =============================================
-- INSERT: Lusitanos d'Atela
-- Executar no Supabase SQL Editor
-- Não apaga dados existentes — só adiciona esta coudelaria
--
-- FONTES VERIFICADAS (2026-02-22):
-- https://lusitanosdatela.com/
-- https://www.visitportugal.com/en/content/lusitanos-datela-coudelaria-bessa-de-carvalho
-- https://www.visitribatejo.pt/en/catalogue/what-to-do/tourist-activities/lusitanos-d-atela/
-- https://www.eurodressage.com/2025/09/12/carlos-pintos-soberano-passed-away
-- https://www.eurodressage.com/2021/04/01/hercules-datela-receives-4-recommendation-portuguese-lusitano-studbook
-- https://www.fei.org/horse/104PV85 (Xenofonte d'Atela WEG 2018)
-- https://www.equisport.pt/noticias/feira-anual-da-trofa-2019-oeste-datela-eleito-campeao-macho-e-campeao-de-campeoes/
-- https://www.mediotejo.net/golega-lenda-datela-e-horta-do-loyal-vencem-expoegua-2018/
-- https://www.cavalo-lusitano.com/pt/noticias/resultados-2-salao-do-cavalo-lusitano-2025
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
  'Lusitanos d''Atela',
  'lusitanos-datela',
  'Coudelaria familiar do Ribatejo fundada em 1989 por Francisco Bessa de Carvalho, Mestre-Picador da Escola Portuguesa de Arte Equestre. Referência nacional na criação e selecção do Puro-Sangue Lusitano, com cavalos em 5 continentes e presença nos WEG de 2014 e 2018.',
  'A Lusitanos d''Atela foi fundada em 1989 por Francisco Bessa de Carvalho, Mestre-Picador da Escola Portuguesa de Arte Equestre (EPAE), e sua esposa Ana Bessa de Carvalho. Localizada na Quinta do Paul d''Atela, em Casalinho (Alpiarça), no coração do Ribatejo, a coudelaria dedica-se à criação, selecção e promoção do Puro-Sangue Lusitano a nível mundial.

Ao longo de mais de três décadas, a coudelaria construiu um palmarés assinalável em concursos nacionais e internacionais de morfologia e andamentos. Os seus cavalos estão presentes em 5 continentes, tendo dois deles representado Portugal nos Campeonatos do Mundo de Equestre (WEG): Soberano nos WEG de Caen 2014, com Carlos Pinto, no Grand Prix de Dressage (melhor resultado da equipa portuguesa com 68.800%); e Xenofonte d''Atela nos WEG de Tryon 2018, com Miguel Ralão Duarte.

Hercules d''Atela, filho de Soberano, sagrou-se Campeão no Festival Internacional Lusitano de 2015 e 2016 e conquistou o Campeonato Europeu de Criação Lusitana de 2016, em Neu Anspach (Alemanha). Foi aprovado como garanhão com 4 estrelas pelo Livro Genealógico Português (APSL).

Soberano (1999–2025), garanhão de Mérito criado por Guilherme Borba e propriedade de Francisco Bessa de Carvalho, foi duas vezes Campeão de Campeões na Feira Nacional do Cavalo da Golegã, e deixou 193 descendentes registados entre 2004 e 2024. Faleceu em Março de 2025, com 26 anos.

Para além da coudelaria principal em Alpiarça, a família Bessa de Carvalho tem também um centro de treino equestre em Caneças (Odivelas), a 12 km de Lisboa, onde oferece aulas de equitação. A coudelaria recebe visitas e organiza passeios a cavalo pela paisagem ribatejana.',
  'Casalinho, Alpiarça',
  'Ribatejo',
  '+351 966 433 502',
  'lusitanos.atela@gmail.com',
  'https://lusitanosdatela.com/',
  '@lusitanosdatela',
  NULL,
  NULL,
  NULL,
  1989,
  ARRAY['Criação e Selecção PSL', 'Dressage', 'Modelo e Andamentos', 'Turismo Equestre', 'Aulas de Equitação'],
  NULL,
  ARRAY[
    'Soberano — WEG Caen 2014 com Carlos Pinto (68.800% Grand Prix, melhor resultado PT)',
    'Xenofonte d''Atela — WEG Tryon 2018 com Miguel Ralão Duarte',
    'Hercules d''Atela — Campeão Europeu de Criação Lusitana 2016 (Neu Anspach, Alemanha)',
    'Hercules d''Atela — Campeão Festival Internacional Lusitano 2015 e 2016',
    'Soberano — 2× Campeão de Campeões Feira Nacional do Cavalo da Golegã',
    'Oeste d''Atela — Campeão Macho e Campeão de Campeões Feira da Trofa 2019',
    'Lenda d''Atela — Égua de Ouro ExpoÉgua Nacional 2018 (Golegã)',
    'Melhor Criador por 3 anos consecutivos — Feira Anual da Trofa'
  ],
  ARRAY['Criação e selecção de PSL', 'Venda de cavalos', 'Turismo equestre', 'Passeios a cavalo', 'Aulas de equitação', 'Visitas à coudelaria'],
  39.2377,
  -8.5648,
  NULL,
  '/images/coudelarias/lusitanos-datela/capa.jpg',
  ARRAY['/images/coudelarias/lusitanos-datela/capa.jpg'],
  NULL,
  '[
    {"nome": "Soberano", "ano": 1999, "pelagem": "Tordilho", "aptidao": "Dressage Grand Prix / WEG Caen 2014", "vendido": false, "nota": "Falecido Março 2025. 193 descendentes registados. FONTE: eurodressage.com"},
    {"nome": "Hercules d''Atela", "ano": 2013, "pelagem": "Cinzento", "aptidao": "Modelo — Campeão Europeu Criação Lusitana 2016", "vendido": true, "nota": "Aprovação 4 estrelas APSL. FONTE: eurodressage.com"},
    {"nome": "Xenofonte d''Atela", "ano": 2003, "pelagem": "Tordilho", "aptidao": "Dressage Grand Prix / WEG Tryon 2018", "vendido": true, "nota": "FONTE: fei.org/horse/104PV85"},
    {"nome": "Oeste d''Atela", "ano": null, "pelagem": null, "aptidao": "Modelo — Campeão de Campeões Trofa 2019", "vendido": false, "nota": "FONTE: equisport.pt"},
    {"nome": "Lenda d''Atela", "ano": null, "pelagem": null, "aptidao": "Modelo — Égua de Ouro ExpoÉgua 2018", "vendido": false, "nota": "FONTE: mediotejo.net"}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['ribatejo', 'alpiarça', 'criação', 'selecção', 'weg', 'dressage', 'modelo andamentos', 'turismo equestre', 'francisco bessa de carvalho', 'epae'],
  false,
  false,
  0,
  'active',
  'gratuito'
);
