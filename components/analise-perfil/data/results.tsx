import { Trophy, Shield, Crown, Heart } from "lucide-react";
import { Result } from "../types";

export const results: Record<string, Result> = {
  competidor: {
    profile: "competidor",
    title: "Competidor de Elite",
    subtitle: "Foco em Alta Performance",
    description:
      "O seu perfil indica um cavaleiro orientado para resultados, com ambicao de competir ao mais alto nivel. Procura um cavalo atleta, com movimentos expressivos, presenca em pista, e capacidade de brilhar sob pressao.",
    characteristics: [
      "Movimentos expressivos e elasticos",
      "Sangue competitivo e presenca",
      "Alta trainabilidade",
      "Capacidade para Grand Prix",
      "Genetica de performance comprovada",
      "Conformacao atletica",
    ],
    idealHorse: {
      age: "6-12 anos (feito) ou 3-5 anos (projecto)",
      height: "1.62m - 1.72m",
      training: "Nivel S/GP ou potencial comprovado",
      temperament: "Sensivel, reactivo, com brio controlado",
      priceRange: "45.000 - 250.000+ euros",
    },
    annualCosts: {
      min: 20000,
      max: 50000,
      includes: [
        "Pensao em centro de alta competicao",
        "Treinador de nivel internacional",
        "Veterinario desportivo regular",
        "Ferracao especializada",
        "Inscricoes em provas CDI/CDN",
        "Transporte para competicoes",
        "Seguro de valor elevado",
        "Suplementacao premium",
      ],
    },
    recommendedRegions: ["Ribatejo", "Alentejo", "Internacional"],
    linhagens: [
      { name: "Veiga", reason: "Reconhecida pelos movimentos expressivos e elegancia" },
      { name: "Alter Real", reason: "Tradicao real, seleccao para funcionalidade de elite" },
      { name: "Coudelaria Nacional", reason: "Genetica testada em competicao internacional" },
    ],
    disciplinas: [
      "Dressage FEI",
      "Grand Prix",
      "Grand Prix Special",
      "Freestyle/Kur",
      "CDI Internacional",
    ],
    famousHorses: [
      { name: "Rubi AR", achievement: "Jogos Olimpicos Londres 2012 com Goncalo Carvalho" },
      { name: "Oxidado", achievement: "Campeonatos da Europa com Daniel Pinto" },
      { name: "Fogoso", achievement: "Lenda do Dressage Portugues" },
      { name: "Euclides MOR", achievement: "Top mundial com Rodrigo Torres" },
    ],
    tips: [
      "Invista num exame veterinario completo com RX",
      "Veja o cavalo trabalhar varias vezes",
      "Considere o custo total anual",
      "Procure referencias da coudelaria",
      "Avalie o potencial de evolucao",
      "Considere um periodo de experiencia",
    ],
    nextSteps: [
      "Consultar coudelarias especializadas em competicao",
      "Contactar cavaleiros profissionais",
      "Visitar Golega na Feira Nacional do Cavalo",
      "Assistir a provas CDI",
      "Definir orcamento total",
    ],
    icon: <Trophy className="text-[#C5A059]" size={48} />,
    color: "from-amber-500/20",
    quotes: [
      {
        author: "Nuno Oliveira",
        role: "Mestre de Equitacao",
        quote:
          "A arte equestre e um dialogo silencioso entre cavalo e cavaleiro, onde a harmonia e o objectivo supremo.",
      },
      {
        author: "Rodrigo Torres",
        role: "Cavaleiro Olimpico",
        quote:
          "O Lusitano tem uma capacidade unica de se entregar ao trabalho com coracao e inteligencia.",
      },
      {
        author: "Miguel Ralao Duarte",
        role: "Cavaleiro Internacional",
        quote: "Na alta competicao, cada detalhe conta. O cavalo certo faz toda a diferenca.",
      },
    ],
    faq: [
      {
        question: "Quanto tempo leva a formar um cavalo de GP?",
        answer:
          "Um cavalo bem formado demora 6-8 anos desde o desbaste ate ao Grand Prix. Alguns talentos excepcionais podem chegar mais cedo, mas a paciencia e fundamental.",
      },
      {
        question: "Vale a pena comprar um cavalo jovem ou feito?",
        answer:
          "Depende da sua experiencia e objectivos. Um cavalo feito da resultados imediatos mas custa mais. Um jovem e um projecto com risco mas potencial de valorizacao.",
      },
      {
        question: "Qual a idade ideal para competir em CDI?",
        answer:
          "Cavalos entre 8-14 anos estao tipicamente no auge. Alguns mantem alto nivel ate aos 18 anos com gestao adequada.",
      },
      {
        question: "Preciso de treinador desde o inicio?",
        answer:
          "Absolutamente. Na alta competicao, o acompanhamento profissional e essencial para evoluir e corrigir problemas antes que se instalem.",
      },
      {
        question: "Quanto custa manter um cavalo de competicao?",
        answer:
          "Entre 20.000 e 50.000 euros anuais, incluindo pensao premium, treinador, veterinario desportivo, competicoes e transporte.",
      },
    ],
    timeline: [
      {
        month: "Mes 1-2",
        title: "Pesquisa e Definicao",
        description:
          "Definir orcamento total, visitar coudelarias, estabelecer criterios de seleccao e contactar profissionais.",
      },
      {
        month: "Mes 3-4",
        title: "Seleccao e Testes",
        description:
          "Experimentar cavalos pre-seleccionados, ver videos, solicitar historicos veterinarios e de competicao.",
      },
      {
        month: "Mes 5-6",
        title: "Decisao e Exames",
        description:
          "Escolher o cavalo, realizar exame veterinario completo, negociar e finalizar a compra.",
      },
      {
        month: "Mes 7-9",
        title: "Adaptacao",
        description:
          "Periodo de adaptacao ao novo ambiente, conhecer o cavalo, estabelecer rotinas com o treinador.",
      },
      {
        month: "Mes 10-12",
        title: "Inicio Competitivo",
        description:
          "Primeiras provas de nivel adequado, avaliar pontos fortes e areas a desenvolver.",
      },
    ],
  },
  tradicional: {
    profile: "tradicional",
    title: "Cavaleiro Tradicional",
    subtitle: "Tradicao e Versatilidade",
    description:
      "O seu perfil reflecte um profundo apreco pela tradicao equestre portuguesa. Valoriza a versatilidade, a robustez e o temperamento equilibrado tipico do Lusitano de trabalho.",
    characteristics: [
      "Versatilidade funcional",
      "Temperamento equilibrado e fiavel",
      "Robustez e resistencia",
      "Bom manuseamento no campo",
      "Aptidao para trabalho de gado",
      "Caracter cooperativo",
    ],
    idealHorse: {
      age: "5-12 anos (experiencia)",
      height: "1.58m - 1.65m",
      training: "Desbravado a trabalho medio",
      temperament: "Calmo, cooperativo, sensato",
      priceRange: "12.000 - 40.000 euros",
    },
    annualCosts: {
      min: 8000,
      max: 15000,
      includes: [
        "Pensao ou manutencao propria",
        "Veterinario regular",
        "Ferracao standard",
        "Instrutor ocasional",
        "Equipamento e manutencao",
        "Seguro basico",
        "Alimentacao de qualidade",
      ],
    },
    recommendedRegions: ["Ribatejo", "Alentejo", "Norte"],
    linhagens: [
      { name: "Andrade", reason: "Conhecida pela funcionalidade e robustez" },
      { name: "Infante da Camara", reason: "Tradicao de trabalho de campo" },
      { name: "Coudelaria Nacional", reason: "Seleccao para versatilidade" },
    ],
    disciplinas: [
      "Equitacao de Trabalho",
      "Passeio de campo",
      "Tenta",
      "Ensino classico",
      "Turismo equestre",
    ],
    famousHorses: [
      { name: "Novilheiro", achievement: "Lenda da versatilidade" },
      { name: "Opus 72", achievement: "Reprodutor influente" },
      { name: "Habil", achievement: "Campeao de Equitacao de Trabalho" },
      { name: "Invasor", achievement: "Referencia do Lusitano tradicional" },
    ],
    tips: [
      "Prefira cavalos com experiencia em campo",
      "Teste em situacoes reais de trabalho",
      "Verifique o historico de saude",
      "A idade nao e problema",
      "Considere coudelarias tradicionais",
      "Um bom caracter vale muito",
    ],
    nextSteps: [
      "Visitar coudelarias do Ribatejo e Alentejo",
      "Assistir a provas de Equitacao de Trabalho",
      "Contactar associacoes de criadores",
      "Participar em jornadas de campo",
      "Falar com campinos e cavaleiros de tradicao",
    ],
    icon: <Shield className="text-[#C5A059]" size={48} />,
    color: "from-emerald-500/20",
    quotes: [
      {
        author: "Mestre Joao Oliveira",
        role: "Campino do Ribatejo",
        quote:
          "O verdadeiro Lusitano e aquele que trabalha connosco no campo, que entende o gado e responde a mao do cavaleiro.",
      },
      {
        author: "Antonio Borba Monteiro",
        role: "Cavaleiro Tauromaquico",
        quote: "Na arena, o cavalo e uma extensao do nosso corpo. A confianca mutua e tudo.",
      },
      {
        author: "Dr. Guilherme Borba",
        role: "Criador Tradicional",
        quote:
          "Preservar a tradicao e honrar geracoes de criadores que nos legaram esta raca extraordinaria.",
      },
    ],
    faq: [
      {
        question: "O Lusitano de trabalho e diferente do de desporto?",
        answer:
          "Historicamente sim, mas hoje muitos cavalos sao versateis. O de trabalho tende a ser mais compacto, robusto e com temperamento mais frio.",
      },
      {
        question: "Posso usar um cavalo tradicional em provas?",
        answer:
          "Sim, existem provas de Equitacao de Trabalho muito competitivas. E uma disciplina em crescimento que valoriza a versatilidade.",
      },
      {
        question: "Que idade e ideal para um cavalo de trabalho?",
        answer:
          "Entre 6-12 anos, com experiencia de campo. Cavalos mais velhos sao excelentes se bem mantidos - a experiencia e muito valiosa.",
      },
      {
        question: "Preciso de instalacoes especiais?",
        answer:
          "Idealmente paddock ou pasto, mas muitos cavalos tradicionais adaptam-se bem a pensao. O importante e exercicio regular e contacto com o exterior.",
      },
      {
        question: "Como encontrar um bom cavalo de trabalho?",
        answer:
          "Atraves de contactos no Ribatejo e Alentejo, feiras tradicionais, e referencias de campinos e cavaleiros de confianca.",
      },
    ],
    timeline: [
      {
        month: "Mes 1-2",
        title: "Imersao na Tradicao",
        description:
          "Visitar coudelarias tradicionais, assistir a tentas e jornadas de campo, conhecer a cultura equestre.",
      },
      {
        month: "Mes 3-4",
        title: "Contactos e Pesquisa",
        description:
          "Estabelecer relacoes com criadores, campinos, e cavaleiros tradicionais. Ver cavalos em trabalho real.",
      },
      {
        month: "Mes 5-6",
        title: "Seleccao",
        description:
          "Experimentar cavalos no campo, testar em diferentes situacoes, verificar versatilidade e temperamento.",
      },
      {
        month: "Mes 7-8",
        title: "Aquisicao",
        description: "Exame veterinario, negociacao, e transporte para as suas instalacoes.",
      },
      {
        month: "Mes 9-12",
        title: "Integracao",
        description: "Conhecer o cavalo, participar em jornadas de campo, desenvolver a parceria.",
      },
    ],
  },
  criador: {
    profile: "criador",
    title: "Criador & Investidor Genetico",
    subtitle: "Preservacao e Melhoramento",
    description:
      "O seu perfil indica interesse serio na criacao e preservacao do Puro Sangue Lusitano. Valoriza a genetica, a morfologia tipica da raca, e o potencial reprodutivo.",
    characteristics: [
      "Morfologia tipica excelente",
      "Genetica comprovada (APSL)",
      "Linhagem pura e reconhecida",
      "Potencial reprodutivo verificado",
      "Conformacao para transmissao",
      "Merito funcional demonstrado",
    ],
    idealHorse: {
      age: "3-8 anos (reproducao activa)",
      height: "Minimo 1.60m (garanhoes)",
      training: "Funcionalidade demonstrada",
      temperament: "Equilibrado, bom caracter hereditario",
      priceRange: "25.000 - 150.000+ euros",
    },
    annualCosts: {
      min: 15000,
      max: 40000,
      includes: [
        "Manutencao em coudelaria",
        "Registos APSL",
        "Exames de reproducao",
        "Cobricoes ou IA",
        "Veterinario reprodutivo",
        "Testes geneticos",
        "Concursos de modelo",
        "Marketing dos produtos",
      ],
    },
    recommendedRegions: ["Alentejo", "Ribatejo", "Internacional"],
    linhagens: [
      { name: "Veiga", reason: "Linhagem historica com genetica excepcional" },
      { name: "Alter Real", reason: "Pureza e seleccao secular da Casa Real" },
      { name: "Andrade", reason: "Fundacional, transmite funcionalidade" },
    ],
    disciplinas: [
      "Reproducao selectiva",
      "Concursos de Modelo",
      "Apresentacoes de raca",
      "Dressage (prova de funcionalidade)",
    ],
    famousHorses: [
      { name: "Novilheiro", achievement: "Pai de nacao, influenciou geracoes" },
      { name: "Opus 72", achievement: "Reprodutor de merito excepcional" },
      { name: "Icaro", achievement: "Top reprodutor" },
      { name: "Quo Vadis", achievement: "Garanhao de elite" },
    ],
    tips: [
      "Analise o pedigree (3-4 geracoes)",
      "Solicite indices BLUP",
      "Verifique COI - ideal <6%",
      "Exija teste WFFS negativo",
      "Avalie descendencia",
      "Considere complementaridade",
      "Visite a coudelaria",
    ],
    nextSteps: [
      "Estudar catalogos APSL",
      "Visitar Coudelaria de Alter",
      "Contactar criadores de referencia",
      "Participar em concursos de modelo",
      "Definir objectivos de criacao",
    ],
    icon: <Crown className="text-[#C5A059]" size={48} />,
    color: "from-purple-500/20",
    quotes: [
      {
        author: "Dr. Arsenio Raposo Cordeiro",
        role: "Presidente APSL",
        quote:
          "Criar Lusitanos e contribuir para a preservacao de um patrimonio vivo da cultura portuguesa.",
      },
      {
        author: "Fernando Sommer d'Andrade",
        role: "Criador Historico",
        quote:
          "Cada potro que nasce e uma nova esperanca para a raca. A seleccao rigorosa e o nosso dever.",
      },
      {
        author: "Eng. Jose Luis Mira",
        role: "Geneticista Equino",
        quote:
          "Os indices BLUP revolucionaram a criacao, permitindo decisoes baseadas em dados objectivos.",
      },
    ],
    faq: [
      {
        question: "O que e o indice BLUP?",
        answer:
          "Best Linear Unbiased Prediction - uma ferramenta estatistica que estima o valor genetico de um cavalo com base na sua performance e dos seus parentes.",
      },
      {
        question: "Qual o COI ideal?",
        answer:
          "Coeficiente de Consanguinidade idealmente abaixo de 6%. Valores mais altos aumentam risco de problemas geneticos e perda de vigor.",
      },
      {
        question: "Preciso de registar os potros na APSL?",
        answer:
          "Sim, o registo e obrigatorio para cavalos PSL. Inclui microchip, resenho, e teste de ADN para confirmacao de paternidade.",
      },
      {
        question: "Quanto custa iniciar um programa de criacao?",
        answer:
          "Investimento inicial de 30.000-100.000 euros (eguas base), mais 15.000-40.000 euros anuais de manutencao por cavalo.",
      },
      {
        question: "Devo testar para WFFS?",
        answer:
          "Absolutamente. O Warmblood Fragile Foal Syndrome e fatal. Nunca cruzar dois portadores. O teste e obrigatorio para reprodutores responsaveis.",
      },
    ],
    timeline: [
      {
        month: "Mes 1-3",
        title: "Formacao e Pesquisa",
        description:
          "Estudar genetica equina, indices BLUP, catalogos APSL, e visitar coudelarias de referencia.",
      },
      {
        month: "Mes 4-6",
        title: "Definir Programa",
        description:
          "Estabelecer objectivos de criacao, seleccionar linhagens de interesse, definir orcamento a 5 anos.",
      },
      {
        month: "Mes 7-9",
        title: "Aquisicao de Base",
        description:
          "Adquirir eguas fundadoras ou garanhao, garantir testes geneticos, registos APSL, e instalacoes adequadas.",
      },
      {
        month: "Mes 10-12",
        title: "Inicio do Programa",
        description:
          "Planear cobricoes, estabelecer parcerias com veterinarios reprodutivos, iniciar marketing.",
      },
      {
        month: "Ano 2+",
        title: "Consolidacao",
        description:
          "Primeiros nascimentos, participacao em concursos de modelo, construcao de reputacao no mercado.",
      },
    ],
  },
  amador: {
    profile: "amador",
    title: "Cavaleiro de Lazer",
    subtitle: "Paixao e Descoberta",
    description:
      "O seu perfil indica alguem que ama cavalos e procura um companheiro para desfrutar de momentos de lazer e crescimento pessoal. Valoriza a seguranca, o temperamento docil e a facilidade de manuseamento.",
    characteristics: [
      "Temperamento calmo e previsivel",
      "Facil de montar e manusear",
      "Seguro para menos experientes",
      "Perdoador de erros",
      "Amigavel e carinhoso",
      "Boa saude e manutencao facil",
    ],
    idealHorse: {
      age: "8-16 anos (maturidade)",
      height: "1.55m - 1.65m (confortavel)",
      training: "Basico a medio (bem confirmado)",
      temperament: "Muito calmo, docil, paciente",
      priceRange: "8.000 - 25.000 euros",
    },
    annualCosts: {
      min: 6000,
      max: 10000,
      includes: [
        "Pensao em centro hipico",
        "Veterinario basico",
        "Ferracao regular",
        "Aulas ocasionais",
        "Equipamento basico",
        "Seguro RC",
        "Alimentacao standard",
      ],
    },
    recommendedRegions: ["Lisboa", "Centro", "Norte", "Qualquer regiao acessivel"],
    linhagens: [
      { name: "Qualquer linhagem", reason: "Temperamento individual e mais importante" },
      { name: "Andrade", reason: "Tendencia para cavalos sensatos" },
      { name: "Cavalos de escola", reason: "Temperamentos excepcionais" },
    ],
    disciplinas: [
      "Passeio recreativo",
      "Escola basica",
      "Terapia equestre",
      "Lazer familiar",
      "Hipismo adaptado",
    ],
    famousHorses: [
      { name: "Cavalos de escola", achievement: "Formaram geracoes de cavaleiros" },
      { name: "Cavalos de terapia", achievement: "Ajudam pessoas especiais" },
      { name: "Companheiros de vida", achievement: "O valor esta na relacao" },
    ],
    tips: [
      "Procure cavalos mais velhos",
      "Experimente varias vezes",
      "Monte em diferentes situacoes",
      "Verifique facilidade de manuseamento",
      "Considere cavalos de escola",
      "Preco baixo nao e pior qualidade",
      "Peca opiniao ao instrutor",
    ],
    nextSteps: [
      "Falar com o seu instrutor",
      "Visitar centros hipicos",
      "Considerar cavalos de escola reformados",
      "Nao ter pressa",
      "Fazer varias visitas",
    ],
    icon: <Heart className="text-[#C5A059]" size={48} />,
    color: "from-rose-500/20",
    quotes: [
      {
        author: "Dra. Maria Helena Pires",
        role: "Psicologa Equestre",
        quote:
          "A relacao com o cavalo e terapeutica. Nao e preciso competir para experimentar a magia da equitacao.",
      },
      {
        author: "Instrutor Jose Carlos",
        role: "Professor de Equitacao",
        quote:
          "O melhor cavalo para um iniciante e aquele que perdoa erros e ensina com paciencia.",
      },
      {
        author: "Sofia Mendes",
        role: "Cavaleira Amadora",
        quote: "O meu Lusitano e o meu escape do stress. Cada passeio e uma sessao de terapia.",
      },
    ],
    faq: [
      {
        question: "Cavalos mais velhos sao bons para iniciantes?",
        answer:
          "Excelente escolha! Cavalos entre 10-16 anos sao tipicamente mais calmos, experientes, e perdoadores. A idade traz sabedoria.",
      },
      {
        question: "Posso ter um cavalo sem experiencia previa?",
        answer:
          "Sim, desde que tenha apoio de um instrutor e o cavalo seja adequado. Comece com aulas regulares e va ganhando autonomia gradualmente.",
      },
      {
        question: "Quanto tempo devo dedicar ao cavalo?",
        answer:
          "Minimo 2-3 visitas semanais e ideal. Cavalos em pensao sao cuidados diariamente, mas beneficiam do contacto regular consigo.",
      },
      {
        question: "Cavalos de escola reformados sao boa opcao?",
        answer:
          "Frequentemente sao otimos! Estao habituados a diferentes cavaleiros, sao pacientes, e tem temperamentos de ouro. Preco tambem e mais acessivel.",
      },
      {
        question: "Preciso de equipamento proprio?",
        answer:
          "No inicio pode usar equipamento da escola. Gradualmente invista em capacete (obrigatorio), botas, e eventualmente sela propria se o cavalo for seu.",
      },
    ],
    timeline: [
      {
        month: "Mes 1-2",
        title: "Preparacao",
        description:
          "Continuar licoes, falar com instrutor sobre perfil ideal, visitar centros hipicos da zona.",
      },
      {
        month: "Mes 3-4",
        title: "Pesquisa Activa",
        description:
          "Ver cavalos disponiveis, experimentar diferentes temperamentos, definir orcamento realista.",
      },
      {
        month: "Mes 5-6",
        title: "Seleccao Cuidadosa",
        description:
          "Experimentar o cavalo varias vezes, em diferentes dias e situacoes. Pedir opiniao ao instrutor.",
      },
      {
        month: "Mes 7",
        title: "Decisao",
        description: "Exame veterinario basico, negociacao, preparar local de pensao.",
      },
      {
        month: "Mes 8-12",
        title: "Lua de Mel",
        description:
          "Conhecer o cavalo, estabelecer rotinas, desfrutar da nova parceria sem pressas.",
      },
    ],
  },
};
