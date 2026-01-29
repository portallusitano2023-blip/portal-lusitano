import { Microscope, Dna, FlaskConical, Shield, Swords, ChevronRight, Flame, Award, Globe, Activity, CheckCircle2, AlertTriangle, Zap, Star, Brain, Beaker, Ruler, Landmark, Eye, Trophy, Crown } from "lucide-react";

// Componente para imagens ilustrativas dentro dos artigos
export const ArticleImage = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <figure className="my-12">
    <div className="relative overflow-hidden rounded-sm border border-white/10">
      <img
        src={src}
        alt={alt}
        className="w-full h-[400px] object-cover"
      />
    </div>
    {caption && (
      <figcaption className="mt-4 text-center text-sm text-zinc-500 italic">
        {caption}
      </figcaption>
    )}
  </figure>
);

// ARTIGOS EM PORTUGUES
export const articlesDataPT: Record<string, any> = {
  "1": {
    title: "Tratado Historico: A Genese do Cavalo Iberico",
    subtitle: "5000 anos de selecao continua: Do Refugio Glaciar a Gineta de Guerra. Uma tese sobre a sobrevivencia do cavalo mais influente da historia.",
    date: "25 JAN 2026",
    readTime: "120 min",
    category: "Historia & Arqueologia",
    image: "https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">A</span>
          narrativa tradicional de que o cavalo chegou a Peninsula Iberica vindo do Oriente (Teoria das Estepes) foi definitivamente refutada pela ciencia moderna. Estudos de ADN mitocondrial (Jansen et al., 2002; CIES, 2010) identificaram o <strong>Haplogrupo D1</strong> como um marcador exclusivo da Peninsula Iberica, presente em mais de 70% dos cavalos Lusitanos testados.
        </p>
        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          Isto confirma a teoria do "Refugio Glaciar". Durante o Ultimo Maximo Glacial (ha cerca de 20.000 anos), enquanto o norte da Europa estava coberto por gelo, a Peninsula Iberica manteve um microclima temperado. O <em>Equus ferus ibericus</em> nao so sobreviveu aqui, como foi domesticado localmente nas bacias do Tejo e Sado.
        </p>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-16 rounded-sm shadow-2xl">
          <h4 className="text-[#C5A059] font-bold text-2xl mb-6 flex items-center gap-3">
            <Microscope size={24} /> EVIDENCIA ARQUEOLOGICA ESTRATIFICADA
          </h4>
          <div className="space-y-6">
            <div className="border-l-2 border-zinc-700 pl-6">
              <h5 className="text-white font-bold mb-2 text-lg">Gruta do Escoural (Montemor-o-Novo)</h5>
              <p className="text-zinc-400 text-sm mb-3">Datacao: 20.000-18.000 BP (Before Present)</p>
              <p className="text-zinc-300 leading-relaxed">
                Pinturas rupestres com cavalos de perfil subconvexo, pescoco arqueado e garupa arredondada. A analise morfometrica das representacoes revela uma correspondencia de 87% com o padrao morfologico do Lusitano moderno.
              </p>
            </div>
            <div className="border-l-2 border-zinc-700 pl-6">
              <h5 className="text-white font-bold mb-2 text-lg">Concheiros de Muge (Vale do Tejo)</h5>
              <p className="text-zinc-400 text-sm mb-3">Datacao: 5.500-3.000 a.C. | Cultura Mesolitica</p>
              <p className="text-zinc-300 leading-relaxed">
                Evidencias osteologicas de cavalos domesticados encontradas em Moita do Sebastiao e Cabeco da Arruda. A analise de isotopos estaveis revelou padroes de alimentacao controlada.
              </p>
            </div>
          </div>
        </div>

        <ArticleImage
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop"
          alt="Cavalos ibericos"
          caption="Representacao artistica de cavalos ibericos primitivos"
        />

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. A Revolucao Genetica: Haplogrupos e Filogeografia</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-6">
          O estudo revolucionario de <strong>Jansen et al. (2002)</strong> sequenciou o ADN mitocondrial de 652 cavalos de 37 racas. Os resultados foram inequivocos:
        </p>

        <div className="bg-zinc-900 p-10 rounded-sm border border-white/5 my-12">
          <h4 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
            <Dna className="text-[#C5A059]" size={24} />
            Distribuicao de Haplogrupos por Regiao Geografica
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-sm border-l-4 border-[#C5A059]">
              <h5 className="text-[#C5A059] font-bold mb-2">HAPLOGRUPO D1</h5>
              <p className="text-3xl font-bold text-white mb-2">72.3%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Peninsula Iberica</p>
              <p className="text-sm text-zinc-400">
                Presente em Lusitanos, PRE, Alter Real. <strong>Ausente em todas as racas do norte europeu</strong>.
              </p>
            </div>
            <div className="bg-black/40 p-6 rounded-sm border-l-4 border-zinc-600">
              <h5 className="text-white font-bold mb-2">HAPLOGRUPO A</h5>
              <p className="text-3xl font-bold text-white mb-2">68.1%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Europa Central/Norte</p>
              <p className="text-sm text-zinc-400">Dominante em Warmbloods, Hannoverianos.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-sm border-l-4 border-zinc-600">
              <h5 className="text-white font-bold mb-2">HAPLOGRUPO B</h5>
              <p className="text-3xl font-bold text-white mb-2">51.7%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Asia Central</p>
              <p className="text-sm text-zinc-400">Presente em Arabes, Turcomanos, Akhal-Teke.</p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. A Escola de Gineta vs. A Brida</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          A morfologia do Lusitano foi esculpida por uma necessidade militar especifica: o <strong>combate de guerrilha em terreno acidentado</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
          <div className="bg-zinc-900 p-10 rounded-sm border-l-4 border-zinc-600">
            <h4 className="text-white text-2xl font-serif mb-6 flex items-center gap-3">
              <Shield size={24} className="text-zinc-500" />
              A Brida (Norte da Europa)
            </h4>
            <div className="space-y-4 mb-6">
              <p className="text-zinc-400 text-sm"><strong className="text-white">Morfologia:</strong> Cavalos pesados (600-700kg)</p>
              <p className="text-zinc-400 text-sm"><strong className="text-white">Tatica:</strong> Choque frontal em formacao cerrada</p>
            </div>
          </div>

          <div className="bg-zinc-900 p-10 rounded-sm border-l-4 border-[#C5A059] shadow-xl">
            <h4 className="text-[#C5A059] text-2xl font-serif mb-6 flex items-center gap-3">
              <Swords size={24} />
              A Gineta (Iberia)
            </h4>
            <div className="space-y-4 mb-6">
              <p className="text-zinc-300 text-sm"><strong className="text-white">Morfologia:</strong> Cavalos medios (450-550kg)</p>
              <p className="text-zinc-300 text-sm"><strong className="text-white">Tatica:</strong> Hit-and-run, falsas retiradas</p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">III. O Saque Napoleonico (1807)</h3>

        <div className="my-12 bg-gradient-to-r from-red-950/30 to-transparent p-12 rounded-sm border-l-4 border-red-800 shadow-2xl">
          <h4 className="text-red-400 text-2xl font-serif mb-6 flex items-center gap-3">
            <Flame size={28} /> A Perda Irreparavel
          </h4>
          <p className="text-zinc-300 leading-relaxed mb-6 text-lg">
            Durante as Invasoes Francesas (1807-1814), o General Junot ordenou o roubo sistematico dos melhores garanhoes da Coudelaria de Alter Real.
          </p>
          <ul className="space-y-3 text-zinc-400">
            <li><strong className="text-white">317 garanhoes</strong> registados em Alter (1807) → <strong className="text-red-400">41 sobreviventes</strong> (1814)</li>
            <li><strong className="text-white">89%</strong> das eguas reprodutoras foram abatidas</li>
          </ul>
        </div>
      </>
    )
  },

  "2": {
    title: "Biomecanica Avancada: A Fisica da Reuniao",
    subtitle: "Analise vetorial do movimento: Do angulo lombo-sacral a elasticidade tendinosa.",
    date: "18 JAN 2026",
    readTime: "110 min",
    category: "Zootecnia & Fisica",
    image: "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">N</span>
          o hipismo de alta competicao, a <strong>"Reuniao"</strong> e o Santo Graal. Definicao cientifica: <em>alteracao do equilibrio estatico e dinamico atraves do deslocamento caudal do Centro de Massa</em>.
        </p>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-12 rounded-sm shadow-2xl">
          <h4 className="text-[#C5A059] font-bold text-2xl mb-6 flex items-center gap-3">
            <Activity size={24} /> DEFINICAO BIOMECANICA FORMAL
          </h4>
          <p className="text-zinc-300 leading-relaxed text-lg mb-6">
            A <strong>Reuniao</strong> (Collection) e o resultado de:
          </p>
          <ol className="space-y-4 text-zinc-400">
            <li><strong className="text-white">1. Flexao dos Posteriores</strong> - Reducao dos angulos articulares</li>
            <li><strong className="text-white">2. Elevacao da Base do Pescoco</strong> - Ativacao muscular</li>
            <li><strong className="text-white">3. Engagement dos Abdominais</strong> - Rotacao pelvica</li>
          </ol>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. A Geometria do Jarrete</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          O jarrete do cavalo funciona como um sistema de alavancas classe III. A eficiencia mecanica e determinada pelo <strong>angulo de repouso</strong> e pela <strong>capacidade de flexao</strong>.
        </p>

        <div className="bg-zinc-900 p-12 rounded-sm border border-white/5 my-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-[#C5A059] text-2xl font-serif mb-4 flex items-center gap-3">
                <CheckCircle2 size={24} />
                Jarrete Angulado (Lusitano 142-148)
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Funciona como uma <strong>mola pre-comprimida</strong>. Permite "fechar" o jarrete com <strong>40% menos esforco muscular</strong>.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-white text-2xl font-serif mb-4 flex items-center gap-3">
                <AlertTriangle size={24} className="text-yellow-500" />
                Jarrete Reto (Warmblood 152-160)
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Maximiza a <strong>propulsao horizontal</strong> mas luta contra a fisica para reunir.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. Bioquimica Muscular: Fibras Tipo IIb</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-zinc-900 p-8 rounded-sm border-t-4 border-red-500">
            <h5 className="text-red-400 font-bold mb-4 text-lg">TIPO I (Slow Twitch)</h5>
            <p className="text-zinc-400 text-sm">Metabolismo aerobio, fadiga lenta</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-t-4 border-yellow-500">
            <h5 className="text-yellow-400 font-bold mb-4 text-lg">TIPO IIa (Fast Oxidative)</h5>
            <p className="text-zinc-400 text-sm">Metabolismo misto, fadiga moderada</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-t-4 border-[#C5A059]">
            <h5 className="text-[#C5A059] font-bold mb-4 text-lg">TIPO IIb (Fast Glycolytic)</h5>
            <p className="text-zinc-300 text-sm"><strong>Explosao maxima</strong> - Presente em Lusitanos</p>
          </div>
        </div>
      </>
    )
  },

  "3": {
    title: "O Standard Oficial (APSL): Manual de Julgamento",
    subtitle: "Disseccao ponto por ponto do padrao racial aprovado pela APSL.",
    date: "15 JAN 2026",
    readTime: "30 min",
    category: "Morfologia & Standard",
    image: "https://images.unsplash.com/photo-1447993661623-28b9c8a994a5?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">O</span>
          Standard oficial do Puro-Sangue Lusitano, mantido pela <strong>APSL</strong>, e um documento tecnico que define com precisao as caracteristicas ideais da raca.
        </p>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. A Cabeca: Espelho da Raca</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          A cabeca do Lusitano deve ser <strong>seca, de comprimento medio, e bem proporcionada</strong>. O perfil deve ser <strong>subconvexo</strong>.
        </p>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-12 rounded-sm shadow-2xl">
          <h4 className="text-[#C5A059] font-bold text-2xl mb-6 flex items-center gap-3">
            <Eye size={24} /> CARACTERISTICAS DA CABECA
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-2 border-zinc-700 pl-4">
                <h5 className="text-white font-bold mb-2">Olhos</h5>
                <p className="text-zinc-400 text-sm">Grandes, vivos, expressivos e elipticos.</p>
              </div>
              <div className="border-l-2 border-zinc-700 pl-4">
                <h5 className="text-white font-bold mb-2">Orelhas</h5>
                <p className="text-zinc-400 text-sm">Medias, finas, bem inseridas e paralelas.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-zinc-700 pl-4">
                <h5 className="text-white font-bold mb-2">Chanfro</h5>
                <p className="text-zinc-400 text-sm">Perfil subconvexo caracteristico.</p>
              </div>
              <div className="border-l-2 border-zinc-700 pl-4">
                <h5 className="text-white font-bold mb-2">Narinas</h5>
                <p className="text-zinc-400 text-sm">Amplas e flexiveis.</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. Defeitos Eliminatorios</h3>

        <div className="bg-gradient-to-r from-red-950/30 to-transparent p-10 rounded-sm border-l-4 border-red-800 my-12">
          <h4 className="text-red-400 font-bold text-xl mb-6 flex items-center gap-3">
            <AlertTriangle size={24} /> DEFEITOS QUE IMPEDEM REGISTO
          </h4>
          <ul className="space-y-3 text-zinc-300">
            <li>• Prognatismo ou retrognatismo acentuado</li>
            <li>• Criptorquidismo (machos)</li>
            <li>• Pelagens nao reconhecidas pela APSL</li>
            <li>• Altura inferior a 1,50m (machos) aos 6 anos</li>
          </ul>
        </div>
      </>
    )
  },

  "4": {
    title: "A Ciencia das Cores: Genetica de Pelagens no PSL",
    subtitle: "Locus Extension, Agouti e o gene da Diluicao Creme.",
    date: "12 JAN 2026",
    readTime: "25 min",
    category: "Genetica & Pelagens",
    image: "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">A</span>
          genetica das pelagens equinas e fascinante e complexa. No Cavalo Lusitano, encontramos uma grande variedade de cores, todas determinadas pela interacao de multiplos genes.
        </p>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. Os Genes Fundamentais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-black">
            <h4 className="text-white font-bold text-xl mb-4">Locus Extension (E)</h4>
            <p className="text-zinc-400 text-sm mb-4">Controla a producao de pigmento negro.</p>
            <p className="text-zinc-300 text-sm"><strong>E/E ou E/e:</strong> Permite pigmento negro</p>
            <p className="text-zinc-300 text-sm"><strong>e/e:</strong> Castanho (sem negro)</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-amber-700">
            <h4 className="text-white font-bold text-xl mb-4">Locus Agouti (A)</h4>
            <p className="text-zinc-400 text-sm mb-4">Distribui o pigmento negro pelo corpo.</p>
            <p className="text-zinc-300 text-sm"><strong>A/A ou A/a:</strong> Negro restrito a pontos</p>
            <p className="text-zinc-300 text-sm"><strong>a/a:</strong> Negro uniforme</p>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. Pelagens Base do Lusitano</h3>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-12 rounded-sm">
          <h4 className="text-[#C5A059] font-bold text-2xl mb-6">Pelagens Reconhecidas pela APSL</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-600 mb-4"></div>
              <h5 className="text-white font-bold mb-2">Preto</h5>
              <p className="text-sm text-zinc-400">Pelagem negra uniforme.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-amber-800 border border-amber-700 mb-4"></div>
              <h5 className="text-white font-bold mb-2">Castanho</h5>
              <p className="text-sm text-zinc-400">Corpo castanho com pontos negros.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-zinc-400 border border-zinc-300 mb-4"></div>
              <h5 className="text-white font-bold mb-2">Ruco</h5>
              <p className="text-sm text-zinc-400">Progressivo branqueamento.</p>
            </div>
          </div>
        </div>
      </>
    )
  },

  "5": {
    title: "Toricidade: A Selecao pelo Combate",
    subtitle: "Como a Tauromaquia moldou a psique do Lusitano.",
    date: "08 JAN 2026",
    readTime: "28 min",
    category: "Funcionalidade & Temperamento",
    image: "https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">A</span>
          <strong>"Toricidade"</strong> e o conjunto de caracteristicas psicologicas e fisicas que permitem a um cavalo trabalhar frente a um touro bravo.
        </p>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. Os Pilares da Toricidade</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-[#C5A059]">
            <Flame className="text-[#C5A059] mb-4" size={32} />
            <h4 className="text-white font-bold text-xl mb-4">Bravura</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A capacidade de enfrentar o perigo sem hesitacao. Uma <strong>coragem controlada</strong>.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-[#C5A059]">
            <Brain className="text-[#C5A059] mb-4" size={32} />
            <h4 className="text-white font-bold text-xl mb-4">Inteligencia Tatica</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              O cavalo deve <strong>antecipar</strong> os movimentos do touro.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-[#C5A059]">
            <Zap className="text-[#C5A059] mb-4" size={32} />
            <h4 className="text-white font-bold text-xl mb-4">Explosao Controlada</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Arranques instantaneos de 0 a 35 km/h.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-[#C5A059]">
            <Award className="text-[#C5A059] mb-4" size={32} />
            <h4 className="text-white font-bold text-xl mb-4">Vontade de Agradar</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Mantem a <strong>ligacao com o cavaleiro</strong> mesmo sob stress extremo.
            </p>
          </div>
        </div>
      </>
    )
  },

  "6": {
    title: "De Novilheiro a Rubi: A Revolucao Olimpica",
    subtitle: "A ascensao do Lusitano no ranking da FEI.",
    date: "02 JAN 2026",
    readTime: "32 min",
    category: "Desporto & Competicao",
    image: "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">D</span>
          urante decadas, o Cavalo Lusitano foi considerado "inadequado" para o Dressage de alta competicao. Tudo mudou com <strong>Novilheiro</strong>.
        </p>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. O Pioneiro: Novilheiro</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          <strong>Novilheiro</strong> (1966-1993) foi o primeiro Lusitano a competir com sucesso ao mais alto nivel internacional.
        </p>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-12 rounded-sm">
          <h4 className="text-[#C5A059] font-bold text-xl mb-6 flex items-center gap-3">
            <Trophy size={24} /> PALMARES DE NOVILHEIRO
          </h4>
          <ul className="space-y-3 text-zinc-300">
            <li>• Jogos Olimpicos Los Angeles 1984 - 4 lugar individual</li>
            <li>• Campeonato da Europa 1983 - Medalha de Bronze</li>
            <li>• Primeiro Lusitano a pontuar acima de 70% em Grand Prix</li>
          </ul>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. A Era Moderna: Rubi AR</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          <strong>Rubi AR</strong>, montado por Joao Victor Oliva, levou Portugal aos Jogos Olimpicos de Toquio 2020.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-zinc-900 p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[#C5A059] mb-2">73.4%</div>
            <p className="text-sm text-zinc-400">Melhor pontuacao GP Special</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[#C5A059] mb-2">Top 30</div>
            <p className="text-sm text-zinc-400">Ranking Mundial FEI</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[#C5A059] mb-2">2020</div>
            <p className="text-sm text-zinc-400">Jogos Olimpicos Toquio</p>
          </div>
        </div>
      </>
    )
  }
};

// ARTIGOS EM INGLES
export const articlesDataEN: Record<string, any> = {
  "1": {
    title: "Historical Treatise: The Genesis of the Iberian Horse",
    subtitle: "5000 years of continuous selection: From the Glacial Refuge to the Gineta Warfare. A thesis on the survival of history's most influential horse.",
    date: "25 JAN 2026",
    readTime: "120 min",
    category: "History & Archaeology",
    image: "https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">T</span>
          he traditional narrative that the horse arrived in the Iberian Peninsula from the East (Steppe Theory) has been definitively refuted by modern science. Mitochondrial DNA studies (Jansen et al., 2002; CIES, 2010) identified <strong>Haplogroup D1</strong> as an exclusive marker of the Iberian Peninsula, present in over 70% of Lusitano horses tested.
        </p>
        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          This confirms the "Glacial Refuge" theory. During the Last Glacial Maximum (about 20,000 years ago), while northern Europe was covered in ice, the Iberian Peninsula maintained a temperate microclimate. The <em>Equus ferus ibericus</em> not only survived here but was domesticated locally in the Tagus and Sado river basins.
        </p>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-16 rounded-sm shadow-2xl">
          <h4 className="text-[#C5A059] font-bold text-2xl mb-6 flex items-center gap-3">
            <Microscope size={24} /> STRATIFIED ARCHAEOLOGICAL EVIDENCE
          </h4>
          <div className="space-y-6">
            <div className="border-l-2 border-zinc-700 pl-6">
              <h5 className="text-white font-bold mb-2 text-lg">Escoural Cave (Montemor-o-Novo)</h5>
              <p className="text-zinc-400 text-sm mb-3">Dating: 20,000-18,000 BP (Before Present)</p>
              <p className="text-zinc-300 leading-relaxed">
                Cave paintings featuring horses with subconvex profile, arched neck and rounded croup. Morphometric analysis reveals 87% correspondence with the modern Lusitano morphological pattern.
              </p>
            </div>
            <div className="border-l-2 border-zinc-700 pl-6">
              <h5 className="text-white font-bold mb-2 text-lg">Muge Shell Middens (Tagus Valley)</h5>
              <p className="text-zinc-400 text-sm mb-3">Dating: 5,500-3,000 BC | Mesolithic Culture</p>
              <p className="text-zinc-300 leading-relaxed">
                Osteological evidence of domesticated horses found at Moita do Sebastiao and Cabeco da Arruda. Stable isotope analysis revealed controlled feeding patterns.
              </p>
            </div>
          </div>
        </div>

        <ArticleImage
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop"
          alt="Iberian horses"
          caption="Artistic representation of primitive Iberian horses"
        />

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. The Genetic Revolution: Haplogroups and Phylogeography</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-6">
          The revolutionary study by <strong>Jansen et al. (2002)</strong> sequenced the mitochondrial DNA of 652 horses from 37 breeds. The results were unequivocal:
        </p>

        <div className="bg-zinc-900 p-10 rounded-sm border border-white/5 my-12">
          <h4 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
            <Dna className="text-[#C5A059]" size={24} />
            Haplogroup Distribution by Geographic Region
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-sm border-l-4 border-[#C5A059]">
              <h5 className="text-[#C5A059] font-bold mb-2">HAPLOGROUP D1</h5>
              <p className="text-3xl font-bold text-white mb-2">72.3%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Iberian Peninsula</p>
              <p className="text-sm text-zinc-400">
                Present in Lusitanos, PRE, Alter Real. <strong>Absent in all northern European breeds</strong>.
              </p>
            </div>
            <div className="bg-black/40 p-6 rounded-sm border-l-4 border-zinc-600">
              <h5 className="text-white font-bold mb-2">HAPLOGROUP A</h5>
              <p className="text-3xl font-bold text-white mb-2">68.1%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Central/Northern Europe</p>
              <p className="text-sm text-zinc-400">Dominant in Warmbloods, Hanoverians.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-sm border-l-4 border-zinc-600">
              <h5 className="text-white font-bold mb-2">HAPLOGROUP B</h5>
              <p className="text-3xl font-bold text-white mb-2">51.7%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Central Asia</p>
              <p className="text-sm text-zinc-400">Present in Arabs, Turkomans, Akhal-Teke.</p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. The Gineta School vs. The Bridle</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          The Lusitano's morphology was sculpted by a specific military necessity: <strong>guerrilla warfare in rugged terrain</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
          <div className="bg-zinc-900 p-10 rounded-sm border-l-4 border-zinc-600">
            <h4 className="text-white text-2xl font-serif mb-6 flex items-center gap-3">
              <Shield size={24} className="text-zinc-500" />
              The Bridle (Northern Europe)
            </h4>
            <div className="space-y-4 mb-6">
              <p className="text-zinc-400 text-sm"><strong className="text-white">Morphology:</strong> Heavy horses (600-700kg)</p>
              <p className="text-zinc-400 text-sm"><strong className="text-white">Tactics:</strong> Frontal shock in tight formation</p>
            </div>
          </div>

          <div className="bg-zinc-900 p-10 rounded-sm border-l-4 border-[#C5A059] shadow-xl">
            <h4 className="text-[#C5A059] text-2xl font-serif mb-6 flex items-center gap-3">
              <Swords size={24} />
              The Gineta (Iberia)
            </h4>
            <div className="space-y-4 mb-6">
              <p className="text-zinc-300 text-sm"><strong className="text-white">Morphology:</strong> Medium horses (450-550kg)</p>
              <p className="text-zinc-300 text-sm"><strong className="text-white">Tactics:</strong> Hit-and-run, feigned retreats</p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">III. The Napoleonic Plunder (1807)</h3>

        <div className="my-12 bg-gradient-to-r from-red-950/30 to-transparent p-12 rounded-sm border-l-4 border-red-800 shadow-2xl">
          <h4 className="text-red-400 text-2xl font-serif mb-6 flex items-center gap-3">
            <Flame size={28} /> The Irreparable Loss
          </h4>
          <p className="text-zinc-300 leading-relaxed mb-6 text-lg">
            During the French Invasions (1807-1814), General Junot ordered the systematic theft of the best stallions from the Alter Real Stud.
          </p>
          <ul className="space-y-3 text-zinc-400">
            <li><strong className="text-white">317 stallions</strong> registered at Alter (1807) → <strong className="text-red-400">41 survivors</strong> (1814)</li>
            <li><strong className="text-white">89%</strong> of breeding mares were slaughtered</li>
          </ul>
        </div>
      </>
    )
  },

  "2": {
    title: "Advanced Biomechanics: The Physics of Collection",
    subtitle: "Vector analysis of movement: From the lumbosacral angle to tendon elasticity.",
    date: "18 JAN 2026",
    readTime: "110 min",
    category: "Zootechnics & Physics",
    image: "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">I</span>
          n high-level equestrian sport, <strong>"Collection"</strong> is the Holy Grail. Scientific definition: <em>alteration of static and dynamic balance through caudal displacement of the Center of Mass</em>.
        </p>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-12 rounded-sm shadow-2xl">
          <h4 className="text-[#C5A059] font-bold text-2xl mb-6 flex items-center gap-3">
            <Activity size={24} /> FORMAL BIOMECHANICAL DEFINITION
          </h4>
          <p className="text-zinc-300 leading-relaxed text-lg mb-6">
            <strong>Collection</strong> is the result of:
          </p>
          <ol className="space-y-4 text-zinc-400">
            <li><strong className="text-white">1. Hindquarter Flexion</strong> - Reduction of joint angles</li>
            <li><strong className="text-white">2. Neck Base Elevation</strong> - Muscle activation</li>
            <li><strong className="text-white">3. Abdominal Engagement</strong> - Pelvic rotation</li>
          </ol>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. The Hock Geometry</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          The horse's hock functions as a class III lever system. Mechanical efficiency is determined by the <strong>resting angle</strong> and <strong>flexion capacity</strong>.
        </p>

        <div className="bg-zinc-900 p-12 rounded-sm border border-white/5 my-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-[#C5A059] text-2xl font-serif mb-4 flex items-center gap-3">
                <CheckCircle2 size={24} />
                Angled Hock (Lusitano 142-148)
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Functions like a <strong>pre-compressed spring</strong>. Allows "closing" the hock with <strong>40% less muscular effort</strong>.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-white text-2xl font-serif mb-4 flex items-center gap-3">
                <AlertTriangle size={24} className="text-yellow-500" />
                Straight Hock (Warmblood 152-160)
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Maximizes <strong>horizontal propulsion</strong> but fights against physics to collect.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. Muscle Biochemistry: Type IIb Fibers</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-zinc-900 p-8 rounded-sm border-t-4 border-red-500">
            <h5 className="text-red-400 font-bold mb-4 text-lg">TYPE I (Slow Twitch)</h5>
            <p className="text-zinc-400 text-sm">Aerobic metabolism, slow fatigue</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-t-4 border-yellow-500">
            <h5 className="text-yellow-400 font-bold mb-4 text-lg">TYPE IIa (Fast Oxidative)</h5>
            <p className="text-zinc-400 text-sm">Mixed metabolism, moderate fatigue</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-t-4 border-[#C5A059]">
            <h5 className="text-[#C5A059] font-bold mb-4 text-lg">TYPE IIb (Fast Glycolytic)</h5>
            <p className="text-zinc-300 text-sm"><strong>Maximum explosion</strong> - Present in Lusitanos</p>
          </div>
        </div>
      </>
    )
  },

  "3": {
    title: "The Official Standard (APSL): Judging Manual",
    subtitle: "Point by point dissection of the breed standard approved by APSL.",
    date: "15 JAN 2026",
    readTime: "30 min",
    category: "Morphology & Standard",
    image: "https://images.unsplash.com/photo-1447993661623-28b9c8a994a5?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">T</span>
          he official Lusitano Pure Blood standard, maintained by <strong>APSL</strong>, is a technical document that precisely defines the ideal characteristics of the breed.
        </p>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. The Head: Mirror of the Breed</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          The Lusitano head should be <strong>dry, of medium length, and well proportioned</strong>. The profile should be <strong>subconvex</strong>.
        </p>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-12 rounded-sm shadow-2xl">
          <h4 className="text-[#C5A059] font-bold text-2xl mb-6 flex items-center gap-3">
            <Eye size={24} /> HEAD CHARACTERISTICS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-2 border-zinc-700 pl-4">
                <h5 className="text-white font-bold mb-2">Eyes</h5>
                <p className="text-zinc-400 text-sm">Large, lively, expressive and elliptical.</p>
              </div>
              <div className="border-l-2 border-zinc-700 pl-4">
                <h5 className="text-white font-bold mb-2">Ears</h5>
                <p className="text-zinc-400 text-sm">Medium, fine, well set and parallel.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-zinc-700 pl-4">
                <h5 className="text-white font-bold mb-2">Profile</h5>
                <p className="text-zinc-400 text-sm">Characteristic subconvex profile.</p>
              </div>
              <div className="border-l-2 border-zinc-700 pl-4">
                <h5 className="text-white font-bold mb-2">Nostrils</h5>
                <p className="text-zinc-400 text-sm">Wide and flexible.</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. Disqualifying Defects</h3>

        <div className="bg-gradient-to-r from-red-950/30 to-transparent p-10 rounded-sm border-l-4 border-red-800 my-12">
          <h4 className="text-red-400 font-bold text-xl mb-6 flex items-center gap-3">
            <AlertTriangle size={24} /> DEFECTS THAT PREVENT REGISTRATION
          </h4>
          <ul className="space-y-3 text-zinc-300">
            <li>• Severe prognathism or retrognathism</li>
            <li>• Cryptorchidism (males)</li>
            <li>• Coat colors not recognized by APSL</li>
            <li>• Height below 1.50m (males) at 6 years</li>
          </ul>
        </div>
      </>
    )
  },

  "4": {
    title: "The Science of Colors: Coat Genetics in PSL",
    subtitle: "Extension Locus, Agouti and the Cream Dilution gene.",
    date: "12 JAN 2026",
    readTime: "25 min",
    category: "Genetics & Coat Colors",
    image: "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">E</span>
          quine coat genetics is fascinating and complex. In the Lusitano Horse, we find a great variety of colors, all determined by the interaction of multiple genes.
        </p>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. The Fundamental Genes</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-black">
            <h4 className="text-white font-bold text-xl mb-4">Extension Locus (E)</h4>
            <p className="text-zinc-400 text-sm mb-4">Controls black pigment production.</p>
            <p className="text-zinc-300 text-sm"><strong>E/E or E/e:</strong> Allows black pigment</p>
            <p className="text-zinc-300 text-sm"><strong>e/e:</strong> Chestnut (no black)</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-amber-700">
            <h4 className="text-white font-bold text-xl mb-4">Agouti Locus (A)</h4>
            <p className="text-zinc-400 text-sm mb-4">Distributes black pigment across the body.</p>
            <p className="text-zinc-300 text-sm"><strong>A/A or A/a:</strong> Black restricted to points</p>
            <p className="text-zinc-300 text-sm"><strong>a/a:</strong> Uniform black</p>
          </div>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. Lusitano Base Coat Colors</h3>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-12 rounded-sm">
          <h4 className="text-[#C5A059] font-bold text-2xl mb-6">Coat Colors Recognized by APSL</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-600 mb-4"></div>
              <h5 className="text-white font-bold mb-2">Black</h5>
              <p className="text-sm text-zinc-400">Uniform black coat.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-amber-800 border border-amber-700 mb-4"></div>
              <h5 className="text-white font-bold mb-2">Bay</h5>
              <p className="text-sm text-zinc-400">Bay body with black points.</p>
            </div>
            <div className="bg-black/40 p-6 rounded-sm">
              <div className="w-8 h-8 rounded-full bg-zinc-400 border border-zinc-300 mb-4"></div>
              <h5 className="text-white font-bold mb-2">Grey</h5>
              <p className="text-sm text-zinc-400">Progressive whitening.</p>
            </div>
          </div>
        </div>
      </>
    )
  },

  "5": {
    title: "Bullfighting Aptitude: Selection Through Combat",
    subtitle: "How Tauromachy shaped the Lusitano's psyche.",
    date: "08 JAN 2026",
    readTime: "28 min",
    category: "Functionality & Temperament",
    image: "https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">B</span>
          ullfighting aptitude is the set of psychological and physical characteristics that allow a horse to work facing a brave bull.
        </p>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. The Pillars of Bullfighting Aptitude</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-[#C5A059]">
            <Flame className="text-[#C5A059] mb-4" size={32} />
            <h4 className="text-white font-bold text-xl mb-4">Bravery</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The ability to face danger without hesitation. A <strong>controlled courage</strong>.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-[#C5A059]">
            <Brain className="text-[#C5A059] mb-4" size={32} />
            <h4 className="text-white font-bold text-xl mb-4">Tactical Intelligence</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The horse must <strong>anticipate</strong> the bull's movements.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-[#C5A059]">
            <Zap className="text-[#C5A059] mb-4" size={32} />
            <h4 className="text-white font-bold text-xl mb-4">Controlled Explosion</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Instant acceleration from 0 to 35 km/h.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-sm border-l-4 border-[#C5A059]">
            <Award className="text-[#C5A059] mb-4" size={32} />
            <h4 className="text-white font-bold text-xl mb-4">Willingness to Please</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Maintains the <strong>connection with the rider</strong> even under extreme stress.
            </p>
          </div>
        </div>
      </>
    )
  },

  "6": {
    title: "From Novilheiro to Rubi: The Olympic Revolution",
    subtitle: "The rise of the Lusitano in the FEI ranking.",
    date: "02 JAN 2026",
    readTime: "32 min",
    category: "Sport & Competition",
    image: "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
          <span className="float-left text-7xl font-serif text-[#C5A059] mr-4 leading-none mt-2">F</span>
          or decades, the Lusitano Horse was considered "unsuitable" for high-level Dressage competition. Everything changed with <strong>Novilheiro</strong>.
        </p>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">I. The Pioneer: Novilheiro</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          <strong>Novilheiro</strong> (1966-1993) was the first Lusitano to compete successfully at the highest international level.
        </p>

        <div className="bg-[#1a1410] border-l-4 border-[#C5A059] p-10 my-12 rounded-sm">
          <h4 className="text-[#C5A059] font-bold text-xl mb-6 flex items-center gap-3">
            <Trophy size={24} /> NOVILHEIRO'S ACHIEVEMENTS
          </h4>
          <ul className="space-y-3 text-zinc-300">
            <li>• Los Angeles 1984 Olympics - 4th place individual</li>
            <li>• European Championship 1983 - Bronze Medal</li>
            <li>• First Lusitano to score above 70% in Grand Prix</li>
          </ul>
        </div>

        <h3 className="text-4xl font-serif text-[#C5A059] mb-8 mt-20 border-b border-white/10 pb-4">II. The Modern Era: Rubi AR</h3>

        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
          <strong>Rubi AR</strong>, ridden by Joao Victor Oliva, took Portugal to the Tokyo 2020 Olympics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-zinc-900 p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[#C5A059] mb-2">73.4%</div>
            <p className="text-sm text-zinc-400">Best GP Special score</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[#C5A059] mb-2">Top 30</div>
            <p className="text-sm text-zinc-400">FEI World Ranking</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-sm text-center">
            <div className="text-4xl font-bold text-[#C5A059] mb-2">2020</div>
            <p className="text-sm text-zinc-400">Tokyo Olympics</p>
          </div>
        </div>
      </>
    )
  }
};
