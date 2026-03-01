import type { Linhagem, EventoHistorico, ChefeLinhagem } from "@/components/linhagens/types";

// =============================================================================
// DADOS VERIFICADOS COM FONTES CITADAS
// =============================================================================

// FONTES GLOBAIS:
// https://lusitanohorsefinder.com/lusitano-bloodlines/
// https://lusitanohorsefinder.com/lusitano-bloodlines-part-ii/
// https://www.cavalo-lusitano.com (APSL - Stud Book Oficial)
// Livro Genealógico Português de Equinos (31/Dez/1989) - 6 Chefes de Linha

export const linhagens: Linhagem[] = [
  {
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://baroquehorsemagazine.com/manuel-veiga-stud/ (Baroque Horse Magazine)
    // FONTE: https://www.equilife.world/ (Equilife World)
    // FONTE: https://interagro.com.br (Interagro Lusitanos)
    // FONTE: http://www.lusitanocollection.com/novi.htm (Novilheiro)
    // FONTE: Texto histórico oficial da Coudelaria Veiga (partilhado pelo proprietário)
    id: "veiga",
    nome: "Veiga",
    descricao:
      "A linhagem Veiga é a mais emblemática e reconhecível do Lusitano, com cavalos compactos, ágeis e de bravura notável. Fundada há mais de 220 anos na Quinta da Broa, produziu alguns dos cavalos mais célebres da raça.",
    historiaCompleta: [
      "A Coudelaria Veiga, com sede na Quinta da Broa, Azinhaga do Ribatejo, foi fundada há mais de 220 anos por Rafael José da Cunha, o denominado Príncipe dos Lavradores Portugueses. De entre os reprodutores contam-se dois garanhões de sangue Alter, oferecidos por D. Fernando II e pelo seu filho D. Pedro V quando visitaram a Quinta da Broa.",
      "Por herança familiar, a coudelaria foi herdada pelo Eng.º Manuel Tavares Veiga, sobrinho-bisneto de Rafael José da Cunha. O trabalho que desenvolveu foi notável, sendo justamente considerado o iniciador do novo ciclo do ginete lusitano em Portugal. Seleccionou animais cujas características melhor correspondiam à funcionalidade guerreira exigida aos cavalos de toureio, usando cruzamentos consanguíneos para fixar as características da raça. A linhagem consolidou-se com os garanhões Lidador, Agareno (nascido em 1931), Berber e Sultão. Agareno tornou-se um dos seis Chefes de Linhagem oficiais do Puro Sangue Lusitano.",
      "O cruzamento histórico do garanhão Firme (da coudelaria Andrade) com éguas Veiga produziu quatro dos cavalos mais famosos do século XX: Novilheiro, Nilo, Neptuno e Opus II — criando a chamada 'fórmula de ouro' do Lusitano moderno.",
      "Após a morte do Eng.º Manuel Tavares Veiga, os seus netos Manuel e Carlos Tavares Veiga e o bisneto Manuel de Castro Tavares Veiga mantiveram a coudelaria com a qualidade inicial. Hoje, a influência Veiga está presente em praticamente todas as coudelarias de referência do mundo.",
    ],
    origem: "Quinta da Broa, Azinhaga, Ribatejo",
    fundador: "Rafael José da Cunha",
    anoFundacao: "Séc. XIX",
    cabecaLinhagem: "Agareno",
    cabecaLinhagemInfo:
      "Nascido em 1931, filho de Lidador (MV) e Bagocha (MV). Um dos 6 Chefes de Linhagem oficiais do PSL.",
    caracteristicas: [
      "Perfil convexo pronunciado (cabeça 'aveigada')",
      "Corpo compacto e bem proporcionado",
      "Pernas finas mas resistentes",
      "Pescoço arqueado e musculado",
      "Garupa inclinada",
      "Porte relativamente pequeno mas poderoso",
      "Movimentos ágeis e elevados",
    ],
    coresComuns: ["Ruço", "Castanho", "Preto", "Tordilho"],
    temperamento:
      "Corajosos e reactivos, com bravura natural. Muito inteligentes e sensíveis, respondem bem a cavaleiros experientes. A sua vivacidade torna-os excepcionais para toureio e working equitation.",
    aptidoes: ["Toureio", "Working Equitation", "Dressage", "Saltos"],
    cavalosNotaveis: [
      // FONTE: http://www.lusitanocollection.com/novi.htm
      {
        nome: "Novilheiro",
        ano: "1971-2000",
        conquistas:
          "O Lusitano mais célebre da história. Campeão de saltos com John Whitaker, líder europeu em prémios (1983). Também competiu em dressage Grand Prix e concurso completo.",
      },
      // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
      {
        nome: "Opus 72",
        ano: "1972",
        conquistas:
          "Famoso cavalo de toureio de Álvaro Domecq, demonstrando a versatilidade da linhagem Veiga.",
      },
      // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
      {
        nome: "Nilo",
        ano: "1971-1995",
        conquistas:
          "Campeão dos Campeões na Golegã 1974. Considerado autêntico Chefe de Raça do PSL moderno.",
      },
      // FONTE: https://lusitanohorsefinder.com/joao-pedro-rodrigues/
      {
        nome: "Oxidado",
        ano: "1994-2020",
        conquistas:
          "6x Campeão Europeu de Working Equitation com Pedro Torres. O cavalo mais titulado da história da disciplina.",
      },
    ],
    coudelariasPrincipais: [
      "Manuel Veiga (histórica)",
      "Quinta da Broa",
      "Monte Velho",
      "Ortigão Costa",
    ],
    timeline: [
      {
        ano: 1931,
        evento: "Nasce Agareno (Lidador x Bagocha), futuro Chefe de Linhagem",
        destaque: true,
      },
      {
        ano: 1956,
        evento: "Nasce Firme na Coudelaria Andrade — futuro pai da geração de ouro",
      },
      {
        ano: 1971,
        evento: "Nascem Novilheiro e Nilo (Firme x éguas Veiga)",
        destaque: true,
      },
      {
        ano: 1974,
        evento: "Nilo coroado Campeão dos Campeões na Golegã",
        destaque: true,
      },
      {
        ano: 1983,
        evento: "Novilheiro é o cavalo com maior prémio acumulado em saltos na Europa",
        destaque: true,
      },
      {
        ano: 1989,
        evento: "Agareno reconhecido oficialmente como Chefe de Linhagem no Stud Book",
        destaque: true,
      },
    ],
    factosChave: [
      "Agareno é um dos 6 Chefes de Linhagem oficiais do PSL",
      "Stock fundador incluiu 2 garanhões Alter Real doados pela coroa",
      "O cruzamento Firme (Andrade) × éguas Veiga criou a linhagem moderna mais influente",
      "Novilheiro provou que o Lusitano pode brilhar em qualquer disciplina equestre",
    ],
    confianca: "ALTA",
  },
  {
    // FONTE: https://www.herdadedoazinhal.com/en/the-stud-farm/ (Herdade do Azinhal)
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://interagro.com.br (Interagro Lusitanos)
    // FONTE: https://en.wikipedia.org/wiki/Ruy_d%27Andrade (Wikipedia)
    // FONTE: https://en.wikipedia.org/wiki/Sorraia_horse (Wikipedia - Sorraia)
    id: "andrade",
    nome: "Andrade",
    descricao:
      "A linhagem Andrade produziu cavalos com presença, andamentos e temperamento notáveis. Fundada pelo Dr. Ruy d'Andrade, ganhou mais Campeonatos de Criação que qualquer outra coudelaria e foi decisiva na salvação da linha Alter Real.",
    historiaCompleta: [
      "A coudelaria Andrade foi formada em 1894 por Dr. Ruy d'Andrade (1880-1967), com éguas de criadores espanhóis como Hermanos Guerrero, D. Vicente Romero y Garcia e D. António Perez Tinao, todos de sangue Cartujano puro.",
      "A coudelaria ganhou mais Campeonatos de Criação do que qualquer outra, incluindo os títulos de Campeão Ibérico em 1970 e 1972. Garanhões notáveis incluem Rumboso, Arriero, Bergantin, Cartujano, Saltador, Novelero e Príncipe VIII.",
      "Dr. Ruy d'Andrade adquiriu dois garanhões idosos — Vigilante e Regedor — e Marialva II, salvando a linha Alter Real da extinção. Em 1942, transferiu este pequeno efectivo para o Ministério da Agricultura quando a coudelaria reabriu.",
      "O Dr. Ruy d'Andrade também é reconhecido pela descoberta e preservação do cavalo Sorraia, uma raça primitiva ibérica. Após a sua morte em 1967, a coudelaria dividiu-se entre os seus filhos, com operações em Coruche, Elvas e Torres Vedras.",
    ],
    origem: "Portugal (Coruche, Elvas, Torres Vedras)",
    fundador: "Dr. Ruy d'Andrade (1880-1967)",
    anoFundacao: 1894,
    cabecaLinhagem: "Marialva II",
    cabecaLinhagemInfo:
      "Marialva II (n. 1930, APM) é reconhecido como Chefe de Linha oficial associado à linhagem Andrade. Nota: as fontes divergem sobre a atribuição exacta dos 6 fundadores às linhagens.",
    caracteristicas: [
      "Cavalos altos e potentes",
      "Perfil quase recto (sub-convexo)",
      "Garupa arredondada e musculada",
      "Ossatura mais forte que a Veiga",
      "Pescoço longo e bem inserido",
      "Andamentos amplos e cadenciados",
      "Porte nobre e majestoso",
    ],
    coresComuns: ["Castanho", "Ruço", "Tordilho", "Preto"],
    temperamento:
      "Mais calmos e equilibrados que os Veiga. Dóceis mas enérgicos, com boa capacidade de concentração. Excelentes para cavaleiros de todos os níveis.",
    aptidoes: ["Dressage", "Toureio", "Trabalho", "Reprodução"],
    cavalosNotaveis: [
      // FONTE: http://www.lusitanocollection.com/novi.htm
      {
        nome: "Firme",
        ano: "1956-1978",
        conquistas:
          "Garanhão da Coudelaria Andrade que, cruzado com éguas Veiga, produziu Novilheiro, Nilo, Neptuno e Opus II. Cavalo de toureio com D. José d'Athayde.",
      },
    ],
    coudelariasPrincipais: [
      "Fernando Sommer d'Andrade (histórica)",
      "Herdade do Azinhal",
      "Interagro (Brasil)",
    ],
    timeline: [
      {
        ano: 1894,
        evento: "Dr. Ruy d'Andrade funda a coudelaria com éguas espanholas Cartujanas",
        destaque: true,
      },
      {
        ano: 1920,
        evento: "Dr. Ruy d'Andrade descobre cavalos Sorraia selvagens perto de Coruche",
        destaque: true,
      },
      {
        ano: 1930,
        evento: "Nasce Marialva II (APM), futuro Chefe de Linha oficial",
        destaque: true,
      },
      {
        ano: 1938,
        evento: "Dr. Ruy d'Andrade salva a linha Alter Real com Vigilante, Regedor e Marialva II",
        destaque: true,
      },
      {
        ano: 1942,
        evento: "Transfere o efectivo Alter Real para o Ministério da Agricultura",
      },
      {
        ano: 1956,
        evento: "Nasce Firme, o garanhão que criaria a 'fórmula de ouro'",
        destaque: true,
      },
      { ano: 1967, evento: "Falecimento de Dr. Ruy d'Andrade aos 87 anos" },
      {
        ano: 1970,
        evento: "Campeão Ibérico de Criação (também em 1972)",
        destaque: true,
      },
    ],
    factosChave: [
      "Dr. Ruy d'Andrade SALVOU a linha Alter Real da extinção (1938-1942)",
      "Dr. Ruy d'Andrade descobriu e preservou o cavalo Sorraia (1920-1937)",
      "Ganhou mais Campeonatos de Criação que qualquer outra coudelaria",
      "O garanhão Firme (Andrade) × éguas Veiga = geração de ouro do Lusitano",
    ],
    confianca: "ALTA",
  },
  {
    // FONTE: https://en.wikipedia.org/wiki/Alter_Real (Wikipedia)
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
    // FONTE: https://www.superiorequinesires.com/rubi-alter-real/
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines-part-ii/ (EPAE info)
    id: "alter-real",
    nome: "Alter Real",
    descricao:
      "A mais antiga e nobre linhagem equestre de Portugal, fundada pela coroa em 1748. Cavalos barrocos, compactos e de acção alta, hoje a base da Escola Portuguesa de Arte Equestre.",
    historiaCompleta: [
      "A Coudelaria de Alter Real foi fundada em 1748 pelo Rei D. João V, no âmbito de uma política de criação equina iniciada em 1708. O stock original consistiu em cerca de 300 éguas ibéricas, maioritariamente espanholas. A coudelaria tornou-se famosa em toda a Europa como o melhor local para adquirir cavalos de Alta Escola.",
      "A linhagem sobreviveu a múltiplas crises: as invasões napoleónicas (a partir de 1807) dizimaram os efectivos, e após a Revolução Republicana de 1910, a coudelaria foi encerrada, garanhões castrados, cavalos vendidos e registos genealógicos queimados.",
      "A salvação veio pelas mãos do Dr. Ruy d'Andrade, que adquiriu dois garanhões idosos — Vigilante e Regedor — e Marialva II. Em 1942, transferiu este pequeno efectivo para o Ministério da Agricultura quando a coudelaria reabriu.",
      "Regedor (nascido em 1923), filho de Gaivoto e Gavina, tornou-se o Chefe de Linhagem oficial da linha Alter Real. Hoje, a coudelaria é gerida pela Companhia das Lezírias (desde 2013) e cria cavalos exclusivamente para a Escola Portuguesa de Arte Equestre.",
    ],
    origem: "Alter do Chão, Portalegre",
    fundador: "Rei D. João V (1748)",
    anoFundacao: 1748,
    cabecaLinhagem: "Regedor",
    cabecaLinhagemInfo:
      "Nascido em 1923, filho de Gaivoto e Gavina. Único Chefe de Linhagem de sangue Alter Real puro entre os 6 fundadores oficiais.",
    caracteristicas: [
      "Cavalos muito barrocos e compactos",
      "Silhueta redonda e musculada",
      "Acção alta de joelhos (knee action)",
      "Porte nobre e imponente",
      "Crina e cauda abundantes",
      "Pescoço curvo e poderoso",
      "Aptidão natural para Alta Escola",
    ],
    coresComuns: ["Castanho", "Baio"],
    temperamento:
      "Nobres e cooperantes, com disposição natural para a Alta Escola. Cavalos de presença imponente, equilibrados e com grande vontade de trabalhar.",
    aptidoes: ["Alta Escola", "Dressage", "Atrelagem", "Cerimónia"],
    cavalosNotaveis: [
      // FONTE: https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
      // FONTE: https://www.superiorequinesires.com/rubi-alter-real/
      {
        nome: "Rubi AR",
        ano: "1998",
        conquistas:
          "16º nos Jogos Olímpicos de Londres 2012 com Gonçalo Carvalho. 77.8% Grand Prix (recorde Lusitano). 19 vitórias internacionais. 5 estrelas de mérito APSL.",
      },
      // FONTE: https://www.lusitanostud.com/blog/2019/8/20/the-kings-stud-alter-real
      {
        nome: "Gentil",
        ano: "Séc. XVIII",
        conquistas:
          "Cavalo Alter Real escolhido pelo Marquês de Marialva como modelo para a estátua equestre de D. José I no Terreiro do Paço, Lisboa.",
      },
      // FONTE: Livro Genealógico Português de Equinos
      {
        nome: "Regedor",
        ano: "1923",
        conquistas:
          "Chefe de Linhagem oficial do PSL. Fundador da linha Alter Real moderna. Base genética da EPAE.",
      },
    ],
    coudelariasPrincipais: [
      "Coudelaria de Alter Real (Fundação Alter Real)",
      "Escola Portuguesa de Arte Equestre",
    ],
    timeline: [
      {
        ano: 1747,
        evento: "Importação de ~300 éguas ibéricas de Espanha",
      },
      {
        ano: 1748,
        evento: "Rei D. João V funda a Coudelaria de Alter Real",
        destaque: true,
      },
      {
        ano: 1807,
        evento: "Invasões napoleónicas devastam os efectivos",
      },
      {
        ano: 1910,
        evento: "Revolução Republicana: registos queimados, garanhões castrados",
      },
      {
        ano: 1923,
        evento: "Nasce Regedor (Gaivoto x Gavina), futuro Chefe de Linhagem",
        destaque: true,
      },
      {
        ano: 1938,
        evento: "Dr. Ruy d'Andrade salva a linhagem com Vigilante, Regedor e Marialva II",
        destaque: true,
      },
      {
        ano: 1989,
        evento: "Regedor reconhecido como Chefe de Linhagem no Stud Book",
        destaque: true,
      },
      {
        ano: 2012,
        evento: "Rubi AR nos Jogos Olímpicos de Londres (16º individual)",
        destaque: true,
      },
    ],
    factosChave: [
      "Fundada em 1748, é a coudelaria real mais antiga de Portugal em funcionamento contínuo",
      "Stock original: cerca de 300 éguas ibéricas, maioritariamente espanholas",
      "Quase extinta após invasões napoleónicas e Revolução de 1910",
      "Salva por Dr. Ruy d'Andrade com Vigilante, Regedor e Marialva II",
      "Hoje cria cavalos exclusivamente para a Escola Portuguesa de Arte Equestre",
    ],
    confianca: "ALTA",
  },
  {
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines-part-ii/
    // FONTE: https://interagro.com.br (Interagro Lusitanos)
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    id: "coudelaria-nacional",
    nome: "Coudelaria Nacional",
    descricao:
      "A Coudelaria Nacional, também conhecida como Fonte Boa, é a instituição estatal responsável pela preservação e melhoria genética do Lusitano. Os seus cavalos são maiores, mais redondos e versáteis.",
    historiaCompleta: [
      "A Coudelaria Nacional foi fundada em 1887. Está localizada na Quinta da Fonte Boa, em Santarém, nas férteis margens do rio Tejo.",
      "A Coudelaria Nacional tem Chefes de Linha oficiais associados, incluindo Hucharia (n. 1943), notável por ser a única égua entre os seis fundadores oficiais da raça. Primoroso (n. 1927) e Destinado (n. 1930), ambos de origem Dominguez Hermanos, são também garanhões fundadores associados a esta linha.",
      "Os cavalos CN são tipicamente maiores, mais redondos e com dorsos mais compridos, tornando-os muito adequados para atrelagem e dressage.",
      "Hoje, a Coudelaria Nacional faz parte da Fundação Alter Real, juntamente com a Coudelaria de Alter e a Escola Portuguesa de Arte Equestre.",
    ],
    origem: "Quinta da Fonte Boa, Santarém",
    fundador: "Estado Português (1887)",
    anoFundacao: 1887,
    cabecaLinhagem: "Hucharia",
    cabecaLinhagemInfo:
      "Hucharia (n. 1943, CN), única égua entre os 6 fundadores oficiais. Primoroso (n. 1927, DH) e Destinado (n. 1930, DH) são garanhões fundadores de origem Dominguez Hermanos também associados a esta linha.",
    caracteristicas: [
      "Cavalos maiores que a média da raça",
      "Corpo mais longo e arredondado",
      "Garupas altas e musculadas",
      "Ossatura robusta",
      "Dorso mais comprido",
      "Andamentos amplos e regulares",
      "Grande capacidade de tracção",
    ],
    coresComuns: ["Castanho", "Ruço", "Tordilho"],
    temperamento:
      "Calmos e fiáveis, com boa disposição para o trabalho. Versáteis e adaptáveis, adequados a múltiplas disciplinas.",
    aptidoes: ["Atrelagem", "Dressage", "Trabalho", "Reprodução"],
    cavalosNotaveis: [
      // FONTE: Wikipedia (Lusitano) + Lusitano Horse Finder
      {
        nome: "Hucharia",
        ano: "1943",
        conquistas:
          "Única égua entre os 6 Chefes de Linha oficiais do PSL. Filha de Cartujano e Viscaína.",
      },
    ],
    coudelariasPrincipais: ["Coudelaria Nacional / Fonte Boa", "Fundação Alter Real"],
    timeline: [
      {
        ano: 1887,
        evento: "Fundação da Coudelaria Nacional",
        destaque: true,
      },
      {
        ano: 1927,
        evento: "Nasce Primoroso (DH), futuro Chefe de Linha",
        destaque: true,
      },
      {
        ano: 1930,
        evento: "Nasce Destinado (DH), futuro Chefe de Linha",
        destaque: true,
      },
      {
        ano: 1943,
        evento: "Nasce Hucharia (CN), única égua Chefe de Linha",
        destaque: true,
      },
      {
        ano: 1989,
        evento: "Primoroso, Destinado e Hucharia reconhecidos no Stud Book oficial",
        destaque: true,
      },
    ],
    factosChave: [
      "3 dos 6 Chefes de Linha oficiais são desta linhagem (Primoroso, Destinado, Hucharia)",
      "Hucharia é a ÚNICA égua entre os 6 fundadores oficiais da raça",
      "Linhagens CN têm origem espanhola (Dominguez Hermanos)",
      "Faz parte da Fundação Alter Real",
    ],
    confianca: "MÉDIA-ALTA",
  },
  // NOTA: As linhagens Coimbra e Infante da Câmara foram removidas por falta de
  // fontes credíveis verificáveis online. A informação disponível sobre estas linhagens
  // existe principalmente em literatura equestre especializada portuguesa (livros, registos APSL)
  // que não pudemos verificar. Preferimos omitir a publicar informação não confirmada.
  // Se no futuro obtivermos fontes escritas credíveis, estas linhagens poderão ser adicionadas.
];

