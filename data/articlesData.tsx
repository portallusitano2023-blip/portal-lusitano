import type { ReactNode } from "react";
import {
  Microscope,
  Dna,
  Shield,
  Swords,
  Flame,
  Award,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Brain,
  Eye,
  Trophy,
} from "lucide-react";
import {
  ArticleImage,
  ArticleInfoBox,
  ArticleSection,
  ArticleStatCard,
  ArticleWarningBox,
  ArticlePillarCard,
  articleTextClasses,
} from "@/components/journal/ArticleComponents";

// Tipos para os artigos
export interface Article {
  title: string;
  subtitle: string;
  description?: string;
  keywords?: string[];
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: ReactNode;
}

// Re-exportar para compatibilidade
export { ArticleImage };

// ARTIGOS EM PORTUGUÊS
export const articlesDataPT: Record<string, Article> = {
  "1": {
    title: "Tratado Histórico: A Génese do Cavalo Ibérico",
    subtitle:
      "5000 anos de seleção contínua: Do Refúgio Glaciar à Gineta de Guerra. Uma tese sobre a sobrevivência do cavalo mais influente da história.",
    description:
      "Estudos de ADN mitocondrial identificaram o Haplogrupo D1 como marcador exclusivo da Península Ibérica. A teoria do Refúgio Glaciar e a evolução do cavalo Lusitano.",
    keywords: [
      "Lusitano",
      "genética equina",
      "Haplogrupo D1",
      "Península Ibérica",
      "história do cavalo",
    ],
    date: "25 JAN 2026",
    readTime: "120 min",
    category: "História & Arqueologia",
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>A</span>
          narrativa tradicional de que o cavalo chegou à Península Ibérica vindo do Oriente (Teoria
          das Estepes) foi definitivamente refutada pela ciência moderna. Estudos de ADN
          mitocondrial (Jansen et al., 2002; CIES, 2010) identificaram o{" "}
          <strong>Haplogrupo D1</strong> como um marcador exclusivo da Península Ibérica, presente
          em mais de 70% dos cavalos Lusitanos testados.
        </p>
        <p className={articleTextClasses.body}>
          Isto confirma a teoria do &quot;Refúgio Glaciar&quot;. Durante o Último Máximo Glacial (há
          cerca de 20.000 anos), enquanto o norte da Europa estava coberto por gelo, a Península
          Ibérica manteve um microclima temperado. O <em>Equus ferus ibericus</em> não só sobreviveu
          aqui, como foi domesticado localmente nas bacias do Tejo e Sado.
        </p>

        <ArticleInfoBox title="EVIDÊNCIA ARQUEOLÓGICA ESTRATIFICADA" icon={Microscope}>
          <div className="space-y-6">
            <div className="border-l-2 border-[var(--border)] pl-6">
              <h5 className="text-[var(--foreground)] font-bold mb-2 text-lg">
                Gruta do Escoural (Montemor-o-Novo)
              </h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                Datação: 20.000-18.000 BP (Before Present)
              </p>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                Pinturas rupestres com cavalos de perfil subconvexo, pescoço arqueado e garupa
                arredondada. A análise morfométrica das representações revela uma correspondência de
                87% com o padrão morfológico do Lusitano moderno.
              </p>
            </div>
            <div className="border-l-2 border-[var(--border)] pl-6">
              <h5 className="text-[var(--foreground)] font-bold mb-2 text-lg">
                Concheiros de Muge (Vale do Tejo)
              </h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                Datação: 5.500-3.000 a.C. | Cultura Mesolítica
              </p>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                Evidências osteológicas de cavalos domesticados encontradas em Moita do Sebastião e
                Cabeço da Arruda. A análise de isótopos estáveis revelou padrões de alimentação
                controlada.
              </p>
            </div>
          </div>
        </ArticleInfoBox>

        <ArticleImage
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalos ibéricos em representação artística"
          caption="Representação artística de cavalos ibéricos primitivos"
        />

        <ArticleSection title="I. A Revolução Genética: Haplogrupos e Filogeografia">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-6">
            O estudo revolucionário de <strong>Jansen et al. (2002)</strong> sequenciou o ADN
            mitocondrial de 652 cavalos de 37 raças. Os resultados foram inequívocos:
          </p>

          <section
            className="bg-[var(--background-secondary)] p-10 rounded-sm border border-[var(--border)] my-12"
            aria-labelledby="haplogrupos"
          >
            <h4
              id="haplogrupos"
              className="text-[var(--foreground)] text-xl font-bold mb-6 flex items-center gap-3"
            >
              <Dna className="text-[var(--gold)]" size={24} />
              Distribuição de Haplogrupos por Região Geográfica
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ArticleStatCard
                title="HAPLOGRUPO D1"
                value="72.3%"
                subtitle="Península Ibérica"
                highlight
                description={
                  <>
                    Presente em Lusitanos, PRE, Alter Real.{" "}
                    <strong>Ausente em todas as raças do norte europeu</strong>.
                  </>
                }
              />
              <ArticleStatCard
                title="HAPLOGRUPO A"
                value="68.1%"
                subtitle="Europa Central/Norte"
                description="Dominante em Warmbloods, Hannoverianos."
              />
              <ArticleStatCard
                title="HAPLOGRUPO B"
                value="51.7%"
                subtitle="Ásia Central"
                description="Presente em Árabes, Turcomanos, Akhal-Teke."
              />
            </div>
          </section>
        </ArticleSection>

        <ArticleSection title="II. A Escola de Gineta vs. A Brida">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            A morfologia do Lusitano foi esculpida por uma necessidade militar específica: o{" "}
            <strong>combate de guerrilha em terreno acidentado</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
            <article className="bg-[var(--background-secondary)] p-10 rounded-sm border-l-4 border-[var(--border)]">
              <h4 className="text-[var(--foreground)] text-2xl font-serif mb-6 flex items-center gap-3">
                <Shield size={24} className="text-[var(--foreground-muted)]" />A Brida (Norte da
                Europa)
              </h4>
              <div className="space-y-4 mb-6">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">Morfologia:</strong> Cavalos pesados
                  (600-700kg)
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">Tática:</strong> Choque frontal em
                  formação cerrada
                </p>
              </div>
            </article>

            <article className="bg-[var(--background-secondary)] p-10 rounded-sm border-l-4 border-[var(--gold)] shadow-xl">
              <h4 className="text-[var(--gold)] text-2xl font-serif mb-6 flex items-center gap-3">
                <Swords size={24} />A Gineta (Ibéria)
              </h4>
              <div className="space-y-4 mb-6">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">Morfologia:</strong> Cavalos médios
                  (450-550kg)
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">Tática:</strong> Hit-and-run, falsas
                  retiradas
                </p>
              </div>
            </article>
          </div>
        </ArticleSection>

        <ArticleSection title="III. O Saque Napoleónico (1807)">
          <ArticleWarningBox title="A Perda Irreparável" icon={Flame}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6 text-lg">
              Durante as Invasões Francesas (1807-1814), o General Junot ordenou o roubo sistemático
              dos melhores garanhões da Coudelaria de Alter Real.
            </p>
            <ul className="space-y-3 text-[var(--foreground-secondary)]">
              <li>
                <strong className="text-[var(--foreground)]">317 garanhões</strong> registados em
                Alter (1807) → <strong className="text-red-400">41 sobreviventes</strong> (1814)
              </li>
              <li>
                <strong className="text-[var(--foreground)]">89%</strong> das éguas reprodutoras
                foram abatidas
              </li>
            </ul>
          </ArticleWarningBox>
        </ArticleSection>
      </>
    ),
  },

  "2": {
    title: "Biomecânica Avançada: A Física da Reunião",
    subtitle: "Análise vetorial do movimento: Do ângulo lombo-sacral à elasticidade tendinosa.",
    description:
      "A Reunião no hipismo: definição biomecânica, geometria do jarrete e bioquímica das fibras musculares no Cavalo Lusitano.",
    keywords: ["biomecânica equina", "Reunião", "jarrete", "fibras musculares", "Lusitano"],
    date: "18 JAN 2026",
    readTime: "110 min",
    category: "Zootecnia & Física",
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>N</span>o hipismo de alta competição, a{" "}
          <strong>&quot;Reunião&quot;</strong> é o Santo Graal. Definição científica:{" "}
          <em>
            alteração do equilíbrio estático e dinâmico através do deslocamento caudal do Centro de
            Massa
          </em>
          .
        </p>

        <ArticleInfoBox title="DEFINIÇÃO BIOMECÂNICA FORMAL" icon={Activity}>
          <p className="text-[var(--foreground-secondary)] leading-relaxed text-lg mb-6">
            A <strong>Reunião</strong> (Collection) é o resultado de:
          </p>
          <ol className="space-y-4 text-[var(--foreground-secondary)]">
            <li>
              <strong className="text-[var(--foreground)]">1. Flexão dos Posteriores</strong> -
              Redução dos ângulos articulares
            </li>
            <li>
              <strong className="text-[var(--foreground)]">2. Elevação da Base do Pescoço</strong> -
              Ativação muscular
            </li>
            <li>
              <strong className="text-[var(--foreground)]">3. Engagement dos Abdominais</strong> -
              Rotação pélvica
            </li>
          </ol>
        </ArticleInfoBox>

        <ArticleSection title="I. A Geometria do Jarrete">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            O jarrete do cavalo funciona como um sistema de alavancas classe III. A eficiência
            mecânica é determinada pelo <strong>ângulo de repouso</strong> e pela{" "}
            <strong>capacidade de flexão</strong>.
          </p>

          <div className="bg-[var(--background-secondary)] p-12 rounded-sm border border-[var(--border)] my-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <article className="space-y-6">
                <h4 className="text-[var(--gold)] text-2xl font-serif mb-4 flex items-center gap-3">
                  <CheckCircle2 size={24} />
                  Jarrete Angulado (Lusitano 142-148)
                </h4>
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                  Funciona como uma <strong>mola pré-comprimida</strong>. Permite &quot;fechar&quot;
                  o jarrete com <strong>40% menos esforço muscular</strong>.
                </p>
              </article>

              <article className="space-y-6">
                <h4 className="text-[var(--foreground)] text-2xl font-serif mb-4 flex items-center gap-3">
                  <AlertTriangle size={24} className="text-yellow-500" />
                  Jarrete Reto (Warmblood 152-160)
                </h4>
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                  Maximiza a <strong>propulsão horizontal</strong> mas luta contra a física para
                  reunir.
                </p>
              </article>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="II. Bioquímica Muscular: Fibras Tipo IIb">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <article className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-red-500">
              <h5 className="text-red-400 font-bold mb-4 text-lg">TIPO I (Slow Twitch)</h5>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Metabolismo aeróbio, fadiga lenta
              </p>
            </article>

            <article className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-yellow-500">
              <h5 className="text-yellow-400 font-bold mb-4 text-lg">TIPO IIa (Fast Oxidative)</h5>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Metabolismo misto, fadiga moderada
              </p>
            </article>

            <article className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-[var(--gold)]">
              <h5 className="text-[var(--gold)] font-bold mb-4 text-lg">
                TIPO IIb (Fast Glycolytic)
              </h5>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong>Explosão máxima</strong> - Presente em Lusitanos
              </p>
            </article>
          </div>
        </ArticleSection>
      </>
    ),
  },

  "3": {
    title: "O Standard Oficial (APSL): Manual de Julgamento",
    subtitle: "Dissecção ponto por ponto do padrão racial aprovado pela APSL.",
    description:
      "Standard oficial do Puro-Sangue Lusitano: características da cabeça, defeitos eliminatórios e critérios de julgamento APSL.",
    keywords: ["APSL", "Standard Lusitano", "morfologia", "julgamento", "Puro-Sangue"],
    date: "15 JAN 2026",
    readTime: "30 min",
    category: "Morfologia & Standard",
    image:
      "https://images.unsplash.com/photo-1447993661623-28b9c8a994a5?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>O</span>
          Standard oficial do Puro-Sangue Lusitano, mantido pela <strong>APSL</strong>, é um
          documento técnico que define com precisão as características ideais da raça.
        </p>

        <ArticleSection title="I. A Cabeça: Espelho da Raça">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            A cabeça do Lusitano deve ser{" "}
            <strong>seca, de comprimento médio, e bem proporcionada</strong>. O perfil deve ser{" "}
            <strong>subconvexo</strong>.
          </p>

          <ArticleInfoBox title="CARACTERÍSTICAS DA CABEÇA" icon={Eye}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-2">Olhos</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Grandes, vivos, expressivos e elípticos.
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-2">Orelhas</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Médias, finas, bem inseridas e paralelas.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-2">Chanfro</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Perfil subconvexo característico.
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-2">Narinas</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">Amplas e flexíveis.</p>
                </div>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleSection title="II. Defeitos Eliminatórios">
          <ArticleWarningBox title="DEFEITOS QUE IMPEDEM REGISTO" icon={AlertTriangle}>
            <ul className="space-y-3 text-[var(--foreground-secondary)]">
              <li>• Prognatismo ou retrognatismo acentuado</li>
              <li>• Criptorquidismo (machos)</li>
              <li>• Pelagens não reconhecidas pela APSL</li>
              <li>• Altura inferior a 1,50m (machos) aos 6 anos</li>
            </ul>
          </ArticleWarningBox>
        </ArticleSection>
      </>
    ),
  },

  "4": {
    title: "A Ciencia das Cores: Genetica de Pelagens no PSL",
    subtitle: "Locus Extension, Agouti e o gene da Diluicao Creme.",
    date: "12 JAN 2026",
    readTime: "25 min",
    category: "Genetica & Pelagens",
    image:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2">
            A
          </span>
          genetica das pelagens equinas e fascinante e complexa. No Cavalo Lusitano, encontramos uma
          grande variedade de cores, todas determinadas pela interacao de multiplos genes.
        </p>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          I. Os Genes Fundamentais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-black">
            <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Locus Extension (E)</h4>
            <p className="text-[var(--foreground-secondary)] text-sm mb-4">
              Controla a producao de pigmento negro.
            </p>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>E/E ou E/e:</strong> Permite pigmento negro
            </p>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>e/e:</strong> Castanho (sem negro)
            </p>
          </div>

          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-amber-700">
            <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Locus Agouti (A)</h4>
            <p className="text-[var(--foreground-secondary)] text-sm mb-4">
              Distribui o pigmento negro pelo corpo.
            </p>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>A/A ou A/a:</strong> Negro restrito a pontos
            </p>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>a/a:</strong> Negro uniforme
            </p>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          II. Pelagens Base do Lusitano
        </h3>

        <div className="bg-[var(--background-card)] border-l-4 border-[var(--gold)] p-10 my-12 rounded-sm">
          <h4 className="text-[var(--gold)] font-bold text-2xl mb-6">
            Pelagens Reconhecidas pela APSL
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--background)]/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-[var(--background-card)] border border-[var(--border)] mb-4"></div>
              <h5 className="text-[var(--foreground)] font-bold mb-2">Preto</h5>
              <p className="text-sm text-[var(--foreground-secondary)]">Pelagem negra uniforme.</p>
            </div>
            <div className="bg-[var(--background)]/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-amber-800 border border-amber-700 mb-4"></div>
              <h5 className="text-[var(--foreground)] font-bold mb-2">Castanho</h5>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Corpo castanho com pontos negros.
              </p>
            </div>
            <div className="bg-[var(--background)]/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-zinc-400 border border-zinc-300 mb-4"></div>
              <h5 className="text-[var(--foreground)] font-bold mb-2">Ruco</h5>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Progressivo branqueamento.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },

  "5": {
    title: "Toricidade: A Seleção pelo Combate",
    subtitle: "Como a Tauromaquia moldou a psique do Lusitano.",
    description:
      "Toricidade: bravura, inteligência tática, explosão controlada e vontade de agradar no Cavalo Lusitano.",
    keywords: ["Toricidade", "tauromaquia", "temperamento Lusitano", "bravura equina"],
    date: "08 JAN 2026",
    readTime: "28 min",
    category: "Funcionalidade & Temperamento",
    image:
      "https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>A</span>
          <strong>&quot;Toricidade&quot;</strong> é o conjunto de características psicológicas e
          físicas que permitem a um cavalo trabalhar frente a um touro bravo.
        </p>

        <ArticleSection title="I. Os Pilares da Toricidade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticlePillarCard icon={Flame} title="Bravura">
              A capacidade de enfrentar o perigo sem hesitação. Uma{" "}
              <strong>coragem controlada</strong>.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Brain} title="Inteligência Tática">
              O cavalo deve <strong>antecipar</strong> os movimentos do touro.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Zap} title="Explosão Controlada">
              Arranques instantâneos de 0 a 35 km/h.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Award} title="Vontade de Agradar">
              Mantém a <strong>ligação com o cavaleiro</strong> mesmo sob stress extremo.
            </ArticlePillarCard>
          </div>
        </ArticleSection>
      </>
    ),
  },

  "6": {
    title: "De Novilheiro a Rubi: A Revolução Olímpica",
    subtitle: "A ascensão do Lusitano no ranking da FEI.",
    description:
      "Novilheiro e Rubi AR: a revolução do Cavalo Lusitano no Dressage internacional e nos Jogos Olímpicos.",
    keywords: ["Novilheiro", "Rubi AR", "Dressage", "FEI", "Jogos Olímpicos", "Lusitano"],
    date: "02 JAN 2026",
    readTime: "32 min",
    category: "Desporto & Competição",
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>D</span>
          urante décadas, o Cavalo Lusitano foi considerado &quot;inadequado&quot; para o Dressage
          de alta competição. Tudo mudou com <strong>Novilheiro</strong>.
        </p>

        <ArticleSection title="I. O Pioneiro: Novilheiro">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            <strong>Novilheiro</strong> (1966-1993) foi o primeiro Lusitano a competir com sucesso
            ao mais alto nível internacional.
          </p>

          <ArticleInfoBox title="PALMARÉS DE NOVILHEIRO" icon={Trophy}>
            <ul className="space-y-3 text-[var(--foreground-secondary)]">
              <li>• Jogos Olímpicos Los Angeles 1984 - 4.º lugar individual</li>
              <li>• Campeonato da Europa 1983 - Medalha de Bronze</li>
              <li>• Primeiro Lusitano a pontuar acima de 70% em Grand Prix</li>
            </ul>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleSection title="II. A Era Moderna: Rubi AR">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            <strong>Rubi AR</strong>, montado por João Victor Oliva, levou Portugal aos Jogos
            Olímpicos de Tóquio 2020.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <article className="bg-[var(--background-secondary)] p-6 rounded-sm text-center">
              <div className="text-4xl font-bold text-[var(--gold)] mb-2">73.4%</div>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Melhor pontuação GP Special
              </p>
            </article>
            <article className="bg-[var(--background-secondary)] p-6 rounded-sm text-center">
              <div className="text-4xl font-bold text-[var(--gold)] mb-2">Top 30</div>
              <p className="text-sm text-[var(--foreground-secondary)]">Ranking Mundial FEI</p>
            </article>
            <article className="bg-[var(--background-secondary)] p-6 rounded-sm text-center">
              <div className="text-4xl font-bold text-[var(--gold)] mb-2">2020</div>
              <p className="text-sm text-[var(--foreground-secondary)]">Jogos Olímpicos Tóquio</p>
            </article>
          </div>
        </ArticleSection>
      </>
    ),
  },
};

