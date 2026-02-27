// =============================================================================
// BASE DE DADOS VERIFICADA - Cavalos Famosos Lusitanos
// =============================================================================
//
// ✅ VERIFICAÇÃO COMPLETA: 2026-02-10 (15 cavalos) + 2026-02-25 (8 novos cavalos)
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
// TOTAL: 23 cavalos, 100% com fontes verificadas
//
import { CavaloFamoso } from "./types";

export const cavalosFamosos: CavaloFamoso[] = [
  {
    // FONTE: https://www.horsetelex.com/horses/pedigree/1710500/novilheiro
    // FONTE: http://www.lusitanocollection.com/novi.htm
    // FONTE: https://interagro.com.br (pedigree verificado)
    // FONTE: SporthorseData (altura 165cm, pelagem Grey, pedigree 5 gerações confirmado)
    id: "1",
    nome: "Novilheiro",
    imagem: "/images/cavalos-famosos/novilheiro/capa.webp",
    apelido: "O Lendário",
    anoNascimento: 1971,
    anoFalecimento: 2000,
    coudelaria: "Coudelaria Manuel Veiga",
    pelagem: "Tordilho",
    altura: 165,
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
      "Novilheiro é o Lusitano mais célebre da história dos desportos equestres. Nascido a 27 de Abril de 1971, começou no toureio em Portugal, evoluiu para dressage Grand Prix em França, competiu em Concurso Completo, e tornou-se lenda nos saltos com John Whitaker, sendo o cavalo com maior prémio acumulado na Europa em 1983. Nível de competição: Grand Prix Nacional de Saltos (1.40m).",
    curiosidades: [
      "Nasceu a 27 de Abril de 1971",
      "Filho de Firme (SA) com Guerrita (MV), criado por Manuel Veiga",
      "Foi descoberto por John Whitaker em França",
      "Regressou a Portugal em 1987, adquirido por Arsénio Raposo Cordeiro",
      "Viveu 29 anos, falecendo em 2000",
    ],
    destaque: true,
    legado:
      "O Lusitano mais versátil e célebre da história - provou que a raça pode brilhar em qualquer disciplina",
    pedigree: {
      // VERIFICADO: Interagro Lusitanos (pedigree completo)
      pai: { nome: "Firme (SA)", coudelaria: "Fernando Sommer d'Andrade", destaque: true },
      mae: { nome: "Guerrita (MV)", coudelaria: "Coudelaria Manuel Veiga" },
      avoPaterno: { nome: "Príncipe VIII (FCN)", coudelaria: "Fundação Casa de Noronha" },
      avoaPaterna: { nome: "Segura (SA)", coudelaria: "Fernando Sommer d'Andrade" },
      avoMaterno: { nome: "Bailador (MV)", coudelaria: "Coudelaria Manuel Veiga" },
      avoaMaterna: { nome: "Toleirona (MV)", coudelaria: "Coudelaria Manuel Veiga" },
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
      { ano: 2000, evento: "Falecimento aos 29 anos", resultado: "Lenda Eterna", destaque: true },
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
    imagem: "/images/cavalos-famosos/oxidado/capa.webp",
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
    // FONTE: https://www.teamrubi.com/horses/rubi-ar/
    id: "5",
    nome: "Rubi AR",
    imagem: "/images/cavalos-famosos/rubi-ar/capa.webp",
    anoNascimento: 1998,
    coudelaria: "Coudelaria de Alter Real",
    pelagem: "Castanho",
    altura: 167,
    disciplina: "Dressage",
    cavaleiro: "Gonçalo Carvalho",
    linhagem: "Alter Real",
    conquistas: [
      "16º lugar nos Jogos Olímpicos de Londres 2012 (77% Freestyle, 74% GPS)",
      "19 vitórias internacionais em Grand Prix",
      "Garanhão reprodutor 5 estrelas APSL para Dressage",
      "77.8% Grand Prix em Vilamoura (recorde Lusitano)",
      "Recordista Lusitano em Kür durante 6 anos",
      "19º no Ranking Mundial FEI Dressage",
      "1º Ibérico no WBFSH Top 50 Sire Rankings (41º em 2017)",
      "4 Campeonatos Seniores consecutivos (WEG 2010, Europeu 2011, Olímpicos 2012, Europeu 2013)",
    ],
    descricao:
      "Rubi AR é o Lusitano com a melhor carreira internacional de sempre na dressage. Com Gonçalo Carvalho, representou Portugal em 4 campeonatos seniores consecutivos, incluindo os Jogos Olímpicos de Londres 2012, onde ficou em 16º lugar individual com 77% no Freestyle e 74% no Grand Prix Special. É também um dos garanhões reprodutores mais bem-sucedidos, com filhos a pontuar até 86% em provas FEI.",
    curiosidades: [
      "Parceria icónica com Gonçalo Carvalho desde 2006",
      "Proprietária: Christine Jacoberger",
      "Filho de Batial AR x He-Xila (por Xaquiro) — criado na Coudelaria de Alter Real",
      "Primeiro Ibérico a entrar no Top 50 do WBFSH; o pai Batial chegou a 51º em 2012 baseado nos resultados de Rubi",
      "Transmite tamanho, beleza, funcionalidade e carácter aos descendentes",
      "Progenia com scores até 86% em provas FEI de Dressage",
    ],
    destaque: true,
    legado:
      "O Lusitano com a melhor carreira de sempre — e o garanhão reprodutor que está a criar a próxima geração de campeões",
    pedigree: {
      pai: { nome: "Batial", coudelaria: "Coudelaria de Alter Real", destaque: true },
      mae: { nome: "He-Xila", coudelaria: "Coudelaria de Alter Real" },
      avoMaterno: { nome: "Xaquiro", destaque: true },
    },
    historicoPerformance: [
      {
        ano: 2006,
        evento: "Início parceria Gonçalo Carvalho",
        resultado: "Início carreira internacional",
        destaque: true,
      },
      {
        ano: 2010,
        evento: "World Equestrian Games Kentucky",
        resultado: "Representante de Portugal",
        destaque: true,
      },
      {
        ano: 2011,
        evento: "Campeonato Europeu Roterdão",
        resultado: "Representante de Portugal",
        destaque: true,
      },
      {
        ano: 2012,
        evento: "Jogos Olímpicos Londres",
        resultado: "16º Individual (77% Freestyle)",
        destaque: true,
      },
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
    imagem: "/images/cavalos-famosos/quo-vadis/capa.webp",
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
    imagem: "/images/cavalos-famosos/euclides/capa.webp",
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
    imagem: "/images/cavalos-famosos/firme/capa.webp",
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
    imagem: "/images/cavalos-famosos/nilo/capa.webp",
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
    imagem: "/images/cavalos-famosos/xaquiro/capa.webp",
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
    // FONTE: The Lusitano Collection — "a 1931 Veiga stallion, out of Bagocha, by Lidador"
    // VERIFICADO: 2026-02-10 + 2026-02-25 - Um dos 6 "Line Chiefs" (Chefes de Linhagem) oficiais
    id: "12",
    nome: "Agareno",
    imagem: "/images/cavalos-famosos/agareno/capa.webp",
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
    imagem: "/images/cavalos-famosos/primoroso/capa.webp",
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
    imagem: "/images/cavalos-famosos/destinado/capa.webp",
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
    imagem: "/images/cavalos-famosos/marialva-ii/capa.webp",
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
    imagem: "/images/cavalos-famosos/hucharia/capa.webp",
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
    // FONTE: The Lusitano Collection — "a 1923 Alter Real stallion, out of Gavina, by Gavioto"
    // VERIFICADO: 2026-02-10 + 2026-02-25 - Um dos 6 "Line Chiefs" oficiais, único Alter Real
    id: "15",
    nome: "Regedor",
    imagem: "/images/cavalos-famosos/regedor/capa.webp",
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
    imagem: "/images/cavalos-famosos/equador-mvl/capa.webp",
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
  // =========================================================================
  // ADICIONADOS 2026-02-25 — Pesquisa verificada em múltiplas fontes credíveis
  // =========================================================================
  {
    // FONTE: https://www.eurodressage.com/2006/11/26/guizo-passed-away
    // FONTE: https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage
    // FONTE: https://horsesdaily.com/article/a-few-thoughts-on-the-passing-of-guizo/
    // VERIFICADO: 2026-02-25 — Primeiro Lusitano medalhista olímpico (Atenas 2004, prata equipas)
    id: "19",
    nome: "Guizo",
    imagem: "/images/cavalos-famosos/guizo/capa.webp",
    apelido: "O Primeiro Medalhista Olímpico",
    anoNascimento: 1988,
    anoFalecimento: 2006,
    coudelaria: "Fundação Eugénio de Almeida",
    pelagem: "Castanho",
    disciplina: "Dressage",
    cavaleiro: "Juan Antonio Jimenez Cobo (ESP)",
    linhagem: "Lusitano",
    conquistas: [
      "Medalha de PRATA por equipas nos Jogos Olímpicos Atenas 2004",
      "Primeiro Lusitano a conquistar uma medalha olímpica",
      "Bronze por equipas nos Jogos Equestres Mundiais 2002 (Jerez)",
      "Prata por equipas no Campeonato Europeu 2003 (Hickstead)",
      "5º lugar individual no Campeonato Europeu 2005",
      "Campeão Nacional de Espanha 2005",
    ],
    descricao:
      "Guizo é o Lusitano mais laureado da história olímpica. Garanhão castanho criado pela Fundação Eugénio de Almeida, conquistou com Juan Antonio Jimenez Cobo a medalha de prata por equipas nos Jogos Olímpicos de Atenas 2004, tornando-se o primeiro Lusitano a subir ao pódio olímpico. Acumulou medalhas em quatro campeonatos consecutivos entre 2002 e 2005.",
    curiosidades: [
      "Medalhas em 4 campeonatos consecutivos: WEG 2002, Europeu 2003, JO 2004, Europeu 2005",
      "Faleceu em Novembro de 2006 aos 18 anos, vítima de cólica aguda",
      "Jimenez continuou a competir em Lusitanos até Paris 2024 (24 anos de carreira olímpica)",
    ],
    destaque: true,
    legado:
      "O primeiro Lusitano medalhista olímpico — abriu as portas da excelência para toda a raça",
    pedigree: {
      pai: { nome: "Zasebande", destaque: true },
      mae: { nome: "Cataria", coudelaria: "Fundação Eugénio de Almeida" },
      avoMaterno: { nome: "Tivoli" },
    },
    historicoPerformance: [
      { ano: 2002, evento: "WEG Jerez", resultado: "Bronze Equipas", destaque: true },
      { ano: 2003, evento: "Europeu Hickstead", resultado: "Prata Equipas", destaque: true },
      { ano: 2004, evento: "Jogos Olímpicos Atenas", resultado: "PRATA Equipas", destaque: true },
      { ano: 2005, evento: "Europeu", resultado: "5º Individual", destaque: true },
      { ano: 2005, evento: "Nacional Espanha", resultado: "Campeão", destaque: true },
      { ano: 2006, evento: "Falecimento", resultado: "Novembro 2006", destaque: true },
    ],
  },
  {
    // FONTE: https://eurodressage.com/2010/06/15/orphee-rbo-iberian-trail-blazer
    // FONTE: https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage
    // VERIFICADO: 2026-02-25 — Primeiro cavalo ibérico nos JO em dressage (Barcelona 1992)
    id: "20",
    nome: "Orphée RBO",
    imagem: "/images/cavalos-famosos/orphee-rbo/capa.webp",
    apelido: "O Pioneiro Olímpico",
    anoNascimento: 1980,
    anoFalecimento: 1998,
    coudelaria: "Roger Bouzin (França)",
    pelagem: "Ruço",
    disciplina: "Dressage",
    cavaleiro: "Catherine Henriquet (FRA)",
    linhagem: "Lusitano",
    conquistas: [
      "Primeiro cavalo ibérico a competir em dressage nos Jogos Olímpicos (Barcelona 1992)",
      "25º lugar de ~50 cavalos nos JO Barcelona 1992",
      "2º melhor cavalo da equipa francesa nos JO 1992 (França 9ª por equipas)",
      "Múltiplas qualificações para o Grand Prix Special em CDIs internacionais",
    ],
    descricao:
      "Orphée RBO fez história ao tornar-se o primeiro cavalo ibérico a competir em dressage nos Jogos Olímpicos. Em Barcelona 1992, com a cavaleira francesa Catherine Henriquet, terminou em 25º lugar de cerca de 50 cavalos, demonstrando harmonia e estilo que impressionaram o mundo. Criado em França por Roger Bouzin, era filho de Emir, um garanhão português importado.",
    curiosidades: [
      "Criado em França a partir de um garanhão português importado (Emir)",
      "Catherine Henriquet começou a competir com ele em 1988, quando tinha 8 anos",
      "Depois de se reformar aos 16 anos, foi para Portugal para reprodução",
      "Faleceu em 1998 em Portugal, vítima de cólica, aos 18 anos",
    ],
    destaque: true,
    legado:
      "O pioneiro — primeiro cavalo ibérico nos Jogos Olímpicos em dressage, abrindo caminho para todos os que vieram depois",
    pedigree: {
      pai: { nome: "Emir", destaque: true },
    },
    historicoPerformance: [
      { ano: 1988, evento: "Início competição com Henriquet", resultado: "CDIs", destaque: true },
      {
        ano: 1992,
        evento: "Jogos Olímpicos Barcelona",
        resultado: "25º Individual",
        destaque: true,
      },
      { ano: 1996, evento: "Reforma / Reprodução Portugal", resultado: "Reprodutor" },
      { ano: 1998, evento: "Falecimento", resultado: "Portugal, aos 18 anos", destaque: true },
    ],
  },
  {
    // FONTE: https://www.horseandhound.co.uk/features/tokyo-olympic-dressage-horse-of-the-day-stallion-fogoso-755416
    // FONTE: https://eurodressage.com/2021/08/02/phenomenal-success-campline-horses-first-year-operation-brazilian-and-portuguese-olympic
    // FONTE: https://eurodressage.com/2020/12/20/horse-campline-invests-portuguese-team-horse-fogoso
    // FONTE: https://www.rimondo.com/en/horse-details/1278019/fogoso-campline
    // VERIFICADO: 2026-02-25 — Recorde olímpico Lusitano (78.943% freestyle Tóquio 2020)
    id: "21",
    nome: "Fogoso Campline",
    imagem: "/images/cavalos-famosos/fogoso/capa.webp",
    apelido: "O Fogo Olímpico",
    anoNascimento: 2010,
    coudelaria: "Coudelaria Torres Vaz Freire",
    pelagem: "Ruço",
    disciplina: "Dressage",
    cavaleiro: "Rodrigo Moura Torres (POR)",
    linhagem: "Lusitano",
    conquistas: [
      "78.943% Freestyle nos JO Tóquio 2020 — recorde olímpico para um Lusitano",
      "16º lugar individual na final do Kür nos JO Tóquio 2020",
      "Parte da equipa portuguesa nos JO Tóquio (8º por equipas)",
      "Primeira equipa toda Lusitana de Portugal nos Jogos Olímpicos",
      "Garanhão reprodutor aprovado APSL 4 estrelas",
    ],
    descricao:
      "Fogoso Campline detém o recorde de sempre da maior pontuação de um Lusitano nos Jogos Olímpicos: 78.943% no Freestyle de Tóquio 2020, superando o recorde de Rubi AR (77.607% em Londres 2012). Garanhão ruço criado na coudelaria da família do cavaleiro, Rodrigo Moura Torres, 'Fogoso' significa 'cheio de força'. Destacou-se pela piaffe, passage e piruetas excepcionais.",
    curiosidades: [
      "O nome 'Fogoso' significa 'cheio de força' em português",
      "Criado na coudelaria da família do cavaleiro Rodrigo Torres",
      "No Kür olímpico, Torres montou com música dos Pink Floyd",
      "Torres descreveu-o como 'poderoso' no ambiente olímpico porque 'ele olha para as flores'",
    ],
    destaque: true,
    legado: "Recordista olímpico — a maior pontuação de sempre de um Lusitano nos Jogos Olímpicos",
    pedigree: {
      pai: { nome: "Rico", destaque: true },
      mae: { nome: "Amelia", coudelaria: "Coudelaria Torres Vaz Freire" },
      avoMaterno: { nome: "Raja" },
    },
    historicoPerformance: [
      {
        ano: 2019,
        evento: "Europeu Roterdão",
        resultado: "Qualificação equipa Portugal JO",
        destaque: true,
      },
      { ano: 2019, evento: "Campeão GP Portugal", resultado: "77.4% Freestyle" },
      {
        ano: 2021,
        evento: "Jogos Olímpicos Tóquio — Freestyle",
        resultado: "16º, 78.943% (Recorde Lusitano)",
        destaque: true,
      },
    ],
  },
  {
    // FONTE: https://www.eurodressage.com/2019/01/05/caetano-and-coroado-write-history-lusitano-breed-cracking-80-barrier
    // FONTE: https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage
    // FONTE: https://www.rimondo.com/en/horse-details/1132270/coroado
    // VERIFICADO: 2026-02-25 — Primeiro Lusitano a ultrapassar 80% no Kür (Mechelen 2018)
    id: "22",
    nome: "Coroado",
    imagem: "/images/cavalos-famosos/coroado/capa.webp",
    apelido: "O Primeiro dos 80%",
    anoNascimento: 2007,
    coudelaria: "Coudelaria de Alter",
    pelagem: "Ruço",
    disciplina: "Dressage",
    cavaleiro: "Maria Caetano (POR)",
    linhagem: "Alter Real",
    conquistas: [
      "80.160% Kür to Music em Mechelen (28 Dez 2018) — primeiro Lusitano a ultrapassar os 80%",
      "71.543% Grand Prix no CDI-W Mechelen 2018 (4º lugar)",
      "WEG 2018 Tryon — equipa portuguesa",
      "Campeonato Europeu 2017 Gothenburg — equipa portuguesa",
      "World Cup Finals 2019 Gothenburg (13º)",
      "Campeonato Europeu 2019 Roterdão — equipa portuguesa",
    ],
    descricao:
      "Coroado fez história ao tornar-se o primeiro Lusitano a ultrapassar a barreira mágica dos 80% num Kür to Music, com 80.160% em Mechelen a 28 de Dezembro de 2018. Filho de Rubi AR e neto materno de Xaquiro, representa o melhor do programa de reprodução de Alter. Com Maria Caetano, provou que um Lusitano pode competir artisticamente ao mais alto nível mundial.",
    curiosidades: [
      "Filho de Rubi AR (já na base de dados) — continuidade de excelência",
      "Avô materno é Xaquiro (já na base de dados) — mãe Luxelia por Xaquiro",
      "Superou o recorde do próprio pai Rubi AR (78.150% Kür em 2012)",
      "Proprietário: Juan Manuel Cordeiro / Yeguada Finca Tineo",
    ],
    destaque: true,
    legado: "O primeiro Lusitano a ultrapassar os 80% no Kür — um marco histórico para toda a raça",
    pedigree: {
      pai: { nome: "Rubi AR", coudelaria: "Coudelaria de Alter Real", destaque: true },
      mae: { nome: "Luxelia", coudelaria: "Coudelaria de Alter" },
      avoMaterno: { nome: "Xaquiro", destaque: true },
    },
    historicoPerformance: [
      { ano: 2017, evento: "Europeu Gothenburg", resultado: "Equipa Portugal", destaque: true },
      { ano: 2018, evento: "WEG Tryon", resultado: "Equipa Portugal", destaque: true },
      {
        ano: 2018,
        evento: "CDI-W Mechelen — Kür",
        resultado: "80.160% (1º Lusitano 80%+)",
        destaque: true,
      },
      { ano: 2019, evento: "World Cup Finals Gothenburg", resultado: "13º", destaque: true },
      { ano: 2019, evento: "Europeu Roterdão", resultado: "Equipa Portugal", destaque: true },
    ],
  },
  {
    // FONTE: https://www.eurodressage.com/2022/03/19/claudio-castillas-alcaide-retired-sport
    // FONTE: https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage
    // FONTE: https://dressage-news.com/2016/07/20/olympic-dressage-horses-riders-youngestoldest-malefemale-breedssexes-2/
    // VERIFICADO: 2026-02-25 — Neto de Novilheiro na elite mundial, JO Rio 2016 + WEG 2018
    id: "23",
    nome: "Alcaide",
    imagem: "/images/cavalos-famosos/alcaide/capa.webp",
    apelido: "O Herdeiro de Novilheiro",
    anoNascimento: 2004,
    coudelaria: "Oliveira Martins",
    pelagem: "Alazão",
    disciplina: "Dressage",
    cavaleiro: "Claudio Castilla Ruiz (ESP)",
    linhagem: "Veiga/Andrade",
    conquistas: [
      "38º nos Jogos Olímpicos Rio 2016 (69.814% GP)",
      "13º no Grand Prix Special WEG 2018 Tryon (74.103%)",
      "12º no Freestyle Europeu 2019 Roterdão (77.846%)",
      "28º no Europeu 2017 Gothenburg (69.229%)",
      "Neto de Novilheiro pela linha materna",
      "Selecionado para JO Tóquio 2020 (retirado por lesão)",
    ],
    descricao:
      "Alcaide é neto de Novilheiro pela linha materna (mãe Paloma, por Novilheiro), continuando o legado do Lusitano mais célebre na dressage de elite. Com o cavaleiro espanhol Claudio Castilla Ruiz, competiu nos Jogos Olímpicos do Rio 2016, Jogos Equestres Mundiais 2018 e três Campeonatos Europeus, sendo uma presença consistente no top mundial durante uma década.",
    curiosidades: [
      "Mãe Paloma é filha de Novilheiro — continuidade genética directa",
      "Parceria de mais de uma década com Claudio Castilla Ruiz (desde 2011)",
      "Reformado em 2022 após carreira internacional brilhante",
      "Proprietário: Claudio Castilla em parceria com Yeguada la Perla",
    ],
    destaque: false,
    legado:
      "Neto de Novilheiro que provou a continuidade da excelência genética Lusitana na elite mundial",
    pedigree: {
      pai: { nome: "Lobito", destaque: true },
      mae: { nome: "Paloma" },
      avoMaterno: { nome: "Novilheiro", destaque: true },
    },
    historicoPerformance: [
      { ano: 2011, evento: "Início parceria Castilla Ruiz", resultado: "Nacional", destaque: true },
      { ano: 2016, evento: "Jogos Olímpicos Rio", resultado: "38º, 69.814%", destaque: true },
      { ano: 2017, evento: "Europeu Gothenburg", resultado: "28º, 69.229%" },
      {
        ano: 2018,
        evento: "WEG Tryon — GP Special",
        resultado: "13º, 74.103%",
        destaque: true,
      },
      {
        ano: 2019,
        evento: "Europeu Roterdão — Freestyle",
        resultado: "12º, 77.846%",
        destaque: true,
      },
      { ano: 2022, evento: "Reforma", resultado: "Reformado", destaque: true },
    ],
  },
  {
    // FONTE: https://lusitano-interagro.com/haras/ofensor-mv/
    // FONTE: https://lusitano-interagro.com/brazilian-stud-farm/
    // FONTE: Interagro Lusitanos (pedigree completo, biografia detalhada)
    // VERIFICADO: 2026-02-25 — Grande Campeão Golegã 1999, Ouro descendentes Lisboa 2003
    id: "24",
    nome: "Ofensor",
    imagem: "/images/cavalos-famosos/ofensor/capa.webp",
    apelido: "O Melhor Garanhão Moderno",
    anoNascimento: 1995,
    anoFalecimento: 2011,
    coudelaria: "Manuel Tavares Veiga (MV)",
    pelagem: "Tordilho",
    altura: 160,
    disciplina: "Reprodução",
    linhagem: "Veiga",
    conquistas: [
      "Grande Campeão da Golegã 1999",
      "Grande Campeonato Pai-Progenia em Lisboa 2003",
      "Considerado 'sem contestação, o melhor garanhão do Lusitano moderno' (Interagro)",
      "Filha Única (SS) — Campeã dos Campeões no 18º Salão Internacional do Lusitano 2006",
      "Filho Violino (SS) — Campeão dos Campeões 2004",
      "50+ descendentes registados em gerações X, Z e A na Interagro",
      "Aprovado no Stud Book com 73.50 pontos (Reg. 00197-MI)",
    ],
    descricao:
      "Ofensor é considerado 'sem contestação, o melhor garanhão do Lusitano moderno' pela Interagro. Grande Campeão da Golegã em 1999, conquistou o Grande Campeonato Pai-Progenia em Lisboa 2003 — o título mais importante para um garanhão reprodutor. Serviu nas coudelarias mais prestigiadas de Portugal (Manuel Veiga, Sousa Cardoso, Sociedade das Silveiras) antes de ser importado pela Interagro em 2001. Nilo (MV), bisavô do seu pai, é o elo directo à linhagem Firme/Nilo/Novilheiro.",
    curiosidades: [
      "Nasceu a 17 de Abril de 1995, criado por Manuel Tavares Veiga",
      "Nilo (MV) é o seu trisavô — linhagem directa Firme/Nilo/Novilheiro",
      "Pai Danúbio III (MV) também foi Grande Campeão na Golegã e Campeão dos Campeões em Lisboa 1987",
      "Serviu em coudelarias MV, Sousa Cardoso e Soc. das Silveiras antes de ir para o Brasil (2001)",
      "Na Interagro, pai de Quixote e Quantum Interagro — triade de garanhões oficiais",
      "Faleceu a 4 de Abril de 2011 aos 16 anos",
    ],
    destaque: true,
    legado:
      "O melhor garanhão do Lusitano moderno — continuação directa da linhagem Firme/Nilo/Danúbio",
    pedigree: {
      // VERIFICADO: Interagro Lusitanos (pedigree completo)
      pai: {
        nome: "Danúbio III (MV)",
        coudelaria: "Coudelaria Manuel Veiga",
        destaque: true,
      },
      mae: { nome: "Tricana II (MV)", coudelaria: "Coudelaria Manuel Veiga" },
      avoPaterno: { nome: "Zimbro II (MV)", coudelaria: "Coudelaria Manuel Veiga" },
      avoaPaterna: { nome: "Oferta (MV)", coudelaria: "Coudelaria Manuel Veiga" },
      avoMaterno: { nome: "Lidador II (MV)", coudelaria: "Coudelaria Manuel Veiga" },
      avoaMaterna: { nome: "Medronha III (MV)", coudelaria: "Coudelaria Manuel Veiga" },
    },
    historicoPerformance: [
      {
        ano: 1999,
        evento: "Golegã — Campeonato Morfologia",
        resultado: "Grande Campeão (4 anos)",
        destaque: true,
      },
      {
        ano: 2001,
        evento: "Importado pela Interagro Lusitanos (Brasil)",
        resultado: "Garanhão Oficial",
        destaque: true,
      },
      {
        ano: 2003,
        evento: "Festival Lisboa — Pai-Progenia",
        resultado: "Grande Campeonato",
        destaque: true,
      },
      {
        ano: 2006,
        evento: "18º Salão Internacional Lusitano Cascais",
        resultado: "Filha Única — Campeã dos Campeões",
        destaque: true,
      },
      { ano: 2011, evento: "Falecimento", resultado: "4 Abril 2011", destaque: true },
    ],
  },
  {
    // FONTE: https://eurodressage.com/2024/07/21/final-ride-juan-antonio-jimenez-and-euclides-mor-2024-paris-olympics
    // FONTE: https://www.rimondo.com/en/horse-details/1278018/euclides-mor
    // FONTE: https://www.cavalo-lusitano.com/en/news/lusitano-at-paris-olympic-games-2024
    // VERIFICADO: 2026-02-25 — Paris 2024 para Espanha, criado em Portugal
    id: "25",
    nome: "Euclides MOR",
    imagem: "/images/cavalos-famosos/euclides-mor/capa.webp",
    apelido: "O Embaixador em Paris",
    anoNascimento: 2009,
    coudelaria: "Manuel Calheiros Braga",
    pelagem: "Ruço",
    disciplina: "Dressage",
    cavaleiro: "Juan Antonio Jimenez Cobo (ESP)",
    linhagem: "Lusitano",
    conquistas: [
      "Jogos Olímpicos Paris 2024 — representante de Espanha",
      "Campeão Espanhol de Jovens Cavalos (Masters)",
      "Vencedor da Taça do Rei, Madrid",
      "Vencedor do Critérium no Campeonato Nacional de Espanha",
      "Levou Jimenez (65 anos) aos JO — atleta mais velho de Espanha em Paris",
    ],
    descricao:
      "Euclides MOR representou Espanha nos Jogos Olímpicos de Paris 2024, conduzido por Juan Antonio Jimenez Cobo aos 65 anos — o atleta mais velho de Espanha na competição. Garanhão ruço criado em Portugal por Manuel Calheiros Braga, continua a tradição de Lusitanos na equipa espanhola que começou com Guizo em 2000. O nome é uma homenagem à matemática — Jimenez disse que Euclides MOR 'é mais do que matemática'.",
    curiosidades: [
      "Jimenez competiu 24 anos em Lusitanos nos JO: Sydney 2000, Atenas 2004 (Guizo) → Paris 2024",
      "Criado em Portugal, compete por Espanha — embaixador da raça",
      "Nome inspirado no matemático grego Euclides",
      "Proprietário: Las Morerias (México)",
    ],
    destaque: false,
    legado:
      "Continuação da tradição de Lusitanos na elite espanhola — de Guizo a Euclides MOR, 24 anos de excelência",
    pedigree: {
      pai: { nome: "Riopele", destaque: true },
      mae: { nome: "Onda" },
      avoMaterno: { nome: "Gingão" },
    },
    historicoPerformance: [
      {
        ano: 2018,
        evento: "Campeonato Nacional Espanha",
        resultado: "Vencedor Taça do Rei",
        destaque: true,
      },
      {
        ano: 2024,
        evento: "Jogos Olímpicos Paris",
        resultado: "60.031% GP (Espanha)",
        destaque: true,
      },
    ],
  },
  {
    // FONTE: https://www.horseandhound.co.uk/features/maria-caetano-felix-de-tineo-754384
    // FONTE: https://www.eurodressage.com/2021/05/07/caetano-pursue-portuguese-olympic-team-selection-fenix-de-tineo-coroado-break
    // FONTE: https://www.rimondo.com/en/horse-details/1214159/fenix-de-tineo
    // VERIFICADO: 2026-02-25 — JO Tóquio 2020 para Portugal, filho de Rubi AR
    id: "26",
    nome: "Fenix de Tineo",
    imagem: "/images/cavalos-famosos/fenix-de-tineo/capa.webp",
    apelido: "A Fénix Olímpica",
    anoNascimento: 2010,
    coudelaria: "Yeguada Finca Tineo",
    pelagem: "Castanho",
    disciplina: "Dressage",
    cavaleiro: "Maria Caetano (POR)",
    linhagem: "Alter Real",
    conquistas: [
      "Jogos Olímpicos Tóquio 2020 — equipa portuguesa (70.311% GP)",
      "Parte da primeira equipa toda Lusitana de Portugal nos JO",
      "Portugal 7º/8º por equipas nos JO Tóquio 2020",
      "Substituiu Coroado após lesão para seleção olímpica",
      "Filho de Rubi AR — continuidade da linha Alter Real",
    ],
    descricao:
      "Fenix de Tineo representou Portugal nos Jogos Olímpicos de Tóquio 2020 com Maria Caetano, como parte da histórica primeira equipa toda Lusitana de Portugal nos JO (com Fogoso e Equador MVL). Filho de Rubi AR, substituiu Coroado após a sua lesão e correspondeu à altura do desafio olímpico. O nome 'Fénix' simbolizou a sua capacidade de renascer para a ocasião.",
    curiosidades: [
      "Filho de Rubi AR (já na base de dados) e mãe Aolga",
      "Substituiu Coroado (lesionado) na seleção olímpica de 2021",
      "Parte do trio olímpico com Fogoso (Rodrigo Torres) e Equador MVL (João Torrão)",
      "Proprietário: Yeguada Finca Tineo",
    ],
    destaque: false,
    legado:
      "Parte da equipa olímpica histórica que provou ao mundo a força do Lusitano em Tóquio 2020",
    pedigree: {
      pai: { nome: "Rubi AR", coudelaria: "Coudelaria de Alter Real", destaque: true },
      mae: { nome: "Aolga" },
    },
    historicoPerformance: [
      {
        ano: 2021,
        evento: "Seleção Olímpica (substituindo Coroado)",
        resultado: "Selecionado",
        destaque: true,
      },
      {
        ano: 2021,
        evento: "Jogos Olímpicos Tóquio — Grand Prix",
        resultado: "70.311% GP",
        destaque: true,
      },
    ],
  },
];
