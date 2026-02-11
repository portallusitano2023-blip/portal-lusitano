"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Bug, Globe, MapPin, Activity, Syringe, Scale, FileText } from "lucide-react";
import {
  SeccaoCard,
  SeccaoHeader,
  SeccaoFontes,
  SeccaoOQue,
  SeccaoPortugal,
  SeccaoExportacao,
  SeccaoOlimpiadas,
  SeccaoTratamento,
  SeccaoRegulamentacao,
  SeccaoConclusao,
} from "@/components/piroplasmose";
import type { SeccaoExpandivel } from "@/components/piroplasmose";

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
      conteudo: <SeccaoOQue />,
    },
    {
      id: "portugal",
      titulo: "Prevalência em Portugal e no Lusitano",
      icone: MapPin,
      subtitulo: "Estudos científicos publicados sobre seroprevalência em território português",
      conteudo: <SeccaoPortugal />,
    },
    {
      id: "exportacao",
      titulo: "Impacto na Exportação e Comércio Internacional",
      icone: Globe,
      subtitulo: "Países com restrições, testes obrigatórios e consequências",
      conteudo: <SeccaoExportacao />,
    },
    {
      id: "olimpiadas",
      titulo: "Piroplasmose e as Competições Internacionais",
      icone: Activity,
      subtitulo: "Jogos Olímpicos, WEG e protocolos de biossegurança em grandes eventos",
      conteudo: <SeccaoOlimpiadas />,
    },
    {
      id: "tratamento",
      titulo: "Tratamento e Limitações",
      icone: Syringe,
      subtitulo: "Imidocarb dipropionato, eficácia, efeitos secundários e regulamentação FEI",
      conteudo: <SeccaoTratamento />,
    },
    {
      id: "regulamentacao",
      titulo: "Regulamentação Actual",
      icone: Scale,
      subtitulo: "WOAH, USDA, União Europeia e países não-endémicos",
      conteudo: <SeccaoRegulamentacao />,
    },
    {
      id: "conclusao",
      titulo: "Conclusões e Impacto no Lusitano",
      icone: FileText,
      subtitulo: "Resumo dos desafios e conselhos para compradores internacionais",
      conteudo: <SeccaoConclusao />,
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
            {seccaoActiva || " "}
          </span>
        </div>
      </div>

      {/* Header */}
      <SeccaoHeader />

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
      <SeccaoFontes />
    </main>
  );
}
