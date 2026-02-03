"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  MapPin,
  Star,
  Award,
  Target,
  Heart,
  Compass,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  icon: React.ReactNode;
  options: {
    text: string;
    value: string;
    traits: string[];
  }[];
}

interface Result {
  profile: string;
  title: string;
  description: string;
  characteristics: string[];
  recommendedRegions: string[];
  linhagens: string[];
  icon: React.ReactNode;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual é o seu principal objetivo com o cavalo Lusitano?",
    icon: <Target className="text-[#C5A059]" size={32} />,
    options: [
      { text: "Competição de Dressage", value: "dressage", traits: ["competicao", "elegancia", "treino_avancado"] },
      { text: "Equitação de Trabalho", value: "trabalho", traits: ["tradicao", "versatilidade", "robustez"] },
      { text: "Lazer e Passeios", value: "lazer", traits: ["calmo", "seguro", "familiar"] },
      { text: "Reprodução e Criação", value: "criacao", traits: ["genetica", "linhagem", "morfologia"] },
    ],
  },
  {
    id: 2,
    question: "Qual é a sua experiência com cavalos?",
    icon: <Award className="text-[#C5A059]" size={32} />,
    options: [
      { text: "Iniciante - Estou a começar", value: "iniciante", traits: ["calmo", "seguro", "docil"] },
      { text: "Intermédio - Tenho alguma experiência", value: "intermedio", traits: ["versatil", "equilibrado"] },
      { text: "Avançado - Cavaleiro experiente", value: "avancado", traits: ["desafiante", "sensivel", "treino_avancado"] },
      { text: "Profissional - Trabalho com cavalos", value: "profissional", traits: ["competicao", "alto_nivel", "potencial"] },
    ],
  },
  {
    id: 3,
    question: "Que características mais valoriza num cavalo?",
    icon: <Heart className="text-[#C5A059]" size={32} />,
    options: [
      { text: "Elegância e presença", value: "elegancia", traits: ["elegancia", "morfologia", "presenca"] },
      { text: "Força e resistência", value: "forca", traits: ["robustez", "resistencia", "trabalho"] },
      { text: "Temperamento dócil", value: "docil", traits: ["calmo", "docil", "familiar"] },
      { text: "Inteligência e sensibilidade", value: "inteligente", traits: ["sensivel", "inteligente", "cooperativo"] },
    ],
  },
  {
    id: 4,
    question: "Em que região de Portugal prefere encontrar a sua coudelaria?",
    icon: <Compass className="text-[#C5A059]" size={32} />,
    options: [
      { text: "Ribatejo - Coração equestre", value: "ribatejo", traits: ["ribatejo", "tradicao"] },
      { text: "Alentejo - Planícies e tradição", value: "alentejo", traits: ["alentejo", "natureza"] },
      { text: "Lisboa - Proximidade urbana", value: "lisboa", traits: ["lisboa", "acessivel"] },
      { text: "Indiferente - O importante é a qualidade", value: "indiferente", traits: ["qualidade", "flexivel"] },
    ],
  },
  {
    id: 5,
    question: "Qual é o seu orçamento aproximado?",
    icon: <Star className="text-[#C5A059]" size={32} />,
    options: [
      { text: "Até €15.000", value: "economico", traits: ["acessivel", "iniciante"] },
      { text: "€15.000 - €30.000", value: "medio", traits: ["qualidade", "treinado"] },
      { text: "€30.000 - €60.000", value: "alto", traits: ["premium", "competicao"] },
      { text: "Acima de €60.000", value: "premium", traits: ["elite", "excepcional", "reproducao"] },
    ],
  },
  {
    id: 6,
    question: "Com que frequência planeia montar?",
    icon: <Clock className="text-[#C5A059]" size={32} />,
    options: [
      { text: "Diariamente - Treino intensivo", value: "diario", traits: ["competicao", "dedicado", "atleta"] },
      { text: "Várias vezes por semana", value: "frequente", traits: ["ativo", "progresso", "lazer_ativo"] },
      { text: "Fins de semana", value: "weekend", traits: ["lazer", "familiar", "passeio"] },
      { text: "Ocasionalmente", value: "ocasional", traits: ["calmo", "facil", "manuseamento"] },
    ],
  },
];

