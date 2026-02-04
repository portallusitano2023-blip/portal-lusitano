"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ChevronRight,
  X,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  List,
  Navigation,
  Search,
  Sparkles,
  Crown,
  Map,
  Layers,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Coudelaria {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  localizacao: string;
  regiao: string;
  telefone?: string;
  email?: string;
  website?: string;
  foto_capa?: string;
  is_pro: boolean;
  destaque: boolean;
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  num_cavalos?: number;
  especialidades?: string[];
}

// Mapa de Portugal REAL com paths geográficos precisos
const portugalRegioes = {
  "Minho": {
    // Norte de Portugal - Entre-Douro-e-Minho
    path: "M95,15 L110,12 L130,15 L148,22 L160,35 L158,52 L150,65 L138,72 L125,68 L110,72 L95,68 L82,58 L78,42 L85,25 Z",
    center: { x: 120, y: 42 },
    color: "#C5A059",
  },
  "Douro": {
    // Trás-os-Montes e Alto Douro
    path: "M160,35 L180,32 L200,40 L215,55 L218,75 L210,95 L195,105 L175,108 L155,100 L145,85 L150,65 L158,52 Z",
    center: { x: 182, y: 70 },
    color: "#D4AF61",
  },
  "Porto": {
    // Grande Porto e Litoral Norte
    path: "M60,58 L78,42 L82,58 L95,68 L98,82 L90,95 L75,100 L60,95 L52,80 L55,68 Z",
    center: { x: 75, y: 75 },
    color: "#B8965A",
  },
  "Centro": {
    // Beiras - Centro de Portugal
    path: "M52,80 L60,95 L75,100 L90,95 L98,82 L110,72 L125,68 L138,72 L155,100 L175,108 L180,130 L175,160 L160,185 L140,195 L115,200 L90,195 L70,180 L55,155 L48,125 L45,100 Z",
    center: { x: 115, y: 140 },
    color: "#C9A75F",
  },
  "Ribatejo": {
    // Ribatejo - Vale do Tejo
    path: "M70,180 L90,195 L115,200 L140,195 L150,215 L145,240 L130,255 L110,260 L90,255 L75,240 L70,215 L68,195 Z",
    center: { x: 110, y: 225 },
    color: "#D9B96B",
  },
  "Lisboa": {
    // Lisboa e Vale do Tejo - Costa
    path: "M40,170 L55,155 L70,180 L68,195 L70,215 L65,235 L55,250 L40,255 L28,245 L25,225 L28,200 L35,180 Z",
    center: { x: 48, y: 215 },
    color: "#C5A059",
  },
  "Alentejo": {
    // Alentejo - Grande região sul
    path: "M40,255 L55,250 L65,235 L75,240 L90,255 L110,260 L130,255 L145,240 L160,250 L175,275 L180,310 L178,350 L170,390 L155,425 L135,450 L110,460 L85,455 L60,440 L42,415 L30,380 L25,340 L28,300 L32,270 Z",
    center: { x: 105, y: 355 },
    color: "#BF9A55",
  },
  "Algarve": {
    // Algarve - Sul de Portugal
    path: "M42,415 L60,440 L85,455 L110,460 L135,450 L155,425 L168,435 L175,455 L170,475 L155,490 L130,500 L100,502 L70,498 L45,488 L30,472 L28,450 L35,430 Z",
    center: { x: 100, y: 468 },
    color: "#D4AF61",
  },
};

// Contorno completo de Portugal Continental
const portugalOutline = "M95,15 L110,12 L130,15 L148,22 L160,35 L180,32 L200,40 L215,55 L218,75 L210,95 L195,105 L175,108 L180,130 L175,160 L160,185 L150,215 L160,250 L175,275 L180,310 L178,350 L170,390 L168,435 L175,455 L170,475 L155,490 L130,500 L100,502 L70,498 L45,488 L30,472 L28,450 L30,380 L25,340 L28,300 L25,225 L28,200 L35,180 L40,170 L48,125 L45,100 L52,80 L55,68 L60,58 L78,42 L85,25 Z";

const placeholderImages = [
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400",
  "https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=400",
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=400",
];

