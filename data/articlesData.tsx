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
  Globe,
  Crown,
  Target,
  Heart,
  Star,
  TrendingUp,
  Feather,
  BookOpen,
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
  sources?: Array<{ label: string; url: string }>;
  relatedSlugs?: string[];
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
    readTime: "25 min",
    category: "História & Arqueologia",
    relatedSlugs: ["standard-apsl", "genetica-pelagens", "toricidade-selecao-combate"],
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>A</span>
          narrativa tradicional de que o cavalo chegou à Península Ibérica vindo do Oriente (Teoria
          das Estepes) foi definitivamente refutada pela ciência moderna. Estudos de ADN
          mitocondrial (Jansen et al., 2002) identificaram o <strong>Haplogrupo D1</strong> como um
          marcador exclusivo da Península Ibérica, presente em mais de 70% dos cavalos Lusitanos
          testados.
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
                arredondada — características morfológicas que recordam o Lusitano moderno.
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
                Restos osteológicos de equídeos encontrados em Moita do Sebastião e Cabeço da
                Arruda, evidenciando a presença ancestral do cavalo na região.
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
                value="Dominante"
                subtitle="Península Ibérica"
                highlight
                description={
                  <>
                    Mais frequente em Lusitanos, PRE e Alter Real.{" "}
                    <strong>Raro ou ausente nas raças do norte europeu</strong>.
                  </>
                }
              />
              <ArticleStatCard
                title="HAPLOGRUPO A"
                value="Dominante"
                subtitle="Europa Central/Norte"
                description="Mais frequente em Warmbloods e Hannoverianos."
              />
              <ArticleStatCard
                title="HAPLOGRUPO B"
                value="Frequente"
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

        {/* ============================================================
            SECÇÃO III — ROMA E OS MOUROS
            FONTE: Wikipedia Lusitano https://en.wikipedia.org/wiki/Lusitano
            FONTE: Lusitano Horse Finder https://lusitanohorsefinder.com/the-history-of-the-lusitano/
            ============================================================ */}
        <ArticleSection title="III. Roma, os Mouros e a Formação da Raça">
          <p className={articleTextClasses.body}>
            Os cavalos ibéricos eram já famosos na Antiguidade. Os Romanos, ao conquistarem a
            Península, adoptaram os cavalos locais e as suas técnicas de equitação — arranques
            rápidos, paragens súbitas e falsas retiradas — estabelecendo coudelarias militares na
            região.
          </p>

          <p className={articleTextClasses.body}>
            Em <strong>711 d.C.</strong>, a invasão muçulmana trouxe cavalos <strong>Barbe</strong>{" "}
            do Norte de África para a Península Ibérica. O cruzamento entre o cavalo Barbe e o
            ibérico nativo produziu um tipo de cavalo de guerra considerado superior ao original —
            combinando a resistência e agilidade do ibérico com a velocidade e refinamento do Barbe.
            Este cruzamento é descrito como a base do tipo que os Conquistadores mais tarde levaram
            para as Américas.
          </p>

          <ArticleInfoBox title="O DUQUE DE NEWCASTLE (1667)" icon={BookOpen}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed text-lg italic">
              &quot;O cavalo ibérico possui o trote mais orgulhoso e a melhor acção.&quot;
            </p>
            <p className="text-[var(--foreground-muted)] text-sm mt-3">
              — William Cavendish, Duque de Newcastle, tratadista de equitação
            </p>
          </ArticleInfoBox>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO IV — DESCOBRIMENTOS
            FONTE: Wikipedia Mangalarga Marchador https://en.wikipedia.org/wiki/Mangalarga_Marchador
            FONTE: Lusitano Horse Finder https://lusitanohorsefinder.com/the-history-of-the-lusitano/
            ============================================================ */}
        <ArticleSection title="IV. A Era dos Descobrimentos">
          <p className={articleTextClasses.body}>
            Os cavalos portugueses acompanharam os colonizadores para a América do Sul, tornando-se
            a base genética de diversas raças do Novo Mundo. Um exemplo notável: o garanhão Alter
            Real <strong>Sublime</strong>, oferecido por D. Pedro I (futuro Imperador do Brasil) ao
            Barão de Alfenas, tornou-se o fundador da raça <strong>Mangalarga Marchador</strong> —
            hoje a raça equina mais numerosa do Brasil. Os seus descendentes, conhecidos como
            &quot;Sublimes&quot;, destacavam-se pelas andaduras suaves, incluindo a marcha.
          </p>

          <p className={articleTextClasses.body}>
            A influência ibérica estende-se também ao <strong>Mustang</strong> norte-americano, ao{" "}
            <strong>Crioulo</strong> argentino e ao <strong>Paso Fino</strong> colombiano — todas
            raças que descendem dos cavalos trazidos pelos colonizadores ibéricos.
          </p>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO V — ALTER REAL
            FONTE: Lusitano Stud https://www.lusitanostud.com/blog/2019/8/20/the-kings-stud-alter-real
            FONTE: Parques de Sintra https://www.parquesdesintra.pt/en/parks-monuments/portuguese-school-of-equestrian-art/alter-stud-farm/
            ============================================================ */}
        <ArticleSection title="V. A Coudelaria de Alter Real (1748)">
          <p className={articleTextClasses.body}>
            Em 1748, <strong>D. João V</strong> fundou a Coudelaria de Alter Real como parte de uma
            política coudelícia iniciada em 1708. O objectivo era ambicioso: criar cavalos para a
            prática da <strong>Alta Escola</strong> (<em>haute école</em>), à altura da grandeza da
            corte portuguesa.
          </p>

          <ArticleInfoBox title="DADOS DA FUNDAÇÃO" icon={Crown}>
            <div className="space-y-3">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Localização</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Coutada do Arneiro, ~800 hectares, Alter do Chão, Alentejo
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Stock Fundador</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  ~300 éguas ibéricas importadas de Espanha em 1747, maioritariamente castanhas
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Formação da Manada</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Entre 1749 e 1770, consolidou-se o núcleo reprodutor de origem andaluza
                </p>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO VI — SAQUE NAPOLEÓNICO (EXPANDIDO)
            FONTE: Lusitano Stud https://www.lusitanostud.com/blog/2019/8/20/the-kings-stud-alter-real
            ============================================================ */}
        <ArticleSection title="VI. O Saque Napoleónico e a Recuperação">
          <ArticleWarningBox title="A Perda Irreparável (1807-1814)" icon={Flame}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6 text-lg">
              Durante as Invasões Francesas, o General Junot ordenou o roubo sistemático dos
              melhores garanhões da Coudelaria de Alter Real. A grande maioria foi levada pelas
              tropas francesas, ameaçando a sobrevivência da raça.
            </p>
          </ArticleWarningBox>

          <p className={articleTextClasses.body}>
            Após as invasões, foram introduzidas outras raças para reconstruir os efectivos,
            causando um declínio na qualidade. Em <strong>1910</strong>, na sequência do assassinato
            de D. Carlos I e da implantação da República, a coudelaria foi encerrada. O futuro da
            raça parecia sombrio.
          </p>

          <ArticleInfoBox title="A SALVAÇÃO: DR. RUY D'ANDRADE" icon={Heart}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              Em <strong>1938</strong>, o veterinário e hipólogo{" "}
              <strong>Dr. Ruy d&apos;Andrade</strong> (1880-1967) adquiriu três garanhões Alter
              Real: <strong>Vigilante</strong>, <strong>Regedor</strong> e{" "}
              <strong>Marialva II</strong>.
            </p>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              Em <strong>1942</strong>, transferiu a sua manada fundadora para o Ministério da
              Agricultura, permitindo a reabertura da coudelaria. Através de seleção cuidadosa, a
              qualidade foi gradualmente restaurada.
            </p>
            <p className="text-[var(--foreground-secondary)] leading-relaxed">
              Hoje, a Coudelaria de Alter Real mantém ~300 Lusitanos, com ~40 ao serviço da{" "}
              <strong>Escola Portuguesa de Arte Equestre</strong>. A propriedade inclui um
              laboratório de genética, escola de gestão equina e museu.
            </p>
          </ArticleInfoBox>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO VII — SEPARAÇÃO E REGISTO MODERNO
            FONTE: Etalon DX https://etalondx.com/news-media/breeds-of-the-iberian-peninsula-differentiating-between-pr-es-andalusians-and-lusitanos/
            FONTE: IALHA https://ialha.org/what-the-ialha-registry-is/
            FONTE: APSL https://www.cavalo-lusitano.com/en/apsl
            FONTE: Wikipedia Lusitano https://en.wikipedia.org/wiki/Lusitano
            ============================================================ */}
        <ArticleSection title="VII. A Separação e o Registo Moderno">
          <p className={articleTextClasses.body}>
            Até aos anos 1960, o cavalo ibérico era chamado &quot;Andaluz&quot; em ambos os países e
            partilhava um livro genealógico comum. Em <strong>1966-1967</strong>, os studbooks foram
            formalmente separados: cavalos nascidos em Portugal passaram a chamar-se{" "}
            <strong>Lusitano</strong> (de Lusitânia, nome romano de Portugal) e os nascidos em
            Espanha <strong>PRE</strong> (Pura Raza Española).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticleStatCard
              title="FUNDAÇÃO APSL"
              value="1967"
              subtitle="267 garanhões + 529 éguas fundadoras"
              highlight
            />
            <ArticleStatCard title="PAÍSES" value="~25" subtitle="Com Lusitanos registados" />
            <ArticleStatCard
              title="EM PORTUGAL"
              value="~6.000"
              subtitle="Éguas e garanhões registados"
              highlight
            />
          </div>

          <p className={articleTextClasses.body}>
            A APSL foi oficialmente constituída em <strong>1989</strong> e obteve o estatuto de
            &quot;Utilidade Pública&quot; em 1995. Conta com ~400 membros efectivos. Hoje, cerca de{" "}
            <strong>50% do stock reprodutor Lusitano está fora de Portugal</strong>, com presença
            significativa no Brasil, Estados Unidos, Austrália, França, Alemanha e Reino Unido.
          </p>

          <p className={articleTextClasses.body}>
            Estudos genéticos modernos revelaram que o Lusitano possui{" "}
            <strong>9 haplótipos únicos</strong> — metade dos haplótipos da raça são variantes
            raras. O grupo &quot;Lusitano C&quot; contém linhagens maternas presentes em cavalos
            selvagens ibéricos desde o Neolítico Inicial, confirmando a extraordinária continuidade
            genética desta raça milenar.
          </p>
        </ArticleSection>
      </>
    ),
    // FONTES ARTIGO 1
    sources: [
      {
        label:
          "Jansen et al. (2002) — Mitochondrial DNA and the origins of the domestic horse, PNAS",
        url: "https://www.pnas.org/doi/10.1073/pnas.152330099",
      },
      {
        label: "Gruta do Escoural — Sítio arqueológico, Montemor-o-Novo",
        url: "https://en.wikipedia.org/wiki/Escoural_Cave",
      },
      {
        label: "Lusitano — História da raça (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Lusitano",
      },
      {
        label: "Lusitano Horse Finder — History of the Lusitano",
        url: "https://lusitanohorsefinder.com/the-history-of-the-lusitano/",
      },
      {
        label: "The King's Stud: Alter Real",
        url: "https://www.lusitanostud.com/blog/2019/8/20/the-kings-stud-alter-real",
      },
      {
        label: "Parques de Sintra — Alter Stud Farm",
        url: "https://www.parquesdesintra.pt/en/parks-monuments/portuguese-school-of-equestrian-art/alter-stud-farm/",
      },
      {
        label: "Etalon DX — Breeds of the Iberian Peninsula",
        url: "https://etalondx.com/news-media/breeds-of-the-iberian-peninsula-differentiating-between-pr-es-andalusians-and-lusitanos/",
      },
      {
        label: "Wikipedia — Mangalarga Marchador",
        url: "https://en.wikipedia.org/wiki/Mangalarga_Marchador",
      },
      { label: "APSL — Sobre a Associação", url: "https://www.cavalo-lusitano.com/en/apsl" },
    ],
  },

  "2": {
    title: "Biomecânica Avançada: A Física da Reunião",
    subtitle: "Análise vetorial do movimento: Do ângulo lombo-sacral à elasticidade tendinosa.",
    description:
      "A Reunião no hipismo: definição biomecânica, geometria do jarrete e bioquímica das fibras musculares no Cavalo Lusitano.",
    keywords: ["biomecânica equina", "Reunião", "jarrete", "fibras musculares", "Lusitano"],
    date: "18 JAN 2026",
    readTime: "20 min",
    category: "Zootecnia & Física",
    relatedSlugs: [
      "standard-apsl",
      "toricidade-selecao-combate",
      "novilheiro-rubi-revolucao-olimpica",
    ],
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
                  Jarrete Angulado (Lusitano)
                </h4>
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                  Funciona como uma <strong>mola pré-comprimida</strong>. A angulação natural
                  facilita a flexão, exigindo <strong>menos esforço muscular</strong> para reunir.
                </p>
              </article>

              <article className="space-y-6">
                <h4 className="text-[var(--foreground)] text-2xl font-serif mb-4 flex items-center gap-3">
                  <AlertTriangle size={24} className="text-yellow-500" />
                  Jarrete Reto (Warmblood)
                </h4>
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                  Maximiza a <strong>propulsão horizontal</strong> mas luta contra a física para
                  reunir.
                </p>
              </article>
            </div>
          </div>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1598974357801-399b2e689e95?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalo em trabalho de reunião demonstrando flexão do jarrete"
          caption="A angulação natural do jarrete do Lusitano facilita a reunião com menor esforço muscular."
        />

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
                <strong>Explosão máxima</strong> - Presente em todas as raças, com proporções
                variáveis
              </p>
            </article>
          </div>
        </ArticleSection>

        {/* FONTE: APSL — conformação garupa e posteriores */}
        <ArticleSection title="III. O Ângulo Lombo-Sacral: O Motor da Reunião">
          <p className={articleTextClasses.body}>
            A junção lombo-sacral — a articulação entre a última vértebra lombar e o sacro — é
            frequentemente chamada o <strong>&quot;motor&quot; da reunião</strong>. É neste ponto
            que a energia gerada pelos posteriores é transmitida ao dorso e, consequentemente, a
            todo o corpo do cavalo.
          </p>

          <ArticleInfoBox title="FLEXÃO PÉLVICA E REUNIÃO" icon={Activity}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              A <strong>flexão pélvica</strong> (basculação da pélvis) é o mecanismo fundamental:
              quando os posteriores avançam sob o centro de massa, a pélvis roda sobre a articulação
              lombo-sacral, permitindo que o cavalo &quot;se sente&quot; sobre os posteriores.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-2 border-[var(--gold)]">
                <h5 className="text-[var(--gold)] font-bold mb-2">Lusitano</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Garupa <strong>arredondada e ligeiramente oblíqua</strong> (standard APSL). Esta
                  conformação facilita a flexão pélvica, permitindo maior engagement natural dos
                  posteriores. A inclinação da garupa funciona como uma &quot;rampa&quot;
                  biomecânica.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-2 border-[var(--border)]">
                <h5 className="text-[var(--foreground)] font-bold mb-2">Warmblood Típico</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Garupa tendencialmente mais horizontal, optimizada para a propulsão em extensão.
                  Eficaz em movimentos amplos de trote e galope, mas exige mais treino para alcançar
                  reunião profunda.
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            O <strong>lombo curto e largo</strong> do Lusitano (standard APSL) é outra vantagem
            biomecânica: um lombo curto transmite a força dos posteriores com menos perda de
            energia, enquanto a largura fornece base para a musculatura de suporte.
          </p>
        </ArticleSection>

        {/* FONTE: APSL — standard pescoço */}
        <ArticleSection title="IV. O Pescoço e o Ligamento Nucal">
          <p className={articleTextClasses.body}>
            O pescoço não é apenas uma peça estética — é um <strong>balanceiro mecânico</strong> que
            controla o equilíbrio de todo o cavalo. A posição e forma do pescoço determinam
            directamente a distribuição de peso entre anteriores e posteriores.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="LIGAMENTO NUCAL" icon={Zap}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                O <strong>ligamento nucal</strong> é uma estrutura passiva (não muscular) que se
                estende da protuberância occipital até à cernelha e, através do ligamento
                supraespinhoso, ao longo das vértebras torácicas e lombares.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                A sua função é <strong>suportar o peso da cabeça e pescoço</strong> sem esforço
                muscular constante. Quando o cavalo eleva a base do pescoço e flecte a nuca, o
                ligamento nucal entra em tensão, &quot;levantando&quot; o dorso — mecanismo
                essencial para a reunião.
              </p>
            </ArticleInfoBox>

            <ArticleInfoBox title="O PESCOÇO DO LUSITANO" icon={Eye}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                O standard APSL descreve o pescoço como de{" "}
                <strong>comprimento médio, arqueado, de inserção alta</strong> e crineira abundante.
                Esta conformação confere vantagens biomecânicas:
              </p>
              <div className="space-y-2 mt-4">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Arco natural:</strong> Permite auto-transporte com menor esforço
                    muscular
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Inserção alta:</strong> Facilita a elevação da base sem
                    &quot;quebrar&quot; na 3.ª vértebra cervical
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Comprimento médio:</strong> Equilíbrio entre alavanca e controlo
                  </p>
                </div>
              </div>
            </ArticleInfoBox>
          </div>

          <ArticleWarningBox title="A «Quebra» Falsa" icon={AlertTriangle}>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
              Um pescoço que &quot;quebra&quot; na 3.ª vértebra cervical (em vez de flectir na nuca)
              é um defeito funcional grave. O cavalo aparenta estar reunido, mas na realidade a base
              do pescoço está baixa e o dorso afundado. O Lusitano, com o seu pescoço naturalmente
              arqueado e de inserção alta, é menos propenso a este defeito do que raças de pescoço
              mais horizontal.
            </p>
          </ArticleWarningBox>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1508669232496-137b159c1cdb?q=80&w=1200&auto=format&fit=crop"
          alt="Pescoço arqueado de cavalo em trabalho clássico"
          caption="O pescoço arqueado e de inserção alta é uma das vantagens biomecânicas mais distintivas do Lusitano."
        />

        {/* FONTE: APSL — andamentos no standard */}
        <ArticleSection title="V. As Três Andaduras Naturais">
          <p className={articleTextClasses.body}>
            O standard APSL define três andaduras (passo, trote e galope), todas com características
            específicas que reflectem a biomecânica do Lusitano. A qualidade das andaduras é um
            critério fundamental de avaliação.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-[var(--gold)]">
              <h5 className="text-[var(--gold)] font-bold mb-4 text-lg">PASSO</h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                <strong>4 tempos</strong> — sequência: posterior esquerdo → anterior esquerdo →
                posterior direito → anterior direito. Sem fase de suspensão.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                No Lusitano: <strong>ágil, elevado, amplo</strong>. Deve cobrir terreno com
                regularidade e cadência.
              </p>
            </div>

            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-[var(--gold)]">
              <h5 className="text-[var(--gold)] font-bold mb-4 text-lg">TROTE</h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                <strong>2 tempos diagonais</strong> — bípedes diagonais movem-se em simultâneo, com
                fase de suspensão entre cada batida.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                No Lusitano: <strong>elástico, amplo, com boa suspensão</strong>. A tendência
                natural para a elevação distingue-o do trote extenso dos Warmbloods.
              </p>
            </div>

            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-[var(--gold)]">
              <h5 className="text-[var(--gold)] font-bold mb-4 text-lg">GALOPE</h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                <strong>3 tempos + suspensão</strong> — posterior exterior → diagonal → anterior
                interior → suspensão.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                No Lusitano: <strong>macio, elevado, bem equilibrado</strong>. A facilidade natural
                para as transições e as piruetas no galope é uma marca da raça.
              </p>
            </div>
          </div>

          <ArticleInfoBox title="ARES ACIMA DO SOLO" icon={Crown}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              Para além das três andaduras básicas, o Lusitano é uma das poucas raças capazes de
              executar <strong>ares acima do solo</strong> — movimentos de Alta Escola que exigem
              força, equilíbrio e coragem extraordinários:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Levade</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Posteriores flectidos a ~35°, anteriores elevados. Equilíbrio sustentado.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Courbette</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  A partir da levade, saltos sobre os posteriores com os anteriores recolhidos.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Capriole</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Salto com extensão total dos posteriores no ar. O movimento mais difícil da Alta
                  Escola.
                </p>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        {/* FONTE: APSL — aptidão da raça */}
        <ArticleSection title="VI. Implicações para o Treino">
          <p className={articleTextClasses.body}>
            A conformação do Lusitano tem implicações directas para a forma como deve ser treinado.
            As suas vantagens biomecânicas — jarrete angulado, garupa oblíqua, pescoço arqueado,
            lombo curto — são recursos naturais que o treino clássico procura desenvolver, não
            criar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="A ESCALA DE TREINO" icon={TrendingUp}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-4">
                A escala de treino clássica aplica-se ao Lusitano, mas com uma particularidade: a
                reunião aparece mais cedo na progressão graças à predisposição natural.
              </p>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  1. <strong>Ritmo</strong> — regularidade das andaduras
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  2. <strong>Descontracção</strong> — ausência de tensão
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  3. <strong>Contacto</strong> — ligação elástica com a mão
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  4. <strong>Impulsão</strong> — energia dos posteriores
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  5. <strong>Rectidão</strong> — alinhamento longitudinal
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  6. <strong>Reunião</strong> — engagement e auto-transporte
                </p>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="VANTAGENS NATURAIS DO PSL" icon={CheckCircle2}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-4">
                O Lusitano traz vantagens inatas que o treino clássico potencia:
              </p>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Reunião precoce:</strong> A conformação facilita o engagement dos
                    posteriores antes de muitas outras raças
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Temperamento cooperativo:</strong> O temperamento &quot;ardente mas
                    dócil&quot; (APSL) permite trabalho intenso com boa atitude
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Lateralidade:</strong> Agilidade natural para movimentos laterais
                    (espádua adentro, travers, renvers, appuyer)
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Piruetas:</strong> A garupa oblíqua e o jarrete angulado facilitam
                    piruetas no galope com menor esforço
                  </p>
                </div>
              </div>
            </ArticleInfoBox>
          </div>
        </ArticleSection>
      </>
    ),
    // FONTES ARTIGO 2
    sources: [
      {
        label: "APSL — Standard da Raça Lusitana",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed",
      },
      // FONTE: APSL — Características do Lusitano
      {
        label: "APSL — Características e Aptidão do Lusitano",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/aptitude",
      },
    ],
  },

  "3": {
    title: "O Standard Oficial (APSL): Manual de Julgamento",
    subtitle: "Dissecção ponto por ponto do padrão racial aprovado pela APSL.",
    description:
      "Standard oficial do Puro-Sangue Lusitano: características da cabeça, defeitos eliminatórios e critérios de julgamento APSL.",
    keywords: ["APSL", "Standard Lusitano", "morfologia", "julgamento", "Puro-Sangue"],
    date: "15 JAN 2026",
    readTime: "20 min",
    category: "Morfologia & Standard",
    relatedSlugs: ["genese-cavalo-iberico", "biomecanica-reuniao", "genetica-pelagens"],
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

        <ArticleImage
          src="https://images.unsplash.com/photo-1560206381-6f05b6282e9c?q=80&w=1200&auto=format&fit=crop"
          alt="Perfil subconvexo característico do Lusitano"
          caption="O perfil subconvexo, os olhos expressivos e as orelhas finas são marcas inconfundíveis da raça."
        />

        {/* ============================================================
            SECÇÃO II — PESCOÇO, GARROTE E ESPÁDUA
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            ============================================================ */}
        <ArticleSection title="II. Pescoço, Garrote e Espádua">
          <ArticleInfoBox title="PESCOÇO" icon={Eye}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              De <strong>comprimento médio</strong>, arqueado, bem inserido na espádua. A inserção
              alta permite a elevação natural da base do pescoço — essencial para a reunião. A
              crineira deve ser <strong>abundante e sedosa</strong>.
            </p>
          </ArticleInfoBox>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
              <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">
                Garrote (Cernelha)
              </h4>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Bem destacado e extenso. Ponto de referência para a medição da altura. Uma cernelha
                proeminente facilita a colocação da sela e indica boa musculatura do dorso.
              </p>
            </div>
            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
              <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Espádua</h4>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong>Longa, oblíqua e bem musculada</strong>. A inclinação da espádua determina a
                amplitude do passo e a liberdade dos anteriores. Uma espádua oblíqua é essencial
                para movimentos elevados.
              </p>
            </div>
          </div>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO III — TRONCO
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            ============================================================ */}
        <ArticleSection title="III. Tronco: Peito, Dorso e Rim">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="PEITO E COSTELAS" icon={Shield}>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                Peito <strong>amplo, profundo e bem musculado</strong>. As costelas devem ser{" "}
                <strong>bem arqueadas e oblíquas</strong>, proporcionando capacidade torácica
                adequada sem comprometer a agilidade.
              </p>
            </ArticleInfoBox>
            <ArticleInfoBox title="DORSO E RIM" icon={Activity}>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                Dorso <strong>bem dirigido, com tendência para horizontal</strong>. O rim (lombo)
                deve ser <strong>curto, largo e bem ligado</strong> à garupa — a conexão
                lombo-sacral é fundamental para a transmissão de força dos posteriores.
              </p>
            </ArticleInfoBox>
          </div>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO IV — GARUPA E POSTERIORES
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            ============================================================ */}
        <ArticleSection title="IV. Garupa e Posteriores">
          <p className={articleTextClasses.body}>
            A garupa do Lusitano é uma das suas características mais distintivas:{" "}
            <strong>forte, arredondada, bem proporcionada e ligeiramente oblíqua</strong>. Esta
            conformação, seleccionada pela tourada, facilita a flexão pélvica necessária para a
            reunião e as piruetas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticlePillarCard icon={CheckCircle2} title="Garupa">
              Arredondada e ligeiramente oblíqua. A cauda deve ser bem inserida, com crina abundante
              e sedosa.
            </ArticlePillarCard>
            <ArticlePillarCard icon={Activity} title="Jarrete">
              Largo, forte e bem definido. A angulação correcta é essencial para a propulsão e
              capacidade de reunião.
            </ArticlePillarCard>
            <ArticlePillarCard icon={Zap} title="Coxa e Nádega">
              Bem musculadas e desenvolvidas. A força dos posteriores é o motor de toda a locomoção
              equina.
            </ArticlePillarCard>
          </div>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO V — MEMBROS E APRUMOS
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            ============================================================ */}
        <ArticleSection title="V. Membros e Aprumos">
          <p className={articleTextClasses.body}>
            Os membros e aprumos são determinantes para a longevidade e funcionalidade do cavalo. Um
            Lusitano com bons aprumos resiste melhor ao desgaste do trabalho e mantém a saúde
            articular ao longo da vida.
          </p>

          <ArticleInfoBox title="CARACTERÍSTICAS DOS MEMBROS" icon={CheckCircle2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Braço</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Bem musculado e proporcionado
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Canelas</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Curtas, secas, com tendões bem destacados
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Articulações</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Amplas, secas e bem definidas
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Cascos</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Bem conformados, proporcionados e resistentes
                  </p>
                </div>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO VI — ANDAMENTOS E TEMPERAMENTO
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            ============================================================ */}
        <ArticleImage
          src="https://images.unsplash.com/photo-1494947665470-20322015e3a8?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalo Lusitano em movimento demonstrando conformação"
          caption="A qualidade dos aprumos e a conformação dos membros são essenciais para a longevidade e funcionalidade do cavalo."
        />

        <ArticleSection title="VI. Andamentos e Temperamento">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticleStatCard
              title="PASSO"
              value="4 Tempos"
              subtitle="Ágil, elevado e amplo"
              highlight
            />
            <ArticleStatCard title="TROTE" value="2 Tempos" subtitle="Elástico, com suspensão" />
            <ArticleStatCard
              title="GALOPE"
              value="3 Tempos"
              subtitle="Macio, elevado, equilibrado"
              highlight
            />
          </div>

          <p className={articleTextClasses.body}>
            Os andamentos do Lusitano distinguem-se pela <strong>elevação</strong> e{" "}
            <strong>cadência</strong>. A tendência natural para a reunião — herança da seleção
            tauromáquica — torna o Lusitano especialmente apto para a Alta Escola e o Dressage de
            competição.
          </p>

          <ArticleInfoBox title="TEMPERAMENTO IDEAL" icon={Heart}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed">
              <strong>Nobre, generoso, ardente mas dócil.</strong> O Lusitano deve demonstrar
              vontade de trabalhar e aprender, mantendo sempre a calma e a ligação com o cavaleiro.
              A aptidão natural para a Alta Escola e os ares acima do solo (levade, courbette,
              capriole) é uma característica distintiva da raça, preservada pela Escola Portuguesa
              de Arte Equestre.
            </p>
          </ArticleInfoBox>
        </ArticleSection>

        {/* SECÇÃO VII — DEFEITOS */}
        <ArticleSection title="VII. Defeitos Eliminatórios">
          <ArticleWarningBox title="DEFEITOS QUE IMPEDEM REGISTO" icon={AlertTriangle}>
            <ul className="space-y-3 text-[var(--foreground-secondary)]">
              <li>• Prognatismo ou retrognatismo acentuado</li>
              <li>• Criptorquidismo (machos)</li>
              <li>• Pelagens não reconhecidas pela APSL</li>
              <li>• Altura inferior a 1,60m (machos) ou 1,55m (fêmeas) aos 6 anos</li>
              <li>• Deformidades graves dos membros ou aprumos</li>
              <li>• Defeitos de temperamento que comprometam a funcionalidade</li>
            </ul>
          </ArticleWarningBox>
        </ArticleSection>
      </>
    ),
    // FONTES ARTIGO 3
    sources: [
      {
        label: "APSL — Standard Oficial da Raça Lusitana",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed",
      },
      {
        label: "US Lusitano Association — Lusitano Breed Standard",
        url: "https://www.uslusitano.org/index.php/apsl-2/apsl-information/lusitano-breed-standard",
      },
    ],
  },

  // ARTIGO 4 — VERIFICADO 2026-02-24
  // FONTE: UC Davis VGL https://vgl.ucdavis.edu/test/cream
  // FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
  "4": {
    title: "A Ciência das Cores: Genética de Pelagens no PSL",
    subtitle: "Locus Extension, Agouti, Diluição Creme, o gene Grey e pelagens raras do PSL.",
    description:
      "Genética das pelagens equinas: Extension, Agouti, Cream, gene Grey (G2/G3), Pearl, Silver e pelagens raras do Puro-Sangue Lusitano.",
    keywords: [
      "genética equina",
      "pelagens",
      "Locus Extension",
      "Agouti",
      "Diluição Creme",
      "gene Grey",
      "Pearl",
      "APSL",
      "Lusitano",
    ],
    date: "12 JAN 2026",
    readTime: "20 min",
    category: "Genética & Pelagens",
    relatedSlugs: ["genese-cavalo-iberico", "standard-apsl", "novilheiro-rubi-revolucao-olimpica"],
    image:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>A</span>
          genética das pelagens equinas é fascinante e complexa. No Cavalo Lusitano, encontramos uma
          grande variedade de cores, todas determinadas pela interação de múltiplos genes.
        </p>

        <ArticleSection title="I. Os Genes Fundamentais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-black">
              <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">
                Locus Extension (E)
              </h4>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                Controla a produção de pigmento negro (eumelanina).
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong>E/E ou E/e:</strong> Permite pigmento negro
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong>e/e:</strong> Alazão (sem negro)
              </p>
            </div>

            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-amber-700">
              <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Locus Agouti (A)</h4>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                Distribui o pigmento negro pelo corpo.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong>A/A ou A/a:</strong> Negro restrito a pontos (castanho/baio)
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong>a/a:</strong> Negro uniforme (preto)
              </p>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="II. Pelagens Base do Lusitano">
          <div className="bg-[var(--background-card)] border-l-4 border-[var(--gold)] p-10 my-12 rounded-sm">
            <h4 className="text-[var(--gold)] font-bold text-2xl mb-6">
              Pelagens Reconhecidas pela APSL
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-[var(--background)]/40 p-6 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-zinc-400 border border-zinc-300 mb-4"></div>
                <h5 className="text-[var(--foreground)] font-bold mb-2">Tordilho</h5>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Progressivo branqueamento. A pelagem mais comum no PSL.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-amber-800 border border-amber-700 mb-4"></div>
                <h5 className="text-[var(--foreground)] font-bold mb-2">Castanho</h5>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Corpo castanho com extremidades negras.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-[var(--background-card)] border border-[var(--border)] mb-4"></div>
                <h5 className="text-[var(--foreground)] font-bold mb-2">Preto</h5>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Pelagem negra uniforme.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-amber-600 border border-amber-500 mb-4"></div>
                <h5 className="text-[var(--foreground)] font-bold mb-2">Alazão</h5>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Pelagem avermelhada sem negro (genótipo e/e).
                </p>
              </div>
            </div>
          </div>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalo castanho de pelagem base demonstrando a expressão do gene Agouti"
          caption="A pelagem castanha — a mais comum no Lusitano — resulta da combinação do gene Extension com o gene Agouti."
        />

        <ArticleSection title="III. A Diluição Creme">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            O gene <strong>Cream</strong> (locus CR, gene SLC45A2) é responsável pela diluição das
            pelagens base, criando cores mais claras. Uma única cópia do alelo Cream (CR/N) produz
            uma diluição parcial; duas cópias (CR/CR) produzem uma diluição intensa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="DOSE SIMPLES (CR/N)" icon={Dna}>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Palomino</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Alazão + Cream → corpo dourado, crina branca
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Isabelo (Buckskin)</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Castanho + Cream → corpo dourado, extremidades negras
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Smoky Black</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Preto + Cream → preto ligeiramente diluído
                  </p>
                </div>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="DOSE DUPLA (CR/CR)" icon={Dna}>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Cremelo</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Alazão + 2×Cream → pelagem quase branca, olhos azuis
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Perlino</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Castanho + 2×Cream → creme claro, extremidades ligeiramente mais escuras
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Smoky Cream</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Preto + 2×Cream → creme claro, semelhante ao perlino
                  </p>
                </div>
              </div>
            </ArticleInfoBox>
          </div>
        </ArticleSection>

        {/* FONTE: Nature Communications 2024 — https://www.nature.com/articles/s41467-024-45618-x */}
        {/* FONTE: UC Davis VGL — https://vgl.ucdavis.edu/news/new-study-identifies-distinct-gray-alleles-contributing-difference-rate-depigmentation */}
        <ArticleSection title="IV. O Gene Grey (STX17): A Pelagem Dominante">
          <p className={articleTextClasses.body}>
            O tordilho é a pelagem mais emblemática e mais comum do Lusitano, representando cerca de{" "}
            <strong>59% de todos os cavalos registados na APSL</strong>. O gene responsável é o{" "}
            <strong>Grey (G)</strong>, localizado no gene STX17 (Syntaxin 17) no cromossoma 25.
            Trata-se de uma <strong>duplicação de 4,6 kb no intrão 6</strong> do STX17, com
            hereditariedade autossómica dominante — basta uma cópia para o cavalo ser tordilho.
          </p>

          <p className={articleTextClasses.body}>
            O tordilho não nasce branco. Todos os cavalos tordilhos nascem com uma pelagem base
            (castanho, preto, alazão) que vai progressivamente branqueando ao longo da vida. Este
            processo resulta da migração prematura dos melanócitos dos folículos pilosos, levando à
            perda gradual de pigmentação.
          </p>

          <ArticleInfoBox title="Descoberta 2024: Dois Alelos Distintos" icon={Microscope}>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-4">
              Em 2024, uma equipa liderada pelo <strong>Dr. Leif Andersson</strong> (Universidade de
              Uppsala e UC Davis) publicou na <em>Nature Communications</em> a descoberta de que
              existem dois alelos distintos do gene Grey, com consequências muito diferentes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-2 border-green-600">
                <h5 className="text-green-400 font-bold mb-2">G2 (2 cópias da duplicação)</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Branqueamento <strong>lento e gradual</strong>. Risco de melanoma{" "}
                  <strong>significativamente mais baixo</strong>. Preferível para a criação.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-2 border-red-600">
                <h5 className="text-red-400 font-bold mb-2">G3 (3 cópias da duplicação)</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Branqueamento <strong>rápido e precoce</strong>. Risco de melanoma{" "}
                  <strong>significativamente mais elevado</strong>. Requer atenção na criação.
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <ArticleWarningBox title="Melanoma em Cavalos Tordilhos" icon={AlertTriangle}>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
              Estima-se que cerca de <strong>80% dos cavalos tordilhos com mais de 15 anos</strong>{" "}
              desenvolvam melanomas cutâneos. Embora frequentemente benignos nos estágios iniciais,
              podem tornar-se invasivos. A descoberta dos alelos G2 e G3 é crucial para a criação
              responsável: testando os reprodutores, os criadores podem seleccionar a favor do alelo
              G2 (baixo risco) e reduzir significativamente a incidência de melanoma nas gerações
              futuras.
            </p>
          </ArticleWarningBox>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalo de pelagem clara, demonstrando o efeito da diluição sobre a cor base"
          caption="O gene Grey é o responsável pelo progressivo clareamento da pelagem ao longo da vida do cavalo."
        />

        {/* FONTE: UC Davis VGL Pearl — https://vgl.ucdavis.edu/test/pearl */}
        {/* FONTE: Horseman's News — https://horsemansnews.com/iberian-horse-colors-101/ */}
        {/* FONTE: UC Davis VGL Dun — https://vgl.ucdavis.edu/test/dun-horse */}
        <ArticleSection title="V. Genes Raros no Lusitano">
          <p className={articleTextClasses.body}>
            Para além das pelagens comuns, o Lusitano carrega vários genes raros que produzem
            fenótipos invulgares. Alguns são exclusivos de raças ibéricas, reflectindo a história
            genética única desta linhagem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="Pearl (SLC45A2)" icon={Dna}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                Gene <strong>recessivo</strong> localizado no mesmo gene que o Cream (SLC45A2,
                mutação c.985G&gt;A). Encontrado em Lusitanos, PRE, Quarter Horse e Paint Horse —
                raças com origem ibérica.
              </p>
              <div className="space-y-2 mt-4">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Homozigoto (prl/prl):</strong> Pelagem apricot pálida, pele clara
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Pearl + Cream (prl/CR):</strong> Pseudo-dupla diluição — pele rosada,
                    olhos azuis ou verdes, fenótipo semelhante a dupla diluição Cream
                  </p>
                </div>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="Silver (PMEL17)" icon={Eye}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                Gene <strong>dominante</strong> que afecta apenas o pigmento negro (eumelanina),
                diluindo-o para um tom chocolate ou cinzento. A crina e cauda ficam prateadas
                (flaxen). Confirmado por ADN em Lusitanos.
              </p>
              <div className="space-y-2 mt-4">
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Em base preta:</strong> Corpo chocolate escuro, crina prateada
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Em base castanha:</strong> Efeito subtil nas extremidades
                  </p>
                </div>
              </div>
            </ArticleInfoBox>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="Roan e Rabicano" icon={Feather}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                O <strong>Roan Clássico</strong> (dominante) foi confirmado em Lusitanos, produzindo
                uma mistura uniforme de pêlos brancos e coloridos pelo corpo, mantendo a cabeça e
                extremidades na cor original.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                O <strong>Rabicano</strong> é um padrão de roaning limitado ao ventre, flancos e
                base da cauda, confirmado em cavalos ibéricos. Não é o mesmo gene do Roan Clássico.
              </p>
            </ArticleInfoBox>

            <ArticleWarningBox title="Dun: O Mito Ibérico" icon={AlertTriangle}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                O gene <strong>Dun verdadeiro NÃO existe</strong> em cavalos ibéricos. Nunca foi
                confirmado por teste de ADN em Lusitano ou PRE.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                As barras nas pernas e riscas dorsais frequentemente vistas em ibéricos são causadas
                pelo alelo <strong>Non-Dun1 (nd1)</strong>, um ancestral do Non-Dun2 (nd2). O nd1
                preserva marcas primitivas (countershading) sem a diluição verdadeira do gene Dun
                (D).
              </p>
            </ArticleWarningBox>
          </div>
        </ArticleSection>

        {/* FONTE: UC Davis VGL — https://vgl.ucdavis.edu/tests */}
        <ArticleSection title="VI. Testes Genéticos e Estratégias de Criação">
          <p className={articleTextClasses.body}>
            Os avanços em genética molecular permitem hoje testar reprodutores para praticamente
            todos os genes de pelagem conhecidos. Para o criador de Lusitanos, estes testes são
            ferramentas essenciais para decisões informadas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <ArticleStatCard
              title="UC Davis VGL"
              value="Painel Completo"
              subtitle="Laboratório de referência"
              description={
                <span>
                  Testes para Extension, Agouti, Cream, Pearl, Grey (G2/G3), Silver, Dun, Roan e
                  muitos outros. Referência mundial em genética equina.
                </span>
              }
              highlight
            />
            <ArticleStatCard
              title="Etalon DX"
              value="Raça & Cor"
              subtitle="Composição genética"
              description={
                <span>
                  Teste de composição de raça por ADN e painel de pelagens. Útil para verificar
                  pureza e identificar genes raros.
                </span>
              }
            />
            <ArticleStatCard
              title="Animal Genetics"
              value="Painéis"
              subtitle="Testes individuais"
              description={
                <span>
                  Testes individuais e em painel para genes de pelagem, incluindo Pearl e Silver
                  frequentes em raças ibéricas.
                </span>
              }
            />
          </div>

          <ArticleInfoBox title="Estratégias para Criadores" icon={Target}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Gene Grey: Testar G2 vs G3
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Seleccionar reprodutores com o alelo G2 (branqueamento lento, menor risco de
                  melanoma) sobre G3 (branqueamento rápido, maior risco). O teste está disponível no
                  UC Davis VGL.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Pearl e Cream: A Interacção
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Ambos os genes residem no locus SLC45A2. Um cavalo portador de Pearl (prl/N) e
                  Cream (CR/N) apresenta pseudo-dupla diluição. Testar para ambos evita surpresas
                  fenotípicas.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Dun: Não Perder Tempo</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Se um Lusitano apresenta barras ou risca dorsal, é nd1 (countershading), não Dun.
                  Testar para Dun em ibéricos é desnecessário — o alelo D nunca foi encontrado
                  nestas raças.
                </p>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>
      </>
    ),
    // FONTES ARTIGO 4
    sources: [
      { label: "UC Davis VGL — Gene de Diluição Creme", url: "https://vgl.ucdavis.edu/test/cream" },
      {
        label: "APSL — Pelagens do Lusitano",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed",
      },
      // FONTE: Nature Communications 2024 — Andersson et al., Grey alleles G2/G3
      {
        label: "Nature Communications 2024 — Alelos Grey G2/G3",
        url: "https://www.nature.com/articles/s41467-024-45618-x",
      },
      // FONTE: UC Davis VGL — Grey Alleles Study
      {
        label: "UC Davis VGL — Alelos Grey no Cavalo",
        url: "https://vgl.ucdavis.edu/news/new-study-identifies-distinct-gray-alleles-contributing-difference-rate-depigmentation",
      },
      // FONTE: UC Davis VGL — Pearl
      { label: "UC Davis VGL — Gene Pearl", url: "https://vgl.ucdavis.edu/test/pearl" },
      // FONTE: UC Davis VGL — Dun
      { label: "UC Davis VGL — Gene Dun", url: "https://vgl.ucdavis.edu/test/dun-horse" },
      // FONTE: Horseman's News — Iberian Horse Colors 101
      {
        label: "Horseman's News — Iberian Horse Colors 101",
        url: "https://horsemansnews.com/iberian-horse-colors-101/",
      },
    ],
  },

  "5": {
    title: "Toricidade: A Seleção pelo Combate",
    subtitle: "Como a Tauromaquia moldou a psique do Lusitano.",
    description:
      "Toricidade: bravura, inteligência tática, explosão controlada e vontade de agradar no Cavalo Lusitano.",
    keywords: ["Toricidade", "tauromaquia", "temperamento Lusitano", "bravura equina"],
    date: "08 JAN 2026",
    readTime: "15 min",
    category: "Funcionalidade & Temperamento",
    relatedSlugs: [
      "genese-cavalo-iberico",
      "biomecanica-reuniao",
      "novilheiro-rubi-revolucao-olimpica",
    ],
    image:
      "https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>A</span>
          <strong>&quot;Toricidade&quot;</strong> é o conjunto de características psicológicas e
          físicas que permitem a um cavalo trabalhar frente a um touro bravo. É o traço que mais
          distingue o Lusitano de todas as outras raças equinas do mundo — e é o resultado de
          séculos de seleção pela mais exigente das provas: a sobrevivência na arena.
        </p>

        {/* ============================================================
            SECÇÃO I — PILARES DA TORICIDADE
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            ============================================================ */}
        <ArticleSection title="I. Os Pilares da Toricidade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticlePillarCard icon={Flame} title="Bravura">
              A capacidade de enfrentar o perigo sem hesitação. Uma{" "}
              <strong>coragem controlada</strong> — não a cegueira do ataque, mas a firmeza de quem
              conhece o risco e avança.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Brain} title="Inteligência Tática">
              O cavalo deve <strong>antecipar</strong> os movimentos do touro, reagindo antes da
              carga — uma capacidade cognitiva que requer séculos de seleção.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Zap} title="Explosão Controlada">
              Arranques instantâneos a partir da imobilidade. A transição de parado a galope pleno
              deve ser quase instantânea — uma questão de vida ou morte na arena.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Award} title="Vontade de Agradar">
              Mantém a <strong>ligação com o cavaleiro</strong> mesmo sob stress extremo. O cavalo
              nunca &quot;desliga&quot; do seu cavaleiro, mesmo com um touro a metros de distância.
            </ArticlePillarCard>
          </div>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO II — A TOURADA PORTUGUESA
            FONTE: Wikipedia Portuguese-style bullfighting https://en.wikipedia.org/wiki/Portuguese-style_bullfighting
            ============================================================ */}
        <ArticleSection title="II. A Tourada Portuguesa: Tradição e Diferença">
          <p className={articleTextClasses.body}>
            A tourada portuguesa é fundamentalmente diferente da corrida espanhola. Em Portugal, o{" "}
            <strong>cavaleiro</strong> (cavaleiro tauromáquico) é o protagonista — ele trabalha o
            touro a cavalo durante toda a lide, e o touro <strong>não é morto na arena</strong>{" "}
            (proibido desde 1928). A tourada portuguesa é, acima de tudo, uma demonstração de{" "}
            <strong>equitação suprema</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="PORTUGAL" icon={Shield}>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Protagonista:</strong> O cavaleiro e o cavalo
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Cavalo:</strong> Sempre presente, trabalho contínuo
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Touro:</strong> Não é morto na arena
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Ênfase:</strong> Arte equestre e bravura do cavalo
                </p>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="ESPANHA (REJONEADOR)" icon={Swords}>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Protagonista:</strong> O matador (a pé) ou rejoneador (a cavalo)
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Cavalo:</strong> Presente apenas no terço de varas (picadores)
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Touro:</strong> Morto na arena na corrida tradicional
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Ênfase:</strong> Confronto homem-touro
                </p>
              </div>
            </ArticleInfoBox>
          </div>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalo Lusitano em contexto de trabalho com touro"
          caption="A tourada portuguesa exige do cavalo agilidade, coragem e uma confiança absoluta no cavaleiro."
        />

        {/* ============================================================
            SECÇÃO III — O PAPEL DO CAVALO NA ARENA
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            ============================================================ */}
        <ArticleSection title="III. O Papel do Cavalo na Arena">
          <p className={articleTextClasses.body}>
            Na tourada portuguesa, o cavalo é <strong>co-protagonista</strong> — o público julga
            tanto o cavaleiro como o cavalo. O cavalo deve executar um reportório complexo de
            movimentos com precisão milimétrica, enquanto lida com a presença de um touro bravo a
            metros de distância.
          </p>

          <ArticleInfoBox title="MOVIMENTOS EXIGIDOS" icon={Target}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Piruetas</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Rotações sobre os posteriores para esquivar a carga do touro
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Passagens Laterais</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Movimentos laterais para posicionar o cavaleiro em relação ao touro
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Arranques e Paragens</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Transições instantâneas — a diferença entre segurança e perigo
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Trabalho a Uma Mão</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    O cavaleiro segura as bandarilhas com uma mão, controlando o cavalo apenas com a
                    outra
                  </p>
                </div>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            O cavalo deve &quot;ler&quot; o touro — antecipar cargas, esquivar-se no último momento,
            e manter a calma quando o touro está a centímetros. Esta capacidade de
            &quot;leitura&quot; não é treinável — é uma aptidão genética que foi seleccionada ao
            longo de séculos.
          </p>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO IV — SELEÇÃO APSL
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            FONTE: USLA https://uslusitano.org/index.php/usla/lusitano-info/history-j
            ============================================================ */}
        <ArticleSection title="IV. Seleção e Avaliação pela APSL">
          <p className={articleTextClasses.body}>
            A <strong>funcionalidade</strong> é um pilar fundamental do standard Lusitano. Enquanto
            outras raças ibéricas perderam esta ênfase, Portugal manteve o{" "}
            <strong>&quot;Factor Ibérico&quot;</strong> — a seleção pela funcionalidade tauromáquica
            e de trabalho.
          </p>

          <p className={articleTextClasses.body}>
            A APSL avalia o temperamento como parte integral da classificação morfológica. Um
            Lusitano ideal deve ser: <strong>nobre</strong>, <strong>generoso</strong>,{" "}
            <strong>ardente mas dócil</strong>. A seleção pela tourada moldou directamente a
            conformação do cavalo:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticlePillarCard icon={Activity} title="Garupa Oblíqua">
              Facilita as piruetas rápidas — essenciais para esquivar cargas do touro.
            </ArticlePillarCard>

            <ArticlePillarCard icon={CheckCircle2} title="Jarrete Angulado">
              Permite os arranques explosivos a partir da imobilidade.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Eye} title="Pescoço Arqueado">
              Proporciona equilíbrio natural e facilita a reunião sob pressão.
            </ArticlePillarCard>
          </div>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalo Lusitano em exercício de dressage clássica"
          caption="As qualidades seleccionadas pela tourada — agilidade, reunião natural e temperamento — são as mesmas que brilham no desporto moderno."
        />

        {/* ============================================================
            SECÇÃO V — DA ARENA AO DESPORTO
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
            ============================================================ */}
        <ArticleSection title="V. Da Arena ao Desporto Moderno">
          <p className={articleTextClasses.body}>
            As mesmas qualidades seleccionadas pela tourada durante séculos são precisamente as que
            fazem do Lusitano um cavalo excepcional no desporto moderno:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="DA TOURADA AO DRESSAGE" icon={Trophy}>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Piruetas na arena</strong> → Piruetas no Grand Prix
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Reunião sob stress</strong> → Reunião no teste
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Responsividade</strong> → Obediência às ajudas
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Coragem controlada</strong> → Presença e expressão
                </p>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="DA TOURADA À WORKING EQUITATION" icon={Star}>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Agilidade na arena</strong> → Agilidade nos obstáculos
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Leitura do touro</strong> → Leitura do gado
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Coragem</strong> → Confiança em situações novas
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Ligação cavaleiro-cavalo</strong> → Parceria total
                </p>
              </div>
            </ArticleInfoBox>
          </div>

          <p className={articleTextClasses.body}>
            O temperamento <strong>&quot;ardente mas dócil&quot;</strong> — aparentemente
            contraditório — é a essência do Lusitano. O cavalo que enfrenta um touro com bravura é o
            mesmo que se deixa montar por um principiante com docilidade. Esta versatilidade única,
            forjada na arena, é o maior legado da toricidade.
          </p>
        </ArticleSection>
      </>
    ),
    // FONTES ARTIGO 5
    sources: [
      {
        label: "APSL — Aptidão e Temperamento da Raça Lusitana",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed",
      },
      {
        label: "Wikipedia — Portuguese-style Bullfighting",
        url: "https://en.wikipedia.org/wiki/Portuguese-style_bullfighting",
      },
      {
        label: "USLA — History of the Lusitano",
        url: "https://uslusitano.org/index.php/usla/lusitano-info/history-j",
      },
    ],
  },

  // ARTIGO 6 — VERIFICADO 2026-02-24
  // FONTE: Eurodressage https://www.eurodressage.com/2012/09/30/goncalo-carvalho-and-rubi-danced-stars-2012-olympic-games
  // FONTE: Horse & Hound https://www.horseandhound.co.uk/archives/in-praise-of-the-lusitano-48487
  // FONTE: Team Rubi https://www.teamrubi.com/horses/rubi-ar/
  // FONTE: Lusitano Horse Finder https://lusitanohorsefinder.com/manuel-borba-veiga/
  // FONTE: Rimondo https://www.rimondo.com/en/horse-details/476091/novilheiro
  // FONTE: Interagro Lusitanos https://lusitano-interagro.com/three-main-lines/
  // FONTE: Superior Equine Sires https://www.superiorequinesires.com/rubi-alter-real/
  "6": {
    title: "De Novilheiro a Rubi: A Revolução Internacional",
    subtitle: "Como o Lusitano provou o seu valor ao mais alto nível do desporto equestre.",
    description:
      "Novilheiro e Rubi AR: a revolução do Cavalo Lusitano no desporto equestre internacional, dos Saltos aos Jogos Olímpicos de Londres 2012.",
    keywords: [
      "Novilheiro",
      "Rubi AR",
      "Dressage",
      "FEI",
      "Jogos Olímpicos",
      "Lusitano",
      "Gonçalo Carvalho",
    ],
    date: "02 JAN 2026",
    readTime: "25 min",
    category: "Desporto & Competição",
    relatedSlugs: ["biomecanica-reuniao", "toricidade-selecao-combate", "genetica-pelagens"],
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>D</span>
          urante décadas, o Cavalo Lusitano foi considerado &quot;inadequado&quot; para o desporto
          equestre de alta competição. A raça, associada à tourada e à equitação de trabalho, era
          vista com desconfiança nos circuitos internacionais dominados por Warmbloods. Uma série de
          cavalos extraordinários — de <strong>Novilheiro</strong> nos Saltos a{" "}
          <strong>Rubi AR</strong> no Dressage Olímpico, de <strong>Guizo</strong> em Atenas a{" "}
          <strong>Fogoso</strong> em Tóquio — provou que estavam todos errados. Esta é a história da
          revolução internacional do Lusitano.
        </p>

        {/* ============================================================
            SECÇÃO I — NOVILHEIRO
            FONTE: Horse & Hound https://www.horseandhound.co.uk/archives/in-praise-of-the-lusitano-48487
            FONTE: Rimondo https://www.rimondo.com/en/horse-details/476091/novilheiro
            FONTE: Interagro https://lusitano-interagro.com/three-main-lines/
            ============================================================ */}
        <ArticleSection title="I. O Pioneiro: Novilheiro">
          <p className={articleTextClasses.body}>
            <strong>Novilheiro (MV)</strong>, nascido em 1971, foi criado por{" "}
            <strong>Manuel Veiga</strong> na sua coudelaria em Golegã. Filho do garanhão Andrade{" "}
            <strong>Firme (SA)</strong> e da égua Veiga <strong>Guerrita (MV)</strong>, Novilheiro
            tornou-se o primeiro Lusitano a provar que a raça podia competir ao mais alto nível
            internacional — e fê-lo em múltiplas disciplinas.
          </p>

          <ArticleInfoBox title="CARREIRA MULTIDISCIPLINAR" icon={Trophy}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Tauromaquia</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Iniciou a carreira na tourada em Portugal, demonstrando a versatilidade
                  característica da raça.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Dressage de Grand Prix</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Treinado até ao nível de Grand Prix por Jean-Philippe Giacomini, discípulo de Nuno
                  Oliveira.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Concurso Completo</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Competiu em Eventing com Rachel Bayliss no Reino Unido.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">Saltos — John Whitaker</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Com John Whitaker, passou de Foxhunter a Grau A numa só temporada. Venceu em
                  Dublin, Wembley, Toronto, Amesterdão, Bruxelas e Hickstead. Em 1983 foi 12.º no
                  Top Twenty mundial de prémios acumulados.
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            Novilheiro esteve em reprodução no Meretown Stud (Shropshire), propriedade de Johanna
            Vardon, antes de regressar a Portugal em 1987. O seu filho{" "}
            <strong>Crown Cornelian</strong> tornou-se um reprodutor de sucesso em Saltos e Concurso
            Completo no Reino Unido. Novilheiro continua a ser o único Lusitano a ter competido ao
            mais alto nível internacional de Saltos de Obstáculos.
          </p>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalo em competição de saltos de obstáculos"
          caption="Novilheiro abriu as portas do desporto internacional para o Lusitano nos anos 1980, competindo ao mais alto nível em Saltos de Obstáculos."
        />

        {/* ============================================================
            SECÇÃO II — GUIZO
            FONTE: Eurodressage https://www.eurodressage.com/2006/11/26/guizo-passed-away
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage
            ============================================================ */}
        <ArticleSection title="II. O Primeiro Olímpico: Guizo">
          <p className={articleTextClasses.body}>
            Antes de Rubi AR, houve <strong>Guizo</strong> — o Lusitano que abriu as portas dos
            Jogos Olímpicos para a raça. Nascido em 1988, filho de <strong>Zasebande</strong> e{" "}
            <strong>Cataria</strong> (por Tivoli), Guizo foi criado pela{" "}
            <strong>Fundação Eugénio de Almeida</strong> e competiu pela Espanha com o cavaleiro{" "}
            <strong>Juan Antonio Jimenez Cobo</strong>.
          </p>

          <ArticleInfoBox title="PALMARÉS OLÍMPICO E INTERNACIONAL" icon={Award}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">Sydney 2000</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Primeiro Lusitano a competir nos Jogos Olímpicos modernos em Dressage. Qualificado
                  através do 3.º lugar no Campeonato Nacional de Espanha.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">
                  Atenas 2004 — Medalha de Prata por Equipas
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  A mais alta distinção olímpica alguma vez conquistada com um Lusitano. Guizo
                  integrou a equipa espanhola que ganhou a medalha de prata.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">JEM 2002 (Jerez)</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Bronze por equipas nos Jogos Equestres Mundiais.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Europeus 2003 (Hickstead)
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Prata por equipas no Campeonato da Europa.
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            A medalha de prata de Guizo em Atenas permanece, até hoje, a mais alta classificação
            olímpica alguma vez obtida por um cavalo Lusitano. O facto de ter competido pela Espanha
            — e não por Portugal — é um pormenor histórico que sublinha como a excelência do
            Lusitano transcende fronteiras.
          </p>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO III — RUBI AR
            FONTE: Eurodressage https://www.eurodressage.com/2012/09/30/goncalo-carvalho-and-rubi-danced-stars-2012-olympic-games
            FONTE: Team Rubi https://www.teamrubi.com/horses/rubi-ar/
            FONTE: Festival of the Iberian Horse https://festivaloftheiberianhorse.co.uk/pages/the-lusitano-in-dressage-7-in-the-top-100-dressage-horses
            ============================================================ */}
        <ArticleSection title="III. Rubi AR: O Embaixador">
          <p className={articleTextClasses.body}>
            <strong>Rubi AR</strong>, nascido em 1998 na <strong>Coudelaria de Alter</strong>, filho
            de <strong>Batial AR</strong> e <strong>He-Xila</strong> (por Xaquiro). Montado por{" "}
            <strong>Gonçalo Carvalho</strong>, Rubi AR levou Portugal aos{" "}
            <strong>Jogos Olímpicos de Londres 2012</strong> e tornou-se o reprodutor Lusitano mais
            influente da história do Dressage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticleStatCard
              title="FREESTYLE OLÍMPICO"
              value="77.6%"
              subtitle="Londres 2012"
              highlight
            />
            <ArticleStatCard
              title="RANKING FEI"
              value="19.º"
              subtitle="Melhor classificação mundial"
            />
            <ArticleStatCard
              title="WBFSH SIRES"
              value="#17"
              subtitle="Ranking de reprodutores 2023"
              highlight
            />
          </div>

          <ArticleInfoBox title="RESULTADOS OLÍMPICOS — LONDRES 2012" icon={Award}>
            <ul className="space-y-3 text-[var(--foreground-secondary)]">
              <li>
                • <strong>Grand Prix:</strong> 74.222% — 16.º classificado
              </li>
              <li>
                • <strong>Freestyle (Kür):</strong> 77.607% — qualificou para a final
              </li>
              <li>
                • <strong>Melhor Freestyle da carreira:</strong> 78.150% (CDI 3* Vilamoura 2012)
              </li>
            </ul>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            Rubi AR competiu nos Jogos Equestres Mundiais de Kentucky (2010), nos Campeonatos da
            Europa de Roterdão (2011) e Herning (2013). Após a reforma desportiva, tornou-se o
            garanhão ibérico mais bem classificado de sempre no ranking WBFSH de reprodutores de
            Dressage: <strong>17.º lugar em 2023</strong>. Dois dos seus filhos —{" "}
            <strong>Fenix de Tineo</strong> e <strong>Coroado</strong> — competiram ao mais alto
            nível, com Coroado a ser o primeiro Lusitano a ultrapassar 80% numa Kür.
          </p>

          <ArticleInfoBox title="LUSITANOS NO TOP 100 REPRODUTORES WBFSH (2023)" icon={TrendingUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--gold)]">#17</strong> — Rubi AR
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#28</strong> — Rico
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#64</strong> — Viheste
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#73</strong> — Soberano
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#76</strong> — Spartacus
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#92</strong> — Altivo
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#93</strong> — Riopele
                </p>
              </div>
            </div>
            <p className="text-[var(--foreground-muted)] text-xs mt-4">
              7 Lusitanos no Top 100 mundial — a raça alcançou o 6.º lugar no ranking WBFSH de
              Dressage em 2020.
            </p>
          </ArticleInfoBox>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO IV — PEQUIM 2008
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage
            ============================================================ */}
        <ArticleSection title="IV. Pequim 2008: A Segunda Raça Mais Representada">
          <p className={articleTextClasses.body}>
            Os Jogos Olímpicos de Pequim 2008 marcaram um ponto de viragem. Pela primeira vez,
            Portugal enviou uma equipa de Dressage inteiramente montada em Lusitanos:{" "}
            <strong>Miguel Ralão</strong> com Oxalis da Meia Lua, <strong>Carlos Pinto</strong> com
            Notavel JCL Puy du Fou, e <strong>Daniel Pinto</strong> com Galopin de La Font.
          </p>

          <p className={articleTextClasses.body}>
            O Brasil seguiu o exemplo, com uma equipa também inteiramente Lusitana: Nilo V.O., Samba
            e Oceano do Top. A Austrália levou <strong>Relâmpago do Retiro</strong>. No total, o
            Lusitano foi a <strong>segunda raça mais representada</strong> nos Jogos de Pequim — um
            feito notável para uma raça que, apenas duas décadas antes, era praticamente
            desconhecida nos circuitos de Dressage.
          </p>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO V — TÓQUIO 2021
            FONTE: Eurodressage https://eurodressage.com/2021/07/24/scores-2021-olympic-games
            FONTE: Lusitano World https://www.lusitanoworld.com/en/blog/portuguese-team-to-the-tokyo-finals/
            FONTE: Horse Magazine https://www.horsemagazine.com/thm/2021/07/lusitano-star-in-tokyo/
            FONTE: Horse & Hound (Equador) https://www.horseandhound.co.uk/news/joao-torrao-equador-dies-786026
            ============================================================ */}
        <ArticleSection title="V. Tóquio 2021: O Recorde Histórico">
          <p className={articleTextClasses.body}>
            Os Jogos Olímpicos de Tóquio 2021 foram o auge do Lusitano no Dressage internacional.
            Pela primeira vez na história, Portugal qualificou uma <strong>equipa completa</strong>{" "}
            para a competição de Dressage Olímpico — e os três cavalos eram Lusitanos.
          </p>

          <ArticleInfoBox title="EQUIPA PORTUGUESA — TÓQUIO 2021" icon={Globe}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">
                  Rodrigo Torres &amp; Fogoso Campline
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Por Rico. GP 72.624% (17.º) | GPS 74.726% (17.º) |{" "}
                  <strong>Kür 78.943% (16.º)</strong> — recorde para um Lusitano nos Jogos
                  Olímpicos. Único português a qualificar para a final individual (Top 18).
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Maria Caetano &amp; Fenix de Tineo
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Por Rubi AR. GP 70.311% (27.º) | GPS 68.693% (22.º). Filho de Rubi AR — a primeira
                  vez que um reprodutor teve dois descendentes qualificados para os Jogos Olímpicos
                  em Dressage.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  João Torräo &amp; Equador MVL
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Por Quo Vadis. GP 70.186% (29.º) | GPS 68.298% (23.º).
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            A equipa portuguesa terminou em <strong>7.ª posição</strong> na final por equipas (entre
            8 nações). O Brasil esteve também representado com <strong>João Victor Oliva</strong> e
            Escorial Campline (por Spartacus).
          </p>

          <ArticleWarningBox title="IN MEMORIAM: EQUADOR MVL (2009–2022)" icon={Heart}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed">
              Equador MVL, criado pela Coudelaria Monte Velho (por Quo Vadis × Que Há/Hostil),
              faleceu a 2 de Maio de 2022, aos 13 anos, na sequência de uma lesão cervical após
              cirurgia de emergência em França. Detinha os recordes nacionais portugueses de GP
              (77.348%) e GPS (79%+). A sua perda prematura foi sentida por toda a comunidade
              equestre.
            </p>
          </ArticleWarningBox>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1558022103-603c34ab10ce?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalo em competição de dressage de alto nível"
          caption="Os Jogos Olímpicos de Tóquio 2021 marcaram um momento histórico para o Lusitano, com representação recorde da raça."
        />

        {/* ============================================================
            SECÇÃO VI — WORKING EQUITATION
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/working-equitation
            FONTE: Lusitano World https://www.lusitanoworld.com/en/blog/portugal-working-equitation-world-champions/
            FONTE: Wikipedia https://en.wikipedia.org/wiki/Working_equitation
            ============================================================ */}
        <ArticleSection title="VI. Working Equitation: O Domínio Absoluto">
          <p className={articleTextClasses.body}>
            Se no Dressage o Lusitano compete com Warmbloods, na <strong>Working Equitation</strong>{" "}
            o domínio é absoluto. Esta disciplina, fundada em 1996 por Itália, Espanha, França e
            Portugal, promove a competição entre estilos tradicionais de equitação de trabalho. As
            provas incluem Dressage, Maneabilidade (Ease of Handling), Velocidade e Trabalho com
            Gado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticleStatCard
              title="CAMPEONATOS MUNDIAIS"
              value="5+"
              subtitle="Títulos de Portugal"
              highlight
            />
            <ArticleStatCard title="CM 2022" value="55%" subtitle="Cavalos eram Lusitanos" />
            <ArticleStatCard
              title="CM 2022"
              value="Top 7"
              subtitle="Todos em Lusitanos"
              highlight
            />
          </div>

          <p className={articleTextClasses.body}>
            No Campeonato Mundial de 2022 (Les Herbiers, França), Portugal venceu por 66 pontos de
            vantagem sobre a Espanha. As 7 primeiras posições individuais foram{" "}
            <strong>todas ocupadas por Lusitanos</strong>. De 49 cavalos em competição, 27 (55%)
            eram Lusitanos.
          </p>

          <ArticleInfoBox title="CAVALEIROS LENDÁRIOS" icon={Star}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">Pedro Torres &amp; Oxidado</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  O par mais titulado da história da Working Equitation. Torres foi campeão
                  individual em 2000, 2004, 2008, 2009, 2010 e 2011, com múltiplos títulos por
                  equipas com Portugal.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Gilberto Filipe &amp; Zinque das Lezírias
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Campeão mundial em 2018 (Munique) e 2022 (Les Herbiers).
                </p>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        {/* ============================================================
            SECÇÃO VII — ATRELAGEM
            FONTE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/carriage-driving
            FONTE: FEI https://www.fei.org/history/fei-world-championships/1996-waregem-belgium
            FONTE: Interagro https://lusitano-interagro.com/driving/
            ============================================================ */}
        <ArticleSection title="VII. Atrelagem: Felix Brasseur, Bicampeão Mundial">
          <p className={articleTextClasses.body}>
            Na disciplina de Atrelagem (Carriage Driving), o Lusitano alcançou o feito mais raro:
            dois títulos mundiais com equipas inteiramente compostas por cavalos da raça. O
            protagonista foi o cocheiro belga <strong>Felix Brasseur</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="WAREGEM 1996 — CAMPEONATO MUNDIAL" icon={Trophy}>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                <strong>Ouro individual e por equipas</strong> com 5 Lusitanos puros: Golias,
                Favorito, Fraque (por Vidago), Fulgoso e Falcão (por Jaquetão).
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Proprietário: <strong>José Manuel de Mello</strong>, então presidente da APSL.
              </p>
            </ArticleInfoBox>

            <ArticleInfoBox title="AACHEN 2006 — JOGOS EQUESTRES MUNDIAIS" icon={Trophy}>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                <strong>Ouro individual</strong> com 4 Lusitanos: Odoroso, Quijote, Orpheu e
                Quo-Vadis.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Venceu <strong>Ijsbrand Chardon</strong> (Holanda) para o ouro — um dos maiores
                cocheiros da história.
              </p>
            </ArticleInfoBox>
          </div>

          <p className={articleTextClasses.body}>
            Os triunfos de Brasseur demonstraram que o Lusitano não é apenas um cavalo de sela: a
            sua inteligência, obediência e capacidade atlética fazem dele uma escolha de eleição
            também nas disciplinas de atrelagem ao mais alto nível mundial.
          </p>
        </ArticleSection>
      </>
    ),
    sources: [
      {
        label: "Eurodressage — Gonçalo Carvalho and Rubi at 2012 Olympics",
        url: "https://www.eurodressage.com/2012/09/30/goncalo-carvalho-and-rubi-danced-stars-2012-olympic-games",
      },
      {
        label: "Eurodressage — Guizo Passed Away (career summary)",
        url: "https://www.eurodressage.com/2006/11/26/guizo-passed-away",
      },
      {
        label: "Eurodressage — 2021 Olympic Dressage Scores",
        url: "https://eurodressage.com/2021/07/24/scores-2021-olympic-games",
      },
      {
        label: "Eurodressage — Equador MVL Passed Away",
        url: "https://eurodressage.com/2022/05/03/portuguese-olympic-team-horse-equador-passed-away",
      },
      {
        label: "Team Rubi — Rubi AR (site oficial)",
        url: "https://www.teamrubi.com/horses/rubi-ar/",
      },
      {
        label: "Horse & Hound — In Praise of the Lusitano (Novilheiro)",
        url: "https://www.horseandhound.co.uk/archives/in-praise-of-the-lusitano-48487",
      },
      {
        label: "Horse & Hound — Equador MVL dies aged 13",
        url: "https://www.horseandhound.co.uk/news/joao-torrao-equador-dies-786026",
      },
      {
        label: "APSL — Sucessos Desportivos: Dressage",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage",
      },
      {
        label: "APSL — Sucessos Desportivos: Working Equitation",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/working-equitation",
      },
      {
        label: "APSL — Sucessos Desportivos: Atrelagem",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/carriage-driving",
      },
      {
        label: "Festival of the Iberian Horse — Top 100 Dressage Sires",
        url: "https://festivaloftheiberianhorse.co.uk/pages/the-lusitano-in-dressage-7-in-the-top-100-dressage-horses",
      },
      {
        label: "Lusitano World — Portugal Working Equitation World Champions",
        url: "https://www.lusitanoworld.com/en/blog/portugal-working-equitation-world-champions/",
      },
      {
        label: "The Horse Magazine — Lusitanos Star in Tokyo",
        url: "https://www.horsemagazine.com/thm/2021/07/lusitano-star-in-tokyo/",
      },
      { label: "Interagro Lusitanos — Driving", url: "https://lusitano-interagro.com/driving/" },
      {
        label: "Rimondo — Novilheiro (pedigree)",
        url: "https://www.rimondo.com/en/horse-details/476091/novilheiro",
      },
    ],
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
    readTime: "25 min",
    category: "History & Archaeology",
    relatedSlugs: ["standard-apsl", "genetica-pelagens", "toricidade-selecao-combate"],
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
          (Jansen et al., 2002) identified <strong>Haplogroup D1</strong> as an exclusive marker of
          the Iberian Peninsula, dominant in Lusitano horses tested.
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
                croup — morphological traits reminiscent of the modern Lusitano.
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
                Osteological remains of equids found at Moita do Sebastião and Cabeço da Arruda,
                evidencing the ancestral presence of the horse in the region.
              </p>
            </div>
          </div>
        </div>

        <ArticleImage
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop"
          alt="Iberian horses"
          caption="Artistic representation of primitive Iberian horses"
        />

        <ArticleSection title="I. The Genetic Revolution: Haplogroups and Phylogeography">
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
                <p className="text-3xl font-bold text-[var(--foreground)] mb-2">Dominant</p>
                <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                  Iberian Peninsula
                </p>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Most frequent in Lusitanos, PRE, Alter Real.{" "}
                  <strong>Rare or absent in northern European breeds</strong>.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-4 border-[var(--border)]">
                <h5 className="text-[var(--foreground)] font-bold mb-2">HAPLOGROUP A</h5>
                <p className="text-3xl font-bold text-[var(--foreground)] mb-2">Dominant</p>
                <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                  Central/Northern Europe
                </p>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Most frequent in Warmbloods and Hanoverians.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-4 border-[var(--border)]">
                <h5 className="text-[var(--foreground)] font-bold mb-2">HAPLOGROUP B</h5>
                <p className="text-3xl font-bold text-[var(--foreground)] mb-2">Frequent</p>
                <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                  Central Asia
                </p>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Present in Arabs, Turkomans, Akhal-Teke.
                </p>
              </div>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="II. The Gineta School vs. The Bridle">
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
                  <strong className="text-[var(--foreground)]">Tactics:</strong> Hit-and-run,
                  feigned retreats
                </p>
              </div>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="III. Rome, the Moors, and the Making of the Breed">
          <p className={articleTextClasses.body}>
            Iberian horses were already famous in antiquity. The Romans, upon conquering the
            Peninsula, adopted the local horses and their riding techniques — quick starts, sudden
            stops and feigned retreats — establishing military stud farms in the region.
          </p>

          <p className={articleTextClasses.body}>
            In <strong>711 AD</strong>, the Muslim invasion brought <strong>Barb</strong> horses
            from North Africa to the Iberian Peninsula. The cross between the Barb and the native
            Iberian produced a type of war horse considered superior to the original — combining the
            endurance and agility of the Iberian with the speed and refinement of the Barb. This
            cross is described as the foundation of the type that the Conquistadors later took to
            the Americas.
          </p>

          <ArticleInfoBox title="THE DUKE OF NEWCASTLE (1667)" icon={BookOpen}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed text-lg italic">
              &quot;The Iberian horse possesses the proudest trot and best action.&quot;
            </p>
            <p className="text-[var(--foreground-muted)] text-sm mt-3">
              — William Cavendish, Duke of Newcastle, riding master and author
            </p>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleSection title="IV. The Age of Discovery">
          <p className={articleTextClasses.body}>
            Portuguese horses accompanied colonizers to South America, becoming the genetic
            foundation for several New World breeds. A notable example: the Alter Real stallion{" "}
            <strong>Sublime</strong>, given by Dom Pedro I (future Emperor of Brazil) to the Baron
            of Alfenas, became the foundation sire of the <strong>Mangalarga Marchador</strong>{" "}
            breed — today the most numerous horse breed in Brazil. His descendants, known as
            &quot;Sublimes&quot;, were distinguished by their smooth gaits, including the marcha.
          </p>

          <p className={articleTextClasses.body}>
            Iberian influence extends also to the North American <strong>Mustang</strong>, the
            Argentine <strong>Criollo</strong>, and the Colombian <strong>Paso Fino</strong> — all
            breeds descended from horses brought by Iberian colonizers.
          </p>
        </ArticleSection>

        <ArticleSection title="V. The Alter Real Stud (1748)">
          <p className={articleTextClasses.body}>
            In 1748, <strong>King João V</strong> founded the Alter Real Stud as part of a breeding
            policy begun in 1708. The goal was ambitious: to breed horses for the practice of{" "}
            <strong>High School</strong> (<em>haute école</em>), matching the grandeur of the
            Portuguese court.
          </p>

          <ArticleInfoBox title="FOUNDATION DATA" icon={Crown}>
            <div className="space-y-3">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Location</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Coutada do Arneiro, ~800 hectares, Alter do Chão, Alentejo
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Foundation Stock</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  ~300 Iberian mares imported from Spain in 1747, mostly bay-coloured
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Herd Formation</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Between 1749 and 1770, the breeding nucleus of Andalusian origin was consolidated
                </p>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleSection title="VI. The Napoleonic Plunder and Recovery">
          <ArticleWarningBox title="The Irreparable Loss (1807-1814)" icon={Flame}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6 text-lg">
              During the French Invasions, General Junot ordered the systematic theft of the best
              stallions from the Alter Real Stud. The vast majority were taken by French troops,
              threatening the breed&apos;s survival.
            </p>
          </ArticleWarningBox>

          <p className={articleTextClasses.body}>
            After the invasions, other breeds were introduced to rebuild numbers, causing a decline
            in quality. In <strong>1910</strong>, following the assassination of King Carlos I and
            the establishment of the Republic, the stud was closed. The future of the breed looked
            bleak.
          </p>

          <ArticleInfoBox title="THE SALVATION: DR. RUY D'ANDRADE" icon={Heart}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              In <strong>1938</strong>, veterinarian and hippologist{" "}
              <strong>Dr. Ruy d&apos;Andrade</strong> (1880-1967) acquired three Alter Real
              stallions: <strong>Vigilante</strong>, <strong>Regedor</strong>, and{" "}
              <strong>Marialva II</strong>.
            </p>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              In <strong>1942</strong>, he transferred his foundation herd to the Ministry of
              Agriculture, enabling the stud&apos;s reopening. Through careful selection, quality
              was gradually restored.
            </p>
            <p className="text-[var(--foreground-secondary)] leading-relaxed">
              Today, the Alter Real Stud maintains ~300 Lusitanos, with ~40 serving the{" "}
              <strong>Portuguese School of Equestrian Art</strong>. The property includes a genetics
              laboratory, equine management school and museum.
            </p>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleSection title="VII. The Separation and the Modern Registry">
          <p className={articleTextClasses.body}>
            Until the 1960s, the Iberian horse was called &quot;Andalusian&quot; in both countries
            and shared a common studbook. In <strong>1966-1967</strong>, the studbooks were formally
            separated: horses born in Portugal became <strong>Lusitano</strong> (from Lusitania, the
            Roman name for Portugal) and those born in Spain became <strong>PRE</strong> (Pura Raza
            Española).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticleStatCard
              title="APSL FOUNDED"
              value="1967"
              subtitle="267 stallions + 529 foundation mares"
              highlight
            />
            <ArticleStatCard title="COUNTRIES" value="~25" subtitle="With registered Lusitanos" />
            <ArticleStatCard
              title="IN PORTUGAL"
              value="~6,000"
              subtitle="Registered mares and stallions"
              highlight
            />
          </div>

          <p className={articleTextClasses.body}>
            APSL was officially constituted in <strong>1989</strong> and obtained &quot;Public
            Utility&quot; status in 1995. It has ~400 active members. Today, approximately{" "}
            <strong>50% of the Lusitano breeding stock is outside Portugal</strong>, with
            significant presence in Brazil, the United States, Australia, France, Germany and the
            UK.
          </p>

          <p className={articleTextClasses.body}>
            Modern genetic studies have revealed that the Lusitano possesses{" "}
            <strong>9 unique haplotypes</strong> — half of the breed&apos;s haplotypes are rare
            variants. The &quot;Lusitano C&quot; group contains maternal lineages present in wild
            Iberian horses from the Early Neolithic, confirming the extraordinary genetic continuity
            of this millennial breed.
          </p>
        </ArticleSection>
      </>
    ),
    // SOURCES ARTICLE 1
    sources: [
      {
        label:
          "Jansen et al. (2002) — Mitochondrial DNA and the origins of the domestic horse, PNAS",
        url: "https://www.pnas.org/doi/10.1073/pnas.152330099",
      },
      {
        label: "Escoural Cave — Archaeological site, Montemor-o-Novo",
        url: "https://en.wikipedia.org/wiki/Escoural_Cave",
      },
      {
        label: "Lusitano — Breed history (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Lusitano",
      },
      {
        label: "Lusitano Horse Finder — History of the Lusitano",
        url: "https://lusitanohorsefinder.com/the-history-of-the-lusitano/",
      },
      {
        label: "The King's Stud: Alter Real",
        url: "https://www.lusitanostud.com/blog/2019/8/20/the-kings-stud-alter-real",
      },
      {
        label: "Parques de Sintra — Alter Stud Farm",
        url: "https://www.parquesdesintra.pt/en/parks-monuments/portuguese-school-of-equestrian-art/alter-stud-farm/",
      },
      {
        label: "Etalon DX — Breeds of the Iberian Peninsula",
        url: "https://etalondx.com/news-media/breeds-of-the-iberian-peninsula-differentiating-between-pr-es-andalusians-and-lusitanos/",
      },
      {
        label: "Wikipedia — Mangalarga Marchador",
        url: "https://en.wikipedia.org/wiki/Mangalarga_Marchador",
      },
      { label: "APSL — About the Association", url: "https://www.cavalo-lusitano.com/en/apsl" },
    ],
  },

  "2": {
    title: "Advanced Biomechanics: The Physics of Collection",
    subtitle: "Vector analysis of movement: From the lumbosacral angle to tendon elasticity.",
    description:
      "Collection in equestrian sport: biomechanical definition, hock geometry and muscle fiber biochemistry in the Lusitano Horse.",
    keywords: ["equine biomechanics", "Collection", "hock", "muscle fibers", "Lusitano"],
    date: "18 JAN 2026",
    readTime: "20 min",
    category: "Zootechnics & Physics",
    relatedSlugs: [
      "standard-apsl",
      "toricidade-selecao-combate",
      "novilheiro-rubi-revolucao-olimpica",
    ],
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

        <ArticleSection title="I. The Hock Geometry">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            The horse&apos;s hock functions as a class III lever system. Mechanical efficiency is
            determined by the <strong>resting angle</strong> and <strong>flexion capacity</strong>.
          </p>

          <div className="bg-[var(--background-secondary)] p-12 rounded-sm border border-[var(--border)] my-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[var(--gold)] text-2xl font-serif mb-4 flex items-center gap-3">
                  <CheckCircle2 size={24} />
                  Angled Hock (Lusitano)
                </h4>
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                  Functions like a <strong>pre-compressed spring</strong>. The natural angulation
                  facilitates flexion, requiring <strong>less muscular effort</strong> to collect.
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="text-[var(--foreground)] text-2xl font-serif mb-4 flex items-center gap-3">
                  <AlertTriangle size={24} className="text-yellow-500" />
                  Straight Hock (Warmblood)
                </h4>
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                  Maximizes <strong>horizontal propulsion</strong> but fights against physics to
                  collect.
                </p>
              </div>
            </div>
          </div>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1598974357801-399b2e689e95?q=80&w=1200&auto=format&fit=crop"
          alt="Horse in collected work demonstrating hock flexion"
          caption="The Lusitano's natural hock angulation facilitates collection with less muscular effort."
        />

        <ArticleSection title="II. Muscle Biochemistry: Type IIb Fibers">
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
                <strong>Maximum explosion</strong> - Present in all breeds, proportions vary
              </p>
            </div>
          </div>
        </ArticleSection>

        {/* SOURCE: APSL — croup and hindquarter conformation */}
        <ArticleSection title="III. The Lumbosacral Angle: The Engine of Collection">
          <p className={articleTextClasses.body}>
            The lumbosacral junction — the articulation between the last lumbar vertebra and the
            sacrum — is often called the <strong>&quot;engine&quot; of collection</strong>. It is at
            this point that the energy generated by the hindquarters is transmitted to the back and,
            consequently, to the entire body.
          </p>

          <ArticleInfoBox title="PELVIC FLEXION AND COLLECTION" icon={Activity}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              <strong>Pelvic flexion</strong> (pelvic tilt) is the fundamental mechanism: when the
              hindquarters advance under the center of mass, the pelvis rotates at the lumbosacral
              joint, allowing the horse to &quot;sit&quot; on its hindquarters.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-2 border-[var(--gold)]">
                <h5 className="text-[var(--gold)] font-bold mb-2">Lusitano</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Rounded and slightly oblique</strong> croup (APSL standard). This
                  conformation facilitates pelvic flexion, allowing greater natural engagement of
                  the hindquarters. The croup inclination acts as a biomechanical &quot;ramp.&quot;
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-2 border-[var(--border)]">
                <h5 className="text-[var(--foreground)] font-bold mb-2">Typical Warmblood</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Tendentially more horizontal croup, optimized for propulsion in extension.
                  Effective for extended trot and canter movements, but requires more training to
                  achieve deep collection.
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            The Lusitano&apos;s <strong>short and broad loin</strong> (APSL standard) is another
            biomechanical advantage: a short loin transmits hindquarter force with less energy loss,
            while the width provides a base for supporting musculature.
          </p>
        </ArticleSection>

        {/* SOURCE: APSL — neck standard */}
        <ArticleSection title="IV. The Neck and the Nuchal Ligament">
          <p className={articleTextClasses.body}>
            The neck is not merely an aesthetic feature — it is a{" "}
            <strong>mechanical balancer</strong> that controls the entire horse&apos;s equilibrium.
            The position and shape of the neck directly determine weight distribution between the
            forehand and hindquarters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="NUCHAL LIGAMENT" icon={Zap}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                The <strong>nuchal ligament</strong> is a passive (non-muscular) structure that
                extends from the occipital protuberance to the withers and, through the supraspinous
                ligament, along the thoracic and lumbar vertebrae.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                Its function is to <strong>support the weight of the head and neck</strong> without
                constant muscular effort. When the horse elevates the base of the neck and flexes at
                the poll, the nuchal ligament comes under tension, &quot;lifting&quot; the back — an
                essential mechanism for collection.
              </p>
            </ArticleInfoBox>

            <ArticleInfoBox title="THE LUSITANO NECK" icon={Eye}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                The APSL standard describes the neck as{" "}
                <strong>medium length, arched, with a high set-on</strong> and abundant mane. This
                conformation confers biomechanical advantages:
              </p>
              <div className="space-y-2 mt-4">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Natural arch:</strong> Allows self-carriage with less muscular effort
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>High set-on:</strong> Facilitates base elevation without
                    &quot;breaking&quot; at the 3rd cervical vertebra
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Medium length:</strong> Balance between leverage and control
                  </p>
                </div>
              </div>
            </ArticleInfoBox>
          </div>

          <ArticleWarningBox title="The False &laquo;Break&raquo;" icon={AlertTriangle}>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
              A neck that &quot;breaks&quot; at the 3rd cervical vertebra (instead of flexing at the
              poll) is a serious functional defect. The horse appears collected, but in reality the
              base of the neck is low and the back is hollowed. The Lusitano, with its naturally
              arched neck and high set-on, is less prone to this defect than breeds with a more
              horizontal neck.
            </p>
          </ArticleWarningBox>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1508669232496-137b159c1cdb?q=80&w=1200&auto=format&fit=crop"
          alt="Arched neck of horse in classical work"
          caption="The arched, high-set neck is one of the Lusitano's most distinctive biomechanical advantages."
        />

        {/* SOURCE: APSL — gaits in the standard */}
        <ArticleSection title="V. The Three Natural Gaits">
          <p className={articleTextClasses.body}>
            The APSL standard defines three gaits (walk, trot and canter), all with specific
            characteristics reflecting Lusitano biomechanics. Gait quality is a fundamental
            evaluation criterion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-[var(--gold)]">
              <h5 className="text-[var(--gold)] font-bold mb-4 text-lg">WALK</h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                <strong>4 beats</strong> — sequence: left hind → left fore → right hind → right
                fore. No suspension phase.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                In the Lusitano: <strong>agile, elevated, ample</strong>. Should cover ground with
                regularity and cadence.
              </p>
            </div>

            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-[var(--gold)]">
              <h5 className="text-[var(--gold)] font-bold mb-4 text-lg">TROT</h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                <strong>2 diagonal beats</strong> — diagonal pairs move simultaneously, with a
                suspension phase between each beat.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                In the Lusitano: <strong>elastic, ample, with good suspension</strong>. The natural
                tendency for elevation distinguishes it from the extended trot of Warmbloods.
              </p>
            </div>

            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-t-4 border-[var(--gold)]">
              <h5 className="text-[var(--gold)] font-bold mb-4 text-lg">CANTER</h5>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                <strong>3 beats + suspension</strong> — outside hind → diagonal → inside fore →
                suspension.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                In the Lusitano: <strong>smooth, elevated, well-balanced</strong>. The natural
                facility for transitions and canter pirouettes is a hallmark of the breed.
              </p>
            </div>
          </div>

          <ArticleInfoBox title="AIRS ABOVE THE GROUND" icon={Crown}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              Beyond the three basic gaits, the Lusitano is one of the few breeds capable of
              performing <strong>airs above the ground</strong> — Haute &Eacute;cole movements that
              demand extraordinary strength, balance and courage:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Levade</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Hindquarters flexed at ~35°, forelegs elevated. Sustained balance.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Courbette</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  From the levade, jumps on the hindquarters with forelegs tucked.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Capriole</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Leap with full extension of hindquarters mid-air. The most difficult movement of
                  Haute &Eacute;cole.
                </p>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        {/* SOURCE: APSL — breed aptitude */}
        <ArticleSection title="VI. Training Implications">
          <p className={articleTextClasses.body}>
            The Lusitano&apos;s conformation has direct implications for how it should be trained.
            Its biomechanical advantages — angled hock, oblique croup, arched neck, short loin — are
            natural resources that classical training seeks to develop, not create.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="THE TRAINING SCALE" icon={TrendingUp}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-4">
                The classical training scale applies to the Lusitano, but with a particularity:
                collection appears earlier in the progression thanks to natural predisposition.
              </p>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  1. <strong>Rhythm</strong> — regularity of gaits
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  2. <strong>Suppleness</strong> — absence of tension
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  3. <strong>Contact</strong> — elastic connection with the hand
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  4. <strong>Impulsion</strong> — hindquarter energy
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  5. <strong>Straightness</strong> — longitudinal alignment
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  6. <strong>Collection</strong> — engagement and self-carriage
                </p>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="NATURAL PSL ADVANTAGES" icon={CheckCircle2}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-4">
                The Lusitano brings innate advantages that classical training enhances:
              </p>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Early collection:</strong> Conformation facilitates hindquarter
                    engagement before many other breeds
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Cooperative temperament:</strong> The &quot;ardent but docile&quot;
                    temperament (APSL) allows intense work with good attitude
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Laterality:</strong> Natural agility for lateral movements (shoulder-in,
                    travers, renvers, half-pass)
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Pirouettes:</strong> The oblique croup and angled hock facilitate canter
                    pirouettes with less effort
                  </p>
                </div>
              </div>
            </ArticleInfoBox>
          </div>
        </ArticleSection>
      </>
    ),
    // SOURCES ARTICLE 2
    sources: [
      {
        label: "APSL — Lusitano Breed Standard",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed",
      },
      // SOURCE: APSL — Lusitano Characteristics
      {
        label: "APSL — Lusitano Characteristics and Aptitude",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/aptitude",
      },
    ],
  },

  "3": {
    title: "The Official Standard (APSL): Judging Manual",
    description:
      "Official Lusitano Pure Blood standard: head characteristics, disqualifying defects and APSL judging criteria.",
    keywords: ["APSL", "Lusitano Standard", "morphology", "judging", "Pure Blood"],
    subtitle: "Point by point dissection of the breed standard approved by APSL.",
    date: "15 JAN 2026",
    readTime: "20 min",
    category: "Morphology & Standard",
    relatedSlugs: ["genese-cavalo-iberico", "biomecanica-reuniao", "genetica-pelagens"],
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

        <ArticleSection title="I. The Head: Mirror of the Breed">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            The Lusitano head should be{" "}
            <strong>dry, of medium length, and well proportioned</strong>. The profile should be{" "}
            <strong>subconvex</strong>.
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
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1560206381-6f05b6282e9c?q=80&w=1200&auto=format&fit=crop"
          alt="Characteristic subconvex profile of the Lusitano"
          caption="The subconvex profile, expressive eyes and fine ears are unmistakable hallmarks of the breed."
        />

        <ArticleSection title="II. Neck, Withers and Shoulder">
          <ArticleInfoBox title="NECK" icon={Eye}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
              Of <strong>medium length</strong>, arched, well set into the shoulder. The high
              insertion allows natural elevation of the neck base — essential for collection. The
              mane should be <strong>abundant and silky</strong>.
            </p>
          </ArticleInfoBox>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
              <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Withers</h4>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Well defined and extensive. Reference point for height measurement. Prominent
                withers facilitate saddle placement and indicate good back musculature.
              </p>
            </div>
            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
              <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">Shoulder</h4>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong>Long, sloping and well muscled</strong>. The angle of the shoulder
                determines stride length and freedom of the forehand. A sloping shoulder is
                essential for elevated movements.
              </p>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="III. Body: Chest, Back and Loin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="CHEST AND RIBS" icon={Shield}>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                Chest <strong>broad, deep and well muscled</strong>. Ribs should be{" "}
                <strong>well sprung and oblique</strong>, providing adequate thoracic capacity
                without compromising agility.
              </p>
            </ArticleInfoBox>
            <ArticleInfoBox title="BACK AND LOIN" icon={Activity}>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                Back <strong>well directed, tending towards horizontal</strong>. The loin should be{" "}
                <strong>short, broad and well connected</strong> to the croup — the lumbosacral
                connection is fundamental for transmitting power from the hindquarters.
              </p>
            </ArticleInfoBox>
          </div>
        </ArticleSection>

        <ArticleSection title="IV. Croup and Hindquarters">
          <p className={articleTextClasses.body}>
            The Lusitano&apos;s croup is one of its most distinctive features:{" "}
            <strong>strong, rounded, well proportioned and slightly sloping</strong>. This
            conformation, selected through bullfighting, facilitates the pelvic flexion needed for
            collection and pirouettes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticlePillarCard icon={CheckCircle2} title="Croup">
              Rounded and slightly sloping. The tail should be well set, with abundant and silky
              hair.
            </ArticlePillarCard>
            <ArticlePillarCard icon={Activity} title="Hock">
              Broad, strong and well defined. Correct angulation is essential for propulsion and
              collection ability.
            </ArticlePillarCard>
            <ArticlePillarCard icon={Zap} title="Thigh and Buttock">
              Well muscled and developed. Hindquarter strength is the engine of all equine
              locomotion.
            </ArticlePillarCard>
          </div>
        </ArticleSection>

        <ArticleSection title="V. Limbs and Conformation">
          <p className={articleTextClasses.body}>
            Limb conformation is determinant for the horse&apos;s longevity and functionality. A
            Lusitano with correct conformation better withstands the wear of work and maintains
            joint health throughout life.
          </p>

          <ArticleInfoBox title="LIMB CHARACTERISTICS" icon={CheckCircle2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Forearm</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Well muscled and proportionate
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Cannon Bones</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Short, clean, with well-defined tendons
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Joints</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Broad, clean and well defined
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Hooves</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Well formed, proportionate and hard-wearing
                  </p>
                </div>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1494947665470-20322015e3a8?q=80&w=1200&auto=format&fit=crop"
          alt="Lusitano horse in motion demonstrating conformation"
          caption="Limb quality and correct conformation are essential for the horse's longevity and functionality."
        />

        <ArticleSection title="VI. Gaits and Temperament">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticleStatCard
              title="WALK"
              value="4 Beats"
              subtitle="Agile, elevated and ample"
              highlight
            />
            <ArticleStatCard title="TROT" value="2 Beats" subtitle="Elastic, with suspension" />
            <ArticleStatCard
              title="CANTER"
              value="3 Beats"
              subtitle="Smooth, elevated, balanced"
              highlight
            />
          </div>

          <p className={articleTextClasses.body}>
            The Lusitano&apos;s gaits are distinguished by their <strong>elevation</strong> and{" "}
            <strong>cadence</strong>. The natural tendency towards collection — inherited from
            bullfighting selection — makes the Lusitano especially suited for High School and
            competitive Dressage.
          </p>

          <ArticleInfoBox title="IDEAL TEMPERAMENT" icon={Heart}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed">
              <strong>Noble, generous, ardent yet docile.</strong> The Lusitano should demonstrate
              willingness to work and learn, while always maintaining composure and connection with
              the rider. The natural aptitude for High School and airs above the ground (levade,
              courbette, capriole) is a distinctive breed characteristic, preserved by the
              Portuguese School of Equestrian Art.
            </p>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleSection title="VII. Disqualifying Defects">
          <ArticleWarningBox title="DEFECTS THAT PREVENT REGISTRATION" icon={AlertTriangle}>
            <ul className="space-y-3 text-[var(--foreground-secondary)]">
              <li>• Severe prognathism or retrognathism</li>
              <li>• Cryptorchidism (males)</li>
              <li>• Coat colors not recognized by APSL</li>
              <li>• Height below 1.60m (males) or 1.55m (females) at 6 years</li>
              <li>• Severe limb or conformation deformities</li>
              <li>• Temperament defects that compromise functionality</li>
            </ul>
          </ArticleWarningBox>
        </ArticleSection>
      </>
    ),
    // SOURCES ARTICLE 3
    sources: [
      {
        label: "APSL — Official Lusitano Breed Standard",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed",
      },
      {
        label: "US Lusitano Association — Lusitano Breed Standard",
        url: "https://www.uslusitano.org/index.php/apsl-2/apsl-information/lusitano-breed-standard",
      },
    ],
  },

  // ARTICLE 4 — VERIFIED 2026-02-24
  // SOURCE: UC Davis VGL https://vgl.ucdavis.edu/test/cream
  // SOURCE: APSL https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed
  "4": {
    title: "The Science of Colors: Coat Genetics in PSL",
    description:
      "Equine coat genetics: Extension Locus, Agouti, Cream Dilution and coat colors recognized by APSL in the Lusitano Horse.",
    keywords: [
      "equine genetics",
      "coat colors",
      "Extension Locus",
      "Agouti",
      "Cream Dilution",
      "APSL",
    ],
    subtitle:
      "Extension Locus, Agouti, Cream Dilution, the Grey gene and rare coat colors of the PSL.",
    date: "12 JAN 2026",
    readTime: "20 min",
    category: "Genetics & Coat Colors",
    relatedSlugs: ["genese-cavalo-iberico", "standard-apsl", "novilheiro-rubi-revolucao-olimpica"],
    image:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>E</span>
          quine coat genetics is fascinating and complex. In the Lusitano Horse, we find a great
          variety of colors, all determined by the interaction of multiple genes.
        </p>

        <ArticleSection title="I. The Fundamental Genes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-black">
              <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">
                Extension Locus (E)
              </h4>
              <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                Controls black pigment (eumelanin) production.
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
                <strong>A/A or A/a:</strong> Black restricted to points (bay)
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                <strong>a/a:</strong> Uniform black
              </p>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="II. Lusitano Base Coat Colors">
          <div className="bg-[var(--background-card)] border-l-4 border-[var(--gold)] p-10 my-12 rounded-sm">
            <h4 className="text-[var(--gold)] font-bold text-2xl mb-6">
              Coat Colors Recognized by APSL
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-[var(--background)]/40 p-6 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-zinc-400 border border-zinc-300 mb-4"></div>
                <h5 className="text-[var(--foreground)] font-bold mb-2">Grey</h5>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Progressive whitening. The most common PSL coat color.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-amber-800 border border-amber-700 mb-4"></div>
                <h5 className="text-[var(--foreground)] font-bold mb-2">Bay</h5>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Bay body with black points.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-[var(--background-card)] border border-[var(--border)] mb-4"></div>
                <h5 className="text-[var(--foreground)] font-bold mb-2">Black</h5>
                <p className="text-sm text-[var(--foreground-secondary)]">Uniform black coat.</p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-amber-600 border border-amber-500 mb-4"></div>
                <h5 className="text-[var(--foreground)] font-bold mb-2">Chestnut</h5>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Reddish coat without black (e/e genotype).
                </p>
              </div>
            </div>
          </div>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop"
          alt="Bay horse demonstrating the Agouti gene expression"
          caption="The bay coat — the most common in the Lusitano — results from the combination of the Extension gene with the Agouti gene."
        />

        <ArticleSection title="III. Cream Dilution">
          <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8">
            The <strong>Cream</strong> gene (CR locus, SLC45A2 gene) is responsible for diluting
            base coat colors, creating lighter shades. A single copy of the Cream allele (CR/N)
            produces partial dilution; two copies (CR/CR) produce intense dilution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="SINGLE DOSE (CR/N)" icon={Dna}>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Palomino</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Chestnut + Cream → golden body, white mane
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Buckskin</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Bay + Cream → golden body, black points
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Smoky Black</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Black + Cream → slightly diluted black
                  </p>
                </div>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="DOUBLE DOSE (CR/CR)" icon={Dna}>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Cremello</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Chestnut + 2×Cream → nearly white coat, blue eyes
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Perlino</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Bay + 2×Cream → light cream, slightly darker points
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Smoky Cream</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Black + 2×Cream → light cream, similar to perlino
                  </p>
                </div>
              </div>
            </ArticleInfoBox>
          </div>
        </ArticleSection>

        {/* SOURCE: Nature Communications 2024 — https://www.nature.com/articles/s41467-024-45618-x */}
        {/* SOURCE: UC Davis VGL — https://vgl.ucdavis.edu/news/new-study-identifies-distinct-gray-alleles-contributing-difference-rate-depigmentation */}
        <ArticleSection title="IV. The Grey Gene (STX17): The Dominant Coat Color">
          <p className={articleTextClasses.body}>
            Grey is the most emblematic and most common coat color in the Lusitano, representing
            approximately <strong>59% of all horses registered with the APSL</strong>. The
            responsible gene is <strong>Grey (G)</strong>, located in the STX17 (Syntaxin 17) gene
            on chromosome 25. It is a <strong>4.6 kb duplication in intron 6</strong> of STX17, with
            autosomal dominant inheritance — a single copy is sufficient for the horse to be grey.
          </p>

          <p className={articleTextClasses.body}>
            Grey horses are not born white. All grey horses are born with a base coat color (bay,
            black, chestnut) that progressively whitens throughout life. This process results from
            premature migration of melanocytes from hair follicles, leading to gradual loss of
            pigmentation.
          </p>

          <ArticleInfoBox title="2024 Discovery: Two Distinct Alleles" icon={Microscope}>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-4">
              In 2024, a team led by <strong>Dr. Leif Andersson</strong> (Uppsala University and UC
              Davis) published in <em>Nature Communications</em> the discovery that there are two
              distinct Grey alleles, with very different consequences:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-2 border-green-600">
                <h5 className="text-green-400 font-bold mb-2">G2 (2 copies of the duplication)</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Slow and gradual</strong> depigmentation.{" "}
                  <strong>Significantly lower</strong> melanoma risk. Preferable for breeding.
                </p>
              </div>
              <div className="bg-[var(--background)]/40 p-6 rounded-sm border-l-2 border-red-600">
                <h5 className="text-red-400 font-bold mb-2">G3 (3 copies of the duplication)</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Rapid and early</strong> depigmentation.{" "}
                  <strong>Significantly higher</strong> melanoma risk. Requires caution in breeding.
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <ArticleWarningBox title="Melanoma in Grey Horses" icon={AlertTriangle}>
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
              It is estimated that approximately{" "}
              <strong>80% of grey horses over 15 years of age</strong> develop cutaneous melanomas.
              Although often benign in early stages, they can become invasive. The discovery of G2
              and G3 alleles is crucial for responsible breeding: by testing breeding stock,
              breeders can select for the G2 allele (low risk) and significantly reduce melanoma
              incidence in future generations.
            </p>
          </ArticleWarningBox>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop"
          alt="Light-coated horse showing the effect of progressive greying"
          caption="The Grey gene is responsible for the progressive lightening of the coat throughout the horse's life."
        />

        {/* SOURCE: UC Davis VGL Pearl — https://vgl.ucdavis.edu/test/pearl */}
        {/* SOURCE: Horseman's News — https://horsemansnews.com/iberian-horse-colors-101/ */}
        {/* SOURCE: UC Davis VGL Dun — https://vgl.ucdavis.edu/test/dun-horse */}
        <ArticleSection title="V. Rare Genes in the Lusitano">
          <p className={articleTextClasses.body}>
            Beyond common coat colors, the Lusitano carries several rare genes that produce unusual
            phenotypes. Some are exclusive to Iberian breeds, reflecting the unique genetic history
            of this lineage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="Pearl (SLC45A2)" icon={Dna}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                A <strong>recessive</strong> gene located in the same gene as Cream (SLC45A2,
                mutation c.985G&gt;A). Found in Lusitanos, PRE, Quarter Horses and Paint Horses —
                breeds with Iberian ancestry.
              </p>
              <div className="space-y-2 mt-4">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Homozygous (prl/prl):</strong> Pale apricot coat, light skin
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>Pearl + Cream (prl/CR):</strong> Pseudo-double dilution — pink skin,
                    blue or green eyes, phenotype similar to Cream double dilution
                  </p>
                </div>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="Silver (PMEL17)" icon={Eye}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                A <strong>dominant</strong> gene that only affects black pigment (eumelanin),
                diluting it to a chocolate or grey tone. The mane and tail become silver (flaxen).
                Confirmed by DNA testing in Lusitanos.
              </p>
              <div className="space-y-2 mt-4">
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>On black base:</strong> Dark chocolate body, silver mane
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    <strong>On bay base:</strong> Subtle effect on points
                  </p>
                </div>
              </div>
            </ArticleInfoBox>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="Roan & Rabicano" icon={Feather}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                <strong>Classic Roan</strong> (dominant) has been confirmed in Lusitanos, producing
                a uniform mixture of white and colored hairs across the body while maintaining the
                head and lower legs in the original color.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                <strong>Rabicano</strong> is a limited roaning pattern on the belly, flanks and tail
                base, confirmed in Iberian horses. It is not the same gene as Classic Roan.
              </p>
            </ArticleInfoBox>

            <ArticleWarningBox title="Dun: The Iberian Myth" icon={AlertTriangle}>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                The <strong>true Dun gene does NOT exist</strong> in Iberian horses. It has never
                been confirmed by DNA testing in Lusitano or PRE.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                The leg bars and dorsal stripes frequently seen in Iberian horses are caused by the
                <strong> Non-Dun1 (nd1)</strong> allele, an ancestor of Non-Dun2 (nd2). The nd1
                allele preserves primitive markings (countershading) without the true dilution of
                the Dun gene (D).
              </p>
            </ArticleWarningBox>
          </div>
        </ArticleSection>

        {/* SOURCE: UC Davis VGL — https://vgl.ucdavis.edu/tests */}
        <ArticleSection title="VI. Genetic Testing and Breeding Strategies">
          <p className={articleTextClasses.body}>
            Advances in molecular genetics now allow breeders to test breeding stock for virtually
            all known coat color genes. For Lusitano breeders, these tests are essential tools for
            informed decision-making.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <ArticleStatCard
              title="UC Davis VGL"
              value="Full Panel"
              subtitle="Reference laboratory"
              description={
                <span>
                  Tests for Extension, Agouti, Cream, Pearl, Grey (G2/G3), Silver, Dun, Roan and
                  many more. World reference in equine genetics.
                </span>
              }
              highlight
            />
            <ArticleStatCard
              title="Etalon DX"
              value="Breed & Color"
              subtitle="Genetic composition"
              description={
                <span>
                  DNA breed composition test and coat color panel. Useful for verifying purity and
                  identifying rare genes.
                </span>
              }
            />
            <ArticleStatCard
              title="Animal Genetics"
              value="Panels"
              subtitle="Individual tests"
              description={
                <span>
                  Individual and panel tests for coat color genes, including Pearl and Silver common
                  in Iberian breeds.
                </span>
              }
            />
          </div>

          <ArticleInfoBox title="Strategies for Breeders" icon={Target}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Grey Gene: Test G2 vs G3
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Select breeding stock with the G2 allele (slow depigmentation, lower melanoma
                  risk) over G3 (rapid depigmentation, higher risk). Testing is available at UC
                  Davis VGL.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Pearl and Cream: The Interaction
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Both genes reside in the SLC45A2 locus. A horse carrying Pearl (prl/N) and Cream
                  (CR/N) displays pseudo-double dilution. Testing for both prevents phenotypic
                  surprises.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Dun: Don&apos;t Waste Time
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  If a Lusitano shows leg bars or a dorsal stripe, it is nd1 (countershading), not
                  Dun. Testing for Dun in Iberian horses is unnecessary — the D allele has never
                  been found in these breeds.
                </p>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>
      </>
    ),
    // SOURCES ARTICLE 4
    sources: [
      { label: "UC Davis VGL — Cream Dilution Gene", url: "https://vgl.ucdavis.edu/test/cream" },
      {
        label: "APSL — Lusitano Coat Colors",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed",
      },
      // SOURCE: Nature Communications 2024 — Andersson et al., Grey alleles G2/G3
      {
        label: "Nature Communications 2024 — Grey Alleles G2/G3",
        url: "https://www.nature.com/articles/s41467-024-45618-x",
      },
      // SOURCE: UC Davis VGL — Grey Alleles Study
      {
        label: "UC Davis VGL — Grey Alleles in Horses",
        url: "https://vgl.ucdavis.edu/news/new-study-identifies-distinct-gray-alleles-contributing-difference-rate-depigmentation",
      },
      // SOURCE: UC Davis VGL — Pearl
      { label: "UC Davis VGL — Pearl Gene", url: "https://vgl.ucdavis.edu/test/pearl" },
      // SOURCE: UC Davis VGL — Dun
      { label: "UC Davis VGL — Dun Gene", url: "https://vgl.ucdavis.edu/test/dun-horse" },
      // SOURCE: Horseman's News — Iberian Horse Colors 101
      {
        label: "Horseman's News — Iberian Horse Colors 101",
        url: "https://horsemansnews.com/iberian-horse-colors-101/",
      },
    ],
  },

  "5": {
    title: "Bullfighting Aptitude: Selection Through Combat",
    subtitle: "How Tauromachy shaped the Lusitano's psyche.",
    description:
      "Bullfighting aptitude: bravery, tactical intelligence, controlled explosion and willingness to please in the Lusitano Horse.",
    keywords: ["bullfighting aptitude", "tauromachy", "Lusitano temperament", "equine bravery"],
    date: "08 JAN 2026",
    readTime: "15 min",
    category: "Functionality & Temperament",
    relatedSlugs: [
      "genese-cavalo-iberico",
      "biomecanica-reuniao",
      "novilheiro-rubi-revolucao-olimpica",
    ],
    image:
      "https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>B</span>
          ullfighting aptitude is the set of psychological and physical characteristics that allow a
          horse to work facing a brave bull. It is the trait that most distinguishes the Lusitano
          from every other horse breed in the world — and it is the result of centuries of selection
          through the most demanding of tests: survival in the arena.
        </p>

        <ArticleSection title="I. The Pillars of Bullfighting Aptitude">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticlePillarCard icon={Flame} title="Bravery">
              The ability to face danger without hesitation. A <strong>controlled courage</strong> —
              not the blindness of attack, but the steadfastness of one who knows the risk and
              advances.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Brain} title="Tactical Intelligence">
              The horse must <strong>anticipate</strong> the bull&apos;s movements, reacting before
              the charge — a cognitive ability that requires centuries of selection.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Zap} title="Controlled Explosion">
              Instant acceleration from a standstill. The transition from halt to full gallop must
              be near-instantaneous — a matter of life or death in the arena.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Award} title="Willingness to Please">
              Maintains the <strong>connection with the rider</strong> even under extreme stress.
              The horse never &quot;disconnects&quot; from its rider, even with a bull mere metres
              away.
            </ArticlePillarCard>
          </div>
        </ArticleSection>

        <ArticleSection title="II. Portuguese Bullfighting: Tradition and Difference">
          <p className={articleTextClasses.body}>
            Portuguese bullfighting is fundamentally different from the Spanish corrida. In
            Portugal, the <strong>cavaleiro</strong> (mounted bullfighter) is the protagonist — he
            works the bull on horseback throughout the entire fight, and the bull is{" "}
            <strong>not killed in the arena</strong> (banned since 1928). The Portuguese bullfight
            is, above all, a demonstration of <strong>supreme horsemanship</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="PORTUGAL" icon={Shield}>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Protagonist:</strong> The cavaleiro and the horse
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Horse:</strong> Always present, continuous work
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Bull:</strong> Not killed in the arena
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Focus:</strong> Equestrian art and the horse&apos;s bravery
                </p>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="SPAIN (REJONEADOR)" icon={Swords}>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Protagonist:</strong> The matador (on foot) or rejoneador (mounted)
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Horse:</strong> Present only in the tercio de varas (picadors)
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Bull:</strong> Killed in the arena in traditional corrida
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Focus:</strong> Man-versus-bull confrontation
                </p>
              </div>
            </ArticleInfoBox>
          </div>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop"
          alt="Lusitano horse in working context with bull"
          caption="Portuguese bullfighting demands agility, courage, and absolute trust between horse and rider."
        />

        <ArticleSection title="III. The Role of the Horse in the Arena">
          <p className={articleTextClasses.body}>
            In Portuguese bullfighting, the horse is a <strong>co-protagonist</strong> — the
            audience judges both the cavaleiro and the horse. The horse must perform a complex
            repertoire of movements with millimetre precision, while dealing with the presence of a
            brave bull metres away.
          </p>

          <ArticleInfoBox title="REQUIRED MOVEMENTS" icon={Target}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Pirouettes</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Rotations on the haunches to evade the bull&apos;s charge
                  </p>
                </div>
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Lateral Movements</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Sideways movements to position the cavaleiro in relation to the bull
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-l-2 border-[var(--gold)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">Starts and Stops</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    Instantaneous transitions — the difference between safety and danger
                  </p>
                </div>
                <div className="border-l-2 border-[var(--border)] pl-4">
                  <h5 className="text-[var(--foreground)] font-bold mb-1">One-Handed Work</h5>
                  <p className="text-[var(--foreground-secondary)] text-sm">
                    The cavaleiro holds the banderillas in one hand, controlling the horse with only
                    the other
                  </p>
                </div>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            The horse must &quot;read&quot; the bull — anticipate charges, dodge at the last moment,
            and maintain composure when the bull is centimetres away. This ability to
            &quot;read&quot; is not trainable — it is a genetic aptitude that has been selected over
            centuries.
          </p>
        </ArticleSection>

        <ArticleSection title="IV. Selection and Evaluation by APSL">
          <p className={articleTextClasses.body}>
            <strong>Functionality</strong> is a fundamental pillar of the Lusitano standard. While
            other Iberian breeds have lost this emphasis, Portugal maintained the{" "}
            <strong>&quot;Iberian Factor&quot;</strong> — selection for bullfighting and working
            functionality.
          </p>

          <p className={articleTextClasses.body}>
            APSL evaluates temperament as an integral part of morphological classification. An ideal
            Lusitano must be: <strong>noble</strong>, <strong>generous</strong>,{" "}
            <strong>ardent yet docile</strong>. Selection through bullfighting directly shaped the
            horse&apos;s conformation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticlePillarCard icon={Activity} title="Oblique Croup">
              Facilitates quick pirouettes — essential for evading bull charges.
            </ArticlePillarCard>

            <ArticlePillarCard icon={CheckCircle2} title="Angled Hock">
              Enables explosive starts from a standstill.
            </ArticlePillarCard>

            <ArticlePillarCard icon={Eye} title="Arched Neck">
              Provides natural balance and facilitates collection under pressure.
            </ArticlePillarCard>
          </div>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop"
          alt="Lusitano horse performing classical dressage"
          caption="The qualities selected through bullfighting — agility, natural collection, and temperament — are the same that shine in modern sport."
        />

        <ArticleSection title="V. From the Arena to Modern Sport">
          <p className={articleTextClasses.body}>
            The same qualities selected through bullfighting over centuries are precisely what make
            the Lusitano an exceptional sport horse:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="FROM BULLFIGHTING TO DRESSAGE" icon={Trophy}>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Arena pirouettes</strong> → Grand Prix pirouettes
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Collection under stress</strong> → Collection in the test
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Responsiveness</strong> → Obedience to the aids
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Controlled courage</strong> → Presence and expression
                </p>
              </div>
            </ArticleInfoBox>

            <ArticleInfoBox title="FROM BULLFIGHTING TO WORKING EQUITATION" icon={Star}>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Arena agility</strong> → Obstacle agility
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Reading the bull</strong> → Reading cattle
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Courage</strong> → Confidence in new situations
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong>Rider-horse bond</strong> → Total partnership
                </p>
              </div>
            </ArticleInfoBox>
          </div>

          <p className={articleTextClasses.body}>
            The temperament <strong>&quot;ardent yet docile&quot;</strong> — seemingly contradictory
            — is the essence of the Lusitano. The horse that faces a bull with bravery is the same
            one that lets a beginner ride with gentleness. This unique versatility, forged in the
            arena, is the greatest legacy of bullfighting aptitude.
          </p>
        </ArticleSection>
      </>
    ),
    // SOURCES ARTICLE 5
    sources: [
      {
        label: "APSL — Breed Aptitude and Temperament",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/lusitano-horse-breed",
      },
      {
        label: "Wikipedia — Portuguese-style Bullfighting",
        url: "https://en.wikipedia.org/wiki/Portuguese-style_bullfighting",
      },
      {
        label: "USLA — History of the Lusitano",
        url: "https://uslusitano.org/index.php/usla/lusitano-info/history-j",
      },
    ],
  },

  // ARTICLE 6 — VERIFIED 2026-02-24
  // SOURCE: Eurodressage https://www.eurodressage.com/2012/09/30/goncalo-carvalho-and-rubi-danced-stars-2012-olympic-games
  // SOURCE: Horse & Hound https://www.horseandhound.co.uk/archives/in-praise-of-the-lusitano-48487
  // SOURCE: Team Rubi https://www.teamrubi.com/horses/rubi-ar/
  // SOURCE: Lusitano Horse Finder https://lusitanohorsefinder.com/manuel-borba-veiga/
  // SOURCE: Rimondo https://www.rimondo.com/en/horse-details/476091/novilheiro
  // SOURCE: Interagro Lusitanos https://lusitano-interagro.com/three-main-lines/
  // SOURCE: Superior Equine Sires https://www.superiorequinesires.com/rubi-alter-real/
  "6": {
    title: "From Novilheiro to Rubi: The International Revolution",
    description:
      "Novilheiro and Rubi AR: the Lusitano Horse revolution in international equestrian sport, from Show Jumping to the London 2012 Olympics.",
    keywords: [
      "Novilheiro",
      "Rubi AR",
      "Dressage",
      "FEI",
      "Olympics",
      "Lusitano",
      "Gonçalo Carvalho",
    ],
    subtitle: "How the Lusitano proved its worth at the highest level of equestrian sport.",
    date: "02 JAN 2026",
    readTime: "25 min",
    category: "Sport & Competition",
    relatedSlugs: ["biomecanica-reuniao", "toricidade-selecao-combate", "genetica-pelagens"],
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className={articleTextClasses.lead}>
          <span className={articleTextClasses.dropCap}>F</span>
          or decades, the Lusitano Horse was considered &quot;unsuitable&quot; for high-level
          equestrian competition. The breed, associated with bullfighting and working riding, was
          viewed with scepticism in international circuits dominated by Warmbloods. A series of
          extraordinary horses — from <strong>Novilheiro</strong> in Show Jumping to{" "}
          <strong>Rubi AR</strong> in Olympic Dressage, from <strong>Guizo</strong> in Athens to{" "}
          <strong>Fogoso</strong> in Tokyo — proved them all wrong. This is the story of the
          Lusitano&apos;s international revolution.
        </p>

        <ArticleSection title="I. The Pioneer: Novilheiro">
          <p className={articleTextClasses.body}>
            <strong>Novilheiro (MV)</strong>, born in 1971, was bred by{" "}
            <strong>Manuel Veiga</strong> at his stud in Golegã, Portugal. By the Andrade stallion{" "}
            <strong>Firme (SA)</strong> out of the Veiga mare <strong>Guerrita (MV)</strong>,
            Novilheiro became the first Lusitano to prove the breed could compete at the highest
            international level — and he did so across multiple disciplines.
          </p>

          <ArticleInfoBox title="MULTI-DISCIPLINE CAREER" icon={Trophy}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Bullfighting</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Started his career in bullfighting in Portugal, showcasing the breed&apos;s
                  characteristic versatility.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Grand Prix Dressage</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Trained to Grand Prix level by Jean-Philippe Giacomini, a student of Nuno
                  Oliveira.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">Eventing</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Competed in Eventing with Rachel Bayliss in the UK.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">Show Jumping — John Whitaker</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  With John Whitaker, went from Foxhunter to Grade A in a single season. Won at
                  Dublin, Wembley, Toronto, Amsterdam, Brussels and Hickstead. In 1983 he ranked
                  12th in the worldwide Top Twenty prize-money standings.
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            Novilheiro stood at stud at Meretown Stud (Shropshire), owned by Johanna Vardon, before
            returning to Portugal in 1987. His son <strong>Crown Cornelian</strong> went on to
            become a successful sire in Show Jumping and Eventing in the UK. Novilheiro remains the
            only Lusitano to have competed at the highest level of international Show Jumping.
          </p>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop"
          alt="Horse competing in show jumping"
          caption="Novilheiro opened the doors of international sport for the Lusitano in the 1980s, competing at the highest level of Show Jumping."
        />

        <ArticleSection title="II. The First Olympian: Guizo">
          <p className={articleTextClasses.body}>
            Before Rubi AR, there was <strong>Guizo</strong> — the Lusitano that opened the doors of
            the Olympic Games for the breed. Born in 1988, by <strong>Zasebande</strong> out of{" "}
            <strong>Cataria</strong> (by Tivoli), Guizo was bred by the{" "}
            <strong>Eugénio de Almeida Foundation</strong> and competed for Spain with rider{" "}
            <strong>Juan Antonio Jimenez Cobo</strong>.
          </p>

          <ArticleInfoBox title="OLYMPIC AND INTERNATIONAL RECORD" icon={Award}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">Sydney 2000</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  First Lusitano to compete at the modern Olympic Games in Dressage. Qualified via
                  3rd place at the Spanish National Championships.
                </p>
              </div>
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">
                  Athens 2004 — Team Silver Medal
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  The highest Olympic distinction ever achieved with a Lusitano horse. Guizo was
                  part of the Spanish team that won the silver medal.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">WEG 2002 (Jerez)</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Team Bronze at the World Equestrian Games.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Europeans 2003 (Hickstead)
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  Team Silver at the European Championships.
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            Guizo&apos;s silver medal in Athens remains, to this day, the highest Olympic
            classification ever achieved by a Lusitano horse. The fact that he competed for Spain —
            not Portugal — is a historical detail that underlines how Lusitano excellence transcends
            borders.
          </p>
        </ArticleSection>

        <ArticleSection title="III. Rubi AR: The Ambassador">
          <p className={articleTextClasses.body}>
            <strong>Rubi AR</strong>, born in 1998 at the <strong>Coudelaria de Alter</strong>, by{" "}
            <strong>Batial AR</strong> out of <strong>He-Xila</strong> (by Xaquiro). Ridden by{" "}
            <strong>Gonçalo Carvalho</strong>, Rubi AR took Portugal to the{" "}
            <strong>London 2012 Olympics</strong> and became the most influential Lusitano sire in
            the history of Dressage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticleStatCard
              title="OLYMPIC FREESTYLE"
              value="77.6%"
              subtitle="London 2012"
              highlight
            />
            <ArticleStatCard title="FEI RANKING" value="19th" subtitle="Best world ranking" />
            <ArticleStatCard
              title="WBFSH SIRES"
              value="#17"
              subtitle="Sire ranking 2023"
              highlight
            />
          </div>

          <ArticleInfoBox title="OLYMPIC RESULTS — LONDON 2012" icon={Award}>
            <ul className="space-y-3 text-[var(--foreground-secondary)]">
              <li>
                • <strong>Grand Prix:</strong> 74.222% — 16th place
              </li>
              <li>
                • <strong>Freestyle (Kür):</strong> 77.607% — qualified for final
              </li>
              <li>
                • <strong>Career best Freestyle:</strong> 78.150% (CDI 3* Vilamoura 2012)
              </li>
            </ul>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            Rubi AR competed at the World Equestrian Games in Kentucky (2010), the European
            Championships in Rotterdam (2011) and Herning (2013). After retiring from sport, he
            became the highest-ranked Iberian stallion ever on the WBFSH Dressage sire rankings:{" "}
            <strong>17th place in 2023</strong>. Two of his sons — <strong>Fenix de Tineo</strong>{" "}
            and <strong>Coroado</strong> — competed at the highest level, with Coroado being the
            first Lusitano to exceed 80% in a Kür.
          </p>

          <ArticleInfoBox
            title="LUSITANOS IN WBFSH TOP 100 DRESSAGE SIRES (2023)"
            icon={TrendingUp}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--gold)]">#17</strong> — Rubi AR
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#28</strong> — Rico
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#64</strong> — Viheste
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#73</strong> — Soberano
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#76</strong> — Spartacus
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#92</strong> — Altivo
                </p>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  <strong className="text-[var(--foreground)]">#93</strong> — Riopele
                </p>
              </div>
            </div>
            <p className="text-[var(--foreground-muted)] text-xs mt-4">
              7 Lusitanos in the world Top 100 — the breed reached 6th in the WBFSH Dressage breed
              ranking in 2020.
            </p>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleSection title="IV. Beijing 2008: The Second Most Represented Breed">
          <p className={articleTextClasses.body}>
            The 2008 Beijing Olympics marked a turning point. For the first time, Portugal sent a
            Dressage team entirely mounted on Lusitanos: <strong>Miguel Ralão</strong> with Oxalis
            da Meia Lua, <strong>Carlos Pinto</strong> with Notavel JCL Puy du Fou, and{" "}
            <strong>Daniel Pinto</strong> with Galopin de La Font.
          </p>

          <p className={articleTextClasses.body}>
            Brazil followed suit, with an all-Lusitano team: Nilo V.O., Samba and Oceano do Top.
            Australia brought <strong>Relâmpago do Retiro</strong>. In total, the Lusitano was the{" "}
            <strong>second most represented breed</strong> at the Beijing Games — a remarkable
            achievement for a breed that, just two decades earlier, was virtually unknown in
            Dressage circuits.
          </p>
        </ArticleSection>

        <ArticleSection title="V. Tokyo 2021: The Historic Record">
          <p className={articleTextClasses.body}>
            The Tokyo 2021 Olympics were the pinnacle of the Lusitano in international Dressage. For
            the first time in history, Portugal qualified a <strong>complete team</strong> for
            Olympic Dressage — and all three horses were Lusitanos.
          </p>

          <ArticleInfoBox title="PORTUGUESE TEAM — TOKYO 2021" icon={Globe}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">
                  Rodrigo Torres &amp; Fogoso Campline
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  By Rico. GP 72.624% (17th) | GPS 74.726% (17th) |{" "}
                  <strong>Kür 78.943% (16th)</strong> — record for a Lusitano at the Olympics. Only
                  Portuguese rider to qualify for the individual final (Top 18).
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Maria Caetano &amp; Fenix de Tineo
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  By Rubi AR. GP 70.311% (27th) | GPS 68.693% (22nd). Son of Rubi AR — the first
                  time a sire had two offspring qualify for the Olympics in Dressage.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  João Torräo &amp; Equador MVL
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  By Quo Vadis. GP 70.186% (29th) | GPS 68.298% (23rd).
                </p>
              </div>
            </div>
          </ArticleInfoBox>

          <p className={articleTextClasses.body}>
            The Portuguese team finished <strong>7th</strong> in the team final (out of 8 nations).
            Brazil was also represented by <strong>João Victor Oliva</strong> and Escorial Campline
            (by Spartacus).
          </p>

          <ArticleWarningBox title="IN MEMORIAM: EQUADOR MVL (2009–2022)" icon={Heart}>
            <p className="text-[var(--foreground-secondary)] leading-relaxed">
              Equador MVL, bred by Coudelaria Monte Velho (by Quo Vadis × Que Há/Hostil), passed
              away on May 2, 2022, aged 13, following a cervical injury after emergency surgery in
              France. He held the Portuguese national records for GP (77.348%) and GPS (79%+). His
              premature loss was felt across the entire equestrian community.
            </p>
          </ArticleWarningBox>
        </ArticleSection>

        <ArticleImage
          src="https://images.unsplash.com/photo-1558022103-603c34ab10ce?q=80&w=1200&auto=format&fit=crop"
          alt="Horse in high-level dressage competition"
          caption="The Tokyo 2021 Olympics marked a historic moment for the Lusitano, with record representation of the breed."
        />

        <ArticleSection title="VI. Working Equitation: Total Domination">
          <p className={articleTextClasses.body}>
            If in Dressage the Lusitano competes against Warmbloods, in{" "}
            <strong>Working Equitation</strong> the domination is absolute. This discipline, founded
            in 1996 by Italy, Spain, France and Portugal, promotes competition between traditional
            working riding styles. Tests include Dressage, Ease of Handling (Maneability), Speed,
            and Cattle Work.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <ArticleStatCard
              title="WORLD CHAMPIONSHIPS"
              value="5+"
              subtitle="Portugal titles"
              highlight
            />
            <ArticleStatCard title="WC 2022" value="55%" subtitle="Horses were Lusitanos" />
            <ArticleStatCard title="WC 2022" value="Top 7" subtitle="All on Lusitanos" highlight />
          </div>

          <p className={articleTextClasses.body}>
            At the 2022 World Championship (Les Herbiers, France), Portugal won by 66 points over
            Spain. The top 7 individual positions were <strong>all occupied by Lusitanos</strong>.
            Of 49 horses competing, 27 (55%) were Lusitanos.
          </p>

          <ArticleInfoBox title="LEGENDARY RIDERS" icon={Star}>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <h5 className="text-[var(--gold)] font-bold mb-1">Pedro Torres &amp; Oxidado</h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  The most decorated pair in Working Equitation history. Torres was individual
                  champion in 2000, 2004, 2008, 2009, 2010 and 2011, with multiple team titles with
                  Portugal.
                </p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4">
                <h5 className="text-[var(--foreground)] font-bold mb-1">
                  Gilberto Filipe &amp; Zinque das Lezírias
                </h5>
                <p className="text-[var(--foreground-secondary)] text-sm">
                  World champion in 2018 (Munich) and 2022 (Les Herbiers).
                </p>
              </div>
            </div>
          </ArticleInfoBox>
        </ArticleSection>

        <ArticleSection title="VII. Carriage Driving: Felix Brasseur, Double World Champion">
          <p className={articleTextClasses.body}>
            In Carriage Driving, the Lusitano achieved the rarest of feats: two world titles with
            teams entirely composed of horses of the breed. The protagonist was the Belgian driver{" "}
            <strong>Felix Brasseur</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <ArticleInfoBox title="WAREGEM 1996 — WORLD CHAMPIONSHIP" icon={Trophy}>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                <strong>Individual and team gold</strong> with 5 purebred Lusitanos: Golias,
                Favorito, Fraque (by Vidago), Fulgoso and Falcão (by Jaquetão).
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Owner: <strong>José Manuel de Mello</strong>, then president of APSL.
              </p>
            </ArticleInfoBox>

            <ArticleInfoBox title="AACHEN 2006 — WORLD EQUESTRIAN GAMES" icon={Trophy}>
              <p className="text-[var(--foreground-secondary)] text-sm mb-3">
                <strong>Individual gold</strong> with 4 Lusitanos: Odoroso, Quijote, Orpheu and
                Quo-Vadis.
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                Defeated <strong>Ijsbrand Chardon</strong> (Netherlands) for gold — one of the
                greatest drivers in history.
              </p>
            </ArticleInfoBox>
          </div>

          <p className={articleTextClasses.body}>
            Brasseur&apos;s triumphs demonstrated that the Lusitano is not merely a saddle horse:
            its intelligence, obedience and athletic ability make it a top choice in driving
            disciplines at the highest world level.
          </p>
        </ArticleSection>
      </>
    ),
    sources: [
      {
        label: "Eurodressage — Gonçalo Carvalho and Rubi at 2012 Olympics",
        url: "https://www.eurodressage.com/2012/09/30/goncalo-carvalho-and-rubi-danced-stars-2012-olympic-games",
      },
      {
        label: "Eurodressage — Guizo Passed Away (career summary)",
        url: "https://www.eurodressage.com/2006/11/26/guizo-passed-away",
      },
      {
        label: "Eurodressage — 2021 Olympic Dressage Scores",
        url: "https://eurodressage.com/2021/07/24/scores-2021-olympic-games",
      },
      {
        label: "Eurodressage — Equador MVL Passed Away",
        url: "https://eurodressage.com/2022/05/03/portuguese-olympic-team-horse-equador-passed-away",
      },
      {
        label: "Team Rubi — Rubi AR (official website)",
        url: "https://www.teamrubi.com/horses/rubi-ar/",
      },
      {
        label: "Horse & Hound — In Praise of the Lusitano (Novilheiro)",
        url: "https://www.horseandhound.co.uk/archives/in-praise-of-the-lusitano-48487",
      },
      {
        label: "Horse & Hound — Equador MVL dies aged 13",
        url: "https://www.horseandhound.co.uk/news/joao-torrao-equador-dies-786026",
      },
      {
        label: "APSL — Sport Successes: Dressage",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/dressage",
      },
      {
        label: "APSL — Sport Successes: Working Equitation",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/working-equitation",
      },
      {
        label: "APSL — Sport Successes: Carriage Driving",
        url: "https://www.cavalo-lusitano.com/en/lusitano-horse/sport-successes/carriage-driving",
      },
      {
        label: "Festival of the Iberian Horse — Top 100 Dressage Sires",
        url: "https://festivaloftheiberianhorse.co.uk/pages/the-lusitano-in-dressage-7-in-the-top-100-dressage-horses",
      },
      {
        label: "Lusitano World — Portugal Working Equitation World Champions",
        url: "https://www.lusitanoworld.com/en/blog/portugal-working-equitation-world-champions/",
      },
      {
        label: "The Horse Magazine — Lusitanos Star in Tokyo",
        url: "https://www.horsemagazine.com/thm/2021/07/lusitano-star-in-tokyo/",
      },
      { label: "Interagro Lusitanos — Driving", url: "https://lusitano-interagro.com/driving/" },
      {
        label: "Rimondo — Novilheiro (pedigree)",
        url: "https://www.rimondo.com/en/horse-details/476091/novilheiro",
      },
    ],
  },
};