const results: Record<string, Result> = {
  competidor_elite: {
    profile: "competidor_elite",
    title: "Competidor de Elite",
    description: "Procura um cavalo de competição de alto nível, com potencial para brilhar nas pistas internacionais. Valoriza a elegância, os movimentos expressivos e a capacidade de trabalho.",
    characteristics: ["Movimentos expressivos", "Sangue competitivo", "Alta trainabilidade", "Presença em pista"],
    recommendedRegions: ["Ribatejo", "Alentejo"],
    linhagens: ["Veiga", "Alter Real"],
    icon: <Award className="text-[#C5A059]" size={48} />,
  },
  cavaleiro_tradicional: {
    profile: "cavaleiro_tradicional",
    title: "Cavaleiro Tradicional",
    description: "Aprecia a tradição equestre portuguesa e procura um cavalo versátil para trabalho de campo ou equitação de trabalho. Valoriza a robustez e o temperamento equilibrado.",
    characteristics: ["Versatilidade", "Resistência", "Bom carácter", "Adaptável"],
    recommendedRegions: ["Ribatejo", "Alentejo"],
    linhagens: ["Andrade", "Coudelaria Nacional"],
    icon: <Users className="text-[#C5A059]" size={48} />,
  },
  amador_entusiasta: {
    profile: "amador_entusiasta",
    title: "Amador Entusiasta",
    description: "Ama cavalos e procura um companheiro para desfrutar de passeios e momentos de lazer. Valoriza a segurança, o temperamento dócil e a facilidade de manuseamento.",
    characteristics: ["Temperamento calmo", "Fácil de montar", "Seguro", "Amigável"],
    recommendedRegions: ["Lisboa", "Centro"],
    linhagens: ["Qualquer linhagem com bom temperamento"],
    icon: <Heart className="text-[#C5A059]" size={48} />,
  },
  criador_genetica: {
    profile: "criador_genetica",
    title: "Criador Focado na Genética",
    description: "Interessado em reprodução e na preservação das linhagens tradicionais. Procura exemplares com genética comprovada e potencial reprodutivo.",
    characteristics: ["Morfologia excelente", "Genética comprovada", "Linhagem pura", "Potencial reprodutivo"],
    recommendedRegions: ["Ribatejo", "Alentejo"],
    linhagens: ["Veiga", "Alter Real", "Andrade"],
    icon: <Star className="text-[#C5A059]" size={48} />,
  },
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [allTraits, setAllTraits] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleAnswer = (option: { value: string; traits: string[] }) => {
    const newAnswers = [...answers, option.value];
    const newTraits = [...allTraits, ...option.traits];
    setAnswers(newAnswers);
    setAllTraits(newTraits);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newTraits);
    }
  };

  const calculateResult = (traits: string[]) => {
    // Contar traits para determinar o perfil
    const traitCounts: Record<string, number> = {};
    traits.forEach((trait) => {
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });

    // Determinar perfil baseado nos traits mais frequentes
    let profile = "amador_entusiasta"; // default

    const hasCompetition = traitCounts["competicao"] || traitCounts["treino_avancado"] || traitCounts["alto_nivel"];
    const hasTraditional = traitCounts["tradicao"] || traitCounts["trabalho"] || traitCounts["robustez"];
    const hasBreeding = traitCounts["genetica"] || traitCounts["linhagem"] || traitCounts["reproducao"];
    const hasLeisure = traitCounts["calmo"] || traitCounts["lazer"] || traitCounts["familiar"];

    if (hasCompetition >= 3 && (traitCounts["premium"] || traitCounts["elite"])) {
      profile = "competidor_elite";
    } else if (hasTraditional >= 3) {
      profile = "cavaleiro_tradicional";
    } else if (hasBreeding >= 2) {
      profile = "criador_genetica";
    } else if (hasLeisure >= 2) {
      profile = "amador_entusiasta";
    }

    setResult(results[profile]);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setAllTraits([]);
    setShowResult(false);
    setResult(null);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
              Quiz Interativo
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Qual é o Lusitano Ideal para Si?
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Responda a algumas perguntas e descubra que tipo de cavalo Lusitano
              se adequa melhor ao seu perfil e objetivos.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Barra de progresso */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-zinc-500 mb-2">
                  <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#E8D5A3]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Pergunta */}
              <div className="bg-zinc-900/50 border border-white/10 p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  {questions[currentQuestion].icon}
                  <h2 className="text-2xl font-serif text-white">
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                {/* Opções */}
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 bg-zinc-800/50 border border-white/10 hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300 group-hover:text-white transition-colors">
                          {option.text}
                        </span>
                        <ChevronRight className="text-zinc-600 group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Navegação */}
              {currentQuestion > 0 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <ChevronLeft size={18} />
                  Voltar
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {result && (
                <>
                  {/* Resultado */}
                  <div className="bg-gradient-to-b from-[#C5A059]/20 to-transparent border border-[#C5A059]/30 p-8 mb-8">
                    <div className="w-24 h-24 mx-auto bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-6">
                      {result.icon}
                    </div>

                    <span className="text-[#C5A059] text-sm uppercase tracking-wider block mb-2">
                      O seu perfil é
                    </span>
                    <h2 className="text-3xl font-serif text-white mb-4">
                      {result.title}
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto mb-8">
                      {result.description}
                    </p>

                    {/* Características */}
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
                      {result.characteristics.map((char) => (
                        <div
                          key={char}
                          className="flex items-center gap-2 text-sm text-zinc-300 bg-zinc-800/50 px-3 py-2"
                        >
                          <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                          {char}
                        </div>
                      ))}
                    </div>

                    {/* Recomendações */}
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                      <div className="bg-zinc-900/50 p-6 border border-white/10">
                        <div className="flex items-center gap-2 text-[#C5A059] mb-3">
                          <MapPin size={18} />
                          <span className="text-sm uppercase tracking-wider">Regiões Recomendadas</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.recommendedRegions.map((region) => (
                            <span key={region} className="bg-zinc-800 text-zinc-300 px-3 py-1 text-sm">
                              {region}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-zinc-900/50 p-6 border border-white/10">
                        <div className="flex items-center gap-2 text-[#C5A059] mb-3">
                          <Star size={18} />
                          <span className="text-sm uppercase tracking-wider">Linhagens Sugeridas</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.linhagens.map((lin) => (
                            <span key={lin} className="bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 text-sm">
                              {lin}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/directorio"
                      className="inline-flex items-center justify-center gap-2 bg-[#C5A059] text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-white transition-colors"
                    >
                      Explorar Coudelarias
                      <ChevronRight size={18} />
                    </Link>
                    <Link
                      href="/marketplace"
                      className="inline-flex items-center justify-center gap-2 border border-[#C5A059] text-[#C5A059] px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-black transition-colors"
                    >
                      Ver Cavalos à Venda
                    </Link>
                    <button
                      onClick={resetQuiz}
                      className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-400 px-6 py-4 hover:border-white/40 hover:text-white transition-colors"
                    >
                      <RotateCcw size={18} />
                      Repetir Quiz
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
