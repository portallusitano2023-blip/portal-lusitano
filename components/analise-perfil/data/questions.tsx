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

type Tr = (pt: string, en: string, es?: string) => string;

export function getQuestions(tr: Tr): Question[] {
  return [
    {
      id: 1,
      category: tr("Objectivo", "Objective", "Objetivo"),
      question: tr(
        "Qual é o seu principal objectivo com o cavalo Lusitano?",
        "What is your main objective with the Lusitano horse?",
        "¿Cuál es su principal objetivo con el caballo Lusitano?"
      ),
      description: tr(
        "O PSL destaca-se em múltiplas disciplinas — da alta escola clássica à equitação de campo. A sua resposta é o factor mais determinante para definir o perfil genético, morfológico e de treino adequado.",
        "The PSL excels across multiple disciplines — from classical haute école to field riding. Your answer is the most decisive factor in defining the appropriate genetic, morphological and training profile.",
        "El PSL destaca en múltiples disciplinas — desde la alta escuela clásica hasta la equitación de campo. Su respuesta es el factor más determinante para definir el perfil genético, morfológico y de entrenamiento adecuado."
      ),
      icon: <Target className="text-[#C5A059]" size={28} />,
      weight: 2,
      options: [
        {
          text: tr("Alta Competição de Dressage", "High-Level Dressage Competition", "Alta Competición de Dressage"),
          description: tr(
            "Provas FEI internacionais (CDI/CDIO), Troféu Lusitano, ou Campeonato Nacional FEP. O PSL destaca-se nos exercícios de colecção — piaffe, passage e pirouettes —, valorizados em provas de Alto Nível.",
            "International FEI competitions (CDI/CDIO), Lusitano Trophy, or FEP National Championship. The PSL excels in collection exercises — piaffe, passage and pirouettes — valued at the highest levels.",
            "Pruebas FEI internacionales (CDI/CDIO), Trofeo Lusitano, o Campeonato Nacional FEP. El PSL destaca en los ejercicios de colección — piaffe, passage y pirouettes — valorados en pruebas de Alto Nivel."
          ),
          value: "dressage_comp",
          traits: ["competicao", "elegancia", "treino_avancado"],
          points: { competidor: 10, tradicional: 2, criador: 4, amador: 1, aprendiz: 0 },
        },
        {
          text: tr("Equitação de Trabalho / Toureio", "Working Equitation / Rejoneo", "Equitación de Trabajo / Rejoneo"),
          description: tr(
            "Modalidade que preserva a herança ancestral do Lusitano como cavalo de campo. Inclui provas de destreza, tenta, campo e toureio a cavalo, regulamentadas pela FEP. Exige aptidão funcional, robustez e responsividade.",
            "A discipline that preserves the ancestral heritage of the Lusitano as a field horse. Includes dexterity tests, tenta, field work and rejoneo, regulated by the FEP. Demands functional aptitude, robustness and responsiveness.",
            "Modalidad que preserva el legado ancestral del Lusitano como caballo de campo. Incluye pruebas de destreza, tenta, campo y rejoneo, reguladas por la FEP. Exige aptitud funcional, robustez y capacidad de respuesta."
          ),
          value: "trabalho",
          traits: ["tradicao", "versatilidade", "robustez"],
          points: { competidor: 3, tradicional: 10, criador: 3, amador: 2, aprendiz: 1 },
        },
        {
          text: tr("Alta Escola Clássica / Lazer", "Classical Haute École / Leisure", "Alta Escuela Clásica / Ocio"),
          description: tr(
            "Aprendizagem e progressão dentro da tradição ibérica, influenciada pelo legado da Escola Portuguesa de Arte Equestre e pelo ensinamento do Mestre Nuno Oliveira. Equitação como arte e prazer.",
            "Learning and progression within the Iberian tradition, influenced by the legacy of the Portuguese School of Equestrian Art and the teachings of Master Nuno Oliveira. Riding as art and pleasure.",
            "Aprendizaje y progresión dentro de la tradición ibérica, influenciada por el legado de la Escuela Portuguesa de Arte Ecuestre y la enseñanza del Maestro Nuno Oliveira. La equitación como arte y placer."
          ),
          value: "escola",
          traits: ["aprendizagem", "progressao", "escola"],
          points: { competidor: 4, tradicional: 3, criador: 2, amador: 8, aprendiz: 3 },
        },
        {
          text: tr("Reprodução e Melhoramento Genético", "Breeding and Genetic Improvement", "Reproducción y Mejora Genética"),
          description: tr(
            "Programa de criação com registo APSL, selecção por índice BLUP oficial, e preservação ou desenvolvimento das linhagens históricas do Puro Sangue Lusitano.",
            "Breeding programme with APSL registration, selection by official BLUP index, and preservation or development of the historical bloodlines of the Puro Sangue Lusitano.",
            "Programa de cría con registro APSL, selección por índice BLUP oficial, y preservación o desarrollo de los linajes históricos del Puro Sangre Lusitano."
          ),
          value: "criacao",
          traits: ["genetica", "linhagem", "morfologia"],
          points: { competidor: 2, tradicional: 3, criador: 10, amador: 1, aprendiz: 0 },
        },
      ],
    },
    {
      id: 2,
      category: tr("Experiência", "Experience", "Experiencia"),
      question: tr(
        "Qual é o seu nível de experiência equestre?",
        "What is your level of equestrian experience?",
        "¿Cuál es su nivel de experiencia ecuestre?"
      ),
      description: tr(
        "O PSL é reconhecido pela sua sensibilidade e cooperação natural com o cavaleiro — qualidades seleccionadas ao longo de séculos de equitação ibérica. Estas características exigem que o cavaleiro saiba interpretar e respeitar a linguagem do cavalo.",
        "The PSL is renowned for its sensitivity and natural cooperation with the rider — qualities selected over centuries of Iberian horsemanship. These characteristics require the rider to know how to interpret and respect the horse's language.",
        "El PSL es reconocido por su sensibilidad y cooperación natural con el jinete — cualidades seleccionadas a lo largo de siglos de equitación ibérica. Estas características exigen que el jinete sepa interpretar y respetar el lenguaje del caballo."
      ),
      icon: <GraduationCap className="text-[#C5A059]" size={28} />,
      weight: 1.5,
      options: [
        {
          text: tr("Iniciante (até 2 anos de prática)", "Beginner (up to 2 years of practice)", "Principiante (hasta 2 años de práctica)"),
          description: tr(
            "Ainda a desenvolver os fundamentos — assento independente, equilíbrio e uso das ajudas básicas. Um PSL bem treinado e de temperamento calmo é fundamental nesta fase para construir confiança e técnica.",
            "Still developing the fundamentals — independent seat, balance and use of basic aids. A well-trained PSL with a calm temperament is essential at this stage to build confidence and technique.",
            "Todavía desarrollando los fundamentos — asiento independiente, equilibrio y uso de las ayudas básicas. Un PSL bien entrenado y de temperamento calmado es fundamental en esta fase para construir confianza y técnica."
          ),
          value: "iniciante",
          traits: ["calmo", "seguro", "docil"],
          points: { competidor: 0, tradicional: 3, criador: 1, amador: 10, aprendiz: 4 },
        },
        {
          text: tr("Intermédio (2 a 5 anos)", "Intermediate (2 to 5 years)", "Intermedio (2 a 5 años)"),
          description: tr(
            "Domina os andamentos básicos, trabalho em duas pistas, e inicia o trabalho de colecção. Pode evoluir tecnicamente com um PSL de treino elementar a médio, equilibrado e cooperativo.",
            "Masters the basic gaits, lateral work, and begins collection work. Can progress technically with an elementary to medium trained PSL that is balanced and cooperative.",
            "Domina los aires básicos, el trabajo de dos pistas, e inicia el trabajo de colección. Puede evolucionar técnicamente con un PSL de entrenamiento elemental a medio, equilibrado y cooperativo."
          ),
          value: "intermedio",
          traits: ["versatil", "equilibrado"],
          points: { competidor: 4, tradicional: 6, criador: 3, amador: 7, aprendiz: 2 },
        },
        {
          text: tr("Avançado (5 a 10 anos)", "Advanced (5 to 10 years)", "Avanzado (5 a 10 años)"),
          description: tr(
            "Cavaleiro com técnica consolidada, capaz de trabalhar movimentos de colecção, laterais complexos, pirouettes e início de piaffe. Tira pleno partido da sensibilidade e expressão natural do PSL.",
            "Rider with consolidated technique, capable of working collection movements, complex laterals, pirouettes and beginning piaffe. Takes full advantage of the PSL's natural sensitivity and expression.",
            "Jinete con técnica consolidada, capaz de trabajar movimientos de colección, laterales complejos, pirouettes e inicio de piaffe. Saca pleno partido de la sensibilidad y expresión natural del PSL."
          ),
          value: "avancado",
          traits: ["desafiante", "sensivel"],
          points: { competidor: 8, tradicional: 7, criador: 5, amador: 4, aprendiz: 0 },
        },
        {
          text: tr("Profissional / Cavaleiro de Competição", "Professional / Competition Rider", "Profesional / Jinete de Competición"),
          description: tr(
            "Formação técnica sólida, experiência em competição nacional ou internacional, e capacidade de desenvolver cavalos jovens ou aperfeiçoar cavalos de alta escola. Domina a linguagem subtil que o PSL exige e aprecia.",
            "Solid technical training, experience in national or international competition, and ability to develop young horses or refine haute école horses. Masters the subtle language the PSL requires and appreciates.",
            "Formación técnica sólida, experiencia en competición nacional o internacional, y capacidad para desarrollar caballos jóvenes o perfeccionar caballos de alta escuela. Domina el lenguaje sutil que el PSL exige y aprecia."
          ),
          value: "profissional",
          traits: ["competicao", "alto_nivel", "elite"],
          points: { competidor: 10, tradicional: 5, criador: 6, amador: 1, aprendiz: 0 },
        },
      ],
    },
    {
      id: 3,
      category: tr("Temperamento", "Temperament", "Temperamento"),
      question: tr(
        "Que perfil de temperamento procura num Lusitano?",
        "What temperament profile are you looking for in a Lusitano?",
        "¿Qué perfil de temperamento busca en un Lusitano?"
      ),
      description: tr(
        "O PSL é historicamente seleccionado pelo seu brio, nobreza e cooperação com o cavaleiro — características valorizadas desde a equitação de guerra ibérica. Dentro da raça, existem perfis distintos que se adequam a diferentes cavaleiros e objectivos.",
        "The PSL has historically been selected for its brio, nobility and cooperation with the rider — characteristics valued since Iberian war horsemanship. Within the breed, there are distinct profiles suited to different riders and objectives.",
        "El PSL ha sido históricamente seleccionado por su brio, nobleza y cooperación con el jinete — características valoradas desde la equitación de guerra ibérica. Dentro de la raza, existen perfiles distintos que se adaptan a diferentes jinetes y objetivos."
      ),
      icon: <Heart className="text-[#C5A059]" size={28} />,
      weight: 1.5,
      options: [
        {
          text: tr("Calmo e de fácil manuseamento", "Calm and easy to handle", "Calmado y de fácil manejo"),
          description: tr(
            "PSL de temperamento gentil, seguro e previsível. Ideal para iniciantes, cavaleiros ocasionais, propriedade familiar ou programas de terapia equestre. Existe dentro da raça, especialmente em éguas de carácter dócil.",
            "PSL with a gentle, safe and predictable temperament. Ideal for beginners, occasional riders, family ownership or equine therapy programmes. Exists within the breed, especially in mares with a docile character.",
            "PSL de temperamento gentil, seguro y predecible. Ideal para principiantes, jinetes ocasionales, propiedad familiar o programas de terapia ecuestre. Existe dentro de la raza, especialmente en yeguas de carácter dócil."
          ),
          value: "muito_calmo",
          traits: ["calmo", "docil", "seguro"],
          points: { competidor: 1, tradicional: 5, criador: 2, amador: 10, aprendiz: 3 },
        },
        {
          text: tr("Equilibrado e cooperativo", "Balanced and cooperative", "Equilibrado y cooperativo"),
          description: tr(
            "O perfil mais versátil do PSL — sensato, trabalhador e com predisposição natural para a colecção sem ser excessivamente reactivo. Adequado à maioria dos cavaleiros e objectivos equestres.",
            "The most versatile PSL profile — sensible, willing and with a natural predisposition towards collection without being excessively reactive. Suited to the majority of riders and equestrian objectives.",
            "El perfil más versátil del PSL — sensato, trabajador y con predisposición natural hacia la colección sin ser excesivamente reactivo. Adecuado para la mayoría de los jinetes y objetivos ecuestres."
          ),
          value: "equilibrado",
          traits: ["equilibrado", "cooperativo"],
          points: { competidor: 6, tradicional: 8, criador: 5, amador: 7, aprendiz: 2 },
        },
        {
          text: tr("Sensível e reactivo às ajudas", "Sensitive and responsive to aids", "Sensible y reactivo a las ayudas"),
          description: tr(
            "PSL com elevada responsividade — responde a ajudas subtis, expressivo nos movimentos e com forte presença. Muito valorizado em alta escola e dressage de competição, mas exige cavaleiro experiente e mão quieta.",
            "PSL with high responsiveness — reacts to subtle aids, expressive in movement and with a strong presence. Highly valued in haute école and competition dressage, but requires an experienced rider with quiet hands.",
            "PSL con alta capacidad de respuesta — reacciona a ayudas sutiles, expresivo en los movimientos y con fuerte presencia. Muy valorado en alta escuela y dressage de competición, pero exige un jinete experimentado y mano tranquila."
          ),
          value: "sensivel",
          traits: ["sensivel", "reactivo", "expressivo"],
          points: { competidor: 9, tradicional: 4, criador: 6, amador: 2, aprendiz: 0 },
        },
        {
          text: tr("Com brio marcado — presença e vivacidade", "With marked brio — presence and vivacity", "Con brio marcado — presencia y vivacidad"),
          description: tr(
            "O «brio» é uma das qualidades mais distintivas e valorizadas no PSL: vivacidade, orgulho natural e vontade de trabalhar com entusiasmo. Característico de garanhões de elite e cavalos de alta escola e toureio.",
            "\"Brio\" is one of the most distinctive and valued qualities in the PSL: vivacity, natural pride and willingness to work with enthusiasm. Characteristic of elite stallions and haute école and rejoneo horses.",
            "El «brio» es una de las cualidades más distintivas y valoradas en el PSL: vivacidad, orgullo natural y voluntad de trabajar con entusiasmo. Característico de sementales de élite y caballos de alta escuela y rejoneo."
          ),
          value: "quente",
          traits: ["quente", "brio", "presenca"],
          points: { competidor: 10, tradicional: 3, criador: 4, amador: 1, aprendiz: 0 },
        },
      ],
    },
    {
      id: 4,
      category: tr("Morfologia", "Morphology", "Morfología"),
      question: tr(
        "Que características morfológicas mais valoriza no PSL?",
        "Which morphological characteristics do you value most in the PSL?",
        "¿Qué características morfológicas valora más en el PSL?"
      ),
      description: tr(
        "O padrão morfológico do PSL é definido pela APSL e distingue-se pela cabeça sub-convexa, pescoço arqueado em forma de lança, garupa arredondada e crinas e cauda abundantes. Cada tipo morfológico reflecte aptidões funcionais distintas.",
        "The morphological standard of the PSL is defined by the APSL and is characterised by the sub-convex head, arched lance-shaped neck, rounded croup and abundant mane and tail. Each morphological type reflects distinct functional aptitudes.",
        "El patrón morfológico del PSL es definido por la APSL y se distingue por la cabeza sub-convexa, cuello arqueado en forma de lanza, grupa redondeada y crines y cola abundantes. Cada tipo morfológico refleja aptitudes funcionales distintas."
      ),
      icon: <Activity className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("Movimentos naturalmente elevados e expressivos", "Naturally elevated and expressive movement", "Movimientos naturalmente elevados y expresivos"),
          description: tr(
            "Cadência, suspensão e elasticidade naturais nos três andamentos básicos — fundamentais para a pontuação em dressage FEI e para a execução dos exercícios de alta escola como piaffe, passage e levade.",
            "Natural cadence, suspension and elasticity in the three basic gaits — fundamental for FEI dressage scoring and for performing haute école exercises such as piaffe, passage and levade.",
            "Cadencia, suspensión y elasticidad naturales en los tres aires básicos — fundamentales para la puntuación en dressage FEI y para la ejecución de los ejercicios de alta escuela como piaffe, passage y levade."
          ),
          value: "movimentos",
          traits: ["movimentos", "elegancia", "dressage"],
          points: { competidor: 10, tradicional: 2, criador: 6, amador: 3, aprendiz: 1 },
        },
        {
          text: tr("Estrutura sólida e aptidão funcional", "Solid structure and functional aptitude", "Estructura sólida y aptitud funcional"),
          description: tr(
            "Ossatura robusta, musculatura compacta, dorso curto e articulações fortes. Características que o tipo Andrade privilegia para o trabalho de campo, equitação de trabalho e provas de resistência e agilidade.",
            "Robust bone structure, compact musculature, short back and strong joints. Characteristics favoured by the Andrade type for field work, working equitation and endurance and agility tests.",
            "Osamenta robusta, musculatura compacta, dorso corto y articulaciones fuertes. Características que el tipo Andrade privilegia para el trabajo de campo, equitación de trabajo y pruebas de resistencia y agilidad."
          ),
          value: "robusto",
          traits: ["robusto", "forte", "resistente"],
          points: { competidor: 3, tradicional: 10, criador: 5, amador: 4, aprendiz: 2 },
        },
        {
          text: tr("Tipicidade racial e beleza clássica ibérica", "Breed typicality and classical Iberian beauty", "Tipicidad racial y belleza clásica ibérica"),
          description: tr(
            "Perfil sub-convexo pronunciado, pescoço arqueado de implantação alta, crinas e cauda abundantes e sedosas, garupa arredondada. A expressão máxima do tipo ibérico que define o padrão oficial APSL.",
            "Pronounced sub-convex profile, arched neck with high placement, abundant and silky mane and tail, rounded croup. The ultimate expression of the Iberian type that defines the official APSL standard.",
            "Perfil sub-convexo pronunciado, cuello arqueado de inserción alta, crines y cola abundantes y sedosas, grupa redondeada. La expresión máxima del tipo ibérico que define el patrón oficial APSL."
          ),
          value: "beleza",
          traits: ["beleza", "tipicidade", "morfologia"],
          points: { competidor: 5, tradicional: 5, criador: 10, amador: 5, aprendiz: 1 },
        },
        {
          text: tr("Conforto e acessibilidade para o cavaleiro", "Comfort and accessibility for the rider", "Comodidad y accesibilidad para el jinete"),
          description: tr(
            "Andamentos naturalmente cómodos com dorso elástico e absorvente, temperamento receptivo e carácter cooperativo. Qualidades que facilitam a aprendizagem e tornam a equitação um prazer acessível.",
            "Naturally comfortable gaits with an elastic and shock-absorbing back, receptive temperament and cooperative character. Qualities that facilitate learning and make riding an accessible pleasure.",
            "Aires naturalmente cómodos con dorso elástico y absorbente, temperamento receptivo y carácter cooperativo. Cualidades que facilitan el aprendizaje y hacen de la equitación un placer accesible."
          ),
          value: "conforto",
          traits: ["confortavel", "facil", "lazer"],
          points: { competidor: 2, tradicional: 4, criador: 2, amador: 10, aprendiz: 3 },
        },
      ],
    },
    {
      id: 5,
      category: tr("Genética e Linhagem", "Genetics and Bloodlines", "Genética y Linajes"),
      question: tr(
        "Qual a importância da linhagem e do índice BLUP na sua decisão?",
        "How important are bloodlines and the BLUP index in your decision?",
        "¿Qué importancia tienen los linajes y el índice BLUP en su decisión?"
      ),
      description: tr(
        "O Livro Genealógico do PSL é gerido pela APSL. O índice BLUP (Best Linear Unbiased Prediction) é a ferramenta oficial para estimar o mérito genético de reprodutores, calculado com base no desempenho de descendentes em provas morfológicas e funcionais.",
        "The PSL Studbook is managed by the APSL. The BLUP index (Best Linear Unbiased Prediction) is the official tool for estimating the genetic merit of breeding animals, calculated based on the performance of offspring in morphological and functional tests.",
        "El Libro Genealógico del PSL es administrado por la APSL. El índice BLUP (Best Linear Unbiased Prediction) es la herramienta oficial para estimar el mérito genético de los reproductores, calculado en base al rendimiento de los descendientes en pruebas morfológicas y funcionales."
      ),
      icon: <TreeDeciduous className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("BLUP elevado e pedigree de elite são indispensáveis", "High BLUP and elite pedigree are essential", "BLUP elevado y pedigree de élite son indispensables"),
          description: tr(
            "Apenas considero reprodutores ou descendentes com índice BLUP superior e linhagem comprovada — Veiga, Andrade, ou outras famílias de mérito reconhecido pela APSL com ancestrais aprovados em provas.",
            "I only consider breeding animals or offspring with superior BLUP index and proven bloodlines — Veiga, Andrade, or other families of recognised merit by the APSL with ancestors approved in tests.",
            "Solo considero reproductores o descendientes con índice BLUP superior y linaje comprobado — Veiga, Andrade, u otras familias de mérito reconocido por la APSL con ancestros aprobados en pruebas."
          ),
          value: "elite",
          traits: ["linhagem_elite", "pedigree"],
          points: { competidor: 6, tradicional: 4, criador: 10, amador: 1 },
        },
        {
          text: tr("Valorizo boas origens, mas avalio o cavalo individualmente", "I value good origins, but assess the horse individually", "Valoro buenos orígenes, pero evalúo el caballo individualmente"),
          description: tr(
            "O pedigree e o BLUP são factores importantes de triagem, mas o indivíduo — morfologia, temperamento e qualidade dos movimentos — tem igual ou maior peso na decisão final.",
            "Pedigree and BLUP are important screening factors, but the individual — morphology, temperament and movement quality — carries equal or greater weight in the final decision.",
            "El pedigree y el BLUP son factores importantes de criba, pero el individuo — morfología, temperamento y calidad de los movimientos — tiene igual o mayor peso en la decisión final."
          ),
          value: "importante",
          traits: ["linhagem", "origens"],
          points: { competidor: 7, tradicional: 6, criador: 8, amador: 3 },
        },
        {
          text: tr("O cavalo individual supera o pedigree", "The individual horse surpasses the pedigree", "El caballo individual supera el pedigree"),
          description: tr(
            "Valorizo o registo APSL como garantia de pureza racial, mas o que mais importa é o que o cavalo apresenta em aptidão funcional, saúde, carácter e movimentos — o indivíduo acima da genealogia.",
            "I value APSL registration as a guarantee of breed purity, but what matters most is what the horse presents in functional aptitude, health, character and movement — the individual above genealogy.",
            "Valoro el registro APSL como garantía de pureza racial, pero lo que más importa es lo que el caballo presenta en aptitud funcional, salud, carácter y movimientos — el individuo por encima de la genealogía."
          ),
          value: "relevante",
          traits: ["individuo"],
          points: { competidor: 5, tradicional: 7, criador: 4, amador: 5 },
        },
        {
          text: tr("Pouca relevância — o resultado prático é o que conta", "Little relevance — practical results are what matter", "Poca relevancia — el resultado práctico es lo que cuenta"),
          description: tr(
            "Interessa-me o cavalo que está à minha frente e o que consegue fazer comigo. Prefiro investir em treino e saúde do que num pedigree selecto que não se traduz em desempenho real.",
            "I care about the horse in front of me and what it can do with me. I prefer to invest in training and health rather than a select pedigree that doesn't translate into real performance.",
            "Me interesa el caballo que tengo delante y lo que puede hacer conmigo. Prefiero invertir en entrenamiento y salud que en un pedigree selecto que no se traduce en rendimiento real."
          ),
          value: "pouco",
          traits: ["pratico", "funcional"],
          points: { competidor: 3, tradicional: 5, criador: 1, amador: 8 },
        },
      ],
    },
    {
      id: 6,
      category: tr("Treino", "Training", "Entrenamiento"),
      question: tr(
        "Que nível de treino prefere no cavalo que vai adquirir?",
        "What level of training do you prefer in the horse you are acquiring?",
        "¿Qué nivel de entrenamiento prefiere en el caballo que va a adquirir?"
      ),
      description: tr(
        "Cavalos com mais treino têm valores de mercado superiores, mas oferecem resultados imediatos e menor risco. Cavalos jovens ou desbravados requerem mais tempo e competência técnica, mas permitem desenvolver uma ligação única cavaleiro-cavalo.",
        "More trained horses have higher market values, but offer immediate results and lower risk. Young or green horses require more time and technical expertise, but allow a unique rider-horse bond to develop.",
        "Los caballos con más entrenamiento tienen valores de mercado superiores, pero ofrecen resultados inmediatos y menor riesgo. Los caballos jóvenes o sin desbravar requieren más tiempo y competencia técnica, pero permiten desarrollar un vínculo único jinete-caballo."
      ),
      icon: <TrendingUp className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("Desbravado / Início de trabalho", "Green / Start of work", "Desbravado / Inicio de trabajo"),
          description: tr(
            "Cavalo jovem (3-4 anos) a iniciar o processo de habituação e desbravamento. Ideal para cavaleiros experientes que querem desenvolver um PSL «desde o zero» segundo os seus critérios e método.",
            "Young horse (3-4 years) beginning the habituation and backing process. Ideal for experienced riders who want to develop a PSL 'from scratch' according to their criteria and method.",
            "Caballo joven (3-4 años) iniciando el proceso de habituación y desbravamiento. Ideal para jinetes experimentados que quieren desarrollar un PSL «desde cero» según sus criterios y método."
          ),
          value: "desbravado",
          traits: ["jovem", "potencial"],
          points: { competidor: 7, tradicional: 5, criador: 8, amador: 2 },
        },
        {
          text: tr("Trabalho básico (nível Elementar/Fácil)", "Basic work (Elementary/Easy level)", "Trabajo básico (nivel Elemental/Fácil)"),
          description: tr(
            "Domina os andamentos controlados, trabalho longitudinal e início das duas pistas. Pronto para evoluir com o cavaleiro. Equivalente ao nível E/F nas escalas FEP de dressage.",
            "Masters controlled gaits, longitudinal work and the beginning of lateral work. Ready to progress with the rider. Equivalent to E/F level on the FEP dressage scales.",
            "Domina los aires controlados, el trabajo longitudinal e inicio de las dos pistas. Listo para evolucionar con el jinete. Equivalente al nivel E/F en las escalas FEP de dressage."
          ),
          value: "basico",
          traits: ["basico", "progressao"],
          points: { competidor: 5, tradicional: 6, criador: 4, amador: 7 },
        },
        {
          text: tr("Trabalho médio (nível Médio/Superior)", "Medium work (Medium/Advanced level)", "Trabajo medio (nivel Medio/Superior)"),
          description: tr(
            "Domina trabalho em duas pistas avançado, começo de colecção, piafar e inicio de passage. Equivalente aos níveis M/S nas escalas FEP. Adequado para cavaleiros avançados e competição regional.",
            "Masters advanced lateral work, beginning of collection, piaffe work and start of passage. Equivalent to M/S levels on the FEP scales. Suitable for advanced riders and regional competition.",
            "Domina el trabajo de dos pistas avanzado, inicio de colección, inicio de piaffe e inicio de passage. Equivalente a los niveles M/S en las escalas FEP. Adecuado para jinetes avanzados y competición regional."
          ),
          value: "medio",
          traits: ["treinado", "medio"],
          points: { competidor: 8, tradicional: 4, criador: 3, amador: 5 },
        },
        {
          text: tr("Alta Escola / Grand Prix", "Haute École / Grand Prix", "Alta Escuela / Grand Prix"),
          description: tr(
            "Cavalo de alta escola completo ou de Grand Prix FEI — domina piaffe, passage, pirouettes, cabriola ou outros airs above the ground. O nível mais exigente e de maior valor no mundo do PSL.",
            "Complete haute école or FEI Grand Prix horse — masters piaffe, passage, pirouettes, capriole or other airs above the ground. The most demanding and highest value level in the world of PSL.",
            "Caballo de alta escuela completo o de Grand Prix FEI — domina piaffe, passage, pirouettes, cabriola u otros airs above the ground. El nivel más exigente y de mayor valor en el mundo del PSL."
          ),
          value: "gp",
          traits: ["gp", "alta_escola", "elite"],
          points: { competidor: 10, tradicional: 2, criador: 2, amador: 1 },
        },
      ],
    },
    {
      id: 7,
      category: tr("Investimento", "Investment", "Inversión"),
      question: tr(
        "Qual é o seu orçamento para aquisição?",
        "What is your budget for acquisition?",
        "¿Cuál es su presupuesto para la adquisición?"
      ),
      description: tr(
        "O valor de um PSL reflecte o cruzamento de múltiplos factores: nível de treino, qualidade do pedigree, índice BLUP, morfologia, histórico competitivo e potencial de mercado. O mercado lusitano internacional é activo e crescente.",
        "The value of a PSL reflects the intersection of multiple factors: training level, pedigree quality, BLUP index, morphology, competitive history and market potential. The international Lusitano market is active and growing.",
        "El valor de un PSL refleja el cruce de múltiples factores: nivel de entrenamiento, calidad del pedigree, índice BLUP, morfología, historial competitivo y potencial de mercado. El mercado lusitano internacional es activo y creciente."
      ),
      icon: <DollarSign className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("Até 15.000 €", "Up to €15,000", "Hasta 15.000 €"),
          description: tr(
            "Poldros, cavalos jovens desbravados, ou PSL de lazer sem pretensões competitivas. Boa opção para primeiros proprietários ou para quem quer desenvolver um projecto de longo prazo com paciência.",
            "Foals, young green horses, or leisure PSL without competitive ambitions. A good option for first-time owners or those who want to develop a long-term project with patience.",
            "Potros, caballos jóvenes desbravados, o PSL de ocio sin pretensiones competitivas. Buena opción para primeros propietarios o para quienes quieren desarrollar un proyecto a largo plazo con paciencia."
          ),
          value: "economico",
          traits: ["acessivel", "entrada"],
          points: { competidor: 1, tradicional: 5, criador: 6, amador: 10 },
        },
        {
          text: tr("15.000 € — 35.000 €", "€15,000 — €35,000", "15.000 € — 35.000 €"),
          description: tr(
            "Cavalos com treino básico a médio, bom pedigree e potencial para competição regional. Faixa de mercado mais activa em Portugal para PSL de qualidade com registo APSL definitivo.",
            "Horses with basic to medium training, good pedigree and potential for regional competition. The most active market range in Portugal for quality PSL with full APSL registration.",
            "Caballos con entrenamiento básico a medio, buen pedigree y potencial para competición regional. Franja de mercado más activa en Portugal para PSL de calidad con registro APSL definitivo."
          ),
          value: "medio",
          traits: ["qualidade", "treinado"],
          points: { competidor: 4, tradicional: 8, criador: 5, amador: 7 },
        },
        {
          text: tr("35.000 € — 75.000 €", "€35,000 — €75,000", "35.000 € — 75.000 €"),
          description: tr(
            "Cavalos de competição com historial em provas nacionais, reprodutores aprovados em provas APSL, ou PSL de morfologia e movimentos excepcionais. Investimento com potencial de valorização.",
            "Competition horses with a history in national competitions, breeding animals approved in APSL tests, or PSL with exceptional morphology and movement. Investment with appreciation potential.",
            "Caballos de competición con historial en pruebas nacionales, reproductores aprobados en pruebas APSL, o PSL de morfología y movimientos excepcionales. Inversión con potencial de revalorización."
          ),
          value: "alto",
          traits: ["premium", "competicao"],
          points: { competidor: 8, tradicional: 5, criador: 8, amador: 3 },
        },
        {
          text: tr("Acima de 75.000 €", "Above €75,000", "Por encima de 75.000 €"),
          description: tr(
            "Cavalos de Grand Prix FEI, reprodutores de elite com BLUP superior, ou PSL com historial internacional e morfologia de exposição. O segmento premium do mercado lusitano global.",
            "FEI Grand Prix horses, elite breeding animals with superior BLUP, or PSL with international history and show morphology. The premium segment of the global Lusitano market.",
            "Caballos de Grand Prix FEI, reproductores de élite con BLUP superior, o PSL con historial internacional y morfología de exposición. El segmento premium del mercado lusitano global."
          ),
          value: "premium",
          traits: ["elite", "excepcional", "topo"],
          points: { competidor: 10, tradicional: 3, criador: 10, amador: 1 },
        },
      ],
    },
    {
      id: 8,
      category: tr("Dedicação", "Dedication", "Dedicación"),
      question: tr(
        "Quanto tempo pode dedicar ao cavalo semanalmente?",
        "How much time can you dedicate to the horse weekly?",
        "¿Cuánto tiempo puede dedicar al caballo semanalmente?"
      ),
      description: tr(
        "O PSL responde bem ao trabalho regular e consistente — a sua inteligência e memória permitem progressão sólida com treino frequente. A disponibilidade condiciona directamente o tipo de cavalo e nível de treino adequados.",
        "The PSL responds well to regular and consistent work — its intelligence and memory allow solid progression with frequent training. Your availability directly conditions the type of horse and training level appropriate for you.",
        "El PSL responde bien al trabajo regular y consistente — su inteligencia y memoria permiten una progresión sólida con entrenamiento frecuente. La disponibilidad condiciona directamente el tipo de caballo y nivel de entrenamiento adecuados."
      ),
      icon: <Clock className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("Diariamente (5 a 7 dias por semana)", "Daily (5 to 7 days per week)", "Diariamente (5 a 7 días por semana)"),
          description: tr(
            "Regime de treino intensivo com trabalho diário. Permite desenvolver um PSL jovem, manter um cavalo de competição em forma de prova, ou gerir um programa de reprodução activo.",
            "Intensive training regime with daily work. Allows developing a young PSL, keeping a competition horse in race fitness, or managing an active breeding programme.",
            "Régimen de entrenamiento intensivo con trabajo diario. Permite desarrollar un PSL joven, mantener un caballo de competición en forma de prueba, o gestionar un programa de reproducción activo."
          ),
          value: "diario",
          traits: ["competicao", "dedicado", "atleta"],
          points: { competidor: 10, tradicional: 6, criador: 5, amador: 3 },
        },
        {
          text: tr("Frequente (3 a 4 dias por semana)", "Frequent (3 to 4 days per week)", "Frecuente (3 a 4 días por semana)"),
          description: tr(
            "Treino regular que permite progressão consistente e manutenção do nível de trabalho. Adequado para competição regional e para desenvolver um PSL de forma equilibrada e sem stresse.",
            "Regular training allowing consistent progression and maintenance of the work level. Suitable for regional competition and developing a PSL in a balanced and stress-free way.",
            "Entrenamiento regular que permite una progresión consistente y el mantenimiento del nivel de trabajo. Adecuado para competición regional y para desarrollar un PSL de forma equilibrada y sin estrés."
          ),
          value: "frequente",
          traits: ["ativo", "progresso"],
          points: { competidor: 7, tradicional: 8, criador: 4, amador: 6 },
        },
        {
          text: tr("Fins de semana (1 a 2 dias)", "Weekends (1 to 2 days)", "Fines de semana (1 a 2 días)"),
          description: tr(
            "Equitação recreativa e de lazer. Requer um PSL bem treinado, de temperamento calmo e que mantenha a sua forma com trabalho menos frequente — habitualmente cavalos mais velhos e experientes.",
            "Recreational and leisure riding. Requires a well-trained PSL with a calm temperament that maintains its condition with less frequent work — typically older, more experienced horses.",
            "Equitación recreativa y de ocio. Requiere un PSL bien entrenado, de temperamento calmado y que mantenga su forma con trabajo menos frecuente — habitualmente caballos más mayores y experimentados."
          ),
          value: "weekend",
          traits: ["lazer", "familiar"],
          points: { competidor: 2, tradicional: 5, criador: 3, amador: 10 },
        },
        {
          text: tr("Proprietário com gestão delegada", "Owner with delegated management", "Propietario con gestión delegada"),
          description: tr(
            "O cavalo ficará predominantemente ao cuidado de treinadores ou tratadores profissionais. Comum em programas de reprodução, cavalos de competição de alto nível, ou investidores do sector equestre.",
            "The horse will predominantly be in the care of professional trainers or grooms. Common in breeding programmes, high-level competition horses, or equestrian sector investors.",
            "El caballo estará predominantemente al cuidado de entrenadores o cuidadores profesionales. Común en programas de reproducción, caballos de competición de alto nivel, o inversores del sector ecuestre."
          ),
          value: "ausente",
          traits: ["profissional", "delegado"],
          points: { competidor: 5, tradicional: 3, criador: 8, amador: 4 },
        },
      ],
    },
    {
      id: 9,
      category: tr("Região", "Region", "Región"),
      question: tr(
        "Em que região de Portugal procura o seu Lusitano?",
        "In which region of Portugal are you looking for your Lusitano?",
        "¿En qué región de Portugal busca su Lusitano?"
      ),
      description: tr(
        "Portugal concentra a maior densidade de criadores de PSL do mundo. Cada região tem tradições equestres específicas, tipos morfológicos predominantes e redes de coudelarias com características distintas.",
        "Portugal concentrates the highest density of PSL breeders in the world. Each region has specific equestrian traditions, predominant morphological types and stud farm networks with distinct characteristics.",
        "Portugal concentra la mayor densidad de criadores de PSL del mundo. Cada región tiene tradiciones ecuestres específicas, tipos morfológicos predominantes y redes de yeguadas con características distintas."
      ),
      icon: <Compass className="text-[#C5A059]" size={28} />,
      weight: 0.5,
      options: [
        {
          text: tr("Ribatejo", "Ribatejo", "Ribatejo"),
          description: tr(
            "Coração equestre de Portugal, berço da tradição campeira e da toureio a cavalo. Sede da Feira Nacional do Cavalo de Golega (Novembro) — o maior evento lusitano do mundo. Forte presença de linhagens tradicionais de campo.",
            "The equestrian heart of Portugal, birthplace of the campeiro tradition and rejoneo. Home of the National Horse Fair of Golegã (November) — the world's largest Lusitano event. Strong presence of traditional field bloodlines.",
            "Corazón ecuestre de Portugal, cuna de la tradición campera y del rejoneo. Sede de la Feria Nacional del Caballo de Golegã (noviembre) — el mayor evento lusitano del mundo. Fuerte presencia de linajes tradicionales de campo."
          ),
          value: "ribatejo",
          traits: ["ribatejo", "tradicao"],
          points: { competidor: 7, tradicional: 10, criador: 8, amador: 5 },
        },
        {
          text: tr("Alentejo", "Alentejo", "Alentejo"),
          description: tr(
            "Grandes coudelarias extensivas, tradição de campo e criação em liberdade. Cavalos com morfologia robusta e aptidão funcional. Região com forte presença de coudelarias familiares históricas.",
            "Large extensive stud farms, field tradition and free-range breeding. Horses with robust morphology and functional aptitude. Region with a strong presence of historic family stud farms.",
            "Grandes yeguadas extensivas, tradición de campo y cría en libertad. Caballos con morfología robusta y aptitud funcional. Región con fuerte presencia de yeguadas familiares históricas."
          ),
          value: "alentejo",
          traits: ["alentejo", "coudelaria"],
          points: { competidor: 6, tradicional: 9, criador: 9, amador: 4 },
        },
        {
          text: tr("Lisboa / Grande Centro / Setúbal", "Lisbon / Greater Centre / Setúbal", "Lisboa / Gran Centro / Setúbal"),
          description: tr(
            "Proximidade a centros hípicos de referência, maior facilidade logística e acesso a treinadores internacionais. Região com crescente actividade de dressage competitiva e alta escola.",
            "Proximity to reference equestrian centres, greater logistical ease and access to international trainers. Region with growing competitive dressage and haute école activity.",
            "Proximidad a centros hípicos de referencia, mayor facilidad logística y acceso a entrenadores internacionales. Región con creciente actividad de dressage competitivo y alta escuela."
          ),
          value: "lisboa",
          traits: ["lisboa", "acessivel"],
          points: { competidor: 5, tradicional: 4, criador: 4, amador: 8 },
        },
        {
          text: tr("Qualquer região / Procura internacional", "Any region / International search", "Cualquier región / Búsqueda internacional"),
          description: tr(
            "A qualidade do cavalo supera qualquer consideração geográfica. Disponível para procurar em Portugal e no estrangeiro — Brasil, Espanha, ou outros países com criação PSL reconhecida.",
            "The quality of the horse surpasses any geographical consideration. Available to search in Portugal and abroad — Brazil, Spain, or other countries with recognised PSL breeding.",
            "La calidad del caballo supera cualquier consideración geográfica. Disponible para buscar en Portugal y en el extranjero — Brasil, España, u otros países con cría PSL reconocida."
          ),
          value: "qualquer",
          traits: ["flexivel", "internacional"],
          points: { competidor: 8, tradicional: 5, criador: 7, amador: 6 },
        },
      ],
    },
    {
      id: 10,
      category: tr("Visão", "Vision", "Visión"),
      question: tr(
        "Onde se imagina daqui a 5 anos com este cavalo?",
        "Where do you see yourself in 5 years with this horse?",
        "¿Dónde se imagina dentro de 5 años con este caballo?"
      ),
      description: tr(
        "Visualizar o objectivo a médio prazo é essencial para fazer a escolha certa hoje. O PSL tem uma vida útil longa — muitos cavalos mantêm-se activos em competição ou trabalho até aos 18-20 anos.",
        "Visualising the medium-term objective is essential to making the right choice today. The PSL has a long working life — many horses remain active in competition or work until 18-20 years of age.",
        "Visualizar el objetivo a medio plazo es esencial para hacer la elección correcta hoy. El PSL tiene una larga vida útil — muchos caballos se mantienen activos en competición o trabajo hasta los 18-20 años."
      ),
      icon: <Sparkles className="text-[#C5A059]" size={28} />,
      weight: 1.5,
      options: [
        {
          text: tr("A competir a nível internacional", "Competing at international level", "Compitiendo a nivel internacional"),
          description: tr(
            "Provas FEI — CDI, CDIO, Campeonatos da Europa ou Mundiais. Para este objectivo, o PSL necessita de movimentos excepcionais, pedigree de competição e um programa de treino de elite.",
            "FEI competitions — CDI, CDIO, European or World Championships. For this objective, the PSL needs exceptional movement, competition pedigree and an elite training programme.",
            "Pruebas FEI — CDI, CDIO, Campeonatos de Europa o Mundiales. Para este objetivo, el PSL necesita movimientos excepcionales, pedigree de competición y un programa de entrenamiento de élite."
          ),
          value: "internacional",
          traits: ["internacional", "elite"],
          points: { competidor: 10, tradicional: 2, criador: 3, amador: 0 },
        },
        {
          text: tr("A competir a nível nacional", "Competing at national level", "Compitiendo a nivel nacional"),
          description: tr(
            "Campeonatos nacionais FEP, Troféu Lusitano, provas de equitação de trabalho, ou ranking nacional de dressage. Objectivo exigente mas acessível com o cavalo e treino certos.",
            "FEP national championships, Lusitano Trophy, working equitation competitions, or national dressage ranking. A demanding but achievable objective with the right horse and training.",
            "Campeonatos nacionales FEP, Trofeo Lusitano, pruebas de equitación de trabajo, o ranking nacional de dressage. Objetivo exigente pero accesible con el caballo y entrenamiento adecuados."
          ),
          value: "nacional",
          traits: ["nacional", "competicao"],
          points: { competidor: 8, tradicional: 6, criador: 4, amador: 2 },
        },
        {
          text: tr("A evoluir tecnicamente e a desfrutar", "Progressing technically and enjoying", "Evolucionando técnicamente y disfrutando"),
          description: tr(
            "Progressão na alta escola clássica, melhoria técnica consistente, talvez provas regionais. O objectivo é a qualidade da relação cavaleiro-cavalo e o prazer do trabalho bem feito.",
            "Progression in classical haute école, consistent technical improvement, perhaps regional competitions. The objective is the quality of the rider-horse relationship and the pleasure of work well done.",
            "Progresión en la alta escuela clásica, mejora técnica consistente, quizás pruebas regionales. El objetivo es la calidad de la relación jinete-caballo y el placer del trabajo bien hecho."
          ),
          value: "evolucao",
          traits: ["evolucao", "escola"],
          points: { competidor: 4, tradicional: 5, criador: 3, amador: 8 },
        },
        {
          text: tr("A construir um programa de criação", "Building a breeding programme", "Construyendo un programa de cría"),
          description: tr(
            "Programa de criação PSL com éguas de ventre seleccionadas, cruzamentos planeados por BLUP e objectivo de produzir poldros com registo APSL definitivo de qualidade superior.",
            "PSL breeding programme with selected broodmares, matings planned by BLUP and the objective of producing foals with full APSL registration of superior quality.",
            "Programa de cría PSL con yeguas madre seleccionadas, cruzamientos planificados por BLUP y objetivo de producir potros con registro APSL definitivo de calidad superior."
          ),
          value: "criacao",
          traits: ["criacao", "reproducao"],
          points: { competidor: 2, tradicional: 4, criador: 10, amador: 3 },
        },
      ],
    },
    {
      id: 11,
      category: tr("Infraestrutura", "Infrastructure", "Infraestructura"),
      question: tr(
        "Que infraestrutura tem disponível para albergar o cavalo?",
        "What infrastructure do you have available to house the horse?",
        "¿Qué infraestructura tiene disponible para albergar al caballo?"
      ),
      description: tr(
        "As instalações condicionam directamente o bem-estar do PSL e as possibilidades de treino. Um cavalo de alta escola ou reprodução activa exige instalações de qualidade superior às necessárias para um PSL de lazer.",
        "The facilities directly condition the PSL's wellbeing and training possibilities. A haute école or active breeding horse requires higher quality facilities than those needed for a leisure PSL.",
        "Las instalaciones condicionan directamente el bienestar del PSL y las posibilidades de entrenamiento. Un caballo de alta escuela o reproducción activa exige instalaciones de calidad superior a las necesarias para un PSL de ocio."
      ),
      icon: <Building className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("Centro hípico de nível profissional", "Professional-level equestrian centre", "Centro hípico de nivel profesional"),
          description: tr(
            "Picadeiro coberto com piso técnico, pista exterior, paddocks individuais, boxes espaçosas, sala de selagem e apoio veterinário próximo. Condições ideais para treino de competição.",
            "Covered arena with technical footing, outdoor track, individual paddocks, spacious stalls, tack room and nearby veterinary support. Ideal conditions for competition training.",
            "Picadero cubierto con suelo técnico, pista exterior, paddocks individuales, boxes espaciosas, sala de silla y apoyo veterinario cercano. Condiciones ideales para el entrenamiento de competición."
          ),
          value: "completo",
          traits: ["profissional", "premium"],
          points: { competidor: 10, tradicional: 5, criador: 7, amador: 4 },
        },
        {
          text: tr("Pensão em centro hípico", "Livery at equestrian centre", "Pensión en centro hípico"),
          description: tr(
            "Box em centro hípico com acesso a picadeiro e serviços básicos. Solução mais comum e prática para a maioria dos proprietários, com a vantagem da comunidade equestre e apoio disponível.",
            "Stall at an equestrian centre with access to arena and basic services. The most common and practical solution for most owners, with the advantage of the equestrian community and available support.",
            "Box en centro hípico con acceso a picadero y servicios básicos. La solución más común y práctica para la mayoría de los propietarios, con la ventaja de la comunidad ecuestre y el apoyo disponible."
          ),
          value: "pensao",
          traits: ["acessivel", "conveniente"],
          points: { competidor: 6, tradicional: 6, criador: 3, amador: 8 },
        },
        {
          text: tr("Instalações próprias básicas", "Basic own facilities", "Instalaciones propias básicas"),
          description: tr(
            "Box e paddock próprios, com acesso a campo ou pista exterior. Maior autonomia e liberdade para o cavalo, mas sem picadeiro coberto. Adequado para tradição campeira e lazer.",
            "Own stall and paddock, with access to field or outdoor track. Greater autonomy and freedom for the horse, but without a covered arena. Suitable for the campeiro tradition and leisure.",
            "Box y paddock propios, con acceso a campo o pista exterior. Mayor autonomía y libertad para el caballo, pero sin picadero cubierto. Adecuado para la tradición campera y el ocio."
          ),
          value: "proprio_basico",
          traits: ["independente", "tradicional"],
          points: { competidor: 3, tradicional: 9, criador: 6, amador: 5 },
        },
        {
          text: tr("Coudelaria ou propriedade rural", "Stud farm or rural property", "Yeguada o propiedad rural"),
          description: tr(
            "Grande propriedade com múltiplas boxes, pastagens, picadeiro e infraestrutura de criação. Permite manter éguas de ventre, poldros e um programa de reprodução completo.",
            "Large property with multiple stalls, pastures, arena and breeding infrastructure. Allows keeping broodmares, foals and a complete breeding programme.",
            "Gran propiedad con múltiples boxes, pastizales, picadero e infraestructura de cría. Permite mantener yeguas madre, potros y un programa de reproducción completo."
          ),
          value: "coudelaria",
          traits: ["criador", "extensivo"],
          points: { competidor: 5, tradicional: 7, criador: 10, amador: 2 },
        },
      ],
    },
    {
      id: 12,
      category: tr("Experiência como Proprietário", "Experience as Owner", "Experiencia como Propietario"),
      question: tr(
        "Qual é a sua experiência como proprietário de cavalos?",
        "What is your experience as a horse owner?",
        "¿Cuál es su experiencia como propietario de caballos?"
      ),
      description: tr(
        "Ser proprietário de um PSL implica responsabilidades que vão muito além da equitação: gestão veterinária, nutrição, ferragem, maneio e bem-estar geral. A experiência prévia influencia o tipo de cavalo mais adequado.",
        "Owning a PSL implies responsibilities that go far beyond riding: veterinary management, nutrition, farriery, handling and general wellbeing. Prior experience influences the most suitable type of horse.",
        "Ser propietario de un PSL implica responsabilidades que van mucho más allá de la equitación: gestión veterinaria, nutrición, herraje, manejo y bienestar general. La experiencia previa influye en el tipo de caballo más adecuado."
      ),
      icon: <UserCheck className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("Primeiro cavalo", "First horse", "Primer caballo"),
          description: tr(
            "Será a minha primeira experiência como proprietário. Estou a aprender sobre gestão equina, rotinas de maneio e responsabilidades legais. Precisarei de apoio próximo de profissionais experientes.",
            "This will be my first experience as an owner. I am learning about equine management, handling routines and legal responsibilities. I will need close support from experienced professionals.",
            "Será mi primera experiencia como propietario. Estoy aprendiendo sobre gestión equina, rutinas de manejo y responsabilidades legales. Necesitaré el apoyo cercano de profesionales experimentados."
          ),
          value: "primeiro",
          traits: ["novato", "aprendizagem"],
          points: { competidor: 2, tradicional: 4, criador: 1, amador: 10 },
        },
        {
          text: tr("Já tive 1 a 2 cavalos", "I have had 1 to 2 horses", "He tenido 1 o 2 caballos"),
          description: tr(
            "Tenho alguma experiência como proprietário — conheço as rotinas básicas de maneio, alimentação e cuidados veterinários preventivos. Consigo gerir com alguma autonomia.",
            "I have some experience as an owner — I know the basic handling routines, feeding and preventive veterinary care. I can manage with some autonomy.",
            "Tengo alguna experiencia como propietario — conozco las rutinas básicas de manejo, alimentación y cuidados veterinarios preventivos. Puedo gestionar con cierta autonomía."
          ),
          value: "alguma",
          traits: ["experiencia", "autonomo"],
          points: { competidor: 5, tradicional: 7, criador: 4, amador: 7 },
        },
        {
          text: tr("Proprietário experiente", "Experienced owner", "Propietario experimentado"),
          description: tr(
            "Já tive vários cavalos ao longo dos anos e domino o ciclo completo de gestão: vacinações, desparasitações, ferragem regular, nutrição ajustada e maneio preventivo de saúde.",
            "I have had several horses over the years and master the complete management cycle: vaccinations, deworming, regular farriery, adjusted nutrition and preventive health management.",
            "He tenido varios caballos a lo largo de los años y domino el ciclo completo de gestión: vacunaciones, desparasitaciones, herraje regular, nutrición ajustada y manejo preventivo de salud."
          ),
          value: "experiente",
          traits: ["experiente", "conhecedor"],
          points: { competidor: 8, tradicional: 8, criador: 6, amador: 4 },
        },
        {
          text: tr("Criador / Gestor de múltiplos cavalos", "Breeder / Manager of multiple horses", "Criador / Gestor de múltiples caballos"),
          description: tr(
            "Tenho ou já tive múltiplos cavalos, com experiência em reprodução, cuidados a poldros, gestão de éguas de ventre e programa de criação. Nível de conhecimento próximo do profissional.",
            "I have or have had multiple horses, with experience in breeding, foal care, broodmare management and breeding programmes. Knowledge level close to professional.",
            "Tengo o he tenido múltiples caballos, con experiencia en reproducción, cuidados a potros, gestión de yeguas madre y programa de cría. Nivel de conocimiento cercano al profesional."
          ),
          value: "criador",
          traits: ["profissional", "criador"],
          points: { competidor: 6, tradicional: 6, criador: 10, amador: 2 },
        },
      ],
    },
    {
      id: 13,
      category: tr("Apoio Profissional", "Professional Support", "Apoyo Profesional"),
      question: tr(
        "Que acompanhamento profissional terá disponível?",
        "What professional support will you have available?",
        "¿Qué acompañamiento profesional tendrá disponible?"
      ),
      description: tr(
        "O PSL responde excepcionalmente bem ao trabalho com profissionais qualificados — treinador, veterinário de desporto equino, ferrador e nutricionista equino formam a equipa ideal para extrair o melhor da raça.",
        "The PSL responds exceptionally well to work with qualified professionals — trainer, equine sport veterinarian, farrier and equine nutritionist form the ideal team to get the best from the breed.",
        "El PSL responde excepcionalmente bien al trabajo con profesionales cualificados — entrenador, veterinario de deporte equino, herrador y nutricionista equino forman el equipo ideal para sacar lo mejor de la raza."
      ),
      icon: <Users className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("Treinador de alta competição", "High-level competition trainer", "Entrenador de alta competición"),
          description: tr(
            "Acompanhamento regular com treinador com experiência em competição FEI ou equitação de trabalho de nível nacional/internacional. O padrão exigido para desenvolver um PSL de topo.",
            "Regular support from a trainer with experience in FEI competition or national/international level working equitation. The standard required to develop a top PSL.",
            "Acompañamiento regular con entrenador con experiencia en competición FEI o equitación de trabajo de nivel nacional/internacional. El estándar exigido para desarrollar un PSL de alto nivel."
          ),
          value: "treinador_top",
          traits: ["elite", "competicao"],
          points: { competidor: 10, tradicional: 3, criador: 4, amador: 2 },
        },
        {
          text: tr("Instrutor / Treinador qualificado regular", "Regular qualified instructor/trainer", "Instructor / Entrenador cualificado regular"),
          description: tr(
            "Lições semanais com instrutor certificado pela FEP ou com formação reconhecida. Suficiente para progressão consistente e competição regional com um PSL de qualidade.",
            "Weekly lessons with a FEP-certified instructor or with recognised training. Sufficient for consistent progression and regional competition with a quality PSL.",
            "Lecciones semanales con instructor certificado por la FEP o con formación reconocida. Suficiente para una progresión consistente y competición regional con un PSL de calidad."
          ),
          value: "instrutor",
          traits: ["apoio", "progressao"],
          points: { competidor: 6, tradicional: 6, criador: 4, amador: 8 },
        },
        {
          text: tr("Apoio pontual quando necessário", "Ad hoc support when needed", "Apoyo puntual cuando sea necesario"),
          description: tr(
            "Consulto profissionais em momentos específicos — clínicas, revisões técnicas, ou situações de saúde. Modelo que exige autonomia e conhecimento do cavaleiro.",
            "I consult professionals at specific moments — clinics, technical reviews, or health situations. A model that demands rider autonomy and knowledge.",
            "Consulto profesionales en momentos específicos — clínicas, revisiones técnicas, o situaciones de salud. Modelo que exige autonomía y conocimiento del jinete."
          ),
          value: "pontual",
          traits: ["autonomo", "independente"],
          points: { competidor: 4, tradicional: 8, criador: 5, amador: 5 },
        },
        {
          text: tr("Equipa completa de apoio", "Complete support team", "Equipo completo de apoyo"),
          description: tr(
            "Treinador regular, veterinário de desporto equino, ferrador especializado em cavalos de trabalho, e nutricionista equino. O suporte ideal para cavalos de alto nível e programas de reprodução.",
            "Regular trainer, equine sport veterinarian, farrier specialised in working horses, and equine nutritionist. The ideal support for high-level horses and breeding programmes.",
            "Entrenador regular, veterinario de deporte equino, herrador especializado en caballos de trabajo, y nutricionista equino. El apoyo ideal para caballos de alto nivel y programas de reproducción."
          ),
          value: "completo",
          traits: ["profissional", "dedicado"],
          points: { competidor: 9, tradicional: 5, criador: 8, amador: 3 },
        },
      ],
    },
    {
      id: 14,
      category: tr("Ambições Competitivas", "Competitive Ambitions", "Ambiciones Competitivas"),
      question: tr(
        "Se compete ou pretende competir, a que nível aspira?",
        "If you compete or intend to compete, what level do you aspire to?",
        "Si compite o pretende competir, ¿a qué nivel aspira?"
      ),
      description: tr(
        "O PSL está presente nas mais altas esferas competitivas mundiais — de CDIs internacionais ao Campeonato do Mundo de Equitação de Trabalho. Os objectivos competitivos definem directamente o tipo de cavalo necessário.",
        "The PSL is present at the highest competitive levels worldwide — from international CDIs to the Working Equitation World Championship. Competitive objectives directly define the type of horse needed.",
        "El PSL está presente en las más altas esferas competitivas mundiales — de CDIs internacionales al Campeonato del Mundo de Equitación de Trabajo. Los objetivos competitivos definen directamente el tipo de caballo necesario."
      ),
      icon: <Medal className="text-[#C5A059]" size={28} />,
      weight: 1.5,
      options: [
        {
          text: tr("Não pretendo competir", "I do not intend to compete", "No pretendo competir"),
          description: tr(
            "O meu foco é o prazer da equitação, a evolução técnica pessoal, ou o desenvolvimento de um programa de criação. A competição não faz parte dos meus objectivos com este cavalo.",
            "My focus is the pleasure of riding, personal technical development, or the development of a breeding programme. Competition is not part of my objectives with this horse.",
            "Mi foco es el placer de la equitación, la evolución técnica personal, o el desarrollo de un programa de cría. La competición no forma parte de mis objetivos con este caballo."
          ),
          value: "sem_competicao",
          traits: ["lazer", "recreativo"],
          points: { competidor: 0, tradicional: 5, criador: 6, amador: 10 },
        },
        {
          text: tr("Provas regionais / Ensino social", "Regional competitions / Social dressage", "Pruebas regionales / Dressage social"),
          description: tr(
            "Competição local para ganhar experiência em pista — provas de dressage de ensino social, equitação de trabalho regional, ou outras modalidades com PSL a nível de iniciação competitiva.",
            "Local competition to gain arena experience — social dressage competitions, regional working equitation, or other PSL disciplines at competitive initiation level.",
            "Competición local para ganar experiencia en pista — pruebas de dressage social, equitación de trabajo regional, u otras modalidades con PSL a nivel de iniciación competitiva."
          ),
          value: "regional",
          traits: ["entrada", "local"],
          points: { competidor: 4, tradicional: 7, criador: 3, amador: 6 },
        },
        {
          text: tr("Campeonatos nacionais FEP", "FEP National Championships", "Campeonatos nacionales FEP"),
          description: tr(
            "Objectivo de ranking e classificação no Campeonato Nacional — dressage, equitação de trabalho, ou morfologia APSL. Exige cavalo com qualidade acima da média e preparação técnica consistente.",
            "Objective of ranking and classification in the National Championship — dressage, working equitation, or APSL morphology. Requires a horse with above-average quality and consistent technical preparation.",
            "Objetivo de ranking y clasificación en el Campeonato Nacional — dressage, equitación de trabajo, o morfología APSL. Exige un caballo con calidad superior a la media y una preparación técnica consistente."
          ),
          value: "nacional",
          traits: ["nacional", "ranking"],
          points: { competidor: 8, tradicional: 5, criador: 4, amador: 2 },
        },
        {
          text: tr("Competição internacional FEI (CDI/CDIO)", "International FEI competition (CDI/CDIO)", "Competición internacional FEI (CDI/CDIO)"),
          description: tr(
            "Provas FEI de dressage, equitação de trabalho internacional, ou Campeonatos da Europa/Mundo. Exige um PSL de qualidade excepcional, treinador de nível internacional e dedicação total.",
            "FEI dressage competitions, international working equitation, or European/World Championships. Requires a PSL of exceptional quality, an international-level trainer and total dedication.",
            "Pruebas FEI de dressage, equitación de trabajo internacional, o Campeonatos de Europa/Mundo. Exige un PSL de calidad excepcional, entrenador de nivel internacional y dedicación total."
          ),
          value: "internacional",
          traits: ["internacional", "elite"],
          points: { competidor: 10, tradicional: 2, criador: 3, amador: 0 },
        },
      ],
    },
    {
      id: 15,
      category: tr("Saúde e Garantias", "Health and Guarantees", "Salud y Garantías"),
      question: tr(
        "Que exigências tem em termos de saúde e garantias veterinárias?",
        "What are your requirements in terms of health and veterinary guarantees?",
        "¿Qué exigencias tiene en términos de salud y garantías veterinarias?"
      ),
      description: tr(
        "A compra de um PSL é um investimento significativo. Um exame de compra rigoroso protege o comprador e transmite transparência por parte do vendedor. Os padrões de exigência variam consoante o objectivo de uso.",
        "Purchasing a PSL is a significant investment. A rigorous pre-purchase examination protects the buyer and conveys transparency from the seller. The standards of requirement vary according to the intended use.",
        "La compra de un PSL es una inversión significativa. Un examen de compra riguroso protege al comprador y transmite transparencia por parte del vendedor. Los estándares de exigencia varían según el objetivo de uso."
      ),
      icon: <Stethoscope className="text-[#C5A059]" size={28} />,
      weight: 1,
      options: [
        {
          text: tr("Exame veterinário completo e rigoroso", "Complete and rigorous veterinary examination", "Examen veterinario completo y riguroso"),
          description: tr(
            "RX a todos os membros (incluindo coluna e ATM), ecografia de tendões e ligamentos, análises sanguíneas completas, e exame clínico detalhado por veterinário da minha confiança. O padrão para qualquer compra de valor.",
            "X-rays of all limbs (including spine and TMJ), tendon and ligament ultrasound, complete blood analysis, and detailed clinical examination by a trusted veterinarian. The standard for any significant purchase.",
            "RX de todos los miembros (incluyendo columna y ATM), ecografía de tendones y ligamentos, análisis de sangre completos, y examen clínico detallado por veterinario de confianza. El estándar para cualquier compra de valor."
          ),
          value: "completo",
          traits: ["rigoroso", "investimento"],
          points: { competidor: 10, tradicional: 5, criador: 7, amador: 4 },
        },
        {
          text: tr("Exame clínico + RX às áreas principais", "Clinical exam + X-rays of main areas", "Examen clínico + RX de las áreas principales"),
          description: tr(
            "Exame clínico completo com RX às áreas de maior risco (boletos, jarretes, espinhela). Equilíbrio entre rigor e custo — adequado para a maioria das compras de PSL de qualidade.",
            "Complete clinical examination with X-rays of the highest risk areas (fetlocks, hocks, stifle). Balance between rigour and cost — suitable for most quality PSL purchases.",
            "Examen clínico completo con RX de las áreas de mayor riesgo (menudillos, corvejones, rodillas). Equilibrio entre rigor y coste — adecuado para la mayoría de las compras de PSL de calidad."
          ),
          value: "basico",
          traits: ["prudente", "equilibrado"],
          points: { competidor: 7, tradicional: 7, criador: 6, amador: 6 },
        },
        {
          text: tr("Confio no histórico veterinário e no vendedor", "I trust the veterinary history and the seller", "Confío en el historial veterinario y en el vendedor"),
          description: tr(
            "Se a coudelaria tem reputação sólida e fornece o histórico veterinário completo do cavalo, um exame básico pode ser suficiente. Adequado quando existe relação de confiança com o criador.",
            "If the stud farm has a solid reputation and provides the horse's complete veterinary history, a basic examination may be sufficient. Suitable when there is a relationship of trust with the breeder.",
            "Si la yeguada tiene reputación sólida y proporciona el historial veterinario completo del caballo, un examen básico puede ser suficiente. Adecuado cuando existe una relación de confianza con el criador."
          ),
          value: "confianca",
          traits: ["confiante", "relacional"],
          points: { competidor: 3, tradicional: 8, criador: 5, amador: 7 },
        },
        {
          text: tr("Testes genéticos obrigatórios", "Mandatory genetic tests", "Pruebas genéticas obligatorias"),
          description: tr(
            "Para criação, exijo testes de WFFS (Warmblood Fragile Foal Syndrome), CA (Congenital Stationary Night Blindness em cruzamentos) e outros marcadores genéticos relevantes. Indispensável em qualquer programa de melhoramento sério.",
            "For breeding, I require WFFS (Warmblood Fragile Foal Syndrome), CA (Congenital Stationary Night Blindness in crossbreeding) and other relevant genetic markers. Indispensable in any serious improvement programme.",
            "Para la cría, exijo pruebas de WFFS (Warmblood Fragile Foal Syndrome), CA (Ceguera Nocturna Estacionaria Congénita en cruzamientos) y otros marcadores genéticos relevantes. Indispensable en cualquier programa de mejora serio."
          ),
          value: "genetico",
          traits: ["genetica", "rigoroso"],
          points: { competidor: 5, tradicional: 4, criador: 10, amador: 3 },
        },
      ],
    },
    {
      id: 16,
      category: tr("Acompanhamento Técnico", "Technical Support", "Seguimiento Técnico"),
      question: tr(
        "Com que regularidade trabalha com um treinador ou instrutor?",
        "How regularly do you work with a trainer or instructor?",
        "¿Con qué regularidad trabaja con un entrenador o instructor?"
      ),
      description: tr(
        "O acompanhamento profissional regular é um dos factores mais determinantes na progressão técnica e no bem-estar do binómio cavaleiro-cavalo. O PSL responde especialmente bem a trabalho metódico e consistente.",
        "Regular professional support is one of the most decisive factors in technical progression and the wellbeing of the rider-horse partnership. The PSL responds especially well to methodical and consistent work.",
        "El seguimiento profesional regular es uno de los factores más determinantes en la progresión técnica y el bienestar del binomio jinete-caballo. El PSL responde especialmente bien al trabajo metódico y consistente."
      ),
      icon: <Trophy className="text-[#C5A059]" size={28} />,
      weight: 1.2,
      options: [
        {
          text: tr("Treinador dedicado — sessões semanais", "Dedicated trainer — weekly sessions", "Entrenador dedicado — sesiones semanales"),
          description: tr(
            "Trabalho semanal com treinador profissional, com plano de treino individualizado. O modelo standard em cavalos de competição e o mais eficaz para desenvolvimento rápido de cavaleiro e cavalo.",
            "Weekly work with a professional trainer, with an individualised training plan. The standard model for competition horses and the most effective for rapid development of both rider and horse.",
            "Trabajo semanal con entrenador profesional, con plan de entrenamiento individualizado. El modelo estándar en caballos de competición y el más eficaz para el desarrollo rápido del jinete y el caballo."
          ),
          value: "dedicado",
          traits: ["competicao", "progressao", "profissional"],
          points: { competidor: 8, tradicional: 4, criador: 3, amador: 2 },
        },
        {
          text: tr("Treinador ou instrutor mensal", "Monthly trainer or instructor", "Entrenador o instructor mensual"),
          description: tr(
            "Sessões mensais de revisão e correcção com treinador ou instrutor qualificado. Suficiente para manter a direcção técnica correcta e corrigir vícios de postura e ajudas.",
            "Monthly review and correction sessions with a qualified trainer or instructor. Sufficient to maintain correct technical direction and correct postural and aid habits.",
            "Sesiones mensuales de revisión y corrección con entrenador o instructor cualificado. Suficiente para mantener la dirección técnica correcta y corregir vicios de postura y ayudas."
          ),
          value: "regular",
          traits: ["progressao", "apoio"],
          points: { competidor: 5, tradicional: 5, criador: 3, amador: 5 },
        },
        {
          text: tr("Clínicas e workshops especializados", "Specialised clinics and workshops", "Clínicas y talleres especializados"),
          description: tr(
            "Formação concentrada em clínicas com treinadores convidados — modelo comum em Portugal, com diversas clínicas de Alta Escola, Equitação de Trabalho e Dressage disponíveis ao longo do ano.",
            "Concentrated training at clinics with guest trainers — a common model in Portugal, with various haute école, working equitation and dressage clinics available throughout the year.",
            "Formación concentrada en clínicas con entrenadores invitados — modelo común en Portugal, con diversas clínicas de Alta Escuela, Equitación de Trabajo y Dressage disponibles a lo largo del año."
          ),
          value: "ocasional",
          traits: ["formacao", "eventos"],
          points: { competidor: 4, tradicional: 6, criador: 4, amador: 4 },
        },
        {
          text: tr("Estudo autónomo e auto-aprendizagem", "Autonomous study and self-learning", "Estudio autónomo y autoaprendizaje"),
          description: tr(
            "Cavaleiro autodidata — aprende através de livros técnicos, vídeos e análise crítica do próprio trabalho. Requer forte autodisciplina e capacidade de análise, mas é um caminho válido com base técnica sólida.",
            "Self-taught rider — learns through technical books, videos and critical self-analysis. Requires strong self-discipline and analytical ability, but is a valid path with a solid technical foundation.",
            "Jinete autodidacta — aprende a través de libros técnicos, vídeos y análisis crítico del propio trabajo. Requiere fuerte autodisciplina y capacidad de análisis, pero es un camino válido con base técnica sólida."
          ),
          value: "autonomo",
          traits: ["autonomo", "independente"],
          points: { competidor: 1, tradicional: 4, criador: 3, amador: 7 },
        },
      ],
    },
    {
      id: 17,
      category: tr("Logística de Transporte", "Transport Logistics", "Logística de Transporte"),
      question: tr(
        "Como gere o transporte e a logística dos seus cavalos?",
        "How do you manage the transport and logistics of your horses?",
        "¿Cómo gestiona el transporte y la logística de sus caballos?"
      ),
      description: tr(
        "A mobilidade equestre é essencial para competição, clínicas e aquisição de cavalos. Portugal tem uma boa rede de transportadores equinos especializados, e o mercado internacional de PSL exige frequentemente transporte de longa distância.",
        "Equestrian mobility is essential for competition, clinics and horse acquisition. Portugal has a good network of specialised equine transporters, and the international PSL market frequently requires long-distance transport.",
        "La movilidad ecuestre es esencial para la competición, las clínicas y la adquisición de caballos. Portugal tiene una buena red de transportistas equinos especializados, y el mercado internacional de PSL requiere frecuentemente transporte de larga distancia."
      ),
      icon: <Truck className="text-[#C5A059]" size={28} />,
      weight: 0.5,
      options: [
        {
          text: tr("Transporte próprio (atrelado ou van equina)", "Own transport (trailer or horse van)", "Transporte propio (remolque o van equina)"),
          description: tr(
            "Tenho ou pretendo ter meio de transporte equino próprio. Confere autonomia total para provas, clínicas e aquisição de cavalos — essencial para cavaleiros de competição activa.",
            "I have or intend to have my own equine transport. Provides total autonomy for competitions, clinics and horse acquisition — essential for active competition riders.",
            "Tengo o pretendo tener medio de transporte equino propio. Confiere autonomía total para pruebas, clínicas y adquisición de caballos — esencial para jinetes de competición activa."
          ),
          value: "proprio",
          traits: ["autonomo", "competicao", "mobilidade"],
          points: { competidor: 9, tradicional: 6, criador: 7, amador: 4 },
        },
        {
          text: tr("Partilha com outros cavaleiros", "Sharing with other riders", "Compartir con otros jinetes"),
          description: tr(
            "Partilho transporte com colegas de centro hípico ou clube. Solução prática e económica para provas locais e regionais, mas com dependência da disponibilidade de terceiros.",
            "I share transport with equestrian centre or club colleagues. A practical and economical solution for local and regional competitions, but with dependence on third-party availability.",
            "Comparto transporte con compañeros del centro hípico o club. Solución práctica y económica para pruebas locales y regionales, pero con dependencia de la disponibilidad de terceros."
          ),
          value: "partilhado",
          traits: ["comunidade", "partilha"],
          points: { competidor: 5, tradicional: 7, criador: 4, amador: 6 },
        },
        {
          text: tr("Empresa de transporte equino especializada", "Specialised equine transport company", "Empresa de transporte equino especializada"),
          description: tr(
            "Contrato transportadores profissionais especializados em equinos para provas, clínicas e aquisições. Ideal para transporte internacional de PSL ou cavalos de grande valor que requerem cuidado especial.",
            "I hire professional transporters specialised in equines for competitions, clinics and acquisitions. Ideal for international PSL transport or high-value horses requiring special care.",
            "Contrato transportistas profesionales especializados en équidos para pruebas, clínicas y adquisiciones. Ideal para transporte internacional de PSL o caballos de gran valor que requieren cuidado especial."
          ),
          value: "empresa",
          traits: ["profissional", "servico"],
          points: { competidor: 7, tradicional: 5, criador: 6, amador: 3 },
        },
        {
          text: tr("Sem necessidade de transporte regular", "No need for regular transport", "Sin necesidad de transporte regular"),
          description: tr(
            "O cavalo fica num local fixo, com todas as actividades realizadas na mesma instalação. Modelo de lazer e trabalho local, sem deslocações para provas ou clínicas externas.",
            "The horse stays in a fixed location, with all activities carried out at the same facility. A leisure and local work model, without travel to external competitions or clinics.",
            "El caballo permanece en un lugar fijo, con todas las actividades realizadas en la misma instalación. Modelo de ocio y trabajo local, sin desplazamientos para pruebas o clínicas externas."
          ),
          value: "sem_transporte",
          traits: ["lazer", "local"],
          points: { competidor: 1, tradicional: 4, criador: 3, amador: 8 },
        },
      ],
    },
  ];
}

// Backward-compatible export
export const questions = getQuestions((pt) => pt);