// Os 6 Chefes de Linhagem oficiais reconhecidos no Stud Book (1989)
// FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
// NOTA: A atribuição dos 6 fundadores às linhagens varia conforme a fonte.
// Apresentamos aqui a marca de origem de cada cavalo (verificável no Stud Book).
export const chefesLinhagem: ChefeLinhagem[] = [
  { nome: "Agareno", ano: 1931, linhagem: "Veiga", tipo: "Garanhão", marca: "MV" },
  { nome: "Primoroso", ano: 1927, linhagem: "Dominguez Hermanos", tipo: "Garanhão", marca: "DH" },
  { nome: "Destinado", ano: 1930, linhagem: "Dominguez Hermanos", tipo: "Garanhão", marca: "DH" },
  {
    nome: "Marialva II",
    ano: 1930,
    linhagem: "Fontes Pereira de Melo",
    tipo: "Garanhão",
    marca: "APM",
  },
  { nome: "Regedor", ano: 1923, linhagem: "Alter Real", tipo: "Garanhão", marca: "AR" },
  { nome: "Hucharia", ano: 1943, linhagem: "Coudelaria Nacional", tipo: "Égua", marca: "CN" },
];

// Timeline global de eventos históricos
// FONTES: Compiladas de todas as fontes individuais acima
export const timelineGlobal: EventoHistorico[] = [
  {
    ano: 1748,
    evento: "Rei D. João V funda a Coudelaria de Alter Real em Alter do Chão",
    destaque: true,
  },
  { ano: 1807, evento: "Invasões napoleónicas (1807-1811) devastam as coudelarias" },
  { ano: 1887, evento: "Fundação da Coudelaria Nacional", destaque: true },
  { ano: 1894, evento: "Dr. Ruy d'Andrade funda a coudelaria Andrade com éguas espanholas" },
  {
    ano: 1910,
    evento: "Revolução: coudelaria Alter encerrada, registos queimados, garanhões castrados",
  },
  { ano: 1920, evento: "Dr. Ruy d'Andrade descobre cavalos Sorraia selvagens perto de Coruche" },
  { ano: 1923, evento: "Nasce Regedor (AR), futuro Chefe de Linhagem", destaque: true },
  { ano: 1927, evento: "Nasce Primoroso (DH), futuro Chefe de Linha" },
  { ano: 1930, evento: "Nascem Destinado (DH) e Marialva II (APM)" },
  { ano: 1931, evento: "Nasce Agareno (MV), futuro Chefe de Linhagem", destaque: true },
  {
    ano: 1938,
    evento: "Dr. Ruy d'Andrade adquire Vigilante, Regedor e Marialva II — salva a linha Alter Real",
    destaque: true,
  },
  { ano: 1942, evento: "Efectivo Alter Real transferido para o Ministério da Agricultura" },
  { ano: 1943, evento: "Nasce Hucharia (CN), única égua fundadora" },
  { ano: 1967, evento: "Falecimento de Dr. Ruy d'Andrade aos 87 anos" },
  {
    ano: 1989,
    evento: "Stud Book reconhece oficialmente os 6 Chefes de Linhagem do PSL",
    destaque: true,
  },
];