// Stat Card Component
const StatCard = memo(function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="relative px-5 py-4 bg-zinc-900/80 backdrop-blur-sm border border-white/10 hover:border-[#C5A059]/50 transition-colors">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}>
        <Icon size={16} className="text-black" />
      </div>
      <div className="pt-3 text-center">
        <div className="text-2xl font-serif text-white">{value}</div>
        <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 mt-1">{label}</div>
      </div>
    </div>
  );
});

// Coudelaria Card
const CoudelariaCard = memo(function CoudelariaCard({ coudelaria, index, onSelect, isSelected }: { coudelaria: Coudelaria; index: number; onSelect: () => void; isSelected: boolean }) {
  const image = coudelaria.foto_capa || placeholderImages[index % placeholderImages.length];
  return (
    <button onClick={onSelect} className={`w-full text-left p-3 border rounded-lg transition-all ${isSelected ? "bg-[#C5A059]/10 border-[#C5A059]" : "bg-zinc-900/60 border-white/5 hover:border-[#C5A059]/30"}`}>
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
          <Image src={image} alt={coudelaria.nome} fill sizes="56px" className="object-cover" loading="lazy" />
          {coudelaria.destaque && (
            <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C5A059] rounded-full flex items-center justify-center">
              <Star size={8} className="text-black" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-serif text-sm truncate">{coudelaria.nome}</h3>
          <p className="text-zinc-500 text-xs flex items-center gap-1">
            <MapPin size={10} className="text-[#C5A059]" />
            {coudelaria.localizacao}
          </p>
        </div>
        <ChevronRight className={`flex-shrink-0 ${isSelected ? 'text-[#C5A059]' : 'text-zinc-600'}`} size={16} />
      </div>
    </button>
  );
});

// Grid Card
const GridCard = memo(function GridCard({ coudelaria, index }: { coudelaria: Coudelaria; index: number }) {
  const image = coudelaria.foto_capa || placeholderImages[index % placeholderImages.length];
  return (
    <Link href={`/directorio/${coudelaria.slug}`} className="group block bg-zinc-900/60 border border-white/5 rounded-xl overflow-hidden hover:border-[#C5A059]/30 transition-colors">
      <div className="relative h-44 overflow-hidden bg-zinc-800">
        <Image src={image} alt={coudelaria.nome} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {coudelaria.destaque && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#C5A059] text-black px-2 py-0.5 text-[10px] font-bold rounded-full">
            <Star size={10} /> Destaque
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 text-[10px] rounded-full">
          <MapPin size={10} className="text-[#C5A059]" />
          {coudelaria.regiao}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-serif text-white group-hover:text-[#C5A059] transition-colors">{coudelaria.nome}</h3>
        <p className="text-zinc-500 text-xs mb-1">{coudelaria.localizacao}</p>
        <p className="text-zinc-400 text-xs line-clamp-2">{coudelaria.descricao}</p>
      </div>
    </Link>
  );
});

export default function MapaPage() {
  const [coudelarias, setCoudelarias] = useState<Coudelaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegiao, setSelectedRegiao] = useState<string | null>(null);
  const [selectedCoudelaria, setSelectedCoudelaria] = useState<Coudelaria | null>(null);
  const [hoveredRegiao, setHoveredRegiao] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCoudelarias() {
      try {
        const res = await fetch("/api/coudelarias");
        if (res.ok) {
          const data = await res.json();
          setCoudelarias(data.coudelarias || []);
        }
      } catch (error) {
        console.error("Erro ao carregar coudelarias:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCoudelarias();
  }, []);

  const coudelariasPorRegiao = useMemo(() => coudelarias.reduce((acc, c) => {
    if (!acc[c.regiao]) acc[c.regiao] = [];
    acc[c.regiao].push(c);
    return acc;
  }, {} as Record<string, Coudelaria[]>), [coudelarias]);

  const filteredCoudelarias = useMemo(() => {
    if (!searchQuery.trim()) return coudelarias;
    const q = searchQuery.toLowerCase();
    return coudelarias.filter(c => c.nome.toLowerCase().includes(q) || c.localizacao.toLowerCase().includes(q) || c.regiao.toLowerCase().includes(q));
  }, [coudelarias, searchQuery]);

  const stats = useMemo(() => ({
    total: coudelarias.length,
    regioes: Object.keys(coudelariasPorRegiao).length,
    destaque: coudelarias.filter(c => c.destaque).length,
  }), [coudelarias, coudelariasPorRegiao]);

  const handleZoom = useCallback((dir: "in" | "out") => {
    setZoom(p => dir === "in" ? Math.min(p + 0.2, 2) : Math.max(p - 0.2, 0.6));
  }, []);

  return (
    <main className="min-h-screen bg-[#030303]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C5A059]/5 via-transparent to-transparent" />
      </div>

      {/* Hero */}
      <section className="relative pt-28 pb-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full">
            <Compass className="text-[#C5A059]" size={16} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Mapa Interativo</span>
            <Sparkles className="text-[#C5A059]" size={14} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-4 text-white">
            Descubra <span className="text-[#C5A059]">Portugal</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Explore <span className="text-[#C5A059] font-semibold">{stats.total} coudelarias</span> de elite espalhadas pelo país.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <StatCard icon={MapPin} label="Coudelarias" value={stats.total} color="from-[#C5A059] to-[#E8D5A3]" />
            <StatCard icon={Map} label="Regiões" value={stats.regioes} color="from-emerald-500 to-emerald-300" />
            <StatCard icon={Crown} label="Destaque" value={stats.destaque} color="from-purple-500 to-purple-300" />
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-16">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-6 bg-zinc-900/60 backdrop-blur border border-white/10 rounded-xl">
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-lg">
            <button onClick={() => setViewMode("map")} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${viewMode === "map" ? "bg-[#C5A059] text-black" : "text-zinc-400 hover:text-white"}`}>
              <Layers size={16} /> Mapa
            </button>
            <button onClick={() => setViewMode("list")} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${viewMode === "list" ? "bg-[#C5A059] text-black" : "text-zinc-400 hover:text-white"}`}>
              <List size={16} /> Lista
            </button>
          </div>

          <div className="flex-1 max-w-sm mx-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#C5A059]/50"
              />
            </div>
          </div>

          {viewMode === "map" && (
            <div className="flex items-center gap-1">
              <button onClick={() => handleZoom("out")} className="p-2 text-zinc-400 hover:text-white bg-black/40 rounded-lg"><ZoomOut size={16} /></button>
              <span className="text-xs text-zinc-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => handleZoom("in")} className="p-2 text-zinc-400 hover:text-white bg-black/40 rounded-lg"><ZoomIn size={16} /></button>
              <button onClick={() => setZoom(1)} className="p-2 text-zinc-400 hover:text-white bg-black/40 rounded-lg ml-1"><Maximize2 size={16} /></button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Compass className="text-[#C5A059] animate-spin" size={40} />
            <p className="text-zinc-400 mt-4">A carregar...</p>
          </div>
        ) : viewMode === "map" ? (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Mapa de Portugal */}
            <div className="lg:col-span-8">
              <div className="relative bg-gradient-to-br from-zinc-900/80 to-black border border-white/10 rounded-2xl overflow-hidden" style={{ minHeight: "580px" }}>

                {/* Oceano Atlântico label */}
                <div className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-700 text-xs tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}>
                  Oceano Atlântico
                </div>

                {/* Espanha label */}
                <div className="absolute top-8 right-8 text-zinc-600 text-sm tracking-wider">
                  ESPANHA →
                </div>

                {/* Compass */}
                <div className="absolute top-4 right-4 opacity-40">
                  <svg width="50" height="50" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#C5A059" strokeWidth="1" />
                    <path d="M50,10 L54,45 L50,35 L46,45 Z" fill="#C5A059" />
                    <text x="50" y="8" textAnchor="middle" fill="#C5A059" fontSize="8">N</text>
                  </svg>
                </div>

                {/* SVG Map */}
                <svg
                  viewBox="0 0 250 520"
                  className="w-full h-auto"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.3s ease" }}
                >
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C5A059" />
                      <stop offset="100%" stopColor="#E8D5A3" />
                    </linearGradient>
                    <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0a1525" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  {/* Ocean */}
                  <rect x="0" y="0" width="50" height="520" fill="url(#ocean)" opacity="0.5" />

                  {/* Grid */}
                  {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map(y => (
                    <line key={y} x1="20" y1={y} x2="230" y2={y} stroke="#C5A059" strokeWidth="0.2" strokeDasharray="2,6" opacity="0.15" />
                  ))}

                  {/* Portugal Outline (border effect) */}
                  <path d={portugalOutline} fill="none" stroke="#C5A059" strokeWidth="2" opacity="0.2" filter="url(#glow)" />

                  {/* Regions */}
                  {Object.entries(portugalRegioes).map(([regiao, data]) => {
                    const count = coudelariasPorRegiao[regiao]?.length || 0;
                    const isSelected = selectedRegiao === regiao;
                    const isHovered = hoveredRegiao === regiao;
                    const hasData = count > 0;

                    return (
                      <g key={regiao}>
                        <path
                          d={data.path}
                          fill={hasData ? (isSelected ? "url(#gold)" : isHovered ? "rgba(197, 160, 89, 0.4)" : "rgba(197, 160, 89, 0.12)") : "rgba(40, 40, 40, 0.6)"}
                          stroke={hasData ? "#C5A059" : "#333"}
                          strokeWidth={isSelected || isHovered ? 2 : 0.8}
                          className={`transition-all duration-200 ${hasData ? 'cursor-pointer' : ''}`}
                          onClick={() => hasData && setSelectedRegiao(isSelected ? null : regiao)}
                          onMouseEnter={() => hasData && setHoveredRegiao(regiao)}
                          onMouseLeave={() => setHoveredRegiao(null)}
                          filter={isSelected ? "url(#glow)" : "none"}
                        />

                        {hasData && (
                          <>
                            {/* Pulse */}
                            <circle cx={data.center.x} cy={data.center.y} r="18" fill="none" stroke="#C5A059" strokeWidth="0.5" opacity="0.3" className="animate-ping-slow" />

                            {/* Pin */}
                            <circle
                              cx={data.center.x}
                              cy={data.center.y}
                              r={isSelected ? 16 : isHovered ? 14 : 12}
                              fill={isSelected ? "url(#gold)" : data.color}
                              stroke="#fff"
                              strokeWidth="2"
                              className="cursor-pointer transition-all duration-200"
                              onClick={() => setSelectedRegiao(isSelected ? null : regiao)}
                              onMouseEnter={() => setHoveredRegiao(regiao)}
                              onMouseLeave={() => setHoveredRegiao(null)}
                            />

                            {/* Count */}
                            <text x={data.center.x} y={data.center.y + 4} textAnchor="middle" fill={isSelected ? "#000" : "#fff"} fontSize="12" fontWeight="bold" className="pointer-events-none">
                              {count}
                            </text>

                            {/* Tooltip */}
                            {(isHovered || isSelected) && (
                              <g>
                                <rect x={data.center.x - 35} y={data.center.y - 38} width="70" height="20" rx="4" fill="rgba(0,0,0,0.9)" stroke="#C5A059" strokeWidth="0.5" />
                                <text x={data.center.x} y={data.center.y - 24} textAnchor="middle" fill="#C5A059" fontSize="9" fontWeight="bold">
                                  {regiao.toUpperCase()}
                                </text>
                              </g>
                            )}
                          </>
                        )}
                      </g>
                    );
                  })}

                  {/* Region labels for empty regions */}
                  {Object.entries(portugalRegioes).map(([regiao, data]) => {
                    const count = coudelariasPorRegiao[regiao]?.length || 0;
                    if (count > 0) return null;
                    return (
                      <text key={`label-${regiao}`} x={data.center.x} y={data.center.y} textAnchor="middle" fill="#555" fontSize="8" className="pointer-events-none">
                        {regiao}
                      </text>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 p-3 bg-black/70 backdrop-blur border border-white/10 rounded-lg">
                  <h4 className="text-[9px] text-[#C5A059] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Eye size={10} /> Legenda
                  </h4>
                  <div className="space-y-1.5 text-[10px] text-zinc-400">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#C5A059]/20 border border-[#C5A059]" />
                      <span>Com coudelarias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#C5A059]" />
                      <span>Selecionada</span>
                    </div>
                  </div>
                </div>

                {/* Scale */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-zinc-500">
                  <div className="w-16 h-0.5 bg-zinc-600" />
                  <span>~100km</span>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                {selectedRegiao ? (
                  <motion.div key="selected" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="sticky top-28">
                    <div className="mb-4 p-4 bg-zinc-900/80 border border-[#C5A059]/30 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] text-[#C5A059] uppercase tracking-wider">Região</span>
                          <h2 className="text-xl font-serif text-white">{selectedRegiao}</h2>
                          <p className="text-zinc-400 text-sm"><span className="text-[#C5A059] font-bold">{coudelariasPorRegiao[selectedRegiao]?.length || 0}</span> coudelarias</p>
                        </div>
                        <button onClick={() => setSelectedRegiao(null)} className="p-1.5 text-zinc-500 hover:text-white bg-white/5 rounded-lg">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {coudelariasPorRegiao[selectedRegiao]?.map((c, i) => (
                        <CoudelariaCard key={c.id} coudelaria={c} index={i} onSelect={() => setSelectedCoudelaria(c)} isSelected={selectedCoudelaria?.id === c.id} />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="sticky top-28">
                    <div className="mb-4 p-4 bg-zinc-900/80 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="text-[#C5A059]" size={16} />
                        <h2 className="font-serif text-white">Explorar Regiões</h2>
                      </div>
                      <p className="text-zinc-500 text-xs">Selecione uma região no mapa</p>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(coudelariasPorRegiao).sort((a, b) => b[1].length - a[1].length).map(([regiao, list]) => (
                        <button key={regiao} onClick={() => setSelectedRegiao(regiao)} className="w-full p-3 bg-zinc-900/60 border border-white/5 rounded-lg hover:border-[#C5A059]/30 transition-colors text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-[#C5A059]/20 rounded-lg flex items-center justify-center">
                                <MapPin className="text-[#C5A059]" size={16} />
                              </div>
                              <div>
                                <h3 className="text-white font-serif text-sm">{regiao}</h3>
                                <p className="text-zinc-500 text-[10px]">{list.length} coudelarias</p>
                              </div>
                            </div>
                            <ChevronRight className="text-zinc-600" size={16} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div>
            {searchQuery && <p className="mb-4 text-zinc-400 text-sm"><span className="text-[#C5A059] font-bold">{filteredCoudelarias.length}</span> resultados</p>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(searchQuery ? filteredCoudelarias : coudelarias).map((c, i) => <GridCard key={c.id} coudelaria={c} index={i} />)}
            </div>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedCoudelaria && (
            <motion.div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCoudelaria(null)}>
              <motion.div className="bg-zinc-900 border border-white/10 max-w-md w-full rounded-xl overflow-hidden" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}>
                <div className="relative h-40">
                  <Image src={selectedCoudelaria.foto_capa || placeholderImages[0]} alt={selectedCoudelaria.nome} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  <button onClick={() => setSelectedCoudelaria(null)} className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-full"><X size={18} /></button>
                  {selectedCoudelaria.destaque && <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#C5A059] text-black px-2 py-0.5 text-xs font-bold rounded-full"><Star size={12} /> Destaque</div>}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-serif text-white mb-1">{selectedCoudelaria.nome}</h3>
                  <p className="text-zinc-400 text-sm flex items-center gap-1 mb-3"><MapPin size={12} className="text-[#C5A059]" />{selectedCoudelaria.localizacao}, {selectedCoudelaria.regiao}</p>
                  <p className="text-zinc-400 text-sm mb-4">{selectedCoudelaria.descricao}</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {selectedCoudelaria.telefone && <a href={`tel:${selectedCoudelaria.telefone}`} className="flex flex-col items-center p-2 bg-zinc-800 rounded-lg text-center"><Phone size={16} className="text-[#C5A059] mb-1" /><span className="text-[10px] text-zinc-400">Ligar</span></a>}
                    {selectedCoudelaria.email && <a href={`mailto:${selectedCoudelaria.email}`} className="flex flex-col items-center p-2 bg-zinc-800 rounded-lg text-center"><Mail size={16} className="text-[#C5A059] mb-1" /><span className="text-[10px] text-zinc-400">Email</span></a>}
                    {selectedCoudelaria.website && <a href={selectedCoudelaria.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-2 bg-zinc-800 rounded-lg text-center"><Globe size={16} className="text-[#C5A059] mb-1" /><span className="text-[10px] text-zinc-400">Website</span></a>}
                  </div>
                  <Link href={`/directorio/${selectedCoudelaria.slug}`} className="flex items-center justify-center gap-2 w-full bg-[#C5A059] text-black py-2.5 font-bold rounded-lg hover:bg-white transition-colors">
                    <Navigation size={16} /> Ver Página
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
        .animate-ping-slow { animation: ping-slow 2.5s ease-out infinite; }
      `}</style>
    </main>
  );
}
