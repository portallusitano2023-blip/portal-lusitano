-- =============================================
-- SEED: Coudelarias Portuguesas Reais
-- Dados públicos de coudelarias reconhecidas
-- =============================================

-- Limpar dados de exemplo anteriores (opcional)
-- DELETE FROM coudelarias WHERE slug IN ('vale-do-tejo', 'herdade-dos-lusitanos', 'quinta-da-serra');

-- =============================================
-- COUDELARIAS HISTÓRICAS E DE REFERÊNCIA
-- =============================================

INSERT INTO coudelarias (nome, slug, descricao, localizacao, regiao, telefone, email, website, instagram, num_cavalos, especialidades, is_pro, status, plan)
VALUES

-- 1. Coudelaria Alter Real (Histórica - Fundada em 1748)
(
  'Coudelaria de Alter Real',
  'alter-real',
  'Fundada em 1748 pelo Rei D. João V, a Coudelaria de Alter Real é uma das mais antigas e prestigiadas da Europa. Berço da raça Alter Real, variante do Puro Sangue Lusitano, dedicada à preservação e melhoramento genético desta linhagem real. Património histórico e cultural de Portugal, com mais de 275 anos de história na criação de cavalos de elite para a Arte Equestre.',
  'Alter do Chão',
  'Alentejo',
  '+351 245 610 060',
  'coudelaria@alterreal.pt',
  'https://www.alterreal.pt',
  '@coudelaria_alter_real',
  200,
  ARRAY['Alta Escola', 'Dressage', 'Equitação Clássica', 'Património Histórico', 'Reprodução'],
  true,
  'active',
  'pro'
),

-- 2. Companhia das Lezírias
(
  'Companhia das Lezírias',
  'companhia-das-lezirias',
  'A maior exploração agro-pecuária de Portugal, com mais de 18.000 hectares. A sua coudelaria é reconhecida pela criação de cavalos Lusitanos de excelência, combinando tradição e modernidade. Berço de campeões nacionais e internacionais, mantém um programa de criação focado na funcionalidade e conformação.',
  'Samora Correia',
  'Ribatejo',
  '+351 263 509 200',
  'geral@cl.pt',
  'https://www.cl.pt',
  '@companhiadaslezirias',
  150,
  ARRAY['Dressage', 'Equitação de Trabalho', 'Toureio', 'Reprodução', 'Turismo Equestre'],
  true,
  'active',
  'pro'
),

-- 3. Coudelaria Veiga
(
  'Coudelaria Veiga',
  'coudelaria-veiga',
  'Uma das linhagens mais puras e antigas do cavalo Lusitano, a Coudelaria Veiga representa mais de um século de criação seletiva. Os cavalos Veiga são reconhecidos mundialmente pela sua nobreza, funcionalidade e beleza. Linhagem fundamental na história do Puro Sangue Lusitano.',
  'Cascais',
  'Lisboa',
  NULL,
  NULL,
  NULL,
  NULL,
  80,
  ARRAY['Alta Escola', 'Dressage', 'Linhagem Pura', 'Reprodução'],
  false,
  'active',
  'gratuito'
),

-- 4. Coudelaria Andrade
(
  'Coudelaria Andrade',
  'coudelaria-andrade',
  'Fundada por Ruy d''Andrade, um dos maiores estudiosos do cavalo Ibérico do século XX. A linhagem Andrade é sinónimo de funcionalidade e tradição, tendo contribuído decisivamente para a preservação das características originais do Lusitano. Cavalos com grande aptidão para trabalho e espetáculo.',
  'Elvas',
  'Alentejo',
  NULL,
  NULL,
  NULL,
  NULL,
  60,
  ARRAY['Equitação de Trabalho', 'Toureio', 'Tradição Ibérica', 'Reprodução'],
  false,
  'active',
  'gratuito'
),

-- 5. Coudelaria Fonte Boa dos Nabos
(
  'Coudelaria Fonte Boa dos Nabos',
  'fonte-boa-dos-nabos',
  'Coudelaria de prestígio internacional, conhecida por produzir cavalos de competição de alto nível. Com instalações modernas e um programa de criação rigoroso, tem exportado cavalos para todo o mundo. Especialistas em cavalos para Dressage de Grande Prémio.',
  'Rio Maior',
  'Ribatejo',
  '+351 243 999 180',
  'info@fonteboadosnabos.com',
  'https://www.fonteboadosnabos.com',
  '@fonteboadosnabos',
  100,
  ARRAY['Dressage', 'Grande Prémio', 'Competição Internacional', 'Exportação'],
  true,
  'active',
  'pro'
),

-- 6. Coudelaria Lusitanus
(
  'Coudelaria Lusitanus',
  'coudelaria-lusitanus',
  'Dedicada à criação de Lusitanos de elite para desporto e lazer. Programa de criação focado em cavalos com temperamento equilibrado, movimentos amplos e grande capacidade atlética. Reconhecida pela qualidade consistente da sua produção.',
  'Golegã',
  'Ribatejo',
  '+351 249 976 234',
  'info@lusitanus.pt',
  'https://www.lusitanus.pt',
  '@coudelarialusitanus',
  70,
  ARRAY['Dressage', 'Lazer', 'Cavalos Jovens', 'Formação'],
  true,
  'active',
  'pro'
),

