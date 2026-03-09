import { Trophy, Shield, Crown, Heart } from "lucide-react";
import { createTranslator } from "@/lib/tr";
import { Result } from "../types";

type Tr = (pt: string, en: string, es?: string) => string;

export function getResults(tr: Tr): Record<string, Result> {
  return {
    competidor: {
      profile: "competidor",
      title: tr("Competidor de Elite", "Elite Competitor", "Competidor de Elite"),
      subtitle: tr(
        "Foco em Alta Performance",
        "Focus on High Performance",
        "Enfoque en Alto Rendimiento"
      ),
      description: tr(
        "O seu perfil indica um cavaleiro orientado para resultados, com ambição de competir ao mais alto nível. Procura um cavalo atleta, com movimentos expressivos, presença em pista, e capacidade de brilhar sob pressão.",
        "Your profile indicates a results-oriented rider with the ambition to compete at the highest level. You seek an athletic horse with expressive movements, arena presence, and the ability to shine under pressure.",
        "Su perfil indica un jinete orientado a resultados, con ambición de competir al más alto nivel. Busca un caballo atleta, con movimientos expresivos, presencia en pista y capacidad de brillar bajo presión."
      ),
      characteristics: [
        tr(
          "Movimentos expressivos e elásticos",
          "Expressive and elastic movements",
          "Movimientos expresivos y elásticos"
        ),
        tr(
          "Sangue competitivo e presença",
          "Competitive spirit and presence",
          "Sangre competitiva y presencia"
        ),
        tr("Alta trainabilidade", "High trainability", "Alta capacidad de entrenamiento"),
        tr("Capacidade para Grand Prix", "Grand Prix capability", "Capacidad para Grand Prix"),
        tr(
          "Genética de performance comprovada",
          "Proven performance genetics",
          "Genética de rendimiento comprobada"
        ),
        tr("Conformação atlética", "Athletic conformation", "Conformación atlética"),
      ],
      idealHorse: {
        age: tr("6-12 anos (feito) ou 3-5 anos (projecto)", "6-12 years (finished) or 3-5 years (project)", "6-12 años (hecho) o 3-5 años (proyecto)"),
        height: "1.62m — 1.72m",
        training: tr(
          "Nível S/GP ou potencial comprovado",
          "S/GP level or proven potential",
          "Nivel S/GP o potencial comprobado"
        ),
        temperament: tr(
          "Sensível, reactivo, com brio controlado",
          "Sensitive, reactive, with controlled spirit",
          "Sensible, reactivo, con brío controlado"
        ),
        priceRange: "45.000 — 250.000+ euros",
      },
      annualCosts: {
        min: 20000,
        max: 50000,
        includes: [
          tr(
            "Pensão em centro de alta competição",
            "Board at a high-competition centre",
            "Pensión en centro de alta competición"
          ),
          tr(
            "Treinador de nível internacional",
            "International-level trainer",
            "Entrenador de nivel internacional"
          ),
          tr(
            "Veterinário desportivo regular",
            "Regular sports veterinarian",
            "Veterinario deportivo regular"
          ),
          tr("Ferração especializada", "Specialised farriery", "Herraje especializado"),
          tr(
            "Inscrições em provas CDI/CDN",
            "CDI/CDN competition entries",
            "Inscripciones en pruebas CDI/CDN"
          ),
          tr(
            "Transporte para competições",
            "Transport to competitions",
            "Transporte a competiciones"
          ),
          tr("Seguro de valor elevado", "High-value insurance", "Seguro de valor elevado"),
          tr("Suplementação premium", "Premium supplementation", "Suplementación premium"),
        ],
      },
      recommendedRegions: [
        "Ribatejo",
        "Alentejo",
        tr("Internacional", "International", "Internacional"),
      ],
      linhagens: [
        {
          name: "Veiga",
          reason: tr(
            "Reconhecida pelos movimentos expressivos e elegância",
            "Renowned for expressive movements and elegance",
            "Reconocida por movimientos expresivos y elegancia"
          ),
        },
        {
          name: "Alter Real",
          reason: tr(
            "Tradição real, selecção para funcionalidade de elite",
            "Royal tradition, selection for elite functionality",
            "Tradición real, selección para funcionalidad de elite"
          ),
        },
        {
          name: "Coudelaria Nacional",
          reason: tr(
            "Genética testada em competição internacional",
            "Genetics tested in international competition",
            "Genética probada en competición internacional"
          ),
        },
      ],
      disciplinas: [
        "Dressage FEI",
        "Grand Prix",
        "Grand Prix Special",
        "Freestyle/Kur",
        tr("CDI Internacional", "International CDI", "CDI Internacional"),
      ],
      famousHorses: [
        {
          name: "Rubi AR",
          achievement: tr(
            "Jogos Olímpicos Londres 2012 com Gonçalo Carvalho",
            "London 2012 Olympics with Gonçalo Carvalho",
            "Juegos Olímpicos Londres 2012 con Gonçalo Carvalho"
          ),
        },
        {
          name: "Oxidado",
          achievement: tr(
            "Campeonatos da Europa com Daniel Pinto",
            "European Championships with Daniel Pinto",
            "Campeonatos de Europa con Daniel Pinto"
          ),
        },
        {
          name: "Fogoso",
          achievement: tr(
            "Lenda do Dressage Português",
            "Legend of Portuguese Dressage",
            "Leyenda del Dressage Portugués"
          ),
        },
        {
          name: "Euclides MOR",
          achievement: tr(
            "Top mundial com Rodrigo Torres",
            "World-class with Rodrigo Torres",
            "Top mundial con Rodrigo Torres"
          ),
        },
      ],
      tips: [
        tr(
          "Invista num exame veterinário completo com RX",
          "Invest in a full veterinary exam with X-rays",
          "Invierta en un examen veterinario completo con radiografías"
        ),
        tr(
          "Veja o cavalo trabalhar várias vezes",
          "Watch the horse work multiple times",
          "Vea al caballo trabajar varias veces"
        ),
        tr(
          "Considere o custo total anual",
          "Consider the total annual cost",
          "Considere el coste total anual"
        ),
        tr(
          "Procure referências da coudelaria",
          "Seek references from the stud farm",
          "Busque referencias de la yeguada"
        ),
        tr(
          "Avalie o potencial de evolução",
          "Assess the potential for progression",
          "Evalúe el potencial de evolución"
        ),
        tr(
          "Considere um período de experiência",
          "Consider a trial period",
          "Considere un período de prueba"
        ),
      ],
      nextSteps: [
        tr(
          "Consultar coudelarias especializadas em competição",
          "Consult stud farms specialised in competition",
          "Consultar yeguadas especializadas en competición"
        ),
        tr(
          "Contactar cavaleiros profissionais",
          "Contact professional riders",
          "Contactar jinetes profesionales"
        ),
        tr(
          "Visitar Golegã na Feira Nacional do Cavalo",
          "Visit Golegã at the National Horse Fair",
          "Visitar Golegã en la Feria Nacional del Caballo"
        ),
        tr(
          "Assistir a provas CDI",
          "Attend CDI competitions",
          "Asistir a pruebas CDI"
        ),
        tr(
          "Definir orçamento total",
          "Define total budget",
          "Definir presupuesto total"
        ),
      ],
      icon: <Trophy className="text-[#C5A059]" size={48} />,
      color: "from-amber-500/20",
      quotes: [
        {
          author: "Nuno Oliveira",
          role: tr("Mestre de Equitação", "Riding Master", "Maestro de Equitación"),
          quote: tr(
            "A arte equestre é um diálogo silencioso entre cavalo e cavaleiro, onde a harmonia é o objectivo supremo.",
            "The equestrian art is a silent dialogue between horse and rider, where harmony is the supreme goal.",
            "El arte ecuestre es un diálogo silencioso entre caballo y jinete, donde la armonía es el objetivo supremo."
          ),
        },
        {
          author: "Rodrigo Torres",
          role: tr("Cavaleiro Olímpico", "Olympic Rider", "Jinete Olímpico"),
          quote: tr(
            "O Lusitano tem uma capacidade única de se entregar ao trabalho com coração e inteligência.",
            "The Lusitano has a unique ability to give itself to work with heart and intelligence.",
            "El Lusitano tiene una capacidad única de entregarse al trabajo con corazón e inteligencia."
          ),
        },
        {
          author: "Miguel Ralão Duarte",
          role: tr("Cavaleiro Internacional", "International Rider", "Jinete Internacional"),
          quote: tr(
            "Na alta competição, cada detalhe conta. O cavalo certo faz toda a diferença.",
            "In top-level competition, every detail counts. The right horse makes all the difference.",
            "En la alta competición, cada detalle cuenta. El caballo adecuado marca toda la diferencia."
          ),
        },
      ],
      faq: [
        {
          question: tr(
            "Quanto tempo leva a formar um cavalo de GP?",
            "How long does it take to train a GP horse?",
            "¿Cuánto tiempo lleva formar un caballo de GP?"
          ),
          answer: tr(
            "Um cavalo bem formado demora 6-8 anos desde o desbaste até ao Grand Prix. Alguns talentos excepcionais podem chegar mais cedo, mas a paciência é fundamental.",
            "A well-trained horse takes 6-8 years from breaking in to Grand Prix. Some exceptional talents may arrive sooner, but patience is key.",
            "Un caballo bien formado tarda 6-8 años desde el desbrave hasta el Grand Prix. Algunos talentos excepcionales pueden llegar antes, pero la paciencia es fundamental."
          ),
        },
        {
          question: tr(
            "Vale a pena comprar um cavalo jovem ou feito?",
            "Is it worth buying a young horse or a finished one?",
            "¿Vale la pena comprar un caballo joven o hecho?"
          ),
          answer: tr(
            "Depende da sua experiência e objectivos. Um cavalo feito dá resultados imediatos mas custa mais. Um jovem é um projecto com risco mas potencial de valorização.",
            "It depends on your experience and goals. A finished horse gives immediate results but costs more. A young one is a project with risk but appreciation potential.",
            "Depende de su experiencia y objetivos. Un caballo hecho da resultados inmediatos pero cuesta más. Un joven es un proyecto con riesgo pero potencial de revalorización."
          ),
        },
        {
          question: tr(
            "Qual a idade ideal para competir em CDI?",
            "What is the ideal age to compete at CDI level?",
            "¿Cuál es la edad ideal para competir en CDI?"
          ),
          answer: tr(
            "Cavalos entre 8-14 anos estão tipicamente no auge. Alguns mantêm alto nível até aos 18 anos com gestão adequada.",
            "Horses between 8-14 years are typically at their peak. Some maintain a high level until 18 with proper management.",
            "Caballos entre 8-14 años están típicamente en su apogeo. Algunos mantienen un alto nivel hasta los 18 años con gestión adecuada."
          ),
        },
        {
          question: tr(
            "Preciso de treinador desde o início?",
            "Do I need a trainer from the start?",
            "¿Necesito entrenador desde el principio?"
          ),
          answer: tr(
            "Absolutamente. Na alta competição, o acompanhamento profissional é essencial para evoluir e corrigir problemas antes que se instalem.",
            "Absolutely. In top-level competition, professional coaching is essential to progress and correct problems before they become entrenched.",
            "Absolutamente. En la alta competición, el acompañamiento profesional es esencial para evolucionar y corregir problemas antes de que se instalen."
          ),
        },
        {
          question: tr(
            "Quanto custa manter um cavalo de competição?",
            "How much does it cost to keep a competition horse?",
            "¿Cuánto cuesta mantener un caballo de competición?"
          ),
          answer: tr(
            "Entre 20.000 e 50.000 euros anuais, incluindo pensão premium, treinador, veterinário desportivo, competições e transporte.",
            "Between 20,000 and 50,000 euros per year, including premium board, trainer, sports veterinarian, competitions and transport.",
            "Entre 20.000 y 50.000 euros anuales, incluyendo pensión premium, entrenador, veterinario deportivo, competiciones y transporte."
          ),
        },
      ],
      timeline: [
        {
          month: tr("Mês 1-2", "Month 1-2", "Mes 1-2"),
          title: tr(
            "Pesquisa e Definição",
            "Research and Planning",
            "Investigación y Definición"
          ),
          description: tr(
            "Definir orçamento total, visitar coudelarias, estabelecer critérios de selecção e contactar profissionais.",
            "Define total budget, visit stud farms, establish selection criteria and contact professionals.",
            "Definir presupuesto total, visitar yeguadas, establecer criterios de selección y contactar profesionales."
          ),
        },
        {
          month: tr("Mês 3-4", "Month 3-4", "Mes 3-4"),
          title: tr(
            "Selecção e Testes",
            "Selection and Testing",
            "Selección y Pruebas"
          ),
          description: tr(
            "Experimentar cavalos pré-seleccionados, ver vídeos, solicitar históricos veterinários e de competição.",
            "Try pre-selected horses, watch videos, request veterinary and competition records.",
            "Probar caballos preseleccionados, ver vídeos, solicitar historiales veterinarios y de competición."
          ),
        },
        {
          month: tr("Mês 5-6", "Month 5-6", "Mes 5-6"),
          title: tr(
            "Decisão e Exames",
            "Decision and Examinations",
            "Decisión y Exámenes"
          ),
          description: tr(
            "Escolher o cavalo, realizar exame veterinário completo, negociar e finalizar a compra.",
            "Choose the horse, perform a full veterinary exam, negotiate and finalise the purchase.",
            "Elegir el caballo, realizar examen veterinario completo, negociar y finalizar la compra."
          ),
        },
        {
          month: tr("Mês 7-9", "Month 7-9", "Mes 7-9"),
          title: tr("Adaptação", "Adaptation", "Adaptación"),
          description: tr(
            "Período de adaptação ao novo ambiente, conhecer o cavalo, estabelecer rotinas com o treinador.",
            "Adaptation period to the new environment, get to know the horse, establish routines with the trainer.",
            "Período de adaptación al nuevo entorno, conocer al caballo, establecer rutinas con el entrenador."
          ),
        },
        {
          month: tr("Mês 10-12", "Month 10-12", "Mes 10-12"),
          title: tr(
            "Início Competitivo",
            "Competitive Start",
            "Inicio Competitivo"
          ),
          description: tr(
            "Primeiras provas de nível adequado, avaliar pontos fortes e áreas a desenvolver.",
            "First competitions at the appropriate level, assess strengths and areas for development.",
            "Primeras pruebas de nivel adecuado, evaluar puntos fuertes y áreas a desarrollar."
          ),
        },
      ],
    },
    tradicional: {
      profile: "tradicional",
      title: tr("Cavaleiro Tradicional", "Traditional Rider", "Jinete Tradicional"),
      subtitle: tr(
        "Tradição e Versatilidade",
        "Tradition and Versatility",
        "Tradición y Versatilidad"
      ),
      description: tr(
        "O seu perfil reflecte um profundo apreço pela tradição equestre portuguesa. Valoriza a versatilidade, a robustez e o temperamento equilibrado típico do Lusitano de trabalho.",
        "Your profile reflects a deep appreciation for Portuguese equestrian tradition. You value the versatility, robustness and balanced temperament typical of the working Lusitano.",
        "Su perfil refleja un profundo aprecio por la tradición ecuestre portuguesa. Valora la versatilidad, la robustez y el temperamento equilibrado típico del Lusitano de trabajo."
      ),
      characteristics: [
        tr("Versatilidade funcional", "Functional versatility", "Versatilidad funcional"),
        tr(
          "Temperamento equilibrado e fiável",
          "Balanced and reliable temperament",
          "Temperamento equilibrado y fiable"
        ),
        tr("Robustez e resistência", "Robustness and endurance", "Robustez y resistencia"),
        tr(
          "Bom manuseamento no campo",
          "Good handling in the field",
          "Buen manejo en el campo"
        ),
        tr(
          "Aptidão para trabalho de gado",
          "Aptitude for cattle work",
          "Aptitud para trabajo con ganado"
        ),
        tr("Carácter cooperativo", "Cooperative character", "Carácter cooperativo"),
      ],
      idealHorse: {
        age: tr("5-12 anos (experiência)", "5-12 years (experience)", "5-12 años (experiencia)"),
        height: "1.58m — 1.65m",
        training: tr(
          "Desbravado a trabalho médio",
          "Broken in to intermediate work",
          "Desbravado a trabajo intermedio"
        ),
        temperament: tr(
          "Calmo, cooperativo, sensato",
          "Calm, cooperative, sensible",
          "Tranquilo, cooperativo, sensato"
        ),
        priceRange: "12.000 — 40.000 euros",
      },
      annualCosts: {
        min: 8000,
        max: 15000,
        includes: [
          tr(
            "Pensão ou manutenção própria",
            "Board or self-maintenance",
            "Pensión o mantenimiento propio"
          ),
          tr("Veterinário regular", "Regular veterinarian", "Veterinario regular"),
          tr("Ferração standard", "Standard farriery", "Herraje estándar"),
          tr("Instrutor ocasional", "Occasional instructor", "Instructor ocasional"),
          tr(
            "Equipamento e manutenção",
            "Equipment and maintenance",
            "Equipamiento y mantenimiento"
          ),
          tr("Seguro básico", "Basic insurance", "Seguro básico"),
          tr("Alimentação de qualidade", "Quality feed", "Alimentación de calidad"),
        ],
      },
      recommendedRegions: [
        "Ribatejo",
        "Alentejo",
        tr("Norte", "North", "Norte"),
      ],
      linhagens: [
        {
          name: "Andrade",
          reason: tr(
            "Conhecida pela funcionalidade e robustez",
            "Known for functionality and robustness",
            "Conocida por la funcionalidad y robustez"
          ),
        },
        {
          name: "Infante da Câmara",
          reason: tr(
            "Tradição de trabalho de campo",
            "Tradition of fieldwork",
            "Tradición de trabajo de campo"
          ),
        },
        {
          name: "Coudelaria Nacional",
          reason: tr(
            "Selecção para versatilidade",
            "Selection for versatility",
            "Selección para versatilidad"
          ),
        },
      ],
      disciplinas: [
        tr("Equitação de Trabalho", "Working Equitation", "Equitación de Trabajo"),
        tr("Passeio de campo", "Trail riding", "Paseo de campo"),
        tr("Tenta", "Tenta", "Tenta"),
        tr("Ensino clássico", "Classical dressage", "Doma clásica"),
        tr("Turismo equestre", "Equestrian tourism", "Turismo ecuestre"),
      ],
      famousHorses: [
        {
          name: "Novilheiro",
          achievement: tr(
            "Lenda da versatilidade",
            "Legend of versatility",
            "Leyenda de la versatilidad"
          ),
        },
        {
          name: "Hábil",
          achievement: tr(
            "Campeão de Equitação de Trabalho",
            "Working Equitation Champion",
            "Campeón de Equitación de Trabajo"
          ),
        },
        {
          name: "Invasor",
          achievement: tr(
            "Referência do Lusitano tradicional",
            "Reference of the traditional Lusitano",
            "Referencia del Lusitano tradicional"
          ),
        },
      ],
      tips: [
        tr(
          "Prefira cavalos com experiência em campo",
          "Prefer horses with field experience",
          "Prefiera caballos con experiencia en campo"
        ),
        tr(
          "Teste em situações reais de trabalho",
          "Test in real work situations",
          "Pruebe en situaciones reales de trabajo"
        ),
        tr(
          "Verifique o histórico de saúde",
          "Check the health history",
          "Verifique el historial de salud"
        ),
        tr(
          "A idade não é problema",
          "Age is not a problem",
          "La edad no es un problema"
        ),
        tr(
          "Considere coudelarias tradicionais",
          "Consider traditional stud farms",
          "Considere yeguadas tradicionales"
        ),
        tr(
          "Um bom carácter vale muito",
          "Good character is worth a lot",
          "Un buen carácter vale mucho"
        ),
      ],
      nextSteps: [
        tr(
          "Visitar coudelarias do Ribatejo e Alentejo",
          "Visit stud farms in Ribatejo and Alentejo",
          "Visitar yeguadas del Ribatejo y Alentejo"
        ),
        tr(
          "Assistir a provas de Equitação de Trabalho",
          "Attend Working Equitation competitions",
          "Asistir a pruebas de Equitación de Trabajo"
        ),
        tr(
          "Contactar associações de criadores",
          "Contact breeder associations",
          "Contactar asociaciones de criadores"
        ),
        tr(
          "Participar em jornadas de campo",
          "Participate in field days",
          "Participar en jornadas de campo"
        ),
        tr(
          "Falar com campinos e cavaleiros de tradição",
          "Talk to campinos and traditional riders",
          "Hablar con campinos y jinetes de tradición"
        ),
      ],
      icon: <Shield className="text-[#C5A059]" size={48} />,
      color: "from-emerald-500/20",
      quotes: [
        {
          author: "Mestre João Oliveira",
          role: tr("Campino do Ribatejo", "Campino from Ribatejo", "Campino del Ribatejo"),
          quote: tr(
            "O verdadeiro Lusitano é aquele que trabalha connosco no campo, que entende o gado e responde à mão do cavaleiro.",
            "The true Lusitano is the one that works with us in the field, understands the cattle and responds to the rider's hand.",
            "El verdadero Lusitano es aquel que trabaja con nosotros en el campo, que entiende el ganado y responde a la mano del jinete."
          ),
        },
        {
          author: "António Borba Monteiro",
          role: tr(
            "Cavaleiro Tauromáquico",
            "Bullfighting Rider",
            "Rejoneador"
          ),
          quote: tr(
            "Na arena, o cavalo é uma extensão do nosso corpo. A confiança mútua é tudo.",
            "In the arena, the horse is an extension of our body. Mutual trust is everything.",
            "En la arena, el caballo es una extensión de nuestro cuerpo. La confianza mutua lo es todo."
          ),
        },
        {
          author: "Dr. Guilherme Borba",
          role: tr("Criador Tradicional", "Traditional Breeder", "Criador Tradicional"),
          quote: tr(
            "Preservar a tradição é honrar gerações de criadores que nos legaram esta raça extraordinária.",
            "Preserving tradition is honouring generations of breeders who bequeathed us this extraordinary breed.",
            "Preservar la tradición es honrar generaciones de criadores que nos legaron esta raza extraordinaria."
          ),
        },
      ],
      faq: [
        {
          question: tr(
            "O Lusitano de trabalho é diferente do de desporto?",
            "Is the working Lusitano different from the sport Lusitano?",
            "¿El Lusitano de trabajo es diferente del de deporte?"
          ),
          answer: tr(
            "Historicamente sim, mas hoje muitos cavalos são versáteis. O de trabalho tende a ser mais compacto, robusto e com temperamento mais frio.",
            "Historically yes, but today many horses are versatile. The working type tends to be more compact, robust and with a cooler temperament.",
            "Históricamente sí, pero hoy muchos caballos son versátiles. El de trabajo tiende a ser más compacto, robusto y con temperamento más frío."
          ),
        },
        {
          question: tr(
            "Posso usar um cavalo tradicional em provas?",
            "Can I use a traditional horse in competitions?",
            "¿Puedo usar un caballo tradicional en pruebas?"
          ),
          answer: tr(
            "Sim, existem provas de Equitação de Trabalho muito competitivas. É uma disciplina em crescimento que valoriza a versatilidade.",
            "Yes, there are very competitive Working Equitation events. It is a growing discipline that values versatility.",
            "Sí, existen pruebas de Equitación de Trabajo muy competitivas. Es una disciplina en crecimiento que valora la versatilidad."
          ),
        },
        {
          question: tr(
            "Que idade é ideal para um cavalo de trabalho?",
            "What is the ideal age for a working horse?",
            "¿Qué edad es ideal para un caballo de trabajo?"
          ),
          answer: tr(
            "Entre 6-12 anos, com experiência de campo. Cavalos mais velhos são excelentes se bem mantidos — a experiência é muito valiosa.",
            "Between 6-12 years, with field experience. Older horses are excellent if well maintained — experience is very valuable.",
            "Entre 6-12 años, con experiencia de campo. Caballos mayores son excelentes si están bien mantenidos — la experiencia es muy valiosa."
          ),
        },
        {
          question: tr(
            "Preciso de instalações especiais?",
            "Do I need special facilities?",
            "¿Necesito instalaciones especiales?"
          ),
          answer: tr(
            "Idealmente paddock ou pasto, mas muitos cavalos tradicionais adaptam-se bem a pensão. O importante é exercício regular e contacto com o exterior.",
            "Ideally a paddock or pasture, but many traditional horses adapt well to boarding. The important thing is regular exercise and outdoor contact.",
            "Idealmente paddock o pasto, pero muchos caballos tradicionales se adaptan bien a pensión. Lo importante es ejercicio regular y contacto con el exterior."
          ),
        },
        {
          question: tr(
            "Como encontrar um bom cavalo de trabalho?",
            "How to find a good working horse?",
            "¿Cómo encontrar un buen caballo de trabajo?"
          ),
          answer: tr(
            "Através de contactos no Ribatejo e Alentejo, feiras tradicionais, e referências de campinos e cavaleiros de confiança.",
            "Through contacts in Ribatejo and Alentejo, traditional fairs, and references from trusted campinos and riders.",
            "A través de contactos en Ribatejo y Alentejo, ferias tradicionales, y referencias de campinos y jinetes de confianza."
          ),
        },
      ],
      timeline: [
        {
          month: tr("Mês 1-2", "Month 1-2", "Mes 1-2"),
          title: tr(
            "Imersão na Tradição",
            "Immersion in Tradition",
            "Inmersión en la Tradición"
          ),
          description: tr(
            "Visitar coudelarias tradicionais, assistir a tentas e jornadas de campo, conhecer a cultura equestre.",
            "Visit traditional stud farms, attend tentas and field days, learn about equestrian culture.",
            "Visitar yeguadas tradicionales, asistir a tentas y jornadas de campo, conocer la cultura ecuestre."
          ),
        },
        {
          month: tr("Mês 3-4", "Month 3-4", "Mes 3-4"),
          title: tr(
            "Contactos e Pesquisa",
            "Contacts and Research",
            "Contactos e Investigación"
          ),
          description: tr(
            "Estabelecer relações com criadores, campinos, e cavaleiros tradicionais. Ver cavalos em trabalho real.",
            "Establish relationships with breeders, campinos, and traditional riders. See horses in real work.",
            "Establecer relaciones con criadores, campinos y jinetes tradicionales. Ver caballos en trabajo real."
          ),
        },
        {
          month: tr("Mês 5-6", "Month 5-6", "Mes 5-6"),
          title: tr("Selecção", "Selection", "Selección"),
          description: tr(
            "Experimentar cavalos no campo, testar em diferentes situações, verificar versatilidade e temperamento.",
            "Try horses in the field, test in different situations, verify versatility and temperament.",
            "Probar caballos en el campo, testar en diferentes situaciones, verificar versatilidad y temperamento."
          ),
        },
        {
          month: tr("Mês 7-8", "Month 7-8", "Mes 7-8"),
          title: tr("Aquisição", "Acquisition", "Adquisición"),
          description: tr(
            "Exame veterinário, negociação, e transporte para as suas instalações.",
            "Veterinary exam, negotiation, and transport to your facilities.",
            "Examen veterinario, negociación y transporte a sus instalaciones."
          ),
        },
        {
          month: tr("Mês 9-12", "Month 9-12", "Mes 9-12"),
          title: tr("Integração", "Integration", "Integración"),
          description: tr(
            "Conhecer o cavalo, participar em jornadas de campo, desenvolver a parceria.",
            "Get to know the horse, participate in field days, develop the partnership.",
            "Conocer al caballo, participar en jornadas de campo, desarrollar la alianza."
          ),
        },
      ],
    },
    criador: {
      profile: "criador",
      title: tr(
        "Criador & Investidor Genético",
        "Breeder & Genetic Investor",
        "Criador e Inversor Genético"
      ),
      subtitle: tr(
        "Preservação e Melhoramento",
        "Preservation and Improvement",
        "Preservación y Mejoramiento"
      ),
      description: tr(
        "O seu perfil indica interesse sério na criação e preservação do Puro Sangue Lusitano. Valoriza a genética, a morfologia típica da raça, e o potencial reprodutivo.",
        "Your profile indicates serious interest in breeding and preserving the Purebred Lusitano. You value genetics, the breed's typical morphology, and reproductive potential.",
        "Su perfil indica un interés serio en la cría y preservación del Pura Sangre Lusitano. Valora la genética, la morfología típica de la raza y el potencial reproductivo."
      ),
      characteristics: [
        tr(
          "Morfologia típica excelente",
          "Excellent typical morphology",
          "Morfología típica excelente"
        ),
        tr(
          "Genética comprovada (APSL)",
          "Proven genetics (APSL)",
          "Genética comprobada (APSL)"
        ),
        tr(
          "Linhagem pura e reconhecida",
          "Pure and recognised lineage",
          "Linaje puro y reconocido"
        ),
        tr(
          "Potencial reprodutivo verificado",
          "Verified reproductive potential",
          "Potencial reproductivo verificado"
        ),
        tr(
          "Conformação para transmissão",
          "Conformation for transmission",
          "Conformación para transmisión"
        ),
        tr(
          "Mérito funcional demonstrado",
          "Demonstrated functional merit",
          "Mérito funcional demostrado"
        ),
      ],
      idealHorse: {
        age: tr("3-8 anos (reprodução activa)", "3-8 years (active breeding)", "3-8 años (reproducción activa)"),
        height: tr("Mínimo 1.60m (garanhões)", "Minimum 1.60m (stallions)", "Mínimo 1.60m (sementales)"),
        training: tr(
          "Funcionalidade demonstrada",
          "Demonstrated functionality",
          "Funcionalidad demostrada"
        ),
        temperament: tr(
          "Equilibrado, bom carácter hereditário",
          "Balanced, good hereditary character",
          "Equilibrado, buen carácter hereditario"
        ),
        priceRange: "25.000 — 150.000+ euros",
      },
      annualCosts: {
        min: 15000,
        max: 40000,
        includes: [
          tr(
            "Manutenção em coudelaria",
            "Stud farm maintenance",
            "Mantenimiento en yeguada"
          ),
          tr("Registos APSL", "APSL registrations", "Registros APSL"),
          tr(
            "Exames de reprodução",
            "Reproduction examinations",
            "Exámenes de reproducción"
          ),
          tr("Coberturas ou IA", "Coverings or AI", "Cubriciones o IA"),
          tr(
            "Veterinário reprodutivo",
            "Reproductive veterinarian",
            "Veterinario reproductivo"
          ),
          tr("Testes genéticos", "Genetic tests", "Tests genéticos"),
          tr(
            "Concursos de modelo",
            "Conformation shows",
            "Concursos de modelo"
          ),
          tr(
            "Marketing dos produtos",
            "Marketing of offspring",
            "Marketing de los productos"
          ),
        ],
      },
      recommendedRegions: [
        "Alentejo",
        "Ribatejo",
        tr("Internacional", "International", "Internacional"),
      ],
      linhagens: [
        {
          name: "Veiga",
          reason: tr(
            "Linhagem histórica com genética excepcional",
            "Historic lineage with exceptional genetics",
            "Linaje histórico con genética excepcional"
          ),
        },
        {
          name: "Alter Real",
          reason: tr(
            "Pureza e selecção secular da Casa Real",
            "Purity and centuries-old Royal House selection",
            "Pureza y selección secular de la Casa Real"
          ),
        },
        {
          name: "Andrade",
          reason: tr(
            "Fundacional, transmite funcionalidade",
            "Foundational, transmits functionality",
            "Fundacional, transmite funcionalidad"
          ),
        },
      ],
      disciplinas: [
        tr("Reprodução selectiva", "Selective breeding", "Reproducción selectiva"),
        tr("Concursos de Modelo", "Conformation Shows", "Concursos de Modelo"),
        tr("Apresentações de raça", "Breed presentations", "Presentaciones de raza"),
        tr(
          "Dressage (prova de funcionalidade)",
          "Dressage (functionality test)",
          "Dressage (prueba de funcionalidad)"
        ),
      ],
      famousHorses: [
        {
          name: "Novilheiro",
          achievement: tr(
            "Pai de nação, influenciou gerações",
            "Father of a nation, influenced generations",
            "Padre de una nación, influyó en generaciones"
          ),
        },
        {
          name: "Ícaro",
          achievement: tr("Top reprodutor", "Top sire", "Top reproductor"),
        },
        {
          name: "Quo Vadis",
          achievement: tr("Garanhão de elite", "Elite stallion", "Semental de elite"),
        },
      ],
      tips: [
        tr(
          "Analise o pedigree (3-4 gerações)",
          "Analyse the pedigree (3-4 generations)",
          "Analice el pedigrí (3-4 generaciones)"
        ),
        tr(
          "Solicite índices BLUP",
          "Request BLUP indices",
          "Solicite índices BLUP"
        ),
        tr(
          "Verifique COI — ideal <6%",
          "Check COI — ideally <6%",
          "Verifique COI — ideal <6%"
        ),
        tr(
          "Exija teste WFFS negativo",
          "Require negative WFFS test",
          "Exija test WFFS negativo"
        ),
        tr(
          "Avalie descendência",
          "Evaluate offspring",
          "Evalúe descendencia"
        ),
        tr(
          "Considere complementaridade",
          "Consider complementarity",
          "Considere complementariedad"
        ),
        tr(
          "Visite a coudelaria",
          "Visit the stud farm",
          "Visite la yeguada"
        ),
      ],
      nextSteps: [
        tr(
          "Estudar catálogos APSL",
          "Study APSL catalogues",
          "Estudiar catálogos APSL"
        ),
        tr(
          "Visitar Coudelaria de Alter",
          "Visit the Alter Stud Farm",
          "Visitar la Yeguada de Alter"
        ),
        tr(
          "Contactar criadores de referência",
          "Contact reference breeders",
          "Contactar criadores de referencia"
        ),
        tr(
          "Participar em concursos de modelo",
          "Participate in conformation shows",
          "Participar en concursos de modelo"
        ),
        tr(
          "Definir objectivos de criação",
          "Define breeding objectives",
          "Definir objetivos de cría"
        ),
      ],
      icon: <Crown className="text-[#C5A059]" size={48} />,
      color: "from-purple-500/20",
      quotes: [
        {
          author: "Dr. Arsénio Raposo Cordeiro",
          role: tr("Presidente APSL", "APSL President", "Presidente APSL"),
          quote: tr(
            "Criar Lusitanos é contribuir para a preservação de um património vivo da cultura portuguesa.",
            "Breeding Lusitanos is contributing to the preservation of a living heritage of Portuguese culture.",
            "Criar Lusitanos es contribuir a la preservación de un patrimonio vivo de la cultura portuguesa."
          ),
        },
        {
          author: "Fernando Sommer d'Andrade",
          role: tr("Criador Histórico", "Historic Breeder", "Criador Histórico"),
          quote: tr(
            "Cada potro que nasce é uma nova esperança para a raça. A selecção rigorosa é o nosso dever.",
            "Every foal born is a new hope for the breed. Rigorous selection is our duty.",
            "Cada potro que nace es una nueva esperanza para la raza. La selección rigurosa es nuestro deber."
          ),
        },
        {
          author: "Eng. José Luís Mira",
          role: tr("Geneticista Equino", "Equine Geneticist", "Genetista Equino"),
          quote: tr(
            "Os índices BLUP revolucionaram a criação, permitindo decisões baseadas em dados objectivos.",
            "BLUP indices have revolutionised breeding, enabling decisions based on objective data.",
            "Los índices BLUP han revolucionado la cría, permitiendo decisiones basadas en datos objetivos."
          ),
        },
      ],
      faq: [
        {
          question: tr(
            "O que é o índice BLUP?",
            "What is the BLUP index?",
            "¿Qué es el índice BLUP?"
          ),
          answer: tr(
            "Best Linear Unbiased Prediction — uma ferramenta estatística que estima o valor genético de um cavalo com base na sua performance e dos seus parentes.",
            "Best Linear Unbiased Prediction — a statistical tool that estimates a horse's genetic value based on its own performance and that of its relatives.",
            "Best Linear Unbiased Prediction — una herramienta estadística que estima el valor genético de un caballo basándose en su rendimiento y el de sus parientes."
          ),
        },
        {
          question: tr(
            "Qual o COI ideal?",
            "What is the ideal COI?",
            "¿Cuál es el COI ideal?"
          ),
          answer: tr(
            "Coeficiente de Consanguinidade idealmente abaixo de 6%. Valores mais altos aumentam risco de problemas genéticos e perda de vigor.",
            "Coefficient of Inbreeding ideally below 6%. Higher values increase the risk of genetic problems and loss of vigour.",
            "Coeficiente de Consanguinidad idealmente por debajo del 6%. Valores más altos aumentan el riesgo de problemas genéticos y pérdida de vigor."
          ),
        },
        {
          question: tr(
            "Preciso de registar os potros na APSL?",
            "Do I need to register foals with APSL?",
            "¿Necesito registrar los potros en la APSL?"
          ),
          answer: tr(
            "Sim, o registo é obrigatório para cavalos PSL. Inclui microchip, resenho, e teste de ADN para confirmação de paternidade.",
            "Yes, registration is mandatory for PSL horses. It includes a microchip, description, and DNA test for paternity confirmation.",
            "Sí, el registro es obligatorio para caballos PSL. Incluye microchip, reseña y test de ADN para confirmación de paternidad."
          ),
        },
        {
          question: tr(
            "Quanto custa iniciar um programa de criação?",
            "How much does it cost to start a breeding programme?",
            "¿Cuánto cuesta iniciar un programa de cría?"
          ),
          answer: tr(
            "Investimento inicial de 30.000-100.000 euros (éguas base), mais 15.000-40.000 euros anuais de manutenção por cavalo.",
            "Initial investment of 30,000-100,000 euros (foundation mares), plus 15,000-40,000 euros per year per horse for maintenance.",
            "Inversión inicial de 30.000-100.000 euros (yeguas base), más 15.000-40.000 euros anuales de mantenimiento por caballo."
          ),
        },
        {
          question: tr(
            "Devo testar para WFFS?",
            "Should I test for WFFS?",
            "¿Debo testar para WFFS?"
          ),
          answer: tr(
            "Absolutamente. O Warmblood Fragile Foal Syndrome é fatal. Nunca cruzar dois portadores. O teste é obrigatório para reprodutores responsáveis.",
            "Absolutely. Warmblood Fragile Foal Syndrome is fatal. Never cross two carriers. Testing is mandatory for responsible breeders.",
            "Absolutamente. El Warmblood Fragile Foal Syndrome es fatal. Nunca cruzar dos portadores. El test es obligatorio para reproductores responsables."
          ),
        },
      ],
      timeline: [
        {
          month: tr("Mês 1-3", "Month 1-3", "Mes 1-3"),
          title: tr(
            "Formação e Pesquisa",
            "Education and Research",
            "Formación e Investigación"
          ),
          description: tr(
            "Estudar genética equina, índices BLUP, catálogos APSL, e visitar coudelarias de referência.",
            "Study equine genetics, BLUP indices, APSL catalogues, and visit reference stud farms.",
            "Estudiar genética equina, índices BLUP, catálogos APSL y visitar yeguadas de referencia."
          ),
        },
        {
          month: tr("Mês 4-6", "Month 4-6", "Mes 4-6"),
          title: tr(
            "Definir Programa",
            "Define Programme",
            "Definir Programa"
          ),
          description: tr(
            "Estabelecer objectivos de criação, seleccionar linhagens de interesse, definir orçamento a 5 anos.",
            "Establish breeding objectives, select lineages of interest, define a 5-year budget.",
            "Establecer objetivos de cría, seleccionar linajes de interés, definir presupuesto a 5 años."
          ),
        },
        {
          month: tr("Mês 7-9", "Month 7-9", "Mes 7-9"),
          title: tr(
            "Aquisição de Base",
            "Foundation Acquisition",
            "Adquisición de Base"
          ),
          description: tr(
            "Adquirir éguas fundadoras ou garanhão, garantir testes genéticos, registos APSL, e instalações adequadas.",
            "Acquire foundation mares or stallion, ensure genetic tests, APSL registrations, and adequate facilities.",
            "Adquirir yeguas fundadoras o semental, asegurar tests genéticos, registros APSL e instalaciones adecuadas."
          ),
        },
        {
          month: tr("Mês 10-12", "Month 10-12", "Mes 10-12"),
          title: tr(
            "Início do Programa",
            "Programme Launch",
            "Inicio del Programa"
          ),
          description: tr(
            "Planear coberturas, estabelecer parcerias com veterinários reprodutivos, iniciar marketing.",
            "Plan coverings, establish partnerships with reproductive veterinarians, start marketing.",
            "Planificar cubriciones, establecer alianzas con veterinarios reproductivos, iniciar marketing."
          ),
        },
        {
          month: tr("Ano 2+", "Year 2+", "Año 2+"),
          title: tr("Consolidação", "Consolidation", "Consolidación"),
          description: tr(
            "Primeiros nascimentos, participação em concursos de modelo, construção de reputação no mercado.",
            "First births, participation in conformation shows, building market reputation.",
            "Primeros nacimientos, participación en concursos de modelo, construcción de reputación en el mercado."
          ),
        },
      ],
    },
    amador: {
      profile: "amador",
      title: tr("Cavaleiro de Lazer", "Leisure Rider", "Jinete de Ocio"),
      subtitle: tr("Paixão e Descoberta", "Passion and Discovery", "Pasión y Descubrimiento"),
      description: tr(
        "O seu perfil indica alguém que ama cavalos e procura um companheiro para desfrutar de momentos de lazer e crescimento pessoal. Valoriza a segurança, o temperamento dócil e a facilidade de manuseamento.",
        "Your profile indicates someone who loves horses and seeks a companion to enjoy leisure time and personal growth. You value safety, a docile temperament and ease of handling.",
        "Su perfil indica a alguien que ama los caballos y busca un compañero para disfrutar de momentos de ocio y crecimiento personal. Valora la seguridad, el temperamento dócil y la facilidad de manejo."
      ),
      characteristics: [
        tr(
          "Temperamento calmo e previsível",
          "Calm and predictable temperament",
          "Temperamento tranquilo y predecible"
        ),
        tr(
          "Fácil de montar e manusear",
          "Easy to ride and handle",
          "Fácil de montar y manejar"
        ),
        tr(
          "Seguro para menos experientes",
          "Safe for less experienced riders",
          "Seguro para menos experimentados"
        ),
        tr("Perdoador de erros", "Forgiving of mistakes", "Tolerante con los errores"),
        tr("Amigável e carinhoso", "Friendly and affectionate", "Amigable y cariñoso"),
        tr(
          "Boa saúde e manutenção fácil",
          "Good health and easy maintenance",
          "Buena salud y mantenimiento fácil"
        ),
      ],
      idealHorse: {
        age: tr("8-16 anos (maturidade)", "8-16 years (maturity)", "8-16 años (madurez)"),
        height: tr("1.55m — 1.65m (confortável)", "1.55m — 1.65m (comfortable)", "1.55m — 1.65m (cómodo)"),
        training: tr(
          "Básico a médio (bem confirmado)",
          "Basic to intermediate (well confirmed)",
          "Básico a intermedio (bien confirmado)"
        ),
        temperament: tr(
          "Muito calmo, dócil, paciente",
          "Very calm, docile, patient",
          "Muy tranquilo, dócil, paciente"
        ),
        priceRange: "8.000 — 25.000 euros",
      },
      annualCosts: {
        min: 6000,
        max: 10000,
        includes: [
          tr(
            "Pensão em centro hípico",
            "Board at riding centre",
            "Pensión en centro hípico"
          ),
          tr("Veterinário básico", "Basic veterinarian", "Veterinario básico"),
          tr("Ferração regular", "Regular farriery", "Herraje regular"),
          tr("Aulas ocasionais", "Occasional lessons", "Clases ocasionales"),
          tr("Equipamento básico", "Basic equipment", "Equipamiento básico"),
          tr("Seguro RC", "Liability insurance", "Seguro RC"),
          tr("Alimentação standard", "Standard feed", "Alimentación estándar"),
        ],
      },
      recommendedRegions: [
        "Lisboa",
        tr("Centro", "Centre", "Centro"),
        tr("Norte", "North", "Norte"),
        tr(
          "Qualquer região acessível",
          "Any accessible region",
          "Cualquier región accesible"
        ),
      ],
      linhagens: [
        {
          name: tr("Qualquer linhagem", "Any lineage", "Cualquier linaje"),
          reason: tr(
            "Temperamento individual é mais importante",
            "Individual temperament is more important",
            "El temperamento individual es más importante"
          ),
        },
        {
          name: "Andrade",
          reason: tr(
            "Tendência para cavalos sensatos",
            "Tendency for sensible horses",
            "Tendencia a caballos sensatos"
          ),
        },
        {
          name: tr("Cavalos de escola", "School horses", "Caballos de escuela"),
          reason: tr(
            "Temperamentos excepcionais",
            "Exceptional temperaments",
            "Temperamentos excepcionales"
          ),
        },
      ],
      disciplinas: [
        tr("Passeio recreativo", "Recreational riding", "Paseo recreativo"),
        tr("Escola básica", "Basic schooling", "Escuela básica"),
        tr("Terapia equestre", "Equine therapy", "Terapia ecuestre"),
        tr("Lazer familiar", "Family leisure", "Ocio familiar"),
        tr("Hipismo adaptado", "Adaptive riding", "Hípica adaptada"),
      ],
      famousHorses: [
        {
          name: tr("Cavalos de escola", "School horses", "Caballos de escuela"),
          achievement: tr(
            "Formaram gerações de cavaleiros",
            "Trained generations of riders",
            "Formaron generaciones de jinetes"
          ),
        },
        {
          name: tr("Cavalos de terapia", "Therapy horses", "Caballos de terapia"),
          achievement: tr(
            "Ajudam pessoas especiais",
            "Help special-needs individuals",
            "Ayudan a personas especiales"
          ),
        },
        {
          name: tr("Companheiros de vida", "Life companions", "Compañeros de vida"),
          achievement: tr(
            "O valor está na relação",
            "The value lies in the relationship",
            "El valor está en la relación"
          ),
        },
      ],
      tips: [
        tr(
          "Procure cavalos mais velhos",
          "Look for older horses",
          "Busque caballos mayores"
        ),
        tr(
          "Experimente várias vezes",
          "Try multiple times",
          "Pruebe varias veces"
        ),
        tr(
          "Monte em diferentes situações",
          "Ride in different situations",
          "Monte en diferentes situaciones"
        ),
        tr(
          "Verifique facilidade de manuseamento",
          "Check ease of handling",
          "Verifique facilidad de manejo"
        ),
        tr(
          "Considere cavalos de escola",
          "Consider school horses",
          "Considere caballos de escuela"
        ),
        tr(
          "Preço baixo não é pior qualidade",
          "Low price does not mean lower quality",
          "Precio bajo no es peor calidad"
        ),
        tr(
          "Peça opinião ao instrutor",
          "Ask your instructor's opinion",
          "Pida opinión al instructor"
        ),
      ],
      nextSteps: [
        tr(
          "Falar com o seu instrutor",
          "Talk to your instructor",
          "Hablar con su instructor"
        ),
        tr(
          "Visitar centros hípicos",
          "Visit riding centres",
          "Visitar centros hípicos"
        ),
        tr(
          "Considerar cavalos de escola reformados",
          "Consider retired school horses",
          "Considerar caballos de escuela retirados"
        ),
        tr(
          "Não ter pressa",
          "Don't rush",
          "No tener prisa"
        ),
        tr(
          "Fazer várias visitas",
          "Make multiple visits",
          "Hacer varias visitas"
        ),
      ],
      icon: <Heart className="text-[#C5A059]" size={48} />,
      color: "from-rose-500/20",
      quotes: [
        {
          author: "Dra. Maria Helena Pires",
          role: tr("Psicóloga Equestre", "Equestrian Psychologist", "Psicóloga Ecuestre"),
          quote: tr(
            "A relação com o cavalo é terapêutica. Não é preciso competir para experimentar a magia da equitação.",
            "The relationship with the horse is therapeutic. You don't need to compete to experience the magic of riding.",
            "La relación con el caballo es terapéutica. No es necesario competir para experimentar la magia de la equitación."
          ),
        },
        {
          author: "Instrutor José Carlos",
          role: tr(
            "Professor de Equitação",
            "Riding Instructor",
            "Profesor de Equitación"
          ),
          quote: tr(
            "O melhor cavalo para um iniciante é aquele que perdoa erros e ensina com paciência.",
            "The best horse for a beginner is one that forgives mistakes and teaches with patience.",
            "El mejor caballo para un principiante es aquel que perdona errores y enseña con paciencia."
          ),
        },
        {
          author: "Sofia Mendes",
          role: tr("Cavaleira Amadora", "Amateur Rider", "Amazona Amateur"),
          quote: tr(
            "O meu Lusitano é o meu escape do stress. Cada passeio é uma sessão de terapia.",
            "My Lusitano is my escape from stress. Every ride is a therapy session.",
            "Mi Lusitano es mi escape del estrés. Cada paseo es una sesión de terapia."
          ),
        },
      ],
      faq: [
        {
          question: tr(
            "Cavalos mais velhos são bons para iniciantes?",
            "Are older horses good for beginners?",
            "¿Los caballos mayores son buenos para principiantes?"
          ),
          answer: tr(
            "Excelente escolha! Cavalos entre 10-16 anos são tipicamente mais calmos, experientes, e perdoadores. A idade traz sabedoria.",
            "Excellent choice! Horses between 10-16 years are typically calmer, more experienced, and more forgiving. Age brings wisdom.",
            "¡Excelente elección! Caballos entre 10-16 años son típicamente más tranquilos, experimentados y tolerantes. La edad trae sabiduría."
          ),
        },
        {
          question: tr(
            "Posso ter um cavalo sem experiência prévia?",
            "Can I own a horse without prior experience?",
            "¿Puedo tener un caballo sin experiencia previa?"
          ),
          answer: tr(
            "Sim, desde que tenha apoio de um instrutor e o cavalo seja adequado. Comece com aulas regulares e vá ganhando autonomia gradualmente.",
            "Yes, as long as you have instructor support and the horse is suitable. Start with regular lessons and gradually gain autonomy.",
            "Sí, siempre que tenga apoyo de un instructor y el caballo sea adecuado. Empiece con clases regulares y vaya ganando autonomía gradualmente."
          ),
        },
        {
          question: tr(
            "Quanto tempo devo dedicar ao cavalo?",
            "How much time should I dedicate to the horse?",
            "¿Cuánto tiempo debo dedicar al caballo?"
          ),
          answer: tr(
            "Mínimo 2-3 visitas semanais é ideal. Cavalos em pensão são cuidados diariamente, mas beneficiam do contacto regular consigo.",
            "A minimum of 2-3 weekly visits is ideal. Boarded horses are cared for daily, but benefit from regular contact with you.",
            "Mínimo 2-3 visitas semanales es ideal. Caballos en pensión son cuidados diariamente, pero se benefician del contacto regular con usted."
          ),
        },
        {
          question: tr(
            "Cavalos de escola reformados são boa opção?",
            "Are retired school horses a good option?",
            "¿Los caballos de escuela retirados son buena opción?"
          ),
          answer: tr(
            "Frequentemente são óptimos! Estão habituados a diferentes cavaleiros, são pacientes, e têm temperamentos de ouro. Preço também é mais acessível.",
            "They are often excellent! They are used to different riders, are patient, and have golden temperaments. The price is also more affordable.",
            "¡Frecuentemente son óptimos! Están habituados a diferentes jinetes, son pacientes y tienen temperamentos de oro. El precio también es más accesible."
          ),
        },
        {
          question: tr(
            "Preciso de equipamento próprio?",
            "Do I need my own equipment?",
            "¿Necesito equipamiento propio?"
          ),
          answer: tr(
            "No início pode usar equipamento da escola. Gradualmente invista em capacete (obrigatório), botas, e eventualmente sela própria se o cavalo for seu.",
            "Initially you can use school equipment. Gradually invest in a helmet (mandatory), boots, and eventually your own saddle if the horse is yours.",
            "Al principio puede usar equipamiento de la escuela. Gradualmente invierta en casco (obligatorio), botas, y eventualmente silla propia si el caballo es suyo."
          ),
        },
      ],
      timeline: [
        {
          month: tr("Mês 1-2", "Month 1-2", "Mes 1-2"),
          title: tr("Preparação", "Preparation", "Preparación"),
          description: tr(
            "Continuar lições, falar com instrutor sobre perfil ideal, visitar centros hípicos da zona.",
            "Continue lessons, talk to instructor about the ideal profile, visit local riding centres.",
            "Continuar lecciones, hablar con el instructor sobre el perfil ideal, visitar centros hípicos de la zona."
          ),
        },
        {
          month: tr("Mês 3-4", "Month 3-4", "Mes 3-4"),
          title: tr("Pesquisa Activa", "Active Search", "Búsqueda Activa"),
          description: tr(
            "Ver cavalos disponíveis, experimentar diferentes temperamentos, definir orçamento realista.",
            "View available horses, try different temperaments, define a realistic budget.",
            "Ver caballos disponibles, probar diferentes temperamentos, definir presupuesto realista."
          ),
        },
        {
          month: tr("Mês 5-6", "Month 5-6", "Mes 5-6"),
          title: tr("Selecção Cuidadosa", "Careful Selection", "Selección Cuidadosa"),
          description: tr(
            "Experimentar o cavalo várias vezes, em diferentes dias e situações. Pedir opinião ao instrutor.",
            "Try the horse multiple times, on different days and in different situations. Ask your instructor's opinion.",
            "Probar el caballo varias veces, en diferentes días y situaciones. Pedir opinión al instructor."
          ),
        },
        {
          month: tr("Mês 7", "Month 7", "Mes 7"),
          title: tr("Decisão", "Decision", "Decisión"),
          description: tr(
            "Exame veterinário básico, negociação, preparar local de pensão.",
            "Basic veterinary exam, negotiation, prepare boarding location.",
            "Examen veterinario básico, negociación, preparar lugar de pensión."
          ),
        },
        {
          month: tr("Mês 8-12", "Month 8-12", "Mes 8-12"),
          title: tr("Lua de Mel", "Honeymoon", "Luna de Miel"),
          description: tr(
            "Conhecer o cavalo, estabelecer rotinas, desfrutar da nova parceria sem pressas.",
            "Get to know the horse, establish routines, enjoy the new partnership without rushing.",
            "Conocer al caballo, establecer rutinas, disfrutar de la nueva alianza sin prisas."
          ),
        },
      ],
    },
  };
}

/** Backward-compatible static export — returns Portuguese strings. */
export const results = getResults((pt) => pt);
