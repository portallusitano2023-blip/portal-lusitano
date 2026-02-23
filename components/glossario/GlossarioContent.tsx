"use client";

import { useState, useMemo, useRef } from "react";
import { Search, BookOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ============================================
// DATA - Standard equestrian terms only
// All terms are universally accepted FEI/APSL terminology
// ============================================

interface GlossaryTerm {
  pt: string;
  en: string;
  definition: string;
  definitionEn: string;
  definitionEs: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    pt: "Adestramento",
    en: "Dressage",
    definition:
      "Disciplina equestre de treino metodico do cavalo, visando o desenvolvimento harmonioso das suas capacidades naturais.",
    definitionEn:
      "Equestrian discipline of methodical horse training, aimed at the harmonious development of its natural abilities.",
    definitionEs:
      "Disciplina ecuestre de entrenamiento metodico del caballo, orientada al desarrollo armonioso de sus capacidades naturales.",
  },
  {
    pt: "Andamento",
    en: "Gait",
    definition:
      "Forma de locomocao do cavalo. Os tres andamentos naturais sao o passo, o trote e o galope.",
    definitionEn:
      "The horse's form of locomotion. The three natural gaits are walk, trot, and canter/gallop.",
    definitionEs:
      "Forma de locomocion del caballo. Los tres aires naturales son el paso, el trote y el galope.",
  },
  {
    pt: "Balotada",
    en: "Balotade",
    definition:
      "Salto de alta escola em que o cavalo eleva os membros anteriores e posteriores simultaneamente, mostrando as ferraduras dos posteriores.",
    definitionEn:
      "A haute ecole jump in which the horse lifts both the forelegs and hind legs simultaneously, showing the shoes of the hind feet.",
    definitionEs:
      "Salto de alta escuela en el que el caballo eleva los miembros anteriores y posteriores simultaneamente, mostrando las herraduras traseras.",
  },
  {
    pt: "Cabresto",
    en: "Halter",
    definition:
      "Peca de equipamento colocada na cabeca do cavalo para conducao e contencao, sem embocadura.",
    definitionEn:
      "A piece of equipment placed on the horse's head for leading and restraint, without a bit.",
    definitionEs:
      "Pieza de equipo colocada en la cabeza del caballo para conduccion y contencion, sin embocadura.",
  },
  {
    pt: "Capriola",
    en: "Capriole",
    definition:
      "Salto de alta escola onde o cavalo salta no ar e coiceia com os membros posteriores estendidos horizontalmente.",
    definitionEn:
      "A haute ecole jump where the horse leaps into the air and kicks out with the hind legs extended horizontally.",
    definitionEs:
      "Salto de alta escuela donde el caballo salta en el aire y cocea con los miembros posteriores extendidos horizontalmente.",
  },
  {
    pt: "Cavaletti",
    en: "Cavaletti",
    definition:
      "Obstaculos baixos, geralmente barras sobre suportes, usados no treino para melhorar o ritmo e a elevacao do cavalo.",
    definitionEn:
      "Low obstacles, usually poles on supports, used in training to improve the horse's rhythm and elevation.",
    definitionEs:
      "Obstaculos bajos, generalmente barras sobre soportes, usados en el entrenamiento para mejorar el ritmo y la elevacion del caballo.",
  },
  {
    pt: "Chanfro",
    en: "Face / Nasal bone",
    definition:
      "Parte frontal da cabeca do cavalo, entre os olhos e os narizes, correspondente ao osso nasal.",
    definitionEn:
      "The front part of the horse's head, between the eyes and the nostrils, corresponding to the nasal bone.",
    definitionEs:
      "Parte frontal de la cabeza del caballo, entre los ojos y los ollares, correspondiente al hueso nasal.",
  },
  {
    pt: "Coudelaria",
    en: "Stud farm",
    definition:
      "Estabelecimento dedicado a criacao e reproducao de cavalos, com seleccao genetica e maneio especializado.",
    definitionEn:
      "An establishment dedicated to the breeding and reproduction of horses, with genetic selection and specialized management.",
    definitionEs:
      "Establecimiento dedicado a la cria y reproduccion de caballos, con seleccion genetica y manejo especializado.",
  },
  {
    pt: "Courbette",
    en: "Courbette",
    definition:
      "Salto de alta escola em que o cavalo se eleva sobre os membros posteriores e avanca com saltos curtos sem tocar o chao com os anteriores.",
    definitionEn:
      "A haute ecole jump in which the horse rises on the hind legs and hops forward without touching the ground with the forelegs.",
    definitionEs:
      "Salto de alta escuela en el que el caballo se eleva sobre los miembros posteriores y avanza con saltos cortos sin tocar el suelo con los anteriores.",
  },
  {
    pt: "Embocadura",
    en: "Bit",
    definition:
      "Peca metalica colocada na boca do cavalo, parte do bridao ou freio, que permite a comunicacao entre cavaleiro e cavalo.",
    definitionEn:
      "A metal piece placed in the horse's mouth, part of the bridle, that enables communication between rider and horse.",
    definitionEs:
      "Pieza metalica colocada en la boca del caballo, parte del bridon o freno, que permite la comunicacion entre jinete y caballo.",
  },
  {
    pt: "Ensilhar",
    en: "To saddle",
    definition:
      "Acto de colocar a sela e restante equipamento no dorso do cavalo, preparando-o para ser montado.",
    definitionEn:
      "The act of placing the saddle and remaining equipment on the horse's back, preparing it to be ridden.",
    definitionEs:
      "Acto de colocar la silla y el equipo restante en el dorso del caballo, preparandolo para ser montado.",
  },
  {
    pt: "Estribos",
    en: "Stirrups",
    definition:
      "Pecas metalicas ou sinteticas suspensas da sela por correias, onde o cavaleiro apoia os pes.",
    definitionEn:
      "Metal or synthetic pieces suspended from the saddle by leathers, where the rider rests their feet.",
    definitionEs:
      "Piezas metalicas o sinteticas suspendidas de la silla por correas, donde el jinete apoya los pies.",
  },
  {
    pt: "Ferradura",
    en: "Horseshoe",
    definition:
      "Peca metalica em forma de U aplicada nos cascos do cavalo para proteccao e traccao.",
    definitionEn:
      "A U-shaped metal piece applied to the horse's hooves for protection and traction.",
    definitionEs:
      "Pieza metalica en forma de U aplicada en los cascos del caballo para proteccion y traccion.",
  },
  {
    pt: "Galope",
    en: "Canter / Gallop",
    definition: "Andamento natural a tres tempos, o mais rapido dos andamentos basicos do cavalo.",
    definitionEn: "A natural three-beat gait, the fastest of the horse's basic gaits.",
    definitionEs: "Aire natural a tres tiempos, el mas rapido de los aires basicos del caballo.",
  },
  {
    pt: "Garupa",
    en: "Croup",
    definition: "Parte posterior do dorso do cavalo, desde a anca ate a base da cauda.",
    definitionEn: "The rear part of the horse's back, from the hip to the base of the tail.",
    definitionEs:
      "Parte posterior del dorso del caballo, desde la cadera hasta la base de la cola.",
  },
  {
    pt: "Garrote / Cernelha",
    en: "Withers",
    definition:
      "Ponto mais alto do dorso do cavalo, situado entre o pescoco e as costas, utilizado como referencia para medir a altura.",
    definitionEn:
      "The highest point of the horse's back, located between the neck and the back, used as a reference for measuring height.",
    definitionEs:
      "Punto mas alto del dorso del caballo, situado entre el cuello y el lomo, utilizado como referencia para medir la altura.",
  },
  {
    pt: "Hipismo",
    en: "Equestrianism",
    definition:
      "Conjunto de actividades equestres desportivas, incluindo saltos de obstaculos, dressage, concurso completo e outras disciplinas.",
    definitionEn:
      "The set of equestrian sporting activities, including show jumping, dressage, eventing, and other disciplines.",
    definitionEs:
      "Conjunto de actividades ecuestres deportivas, incluyendo salto de obstaculos, doma clasica, concurso completo y otras disciplinas.",
  },
  {
    pt: "Levada",
    en: "Levade",
    definition:
      "Exercicio de alta escola em que o cavalo se eleva sobre os membros posteriores num angulo de cerca de 45 graus, mantendo os anteriores recolhidos.",
    definitionEn:
      "A haute ecole exercise in which the horse rises on the hind legs at an angle of about 45 degrees, keeping the forelegs tucked.",
    definitionEs:
      "Ejercicio de alta escuela en el que el caballo se eleva sobre los miembros posteriores a un angulo de unos 45 grados, manteniendo los anteriores recogidos.",
  },
  {
    pt: "Linhagem",
    en: "Bloodline",
    definition:
      "Linha genealogica de um cavalo, que documenta a ascendencia e descendencia atraves de geracoes.",
    definitionEn:
      "A horse's genealogical line, documenting ancestry and descent across generations.",
    definitionEs:
      "Linea genealogica de un caballo, que documenta la ascendencia y descendencia a traves de generaciones.",
  },
  {
    pt: "Lusitano",
    en: "Lusitano",
    definition:
      "Raca de cavalo originaria de Portugal, reconhecida pela sua inteligencia, coragem e aptidao para alta escola e trabalho de campo.",
    definitionEn:
      "A horse breed originating from Portugal, renowned for its intelligence, courage, and aptitude for haute ecole and fieldwork.",
    definitionEs:
      "Raza de caballo originaria de Portugal, reconocida por su inteligencia, coraje y aptitud para la alta escuela y el trabajo de campo.",
  },
  {
    pt: "Maneio",
    en: "Horse management",
    definition:
      "Conjunto de cuidados diarios prestados ao cavalo, incluindo alimentacao, higiene, saude e alojamento.",
    definitionEn:
      "The set of daily care provided to the horse, including feeding, hygiene, health, and housing.",
    definitionEs:
      "Conjunto de cuidados diarios proporcionados al caballo, incluyendo alimentacion, higiene, salud y alojamiento.",
  },
  {
    pt: "Passage",
    en: "Passage",
    definition:
      "Trote elevado e cadenciado, com grande suspensao e movimentos lentos e expressivos. Exercicio avancado de dressage.",
    definitionEn:
      "An elevated and cadenced trot, with great suspension and slow, expressive movements. An advanced dressage exercise.",
    definitionEs:
      "Trote elevado y cadenciado, con gran suspension y movimientos lentos y expresivos. Ejercicio avanzado de doma clasica.",
  },
  {
    pt: "Passo",
    en: "Walk",
    definition:
      "Andamento natural a quatro tempos, o mais lento dos andamentos do cavalo, em que pelo menos dois membros estao sempre em contacto com o solo.",
    definitionEn:
      "A natural four-beat gait, the slowest of the horse's gaits, in which at least two legs are always in contact with the ground.",
    definitionEs:
      "Aire natural a cuatro tiempos, el mas lento de los aires del caballo, en el que al menos dos miembros estan siempre en contacto con el suelo.",
  },
  {
    pt: "Pedigree",
    en: "Pedigree",
    definition:
      "Registo genealogico oficial do cavalo, que documenta a ascendencia ao longo de varias geracoes.",
    definitionEn:
      "The official genealogical record of a horse, documenting ancestry across several generations.",
    definitionEs:
      "Registro genealogico oficial del caballo, que documenta la ascendencia a lo largo de varias generaciones.",
  },
  {
    pt: "Pelagem",
    en: "Coat colour",
    definition:
      "Cor e padrao do pelo do cavalo. As pelagens mais comuns no Lusitano sao o ruano, o castanho e o preto.",
    definitionEn:
      "The colour and pattern of the horse's coat. The most common coat colours in the Lusitano are grey, bay, and black.",
    definitionEs:
      "Color y patron del pelaje del caballo. Los colores mas comunes en el Lusitano son el tordo, el castano y el negro.",
  },
  {
    pt: "Piaffe",
    en: "Piaffe",
    definition:
      "Trote no lugar, com elevacao cadenciada dos membros, sem deslocacao para a frente. Exercicio avancado de dressage.",
    definitionEn:
      "A trot in place, with cadenced elevation of the limbs, without forward movement. An advanced dressage exercise.",
    definitionEs:
      "Trote en el lugar, con elevacion cadenciada de los miembros, sin desplazamiento hacia adelante. Ejercicio avanzado de doma clasica.",
  },
  {
    pt: "Picadeiro",
    en: "Arena / Riding school",
    definition:
      "Recinto fechado ou ao ar livre, com dimensoes regulamentares, destinado ao trabalho e treino de cavalos.",
    definitionEn:
      "An enclosed or open-air area, with regulation dimensions, intended for working and training horses.",
    definitionEs:
      "Recinto cerrado o al aire libre, con dimensiones reglamentarias, destinado al trabajo y entrenamiento de caballos.",
  },
  {
    pt: "Pilar",
    en: "Pillar",
    definition:
      "Instrumento de treino de alta escola, composto por postes verticais entre os quais o cavalo executa exercicios como o piaffe.",
    definitionEn:
      "A haute ecole training instrument, consisting of vertical posts between which the horse performs exercises such as the piaffe.",
    definitionEs:
      "Instrumento de entrenamiento de alta escuela, compuesto por postes verticales entre los cuales el caballo ejecuta ejercicios como el piaffe.",
  },
  {
    pt: "Redea",
    en: "Rein",
    definition:
      "Correias que ligam a embocadura ou o hackamore as maos do cavaleiro, permitindo direccionar e controlar o cavalo.",
    definitionEn:
      "Straps connecting the bit or hackamore to the rider's hands, allowing direction and control of the horse.",
    definitionEs:
      "Correas que conectan la embocadura o el hackamore a las manos del jinete, permitiendo dirigir y controlar el caballo.",
  },
  {
    pt: "Reprise",
    en: "Test / Reprise",
    definition:
      "Sequencia predefinida de exercicios executados numa prova de dressage, avaliada por juizes segundo criterios da FEI.",
    definitionEn:
      "A predefined sequence of exercises performed in a dressage test, evaluated by judges according to FEI criteria.",
    definitionEs:
      "Secuencia predefinida de ejercicios ejecutados en una prueba de doma clasica, evaluada por jueces segun criterios de la FEI.",
  },
  {
    pt: "Sela",
    en: "Saddle",
    definition:
      "Assento colocado no dorso do cavalo para conforto e seguranca do cavaleiro. Existem varios tipos: dressage, salto, mista.",
    definitionEn:
      "A seat placed on the horse's back for the rider's comfort and safety. Several types exist: dressage, jumping, all-purpose.",
    definitionEs:
      "Asiento colocado en el dorso del caballo para comodidad y seguridad del jinete. Existen varios tipos: doma, salto, mixta.",
  },
  {
    pt: "Toureio",
    en: "Mounted bullfighting",
    definition:
      "Arte de tourear a cavalo, tradicao iberia em que o cavaleiro demonstra dominio tecnico e harmonia com o cavalo.",
    definitionEn:
      "The art of bullfighting on horseback, an Iberian tradition in which the rider demonstrates technical mastery and harmony with the horse.",
    definitionEs:
      "Arte de torear a caballo, tradicion iberica en la que el jinete demuestra dominio tecnico y armonia con el caballo.",
  },
  {
    pt: "Trote",
    en: "Trot",
    definition:
      "Andamento natural a dois tempos, em que os membros diagonais se movem em simultaneo.",
    definitionEn: "A natural two-beat gait, in which the diagonal limbs move simultaneously.",
    definitionEs:
      "Aire natural a dos tiempos, en el que los miembros diagonales se mueven simultaneamente.",
  },
  {
    pt: "Volteio",
    en: "Vaulting",
    definition:
      "Disciplina equestre que consiste em executar exercicios de ginastica sobre um cavalo em movimento, ao galope num circulo.",
    definitionEn:
      "An equestrian discipline consisting of performing gymnastic exercises on a moving horse, cantering in a circle.",
    definitionEs:
      "Disciplina ecuestre que consiste en ejecutar ejercicios de gimnasia sobre un caballo en movimiento, al galope en un circulo.",
  },
];

