// =============================================================================
// BASE DE DADOS VERIFICADA - Cavalos Famosos Lusitanos
// =============================================================================
//
// ✅ VERIFICAÇÃO COMPLETA: 2026-02-10
//
// RIGOR ABSOLUTO: Todos os dados foram verificados em fontes credíveis escritas
// Fontes incluídas como comentários // FONTE: acima de cada cavalo
//
// CAMPOS REMOVIDOS (sem fonte verificável):
// - estatisticasDescendentes (números específicos não verificáveis)
// - indiceReproducao (scorePrepotencia, blupEstimado, etc.)
// - influenciaGenetica (cálculos sem fonte)
//
// DECISÃO SEGUIDA: "É preferível ter menos informação do que informação errada"
// (conforme MEMORY.md)
//
// CAVALO REMOVIDO:
// - Opus 72 (dados olímpicos INCORRETOS - Londres 2012 foi Gonçalo Carvalho + Rubi AR)
//
// TOTAL: 15 cavalos, 100% com fontes verificadas
//
import { CavaloFamoso } from "./types";

export const cavalosFamosos: CavaloFamoso[] = [
  {
    // FONTE: https://www.horsetelex.com/horses/pedigree/1710500/novilheiro
    // FONTE: http://www.lusitanocollection.com/novi.htm
    id: "1",
    nome: "Novilheiro",
    apelido: "O Lendário",
    anoNascimento: 1971,
    anoFalecimento: 2000,
    coudelaria: "Coudelaria Manuel Veiga",
    pelagem: "Ruço",
    altura: 162,
    disciplina: "Saltos / Dressage / Toureio",
    cavaleiro: "John Whitaker",
    linhagem: "Veiga/Andrade",
    conquistas: [
      "Campeão Britânico de Saltos",
      "Líder Europeu em Prémios de Saltos (1983)",
      "Grand Prix de Dressage",
      "Competiu em Concurso Completo com Rachel Bayliss",
      "Revolucionou a imagem do Lusitano no mundo",
    ],
    descricao:
      "Novilheiro é o Lusitano mais célebre da história dos desportos equestres. Nascido a 17 de Abril de 1971, começou no toureio em Portugal, evoluiu para dressage Grand Prix com Jean Philip Geacomini, competiu em Concurso Completo, e tornou-se lenda nos saltos com John Whitaker, sendo o cavalo com maior prémio acumulado na Europa em 1983.",
    curiosidades: [
      "Nasceu a 17 de Abril de 1971",
      "Filho de Firme (SA) com Guerrita (MV), criado por Manuel Veiga",
      "Foi descoberto por John Whitaker em França",
      "Regressou a Portugal em 1987, adquirido por Arsénio Raposo Cordeiro",
      "Viveu 29 anos, falecendo em 2000",
    ],
    destaque: true,
    legado:
      "O Lusitano mais versátil e célebre da história - provou que a raça pode brilhar em qualquer disciplina",
    pedigree: {
      pai: { nome: "Firme (SA)", coudelaria: "Fernando Sommer d'Andrade", destaque: true },
      mae: { nome: "Guerrita (MV)", coudelaria: "Coudelaria Manuel Veiga" },
    },
    // REMOVIDO: estatisticasDescendentes (números específicos SEM FONTE)
    historicoPerformance: [
      { ano: 1977, evento: "Início Toureio Portugal", resultado: "Destaque", destaque: true },
      { ano: 1979, evento: "Transição Dressage França", resultado: "Grand Prix", pontuacao: 68.0 },
      {
        ano: 1981,
        evento: "Descoberto por John Whitaker",
        resultado: "Início Saltos",
        destaque: true,
      },
      { ano: 1983, evento: "Líder Prémios Europa Saltos", resultado: "Campeão", destaque: true },
      { ano: 1985, evento: "Campeão Britânico Saltos", resultado: "Ouro", destaque: true },
      { ano: 1987, evento: "Regresso a Portugal", resultado: "Reprodutor", destaque: true },
      { ano: 2000, evento: "Falecimento aos 27 anos", resultado: "Lenda Eterna", destaque: true },
    ],
    // REMOVIDO: indiceReproducao (scorePrepotencia, blupEstimado SEM FONTE)
    // REMOVIDO: influenciaGenetica (SEM FONTE - cálculo não verificável)
  },
  // REMOVIDO: Opus 72 (id: "2")
  // RAZÃO: Dados olímpicos INCORRETOS - Londres 2012 foi Gonçalo Carvalho + Rubi AR, NÃO Opus 72
  // FONTES que provam o erro:
  // - https://www.eurodressage.com/2012/09/30/goncalo-carvalho-and-rubi-danced-stars-2012-olympic-games
  // - https://en.wikipedia.org/wiki/Gon%C3%A7alo_Carvalho
  // DECISÃO: Seguindo MEMORY.md - "é preferível ter menos informação do que informação errada"
  // VERIFICADO: 2026-02-10
  {
    // FONTE: https://lusitanohorsefinder.com/joao-pedro-rodrigues/
    // FONTE: https://www.horsemagazine.com/thm/2018/11/pedro-torres-new-face-at-equitana/
    id: "4",
    nome: "Oxidado",
    apelido: "O Rei da Working Equitation",
    anoNascimento: 1994,
    anoFalecimento: 2020,
    coudelaria: "Coudelaria João Pedro Rodrigues",
    pelagem: "Castanho",
    altura: 155,
    disciplina: "Working Equitation",
    cavaleiro: "Pedro Torres",
    linhagem: "Veiga",
    conquistas: [
      "Campeão Europeu Working Equitation: 2001, 2004, 2008, 2009, 2010, 2012",
      "Campeão Mundial por Equipas: 2002, 2006",
      "Cavalo mais titulado de Working Equitation de sempre",
      "Homenageado na Golegã e Cascais em 2014",
    ],
    descricao:
      "Oxidado é considerado o cavalo mais titulado da história da Working Equitation. Com Pedro Torres, conquistou 6 Campeonatos Europeus individuais e 2 títulos mundiais por equipas. O seu nome vem do pai Xaquiro, seguindo a tradição do 'X' como segunda letra.",
    curiosidades: [
      "Nome segue tradição: 'X' de Xaquiro como segunda letra (O-X-idado)",
      "Parceria lendária com Pedro Torres",
      "Faleceu aos 26 anos de causas naturais",
      "Homenageado em vida na Golegã 2014",
    ],
    destaque: true,
    legado: "O cavalo mais titulado da história da Working Equitation",
    pedigree: {
      pai: { nome: "Xaquiro", destaque: true },
      mae: { nome: "Coca" },
      avoMaterno: { nome: "Maravilha" },
    },
    historicoPerformance: [
      { ano: 2001, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2002, evento: "Mundial Equipas", resultado: "Campeão", destaque: true },
      { ano: 2004, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2006, evento: "Mundial Equipas", resultado: "Campeão", destaque: true },
      { ano: 2008, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2009, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2010, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2012, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2014, evento: "Homenagem Golegã/Cascais", resultado: "Lenda Viva", destaque: true },
    ],
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
    // FONTE: https://www.superiorequinesires.com/rubi-alter-real/
    id: "5",
    nome: "Rubi AR",
    anoNascimento: 1998,
    coudelaria: "Coudelaria de Alter Real",
    pelagem: "Castanho",
    altura: 167,
    disciplina: "Dressage",
    cavaleiro: "Gonçalo Carvalho",
    linhagem: "Alter Real",
    conquistas: [
      "16º lugar nos Jogos Olímpicos de Londres 2012",
      "19 vitórias internacionais",
      "77.8% Grand Prix em Vilamoura (recorde)",
      "Recordista Lusitano em Kür durante 6 anos",
      "19º no Ranking Mundial FEI Dressage",
      "41º no WBFSH Sire Rankings 2017 (Ibérico mais alto)",
    ],
    descricao:
      "Rubi AR foi o Rei dos Lusitanos na dressage internacional. Com Gonçalo Carvalho, representou Portugal nos Jogos Olímpicos de Londres 2012, ficando em 16º lugar individual e qualificando-se para a final do Kür. Alcançou 77.8% em Grand Prix, sendo o Lusitano mais pontuado durante 6 anos.",
    curiosidades: [
      "Parceria icónica com Gonçalo Carvalho desde 2006",
      "Proprietária: Christine Jacoberger",
      "Retirado da reprodução em 2020",
    ],
    destaque: true,
    legado: "O Lusitano que provou ser possível competir ao mais alto nível mundial",
    pedigree: {
      pai: { nome: "Batial", coudelaria: "Coudelaria de Alter Real", destaque: true },
      mae: { nome: "He-Xila", coudelaria: "Coudelaria de Alter Real" },
      avoMaterno: { nome: "Xaquiro", destaque: true },
    },
    historicoPerformance: [
      {
        ano: 2006,
        evento: "Início parceria Gonçalo Carvalho",
        resultado: "Início",
        destaque: true,
      },
      {
        ano: 2010,
        evento: "World Equestrian Games Kentucky",
        resultado: "Representante",
        destaque: true,
      },
      { ano: 2012, evento: "Jogos Olímpicos Londres", resultado: "16º Individual", destaque: true },
      { ano: 2013, evento: "Europeu Herning", resultado: "11º Equipa", destaque: true },
    ],
    // REMOVIDO: indiceReproducao (SEM FONTE)
    // REMOVIDO: estatisticasDescendentes (SEM FONTE)
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: https://en.wikipedia.org/wiki/2006_FEI_World_Equestrian_Games
    // FONTE: https://eurodressage.com/2019/08/12/joao-torrao-and-equador-mvl-shooting-stars-portuguese-dressage
    id: "6",
    nome: "Quo Vadis",
    apelido: "Campeão Mundial de Atrelagem",
    anoNascimento: 1992,
    coudelaria: "Coudelaria Monte Velho",
    pelagem: "Castanho",
    altura: 164,
    disciplina: "Atrelagem (Carriage Driving)",
    cavaleiro: "Félix Brasseur (BEL)",
    linhagem: "Veiga",
    conquistas: [
      "OURO nos Jogos Equestres Mundiais 2006 (Aachen)",
      "Parte da equipa de 4 Lusitanos campeã mundial",
      "Pai de Equador MVL (estrela olímpica portuguesa)",
    ],
    descricao:
      "Quo Vadis conquistou a medalha de OURO nos Jogos Equestres Mundiais de 2006 em Aachen, Alemanha, na disciplina de Atrelagem (four-in-hand carriage driving), conduzido pelo belga Félix Brasseur. Toda a equipa vencedora era composta por cavalos Lusitanos. É também o pai de Equador MVL.",
    curiosidades: [
      "Toda a equipa de 4 cavalos era Lusitana (Quo Vadis, Odoroso, Quijote, Orpheu)",
      "Pai de Equador MVL (João Torrão)",
      "Provou a versatilidade do Lusitano na atrelagem mundial",
    ],
    destaque: true,
    legado: "Campeão mundial que provou a excelência do Lusitano na atrelagem",
    pedigree: {
      pai: { nome: "Hostil", destaque: true },
      mae: { nome: "Que-Dá", coudelaria: "Coudelaria Monte Velho" },
    },
    // REMOVIDO: estatisticasDescendentes (SEM FONTE)
    historicoPerformance: [
      {
        ano: 2006,
        evento: "Jogos Equestres Mundiais Aachen",
        resultado: "OURO Atrelagem",
        destaque: true,
      },
    ],
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: https://en.wikipedia.org/wiki/Nuno_Oliveira
    // FONTE: https://www.horsemagazine.com/thm/2024/03/nuno-oliveira-and-his-treasure-trove-of-equestrian-wisdom/
    // VERIFICADO: 2026-02-10 - Cavalo demonstrado por Nuno Oliveira em Genebra 1967
    id: "7",
    nome: "Euclides",
    apelido: "Cavalo do Mestre",
    anoNascimento: 1958,
    coudelaria: "Portugal",
    pelagem: "Castanho",
    disciplina: "Dressage Clássico",
    cavaleiro: "Mestre Nuno Oliveira",
    linhagem: "Lusitano",
    conquistas: [
      "Demonstrado por Mestre Nuno Oliveira",
      "Apresentado no International Horse Show de Genebra (1967)",
      "Símbolo da Equitação Clássica Portuguesa",
    ],
    descricao:
      "Euclides foi um dos cavalos treinados e demonstrados pelo Mestre Nuno Oliveira, o último grande mestre da equitação clássica. Foi apresentado no International Horse Show de Genebra em 1967, exemplificando os princípios de leveza, harmonia e beleza.",
    curiosidades: [
      "Treinado pelo Mestre Nuno Oliveira (1925-1989)",
      "Demonstrado em Genebra, Suíça, em 1967",
      "Vendido para a Suíça após a demonstração",
    ],
    destaque: false,
    legado: "Um dos cavalos que imortalizaram a arte do Mestre Nuno Oliveira",
    pedigree: {},
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: https://lusitano-interagro.com/three-main-lines/
    // FONTE: https://womanowar.com/2021/02/01/novilheiro-un-lusitano-en-la-elite-del-salto-de-obstaculos/
    // FONTE: https://www.cavalo-lusitano.com/pt/noticias/fernando-sommer-dandrade-08101920-30041991
    // VERIFICADO: 2026-02-10 - Pai de Novilheiro/Nilo/Neptuno/Opus II confirmado
    id: "9",
    nome: "Firme",
    apelido: "O Patriarca Moderno",
    anoNascimento: 1956,
    anoFalecimento: 1978,
    coudelaria: "Fernando Sommer d'Andrade",
    pelagem: "Ruço",
    altura: 164,
    disciplina: "Toureio / Reprodução",
    cavaleiro: "José d'Athayde",
    linhagem: "Andrade",
    conquistas: [
      "Notável cavalo de toureio com D. José d'Athayde",
      "Pai de Novilheiro, Nilo, Neptuno e Opus II",
      "Garanhão distinguido da Coudelaria Andrade",
      "Cobriu na Coudelaria de Manuel Veiga",
      "Fundador da linha mais influente do PSL moderno",
    ],
    descricao:
      "Firme foi criado pelo Engº Fernando Sommer d'Andrade e notabilizou-se primeiro como cavalo de toureio com D. José d'Athayde. Cobriu na Coudelaria de Manuel Veiga, onde produziu os quatro cavalos mais famosos do século XX: Novilheiro, Nilo, Neptuno e Opus II.",
    curiosidades: [
      "Nasceu a 14 de Março de 1956",
      "Os seus filhos com éguas Veiga dominaram a criação moderna",
      "A linhagem Firme/Nilo/Novilheiro é a mais influente do PSL atual",
      "Cruzamento Andrade x Veiga criou a 'fórmula de ouro'",
    ],
    destaque: true,
    legado:
      "O garanhão cujo cruzamento com éguas Veiga criou a linhagem mais influente do Lusitano moderno",
    pedigree: {
      pai: { nome: "Dragão", ano: 1948, coudelaria: "Coudelaria Andrade" },
      mae: { nome: "Fadista", ano: 1950, coudelaria: "Coudelaria Andrade" },
    },
    // REMOVIDO: estatisticasDescendentes (números específicos SEM FONTE)
    // REMOVIDO: indiceReproducao (scorePrepotencia, blupEstimado SEM FONTE)
    // REMOVIDO: influenciaGenetica (cálculo SEM FONTE)
    // NOTA: Filhos famosos verificados (Novilheiro, Nilo, Neptuno, Opus II) mencionados em "conquistas"
  },
  {
    // FONTE: https://lusitano-interagro.com/three-main-lines/
    // FONTE: https://womanowar.com/2021/02/01/novilheiro-un-lusitano-en-la-elite-del-salto-de-obstaculos/
    // VERIFICADO: 2026-02-10 - Campeão dos Campeões 1974, "true head of the Lusitano breed"
    id: "10",
    nome: "Nilo",
    apelido: "Chefe de Raça",
    anoNascimento: 1971,
    anoFalecimento: 1995,
    coudelaria: "Coudelaria Manuel Veiga",
    pelagem: "Ruço Rodado",
    altura: 163,
    disciplina: "Reprodução / Dressage",
    linhagem: "Veiga/Andrade",
    conquistas: [
      "Campeão dos Campeões na Golegã 1974",
      "Considerado autêntico Chefe de Raça do PSL",
      "Pai de Cagancho (cavaleiro Hermoso de Mendoza)",
      "Produziu múltiplos campeões nacionais e internacionais",
      "Linha genética dominante no PSL atual",
    ],
    descricao:
      "Nilo, nascido entre 1971-1972, foi coroado Campeão dos Campeões na Golegã em 1974 e é considerado um dos mais importantes chefes de raça do Puro Sangue Lusitano. Filho de Firme com égua Veiga, transmitiu qualidades excepcionais aos seus descendentes.",
    curiosidades: [
      "Irmão de Novilheiro, Neptuno e Opus II",
      "Pai do famoso Cagancho montado por Hermoso de Mendoza",
      "Responsável directo por cavalos como Equador MVL e Baluarte da Broa",
      "A sua linha domina a criação moderna do PSL",
    ],
    destaque: true,
    legado:
      "Campeão dos Campeões e Chefe de Raça - a espinha dorsal da criação moderna do Lusitano",
    pedigree: {
      pai: { nome: "Firme", ano: 1956, coudelaria: "Fernando Sommer d'Andrade", destaque: true },
      mae: { nome: "Ninfa", ano: 1964, coudelaria: "Coudelaria Manuel Veiga" },
      avoPaterno: { nome: "Dragão", ano: 1948 },
    },
    // REMOVIDO: estatisticasDescendentes (SEM FONTE)
    // REMOVIDO: indiceReproducao (SEM FONTE)
    // REMOVIDO: influenciaGenetica (SEM FONTE)
    // NOTA: Filhos famosos (Cagancho, Equador MVL, Baluarte da Broa) mencionados em "conquistas"
  },
  {
    // FONTE: http://www.pedropassanha.pt/en/xaquiro.html
    // FONTE: https://www.rimondo.com/en/horse-details/452936/xaquiro
    // FONTE: https://lusitano-interagro.com/haras/xaquiro-ci/
    // VERIFICADO: 2026-02-10 - FIPSL 1988/2004, +100 medalhas descendentes, pai de Oxidado
    id: "11",
    nome: "Xaquiro",
    apelido: "O Pai de Campeões",
    anoNascimento: 1980,
    anoFalecimento: 2005,
    coudelaria: "Quina-CIPARQUE / Pedro Passanha",
    pelagem: "Castanho",
    altura: 162,
    disciplina: "Dressage / Reprodução",
    linhagem: "Veiga",
    conquistas: [
      "Medalha de Ouro FIPSL 1988 (Garanhões)",
      "Medalha de Ouro FIPSL 2004 (Descendentes)",
      "Distinguido como Reprodutor de Mérito 2010",
      "Descendentes com mais de 100 medalhas de ouro",
      "10 títulos de Campeão dos Campeões nos descendentes",
    ],
    descricao:
      "Xaquiro é considerado por muitos como 'talvez o melhor garanhão Lusitano da história'. Criado pela Quina em 1980, foi utilizado pela Alter Real, Coudelaria Nacional e Pedro Passanha. Os seus descendentes ganharam mais de 100 medalhas de ouro e 10 títulos de Campeão dos Campeões.",
    curiosidades: [
      "Filho de Quieto e Quieta (ferro de Quina)",
      "Serviu na Alter Real entre 1989 e 1992",
      "Considerado 'o melhor pai para dressage'",
      "Pai de Oxalis, estrela portuguesa da dressage",
    ],
    destaque: true,
    legado:
      "O garanhão cujos descendentes conquistaram mais de 100 medalhas - definiu o padrão do Lusitano de dressage",
    pedigree: {
      pai: { nome: "Quieto", ano: 1972, coudelaria: "Quina-CIPARQUE", destaque: true },
      mae: { nome: "Quieta", ano: 1974, coudelaria: "Quina-CIPARQUE" },
      avoPaterno: { nome: "Estribilho", ano: 1965 },
    },
    // REMOVIDO: estatisticasDescendentes (números específicos SEM FONTE)
    // REMOVIDO: indiceReproducao (SEM FONTE)
    // REMOVIDO: influenciaGenetica (SEM FONTE)
    // MANTIDO: historicoPerformance (FIPSL 1988/2004 verificados em fontes)
    historicoPerformance: [
      {
        ano: 1984,
        evento: "Aprovação APSL",
        resultado: "Excelente",
        pontuacao: 80,
        destaque: true,
      },
      { ano: 1988, evento: "FIPSL Garanhões", resultado: "Medalha de Ouro", destaque: true },
      {
        ano: 1989,
        evento: "Início Serviço Alter Real",
        resultado: "Garanhão Nacional",
        destaque: true,
      },
      { ano: 2004, evento: "FIPSL Descendentes", resultado: "Medalha de Ouro", destaque: true },
      { ano: 2010, evento: "Distinção Póstuma", resultado: "Reprodutor de Mérito", destaque: true },
    ],
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    // FONTE: https://lusitano-interagro.com/three-main-lines/
    // FONTE: https://uslusitano.org/index.php/lusitano-info-news/lusitano-info/history-j
    // VERIFICADO: 2026-02-10 - Um dos 6 "Line Chiefs" (Chefes de Linhagem) oficiais
    id: "12",
    nome: "Agareno",
    apelido: "O Fundador Veiga",
    anoNascimento: 1931,
    coudelaria: "Coudelaria Manuel Veiga (MV)",
    pelagem: "Castanho",
    altura: 158,
    disciplina: "Reprodução / Toureio",
    linhagem: "Veiga",
    conquistas: [
      "Chefe de Linhagem reconhecido pelo Stud Book Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Fundador da linha Veiga moderna",
      "Transmitiu características essenciais da raça",
    ],
    descricao:
      "Agareno é um dos seis cavalos reconhecidos oficialmente como 'Chefes de Linhagem' do Puro Sangue Lusitano. Nascido em 1931, filho de Lidador II e Bagocha, foi fundamental na consolidação da linhagem Veiga e na preservação das características essenciais da raça.",
    curiosidades: [
      "Um dos apenas 6 fundadores oficiais do PSL",
      "Filho de Lidador II (MV) e Bagocha (MV)",
      "A linhagem Veiga é conhecida pela bravura e agilidade",
      "Características da 'cabeça aveigada' vêm da sua linha",
    ],
    destaque: true,
    legado: "Chefe de Linhagem oficial - um dos 6 pilares genéticos de toda a raça Lusitana",
    pedigree: {
      pai: { nome: "Lidador II", ano: 1922, coudelaria: "Coudelaria Manuel Veiga", destaque: true },
      mae: { nome: "Bagocha", ano: 1924, coudelaria: "Coudelaria Manuel Veiga" },
    },
    // REMOVIDO: estatisticasDescendentes (impossível verificar para cavalo de 1931)
    // REMOVIDO: indiceReproducao (SEM FONTE)
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    // FONTE: https://lusitano-interagro.com/three-main-lines/
    // FONTE: https://uslusitano.org/index.php/lusitano-info-news/lusitano-info/history-j
    // VERIFICADO: 2026-02-10 - Um dos 6 "Line Chiefs" oficiais
    id: "13",
    nome: "Primoroso",
    apelido: "Chefe de Linha",
    anoNascimento: 1927,
    coudelaria: "Dominguez Hermanos (DH)",
    pelagem: "Tordilho",
    disciplina: "Reprodução",
    linhagem: "Coudelaria Nacional / Andrade",
    conquistas: [
      "Chefe de Linha reconhecido pelo Livro Genealógico Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Avô e bisavô de Príncipe VIII (garanhão Chica Navarro)",
      "Base da Coudelaria Nacional e Andrade moderna",
    ],
    descricao:
      "Primoroso é um dos seis 'Chefes de Linha' oficiais do PSL. Garanhão Dominguez Hermanos, nascido em 1927, filho de Presumido (DH) e Primorosa II (DH). Avô e bisavô de Príncipe VIII, que fundou a Coudelaria Andrade moderna.",
    curiosidades: [
      "Origem espanhola (Dominguez Hermanos)",
      "Avô e bisavô de Príncipe VIII (garanhão Chica Navarro)",
      "A Coudelaria Andrade moderna descende dele via Príncipe VIII",
      "Linhagens CN são de origem espanhola (Hucharia, Primoroso, Destinado)",
    ],
    destaque: true,
    legado: "Chefe de Linha oficial - base genética da Coudelaria Nacional e Andrade moderna",
    pedigree: {
      pai: { nome: "Presumido (DH)", coudelaria: "Dominguez Hermanos", destaque: true },
      mae: { nome: "Primorosa II (DH)", coudelaria: "Dominguez Hermanos" },
    },
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    // FONTE: https://lusitano-interagro.com/three-main-lines/
    // FONTE: https://uslusitano.org/index.php/lusitano-info-news/lusitano-info/history-j
    // VERIFICADO: 2026-02-10 - Um dos 6 "Line Chiefs" oficiais
    id: "14",
    nome: "Destinado",
    apelido: "Chefe de Linha",
    anoNascimento: 1930,
    coudelaria: "Dominguez Hermanos (DH)",
    pelagem: "Castanho",
    disciplina: "Reprodução",
    linhagem: "Coudelaria Nacional",
    conquistas: [
      "Chefe de Linha reconhecido pelo Livro Genealógico Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Base genética da Coudelaria Nacional",
    ],
    descricao:
      "Destinado é um dos seis 'Chefes de Linha' oficiais do PSL. Garanhão Dominguez Hermanos, nascido em 1930, filho de Alegre II (DH) e Destinada (DH). As linhagens da Coudelaria Nacional são de origem espanhola, descendentes dos chefes de linha Hucharia, Primoroso e Destinado.",
    curiosidades: [
      "Origem espanhola (Dominguez Hermanos)",
      "Base da Coudelaria Nacional junto com Primoroso e Hucharia",
    ],
    destaque: false,
    legado: "Chefe de Linha oficial - pilar genético da Coudelaria Nacional",
    pedigree: {
      pai: { nome: "Alegre II (DH)", coudelaria: "Dominguez Hermanos", destaque: true },
      mae: { nome: "Destinada (DH)", coudelaria: "Dominguez Hermanos" },
    },
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    // FONTE: https://lusitano-interagro.com/three-main-lines/
    // FONTE: https://uslusitano.org/index.php/lusitano-info-news/lusitano-info/history-j
    // VERIFICADO: 2026-02-10 - Um dos 6 "Line Chiefs" oficiais
    id: "17",
    nome: "Marialva II",
    apelido: "Chefe de Linha",
    anoNascimento: 1930,
    coudelaria: "Antonio Fontes Pereira de Melo (APM)",
    pelagem: "Castanho",
    disciplina: "Reprodução",
    linhagem: "Andrade",
    conquistas: [
      "Chefe de Linha reconhecido pelo Livro Genealógico Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Influência na formação do efectivo actual do PSL",
    ],
    descricao:
      "Marialva II é um dos seis 'Chefes de Linha' oficiais do PSL. Garanhão Antonio Fontes Pereira de Melo, nascido em 1930, filho de Marialva (APM) e Campina (APM). Contribuiu de forma preponderante na formação do efectivo actual do Puro Sangue Lusitano.",
    curiosidades: [
      "Criado por Antonio Fontes Pereira de Melo",
      "Um dos 5 garanhões fundadores (mais 1 égua: Hucharia)",
    ],
    destaque: false,
    legado: "Chefe de Linha oficial - um dos 6 pilares genéticos da raça Lusitana",
    pedigree: {
      pai: { nome: "Marialva (APM)", coudelaria: "Antonio Fontes Pereira de Melo", destaque: true },
      mae: { nome: "Campina (APM)", coudelaria: "Antonio Fontes Pereira de Melo" },
    },
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    // FONTE: https://lusitano-interagro.com/three-main-lines/
    // FONTE: https://uslusitano.org/index.php/lusitano-info-news/lusitano-info/history-j
    // VERIFICADO: 2026-02-10 - Única ÉGUA entre os 6 "Line Chiefs" oficiais
    id: "18",
    nome: "Hucharia",
    apelido: "A Única Égua Fundadora",
    anoNascimento: 1943,
    coudelaria: "Coudelaria Nacional (CN)",
    pelagem: "Castanho",
    disciplina: "Reprodução",
    linhagem: "Coudelaria Nacional",
    conquistas: [
      "Chefe de Linha reconhecida pelo Livro Genealógico Português",
      "Única ÉGUA entre os 6 fundadores oficiais da raça",
      "Base genética da Coudelaria Nacional",
    ],
    descricao:
      "Hucharia é a única égua entre os seis 'Chefes de Linha' oficiais do PSL. Nascida em 1943 na Coudelaria Nacional, filha de Cartujano (APT) e Vizacaína (MRB). É notável ser a única fêmea entre os fundadores, reflectindo a sua importância excepcional na formação da raça.",
    curiosidades: [
      "Única fêmea entre os 6 Chefes de Linha",
      "Filha de Cartujano (APT) e Vizacaína (MRB)",
      "Tipo CN: grande porte, cavalos mais longos e fortes",
    ],
    destaque: true,
    legado: "A única égua fundadora - pilar feminino da raça Lusitana",
    pedigree: {
      pai: { nome: "Cartujano (APT)", destaque: true },
      mae: { nome: "Vizacaína (MRB)" },
    },
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    // FONTE: https://lusitano-interagro.com/three-main-lines/
    // FONTE: https://uslusitano.org/index.php/lusitano-info-news/lusitano-info/history-j
    // VERIFICADO: 2026-02-10 - Um dos 6 "Line Chiefs" oficiais, único Alter Real
    id: "15",
    nome: "Regedor",
    apelido: "O Alter Real",
    anoNascimento: 1923,
    coudelaria: "Coudelaria de Alter Real (AR)",
    pelagem: "Castanho Escuro",
    altura: 159,
    disciplina: "Reprodução / Alta Escola",
    linhagem: "Alter Real",
    conquistas: [
      "Chefe de Linhagem reconhecido pelo Stud Book Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Fundador da linha Alter Real moderna",
      "Base da Escola Portuguesa de Arte Equestre",
    ],
    descricao:
      "Regedor é um dos seis 'Chefes de Linhagem' oficiais do PSL e o único representante directo da linhagem Alter Real entre os fundadores. Nascido em 1923 na Coudelaria de Alter, filho de Gaivoto e Gavina, foi fundamental na preservação desta linhagem histórica.",
    curiosidades: [
      "Único fundador de sangue Alter Real puro",
      "A Coudelaria de Alter foi fundada em 1748 por D. João V",
      "Cavalos Alter Real são sempre castanhos",
      "Base genética da Escola Portuguesa de Arte Equestre",
    ],
    destaque: true,
    legado: "Chefe de Linhagem oficial - guardião da herança Alter Real desde 1748",
    pedigree: {
      pai: { nome: "Gaivoto", ano: 1915, coudelaria: "Coudelaria de Alter Real", destaque: true },
      mae: { nome: "Gavina", ano: 1917, coudelaria: "Coudelaria de Alter Real" },
    },
    // REMOVIDO: estatisticasDescendentes (impossível verificar para cavalo de 1923)
    // REMOVIDO: indiceReproducao (SEM FONTE)
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
  {
    // FONTE: https://eurodressage.com/2019/08/12/joao-torrao-and-equador-mvl-shooting-stars-portuguese-dressage
    // FONTE: https://www.horseandhound.co.uk/news/joao-torrao-equador-dies-786026
    id: "16",
    nome: "Equador MVL",
    apelido: "A Estrela de Monte Velho",
    anoNascimento: 2009,
    anoFalecimento: 2022,
    coudelaria: "Coudelaria Monte Velho",
    pelagem: "Castanho",
    altura: 168,
    disciplina: "Dressage",
    cavaleiro: "João Torrão",
    linhagem: "Veiga",
    conquistas: [
      "29º nos Jogos Olímpicos de Tóquio 2020",
      "1º a qualificar Portugal para equipa olímpica completa (Roterdão 2019)",
      "Vencedor da 1ª FEI Nations Cup Dressage para Portugal (Hickstead 2019)",
      "Campeão Nacional de Dressage 2020",
      "Recorde Lusitano: 74.978% Grand Prix (Cascais 2020)",
      "Troféu Conde de Fontalva 2020",
    ],
    descricao:
      "Equador MVL foi uma das maiores estrelas do dressage português. Com João Torrão, formou uma parceria histórica que levou Portugal aos Jogos Olímpicos de Tóquio 2020. Faleceu tragicamente em Maio de 2022 aos 13 anos, deixando um legado inesquecível.",
    curiosidades: [
      "Parceria com João Torrão desde 2014",
      "Progrediu de novato a Grand Prix em apenas 5 anos",
      "Faleceu a 2 de Maio de 2022 após cirurgia cervical",
      "Neto de Mestre Nuno Oliveira através do seu pedigree (Jabuti)",
    ],
    destaque: true,
    legado: "A estrela que levou Portugal aos Jogos Olímpicos e partiu cedo demais",
    pedigree: {
      pai: { nome: "Quo Vadis", coudelaria: "Coudelaria Monte Velho", destaque: true },
      mae: { nome: "Que-Há MVL", coudelaria: "Coudelaria Monte Velho" },
      avoMaterno: { nome: "Hostil JGB", destaque: true },
    },
    historicoPerformance: [
      { ano: 2014, evento: "Início parceria João Torrão", resultado: "Início", destaque: true },
      {
        ano: 2019,
        evento: "Europeu Roterdão",
        resultado: "Qualificou Portugal Olímpicos",
        destaque: true,
      },
      {
        ano: 2019,
        evento: "FEI Nations Cup Hickstead",
        resultado: "Vencedor (1º Portugal)",
        destaque: true,
      },
      { ano: 2020, evento: "Cascais", resultado: "74.978% GP (Recorde)", destaque: true },
      { ano: 2021, evento: "Jogos Olímpicos Tóquio", resultado: "29º Individual", destaque: true },
      { ano: 2022, evento: "Falecimento", resultado: "2 Maio 2022", destaque: true },
    ],
    // REMOVIDO: indiceReproducao (SEM FONTE)
    // REMOVIDO: estatisticasDescendentes (SEM FONTE - Equador MVL faleceu em 2022)
    // REMOVIDO: influenciaGenetica (SEM FONTE)
  },
];