// ARTIGOS EM INGLES
export const articlesDataEN: Record<string, Article> = {
  "1": {
    title: "Historical Treatise: The Genesis of the Iberian Horse",
    subtitle:
      "5000 years of continuous selection: From the Glacial Refuge to the Gineta Warfare. A thesis on the survival of history's most influential horse.",
    description:
      "Mitochondrial DNA studies identified Haplogroup D1 as an exclusive marker of the Iberian Peninsula. The Glacial Refuge theory and Lusitano horse evolution.",
    keywords: [
      "Lusitano",
      "equine genetics",
      "Haplogroup D1",
      "Iberian Peninsula",
      "horse history",
    ],
    date: "25 JAN 2026",
    readTime: "120 min",
    category: "History & Archaeology",
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2">
            T
          </span>
          he traditional narrative that the horse arrived in the Iberian Peninsula from the East
          (Steppe Theory) has been definitively refuted by modern science. Mitochondrial DNA studies
          (Jansen et al., 2002; CIES, 2010) identified <strong>Haplogroup D1</strong> as an
          exclusive marker of the Iberian Peninsula, present in over 70% of Lusitano horses tested.
        </p>
        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
          This confirms the &quot;Glacial Refuge&quot; theory. During the Last Glacial Maximum
          (about 20,000 years ago), while northern Europe was covered in ice, the Iberian Peninsula
          maintained a temperate microclimate. The <em>Equus ferus ibericus</em> not only survived
          here but was domesticated locally in the Tagus and Sado river basins.
        </p>

        <div className="bg-[var(--background-card)] border-l-4 border-[var(--gold)] p-10 my-16 rounded-sm shadow-2xl">
          <h4 className="text-[var(--gold)] font-bold text-2xl mb-6 flex items-center gap-3">
            <Microscope size={24} /> STRATIFIED ARCHAEOLOGICAL EVIDENCE
          </h4>
          <div className="space-y-6">
            <div className="border-l-2 border-[var(--border)] pl-6">
              <h5 className="text-[var(--foreground)] font-bold mb-2 text-lg">
                Escoural Cave (Montemor-o-Novo)
              </h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                Dating: 20,000-18,000 BP (Before Present)
              </p>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                Cave paintings featuring horses with subconvex profile, arched neck and rounded
                croup. Morphometric analysis reveals 87% correspondence with the modern Lusitano
                morphological pattern.
              </p>
            </div>
            <div className="border-l-2 border-[var(--border)] pl-6">
              <h5 className="text-[var(--foreground)] font-bold mb-2 text-lg">
                Muge Shell Middens (Tagus Valley)
              </h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                Dating: 5,500-3,000 BC | Mesolithic Culture
              </p>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                Osteological evidence of domesticated horses found at Moita do Sebastiao and Cabeco
                da Arruda. Stable isotope analysis revealed controlled feeding patterns.
              </p>
            </div>
          </div>
        </div>

        <ArticleImage
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop"
          alt="Iberian horses"
          caption="Artistic representation of primitive Iberian horses"
        />

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          I. The Genetic Revolution: Haplogroups and Phylogeography
        </h3>

        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-6">
          The revolutionary study by <strong>Jansen et al. (2002)</strong> sequenced the
          mitochondrial DNA of 652 horses from 37 breeds. The results were unequivocal:
        </p>

        <div className="bg-[var(--background-secondary)] p-10 rounded-sm border border-[var(--border)] my-12">
          <h4 className="text-[var(--foreground)] text-xl font-bold mb-6 flex items-center gap-3">
            <Dna className="text-[var(--gold)]" size={24} />
            Haplogroup Distribution by Geographic Region
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-4 border-[var(--gold)]">
              <h5 className="text-[var(--gold)] font-bold mb-2">HAPLOGROUP D1</h5>
              <p className="text-3xl font-bold text-[var(--foreground)] mb-2">72.3%</p>
              <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                Iberian Peninsula
              </p>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Present in Lusitanos, PRE, Alter Real.{" "}
                <strong>Absent in all northern European breeds</strong>.
              </p>
            </div>
            <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-4 border-[var(--border)]">
              <h5 className="text-[var(--foreground)] font-bold mb-2">HAPLOGROUP A</h5>
              <p className="text-3xl font-bold text-[var(--foreground)] mb-2">68.1%</p>
              <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                Central/Northern Europe
              </p>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Dominant in Warmbloods, Hanoverians.
              </p>
            </div>
            <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-4 border-[var(--border)]">
              <h5 className="text-[var(--foreground)] font-bold mb-2">HAPLOGROUP B</h5>
              <p className="text-3xl font-bold text-[var(--foreground)] mb-2">51.7%</p>
              <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                Central Asia
              </p>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Present in Arabs, Turkomans, Akhal-Teke.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          II. The Gineta School vs. The Bridle
        </h3>

        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
          The Lusitano&apos;s morphology was sculpted by a specific military necessity:{" "}
          <strong>guerrilla warfare in rugged terrain</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
          <div className="bg-[var(--background-secondary)] p-10 rounded-sm border-l-4 border-[var(--border)]">
            <h4 className="text-[var(--foreground)] text-2xl font-serif mb-6 flex items-center gap-3">
              <Shield size={24} className="text-[var(--foreground-muted)]" />
              The Bridle (Northern Europe)
            </h4>
            <div className="space-y-4 mb-6">
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong className="text-[var(--foreground)]">Morphology:</strong> Heavy horses
                (600-700kg)
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong className="text-[var(--foreground)]">Tactics:</strong> Frontal shock in
                tight formation
              </p>
            </div>
          </div>

          <div className="bg-[var(--background-secondary)] p-10 rounded-sm border-l-4 border-[var(--gold)] shadow-xl">
            <h4 className="text-[var(--gold)] text-2xl font-serif mb-6 flex items-center gap-3">
              <Swords size={24} />
              The Gineta (Iberia)
            </h4>
            <div className="space-y-4 mb-6">
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong className="text-[var(--foreground)]">Morphology:</strong> Medium horses
                (450-550kg)
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong className="text-[var(--foreground)]">Tactics:</strong> Hit-and-run, feigned
                retreats
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          III. The Napoleonic Plunder (1807)
        </h3>

        <div className="my-12 bg-gradient-to-r from-red-950/30 to-transparent p-12 rounded-sm border-l-4 border-red-800 shadow-2xl">
          <h4 className="text-red-400 text-2xl font-serif mb-6 flex items-center gap-3">
            <Flame size={28} /> The Irreparable Loss
          </h4>
          <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6 text-lg">
            During the French Invasions (1807-1814), General Junot ordered the systematic theft of
            the best stallions from the Alter Real Stud.
          </p>
          <ul className="space-y-3 text-[var(--foreground-secondary)]">
            <li>
              <strong className="text-[var(--foreground)]">317 stallions</strong> registered at
              Alter (1807) → <strong className="text-red-400">41 survivors</strong> (1814)
            </li>
            <li>
              <strong className="text-[var(--foreground)]">89%</strong> of breeding mares were
              slaughtered
            </li>
          </ul>
        </div>
      </>
    ),
  },

  "2": {
    title: "Advanced Biomechanics: The Physics of Collection",
    subtitle: "Vector analysis of movement: From the lumbosacral angle to tendon elasticity.",
    description:
      "Collection in equestrian sport: biomechanical definition, hock geometry and muscle fiber biochemistry in the Lusitano Horse.",
    keywords: ["equine biomechanics", "Collection", "hock", "muscle fibers", "Lusitano"],
    date: "18 JAN 2026",
    readTime: "110 min",
    category: "Zootechnics & Physics",
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2">
            I
          </span>
          n high-level equestrian sport, <strong>&quot;Collection&quot;</strong> is the Holy Grail.
          Scientific definition:{" "}
          <em>
            alteration of static and dynamic balance through caudal displacement of the Center of
            Mass
          </em>
          .
        </p>

        <div className="bg-[var(--background-card)] border-l-4 border-[var(--gold)] p-10 my-12 rounded-sm shadow-2xl">
          <h4 className="text-[var(--gold)] font-bold text-2xl mb-6 flex items-center gap-3">
            <Activity size={24} /> FORMAL BIOMECHANICAL DEFINITION
          </h4>
          <p className="text-[var(--foreground-secondary)] leading-relaxed text-lg mb-6">
            <strong>Collection</strong> is the result of:
          </p>
          <ol className="space-y-4 text-[var(--foreground-secondary)]">
            <li>
              <strong className="text-[var(--foreground)]">1. Hindquarter Flexion</strong> -
              Reduction of joint angles
            </li>
            <li>
              <strong className="text-[var(--foreground)]">2. Neck Base Elevation</strong> - Muscle
              activation
            </li>
            <li>
              <strong className="text-[var(--foreground)]">3. Abdominal Engagement</strong> - Pelvic
              rotation
            </li>
          </ol>
        </div>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          I. The Hock Geometry
        </h3>

        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
          The horse&apos;s hock functions as a class III lever system. Mechanical efficiency is
          determined by the <strong>resting angle</strong> and <strong>flexion capacity</strong>.
        </p>

        <div className="bg-[var(--background-secondary)] p-12 rounded-sm border border-[var(--border)] my-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-[var(--gold)] text-2xl font-serif mb-4 flex items-center gap-3">
                <CheckCircle2 size={24} />
                Angled Hock (Lusitano 142-148)
              </h4>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                Functions like a <strong>pre-compressed spring</strong>. Allows &quot;closing&quot;
                the hock with <strong>40% less muscular effort</strong>.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-[var(--foreground)] text-2xl font-serif mb-4 flex items-center gap-3">
                <AlertTriangle size={24} className="text-yellow-500" />
                Straight Hock (Warmblood 152-160)
              </h4>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                Maximizes <strong>horizontal propulsion</strong> but fights against physics to
                collect.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          II. Muscle Biochemistry: Type IIb Fibers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-red-500">
            <h5 className="text-red-400 font-bold mb-4 text-lg">TYPE I (Slow Twitch)</h5>
            <p className="text-[var(--foreground-secondary)] text-sm">
              Aerobic metabolism, slow fatigue
            </p>
          </div>

          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-yellow-500">
            <h5 className="text-yellow-400 font-bold mb-4 text-lg">TYPE IIa (Fast Oxidative)</h5>
            <p className="text-[var(--foreground-secondary)] text-sm">
              Mixed metabolism, moderate fatigue
            </p>
          </div>

          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-[var(--gold)]">
            <h5 className="text-[var(--gold)] font-bold mb-4 text-lg">
              TYPE IIb (Fast Glycolytic)
            </h5>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>Maximum explosion</strong> - Present in Lusitanos
            </p>
          </div>
        </div>
      </>
    ),
  },

  "3": {
    title: "The Official Standard (APSL): Judging Manual",
    description:
      "Official Lusitano Pure Blood standard: head characteristics, disqualifying defects and APSL judging criteria.",
    keywords: ["APSL", "Lusitano Standard", "morphology", "judging", "Pure Blood"],
    subtitle: "Point by point dissection of the breed standard approved by APSL.",
    date: "15 JAN 2026",
    readTime: "30 min",
    category: "Morphology & Standard",
    image:
      "https://images.unsplash.com/photo-1447993661623-28b9c8a994a5?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2">
            T
          </span>
          he official Lusitano Pure Blood standard, maintained by <strong>APSL</strong>, is a
          technical document that precisely defines the ideal characteristics of the breed.
        </p>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          I. The Head: Mirror of the Breed
        </h3>

        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
          The Lusitano head should be <strong>dry, of medium length, and well proportioned</strong>.
          The profile should be <strong>subconvex</strong>.
        </p>

        <div className="bg-[var(--background-card)] border-l-4 border-[var(--gold)] p-10 my-12 rounded-sm shadow-2xl">
          <h4 className="text-[var(--gold)] font-bold text-2xl mb-6 flex items-center gap-3">
            <Eye size={24} /> HEAD CHARACTERISTICS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-2">Eyes</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Large, lively, expressive and elliptical.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-2">Ears</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Medium, fine, well set and parallel.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-2">Profile</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Characteristic subconvex profile.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-2">Nostrils</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">Wide and flexible.</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          II. Disqualifying Defects
        </h3>

        <div className="bg-gradient-to-r from-red-950/30 to-transparent p-10 rounded-sm border-l-4 border-red-800 my-12">
          <h4 className="text-red-400 font-bold text-xl mb-6 flex items-center gap-3">
            <AlertTriangle size={24} /> DEFECTS THAT PREVENT REGISTRATION
          </h4>
          <ul className="space-y-3 text-[var(--foreground-secondary)]">
            <li>• Severe prognathism or retrognathism</li>
            <li>• Cryptorchidism (males)</li>
            <li>• Coat colors not recognized by APSL</li>
            <li>• Height below 1.50m (males) at 6 years</li>
          </ul>
        </div>
      </>
    ),
  },

  "4": {
    title: "The Science of Colors: Coat Genetics in PSL",
    description:
      "Equine coat genetics: Extension Locus, Agouti and coat colors recognized by APSL in the Lusitano Horse.",
    keywords: ["equine genetics", "coat colors", "Extension Locus", "Agouti", "APSL"],
    subtitle: "Extension Locus, Agouti and the Cream Dilution gene.",
    date: "12 JAN 2026",
    readTime: "25 min",
    category: "Genetics & Coat Colors",
    image:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2">
            E
          </span>
          quine coat genetics is fascinating and complex. In the Lusitano Horse, we find a great
          variety of colors, all determined by the interaction of multiple genes.
        </p>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          I. The Fundamental Genes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-black">
            <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Extension Locus (E)</h4>
            <p className="text-[var(--foreground-secondary)] text-sm mb-4">
              Controls black pigment production.
            </p>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>E/E or E/e:</strong> Allows black pigment
            </p>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>e/e:</strong> Chestnut (no black)
            </p>
          </div>

          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-amber-700">
            <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Agouti Locus (A)</h4>
            <p className="text-[var(--foreground-secondary)] text-sm mb-4">
              Distributes black pigment across the body.
            </p>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>A/A or A/a:</strong> Black restricted to points
            </p>
            <p className="text-[var(--foreground-secondary)] text-sm">
              <strong>a/a:</strong> Uniform black
            </p>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          II. Lusitano Base Coat Colors
        </h3>

        <div className="bg-[var(--background-card)] border-l-4 border-[var(--gold)] p-10 my-12 rounded-sm">
          <h4 className="text-[var(--gold)] font-bold text-2xl mb-6">
            Coat Colors Recognized by APSL
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--background)]/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-[var(--background-card)] border border-[var(--border)] mb-4"></div>
              <h5 className="text-[var(--foreground)] font-bold mb-2">Black</h5>
              <p className="text-sm text-[var(--foreground-secondary)]">Uniform black coat.</p>
            </div>
            <div className="bg-[var(--background)]/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-amber-800 border border-amber-700 mb-4"></div>
              <h5 className="text-[var(--foreground)] font-bold mb-2">Bay</h5>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Bay body with black points.
              </p>
            </div>
            <div className="bg-[var(--background)]/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-zinc-400 border border-zinc-300 mb-4"></div>
              <h5 className="text-[var(--foreground)] font-bold mb-2">Grey</h5>
              <p className="text-sm text-[var(--foreground-secondary)]">Progressive whitening.</p>
            </div>
          </div>
        </div>
      </>
    ),
  },

  "5": {
    title: "Bullfighting Aptitude: Selection Through Combat",
    subtitle: "How Tauromachy shaped the Lusitano's psyche.",
    description:
      "Bullfighting aptitude: bravery, tactical intelligence, controlled explosion and willingness to please in the Lusitano Horse.",
    keywords: ["bullfighting aptitude", "tauromachy", "Lusitano temperament", "equine bravery"],
    date: "08 JAN 2026",
    readTime: "28 min",
    category: "Functionality & Temperament",
    image:
      "https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2">
            B
          </span>
          ullfighting aptitude is the set of psychological and physical characteristics that allow a
          horse to work facing a brave bull.
        </p>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          I. The Pillars of Bullfighting Aptitude
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
            <Flame className="text-[var(--gold)] mb-4" size={32} />
            <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Bravery</h4>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
              The ability to face danger without hesitation. A <strong>controlled courage</strong>.
            </p>
          </div>

          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
            <Brain className="text-[var(--gold)] mb-4" size={32} />
            <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">
              Tactical Intelligence
            </h4>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
              The horse must <strong>anticipate</strong> the bull&apos;s movements.
            </p>
          </div>

          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
            <Zap className="text-[var(--gold)] mb-4" size={32} />
            <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">
              Controlled Explosion
            </h4>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
              Instant acceleration from 0 to 35 km/h.
            </p>
          </div>

          <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
            <Award className="text-[var(--gold)] mb-4" size={32} />
            <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">
              Willingness to Please
            </h4>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
              Maintains the <strong>connection with the rider</strong> even under extreme stress.
            </p>
          </div>
        </div>
      </>
    ),
  },

  "6": {
    title: "From Novilheiro to Rubi: The Olympic Revolution",
    description:
      "Novilheiro and Rubi AR: the Lusitano Horse revolution in international Dressage and the Olympics.",
    keywords: ["Novilheiro", "Rubi AR", "Dressage", "FEI", "Olympics", "Lusitano"],
    subtitle: "The rise of the Lusitano in the FEI ranking.",
    date: "02 JAN 2026",
    readTime: "32 min",
    category: "Sport & Competition",
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2">
            F
          </span>
          or decades, the Lusitano Horse was considered &quot;unsuitable&quot; for high-level
          Dressage competition. Everything changed with <strong>Novilheiro</strong>.
        </p>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          I. The Pioneer: Novilheiro
        </h3>

        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <strong>Novilheiro</strong> (1966-1993) was the first Lusitano to compete successfully at
          the highest international level.
        </p>

        <div className="bg-[var(--background-card)] border-l-4 border-[var(--gold)] p-10 my-12 rounded-sm">
          <h4 className="text-[var(--gold)] font-bold text-xl mb-6 flex items-center gap-3">
            <Trophy size={24} /> NOVILHEIRO&apos;S ACHIEVEMENTS
          </h4>
          <ul className="space-y-3 text-[var(--foreground-secondary)]">
            <li>• Los Angeles 1984 Olympics - 4th place individual</li>
            <li>• European Championship 1983 - Bronze Medal</li>
            <li>• First Lusitano to score above 70% in Grand Prix</li>
          </ul>
        </div>

        <h3 className="text-4xl font-serif text-[var(--gold)] mb-8 mt-20 border-b border-[var(--border)] pb-4">
          II. The Modern Era: Rubi AR
        </h3>

        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
          <strong>Rubi AR</strong>, ridden by Joao Victor Oliva, took Portugal to the Tokyo 2020
          Olympics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-[var(--background-secondary)] p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[var(--gold)] mb-2">73.4%</div>
            <p className="text-sm text-[var(--foreground-secondary)]">Best GP Special score</p>
          </div>
          <div className="bg-[var(--background-secondary)] p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[var(--gold)] mb-2">Top 30</div>
            <p className="text-sm text-[var(--foreground-secondary)]">FEI World Ranking</p>
          </div>
          <div className="bg-[var(--background-secondary)] p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[var(--gold)] mb-2">2020</div>
            <p className="text-sm text-[var(--foreground-secondary)]">Tokyo Olympics</p>
          </div>
        </div>
      </>
    ),
  },
};
