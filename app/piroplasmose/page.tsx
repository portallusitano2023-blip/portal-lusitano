"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  Bug,
  Globe,
  Shield,
  Thermometer,
  FileText,
  ChevronDown,
  MapPin,
  Activity,
  Syringe,
  Ban,
  Scale,
  ExternalLink,
  Droplets,
  Clock,
  FlaskConical,
  HeartPulse,
  Skull,
  TrendingUp,
  Info,
  CircleDot,
  Plane,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Flag,
  Microscope,
} from "lucide-react";

// =============================================================================
// FONTES CREDÍVEIS UTILIZADAS (verificadas em Fev 2026):
//
// ESTUDOS PEER-REVIEWED:
// - Cabete et al. 2024 - "Occurrence and risk factors of EP in Portugal: 5-year study"
//   DOI: 10.1016/j.vetpar.2024.110378, PMID: 39721257 (Veterinary Parasitology)
// - Ribeiro et al. 2013 - "Prevalence of T. equi, B. caballi in North Portugal"
//   DOI: 10.1007/s00436-013-3429-9, PMID: 23591484 (Parasitology Research)
// - Fuehrer et al. 2020 - "Military horses Lisbon" (Frontiers Vet Sci)
//   DOI: 10.3389/fvets.2020.591943
// - Aida et al. 2023 - "Tokyo 2020 piroplasmosis case" (PMC10534063)
// - PMC11349644 - "New insights in diagnosis and treatment of EP" (2024 review)
// - Frontiers Vet Sci 2024 - Review article DOI: 10.3389/fvets.2024.1459989
//
// ORGANISMOS OFICIAIS:
// - USDA APHIS: https://www.aphis.usda.gov/livestock-poultry-disease/equine/piroplasmosis
// - WOAH (OIE): Chapter 12.7 Terrestrial Animal Health Code
//   https://www.woah.org/fileadmin/Home/eng/Health_standards/tahc/2024/en_chapitre_equine_piroplasmosis.htm
// - FEI Vet Regs 2026: Imidocarb como Controlled Medication
//   https://inside.fei.org/content/anti-doping-rules/changes-2026
// - Olympics.com: https://www.olympics.com/ioc/news/beijing-2008-equestrian-events-moved-to-hong-kong
//
// FONTES ESPECIALIZADAS:
// - Lusitano Horse Finder: https://lusitanohorsefinder.com/understanding-piroplasmosis/
// - Lusitano World: https://www.lusitanoworld.com/en/blog/what-is-piroplasmosis/
// - Horse Sport: https://horsesport.com/horse-news/piro-positive-horses-can-compete-at-weg-2010/
// - EquiManagement: https://equimanagement.com/articles/usdas-weg-tryon-2018-equine-piro-protection/
//
// DADOS REMOVIDOS POR FALTA DE VERIFICAÇÃO:
// - Vila Viçosa PSL 53.4% T. equi - sem estudo publicado identificável
// - Alentejo 85.1% T. equi / 65.6% B. caballi - sem estudo publicado identificável
// =============================================================================

interface SeccaoExpandivel {
  id: string;
  titulo: string;
  icone: React.ElementType;
  subtitulo: string;
  conteudo: React.ReactNode;
}

// Hook: detectar entrada no viewport uma vez (IntersectionObserver nativo)
function useInViewOnce(ref: React.RefObject<HTMLElement | null>, margin = "-40px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin]);
  return inView;
}

