-- =============================================
-- SEED: 12 Novas Coudelarias Verificadas
-- Dados verificados com fontes credíveis
-- Executar APÓS seed-coudelarias-completo.sql
-- Data: 2026-02-23
-- =============================================

-- =============================================
-- 21. COUDELARIA VEIGA TEIXEIRA (1886)
-- FONTE: https://toplocalplaces.com/portugal/coruche/horse-trainer/coudelaria-antonio-da-veiga-teixeira/1419626774944410
-- FONTE: https://www.lusitano-breeder.com/coudelaria-da-veiga-teixeira
-- FONTE: https://correiodoribatejo.pt/coudelaria-veiga-homenageada-na-golega/
-- VERIFICADO: 2026-02-23
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
  'Coudelaria Veiga Teixeira',
  'veiga-teixeira',
  'Uma das mais antigas coudelarias Lusitanas de Portugal, em actividade desde 1886 em Coruche. Berço da linhagem Veiga, conhecida mundialmente pela bravura, sensibilidade e agilidade dos seus cavalos.',
  'A Coudelaria António da Veiga Teixeira é uma das mais antigas coudelarias de cavalos Lusitanos em Portugal, fundada em 1886 em Coruche, no coração do Ribatejo.

Os cavalos da linhagem Veiga são internacionalmente reconhecidos pela sua bravura, sensibilidade, agilidade e rapidez — características originalmente seleccionadas para a tauromaquia. A marca Veiga tornou-se sinónimo de excelência no cavalo Lusitano e influenciou dezenas de outros criadores em Portugal e no mundo.