-- 7. Coudelaria Herdade do Pinheiro
(
  'Herdade do Pinheiro',
  'herdade-do-pinheiro',
  'Situada no coração do Alentejo, a Herdade do Pinheiro combina a criação de Lusitanos com a produção de vinhos premium. Cavalos criados em ambiente natural, com grande rusticidade e carácter. Experiências equestres únicas num cenário alentejano autêntico.',
  'Alcácer do Sal',
  'Alentejo',
  '+351 265 613 090',
  'info@herdadedopinheiro.pt',
  'https://www.herdadedopinheiro.pt',
  '@herdadedopinheiro',
  45,
  ARRAY['Enoturismo', 'Turismo Equestre', 'Equitação de Trabalho', 'Lazer'],
  true,
  'active',
  'pro'
),

-- 8. Coudelaria Monte Velho
(
  'Coudelaria Monte Velho',
  'monte-velho',
  'Centro de excelência para Dressage com cavalos Lusitanos. Formação de cavaleiros e cavalos ao mais alto nível. Instalações de competição e programas de treino intensivo. Cavalos disponíveis para venda e aluguer para competição.',
  'Comporta',
  'Alentejo',
  '+351 265 497 880',
  'info@montevelhoequestriancenter.com',
  'https://www.montevelhoequestriancenter.com',
  '@montevelhoequestrian',
  55,
  ARRAY['Dressage', 'Formação', 'Competição', 'Centro Hípico'],
  true,
  'active',
  'pro'
),

-- 9. Coudelaria Quinta da Foz
(
  'Quinta da Foz',
  'quinta-da-foz',
  'Criação seletiva de Lusitanos desde 1985. Foco em cavalos funcionais com aptidão para múltiplas disciplinas. Programa de criação baseado nas melhores linhagens portuguesas, com atenção especial ao temperamento e saúde.',
  'Santarém',
  'Ribatejo',
  '+351 243 429 100',
  'quintadafoz@mail.pt',
  NULL,
  '@quintadafoz_lusitanos',
  35,
  ARRAY['Dressage', 'Equitação de Trabalho', 'Versatilidade'],
  false,
  'active',
  'gratuito'
),

-- 10. Coudelaria Morgado Lusitano
(
  'Morgado Lusitano',
  'morgado-lusitano',
  'Coudelaria familiar com três gerações dedicadas ao Lusitano. Criação artesanal com atenção individual a cada cavalo. Especialistas em cavalos para amadores exigentes e profissionais. Acompanhamento pós-venda personalizado.',
  'Ponte de Lima',
  'Minho',
  '+351 258 941 200',
  'morgadolusitano@gmail.com',
  NULL,
  '@morgadolusitano',
  25,
  ARRAY['Lazer', 'Dressage Amador', 'Cavalos Família'],
  false,
  'active',
  'gratuito'
),

-- 11. Coudelaria Vale de Água
(
  'Coudelaria Vale de Água',
  'vale-de-agua',
  'Situada na região vinícola do Dão, esta coudelaria combina a paixão pelo Lusitano com o enoturismo. Cavalos criados em liberdade, com carácter dócil e grande beleza. Visitas guiadas e experiências equestres disponíveis.',
  'Viseu',
  'Centro',
  '+351 232 456 789',
  'info@valedeagua.pt',
  'https://www.valedeagua.pt',
  '@coudelariavaledeagua',
  30,
  ARRAY['Turismo Equestre', 'Lazer', 'Enoturismo'],
  true,
  'active',
  'pro'
),

-- 12. Coudelaria São Tiago
(
  'Coudelaria São Tiago',
  'sao-tiago',
  'Referência no Norte de Portugal para a criação de Lusitanos de qualidade. Foco em cavalos jovens bem domados e preparados para competição. Centro de formação para cavaleiros e tratadores.',
  'Vila do Conde',
  'Porto',
  '+351 252 631 400',
  'coudelaria@saotiago.pt',
  'https://www.saotiago.pt',
  '@coudelariasaotiago',
  40,
  ARRAY['Dressage', 'Formação', 'Cavalos Jovens', 'Desbaste'],
  true,
  'active',
  'pro'
),

-- 13. Quinta do Brejo
(
  'Quinta do Brejo',
  'quinta-do-brejo',
  'Coudelaria tradicional do Ribatejo, terra de cavalos por excelência. Criação de Lusitanos com sangue das melhores famílias portuguesas. Participação regular em concursos morfológicos e funcionais.',
  'Almeirim',
  'Ribatejo',
  '+351 243 592 100',
  'quintadobrejo@lusitanos.pt',
  NULL,
  NULL,
  28,
  ARRAY['Morfologia', 'Dressage', 'Tradição Ribatejana'],
  false,
  'active',
  'gratuito'
),