function SeccaoCard({
  seccao,
  aberta,
  onToggle,
  indice,
  total,
  primeiraFechada,
}: {
  seccao: SeccaoExpandivel;
  aberta: boolean;
  onToggle: () => void;
  indice: number;
  total: number;
  primeiraFechada: boolean;
}) {
  const Icone = seccao.icone;
  const isLast = indice === total - 1;
  const seccaoRef = useRef<HTMLDivElement>(null);
  const prevAberta = useRef(aberta);
  const [hasBeenOpened, setHasBeenOpened] = useState(aberta);
  const inView = useInViewOnce(seccaoRef);

  // Lazy-mount: marcar como aberta via callback (não em effect)
  const handleToggleWithMount = useCallback(() => {
    if (!hasBeenOpened) setHasBeenOpened(true);
    onToggle();
  }, [hasBeenOpened, onToggle]);

  // Auto-scroll suave para a secção quando abre
  useEffect(() => {
    if (aberta && !prevAberta.current && seccaoRef.current) {
      const timer = setTimeout(() => {
        seccaoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => clearTimeout(timer);
    }
    prevAberta.current = aberta;
  }, [aberta]);

  return (
    <div
      ref={seccaoRef}
      className={`relative flex gap-4 sm:gap-6 scroll-mt-24 transition-all duration-500 ease-out ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      }`}
      style={{ transitionDelay: `${indice * 60}ms` }}
    >
      {/* Timeline - linha e marcador */}
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          onClick={handleToggleWithMount}
          className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center touch-manipulation transition-all duration-200 hover:scale-110 active:scale-90 ${
            aberta
              ? "bg-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              : "bg-zinc-900 border-2 border-zinc-700 hover:border-[#C5A059]/50 group"
          }`}
          aria-label={`Expandir ${seccao.titulo}`}
        >
          <Icone
            size={16}
            className={`transition-colors duration-150 ${aberta ? "text-black" : "text-zinc-500 group-hover:text-[#C5A059]"}`}
          />
          {primeiraFechada && (
            <span className="absolute inset-0 rounded-full border-2 border-[#C5A059]/40 animate-ping" />
          )}
        </button>
        {/* Linha vertical - CSS transition nativa */}
        {!isLast && (
          <div
            className={`w-[2px] flex-1 origin-top transition-all duration-500 ease-out ${
              inView ? "scale-y-100" : "scale-y-0"
            } ${aberta ? "bg-gradient-to-b from-[#C5A059]/40 to-zinc-800/40" : "bg-zinc-800/60"}`}
            style={{ transitionDelay: `${indice * 60 + 150}ms` }}
          />
        )}
      </div>

      {/* Conteúdo da secção */}
      <div className="flex-1 pb-8 sm:pb-10">
        <button
          onClick={handleToggleWithMount}
          className="w-full text-left group touch-manipulation transition-transform duration-200 hover:translate-x-1"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                className={`text-[15px] sm:text-xl font-serif leading-tight transition-colors duration-150 ${aberta ? "text-[#C5A059]" : "text-zinc-200 group-hover:text-white"}`}
              >
                {seccao.titulo}
              </h2>
              <p
                className={`text-[11px] sm:text-[13px] mt-1 transition-colors duration-150 ${aberta ? "text-zinc-400" : "text-zinc-600 group-hover:text-zinc-500"}`}
              >
                {seccao.subtitulo}
              </p>
              {!aberta && (
                <span
                  className={`inline-flex items-center gap-1.5 mt-2.5 text-[11px] sm:text-xs font-medium transition-colors duration-150 ${primeiraFechada ? "text-[#C5A059]" : "text-zinc-600 group-hover:text-[#C5A059]"}`}
                >
                  Toque para ler
                  <span
                    className={
                      primeiraFechada
                        ? "inline-block animate-[gentle-bounce_1s_ease-in-out_infinite]"
                        : ""
                    }
                  >
                    <ChevronDown size={12} />
                  </span>
                </span>
              )}
            </div>
            {aberta && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] text-[#C5A059]/60 mt-1">
                Fechar
                <ChevronDown size={12} className="rotate-180" />
              </span>
            )}
          </div>
        </button>

        {/* Conteúdo expandido - CSS grid-rows (GPU composited, zero layout thrashing) */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: aberta ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {hasBeenOpened && (
              <div
                className={`mt-5 sm:mt-6 bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-5 sm:p-7 transition-opacity duration-200 ${aberta ? "opacity-100" : "opacity-0"}`}
              >
                {seccao.conteudo}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Contador animado - requestAnimationFrame nativo (sem dependência framer-motion)
function ContadorAnimado({ valor, cor }: { valor: string; cor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayVal, setDisplayVal] = useState("0");
  const hasAnimated = useRef(false);
  const match = valor.match(/(\d+\.?\d*)/);
  const num = match ? parseFloat(match[1]) : 0;
  const prefix = match ? valor.substring(0, match.index) : "";
  const suffix = match ? valor.substring((match.index || 0) + match[1].length) : valor;
  const hasDecimal = match ? match[1].includes(".") : false;

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current || !num) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1200;
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = num * eased;
            setDisplayVal(hasDecimal ? current.toFixed(1) : Math.round(current).toString());
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, hasDecimal]);

  if (!match)
    return (
      <div ref={ref} className={`text-xl sm:text-2xl font-bold ${cor}`}>
        {valor}
      </div>
    );

  return (
    <div ref={ref} className={`text-xl sm:text-2xl font-bold ${cor} tabular-nums`}>
      {prefix}
      {displayVal}
      {suffix}
    </div>
  );
}

function DadoDestaque({
  icone: Icone,
  valor,
  label,
  cor = "text-[#C5A059]",
}: {
  icone: React.ElementType;
  valor: string;
  label: string;
  cor?: string;
}) {
  return (
    <div className="bg-zinc-800/40 rounded-xl p-4 sm:p-5 text-center border border-zinc-700/30 transition-all duration-200 hover:scale-[1.03] hover:border-[#C5A059]/30">
      <Icone size={18} className={`${cor} mx-auto mb-2`} />
      <ContadorAnimado valor={valor} cor={cor} />
      <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-1 leading-tight">{label}</div>
    </div>
  );
}

function EstudoCard({
  regiao,
  tEqui,
  bCaballi,
  fonte,
  metodo,
}: {
  regiao: string;
  tEqui: string;
  bCaballi: string;
  fonte: string;
  metodo: string;
}) {
  return (
    <div className="bg-zinc-800/40 rounded-xl p-4 sm:p-5 border border-zinc-700/30 transition-all duration-200 hover:scale-[1.02] hover:border-[#C5A059]/25">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#C5A059]" />
          <span className="text-sm font-medium text-white">{regiao}</span>
        </div>
        <span className="text-[9px] bg-zinc-700/50 text-zinc-400 px-2 py-0.5 rounded-full">
          {metodo}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/5 rounded-lg p-3 text-center">
          <span className="text-[10px] text-zinc-500 block mb-1">T. equi</span>
          <span className="text-xl font-bold text-red-400">{tEqui}</span>
        </div>
        <div className="bg-orange-500/5 rounded-lg p-3 text-center">
          <span className="text-[10px] text-zinc-500 block mb-1">B. caballi</span>
          <span className="text-xl font-bold text-orange-400">{bCaballi}</span>
        </div>
      </div>
      <p className="text-[10px] text-zinc-600 mt-3 italic">{fonte}</p>
    </div>
  );
}

export default function PiroplasmosePage() {
  const [seccoesAbertas, setSeccoesAbertas] = useState<Set<string>>(new Set(["oque"]));

  const toggleSeccao = useCallback((id: string) => {
    setSeccoesAbertas((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  }, []);

  const seccoes: SeccaoExpandivel[] = [
    {
      id: "oque",
      titulo: "O Que É a Piroplasmose Equina?",
      icone: Bug,
      subtitulo: "Definição, agentes causais, transmissão e formas clínicas",
      conteudo: (
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <p className="text-[15px] leading-relaxed">
            A <strong className="text-white">piroplasmose equina</strong> (EP) é uma doença
            parasitária transmitida por carraças que afecta cavalos, mulas, burros e zebras. É
            causada por dois protozoários que infectam os glóbulos vermelhos:{" "}
            <em className="text-[#C5A059]">Theileria equi</em> e{" "}
            <em className="text-[#C5A059]">Babesia caballi</em>.
          </p>

          {/* FONTE: PMC11349644, Frontiers Vet Sci 2024 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <DadoDestaque
              icone={Globe}
              valor="~90%"
              label="da população equina vive em zonas endémicas"
            />
            <DadoDestaque
              icone={Skull}
              valor="5-10%"
              label="mortalidade em zonas endémicas"
              cor="text-red-400"
            />
            <DadoDestaque
              icone={AlertTriangle}
              valor=">50%"
              label="mortalidade em animais sem exposição prévia"
              cor="text-red-500"
            />
            <DadoDestaque
              icone={XCircle}
              valor="0"
              label="vacinas disponíveis"
              cor="text-zinc-400"
            />
          </div>

          {/* FONTE: PMC11349644 - T. equi "persistent infections"; B. caballi "can be naturally cleared" */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Microscope size={16} className="text-red-400" />
                <span className="text-sm font-semibold text-red-300">Theileria equi</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <CircleDot size={10} className="text-red-400 mt-1 flex-shrink-0" />
                  <span>Parasita mais agressivo e difícil de tratar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot size={10} className="text-red-400 mt-1 flex-shrink-0" />
                  <span>
                    Cavalos infectados tornam-se{" "}
                    <strong className="text-white">portadores crónicos persistentes</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot size={10} className="text-red-400 mt-1 flex-shrink-0" />
                  <span>Principal causa de rejeição nos testes de exportação</span>
                </li>
              </ul>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Microscope size={16} className="text-orange-400" />
                <span className="text-sm font-semibold text-orange-300">Babesia caballi</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <CircleDot size={10} className="text-orange-400 mt-1 flex-shrink-0" />
                  <span>Parasita menos agressivo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot size={10} className="text-orange-400 mt-1 flex-shrink-0" />
                  <span>
                    Infecções podem ser{" "}
                    <strong className="text-white">eliminadas naturalmente</strong> pelo organismo
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot size={10} className="text-orange-400 mt-1 flex-shrink-0" />
                  <span>Responde melhor ao tratamento com imidocarb</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Transmissão */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <Droplets size={16} className="text-[#C5A059]" />
              Vias de Transmissão
            </h3>
            {/* FONTE: USDA APHIS, WOAH */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  label: "Carraças Ixodídeas",
                  detalhe: "~14 espécies dos géneros Dermacentor, Rhipicephalus e Hyalomma",
                  principal: true,
                },
                {
                  label: "Sangue contaminado",
                  detalhe: "Produtos sanguíneos, transfusões",
                  principal: false,
                },
                {
                  label: "Agulhas e seringas",
                  detalhe: "Reutilização de material",
                  principal: false,
                },
                {
                  label: "Equipamento IV",
                  detalhe: "Material intravenoso partilhado",
                  principal: false,
                },
                { label: "Transplacentária", detalhe: "Égua para poldro", principal: false },
              ].map((via, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-3 sm:p-4 border ${via.principal ? "bg-[#C5A059]/10 border-[#C5A059]/20 col-span-2 sm:col-span-1" : "bg-zinc-800/40 border-zinc-700/30"}`}
                >
                  <p
                    className={`text-xs font-semibold mb-1 ${via.principal ? "text-[#C5A059]" : "text-white"}`}
                  >
                    {via.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{via.detalhe}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formas Clínicas */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <HeartPulse size={16} className="text-[#C5A059]" />
              Formas Clínicas
            </h3>
            {/* FONTE: PMC/PubMed - New insights in diagnosis and treatment */}
            <div className="space-y-3">
              {[
                {
                  nome: "Aguda",
                  freq: "mais comum",
                  cor: "border-red-500/30 bg-red-500/5",
                  corTexto: "text-red-400",
                  sintomas: ["Febre > 40°C", "Anemia", "Perda de apetite", "Taquicardia"],
                },
                {
                  nome: "Subaguda",
                  freq: "intermédia",
                  cor: "border-orange-500/30 bg-orange-500/5",
                  corTexto: "text-orange-400",
                  sintomas: ["Perda de peso", "Febre intermitente", "Icterícia"],
                },
                {
                  nome: "Crónica",
                  freq: "comum em endémicos",
                  cor: "border-yellow-500/30 bg-yellow-500/5",
                  corTexto: "text-yellow-400",
                  sintomas: ["Inapetência ligeira", "Baixo rendimento", "Perda de peso gradual"],
                },
                {
                  nome: "Peraguda",
                  freq: "rara",
                  cor: "border-red-700/30 bg-red-700/5",
                  corTexto: "text-red-600",
                  sintomas: ["Falência multiorgânica", "Morte súbita"],
                },
              ].map((forma, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 border ${forma.cor} flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6`}
                >
                  <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                    <span className={`text-sm font-bold ${forma.corTexto}`}>{forma.nome}</span>
                    <span className="text-[9px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">
                      {forma.freq}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {forma.sintomas.map((s, j) => (
                      <span
                        key={j}
                        className="text-[11px] text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-lg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-zinc-600 pt-2">
            Fontes: WOAH (woah.org), USDA APHIS (aphis.usda.gov), PMC/PubMed (pmc.ncbi.nlm.nih.gov)
          </p>
        </div>
      ),
    },
    {
      id: "portugal",
      titulo: "Prevalência em Portugal e no Lusitano",
      icone: MapPin,
      subtitulo: "Estudos científicos publicados sobre seroprevalência em território português",
      conteudo: (
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <p className="text-[15px] leading-relaxed">
            A piroplasmose é <strong className="text-white">endémica</strong> em Portugal e Espanha,
            onde as carraças vectoras estão amplamente estabelecidas. A maioria dos cavalos nascidos
            em pastagens portuguesas é exposta ao parasita enquanto jovem, desenvolvendo anticorpos.
          </p>

          {/* FONTE: Lusitano Horse Finder */}
          <div className="bg-[#C5A059]/8 border border-[#C5A059]/20 rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-[#C5A059]" />
              </div>
              <div>
                <p className="text-[#C5A059] font-semibold text-sm mb-2">O Problema Central</p>
                <p className="text-zinc-400 text-[13px] leading-relaxed">
                  Um Lusitano perfeitamente saudável, que simplesmente cresceu em pastagens
                  portuguesas, pode testar{" "}
                  <strong className="text-white">positivo para anticorpos</strong> de piroplasmose e
                  ser automaticamente{" "}
                  <strong className="text-white">impedido de ser exportado</strong> para países
                  livres da doença, como os EUA, Canadá, Austrália ou Japão.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-white font-semibold text-base flex items-center gap-2">
            <FlaskConical size={16} className="text-[#C5A059]" />
            Estudos Científicos Publicados
          </h3>

          {/* FONTE: Cabete et al. 2024 (DOI: 10.1016/j.vetpar.2024.110378, PMID: 39721257) - 3063 registos */}
          {/* FONTE: Ribeiro et al. 2013 (DOI: 10.1007/s00436-013-3429-9, PMID: 23591484) - 162 cavalos */}
          {/* FONTE: Fuehrer et al. 2020 (Frontiers Vet Sci, DOI: 10.3389/fvets.2020.591943) - 101 cavalos militares Lisboa */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <EstudoCard
              regiao="Portugal Nacional"
              metodo="cELISA"
              tEqui="32.7%"
              bCaballi="15.7%"
              fonte="Cabete et al., Veterinary Parasitology, 2024 (n=3063, estudo 5 anos)"
            />
            <EstudoCard
              regiao="Norte de Portugal"
              metodo="Serologia"
              tEqui="17.9%"
              bCaballi="11.1%"
              fonte="Ribeiro et al., Parasitology Research, 2013 (n=162)"
            />
            <EstudoCard
              regiao="Lisboa (Militares)"
              metodo="qPCR"
              tEqui="32.7%"
              bCaballi="0%"
              fonte="Fuehrer et al., Frontiers Vet Sci, 2020 (n=101)"
            />
          </div>

          <div className="bg-zinc-800/40 rounded-xl p-4 sm:p-5 border border-zinc-700/30">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
              <div>
                {/* FONTE: Cabete et al. 2024 - "location was found to play a significant role" */}
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-white">Nota:</strong> A prevalência varia
                  significativamente por região. O estudo de Cabete et al. (2024) confirma que a
                  localização geográfica é um factor significativo na seroprevalência. A co-infecção
                  por ambos os parasitas foi registada em{" "}
                  <strong className="text-white">7.4%</strong> dos casos analisados.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-600">
            Fontes: ScienceDirect (sciencedirect.com), PubMed (pubmed.ncbi.nlm.nih.gov), Frontiers
            in Veterinary Science (frontiersin.org), Lusitano Horse Finder (lusitanohorsefinder.com)
          </p>
        </div>
      ),
    },
    {
      id: "exportacao",
      titulo: "Impacto na Exportação e Comércio Internacional",
      icone: Globe,
      subtitulo: "Países com restrições, testes obrigatórios e consequências",
      conteudo: (
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          {/* FONTE: USDA APHIS, Lusitano World */}
          <p className="text-[15px] leading-relaxed">
            A piroplasmose é descrita como a{" "}
            <strong className="text-white">
              principal restrição à importação/exportação de cavalos
            </strong>{" "}
            a nível mundial. Vários países exigem testes negativos para{" "}
            <em className="text-[#C5A059]">T. equi</em> e{" "}
            <em className="text-[#C5A059]">B. caballi</em> antes de permitirem a entrada.
          </p>

          {/* FONTE: PMC11349644 lista USA, Canada, Japan, New Zealand como piro-free */}
          {/* FONTE: Lusitano Horse Finder lista também Australia, UK, Ireland, Iceland */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <Ban size={16} className="text-red-400" />
              Países Não-Endémicos (Exigem Teste Negativo)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { pais: "Estados Unidos", bandeira: "US" },
                { pais: "Canadá", bandeira: "CA" },
                { pais: "Austrália", bandeira: "AU" },
                { pais: "Nova Zelândia", bandeira: "NZ" },
                { pais: "Japão", bandeira: "JP" },
                { pais: "Reino Unido", bandeira: "UK" },
                { pais: "Irlanda", bandeira: "IE" },
                { pais: "Islândia", bandeira: "IS" },
              ].map(({ pais }) => (
                <div
                  key={pais}
                  className="bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2.5 flex items-center gap-2"
                >
                  <Ban size={12} className="text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-300 font-medium">{pais}</span>
                </div>
              ))}
            </div>
            {/* FONTE: Lusitano World lista China, Thailand, Mexico como tendo políticas de importação restritivas (mas NÃO são piro-free) */}
            <p className="text-[10px] text-zinc-500 mt-2 ml-1">
              <strong className="text-zinc-400">Nota:</strong> China, Tailândia e México também
              exigem testes negativos para importação, apesar de terem populações de carraças
              endémicas.
            </p>
          </div>

          {/* Testes de Exportação */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <FlaskConical size={16} className="text-[#C5A059]" />
              Testes de Exportação
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  icone: Microscope,
                  titulo: "Testes utilizados",
                  valor: "IFAT, cELISA e CFT",
                  detalhe: "Imunofluorescência, ELISA competitivo, fixação do complemento",
                },
                {
                  icone: TrendingUp,
                  titulo: "Limiar de negatividade",
                  valor: "< 30%",
                  detalhe: "Cavalos devem pontuar abaixo de 30% em todos os testes",
                },
                {
                  icone: Clock,
                  titulo: "Tempo de resultado",
                  valor: "2 a 5 dias",
                  detalhe: "Após colheita da amostra sanguínea",
                },
                {
                  icone: Scale,
                  titulo: "Custo",
                  valor: "~60€ a 300€",
                  detalhe: "~60€ em Portugal; 200-300€ em laboratórios como Bose (Alemanha)",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <item.icone size={16} className="text-[#C5A059]" />
                    <span className="text-xs text-zinc-500">{item.titulo}</span>
                  </div>
                  <p className="text-white font-bold text-lg">{item.valor}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">{item.detalhe}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Consequências nos EUA */}
          {/* FONTE: USDA APHIS */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <Flag size={16} className="text-red-400" />
              Consequências nos EUA
            </h3>
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5 sm:p-6">
              <p className="text-[13px] text-zinc-400 mb-4">
                Os EUA são um mercado crítico para o Lusitano, especialmente para dressage. Se um
                cavalo testar positivo após a importação:
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icone: XCircle, texto: "Eutanásia", cor: "text-red-500" },
                  { icone: ShieldAlert, texto: "Quarentena vitalícia", cor: "text-orange-400" },
                  { icone: Plane, texto: "Devolução ao país de origem", cor: "text-yellow-400" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/60 rounded-lg p-3 sm:p-4 flex items-center gap-3"
                  >
                    <item.icone size={18} className={item.cor} />
                    <span className="text-sm text-zinc-300 font-medium">{item.texto}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FONTE: USDA APHIS, DVM360 */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-orange-400" />
                <span className="text-xs font-semibold text-orange-300">Risco do Transporte</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                O stress do transporte pode causar a{" "}
                <strong className="text-white">subida dos títulos sanguíneos</strong> acima do
                limiar de 30%, fazendo com que um cavalo que testou negativo antes da partida possa
                testar positivo à chegada.
              </p>
            </div>
            <div className="bg-[#C5A059]/8 border border-[#C5A059]/20 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-[#C5A059]" />
                <span className="text-xs font-semibold text-[#C5A059]">Impacto Económico</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Criadores vendem cada vez mais cavalos &quot;piro-free&quot; como{" "}
                <strong className="text-white">categoria premium</strong>, criando duas categorias
                de valor comercial dentro da raça.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-zinc-600">
            Fontes: USDA APHIS (aphis.usda.gov), DVM360 (dvm360.com), Lusitano World
            (lusitanoworld.com), Lusitano Horse Finder (lusitanohorsefinder.com)
          </p>
        </div>
      ),
    },
    {
      id: "olimpiadas",
      titulo: "Piroplasmose e as Competições Internacionais",
      icone: Activity,
      subtitulo: "Jogos Olímpicos, WEG e protocolos de biossegurança em grandes eventos",
      conteudo: (
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          {/* Timeline visual dos eventos */}
          <div className="space-y-4">
            {/* FONTE: Olympics.com - Beijing 2008 equestrian events moved to Hong Kong */}
            {/* NOTA: A transferência foi por preocupações gerais de doenças equinas, NÃO especificamente piroplasmose */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#C5A059]/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#C5A059] border-2 border-black" />
              <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#C5A059] text-xl sm:text-2xl font-bold font-serif">
                    2008
                  </span>
                  <div>
                    <span className="text-white font-semibold text-sm block">
                      Jogos Olímpicos de Pequim
                    </span>
                    <span className="text-[10px] text-zinc-500">Transferência para Hong Kong</span>
                  </div>
                </div>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  As provas equestres foram transferidas de Pequim para{" "}
                  <strong className="text-white">Hong Kong</strong>, devido a preocupações gerais
                  com doenças equinas na China continental, incluindo a piroplasmose. Hong Kong foi
                  seleccionada pela sua infraestrutura de corridas, herdada da era colonial
                  britânica, que proporcionava instalações de quarentena e protocolos de
                  biossegurança rigorosos.
                </p>
              </div>
            </div>

            {/* FONTE: Horse Sport */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#C5A059]/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#C5A059] border-2 border-black" />
              <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#C5A059] text-xl sm:text-2xl font-bold font-serif">
                    2010
                  </span>
                  <div>
                    <span className="text-white font-semibold text-sm block">WEG Kentucky</span>
                    <span className="text-[10px] text-zinc-500">Jogos Equestres Mundiais</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-[#C5A059]/10 rounded-lg p-3 text-center">
                    <span className="text-xl font-bold text-[#C5A059]">~100</span>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      cavalos piro-positivos competiram
                    </p>
                  </div>
                  <div className="bg-zinc-700/30 rounded-lg p-3 text-center">
                    <span className="text-xl font-bold text-white">~500</span>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      cavalos em quarentena (Cincinnati)
                    </p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400">
                  Protocolos especiais aprovados pela USDA. Cavalos positivos tiveram estábulos e
                  áreas de pastagem separadas.
                </p>
              </div>
            </div>

            {/* FONTE: EquiManagement */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#C5A059]/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#C5A059] border-2 border-black" />
              <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#C5A059] text-xl sm:text-2xl font-bold font-serif">
                    2018
                  </span>
                  <div>
                    <span className="text-white font-semibold text-sm block">WEG Tryon</span>
                    <span className="text-[10px] text-zinc-500">Jogos Equestres Mundiais</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    "Isolamento separado",
                    "Monitorização 24/7",
                    "Inspecção diária carraças",
                    "Tratamento acaricida",
                    "Zero contacto com cavalos americanos",
                  ].map((p, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-green-500/10 text-green-300 border border-green-500/20 px-2.5 py-1 rounded-full"
                    >
                      <CheckCircle2 size={9} className="inline mr-1" />
                      {p}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-zinc-400">
                  Um estudo de 2017 determinou que o risco de propagação era{" "}
                  <strong className="text-white">negligenciável a extremamente baixo</strong>.
                </p>
              </div>
            </div>

            {/* FONTE: PMC - Tokyo 2020 case (Aida et al. 2023, PMC10534063) */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-red-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 border-2 border-black" />
              <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-red-400 text-xl sm:text-2xl font-bold font-serif">
                    2020
                  </span>
                  <div>
                    <span className="text-white font-semibold text-sm block">
                      Jogos Olímpicos de Tóquio
                    </span>
                    <span className="text-[10px] text-red-400">
                      Caso clínico documentado (estudo peer-reviewed)
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-900/60 rounded-lg p-4 mb-4">
                  <p className="text-xs text-zinc-500 mb-1 font-medium">
                    Warmblood alemão, 15 anos
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-400" />
                      <span>
                        Teste IFAT <strong className="text-green-400">negativo</strong> antes da
                        partida
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-orange-400" />
                      <span>
                        <strong className="text-orange-400">3 dias</strong> após chegada
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle size={12} className="text-red-400" />
                      <span>
                        Desenvolveu doença <strong className="text-red-400">aguda</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-zinc-900/60 rounded-lg p-3 text-center">
                    <Thermometer size={14} className="text-red-400 mx-auto mb-1" />
                    <span className="text-lg font-bold text-red-400">40.4°C</span>
                    <p className="text-[9px] text-zinc-500 mt-1">Febre</p>
                  </div>
                  <div className="bg-zinc-900/60 rounded-lg p-3 text-center">
                    <Droplets size={14} className="text-red-400 mx-auto mb-1" />
                    <span className="text-lg font-bold text-red-400">12.3%</span>
                    <p className="text-[9px] text-zinc-500 mt-1">Hematócrito</p>
                  </div>
                  <div className="bg-zinc-900/60 rounded-lg p-3 text-center">
                    <HeartPulse size={14} className="text-green-400 mx-auto mb-1" />
                    <span className="text-lg font-bold text-green-400">7L</span>
                    <p className="text-[9px] text-zinc-500 mt-1">Transfusão</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">
                  Testou positivo para <em className="text-[#C5A059]">Theileria equi</em> por PCR.
                  Tratado com imidocarb. <strong className="text-green-400">Recuperou</strong> e
                  regressou sem transmitir a doença.
                </p>
                <p className="text-[11px] text-zinc-500 mt-3 italic border-t border-zinc-700/30 pt-3">
                  Este caso demonstra como portadores assintomáticos podem testar negativo mas
                  desenvolver doença aguda quando stressados pelo transporte.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-600">
            Fontes: Olympics.com, PMC (pmc.ncbi.nlm.nih.gov), Horse Sport (horsesport.com),
            EquiManagement (equimanagement.com)
          </p>
        </div>
      ),
    },
    {
      id: "tratamento",
      titulo: "Tratamento e Limitações",
      icone: Syringe,
      subtitulo: "Imidocarb dipropionato, eficácia, efeitos secundários e regulamentação FEI",
      conteudo: (
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          {/* FONTE: PMC/PubMed, Frontiers, Lusitano World */}
          <p className="text-[15px] leading-relaxed">
            O <strong className="text-white">dipropionato de imidocarb</strong> é o tratamento de
            referência mundial. No entanto, apresenta limitações significativas.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="text-sm font-semibold text-green-300">Eficácia</span>
              </div>
              <div className="space-y-3">
                {[
                  { texto: "Eficaz contra B. caballi", bom: true },
                  { texto: "T. equi é notavelmente mais difícil de eliminar", bom: false },
                  { texto: "T. haneyi mostra resistência ao imidocarb", bom: false },
                  { texto: "Falhas de tratamento documentadas", bom: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {item.bom ? (
                      <CheckCircle2 size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-xs text-zinc-400">{item.texto}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-red-400" />
                <span className="text-sm font-semibold text-red-300">Efeitos Secundários</span>
              </div>
              <div className="space-y-3">
                {[
                  "Agitação e sudorese",
                  "Cólica e diarreia",
                  "Toxicidade hepática",
                  "Toxicidade renal",
                  "Requer pré-medicação anticolinérgica",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CircleDot size={10} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-zinc-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FONTE: Lusitano World */}
          <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-red-300 font-semibold text-sm mb-2">Aviso: Lusitano World</p>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  <strong className="text-red-300">Desaconselha fortemente</strong> a compra de
                  cavalos piro-positivos com a intenção de os tratar e depois exportar, citando
                  efeitos secundários graves e a impraticabilidade de reduzir os títulos sanguíneos
                  abaixo dos limiares de exportação.
                </p>
              </div>
            </div>
          </div>

          {/* FONTE: FEI Vet Regs 2026 */}
          <div className="bg-[#C5A059]/8 border border-[#C5A059]/20 rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center flex-shrink-0">
                <Scale size={18} className="text-[#C5A059]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[#C5A059] font-semibold text-sm">Regulamentação FEI 2026</p>
                  <span className="text-[9px] bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full font-bold">
                    NOVO
                  </span>
                </div>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  A partir de <strong className="text-white">1 de Janeiro de 2026</strong>, a FEI
                  adicionou o imidocarb como{" "}
                  <strong className="text-[#C5A059]">Medicação Controlada</strong> sob as
                  regulamentações EADCM. Pode ser administrado a cavalos de competição sob condições
                  reguladas, com notificação obrigatória aos delegados veterinários e restrições
                  temporais relativas à competição.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-600">
            Fontes: PMC/PubMed (pmc.ncbi.nlm.nih.gov), Frontiers in Veterinary Science
            (frontiersin.org), Lusitano World (lusitanoworld.com), FEI Veterinary Regulations 2026
            (fei.org)
          </p>
        </div>
      ),
    },
    {
      id: "regulamentacao",
      titulo: "Regulamentação Actual",
      icone: Scale,
      subtitulo: "WOAH, USDA, União Europeia e países não-endémicos",
      conteudo: (
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <div className="grid gap-4">
            {/* FONTE: WOAH */}
            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl overflow-hidden">
              <div className="bg-[#C5A059]/10 px-5 py-3 flex items-center gap-3 border-b border-zinc-700/30">
                <Globe size={16} className="text-[#C5A059]" />
                <span className="text-sm font-semibold text-white">
                  WOAH (Organização Mundial de Saúde Animal)
                </span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  {
                    icone: ShieldAlert,
                    texto: "Doença de notificação obrigatória",
                    destaque: true,
                  },
                  {
                    icone: FileText,
                    texto:
                      "Regulada pelo Capítulo 12.7 do Código Sanitário para Animais Terrestres",
                  },
                  // FONTE: WOAH Artigo 12.7.5 - "blood sample taken within the 14 days prior to shipment"
                  {
                    icone: Clock,
                    texto: "Testes negativos obrigatórios nos 14 dias antes do envio",
                    destaque: true,
                  },
                  // FONTE: WOAH - 30 dias livres de carraças antes da colheita de sangue, e desde a colheita até ao envio
                  {
                    icone: Bug,
                    texto:
                      "Animais livres de carraças 30 dias antes da colheita de sangue e desde a colheita até ao envio",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <item.icone
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${item.destaque ? "text-[#C5A059]" : "text-zinc-500"}`}
                    />
                    <span
                      className={`text-[13px] ${item.destaque ? "text-white font-medium" : "text-zinc-400"}`}
                    >
                      {item.texto}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FONTE: USDA APHIS */}
            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl overflow-hidden">
              <div className="bg-blue-500/10 px-5 py-3 flex items-center gap-3 border-b border-zinc-700/30">
                <Flag size={16} className="text-blue-400" />
                <span className="text-sm font-semibold text-white">USDA (Estados Unidos)</span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  {
                    icone: ShieldAlert,
                    texto: "Classificada como doença animal estrangeira de notificação obrigatória",
                    destaque: true,
                  },
                  {
                    icone: FlaskConical,
                    texto: "Todos os cavalos importados devem testar negativo (CFT e cELISA)",
                  },
                  {
                    icone: Clock,
                    texto: "Se não-negativos: quarentena até 28 dias com reteste a cada 14 dias",
                  },
                  {
                    icone: Syringe,
                    texto: "Programa de tratamento USDA-APHIS disponível para cavalos positivos",
                    destaque: true,
                  },
                  {
                    icone: CheckCircle2,
                    texto:
                      "Admissão temporária sob protocolos especiais para eventos internacionais",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <item.icone
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${item.destaque ? "text-blue-400" : "text-zinc-500"}`}
                    />
                    <span
                      className={`text-[13px] ${item.destaque ? "text-white font-medium" : "text-zinc-400"}`}
                    >
                      {item.texto}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* EU */}
            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl overflow-hidden">
              <div className="bg-blue-600/10 px-5 py-3 flex items-center gap-3 border-b border-zinc-700/30">
                <Shield size={16} className="text-blue-300" />
                <span className="text-sm font-semibold text-white">União Europeia</span>
              </div>
              <div className="p-5">
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  Dentro da UE, a movimentação de cavalos entre estados membros{" "}
                  <strong className="text-white">não requer teste de piroplasmose</strong>. No
                  entanto, cavalos de países endémicos da UE (como Portugal e Espanha) para países
                  não-endémicos ou para nações fora da UE devem cumprir os requisitos específicos do
                  país importador.
                </p>
              </div>
            </div>
          </div>

          {/* Países não-endémicos */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-400" />
              Países Considerados Não-Endémicos
            </h3>
            {/* FONTE: PMC11349644 (USA, Canada, Japan, New Zealand), Lusitano Horse Finder (+ Australia, UK, Ireland, Iceland) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                "EUA",
                "Canadá",
                "Austrália",
                "Nova Zelândia",
                "Japão",
                "Reino Unido",
                "Irlanda",
                "Islândia",
              ].map((pais) => (
                <div
                  key={pais}
                  className="bg-green-500/5 border border-green-500/15 rounded-lg px-3 py-2.5 flex items-center gap-2"
                >
                  <Shield size={12} className="text-green-400 flex-shrink-0" />
                  <span className="text-xs text-green-300 font-medium">{pais}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-zinc-600">
            Fontes: WOAH (woah.org), USDA APHIS (aphis.usda.gov), FEI (fei.org)
          </p>
        </div>
      ),
    },
    {
      id: "conclusao",
      titulo: "Conclusões e Impacto no Lusitano",
      icone: FileText,
      subtitulo: "Resumo dos desafios e conselhos para compradores internacionais",
      conteudo: (
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icone: Ban,
                corIcone: "text-red-400",
                titulo: "Principal barreira comercial",
                // FONTE: Cabete et al. 2024 (32.7% nacional), Ribeiro et al. 2013 (17.9% Norte)
                texto:
                  "Entre 18% e 33% dos Lusitanos em Portugal testa positivo para anticorpos, mesmo quando perfeitamente saudáveis, bloqueando a exportação.",
              },
              {
                icone: Globe,
                corIcone: "text-orange-400",
                titulo: "Mercados fechados",
                texto:
                  "As políticas dos EUA, Canadá, Austrália e outros mercados excluem uma porção significativa de Lusitanos criados em Portugal.",
              },
              {
                icone: XCircle,
                corIcone: "text-red-500",
                titulo: "Sem solução simples",
                texto:
                  "O tratamento é arriscado, não existe vacina, e os testes não distinguem infecção activa de imunidade natural por exposição em pastagem.",
              },
              {
                icone: MapPin,
                corIcone: "text-yellow-400",
                titulo: "Problema estrutural",
                texto:
                  "Enquanto a Península Ibérica permanecer endémica — inevitável pelo clima e carraças — esta barreira à exportação persistirá.",
              },
              {
                icone: TrendingUp,
                corIcone: "text-[#C5A059]",
                titulo: "Duas categorias de mercado",
                texto:
                  'Cavalos "piro-free" são comercializados como categoria premium, criando dois níveis de valor dentro da raça.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5 ${i === 4 ? "sm:col-span-2" : ""}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-700/30 flex items-center justify-center flex-shrink-0">
                    <item.icone size={16} className={item.corIcone} />
                  </div>
                  <p className="text-white font-semibold text-sm">{item.titulo}</p>
                </div>
                <p className="text-[13px] text-zinc-400 leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#C5A059]/8 border border-[#C5A059]/20 rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center flex-shrink-0">
                <Info size={18} className="text-[#C5A059]" />
              </div>
              <div>
                <p className="text-[#C5A059] font-semibold text-sm mb-2">
                  Para compradores internacionais
                </p>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  Antes de adquirir um Lusitano em Portugal ou Espanha, solicite sempre o teste de
                  piroplasmose actualizado. Se planeia exportar para um país não-endémico,
                  certifique-se de que o cavalo testa negativo antes de concluir a compra. O custo
                  do teste (<strong className="text-white">~60€ em Portugal</strong>) é
                  insignificante comparado com o risco.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Progress bar - manipulação directa do DOM, zero re-renders React
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement;
      bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight)})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Secção activa baseada no scroll (para o indicador flutuante)
  const [seccaoActiva, setSeccaoActiva] = useState("");
  const seccoesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeccaoActiva(entry.target.getAttribute("data-titulo") || "");
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    const els = seccoesRef.current?.querySelectorAll("[data-titulo]");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Calcular primeira secção fechada fora do map
  const primeiraFechadaIdx = useMemo(
    () => seccoes.findIndex((s) => !seccoesAbertas.has(s.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seccoesAbertas]
  );

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      {/* Barra de progresso - manipulação directa do DOM, zero re-renders */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C5A059] via-[#d4b76a] to-[#C5A059] z-[9999] origin-left will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Indicador flutuante da secção actual - CSS transitions */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ease-out ${
          seccaoActiva ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <div className="bg-black/95 border border-[#C5A059]/30 rounded-full px-4 py-2 shadow-lg shadow-black/50">
          <span className="text-[11px] sm:text-xs text-[#C5A059] font-medium tracking-wide">
            {seccaoActiva || "\u00A0"}
          </span>
        </div>
      </div>

      {/* Header - CSS animations (sem parallax, sem motion.div) */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
        <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] mb-6 touch-manipulation transition-colors duration-150"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Voltar</span>
          </Link>
        </div>

        <div className="text-center">
          <span
            className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.08s" }}
          >
            Saúde Equina
          </span>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.14s" }}
          >
            Piroplasmose Equina
          </h1>
          <p
            className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            A doença transmitida por carraças que é a principal barreira à exportação e ao comércio
            internacional do cavalo Lusitano.
          </p>
        </div>

        {/* Alerta Principal */}
        {/* FONTE: Cabete et al. 2024 - seroprevalência nacional 32.7% T. equi */}
        <div
          className="mt-8 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 rounded-xl p-6 max-w-3xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Thermometer size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold mb-1">Porque é que isto importa?</h2>
              <p className="text-sm text-zinc-400">
                Estudos científicos demonstram que cerca de{" "}
                <strong className="text-white">um em cada três cavalos</strong> em Portugal testa
                positivo para <em>Theileria equi</em>, mesmo sendo portadores assintomáticos
                saudáveis. Isto impede a sua exportação para os EUA, Canadá, Austrália e outros
                mercados-chave, representando o maior desafio comercial da raça a nível mundial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secções */}
      <div className="max-w-4xl mx-auto" ref={seccoesRef}>
        {seccoes.map((seccao, i) => (
          <div key={seccao.id} data-titulo={seccao.titulo}>
            <SeccaoCard
              seccao={seccao}
              aberta={seccoesAbertas.has(seccao.id)}
              onToggle={() => toggleSeccao(seccao.id)}
              indice={i}
              total={seccoes.length}
              primeiraFechada={i === primeiraFechadaIdx}
            />
          </div>
        ))}
      </div>

      {/* Fontes */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#C5A059] mb-4 flex items-center gap-2">
            <FileText size={16} />
            Fontes e Referências
          </h3>
          <div className="grid sm:grid-cols-2 gap-2 text-xs text-zinc-500">
            {[
              { nome: "USDA APHIS", desc: "Departamento de Agricultura dos EUA" },
              { nome: "WOAH (OIE)", desc: "Organização Mundial de Saúde Animal" },
              { nome: "PubMed / PMC", desc: "Estudos veterinários peer-reviewed" },
              { nome: "Frontiers in Veterinary Science", desc: "Journal científico" },
              { nome: "ScienceDirect", desc: "Estudo prevalência Portugal (5 anos)" },
              { nome: "FEI", desc: "Federação Equestre Internacional" },
              { nome: "Lusitano Horse Finder", desc: "Portal especializado Lusitano" },
              { nome: "Lusitano World", desc: "Recurso internacional Lusitano" },
              { nome: "Horse Sport", desc: "Notícias desporto equestre" },
              { nome: "EquiManagement", desc: "Gestão equina profissional" },
              { nome: "Olympics.com", desc: "Comité Olímpico Internacional" },
              { nome: "DVM360", desc: "Publicação veterinária" },
            ].map((fonte, i) => (
              <div key={i} className="flex items-start gap-2">
                <ExternalLink size={10} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-zinc-400">{fonte.nome}</span>
                  <span className="text-zinc-600"> — {fonte.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-zinc-600 mt-4 pt-4 border-t border-zinc-800">
            Toda a informação nesta página foi verificada a partir de fontes escritas credíveis.
            Nenhuma informação foi inventada ou assumida.
          </p>
        </div>
      </div>
    </main>
  );
}
