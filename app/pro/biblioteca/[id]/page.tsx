"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  Share2,
  Bookmark,
  Moon,
  Sun,
  Type,
  List,
  X,
  Check,
  Clock,
  Award,
  Star,
  MessageCircle,
  ThumbsUp,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Conteúdo do Ebook - Guia Completo do Cavalo Lusitano
const ebookContent = {
  id: "guia-completo-lusitano",
  title: "Guia Completo do Cavalo Lusitano",
  subtitle: "Da História à Excelência Moderna",
  author: "Portal Lusitano",
  cover: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=1200&fit=crop",
  chapters: [
    {
      id: 1,
      title: "Origens e História",
      duration: "15 min",
      completed: true,
      sections: [
        {
          title: "As Raízes Ibéricas",
          content: `O cavalo Lusitano é uma das raças equinas mais antigas do mundo, com origens que remontam a milhares de anos na Península Ibérica. Os seus antepassados foram os cavalos selvagens que habitavam a região, conhecidos pelos Romanos como os melhores cavalos de guerra.

A história do Lusitano está intrinsecamente ligada à história de Portugal. Durante séculos, estes cavalos foram montados por reis, nobres e guerreiros, desempenhando um papel crucial nas batalhas da Reconquista e nas grandes descobertas marítimas.

O nome "Lusitano" deriva da antiga Lusitânia, a região romana que correspondia aproximadamente ao território do atual Portugal. Esta designação oficial foi adotada em 1966, quando a raça foi formalmente separada do cavalo Andaluz espanhol, embora ambos partilhem uma origem comum.`,
          image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800",
        },
        {
          title: "A Era dos Descobrimentos",
          content: `Durante a Era dos Descobrimentos, o cavalo Lusitano viajou para os quatro cantos do mundo a bordo das caravelas portuguesas. Foi fundamental na colonização do Brasil e influenciou a criação de diversas raças sul-americanas, como o Mangalarga Marchador.

Os cavaleiros portugueses eram reconhecidos pela sua excepcional habilidade, fruto de séculos de tradição equestre. A gineta, o estilo de montar desenvolvido na Península Ibérica, tornou-se referência em toda a Europa.

A Real Coudelaria de Alter, fundada em 1748 pelo Rei D. João V, é um testemunho vivo desta tradição. É uma das mais antigas coudelarias do mundo ainda em funcionamento e berço da linha Alter Real, uma das mais prestigiadas do Lusitano.`,
          image: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800",
        },
        {
          title: "O Cavalo e a Tauromaquia",
          content: `Uma das características únicas do Lusitano é a sua utilização na tauromaquia portuguesa, uma arte que exige coragem, agilidade e uma ligação extraordinária entre cavalo e cavaleiro.

Ao contrário da tourada espanhola, na corrida de touros portuguesa à cavaleiro, o touro não é morto e o cavalo desempenha o papel principal. Isto requer um cavalo excecionalmente corajoso, ágil e bem treinado - qualidades que o Lusitano possui naturalmente.

Esta tradição secular moldou a seleção da raça, favorecendo animais com temperamento equilibrado, grande inteligência e capacidade atlética superior. Estas mesmas características fazem do Lusitano um cavalo de eleição para a Alta Escola e o Dressage moderno.`,
          image: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=800",
        },
      ],
    },
    {
      id: 2,
      title: "Características da Raça",
      duration: "20 min",
      completed: false,
      sections: [
        {
          title: "Morfologia e Conformação",
          content: `O cavalo Lusitano distingue-se pela sua morfologia harmoniosa e funcional. A sua conformação reflete séculos de seleção para trabalho de recolha e agilidade.

**Cabeça:** Perfil subconvexo (ligeiramente arqueado), olhos grandes e expressivos, orelhas médias e móveis. A cabeça deve transmitir nobreza e inteligência.

**Pescoço:** Bem inserido, arqueado e musculoso, com crina abundante. O pescoço é fundamental para o equilíbrio e a capacidade de recolha do cavalo.

**Corpo:** Compacto e bem proporcionado, com costado profundo, garupa arredondada e levemente inclinada. A linha dorsal é curta e forte.

**Membros:** Secos e bem proporcionados, com articulações fortes e cascos duros. Os posteriores são particularmente angulados, permitindo grande impulsão.

**Altura:** Entre 1,55m e 1,65m ao garrote, embora existam exemplares fora desta média.

**Pelagens:** Todas as pelagens são aceites, sendo as mais comuns o ruço (cinzento), castanho e preto. O alazão e o baio são menos frequentes mas igualmente valorizados.`,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        },
        {
          title: "Andamentos e Movimento",
          content: `Os andamentos do Lusitano são uma das suas características mais valorizadas. São naturalmente elevados, cadenciados e com grande amplitude, sem perder a leveza.

**Passo:** Marchado, regular, enérgico e elástico. O cavalo deve cobrir terreno com facilidade mantendo a cadência.

**Trote:** Elevado, cadenciado e com boa suspensão. O Lusitano tem uma tendência natural para a passada e o trote reunido.

**Galope:** Suave, equilibrado e fácil de sentar. Deve ser fácil de reunir e alongar, demonstrando a flexibilidade natural da raça.

**Piaffé e Passage:** Muitos Lusitanos demonstram aptidão natural para estes movimentos de Alta Escola, fruto de séculos de seleção para o trabalho de recolha.

A qualidade dos andamentos é fundamental na avaliação de um Lusitano. Um bom exemplar deve mover-se com elegância, equilíbrio e aparente facilidade.`,
          image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800",
        },
      ],
    },
    {
      id: 3,
      title: "Linhagens de Elite",
      duration: "25 min",
      completed: false,
      sections: [
        {
          title: "A Importância das Linhagens",
          content: `No mundo do cavalo Lusitano, as linhagens são fundamentais. Cada linha de sangue traz características distintivas que foram cultivadas ao longo de gerações por criadores dedicados.

Conhecer as linhagens permite:
- Prever características físicas e temperamentais
- Planear cruzamentos estratégicos
- Valorizar exemplares com genealogia comprovada
- Preservar a diversidade genética da raça

As principais coudelarias históricas deram origem às linhagens mais prestigiadas, cada uma com a sua identidade única.`,
          image: "https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=800",
        },
        {
          title: "Veiga - O Legado",
          content: `A linha Veiga é uma das mais influentes na história do cavalo Lusitano. Fundada por Manuel Tavares Veiga no início do século XX, esta coudelaria produziu alguns dos garanhões mais importantes da raça.

**Características típicas:**
- Excelente conformação e morfologia
- Andamentos elevados e cadenciados
- Temperamento equilibrado
- Grande aptidão para trabalho de recolha

**Garanhões históricos:**
- Novilheiro (V), considerado um dos melhores garanhões de sempre
- Opus (V), influente na linha moderna
- Hábil (V), pai de numerosos campeões

A marca "V" na genealogia de um Lusitano é sinónimo de qualidade e prestígio.`,
          image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800",
        },
      ],
    },
  ],
};