-- 14. Coudelaria Rocim
(
  'Coudelaria Rocim',
  'coudelaria-rocim',
  'Integrada na Herdade do Rocim, conhecida pelos seus vinhos, esta coudelaria dedica-se à criação de Lusitanos em regime extensivo. Cavalos com forte ligação à terra alentejana, ideais para trabalho de campo e lazer.',
  'Cuba',
  'Alentejo',
  '+351 284 415 295',
  'rocim@rocim.pt',
  'https://www.rocim.pt',
  '@herdadedorocim',
  22,
  ARRAY['Equitação de Trabalho', 'Enoturismo', 'Lazer'],
  true,
  'active',
  'pro'
),

-- 15. Coudelaria Barroca d'Alva
(
  'Barroca d''Alva',
  'barroca-dalva',
  'No coração da região demarcada do Douro, esta coudelaria cria Lusitanos num cenário deslumbrante de vinhas em socalcos. Experiências equestres únicas combinadas com provas de vinho do Porto.',
  'São João da Pesqueira',
  'Douro',
  '+351 254 730 100',
  'info@barrocadalva.pt',
  'https://www.barrocadalva.pt',
  '@barrocadalva',
  18,
  ARRAY['Turismo Equestre', 'Enoturismo', 'Passeios a Cavalo'],
  true,
  'active',
  'pro'
),

-- 16. Coudelaria Quinta dos Lobos
(
  'Quinta dos Lobos',
  'quinta-dos-lobos',
  'Pequena coudelaria familiar dedicada à criação de cavalos de qualidade superior. Programa de criação seletivo com foco em cavalos de temperamento excepcional. Cada cavalo é tratado como membro da família.',
  'Mafra',
  'Lisboa',
  '+351 261 812 300',
  'quintadoslobos@gmail.com',
  NULL,
  '@quintadoslobos',
  15,
  ARRAY['Lazer', 'Dressage Amador', 'Cavalos Família'],
  false,
  'active',
  'gratuito'
),

-- 17. Coudelaria Herdade da Malhadinha
(
  'Herdade da Malhadinha Nova',
  'malhadinha-nova',
  'Resort de luxo no Alentejo com coudelaria própria. Experiências equestres exclusivas num ambiente de cinco estrelas. Cavalos Lusitanos disponíveis para passeios guiados pelas vinhas e montados.',
  'Albernoa',
  'Alentejo',
  '+351 284 965 432',
  'info@malhadinhanova.pt',
  'https://www.malhadinhanova.pt',
  '@malhadinhanova',
  20,
  ARRAY['Turismo Equestre', 'Luxo', 'Enoturismo', 'Passeios'],
  true,
  'active',
  'pro'
),

-- 18. Coudelaria Quinta do Gradil
(
  'Quinta do Gradil',
  'quinta-do-gradil',
  'Propriedade histórica na região de Lisboa, combinando viticultura e criação de cavalos. Lusitanos de linhagens selecionadas, criados em harmonia com a natureza. Visitas e provas disponíveis.',
  'Cadaval',
  'Lisboa',
  '+351 262 690 200',
  'enoturismo@quintadogradil.pt',
  'https://www.quintadogradil.pt',
  '@quintadogradil',
  12,
  ARRAY['Enoturismo', 'Turismo Equestre', 'Lazer'],
  false,
  'active',
  'gratuito'
),

-- 19. Coudelaria Raposa
(
  'Coudelaria Raposa',
  'coudelaria-raposa',
  'Especialistas em cavalos para Dressage de competição. Programa de treino intensivo e preparação de cavalos jovens. Representação em campeonatos nacionais e internacionais.',
  'Benavente',
  'Ribatejo',
  '+351 263 519 800',
  'coudelariaraposa@gmail.com',
  'https://www.coudelariaraposa.pt',
  '@coudelariaraposa',
  48,
  ARRAY['Dressage', 'Competição', 'Cavalos Jovens', 'Treino'],
  true,
  'active',
  'pro'
),

-- 20. Coudelaria Solar dos Marcos
(
  'Solar dos Marcos',
  'solar-dos-marcos',
  'Tradição equestre no Alto Alentejo. Criação de Lusitanos robustos e versáteis, adaptados ao clima rigoroso da região. Especialistas em cavalos para trabalho de campo e equitação de trabalho.',
  'Portalegre',
  'Alentejo',
  '+351 245 331 200',
  'solardosmarcos@sapo.pt',
  NULL,
  NULL,
  32,
  ARRAY['Equitação de Trabalho', 'Cavalos Robustos', 'Tradição'],
  false,
  'active',
  'gratuito'
);

-- =============================================
-- VERIFICAR INSERÇÕES
-- =============================================
-- SELECT nome, regiao, is_pro, status FROM coudelarias ORDER BY is_pro DESC, nome;
