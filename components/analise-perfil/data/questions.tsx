import {
  Target,
  GraduationCap,
  Heart,
  Activity,
  TreeDeciduous,
  TrendingUp,
  DollarSign,
  Clock,
  Compass,
  Sparkles,
  Building,
  UserCheck,
  Users,
  Medal,
  Stethoscope,
  Trophy,
  Truck,
} from "lucide-react";
import { Question } from "../types";

export const questions: Question[] = [
  {
    id: 1,
    category: "Objectivo",
    question: "Qual é o seu principal objectivo com o cavalo Lusitano?",
    description:
      "O PSL destaca-se em múltiplas disciplinas — da alta escola clássica à equitação de campo. A sua resposta é o factor mais determinante para definir o perfil genético, morfológico e de treino adequado.",
    icon: <Target className="text-[#C5A059]" size={28} />,
    weight: 2,
    options: [
      {
        text: "Alta Competição de Dressage",
        description:
          "Provas FEI internacionais (CDI/CDIO), Troféu Lusitano, ou Campeonato Nacional FEP. O PSL destaca-se nos exercícios de colecção — piaffe, passage e pirouettes —, valorizados em provas de Alto Nível.",
        value: "dressage_comp",
        traits: ["competicao", "elegancia", "treino_avancado"],
        points: { competidor: 10, tradicional: 2, criador: 4, amador: 1 },
      },
      {
        text: "Equitação de Trabalho / Toureio",
        description:
          "Modalidade que preserva a herança ancestral do Lusitano como cavalo de campo. Inclui provas de destreza, tenta, campo e toureio a cavalo, regulamentadas pela FEP. Exige aptidão funcional, robustez e responsividade.",
        value: "trabalho",
        traits: ["tradicao", "versatilidade", "robustez"],
        points: { competidor: 3, tradicional: 10, criador: 3, amador: 2 },
      },
      {
        text: "Alta Escola Clássica / Lazer",
        description:
          "Aprendizagem e progressão dentro da tradição ibérica, influenciada pelo legado da Escola Portuguesa de Arte Equestre e pelo ensinamento do Mestre Nuno Oliveira. Equitação como arte e prazer.",
        value: "escola",
        traits: ["aprendizagem", "progressao", "escola"],
        points: { competidor: 4, tradicional: 3, criador: 2, amador: 8 },
      },
      {
        text: "Reprodução e Melhoramento Genético",
        description:
          "Programa de criação com registo APSL, selecção por índice BLUP oficial, e preservação ou desenvolvimento das linhagens históricas do Puro Sangue Lusitano.",
        value: "criacao",
        traits: ["genetica", "linhagem", "morfologia"],
        points: { competidor: 2, tradicional: 3, criador: 10, amador: 1 },
      },
    ],
  },
  {
    id: 2,
    category: "Experiência",
    question: "Qual é o seu nível de experiência equestre?",
    description:
      "O PSL é reconhecido pela sua sensibilidade e cooperação natural com o cavaleiro — qualidades seleccionadas ao longo de séculos de equitação ibérica. Estas características exigem que o cavaleiro saiba interpretar e respeitar a linguagem do cavalo.",
    icon: <GraduationCap className="text-[#C5A059]" size={28} />,
    weight: 1.5,
    options: [
      {
        text: "Iniciante (até 2 anos de prática)",
        description:
          "Ainda a desenvolver os fundamentos — assento independente, equilíbrio e uso das ajudas básicas. Um PSL bem treinado e de temperamento calmo é fundamental nesta fase para construir confiança e técnica.",
        value: "iniciante",
        traits: ["calmo", "seguro", "docil"],
        points: { competidor: 0, tradicional: 3, criador: 1, amador: 10 },
      },
      {
        text: "Intermédio (2 a 5 anos)",
        description:
          "Domina os andamentos básicos, trabalho em duas pistas, e inicia o trabalho de colecção. Pode evoluir tecnicamente com um PSL de treino elementar a médio, equilibrado e cooperativo.",
        value: "intermedio",
        traits: ["versatil", "equilibrado"],
        points: { competidor: 4, tradicional: 6, criador: 3, amador: 7 },
      },
      {
        text: "Avançado (5 a 10 anos)",
        description:
          "Cavaleiro com técnica consolidada, capaz de trabalhar movimentos de colecção, laterais complexos, pirouettes e início de piaffe. Tira pleno partido da sensibilidade e expressão natural do PSL.",
        value: "avancado",
        traits: ["desafiante", "sensivel"],
        points: { competidor: 8, tradicional: 7, criador: 5, amador: 4 },
      },
      {
        text: "Profissional / Cavaleiro de Competição",
        description:
          "Formação técnica sólida, experiência em competição nacional ou internacional, e capacidade de desenvolver cavalos jovens ou aperfeiçoar cavalos de alta escola. Domina a linguagem subtil que o PSL exige e aprecia.",
        value: "profissional",
        traits: ["competicao", "alto_nivel", "elite"],
        points: { competidor: 10, tradicional: 5, criador: 6, amador: 1 },
      },
    ],
  },
  {
    id: 3,
    category: "Temperamento",
    question: "Que perfil de temperamento procura num Lusitano?",
    description:
      "O PSL é historicamente seleccionado pelo seu brio, nobreza e cooperação com o cavaleiro — características valorizadas desde a equitação de guerra ibérica. Dentro da raça, existem perfis distintos que se adequam a diferentes cavaleiros e objectivos.",
    icon: <Heart className="text-[#C5A059]" size={28} />,
    weight: 1.5,
    options: [
      {
        text: "Calmo e de fácil manuseamento",
        description:
          "PSL de temperamento gentil, seguro e previsível. Ideal para iniciantes, cavaleiros ocasionais, propriedade familiar ou programas de terapia equestre. Existe dentro da raça, especialmente em éguas de carácter dócil.",
        value: "muito_calmo",
        traits: ["calmo", "docil", "seguro"],
        points: { competidor: 1, tradicional: 5, criador: 2, amador: 10 },
      },
      {
        text: "Equilibrado e cooperativo",
        description:
          "O perfil mais versátil do PSL — sensato, trabalhador e com predisposição natural para a colecção sem ser excessivamente reactivo. Adequado à maioria dos cavaleiros e objectivos equestres.",
        value: "equilibrado",
        traits: ["equilibrado", "cooperativo"],
        points: { competidor: 6, tradicional: 8, criador: 5, amador: 7 },
      },
      {
        text: "Sensível e reactivo às ajudas",
        description:
          "PSL com elevada responsividade — responde a ajudas subtis, expressivo nos movimentos e com forte presença. Muito valorizado em alta escola e dressage de competição, mas exige cavaleiro experiente e mão quieta.",
        value: "sensivel",
        traits: ["sensivel", "reactivo", "expressivo"],
        points: { competidor: 9, tradicional: 4, criador: 6, amador: 2 },
      },
      {
        text: "Com brio marcado — presença e vivacidade",
        description:
          "O «brio» é uma das qualidades mais distintivas e valorizadas no PSL: vivacidade, orgulho natural e vontade de trabalhar com entusiasmo. Característico de garanhões de elite e cavalos de alta escola e toureio.",
        value: "quente",
        traits: ["quente", "brio", "presenca"],
        points: { competidor: 10, tradicional: 3, criador: 4, amador: 1 },
      },
    ],
  },
  {
    id: 4,
    category: "Morfologia",
    question: "Que características morfológicas mais valoriza no PSL?",
    description:
      "O padrão morfológico do PSL é definido pela APSL e distingue-se pela cabeça sub-convexa, pescoço arqueado em forma de lança, garupa arredondada e crinas e cauda abundantes. Cada tipo morfológico reflecte aptidões funcionais distintas.",
    icon: <Activity className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "Movimentos naturalmente elevados e expressivos",
        description:
          "Cadência, suspensão e elasticidade naturais nos três andamentos básicos — fundamentais para a pontuação em dressage FEI e para a execução dos exercícios de alta escola como piaffe, passage e levade.",
        value: "movimentos",
        traits: ["movimentos", "elegancia", "dressage"],
        points: { competidor: 10, tradicional: 2, criador: 6, amador: 3 },
      },
      {
        text: "Estrutura sólida e aptidão funcional",
        description:
          "Ossatura robusta, musculatura compacta, dorso curto e articulações fortes. Características que o tipo Andrade privilegia para o trabalho de campo, equitação de trabalho e provas de resistência e agilidade.",
        value: "robusto",
        traits: ["robusto", "forte", "resistente"],
        points: { competidor: 3, tradicional: 10, criador: 5, amador: 4 },
      },
      {
        text: "Tipicidade racial e beleza clássica ibérica",
        description:
          "Perfil sub-convexo pronunciado, pescoço arqueado de implantação alta, crinas e cauda abundantes e sedosas, garupa arredondada. A expressão máxima do tipo ibérico que define o padrão oficial APSL.",
        value: "beleza",
        traits: ["beleza", "tipicidade", "morfologia"],
        points: { competidor: 5, tradicional: 5, criador: 10, amador: 5 },
      },
      {
        text: "Conforto e acessibilidade para o cavaleiro",
        description:
          "Andamentos naturalmente cómodos com dorso elástico e absorvente, temperamento receptivo e carácter cooperativo. Qualidades que facilitam a aprendizagem e tornam a equitação um prazer acessível.",
        value: "conforto",
        traits: ["confortavel", "facil", "lazer"],
        points: { competidor: 2, tradicional: 4, criador: 2, amador: 10 },
      },
    ],
  },
  {
    id: 5,
    category: "Genética e Linhagem",
    question: "Qual a importância da linhagem e do índice BLUP na sua decisão?",
    description:
      "O Livro Genealógico do PSL é gerido pela APSL. O índice BLUP (Best Linear Unbiased Prediction) é a ferramenta oficial para estimar o mérito genético de reprodutores, calculado com base no desempenho de descendentes em provas morfológicas e funcionais.",
    icon: <TreeDeciduous className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "BLUP elevado e pedigree de elite são indispensáveis",
        description:
          "Apenas considero reprodutores ou descendentes com índice BLUP superior e linhagem comprovada — Veiga, Andrade, ou outras famílias de mérito reconhecido pela APSL com ancestrais aprovados em provas.",
        value: "elite",
        traits: ["linhagem_elite", "pedigree"],
        points: { competidor: 6, tradicional: 4, criador: 10, amador: 1 },
      },
      {
        text: "Valorizo boas origens, mas avalio o cavalo individualmente",
        description:
          "O pedigree e o BLUP são factores importantes de triagem, mas o indivíduo — morfologia, temperamento e qualidade dos movimentos — tem igual ou maior peso na decisão final.",
        value: "importante",
        traits: ["linhagem", "origens"],
        points: { competidor: 7, tradicional: 6, criador: 8, amador: 3 },
      },
      {
        text: "O cavalo individual supera o pedigree",
        description:
          "Valorizo o registo APSL como garantia de pureza racial, mas o que mais importa é o que o cavalo apresenta em aptidão funcional, saúde, carácter e movimentos — o indivíduo acima da genealogia.",
        value: "relevante",
        traits: ["individuo"],
        points: { competidor: 5, tradicional: 7, criador: 4, amador: 5 },
      },
      {
        text: "Pouca relevância — o resultado prático é o que conta",
        description:
          "Interessa-me o cavalo que está à minha frente e o que consegue fazer comigo. Prefiro investir em treino e saúde do que num pedigree selecto que não se traduz em desempenho real.",
        value: "pouco",
        traits: ["pratico", "funcional"],
        points: { competidor: 3, tradicional: 5, criador: 1, amador: 8 },
      },
    ],
  },
  {
    id: 6,
    category: "Treino",
    question: "Que nível de treino prefere no cavalo que vai adquirir?",
    description:
      "Cavalos com mais treino têm valores de mercado superiores, mas oferecem resultados imediatos e menor risco. Cavalos jovens ou desbravados requerem mais tempo e competência técnica, mas permitem desenvolver uma ligação única cavaleiro-cavalo.",
    icon: <TrendingUp className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "Desbravado / Início de trabalho",
        description:
          "Cavalo jovem (3-4 anos) a iniciar o processo de habituação e desbravamento. Ideal para cavaleiros experientes que querem desenvolver um PSL «desde o zero» segundo os seus critérios e método.",
        value: "desbravado",
        traits: ["jovem", "potencial"],
        points: { competidor: 7, tradicional: 5, criador: 8, amador: 2 },
      },
      {
        text: "Trabalho básico (nível Elementar/Fácil)",
        description:
          "Domina os andamentos controlados, trabalho longitudinal e início das duas pistas. Pronto para evoluir com o cavaleiro. Equivalente ao nível E/F nas escalas FEP de dressage.",
        value: "basico",
        traits: ["basico", "progressao"],
        points: { competidor: 5, tradicional: 6, criador: 4, amador: 7 },
      },
      {
        text: "Trabalho médio (nível Médio/Superior)",
        description:
          "Domina trabalho em duas pistas avançado, começo de colecção, piafar e inicio de passage. Equivalente aos níveis M/S nas escalas FEP. Adequado para cavaleiros avançados e competição regional.",
        value: "medio",
        traits: ["treinado", "medio"],
        points: { competidor: 8, tradicional: 4, criador: 3, amador: 5 },
      },
      {
        text: "Alta Escola / Grand Prix",
        description:
          "Cavalo de alta escola completo ou de Grand Prix FEI — domina piaffe, passage, pirouettes, cabriola ou outros airs above the ground. O nível mais exigente e de maior valor no mundo do PSL.",
        value: "gp",
        traits: ["gp", "alta_escola", "elite"],
        points: { competidor: 10, tradicional: 2, criador: 2, amador: 1 },
      },
    ],
  },
  {
    id: 7,
    category: "Investimento",
    question: "Qual é o seu orçamento para aquisição?",
    description:
      "O valor de um PSL reflecte o cruzamento de múltiplos factores: nível de treino, qualidade do pedigree, índice BLUP, morfologia, histórico competitivo e potencial de mercado. O mercado lusitano internacional é activo e crescente.",
    icon: <DollarSign className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "Até 15.000 €",
        description:
          "Poldros, cavalos jovens desbravados, ou PSL de lazer sem pretensões competitivas. Boa opção para primeiros proprietários ou para quem quer desenvolver um projecto de longo prazo com paciência.",
        value: "economico",
        traits: ["acessivel", "entrada"],
        points: { competidor: 1, tradicional: 5, criador: 6, amador: 10 },
      },
      {
        text: "15.000 € — 35.000 €",
        description:
          "Cavalos com treino básico a médio, bom pedigree e potencial para competição regional. Faixa de mercado mais activa em Portugal para PSL de qualidade com registo APSL definitivo.",
        value: "medio",
        traits: ["qualidade", "treinado"],
        points: { competidor: 4, tradicional: 8, criador: 5, amador: 7 },
      },
      {
        text: "35.000 € — 75.000 €",
        description:
          "Cavalos de competição com historial em provas nacionais, reprodutores aprovados em provas APSL, ou PSL de morfologia e movimentos excepcionais. Investimento com potencial de valorização.",
        value: "alto",
        traits: ["premium", "competicao"],
        points: { competidor: 8, tradicional: 5, criador: 8, amador: 3 },
      },
      {
        text: "Acima de 75.000 €",
        description:
          "Cavalos de Grand Prix FEI, reprodutores de elite com BLUP superior, ou PSL com historial internacional e morfologia de exposição. O segmento premium do mercado lusitano global.",
        value: "premium",
        traits: ["elite", "excepcional", "topo"],
        points: { competidor: 10, tradicional: 3, criador: 10, amador: 1 },
      },
    ],
  },
  {
    id: 8,
    category: "Dedicação",
    question: "Quanto tempo pode dedicar ao cavalo semanalmente?",
    description:
      "O PSL responde bem ao trabalho regular e consistente — a sua inteligência e memória permitem progressão sólida com treino frequente. A disponibilidade condiciona directamente o tipo de cavalo e nível de treino adequados.",
    icon: <Clock className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "Diariamente (5 a 7 dias por semana)",
        description:
          "Regime de treino intensivo com trabalho diário. Permite desenvolver um PSL jovem, manter um cavalo de competição em forma de prova, ou gerir um programa de reprodução activo.",
        value: "diario",
        traits: ["competicao", "dedicado", "atleta"],
        points: { competidor: 10, tradicional: 6, criador: 5, amador: 3 },
      },
      {
        text: "Frequente (3 a 4 dias por semana)",
        description:
          "Treino regular que permite progressão consistente e manutenção do nível de trabalho. Adequado para competição regional e para desenvolver um PSL de forma equilibrada e sem stresse.",
        value: "frequente",
        traits: ["ativo", "progresso"],
        points: { competidor: 7, tradicional: 8, criador: 4, amador: 6 },
      },
      {
        text: "Fins de semana (1 a 2 dias)",
        description:
          "Equitação recreativa e de lazer. Requer um PSL bem treinado, de temperamento calmo e que mantenha a sua forma com trabalho menos frequente — habitualmente cavalos mais velhos e experientes.",
        value: "weekend",
        traits: ["lazer", "familiar"],
        points: { competidor: 2, tradicional: 5, criador: 3, amador: 10 },
      },
      {
        text: "Proprietário com gestão delegada",
        description:
          "O cavalo ficará predominantemente ao cuidado de treinadores ou tratadores profissionais. Comum em programas de reprodução, cavalos de competição de alto nível, ou investidores do sector equestre.",
        value: "ausente",
        traits: ["profissional", "delegado"],
        points: { competidor: 5, tradicional: 3, criador: 8, amador: 4 },
      },
    ],
  },
  {
    id: 9,
    category: "Região",
    question: "Em que região de Portugal procura o seu Lusitano?",
    description:
      "Portugal concentra a maior densidade de criadores de PSL do mundo. Cada região tem tradições equestres específicas, tipos morfológicos predominantes e redes de coudelarias com características distintas.",
    icon: <Compass className="text-[#C5A059]" size={28} />,
    weight: 0.5,
    options: [
      {
        text: "Ribatejo",
        description:
          "Coração equestre de Portugal, berço da tradição campeira e da toureio a cavalo. Sede da Feira Nacional do Cavalo de Golega (Novembro) — o maior evento lusitano do mundo. Forte presença de linhagens tradicionais de campo.",
        value: "ribatejo",
        traits: ["ribatejo", "tradicao"],
        points: { competidor: 7, tradicional: 10, criador: 8, amador: 5 },
      },
      {
        text: "Alentejo",
        description:
          "Grandes coudelarias extensivas, tradição de campo e criação em liberdade. Cavalos com morfologia robusta e aptidão funcional. Região com forte presença de coudelarias familiares históricas.",
        value: "alentejo",
        traits: ["alentejo", "coudelaria"],
        points: { competidor: 6, tradicional: 9, criador: 9, amador: 4 },
      },
      {
        text: "Lisboa / Grande Centro / Setúbal",
        description:
          "Proximidade a centros hípicos de referência, maior facilidade logística e acesso a treinadores internacionais. Região com crescente actividade de dressage competitiva e alta escola.",
        value: "lisboa",
        traits: ["lisboa", "acessivel"],
        points: { competidor: 5, tradicional: 4, criador: 4, amador: 8 },
      },
      {
        text: "Qualquer região / Procura internacional",
        description:
          "A qualidade do cavalo supera qualquer consideração geográfica. Disponível para procurar em Portugal e no estrangeiro — Brasil, Espanha, ou outros países com criação PSL reconhecida.",
        value: "qualquer",
        traits: ["flexivel", "internacional"],
        points: { competidor: 8, tradicional: 5, criador: 7, amador: 6 },
      },
    ],
  },
  {
    id: 10,
    category: "Visão",
    question: "Onde se imagina daqui a 5 anos com este cavalo?",
    description:
      "Visualizar o objectivo a médio prazo é essencial para fazer a escolha certa hoje. O PSL tem uma vida útil longa — muitos cavalos mantêm-se activos em competição ou trabalho até aos 18-20 anos.",
    icon: <Sparkles className="text-[#C5A059]" size={28} />,
    weight: 1.5,
    options: [
      {
        text: "A competir a nível internacional",
        description:
          "Provas FEI — CDI, CDIO, Campeonatos da Europa ou Mundiais. Para este objectivo, o PSL necessita de movimentos excepcionais, pedigree de competição e um programa de treino de elite.",
        value: "internacional",
        traits: ["internacional", "elite"],
        points: { competidor: 10, tradicional: 2, criador: 3, amador: 0 },
      },
      {
        text: "A competir a nível nacional",
        description:
          "Campeonatos nacionais FEP, Troféu Lusitano, provas de equitação de trabalho, ou ranking nacional de dressage. Objectivo exigente mas acessível com o cavalo e treino certos.",
        value: "nacional",
        traits: ["nacional", "competicao"],
        points: { competidor: 8, tradicional: 6, criador: 4, amador: 2 },
      },
      {
        text: "A evoluir tecnicamente e a desfrutar",
        description:
          "Progressão na alta escola clássica, melhoria técnica consistente, talvez provas regionais. O objectivo é a qualidade da relação cavaleiro-cavalo e o prazer do trabalho bem feito.",
        value: "evolucao",
        traits: ["evolucao", "escola"],
        points: { competidor: 4, tradicional: 5, criador: 3, amador: 8 },
      },
      {
        text: "A construir um programa de criação",
        description:
          "Programa de criação PSL com éguas de ventre seleccionadas, cruzamentos planeados por BLUP e objectivo de produzir poldros com registo APSL definitivo de qualidade superior.",
        value: "criacao",
        traits: ["criacao", "reproducao"],
        points: { competidor: 2, tradicional: 4, criador: 10, amador: 3 },
      },
    ],
  },
  {
    id: 11,
    category: "Infraestrutura",
    question: "Que infraestrutura tem disponível para albergar o cavalo?",
    description:
      "As instalações condicionam directamente o bem-estar do PSL e as possibilidades de treino. Um cavalo de alta escola ou reprodução activa exige instalações de qualidade superior às necessárias para um PSL de lazer.",
    icon: <Building className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "Centro hípico de nível profissional",
        description:
          "Picadeiro coberto com piso técnico, pista exterior, paddocks individuais, boxes espaçosas, sala de selagem e apoio veterinário próximo. Condições ideais para treino de competição.",
        value: "completo",
        traits: ["profissional", "premium"],
        points: { competidor: 10, tradicional: 5, criador: 7, amador: 4 },
      },
      {
        text: "Pensão em centro hípico",
        description:
          "Box em centro hípico com acesso a picadeiro e serviços básicos. Solução mais comum e prática para a maioria dos proprietários, com a vantagem da comunidade equestre e apoio disponível.",
        value: "pensao",
        traits: ["acessivel", "conveniente"],
        points: { competidor: 6, tradicional: 6, criador: 3, amador: 8 },
      },
      {
        text: "Instalações próprias básicas",
        description:
          "Box e paddock próprios, com acesso a campo ou pista exterior. Maior autonomia e liberdade para o cavalo, mas sem picadeiro coberto. Adequado para tradição campeira e lazer.",
        value: "proprio_basico",
        traits: ["independente", "tradicional"],
        points: { competidor: 3, tradicional: 9, criador: 6, amador: 5 },
      },
      {
        text: "Coudelaria ou propriedade rural",
        description:
          "Grande propriedade com múltiplas boxes, pastagens, picadeiro e infraestrutura de criação. Permite manter éguas de ventre, poldros e um programa de reprodução completo.",
        value: "coudelaria",
        traits: ["criador", "extensivo"],
        points: { competidor: 5, tradicional: 7, criador: 10, amador: 2 },
      },
    ],
  },
  {
    id: 12,
    category: "Experiência como Proprietário",
    question: "Qual é a sua experiência como proprietário de cavalos?",
    description:
      "Ser proprietário de um PSL implica responsabilidades que vão muito além da equitação: gestão veterinária, nutrição, ferragem, maneio e bem-estar geral. A experiência prévia influencia o tipo de cavalo mais adequado.",
    icon: <UserCheck className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "Primeiro cavalo",
        description:
          "Será a minha primeira experiência como proprietário. Estou a aprender sobre gestão equina, rotinas de maneio e responsabilidades legais. Precisarei de apoio próximo de profissionais experientes.",
        value: "primeiro",
        traits: ["novato", "aprendizagem"],
        points: { competidor: 2, tradicional: 4, criador: 1, amador: 10 },
      },
      {
        text: "Já tive 1 a 2 cavalos",
        description:
          "Tenho alguma experiência como proprietário — conheço as rotinas básicas de maneio, alimentação e cuidados veterinários preventivos. Consigo gerir com alguma autonomia.",
        value: "alguma",
        traits: ["experiencia", "autonomo"],
        points: { competidor: 5, tradicional: 7, criador: 4, amador: 7 },
      },
      {
        text: "Proprietário experiente",
        description:
          "Já tive vários cavalos ao longo dos anos e domino o ciclo completo de gestão: vacinações, desparasitações, ferragem regular, nutrição ajustada e maneio preventivo de saúde.",
        value: "experiente",
        traits: ["experiente", "conhecedor"],
        points: { competidor: 8, tradicional: 8, criador: 6, amador: 4 },
      },
      {
        text: "Criador / Gestor de múltiplos cavalos",
        description:
          "Tenho ou já tive múltiplos cavalos, com experiência em reprodução, cuidados a poldros, gestão de éguas de ventre e programa de criação. Nível de conhecimento próximo do profissional.",
        value: "criador",
        traits: ["profissional", "criador"],
        points: { competidor: 6, tradicional: 6, criador: 10, amador: 2 },
      },
    ],
  },
  {
    id: 13,
    category: "Apoio Profissional",
    question: "Que acompanhamento profissional terá disponível?",
    description:
      "O PSL responde excepcionalmente bem ao trabalho com profissionais qualificados — treinador, veterinário de desporto equino, ferrador e nutricionista equino formam a equipa ideal para extrair o melhor da raça.",
    icon: <Users className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "Treinador de alta competição",
        description:
          "Acompanhamento regular com treinador com experiência em competição FEI ou equitação de trabalho de nível nacional/internacional. O padrão exigido para desenvolver um PSL de topo.",
        value: "treinador_top",
        traits: ["elite", "competicao"],
        points: { competidor: 10, tradicional: 3, criador: 4, amador: 2 },
      },
      {
        text: "Instrutor / Treinador qualificado regular",
        description:
          "Lições semanais com instrutor certificado pela FEP ou com formação reconhecida. Suficiente para progressão consistente e competição regional com um PSL de qualidade.",
        value: "instrutor",
        traits: ["apoio", "progressao"],
        points: { competidor: 6, tradicional: 6, criador: 4, amador: 8 },
      },
      {
        text: "Apoio pontual quando necessário",
        description:
          "Consulto profissionais em momentos específicos — clínicas, revisões técnicas, ou situações de saúde. Modelo que exige autonomia e conhecimento do cavaleiro.",
        value: "pontual",
        traits: ["autonomo", "independente"],
        points: { competidor: 4, tradicional: 8, criador: 5, amador: 5 },
      },
      {
        text: "Equipa completa de apoio",
        description:
          "Treinador regular, veterinário de desporto equino, ferrador especializado em cavalos de trabalho, e nutricionista equino. O suporte ideal para cavalos de alto nível e programas de reprodução.",
        value: "completo",
        traits: ["profissional", "dedicado"],
        points: { competidor: 9, tradicional: 5, criador: 8, amador: 3 },
      },
    ],
  },
  {
    id: 14,
    category: "Ambições Competitivas",
    question: "Se compete ou pretende competir, a que nível aspira?",
    description:
      "O PSL está presente nas mais altas esferas competitivas mundiais — de CDIs internacionais ao Campeonato do Mundo de Equitação de Trabalho. Os objectivos competitivos definem directamente o tipo de cavalo necessário.",
    icon: <Medal className="text-[#C5A059]" size={28} />,
    weight: 1.5,
    options: [
      {
        text: "Não pretendo competir",
        description:
          "O meu foco é o prazer da equitação, a evolução técnica pessoal, ou o desenvolvimento de um programa de criação. A competição não faz parte dos meus objectivos com este cavalo.",
        value: "sem_competicao",
        traits: ["lazer", "recreativo"],
        points: { competidor: 0, tradicional: 5, criador: 6, amador: 10 },
      },
      {
        text: "Provas regionais / Ensino social",
        description:
          "Competição local para ganhar experiência em pista — provas de dressage de ensino social, equitação de trabalho regional, ou outras modalidades com PSL a nível de iniciação competitiva.",
        value: "regional",
        traits: ["entrada", "local"],
        points: { competidor: 4, tradicional: 7, criador: 3, amador: 6 },
      },
      {
        text: "Campeonatos nacionais FEP",
        description:
          "Objectivo de ranking e classificação no Campeonato Nacional — dressage, equitação de trabalho, ou morfologia APSL. Exige cavalo com qualidade acima da média e preparação técnica consistente.",
        value: "nacional",
        traits: ["nacional", "ranking"],
        points: { competidor: 8, tradicional: 5, criador: 4, amador: 2 },
      },
      {
        text: "Competição internacional FEI (CDI/CDIO)",
        description:
          "Provas FEI de dressage, equitação de trabalho internacional, ou Campeonatos da Europa/Mundo. Exige um PSL de qualidade excepcional, treinador de nível internacional e dedicação total.",
        value: "internacional",
        traits: ["internacional", "elite"],
        points: { competidor: 10, tradicional: 2, criador: 3, amador: 0 },
      },
    ],
  },
  {
    id: 15,
    category: "Saúde e Garantias",
    question: "Que exigências tem em termos de saúde e garantias veterinárias?",
    description:
      "A compra de um PSL é um investimento significativo. Um exame de compra rigoroso protege o comprador e transmite transparência por parte do vendedor. Os padrões de exigência variam consoante o objectivo de uso.",
    icon: <Stethoscope className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      {
        text: "Exame veterinário completo e rigoroso",
        description:
          "RX a todos os membros (incluindo coluna e ATM), ecografia de tendões e ligamentos, análises sanguíneas completas, e exame clínico detalhado por veterinário da minha confiança. O padrão para qualquer compra de valor.",
        value: "completo",
        traits: ["rigoroso", "investimento"],
        points: { competidor: 10, tradicional: 5, criador: 7, amador: 4 },
      },
      {
        text: "Exame clínico + RX às áreas principais",
        description:
          "Exame clínico completo com RX às áreas de maior risco (boletos, jarretes, espinhela). Equilíbrio entre rigor e custo — adequado para a maioria das compras de PSL de qualidade.",
        value: "basico",
        traits: ["prudente", "equilibrado"],
        points: { competidor: 7, tradicional: 7, criador: 6, amador: 6 },
      },
      {
        text: "Confio no histórico veterinário e no vendedor",
        description:
          "Se a coudelaria tem reputação sólida e fornece o histórico veterinário completo do cavalo, um exame básico pode ser suficiente. Adequado quando existe relação de confiança com o criador.",
        value: "confianca",
        traits: ["confiante", "relacional"],
        points: { competidor: 3, tradicional: 8, criador: 5, amador: 7 },
      },
      {
        text: "Testes genéticos obrigatórios",
        description:
          "Para criação, exijo testes de WFFS (Warmblood Fragile Foal Syndrome), CA (Congenital Stationary Night Blindness em cruzamentos) e outros marcadores genéticos relevantes. Indispensável em qualquer programa de melhoramento sério.",
        value: "genetico",
        traits: ["genetica", "rigoroso"],
        points: { competidor: 5, tradicional: 4, criador: 10, amador: 3 },
      },
    ],
  },
  {
    id: 16,
    category: "Acompanhamento Técnico",
    question: "Com que regularidade trabalha com um treinador ou instrutor?",
    description:
      "O acompanhamento profissional regular é um dos factores mais determinantes na progressão técnica e no bem-estar do binómio cavaleiro-cavalo. O PSL responde especialmente bem a trabalho metódico e consistente.",
    icon: <Trophy className="text-[#C5A059]" size={28} />,
    weight: 1.2,
    options: [
      {
        text: "Treinador dedicado — sessões semanais",
        description:
          "Trabalho semanal com treinador profissional, com plano de treino individualizado. O modelo standard em cavalos de competição e o mais eficaz para desenvolvimento rápido de cavaleiro e cavalo.",
        value: "dedicado",
        traits: ["competicao", "progressao", "profissional"],
        points: { competidor: 8, tradicional: 4, criador: 3, amador: 2 },
      },
      {
        text: "Treinador ou instrutor mensal",
        description:
          "Sessões mensais de revisão e correcção com treinador ou instrutor qualificado. Suficiente para manter a direcção técnica correcta e corrigir vícios de postura e ajudas.",
        value: "regular",
        traits: ["progressao", "apoio"],
        points: { competidor: 5, tradicional: 5, criador: 3, amador: 5 },
      },
      {
        text: "Clínicas e workshops especializados",
        description:
          "Formação concentrada em clínicas com treinadores convidados — modelo comum em Portugal, com diversas clínicas de Alta Escola, Equitação de Trabalho e Dressage disponíveis ao longo do ano.",
        value: "ocasional",
        traits: ["formacao", "eventos"],
        points: { competidor: 4, tradicional: 6, criador: 4, amador: 4 },
      },
      {
        text: "Estudo autónomo e auto-aprendizagem",
        description:
          "Cavaleiro autodidata — aprende através de livros técnicos, vídeos e análise crítica do próprio trabalho. Requer forte autodisciplina e capacidade de análise, mas é um caminho válido com base técnica sólida.",
        value: "autonomo",
        traits: ["autonomo", "independente"],
        points: { competidor: 1, tradicional: 4, criador: 3, amador: 7 },
      },
    ],
  },
  {
    id: 17,
    category: "Logística de Transporte",
    question: "Como gere o transporte e a logística dos seus cavalos?",
    description:
      "A mobilidade equestre é essencial para competição, clínicas e aquisição de cavalos. Portugal tem uma boa rede de transportadores equinos especializados, e o mercado internacional de PSL exige frequentemente transporte de longa distância.",
    icon: <Truck className="text-[#C5A059]" size={28} />,
    weight: 0.5,
    options: [
      {
        text: "Transporte próprio (atrelado ou van equina)",
        description:
          "Tenho ou pretendo ter meio de transporte equino próprio. Confere autonomia total para provas, clínicas e aquisição de cavalos — essencial para cavaleiros de competição activa.",
        value: "proprio",
        traits: ["autonomo", "competicao", "mobilidade"],
        points: { competidor: 9, tradicional: 6, criador: 7, amador: 4 },
      },
      {
        text: "Partilha com outros cavaleiros",
        description:
          "Partilho transporte com colegas de centro hípico ou clube. Solução prática e económica para provas locais e regionais, mas com dependência da disponibilidade de terceiros.",
        value: "partilhado",
        traits: ["comunidade", "partilha"],
        points: { competidor: 5, tradicional: 7, criador: 4, amador: 6 },
      },
      {
        text: "Empresa de transporte equino especializada",
        description:
          "Contrato transportadores profissionais especializados em equinos para provas, clínicas e aquisições. Ideal para transporte internacional de PSL ou cavalos de grande valor que requerem cuidado especial.",
        value: "empresa",
        traits: ["profissional", "servico"],
        points: { competidor: 7, tradicional: 5, criador: 6, amador: 3 },
      },
      {
        text: "Sem necessidade de transporte regular",
        description:
          "O cavalo fica num local fixo, com todas as actividades realizadas na mesma instalação. Modelo de lazer e trabalho local, sem deslocações para provas ou clínicas externas.",
        value: "sem_transporte",
        traits: ["lazer", "local"],
        points: { competidor: 1, tradicional: 4, criador: 3, amador: 8 },
      },
    ],
  },
];