Ao longo de mais de um século, a coudelaria exportou cavalos para o Brasil, Islândia, Noruega, Suécia, Alemanha, Holanda, Suíça, Itália, França e Espanha. A Coudelaria Veiga foi homenageada na Feira da Golegã, a mais prestigiada feira equestre de Portugal, pelo seu contributo excepcional para a raça Lusitana.',
  'Coruche',
  'Ribatejo',
  '+351 243 617 173',
  'aveigateixeira54@gmail.com',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  1886,
  ARRAY['Criação de Lusitanos', 'Linhagem Veiga', 'Tauromaquia', 'Equitação Tradicional'],
  ARRAY['Veiga'],
  ARRAY['Homenagem na Feira Nacional do Cavalo — Golegã'],
  ARRAY['Criação e venda de cavalos', 'Exportação internacional'],
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['coruche', 'ribatejo', 'veiga', 'linhagem veiga', 'tauromaquia', 'historica', '1886'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 22. CASA CADAVAL (1648/1660)
-- FONTE: https://saltofportugal.com/2022/07/26/casa-cadaval/
-- FONTE: https://en.vaiver.com/santarem/muge-casa-cadaval/
-- FONTE: https://www.portugalresident.com/the-blue-blooded-wines-of-casa-cadaval/
-- FONTE: http://www.winesoftejo.com/wineries/winery/7/casa-cadaval
-- VERIFICADO: 2026-02-23
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
  'Casa Cadaval',
  'casa-cadaval',
  'Uma das mais antigas coudelarias da Península Ibérica, com mais de 375 anos de criação de Lusitanos. Propriedade de 5.400 hectares em Muge, no Ribatejo, pertencente à família Cadaval há 11 gerações.',
  'A história da Casa Cadaval remonta a mais de 400 anos. Antes de pertencer à família Cadaval, o palácio foi residência da Rainha D. Leonor de Áustria no início do século XVI.

Em 1648, a propriedade passou para a posse da família Cadaval. Em 1660, D. Maria de Faro, Condessa de Odemira, casou com D. Nuno Álvares Pereira de Melo, 1.º Duque de Cadaval, trazendo como dote uma manada de éguas Lusitanas das suas propriedades no Alentejo — fundando assim a tradição de criação equestre.

A propriedade tem estado na mesma família durante 11 gerações, sendo gerida por mulheres ao longo de cinco gerações consecutivas. A actual proprietária, Teresa Schönborn-Wiesentheid, é uma amazona consumada que compete com equipas de cavalos Lusitanos baios criados na propriedade.

A herdade de 5.400 hectares divide-se entre floresta, culturas irrigadas, vinha, criação de cavalos Lusitanos e gado. A produção vinícola da Casa Cadaval, na região do Tejo, inclui castas como Trincadeira, Touriga Nacional, Aragonez, Arinto e Fernão Pires.',
  'Muge, Salvaterra de Magos',
  'Ribatejo',
  '+351 243 588 040',
  NULL,
  'https://www.casacadaval.pt',
  '@casacadavalmuge',
  NULL,
  NULL,
  NULL,
  1648,
  ARRAY['Criação de Lusitanos', 'Vinicultura', 'Enoturismo', 'Turismo Rural'],
  ARRAY['Cadaval'],
  NULL,
  ARRAY['Provas de vinho', 'Visitas guiadas à propriedade', 'Passeios de tractor pela herdade', 'Demonstrações equestres', 'Birdwatching', 'Team-building', 'Eventos e casamentos'],
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['muge', 'ribatejo', 'historica', 'enoturismo', 'cadaval', 'duque', '1648', 'vinho', 'tejo', 'salvaterra de magos'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 23. HERDADE DO PINHEIRO (1906)
-- FONTE: https://www.herdadedopinheiro.com/
-- FONTE: https://www.bhsportugal.org/events/report-on-the-agm-and-visit-to-the-herdade-do-pinheiro
-- FONTE: https://www.equisport.pt/noticias/herdade-do-pinheiro-em-festa/
-- VERIFICADO: 2026-02-23
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
  'Herdade do Pinheiro',
  'herdade-do-pinheiro',
  'Herdade histórica com mais de 700 anos e 5.000 hectares em Alcácer do Sal, junto à Reserva Natural do Estuário do Sado. Coudelaria fundada em 1906 por Edmond Bartissol, cria Lusitanos, Selle Français e Puro-Sangue Inglês.',
  'A Herdade do Pinheiro tem origens que remontam ao período romano, quando foi um centro de produção industrial na estrada entre Setúbal e Alcácer do Sal. Múltiplos fornos produziam cerâmica e ânforas para a produção de garum na fábrica de Troia. Estes fornos foram redescobertos nos anos 1970 por uma equipa arqueológica luso-francesa.

No período medieval, a propriedade pertenceu à Ordem Militar de Santiago, com o Duque de Aveiro como Grão-Mestre. Após a execução do Duque de Aveiro no século XVIII, a herdade passou para a Coroa.

Em 1879, foi vendida em hasta pública e adquirida por Edmond Bartissol (1841-1916), engenheiro francês envolvido na construção do caminho-de-ferro português e do metropolitano de Lisboa. Em 1906, Bartissol criou a coudelaria, inicialmente importando cavalos Percheron de França para trabalho agrícola. Em 1916, os registos da herdade documentam o início da criação de Lusitanos.

A propriedade mudou de mãos apenas quatro vezes em 700 anos. A actual proprietária é Madame Jacqueline Violet; a sua filha Stéphanie Gicot é a quinta geração da família Bartissol a possuir a herdade.

Com mais de 5.000 hectares integrados na Reserva Natural do Estuário do Sado, a herdade abriga mais de 160 espécies de aves. A aldeia da herdade é casa de 60 funcionários, antigos e actuais.',
  'Alcácer do Sal',
  'Alentejo',
  '+351 265 938 270',
  'info@herdadedopinheiro.com',
  'https://www.herdadedopinheiro.com',
  '@herdadedopinheiro',
  NULL,
  NULL,
  NULL,
  1906,
  ARRAY['Criação de Lusitanos', 'Selle Français', 'Puro-Sangue Inglês', 'Produção de Cortiça', 'Aquacultura'],
  ARRAY['Pinheiro'],
  NULL,
  ARRAY['Venda de cavalos', 'Programa de éguas reprodutoras'],
  38.4565,
  -8.7175,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['alcacer do sal', 'alentejo', 'historica', '1906', 'estuario do sado', 'reserva natural', 'cortica', 'bartissol', 'pinheiro'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 24. COUDELARIA PEDRO PASSANHA (1980)
-- FONTE: https://pedropassanha.pt/pt/quem-somos.html
-- FONTE: https://pedropassanha.pt/pt/xaquiro.html
-- FONTE: https://pedropassanha.pt/pt/contactos.html
-- FONTE: https://www.cavalo-lusitano.com/criadores (APSL sócio nº 174)
-- VERIFICADO: 2026-02-23
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
  'Coudelaria Pedro Passanha',
  'pedro-passanha',
  'Coudelaria fundada em 1980 em Ferreira do Alentejo, berço de XAQUIRO — um dos garanhões mais influentes da raça Lusitana, com mais de 100 medalhas de ouro na descendência. Linhagens Veiga e Andrade, 30 éguas.',
  'A Coudelaria Pedro Passanha foi fundada em 1980 na Herdade da Malhada Velha, em Ferreira do Alentejo, com três éguas do ferro do Dr. Guilherme Borba. Hoje conta com um efectivo de 30 éguas das linhas Veiga e Andrade.

O ex-líbris da coudelaria é XAQUIRO (1980-2007), um dos garanhões mais influentes da história do cavalo Lusitano. Xaquiro conquistou a Medalha de Ouro do FIPSL na classe de Garanhões em 1988 e a Medalha de Ouro na Descendência de Garanhão em 2004. Foi distinguido com o título de Reprodutor de Mérito em 2010. A sua descendência acumulou mais de 100 medalhas de ouro e dez títulos de Campeão dos Campeões.

Entre os cavalos notáveis da coudelaria destaca-se ZAIRE, Campeão dos Campeões no FIPSL 2010, Campeão de Portugal de Dressage (nível Saint-Georges) em 2012 e campeão do CDI*** de Sevilha em 2009. Também TAXATIVO, Campeão de Portugal de Dressage 2010, e NUXEQUE, Medalha de Ouro no FIPSL 1998, Campeão dos Campeões na Golegã 1998 e Campeão de Dressage 1998 e 1999.

Em 2010, com a vitória de Zaire como Campeão dos Campeões no Festival Internacional, a coudelaria atingiu a consagração de 30 anos de trabalho. Pedro Passanha foi convidado de honra no Festival do Cavalo Lusitano em Avenches, Suíça, em 2011.

A coudelaria é membro da APSL (sócio nº 174).',
  'Ferreira do Alentejo',
  'Alentejo',
  '+351 919 830 258',
  'pedropassanha@gmail.com',
  'https://pedropassanha.pt',
  NULL,
  'https://www.facebook.com/pages/Coudelaria-Pedro-Passanha/307051426004069',
  NULL,
  30,
  1980,
  ARRAY['Criação de Lusitanos', 'Dressage', 'Tauromaquia', 'Linhagem Veiga e Andrade'],
  ARRAY['Veiga', 'Andrade', 'Quina'],
  ARRAY[
    'XAQUIRO — Medalha de Ouro FIPSL Garanhões 1988',
    'XAQUIRO — Medalha de Ouro Descendência de Garanhão FIPSL 2004',
    'XAQUIRO — Reprodutor de Mérito 2010',
    'ZAIRE — Campeão dos Campeões FIPSL 2010',
    'ZAIRE — Campeão de Portugal Dressage Saint-Georges 2012',
    'NUXEQUE — Medalha de Ouro FIPSL + Campeão dos Campeões Golegã 1998'
  ],
  ARRAY['Criação e venda de cavalos', 'Venda internacional'],
  38.114609,
  -8.270913,
  NULL,
  NULL,
  NULL,
  NULL,
  '[
    {"nome": "Xaquiro", "descricao": "1980-2007. Reprodutor de Mérito, 100+ medalhas de ouro na descendência, 10 títulos de Campeão dos Campeões."},
    {"nome": "Zaire", "descricao": "Campeão dos Campeões FIPSL 2010, Campeão de Portugal Dressage 2012, Campeão CDI*** Sevilha 2009."},
    {"nome": "Nuxeque", "descricao": "Medalha de Ouro FIPSL 1998, Campeão dos Campeões Golegã 1998, Campeão Dressage 1998-1999."}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['ferreira do alentejo', 'alentejo', 'xaquiro', 'veiga', 'andrade', 'dressage', 'tauromaquia', 'reprodutor de merito', 'apsl', '1980'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 25. COUDELARIA HENRIQUE ABECASIS (1986)
-- FONTE: https://guiastecnicos.turismodeportugal.pt/en/equestrian/view/Coudelaria-Henrique-Abecasis-Lda
-- FONTE: https://www.visitportugal.com/en/NR/exeres/65ACEA01-78A9-4799-AE91-3AE5D6D3C2D9
-- FONTE: https://www.coudelariahenriqueabecasis.com/
-- VERIFICADO: 2026-02-23
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
  'Coudelaria Henrique Abecasis',
  'henrique-abecasis',
  'Coudelaria com mais de 110 cavalos em Aveiras de Baixo, no Ribatejo, desde 1986. Cria Puro-Sangue Lusitano e Luso-Warmblood, com turismo equestre reconhecido pelo Turismo de Portugal.',
  'A Coudelaria Henrique Abecasis foi fundada em 1986 na Quinta do Pilar, em Aveiras de Baixo, município da Azambuja, no coração do Ribatejo — região historicamente ligada à cultura do cavalo Lusitano.

Hoje conta com mais de 110 cavalos, dos quais 35 estabulados e 30 éguas reprodutoras, além de 14 cavalos dedicados aos itinerários de turismo equestre e os restantes potros e potrancas em desenvolvimento.

A coudelaria dedica-se à criação e treino de Puro-Sangue Lusitano e cavalos Luso-Warmblood, com o objectivo de criar cavalos com boa montabilidade, adequados para todos os amantes de cavalos. Os programas de turismo equestre — reconhecidos oficialmente pelo Turismo de Portugal, VisitPortugal e Câmara Municipal da Azambuja — variam entre uma tarde e seis dias a cavalo, com itinerários personalizados que percorrem a paisagem ribatejana.',
  'Aveiras de Baixo, Azambuja',
  'Ribatejo',
  NULL,
  'geral@coudelariahenriqueabecasis.com',
  'https://www.coudelariahenriqueabecasis.com',
  '@coudelaria_henrique_abecasis',
  NULL,
  NULL,
  110,
  1986,
  ARRAY['Criação de Lusitanos', 'Luso-Warmblood', 'Turismo Equestre', 'Dressage'],
  NULL,
  NULL,
  ARRAY['Criação e venda de cavalos', 'Aulas de dressage', 'Aulas de equitação', 'Turismo equestre (1 tarde a 6 dias)', 'Passeios a cavalo no Ribatejo', 'Birdwatching', 'Cursos e estágios'],
  39.102786,
  -8.859475,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['aveiras de baixo', 'azambuja', 'ribatejo', 'turismo equestre', 'lusitano', 'warmblood', 'dressage', '1986', 'turismo de portugal'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 26. COUDELARIA JOÃO LYNCE / JPL LUSITANOS (2003)
-- FONTE: https://joaolynce.com/stud-farm/
-- FONTE: https://joaolynce.com/about/
-- FONTE: https://joaolynce.com/working-equitation/
-- VERIFICADO: 2026-02-23
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
  'Coudelaria João Lynce',
  'joao-lynce',
  'Coudelaria de Puro-Sangue Lusitano em Santarém, fundada em 2003 por João Lynce — instrutor FEI, campeão europeu e mundial de Equitação de Trabalho, e embaixador do Lusitano na China.',
  'João Pereira Lynce nasceu em Alcácer do Sal em 1966. Adquiriu as suas primeiras éguas Lusitanas em 1986 e entre 1992 e 2003 geriu a Coudelaria Calheiros Ferreira. Em 2003, fundou a sua própria coudelaria — JPL Lusitanos — com éguas da linha Quina e avós da linha Firme provenientes da Coudelaria Calheiros Ferreira.

Hoje a coudelaria tem 20 éguas e cria exclusivamente Puro-Sangue Lusitano para Equitação Portuguesa, Equitação de Trabalho, Tauromaquia, Alta Escola e Dressage. Entre os garanhões utilizados contam-se Zique, Urque, Ribatejo, Coral, Novilheiro, Opus, Trinco, Nilo, Perito, Paco, Hebraico, Napoleónico e Guangxou. O garanhão Perito foi Campeão da Raça Lusitana em 1999 e Campeão Nacional de Garanhões em 2004.

Como cavaleiro, João Lynce é instrutor de equitação reconhecido pela FEP e pela FEI, e instrutor de Equitação Tradicional Portuguesa. As suas conquistas incluem: Campeão Europeu por Equipas de Equitação de Trabalho (2001), Campeão Mundial por Equipas (2002), e Campeão Nacional e Europeu Individual (2003).

João Lynce realizou demonstrações de dressage barroco na Cidade Proibida de Pequim, perante o Presidente da China, e é considerado o grande embaixador do Lusitano no mercado chinês. Publicou o livro ''Working Equitation with João Lynce''.',
  'Santarém',
  'Ribatejo',
  '+351 917 886 901',
  'joaolynce@gmail.com',
  'https://joaolynce.com',
  NULL,
  NULL,
  NULL,
  20,
  2003,
  ARRAY['Criação de Lusitanos', 'Equitação de Trabalho', 'Alta Escola', 'Dressage Barroco'],
  ARRAY['Quina', 'Firme'],
  ARRAY[
    'Campeão Europeu Equipas Equitação de Trabalho 2001',
    'Campeão Mundial Equipas Equitação de Trabalho 2002',
    'Campeão Nacional + Europeu Individual Equitação de Trabalho 2003',
    'Perito — Campeão da Raça Lusitana 1999',
    'Perito — Campeão Nacional de Garanhões 2004'
  ],
  ARRAY['Criação e venda de cavalos', 'Clínicas de equitação', 'Exportação internacional'],
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[
    {"nome": "Perito", "descricao": "Campeão da Raça Lusitana 1999 e Campeão Nacional de Garanhões 2004."}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['santarem', 'ribatejo', 'equitacao de trabalho', 'alta escola', 'china', 'fei', 'joao lynce', '2003', 'quina', 'firme'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 27. FUNDAÇÃO EUGÉNIO DE ALMEIDA (1963)
-- FONTE: https://www.fea.pt/
-- FONTE: https://www.eurodressage.com/2006/11/26/guizo-passed-away
-- FONTE: https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage
-- FONTE: https://www.olympics.com/en/olympic-games/athens-2004/results/equestrian-dressage
-- VERIFICADO: 2026-02-23
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
  'Fundação Eugénio de Almeida',
  'fundacao-eugenio-almeida',
  'Fundação privada de interesse público em Évora, criadora do célebre GUIZO — o primeiro Lusitano medalhado olímpico (prata por equipas, Atenas 2004). Membro APSL nº 99, com mais de 60 anos de criação.',
  'A Fundação Eugénio de Almeida foi criada em 1963 por Vasco Maria Eugénio de Almeida como instituição privada de interesse público, com sede no Páteo de S. Miguel em Évora.

A história da propriedade remonta a 1759, quando a Quinta de Valbom se tornou propriedade do Estado após a expulsão dos Jesuítas. Em 1869, José Maria Eugénio de Almeida, bisavô do fundador, adquiriu a Quinta.

A Fundação é membro da APSL com o sócio nº 99, sendo um dos criadores mais antigos registados. O seu cavalo mais célebre é GUIZO (1988-2006), por Zasebande e de Cataria (por Tivoli). Criado pela Fundação em Évora, Guizo foi montado pelo espanhol Juan Antonio Jiménez Cobo e pertencia a D. Enrique Guerrero.

GUIZO foi o primeiro cavalo Lusitano a conquistar uma medalha olímpica: medalha de prata por equipas nos Jogos Olímpicos de Atenas 2004, representando Espanha. Antes disso, conquistara o bronze por equipas nos Jogos Equestres Mundiais de Jerez 2002 e a prata por equipas no Campeonato Europeu de Dressage de Hickstead 2003. Guizo faleceu em Novembro de 2006 devido a problemas intestinais agudos.

Para além da criação equestre, a Fundação gere a Adega da Cartuxa, com mais de 300 hectares de vinha na região do Alentejo.',
  'Évora',
  'Alentejo',
  '+351 266 748 300',
  'geral@fea-evora.com.pt',
  'https://www.fea.pt',
  NULL,
  NULL,
  NULL,
  NULL,
  1963,
  ARRAY['Criação de Lusitanos', 'Dressage de Alta Competição', 'Vinicultura', 'Enoturismo'],
  NULL,
  ARRAY[
    'GUIZO — Medalha de Prata Olímpica por Equipas, Atenas 2004',
    'GUIZO — Bronze por Equipas, Jogos Equestres Mundiais Jerez 2002',
    'GUIZO — Prata por Equipas, Campeonato Europeu Hickstead 2003'
  ],
  ARRAY['Criação de cavalos', 'Enoturismo (Adega da Cartuxa)'],
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[
    {"nome": "Guizo", "descricao": "1988-2006. Primeiro Lusitano medalhado olímpico — prata por equipas em Atenas 2004 (Espanha). Bronze WEG 2002, Prata Europeu 2003."}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['evora', 'alentejo', 'guizo', 'olimpicos', 'atenas 2004', 'dressage', 'cartuxa', 'vinho', 'apsl', 'fundacao', '1963'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 28. COUDELARIA PEDRO FERRAZ DA COSTA (1987)
-- FONTE: https://lusitanohorsefinder.com/coudaleria-pedro-feraz-da-costa/
-- FONTE: https://www.instagram.com/coudelariaferrazdacosta/
-- VERIFICADO: 2026-02-23
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
  'Coudelaria Ferraz da Costa',
  'ferraz-da-costa',
  'Cerca de 100 cavalos Lusitanos na Herdade das Coelheiras, Vila Verde de Ficalho, Baixo Alentejo. Fundada em 1987, cria cavalos para dressage e tauromaquia com garanhões das linhas Veiga, Núncio, Quina e Cadaval.',
  'A Coudelaria Pedro Ferraz da Costa foi fundada em 1987 na Herdade das Coelheiras, em Vila Verde de Ficalho, no Baixo Alentejo, com o objectivo de criar cavalos com boa funcionalidade para a tauromaquia, equitação tradicional e competição de dressage.

Pedro Ferraz da Costa é descrito como um empresário tradicional e moderno, com interesses em múltiplas empresas. A coudelaria cria Lusitanos puros e cavalos cruzados (éguas Warmblood com garanhões Lusitanos). Os potros de três anos são desbastados na propriedade e os melhores são enviados a treinadores profissionais para preparação e competição.

Ao longo da história da coudelaria, foram utilizados garanhões como Opus 72 (ferro Veiga), Coral (ferro Núncio), Jocoso (filho de Coral, criado na coudelaria), Orphée (ferro Roger Bouzin), Xaquiro (ferro Quina) e Talisco. Actualmente estão activos Regalo, Rico (ferro Borba), Rubi (ferro Alter Real), Zimbro (ferro Vila Formosa), Ábaco e Zircon (ferro Cadaval).',
  'Vila Verde de Ficalho',
  'Alentejo',
  '+351 910 507 205',
  'ralmeida@iberfar.pt',
  NULL,
  '@coudelariaferrazdacosta',
  'https://www.facebook.com/coudelariaferrazdacosta',
  NULL,
  100,
  1987,
  ARRAY['Criação de Lusitanos', 'Dressage', 'Tauromaquia', 'Cruzamentos Lusitano-Warmblood'],
  ARRAY['Veiga', 'Andrade', 'Quina', 'Cadaval', 'Alter Real'],
  NULL,
  ARRAY['Criação e venda de cavalos', 'Venda de potros'],
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['vila verde de ficalho', 'baixo alentejo', 'beja', 'dressage', 'tauromaquia', 'warmblood', 'veiga', 'xaquiro', '1987'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 29. COUDELARIA SANTA MARGARIDA (1983)
-- FONTE: https://coudelariastamargarida.com/home/
-- FONTE: https://www.equisport.pt/en/news/the-recommended-stallion-campeador-dies-at-18-years-old/
-- FONTE: https://www.equisport.pt/noticias/morreu-spartacus-reprodutor-de-merito/
-- VERIFICADO: 2026-02-23
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
  'Coudelaria de Santa Margarida',
  'santa-margarida',
  'Coudelaria desde 1983 em Ferreira do Alentejo, criadora dos Reprodutores de Mérito Spartacus e Campeador — este último Campeão dos Campeões no Festival Internacional do Lusitano na Bélgica em 2013.',
  'A Coudelaria de Santa Margarida foi fundada em 1983 no Monte da Sernadinha, em Figueira dos Cavaleiros, Ferreira do Alentejo.

Desde o início, a coudelaria seleccionou rigorosamente os seus garanhões reprodutores. Os primeiros foram Universo e Opus 72, seguidos de Spartacus (por Xaquiro x Juno por Universo) — um cavalo criado na própria coudelaria que foi aprovado como Reprodutor de Mérito.

De Spartacus nasceu Campeador (Spartacus x Teara por Império), que se tornou o cavalo mais emblemático da coudelaria. Em Setembro de 2013, Campeador foi coroado Campeão dos Campeões no Festival Internacional do Puro-Sangue Lusitano na Bélgica. Deixou 150 produtos registados no stud book antes de falecer aos 18 anos.

A Coudelaria de Santa Margarida conquistou múltiplos prémios de Melhor Criador a nível nacional e internacional.',
  'Ferreira do Alentejo',
  'Alentejo',
  '+351 919 727 617',
  'mte.sernadinha@gmail.com',
  'https://coudelariastamargarida.com',
  NULL,
  NULL,
  NULL,
  NULL,
  1983,
  ARRAY['Criação de Lusitanos', 'Linhagem Xaquiro', 'Reprodução Selectiva'],
  ARRAY['Veiga', 'Andrade'],
  ARRAY[
    'Campeador — Campeão dos Campeões, Festival Internacional do Lusitano, Bélgica 2013',
    'Spartacus — Reprodutor de Mérito',
    'Múltiplos prémios de Melhor Criador (nacional e internacional)'
  ],
  ARRAY['Criação e venda de cavalos'],
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[
    {"nome": "Campeador", "descricao": "Campeão dos Campeões no Festival Internacional do Lusitano (Bélgica, 2013). 150 produtos registados. Faleceu aos 18 anos."},
    {"nome": "Spartacus", "descricao": "Reprodutor de Mérito. Por Xaquiro x Juno (por Universo). Criado na coudelaria."}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['ferreira do alentejo', 'alentejo', 'campeador', 'spartacus', 'xaquiro', 'reprodutor de merito', '1983'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 30. JUPITER CLASSICAL DRESSAGE (2022)
-- FONTE: https://jupiterclassicaldressage.com/en/
-- FONTE: https://jupiterclassicaldressage.com/en/contact/
-- FONTE: https://www.racius.com/jupiter-classical-dressage-lda/
-- VERIFICADO: 2026-02-23
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
  'Jupiter Classical Dressage',
  'jupiter-classical-dressage',
  'Coudelaria e centro de dressage clássico com mais de 600 hectares na Herdade do Ameal, Vila Viçosa. Cria Lusitanos das linhas Estoiro, Finório e Xaquiro, com 32 boxes e estágios para cavaleiros.',
  'A Jupiter Classical Dressage é uma coudelaria de Puro-Sangue Lusitano e centro de treino de dressage clássico localizada na Herdade do Ameal, uma propriedade com mais de 600 hectares perto de Vila Viçosa, no Alentejo — uma das regiões históricas do cavalo Lusitano.

A empresa foi formalmente constituída em Portugal a 5 de Abril de 2022, sob a gestão de Jürgen Grüneis e Alexander Wickl. O programa de criação traça os seus garanhões fundadores a Estoiro, Finório e Xaquiro — três dos garanhões mais influentes da raça Lusitana.

A filosofia da coudelaria centra-se no treino clássico amigo do cavalo, desde as primeiras fases da educação, e no desenvolvimento livre da manada em terreno variado, com cobertura natural de sobreiros para protecção climática. As instalações incluem 32 boxes com acesso directo a paddocks.

A coudelaria oferece estágios de vários meses para candidatos com experiência equestre comprovada.',
  'Vila Viçosa',
  'Alentejo',
  '+351 915 408 866',
  'contact@jupiterclassicaldressage.com',
  'https://jupiterclassicaldressage.com',
  '@jupiterclassicaldressage',
  NULL,
  NULL,
  NULL,
  2022,
  ARRAY['Criação de Lusitanos', 'Dressage Clássico', 'Equitação de Trabalho', 'Estágios'],
  ARRAY['Veiga', 'Andrade'],
  NULL,
  ARRAY['Criação e venda de cavalos', 'Treino de dressage clássico', 'Estágios para cavaleiros'],
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['vila vicosa', 'alentejo', 'dressage classico', 'estoiro', 'finorio', 'xaquiro', 'estagios', '2022', '600 hectares'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 31. QUINTA MADRE DE ÁGUA (2012)
-- FONTE: https://quintamadredeagua.pt/en/stud-farm/
-- FONTE: https://mycavago.com/facility/hotel-madre-de-agua/43
-- FONTE: https://www.winexp.pt/en/wineries/quinta-madre-de-agua
-- VERIFICADO: 2026-02-23
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
  'Quinta Madre de Água',
  'quinta-madre-de-agua',
  'Hotel e coudelaria na Serra da Estrela, Gouveia. Fundada em 2012, cria Lusitanos com garanhões da Coudelaria Ortigão Costa. Combina turismo rural, vinicultura, queijo Serra da Estrela DOP e equitação.',
  'A Quinta Madre de Água situa-se em Vinhó, Gouveia, no sopé da Serra da Estrela. O projecto nasceu a partir de 2007, quando os proprietários Luís Gonçalves e Lurdes Perfeito regressaram às suas origens familiares na região, com um projecto de respeito pela paisagem natural. O hotel abriu em Dezembro de 2012, na região vinícola do Dão.

A coudelaria foi fundada no mesmo ano, nascendo da paixão dos proprietários pelos animais. Começou com a aquisição de três éguas Lusitanas puras como cavalos de passeio. À medida que o entusiasmo pela raça cresceu, investiram em infraestruturas completas de criação e adquiriram dois garanhões da Coudelaria Ortigão Costa — uma das mais prestigiadas de Portugal.

O cavaleiro profissional Nuno Carvalho é o cavaleiro residente e treinador, com o objectivo de competir e ensinar dressage a nível nacional e internacional.

Para além dos cavalos, a propriedade gere um rebanho de 500 ovelhas Bordaleiras, produz queijo Serra da Estrela DOP, vinhos, compotas e azeite.',
  'Vinhó, Gouveia',
  'Beira Alta',
  '+351 238 490 500',
  'hotel@quintamadredeagua.pt',
  'https://quintamadredeagua.pt',
  '@quinta_madre_de_agua',
  NULL,
  NULL,
  NULL,
  2012,
  ARRAY['Criação de Lusitanos', 'Dressage', 'Turismo Rural', 'Produção de Queijo DOP'],
  ARRAY['Ortigão Costa'],
  NULL,
  ARRAY['Criação de cavalos', 'Aulas de dressage', 'Passeios a cavalo', 'Hotel (10 quartos)', 'Enoturismo', 'Visitas guiadas à exploração', 'Provas de queijo Serra da Estrela DOP'],
  40.4922,
  -7.6183,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['serra da estrela', 'gouveia', 'beira alta', 'dao', 'hotel', 'queijo', 'ortigao costa', 'turismo rural', '2012', 'vinhos'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- 32. COUDELARIA MASCARENHAS CARDOSO (~1905)
-- FONTE: https://www.portugalresident.com/coudelaria-mascarenhas-cardoso-a-breed-apart/
-- FONTE: https://www.barlavento.pt/coudelaria-em-albufeira-cria-cavalos-lusitanos-campeoes-de-dressage/
-- VERIFICADO: 2026-02-23
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
  'Coudelaria Mascarenhas Cardoso',
  'mascarenhas-cardoso',
  'A coudelaria mais meridional do Lusitano em Portugal continental, com 50 hectares em Albufeira, Algarve. Criação selectiva desde há mais de 40 anos, com foco em dressage desportivo e hipoterapia.',
  'A família Mascarenhas Cardoso adquiriu a Quinta do Cerro d''Águia, em Albufeira, em 1905. Ao longo de quatro gerações, a propriedade de 50 hectares tornou-se um centro de criação de Lusitanos e dressage — a coudelaria mais meridional de Lusitanos em Portugal continental.

A localização é invulgar: enquanto a maioria das coudelarias Lusitanas se concentram no Ribatejo e Alentejo, a Mascarenhas Cardoso opera no Algarve, com vistas para o mar e as montanhas. A filosofia é de qualidade sobre quantidade — produz apenas 3 a 4 potros por ano, todos destinados ao desporto.

A coudelaria é um Centro Equestre Federado, aberto ao público. O treinador residente João Pinto foi formado em equitação de trabalho e dressage. A coudelaria está também a desenvolver a hipoterapia como modalidade adicional.',
  'Albufeira',
  'Algarve',
  '+351 913 849 092',
  'coudelariamascarenhascardoso@gmail.com',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  1905,
  ARRAY['Criação de Lusitanos', 'Dressage Desportivo', 'Hipoterapia', 'Centro Equestre Federado'],
  NULL,
  NULL,
  ARRAY['Criação e venda de cavalos', 'Aulas de dressage', 'Hipoterapia', 'Centro equestre aberto ao público'],
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  '[]'::jsonb,
  ARRAY['albufeira', 'algarve', 'dressage', 'hipoterapia', 'centro equestre', '1905', 'federado'],
  false,
  false,
  0,
  'active',
  'free'
);

-- =============================================
-- VERIFICAR INSERÇÕES
-- =============================================
SELECT nome, regiao, ano_fundacao, status
FROM coudelarias
WHERE slug IN (
  'veiga-teixeira', 'casa-cadaval', 'herdade-do-pinheiro',
  'pedro-passanha', 'henrique-abecasis', 'joao-lynce',
  'fundacao-eugenio-almeida', 'ferraz-da-costa', 'santa-margarida',
  'jupiter-classical-dressage', 'quinta-madre-de-agua', 'mascarenhas-cardoso'
)
ORDER BY ano_fundacao;
