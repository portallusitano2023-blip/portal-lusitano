import { Trophy, Shield, Crown, Heart } from "lucide-react";
import { Result } from "../types";

export const results: Record<string, Result> = {
  competidor: {
    profile: "competidor",
    title: "Competidor de Elite",
    subtitle: "Foco em Alta Performance",
    description:
      "O seu perfil indica um cavaleiro orientado para resultados, com ambição de competir ao mais alto nível. Procura um cavalo atleta, com movimentos expressivos, presença em pista, e capacidade de brilhar sob pressão.",
    characteristics: [
      "Movimentos expressivos e elásticos",
      "Sangue competitivo e presença",
      "Alta trainabilidade",
      "Capacidade para Grand Prix",
      "Genética de performance comprovada",
      "Conformação atlética",
    ],
    idealHorse: {
      age: "6-12 anos (feito) ou 3-5 anos (projecto)",
      height: "1.62m — 1.72m",
      training: "Nível S/GP ou potencial comprovado",
      temperament: "Sensível, reactivo, com brio controlado",
      priceRange: "45.000 — 250.000+ euros",
    },
    annualCosts: {
      min: 20000,
      max: 50000,
      includes: [
        "Pensão em centro de alta competição",
        "Treinador de nível internacional",
        "Veterinário desportivo regular",
        "Ferração especializada",
        "Inscrições em provas CDI/CDN",
        "Transporte para competições",
        "Seguro de valor elevado",
        "Suplementação premium",
      ],
    },
    recommendedRegions: ["Ribatejo", "Alentejo", "Internacional"],
    linhagens: [
      { name: "Veiga", reason: "Reconhecida pelos movimentos expressivos e elegância" },
      { name: "Alter Real", reason: "Tradição real, selecção para funcionalidade de elite" },
      { name: "Coudelaria Nacional", reason: "Genética testada em competição internacional" },
    ],
    disciplinas: [
      "Dressage FEI",
      "Grand Prix",
      "Grand Prix Special",
      "Freestyle/Kur",
      "CDI Internacional",
    ],
    famousHorses: [
      { name: "Rubi AR", achievement: "Jogos Olímpicos Londres 2012 com Gonçalo Carvalho" },
      { name: "Oxidado", achievement: "Campeonatos da Europa com Daniel Pinto" },
      { name: "Fogoso", achievement: "Lenda do Dressage Português" },
      { name: "Euclides MOR", achievement: "Top mundial com Rodrigo Torres" },
    ],
    tips: [
      "Invista num exame veterinário completo com RX",
      "Veja o cavalo trabalhar várias vezes",
      "Considere o custo total anual",
      "Procure referências da coudelaria",
      "Avalie o potencial de evolução",
      "Considere um período de experiência",
    ],
    nextSteps: [
      "Consultar coudelarias especializadas em competição",
      "Contactar cavaleiros profissionais",
      "Visitar Golegã na Feira Nacional do Cavalo",
      "Assistir a provas CDI",
      "Definir orçamento total",
    ],
    icon: <Trophy className="text-[#C5A059]" size={48} />,
    color: "from-amber-500/20",
    quotes: [
      {
        author: "Nuno Oliveira",
        role: "Mestre de Equitação",
        quote:
          "A arte equestre é um diálogo silencioso entre cavalo e cavaleiro, onde a harmonia é o objectivo supremo.",
      },
      {
        author: "Rodrigo Torres",
        role: "Cavaleiro Olímpico",
        quote:
          "O Lusitano tem uma capacidade única de se entregar ao trabalho com coração e inteligência.",
      },
      {
        author: "Miguel Ralão Duarte",
        role: "Cavaleiro Internacional",
        quote: "Na alta competição, cada detalhe conta. O cavalo certo faz toda a diferença.",
      },
    ],
    faq: [
      {
        question: "Quanto tempo leva a formar um cavalo de GP?",
        answer:
          "Um cavalo bem formado demora 6-8 anos desde o desbaste até ao Grand Prix. Alguns talentos excepcionais podem chegar mais cedo, mas a paciência é fundamental.",
      },
      {
        question: "Vale a pena comprar um cavalo jovem ou feito?",
        answer:
          "Depende da sua experiência e objectivos. Um cavalo feito dá resultados imediatos mas custa mais. Um jovem é um projecto com risco mas potencial de valorização.",
      },
      {
        question: "Qual a idade ideal para competir em CDI?",
        answer:
          "Cavalos entre 8-14 anos estão tipicamente no auge. Alguns mantêm alto nível até aos 18 anos com gestão adequada.",
      },
      {
        question: "Preciso de treinador desde o início?",
        answer:
          "Absolutamente. Na alta competição, o acompanhamento profissional é essencial para evoluir e corrigir problemas antes que se instalem.",
      },
      {
        question: "Quanto custa manter um cavalo de competição?",
        answer:
          "Entre 20.000 e 50.000 euros anuais, incluindo pensão premium, treinador, veterinário desportivo, competições e transporte.",
      },
    ],
    timeline: [
      {
        month: "Mês 1-2",
        title: "Pesquisa e Definição",
        description:
          "Definir orçamento total, visitar coudelarias, estabelecer critérios de selecção e contactar profissionais.",
      },
      {
        month: "Mês 3-4",
        title: "Selecção e Testes",
        description:
          "Experimentar cavalos pré-seleccionados, ver vídeos, solicitar históricos veterinários e de competição.",
      },
      {
        month: "Mês 5-6",
        title: "Decisão e Exames",
        description:
          "Escolher o cavalo, realizar exame veterinário completo, negociar e finalizar a compra.",
      },
      {
        month: "Mês 7-9",
        title: "Adaptação",
        description:
          "Período de adaptação ao novo ambiente, conhecer o cavalo, estabelecer rotinas com o treinador.",
      },
      {
        month: "Mês 10-12",
        title: "Início Competitivo",
        description:
          "Primeiras provas de nível adequado, avaliar pontos fortes e áreas a desenvolver.",
      },
    ],
  },
  tradicional: {
    profile: "tradicional",
    title: "Cavaleiro Tradicional",
    subtitle: "Tradição e Versatilidade",
    description:
      "O seu perfil reflecte um profundo apreço pela tradição equestre portuguesa. Valoriza a versatilidade, a robustez e o temperamento equilibrado típico do Lusitano de trabalho.",
    characteristics: [
      "Versatilidade funcional",
      "Temperamento equilibrado e fiável",
      "Robustez e resistência",
      "Bom manuseamento no campo",
      "Aptidão para trabalho de gado",
      "Carácter cooperativo",
    ],
    idealHorse: {
      age: "5-12 anos (experiência)",
      height: "1.58m — 1.65m",
      training: "Desbravado a trabalho médio",
      temperament: "Calmo, cooperativo, sensato",
      priceRange: "12.000 — 40.000 euros",
    },
    annualCosts: {
      min: 8000,
      max: 15000,
      includes: [
        "Pensão ou manutenção própria",
        "Veterinário regular",
        "Ferração standard",
        "Instrutor ocasional",
        "Equipamento e manutenção",
        "Seguro básico",
        "Alimentação de qualidade",
      ],
    },
    recommendedRegions: ["Ribatejo", "Alentejo", "Norte"],
    linhagens: [
      { name: "Andrade", reason: "Conhecida pela funcionalidade e robustez" },
      { name: "Infante da Câmara", reason: "Tradição de trabalho de campo" },
      { name: "Coudelaria Nacional", reason: "Selecção para versatilidade" },
    ],
    disciplinas: [
      "Equitação de Trabalho",
      "Passeio de campo",
      "Tenta",
      "Ensino clássico",
      "Turismo equestre",
    ],
    famousHorses: [
      { name: "Novilheiro", achievement: "Lenda da versatilidade" },
      { name: "Opus 72", achievement: "Reprodutor influente" },
      { name: "Hábil", achievement: "Campeão de Equitação de Trabalho" },
      { name: "Invasor", achievement: "Referência do Lusitano tradicional" },
    ],
    tips: [
      "Prefira cavalos com experiência em campo",
      "Teste em situações reais de trabalho",
      "Verifique o histórico de saúde",
      "A idade não é problema",
      "Considere coudelarias tradicionais",
      "Um bom carácter vale muito",
    ],
    nextSteps: [
      "Visitar coudelarias do Ribatejo e Alentejo",
      "Assistir a provas de Equitação de Trabalho",
      "Contactar associações de criadores",
      "Participar em jornadas de campo",
      "Falar com campinos e cavaleiros de tradição",
    ],
    icon: <Shield className="text-[#C5A059]" size={48} />,
    color: "from-emerald-500/20",
    quotes: [
      {
        author: "Mestre João Oliveira",
        role: "Campino do Ribatejo",
        quote:
          "O verdadeiro Lusitano é aquele que trabalha connosco no campo, que entende o gado e responde à mão do cavaleiro.",
      },
      {
        author: "António Borba Monteiro",
        role: "Cavaleiro Tauromáquico",
        quote: "Na arena, o cavalo é uma extensão do nosso corpo. A confiança mútua é tudo.",
      },
      {
        author: "Dr. Guilherme Borba",
        role: "Criador Tradicional",
        quote:
          "Preservar a tradição é honrar gerações de criadores que nos legaram esta raça extraordinária.",
      },
    ],
    faq: [
      {
        question: "O Lusitano de trabalho é diferente do de desporto?",
        answer:
          "Historicamente sim, mas hoje muitos cavalos são versáteis. O de trabalho tende a ser mais compacto, robusto e com temperamento mais frio.",
      },
      {
        question: "Posso usar um cavalo tradicional em provas?",
        answer:
          "Sim, existem provas de Equitação de Trabalho muito competitivas. É uma disciplina em crescimento que valoriza a versatilidade.",
      },
      {
        question: "Que idade é ideal para um cavalo de trabalho?",
        answer:
          "Entre 6-12 anos, com experiência de campo. Cavalos mais velhos são excelentes se bem mantidos — a experiência é muito valiosa.",
      },
      {
        question: "Preciso de instalações especiais?",
        answer:
          "Idealmente paddock ou pasto, mas muitos cavalos tradicionais adaptam-se bem a pensão. O importante é exercício regular e contacto com o exterior.",
      },
      {
        question: "Como encontrar um bom cavalo de trabalho?",
        answer:
          "Através de contactos no Ribatejo e Alentejo, feiras tradicionais, e referências de campinos e cavaleiros de confiança.",
      },
    ],
    timeline: [
      {
        month: "Mês 1-2",
        title: "Imersão na Tradição",
        description:
          "Visitar coudelarias tradicionais, assistir a tentas e jornadas de campo, conhecer a cultura equestre.",
      },
      {
        month: "Mês 3-4",
        title: "Contactos e Pesquisa",
        description:
          "Estabelecer relações com criadores, campinos, e cavaleiros tradicionais. Ver cavalos em trabalho real.",
      },
      {
        month: "Mês 5-6",
        title: "Selecção",
        description:
          "Experimentar cavalos no campo, testar em diferentes situações, verificar versatilidade e temperamento.",
      },
      {
        month: "Mês 7-8",
        title: "Aquisição",
        description: "Exame veterinário, negociação, e transporte para as suas instalações.",
      },
      {
        month: "Mês 9-12",
        title: "Integração",
        description: "Conhecer o cavalo, participar em jornadas de campo, desenvolver a parceria.",
      },
    ],
  },
  criador: {
    profile: "criador",
    title: "Criador & Investidor Genético",
    subtitle: "Preservação e Melhoramento",
    description:
      "O seu perfil indica interesse sério na criação e preservação do Puro Sangue Lusitano. Valoriza a genética, a morfologia típica da raça, e o potencial reprodutivo.",
    characteristics: [
      "Morfologia típica excelente",
      "Genética comprovada (APSL)",
      "Linhagem pura e reconhecida",
      "Potencial reprodutivo verificado",
      "Conformação para transmissão",
      "Mérito funcional demonstrado",
    ],
    idealHorse: {
      age: "3-8 anos (reprodução activa)",
      height: "Mínimo 1.60m (garanhões)",
      training: "Funcionalidade demonstrada",
      temperament: "Equilibrado, bom carácter hereditário",
      priceRange: "25.000 — 150.000+ euros",
    },
    annualCosts: {
      min: 15000,
      max: 40000,
      includes: [
        "Manutenção em coudelaria",
        "Registos APSL",
        "Exames de reprodução",
        "Coberturas ou IA",
        "Veterinário reprodutivo",
        "Testes genéticos",
        "Concursos de modelo",
        "Marketing dos produtos",
      ],
    },
    recommendedRegions: ["Alentejo", "Ribatejo", "Internacional"],
    linhagens: [
      { name: "Veiga", reason: "Linhagem histórica com genética excepcional" },
      { name: "Alter Real", reason: "Pureza e selecção secular da Casa Real" },
      { name: "Andrade", reason: "Fundacional, transmite funcionalidade" },
    ],
    disciplinas: [
      "Reprodução selectiva",
      "Concursos de Modelo",
      "Apresentações de raça",
      "Dressage (prova de funcionalidade)",
    ],
    famousHorses: [
      { name: "Novilheiro", achievement: "Pai de nação, influenciou gerações" },
      { name: "Opus 72", achievement: "Reprodutor de mérito excepcional" },
      { name: "Ícaro", achievement: "Top reprodutor" },
      { name: "Quo Vadis", achievement: "Garanhão de elite" },
    ],
    tips: [
      "Analise o pedigree (3-4 gerações)",
      "Solicite índices BLUP",
      "Verifique COI — ideal <6%",
      "Exija teste WFFS negativo",
      "Avalie descendência",
      "Considere complementaridade",
      "Visite a coudelaria",
    ],
    nextSteps: [
      "Estudar catálogos APSL",
      "Visitar Coudelaria de Alter",
      "Contactar criadores de referência",
      "Participar em concursos de modelo",
      "Definir objectivos de criação",
    ],
    icon: <Crown className="text-[#C5A059]" size={48} />,
    color: "from-purple-500/20",
    quotes: [
      {
        author: "Dr. Arsénio Raposo Cordeiro",
        role: "Presidente APSL",
        quote:
          "Criar Lusitanos é contribuir para a preservação de um património vivo da cultura portuguesa.",
      },
      {
        author: "Fernando Sommer d'Andrade",
        role: "Criador Histórico",
        quote:
          "Cada potro que nasce é uma nova esperança para a raça. A selecção rigorosa é o nosso dever.",
      },
      {
        author: "Eng. José Luís Mira",
        role: "Geneticista Equino",
        quote:
          "Os índices BLUP revolucionaram a criação, permitindo decisões baseadas em dados objectivos.",
      },
    ],
    faq: [
      {
        question: "O que é o índice BLUP?",
        answer:
          "Best Linear Unbiased Prediction — uma ferramenta estatística que estima o valor genético de um cavalo com base na sua performance e dos seus parentes.",
      },
      {
        question: "Qual o COI ideal?",
        answer:
          "Coeficiente de Consanguinidade idealmente abaixo de 6%. Valores mais altos aumentam risco de problemas genéticos e perda de vigor.",
      },
      {
        question: "Preciso de registar os potros na APSL?",
        answer:
          "Sim, o registo é obrigatório para cavalos PSL. Inclui microchip, resenho, e teste de ADN para confirmação de paternidade.",
      },
      {
        question: "Quanto custa iniciar um programa de criação?",
        answer:
          "Investimento inicial de 30.000-100.000 euros (éguas base), mais 15.000-40.000 euros anuais de manutenção por cavalo.",
      },
      {
        question: "Devo testar para WFFS?",
        answer:
          "Absolutamente. O Warmblood Fragile Foal Syndrome é fatal. Nunca cruzar dois portadores. O teste é obrigatório para reprodutores responsáveis.",
      },
    ],
    timeline: [
      {
        month: "Mês 1-3",
        title: "Formação e Pesquisa",
        description:
          "Estudar genética equina, índices BLUP, catálogos APSL, e visitar coudelarias de referência.",
      },
      {
        month: "Mês 4-6",
        title: "Definir Programa",
        description:
          "Estabelecer objectivos de criação, seleccionar linhagens de interesse, definir orçamento a 5 anos.",
      },
      {
        month: "Mês 7-9",
        title: "Aquisição de Base",
        description:
          "Adquirir éguas fundadoras ou garanhão, garantir testes genéticos, registos APSL, e instalações adequadas.",
      },
      {
        month: "Mês 10-12",
        title: "Início do Programa",
        description:
          "Planear coberturas, estabelecer parcerias com veterinários reprodutivos, iniciar marketing.",
      },
      {
        month: "Ano 2+",
        title: "Consolidação",
        description:
          "Primeiros nascimentos, participação em concursos de modelo, construção de reputação no mercado.",
      },
    ],
  },
  amador: {
    profile: "amador",
    title: "Cavaleiro de Lazer",
    subtitle: "Paixão e Descoberta",
    description:
      "O seu perfil indica alguém que ama cavalos e procura um companheiro para desfrutar de momentos de lazer e crescimento pessoal. Valoriza a segurança, o temperamento dócil e a facilidade de manuseamento.",
    characteristics: [
      "Temperamento calmo e previsível",
      "Fácil de montar e manusear",
      "Seguro para menos experientes",
      "Perdoador de erros",
      "Amigável e carinhoso",
      "Boa saúde e manutenção fácil",
    ],
    idealHorse: {
      age: "8-16 anos (maturidade)",
      height: "1.55m — 1.65m (confortável)",
      training: "Básico a médio (bem confirmado)",
      temperament: "Muito calmo, dócil, paciente",
      priceRange: "8.000 — 25.000 euros",
    },
    annualCosts: {
      min: 6000,
      max: 10000,
      includes: [
        "Pensão em centro hípico",
        "Veterinário básico",
        "Ferração regular",
        "Aulas ocasionais",
        "Equipamento básico",
        "Seguro RC",
        "Alimentação standard",
      ],
    },
    recommendedRegions: ["Lisboa", "Centro", "Norte", "Qualquer região acessível"],
    linhagens: [
      { name: "Qualquer linhagem", reason: "Temperamento individual é mais importante" },
      { name: "Andrade", reason: "Tendência para cavalos sensatos" },
      { name: "Cavalos de escola", reason: "Temperamentos excepcionais" },
    ],
    disciplinas: [
      "Passeio recreativo",
      "Escola básica",
      "Terapia equestre",
      "Lazer familiar",
      "Hipismo adaptado",
    ],
    famousHorses: [
      { name: "Cavalos de escola", achievement: "Formaram gerações de cavaleiros" },
      { name: "Cavalos de terapia", achievement: "Ajudam pessoas especiais" },
      { name: "Companheiros de vida", achievement: "O valor está na relação" },
    ],
    tips: [
      "Procure cavalos mais velhos",
      "Experimente várias vezes",
      "Monte em diferentes situações",
      "Verifique facilidade de manuseamento",
      "Considere cavalos de escola",
      "Preço baixo não é pior qualidade",
      "Peça opinião ao instrutor",
    ],
    nextSteps: [
      "Falar com o seu instrutor",
      "Visitar centros hípicos",
      "Considerar cavalos de escola reformados",
      "Não ter pressa",
      "Fazer várias visitas",
    ],
    icon: <Heart className="text-[#C5A059]" size={48} />,
    color: "from-rose-500/20",
    quotes: [
      {
        author: "Dra. Maria Helena Pires",
        role: "Psicóloga Equestre",
        quote:
          "A relação com o cavalo é terapêutica. Não é preciso competir para experimentar a magia da equitação.",
      },
      {
        author: "Instrutor José Carlos",
        role: "Professor de Equitação",
        quote:
          "O melhor cavalo para um iniciante é aquele que perdoa erros e ensina com paciência.",
      },
      {
        author: "Sofia Mendes",
        role: "Cavaleira Amadora",
        quote: "O meu Lusitano é o meu escape do stress. Cada passeio é uma sessão de terapia.",
      },
    ],
    faq: [
      {
        question: "Cavalos mais velhos são bons para iniciantes?",
        answer:
          "Excelente escolha! Cavalos entre 10-16 anos são tipicamente mais calmos, experientes, e perdoadores. A idade traz sabedoria.",
      },
      {
        question: "Posso ter um cavalo sem experiência prévia?",
        answer:
          "Sim, desde que tenha apoio de um instrutor e o cavalo seja adequado. Comece com aulas regulares e vá ganhando autonomia gradualmente.",
      },
      {
        question: "Quanto tempo devo dedicar ao cavalo?",
        answer:
          "Mínimo 2-3 visitas semanais é ideal. Cavalos em pensão são cuidados diariamente, mas beneficiam do contacto regular consigo.",
      },
      {
        question: "Cavalos de escola reformados são boa opção?",
        answer:
          "Frequentemente são óptimos! Estão habituados a diferentes cavaleiros, são pacientes, e têm temperamentos de ouro. Preço também é mais acessível.",
      },
      {
        question: "Preciso de equipamento próprio?",
        answer:
          "No início pode usar equipamento da escola. Gradualmente invista em capacete (obrigatório), botas, e eventualmente sela própria se o cavalo for seu.",
      },
    ],
    timeline: [
      {
        month: "Mês 1-2",
        title: "Preparação",
        description:
          "Continuar lições, falar com instrutor sobre perfil ideal, visitar centros hípicos da zona.",
      },
      {
        month: "Mês 3-4",
        title: "Pesquisa Activa",
        description:
          "Ver cavalos disponíveis, experimentar diferentes temperamentos, definir orçamento realista.",
      },
      {
        month: "Mês 5-6",
        title: "Selecção Cuidadosa",
        description:
          "Experimentar o cavalo várias vezes, em diferentes dias e situações. Pedir opinião ao instrutor.",
      },
      {
        month: "Mês 7",
        title: "Decisão",
        description: "Exame veterinário básico, negociação, preparar local de pensão.",
      },
      {
        month: "Mês 8-12",
        title: "Lua de Mel",
        description:
          "Conhecer o cavalo, estabelecer rotinas, desfrutar da nova parceria sem pressas.",
      },
    ],
  },
};