export default function EbookReaderPage() {
  const params = useParams();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progress, setProgress] = useState(25);

  const chapter = ebookContent.chapters[currentChapter];
  const section = chapter?.sections[currentSection];
  const totalSections = ebookContent.chapters.reduce((acc, ch) => acc + ch.sections.length, 0);

  const goToNext = () => {
    if (currentSection < chapter.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (currentChapter < ebookContent.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setCurrentSection(0);
    }
  };

  const goToPrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setCurrentSection(ebookContent.chapters[currentChapter - 1].sections.length - 1);
    }
  };

  return (
    <main className={`min-h-screen ${isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f5f5f0]"} pt-28`}>
      {/* Top Bar */}
      <div className={`fixed top-28 left-0 right-0 z-40 ${isDarkMode ? "bg-[#0a0a0a]/95" : "bg-white/95"} backdrop-blur-sm border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/pro/biblioteca"
            className={`flex items-center gap-2 ${isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"} transition-colors`}
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Biblioteca</span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Progress */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C5A059] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-600"}`}>
                {progress}%
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowToc(!showToc)}
                className={`p-2 rounded ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"} transition-colors`}
                title="Índice"
              >
                <List size={20} className={isDarkMode ? "text-zinc-400" : "text-zinc-600"} />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"} transition-colors`}
                title="Guardar"
              >
                <Bookmark
                  size={20}
                  className={isBookmarked ? "text-[#C5A059] fill-[#C5A059]" : isDarkMode ? "text-zinc-400" : "text-zinc-600"}
                />
              </button>
              <button
                onClick={() => setFontSize(fontSize === 18 ? 22 : fontSize === 22 ? 14 : 18)}
                className={`p-2 rounded ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"} transition-colors`}
                title="Tamanho do texto"
              >
                <Type size={20} className={isDarkMode ? "text-zinc-400" : "text-zinc-600"} />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"} transition-colors`}
                title="Modo de leitura"
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-zinc-400" />
                ) : (
                  <Moon size={20} className="text-zinc-600" />
                )}
              </button>
              <button
                className={`p-2 rounded ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"} transition-colors`}
                title="Descarregar PDF"
              >
                <Download size={20} className={isDarkMode ? "text-zinc-400" : "text-zinc-600"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents Sidebar */}
      <AnimatePresence>
        {showToc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowToc(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25 }}
              className={`fixed top-0 left-0 bottom-0 w-80 ${isDarkMode ? "bg-[#0a0a0a]" : "bg-white"} z-50 overflow-y-auto`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`text-lg font-serif ${isDarkMode ? "text-white" : "text-black"}`}>
                    Índice
                  </h3>
                  <button onClick={() => setShowToc(false)}>
                    <X size={20} className={isDarkMode ? "text-zinc-400" : "text-zinc-600"} />
                  </button>
                </div>

                <div className="space-y-4">
                  {ebookContent.chapters.map((ch, chIndex) => (
                    <div key={ch.id}>
                      <button
                        onClick={() => {
                          setCurrentChapter(chIndex);
                          setCurrentSection(0);
                          setShowToc(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          currentChapter === chIndex
                            ? "bg-[#C5A059]/10 border border-[#C5A059]/30"
                            : isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {ch.completed ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full border ${isDarkMode ? "border-zinc-600" : "border-zinc-300"}`} />
                          )}
                          <div>
                            <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-black"}`}>
                              {ch.title}
                            </h4>
                            <span className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-600"}`}>
                              {ch.duration}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Sections */}
                      <div className="ml-8 mt-2 space-y-1">
                        {ch.sections.map((sec, secIndex) => (
                          <button
                            key={secIndex}
                            onClick={() => {
                              setCurrentChapter(chIndex);
                              setCurrentSection(secIndex);
                              setShowToc(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                              currentChapter === chIndex && currentSection === secIndex
                                ? "text-[#C5A059]"
                                : isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-600 hover:text-black"
                            }`}
                          >
                            {sec.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="pt-20 pb-32">
        <article className="max-w-3xl mx-auto px-6">
          {section && (
            <motion.div
              key={`${currentChapter}-${currentSection}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Chapter Title */}
              <div className="mb-8">
                <span className="text-[#C5A059] text-sm uppercase tracking-widest">
                  Capítulo {chapter.id}
                </span>
                <h1 className={`text-3xl md:text-4xl font-serif mt-2 ${isDarkMode ? "text-white" : "text-black"}`}>
                  {chapter.title}
                </h1>
              </div>

              {/* Section Title */}
              <h2 className={`text-2xl font-serif mb-6 ${isDarkMode ? "text-white" : "text-black"}`}>
                {section.title}
              </h2>

              {/* Image */}
              {section.image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div
                className={`prose max-w-none ${isDarkMode ? "prose-invert" : ""}`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
              >
                {section.content.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className={`mb-6 ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}
                  >
                    {paragraph.split("**").map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className={isDarkMode ? "text-white" : "text-black"}>
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </article>
      </div>

      {/* Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? "bg-[#0a0a0a]/95" : "bg-white/95"} backdrop-blur-sm border-t ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={goToPrev}
            disabled={currentChapter === 0 && currentSection === 0}
            className={`flex items-center gap-2 px-6 py-3 transition-colors ${
              currentChapter === 0 && currentSection === 0
                ? "text-zinc-600 cursor-not-allowed"
                : isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
            }`}
          >
            <ChevronLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className={`text-sm ${isDarkMode ? "text-zinc-500" : "text-zinc-600"}`}>
            {chapter?.title}
          </div>

          <button
            onClick={goToNext}
            disabled={
              currentChapter === ebookContent.chapters.length - 1 &&
              currentSection === chapter?.sections.length - 1
            }
            className={`flex items-center gap-2 px-6 py-3 transition-colors ${
              currentChapter === ebookContent.chapters.length - 1 &&
              currentSection === chapter?.sections.length - 1
                ? "text-zinc-600 cursor-not-allowed"
                : "bg-[#C5A059] text-black hover:bg-white"
            }`}
          >
            <span>Próximo</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