// ============================================
// HELPERS
// ============================================

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getAvailableLetters(terms: GlossaryTerm[]): Set<string> {
  const letters = new Set<string>();
  terms.forEach((term) => {
    const firstLetter = term.pt.charAt(0).toUpperCase();
    letters.add(firstLetter);
  });
  return letters;
}

// ============================================
// COMPONENTS
// ============================================

function TermCard({ term, language }: { term: GlossaryTerm; language: string }) {
  const definition =
    language === "en" ? term.definitionEn : language === "es" ? term.definitionEs : term.definition;

  return (
    <article className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6 hover:border-[var(--gold)]/30 transition-colors duration-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-serif text-[var(--foreground)]">{term.pt}</h3>
        <span className="text-xs font-medium px-2.5 py-1 bg-[var(--gold)]/10 text-[var(--gold)] rounded-full whitespace-nowrap flex-shrink-0">
          {term.en}
        </span>
      </div>
      <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">{definition}</p>
    </article>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function GlossarioContent() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const availableLetters = useMemo(() => getAvailableLetters(glossaryTerms), []);

  const filteredTerms = useMemo(() => {
    let terms = glossaryTerms;

    if (activeLetter) {
      terms = terms.filter((term) => term.pt.charAt(0).toUpperCase() === activeLetter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      terms = terms.filter(
        (term) =>
          term.pt.toLowerCase().includes(query) ||
          term.en.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          term.definitionEn.toLowerCase().includes(query)
      );
    }

    return terms;
  }, [searchQuery, activeLetter]);

  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      const letter = term.pt.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const sortedLetters = Object.keys(groupedTerms).sort();

  const handleLetterClick = (letter: string) => {
    if (activeLetter === letter) {
      setActiveLetter(null);
    } else {
      setActiveLetter(letter);
      setSearchQuery("");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setActiveLetter(null);
    }
  };

  const pageTitle =
    language === "en"
      ? "Equestrian Glossary"
      : language === "es"
        ? "Glosario Ecuestre"
        : "Glossario Equestre";

  const pageSubtitle =
    language === "en"
      ? "Essential terminology for the equestrian world"
      : language === "es"
        ? "Terminologia esencial del mundo ecuestre"
        : "Terminologia essencial do mundo equestre";

  const searchPlaceholder =
    language === "en"
      ? "Search terms in Portuguese or English..."
      : language === "es"
        ? "Buscar terminos en portugues o ingles..."
        : "Pesquisar termos em portugues ou ingles...";

  const noResultsMessage =
    language === "en"
      ? "No terms found. Try a different search."
      : language === "es"
        ? "No se encontraron terminos. Intente otra busqueda."
        : "Nenhum termo encontrado. Tente outra pesquisa.";

  const termsCountLabel =
    language === "en"
      ? `${filteredTerms.length} term${filteredTerms.length !== 1 ? "s" : ""}`
      : language === "es"
        ? `${filteredTerms.length} termino${filteredTerms.length !== 1 ? "s" : ""}`
        : `${filteredTerms.length} termo${filteredTerms.length !== 1 ? "s" : ""}`;

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="text-[var(--gold)]" size={32} />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-4">
            {language === "en" ? "Reference" : language === "es" ? "Referencia" : "Referencia"}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
            {pageTitle}
          </h1>
          <p className="text-[var(--foreground-secondary)] font-serif italic max-w-xl mx-auto">
            {pageSubtitle}
          </p>
        </div>

        {/* ===== SEARCH ===== */}
        <div
          className="mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative max-w-xl mx-auto">
            <label htmlFor="glossary-search" className="sr-only">
              {searchPlaceholder}
            </label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
              size={18}
              aria-hidden="true"
            />
            <input
              id="glossary-search"
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-11 pr-4 py-3.5 bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:border-[var(--gold)]/50 transition-colors text-sm"
            />
          </div>
        </div>

        {/* ===== ALPHABET NAVIGATION ===== */}
        <nav
          aria-label={
            language === "en"
              ? "Filter by letter"
              : language === "es"
                ? "Filtrar por letra"
                : "Filtrar por letra"
          }
          className="mb-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto">
            {ALPHABET.map((letter) => {
              const isAvailable = availableLetters.has(letter);
              const isActive = activeLetter === letter;

              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && handleLetterClick(letter)}
                  disabled={!isAvailable}
                  aria-pressed={isActive}
                  aria-label={
                    language === "en"
                      ? `Filter by letter ${letter}`
                      : `Filtrar pela letra ${letter}`
                  }
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[var(--gold)] text-black"
                      : isAvailable
                        ? "bg-[var(--background-secondary)]/80 text-[var(--foreground-secondary)] hover:bg-[var(--background-card)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border)]"
                        : "bg-transparent text-[var(--foreground-muted)] cursor-not-allowed"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ===== RESULTS COUNT ===== */}
        <div
          className="flex items-center justify-between mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            {termsCountLabel}
            {activeLetter && (
              <span>
                {" "}
                &mdash; {language === "en" ? "letter" : language === "es" ? "letra" : "letra"}{" "}
                <span className="text-[var(--gold)] font-medium">{activeLetter}</span>
              </span>
            )}
          </p>
          {(activeLetter || searchQuery) && (
            <button
              onClick={() => {
                setActiveLetter(null);
                setSearchQuery("");
              }}
              className="text-sm text-[var(--gold)] hover:text-[var(--foreground)] transition-colors"
            >
              {language === "en"
                ? "Clear filters"
                : language === "es"
                  ? "Limpiar filtros"
                  : "Limpar filtros"}
            </button>
          )}
        </div>

        {/* ===== TERMS LIST ===== */}
        <div
          ref={resultsRef}
          aria-live="polite"
          aria-atomic="false"
          className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.25s" }}
        >
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16 bg-[var(--background-secondary)]/30 border border-[var(--border)] rounded-xl">
              <Search
                className="mx-auto text-[var(--foreground-muted)] mb-4"
                size={40}
                aria-hidden="true"
              />
              <p className="text-[var(--foreground-muted)]">{noResultsMessage}</p>
            </div>
          ) : (
            <div className="space-y-10">
              {sortedLetters.map((letter) => (
                <section key={letter} aria-labelledby={`letter-heading-${letter}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <h2
                      id={`letter-heading-${letter}`}
                      className="text-3xl font-serif text-[var(--gold)] flex-shrink-0"
                    >
                      {letter}
                    </h2>
                    <div className="h-px flex-1 bg-[var(--background-card)]" aria-hidden="true" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {groupedTerms[letter].map((term) => (
                      <TermCard key={term.pt} term={term} language={language} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* ===== FOOTER NOTE ===== */}
        <div
          className="mt-16 text-center p-8 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
            {language === "en"
              ? "All terms follow standard FEI and APSL terminology. This glossary is for educational reference only."
              : language === "es"
                ? "Todos los terminos siguen la terminologia oficial de la FEI y APSL. Este glosario es solo para referencia educativa."
                : "Todos os termos seguem a terminologia oficial da FEI e APSL. Este glossario destina-se apenas a referencia educativa."}
          </p>
        </div>
      </div>
    </main>
  );
}
