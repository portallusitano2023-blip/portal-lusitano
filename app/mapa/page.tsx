"use client";

import { useState, useEffect, useRef } from "react";
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
  Filter,
  List,
  Grid,
  Navigation,
  Info,
} from "lucide-react";
import Link from "next/link";

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

// SVG paths detalhados para cada região de Portugal
const portugalRegioes = {
  "Minho": {
    path: "M75,45 L95,35 L120,40 L140,50 L145,70 L135,90 L115,95 L95,90 L75,80 L70,60 Z",
    center: { x: 105, y: 65 },
    color: "#C5A059",
  },
  "Douro": {
    path: "M140,50 L175,55 L195,75 L190,100 L165,115 L135,110 L135,90 L145,70 Z",
    center: { x: 160, y: 85 },
    color: "#D4AF61",
  },
  "Porto": {
    path: "M55,85 L75,80 L95,90 L100,110 L85,125 L60,120 L50,100 Z",
    center: { x: 75, y: 100 },
    color: "#B8965A",
  },
  "Centro": {
    path: "M60,120 L85,125 L100,110 L115,95 L135,110 L165,115 L175,145 L160,180 L130,195 L95,190 L70,175 L55,145 Z",
    center: { x: 115, y: 155 },
    color: "#C9A75F",
  },
  "Ribatejo": {
    path: "M95,190 L130,195 L145,220 L140,250 L115,260 L90,250 L80,220 Z",
    center: { x: 115, y: 225 },
    color: "#D9B96B",
  },
  "Lisboa": {
    path: "M45,200 L70,195 L80,220 L90,250 L75,275 L50,280 L35,260 L40,230 Z",
    center: { x: 60, y: 240 },
    color: "#C5A059",
  },
  "Alentejo": {
    path: "M75,275 L90,250 L115,260 L140,250 L165,270 L180,310 L175,370 L155,420 L120,440 L80,430 L55,400 L45,350 L50,300 Z",
    center: { x: 115, y: 350 },
    color: "#BF9A55",
  },
  "Algarve": {
    path: "M55,430 L80,430 L120,440 L155,420 L175,430 L180,455 L160,475 L120,485 L80,480 L50,465 L45,445 Z",
    center: { x: 115, y: 455 },
    color: "#D4AF61",
  },
};

// Placeholder images
const placeholderImages = [
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400",
  "https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=400",
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=400",
];

export default function MapaPage() {
  const [coudelarias, setCoudelarias] = useState<Coudelaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegiao, setSelectedRegiao] = useState<string | null>(null);
  const [selectedCoudelaria, setSelectedCoudelaria] = useState<Coudelaria | null>(null);
  const [hoveredRegiao, setHoveredRegiao] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showAllPins, setShowAllPins] = useState(true);
  const mapRef = useRef<SVGSVGElement>(null);

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

  // Agrupar coudelarias por região
  const coudelariasPorRegiao = coudelarias.reduce((acc, c) => {
    if (!acc[c.regiao]) acc[c.regiao] = [];
    acc[c.regiao].push(c);
    return acc;
  }, {} as Record<string, Coudelaria[]>);

  const regioes = Object.keys(coudelariasPorRegiao);
  const totalCoudelarias = coudelarias.length;

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      if (direction === "in") return Math.min(prev + 0.2, 2);
      return Math.max(prev - 0.2, 0.6);
    });
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Hero */}
      <section className="relative pt-32 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent" />

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#C5A059]/20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Compass className="text-[#C5A059]" size={16} />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059]">
                Mapa Interativo
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
              Descubra Portugal
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-8">
              {totalCoudelarias} coudelarias de elite espalhadas pelo país.
              Explore cada região e encontre o seu próximo Lusitano.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8">
              {Object.entries(coudelariasPorRegiao).slice(0, 4).map(([regiao, list], i) => (
                <motion.div
                  key={regiao}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-2xl font-serif text-[#C5A059]">{list.length}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">{regiao}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Controls */}
        <motion.div
          className="flex items-center justify-between mb-8 p-4 bg-zinc-900/50 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                viewMode === "map"
                  ? "bg-[#C5A059] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Grid size={18} />
              Mapa
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                viewMode === "list"
                  ? "bg-[#C5A059] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <List size={18} />
              Lista
            </button>
          </div>

          {viewMode === "map" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom("out")}
                className="p-2 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-zinc-500 text-sm w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom("in")}
                className="p-2 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-2 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors ml-2"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Compass className="text-[#C5A059]" size={48} />
            </motion.div>
            <p className="text-zinc-400 mt-4">A carregar mapa...</p>
          </div>
        ) : viewMode === "map" ? (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Mapa SVG Interativo */}
            <motion.div
              className="lg:col-span-3 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div
                className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-lg overflow-hidden"
                style={{ minHeight: "600px" }}
              >
                {/* Compass Rose */}
                <div className="absolute top-4 right-4 z-10 opacity-30">
                  <svg width="60" height="60" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#C5A059" strokeWidth="1" />
                    <path d="M50,5 L55,45 L50,35 L45,45 Z" fill="#C5A059" />
                    <path d="M50,95 L55,55 L50,65 L45,55 Z" fill="#666" />
                    <path d="M5,50 L45,45 L35,50 L45,55 Z" fill="#666" />
                    <path d="M95,50 L55,45 L65,50 L55,55 Z" fill="#666" />
                    <text x="50" y="15" textAnchor="middle" fill="#C5A059" fontSize="10">N</text>
                  </svg>
                </div>

                {/* Mapa de Portugal */}
                <svg
                  ref={mapRef}
                  viewBox="0 0 230 520"
                  className="w-full h-auto transition-transform duration-300"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "center center"
                  }}
                >
                  {/* Definições de gradientes e filtros */}
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C5A059" />
                      <stop offset="50%" stopColor="#E8D5A3" />
                      <stop offset="100%" stopColor="#C5A059" />
                    </linearGradient>
                    <radialGradient id="pinGlow">
                      <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Oceano Atlântico */}
                  <rect x="0" y="0" width="60" height="520" fill="url(#oceanGradient)" opacity="0.1" />

                  {/* Contorno de Portugal */}
                  <path
                    d="M75,45 L95,35 L120,40 L140,50 L175,55 L195,75 L190,100 L165,115 L175,145 L160,180 L145,220 L165,270 L180,310 L175,370 L155,420 L175,430 L180,455 L160,475 L120,485 L80,480 L50,465 L45,445 L55,430 L80,430 L55,400 L45,350 L50,300 L35,260 L40,230 L45,200 L55,145 L70,175 L70,60 Z"
                    fill="none"
                    stroke="#C5A059"
                    strokeWidth="2"
                    strokeDasharray="500"
                    strokeDashoffset="500"
                    className="animate-draw"
                    style={{
                      animation: "draw 2s ease-out forwards"
                    }}
                  />

                  {/* Regiões */}
                  {Object.entries(portugalRegioes).map(([regiao, data]) => {
                    const count = coudelariasPorRegiao[regiao]?.length || 0;
                    const isSelected = selectedRegiao === regiao;
                    const isHovered = hoveredRegiao === regiao;

                    return (
                      <g key={regiao}>
                        {/* Região */}
                        <motion.path
                          d={data.path}
                          fill={count > 0
                            ? isSelected
                              ? "url(#goldGradient)"
                              : isHovered
                                ? "rgba(197, 160, 89, 0.4)"
                                : "rgba(197, 160, 89, 0.15)"
                            : "rgba(50, 50, 50, 0.5)"
                          }
                          stroke={count > 0 ? "#C5A059" : "#333"}
                          strokeWidth={isSelected || isHovered ? 2 : 1}
                          className="cursor-pointer transition-all duration-300"
                          onClick={() => count > 0 && setSelectedRegiao(isSelected ? null : regiao)}
                          onMouseEnter={() => count > 0 && setHoveredRegiao(regiao)}
                          onMouseLeave={() => setHoveredRegiao(null)}
                          filter={isSelected ? "url(#glow)" : "none"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + Math.random() * 0.5 }}
                        />

                        {/* Pin animado para regiões com coudelarias */}
                        {count > 0 && showAllPins && (
                          <g>
                            {/* Círculo de pulso */}
                            <motion.circle
                              cx={data.center.x}
                              cy={data.center.y}
                              r={isSelected ? 20 : 15}
                              fill="url(#pinGlow)"
                              animate={{
                                r: isSelected ? [20, 30, 20] : [15, 22, 15],
                                opacity: [0.5, 0.2, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />

                            {/* Pin principal */}
                            <motion.circle
                              cx={data.center.x}
                              cy={data.center.y}
                              r={isSelected ? 18 : isHovered ? 15 : 12}
                              fill={isSelected ? "#C5A059" : "rgba(197, 160, 89, 0.8)"}
                              stroke="#fff"
                              strokeWidth="2"
                              className="cursor-pointer"
                              onClick={() => setSelectedRegiao(isSelected ? null : regiao)}
                              onMouseEnter={() => setHoveredRegiao(regiao)}
                              onMouseLeave={() => setHoveredRegiao(null)}
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            />

                            {/* Número de coudelarias */}
                            <text
                              x={data.center.x}
                              y={data.center.y + 4}
                              textAnchor="middle"
                              fill={isSelected ? "#000" : "#fff"}
                              fontSize="12"
                              fontWeight="bold"
                              className="pointer-events-none"
                            >
                              {count}
                            </text>
                          </g>
                        )}

                        {/* Label da região (aparece ao hover) */}
                        {(isHovered || isSelected) && count > 0 && (
                          <motion.g
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <rect
                              x={data.center.x - 35}
                              y={data.center.y - 40}
                              width="70"
                              height="22"
                              fill="rgba(0,0,0,0.9)"
                              stroke="#C5A059"
                              strokeWidth="1"
                              rx="4"
                            />
                            <text
                              x={data.center.x}
                              y={data.center.y - 25}
                              textAnchor="middle"
                              fill="#C5A059"
                              fontSize="10"
                              fontWeight="bold"
                              className="uppercase tracking-wider"
                            >
                              {regiao}
                            </text>
                          </motion.g>
                        )}
                      </g>
                    );
                  })}

                  {/* Linhas decorativas de latitude/longitude */}
                  {[100, 200, 300, 400].map((y) => (
                    <line
                      key={y}
                      x1="20"
                      y1={y}
                      x2="210"
                      y2={y}
                      stroke="#C5A059"
                      strokeWidth="0.5"
                      strokeDasharray="5,10"
                      opacity="0.1"
                    />
                  ))}
                </svg>

                {/* Legenda */}
                <div className="absolute bottom-4 left-4 p-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded">
                  <h4 className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Legenda</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#C5A059]/30 border border-[#C5A059]" />
                      <span className="text-xs text-zinc-400">Região com coudelarias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#C5A059]" />
                      <span className="text-xs text-zinc-400">Região selecionada</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Painel de Informações */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {selectedRegiao ? (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-serif text-white">{selectedRegiao}</h2>
                        <p className="text-zinc-400">
                          {coudelariasPorRegiao[selectedRegiao]?.length || 0} coudelarias
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedRegiao(null)}
                        className="p-2 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {coudelariasPorRegiao[selectedRegiao]?.map((coudelaria, index) => (
                        <CoudelariaMapCard
                          key={coudelaria.id}
                          coudelaria={coudelaria}
                          index={index}
                          onSelect={() => setSelectedCoudelaria(coudelaria)}
                          isSelected={selectedCoudelaria?.id === coudelaria.id}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-serif text-white mb-2">Explorar Regiões</h2>
                      <p className="text-zinc-400 text-sm">
                        Clique numa região no mapa ou selecione abaixo
                      </p>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(coudelariasPorRegiao)
                        .sort((a, b) => b[1].length - a[1].length)
                        .map(([regiao, list], index) => (
                          <motion.button
                            key={regiao}
                            onClick={() => setSelectedRegiao(regiao)}
                            className="w-full flex items-center justify-between p-4 bg-zinc-900/50 border border-white/10 hover:border-[#C5A059]/50 transition-all group"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059]/20 to-transparent rounded-lg flex items-center justify-center border border-[#C5A059]/30">
                                <MapPin className="text-[#C5A059]" size={20} />
                              </div>
                              <div className="text-left">
                                <h3 className="text-white font-serif group-hover:text-[#C5A059] transition-colors">
                                  {regiao}
                                </h3>
                                <p className="text-zinc-500 text-sm">
                                  {list.length} coudelaria{list.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {list.some(c => c.destaque) && (
                                <Star size={16} className="text-[#C5A059]" />
                              )}
                              <ChevronRight className="text-zinc-500 group-hover:text-[#C5A059] transition-colors" />
                            </div>
                          </motion.button>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          /* Vista em Lista */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {coudelarias.map((coudelaria, index) => (
              <CoudelariaGridCard
                key={coudelaria.id}
                coudelaria={coudelaria}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Modal de Coudelaria */}
        <AnimatePresence>
          {selectedCoudelaria && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCoudelaria(null)}
            >
              <motion.div
                className="bg-zinc-900 border border-white/10 max-w-lg w-full relative overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header com imagem */}
                <div className="relative h-48">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        selectedCoudelaria.foto_capa || placeholderImages[0]
                      })`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  <button
                    onClick={() => setSelectedCoudelaria(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-black transition-colors"
                  >
                    <X size={20} />
                  </button>
                  {selectedCoudelaria.destaque && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#C5A059] text-black px-3 py-1 text-sm font-bold">
                      <Star size={14} />
                      Destaque
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-white mb-2">
                    {selectedCoudelaria.nome}
                  </h3>

                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                    <MapPin size={14} className="text-[#C5A059]" />
                    {selectedCoudelaria.localizacao}, {selectedCoudelaria.regiao}
                  </div>

                  <p className="text-zinc-400 mb-6 line-clamp-3">
                    {selectedCoudelaria.descricao}
                  </p>

                  {selectedCoudelaria.especialidades && selectedCoudelaria.especialidades.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedCoudelaria.especialidades.slice(0, 3).map((esp) => (
                        <span
                          key={esp}
                          className="text-xs bg-[#C5A059]/10 text-[#C5A059] px-2 py-1"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    {selectedCoudelaria.telefone && (
                      <a
                        href={`tel:${selectedCoudelaria.telefone}`}
                        className="flex items-center gap-3 text-zinc-300 hover:text-[#C5A059] transition-colors"
                      >
                        <Phone size={16} className="text-[#C5A059]" />
                        {selectedCoudelaria.telefone}
                      </a>
                    )}
                    {selectedCoudelaria.email && (
                      <a
                        href={`mailto:${selectedCoudelaria.email}`}
                        className="flex items-center gap-3 text-zinc-300 hover:text-[#C5A059] transition-colors"
                      >
                        <Mail size={16} className="text-[#C5A059]" />
                        {selectedCoudelaria.email}
                      </a>
                    )}
                    {selectedCoudelaria.website && (
                      <a
                        href={selectedCoudelaria.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-zinc-300 hover:text-[#C5A059] transition-colors"
                      >
                        <Globe size={16} className="text-[#C5A059]" />
                        Website
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/directorio/${selectedCoudelaria.slug}`}
                    className="flex items-center justify-center gap-2 w-full bg-[#C5A059] text-black py-3 font-bold uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    <Navigation size={18} />
                    Ver Página Completa
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CSS para animação */}
      <style jsx global>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </main>
  );
}

function CoudelariaMapCard({
  coudelaria,
  index,
  onSelect,
  isSelected,
}: {
  coudelaria: Coudelaria;
  index: number;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const image = coudelaria.foto_capa || placeholderImages[index % placeholderImages.length];

  return (
    <motion.button
      onClick={onSelect}
      className={`w-full text-left p-4 border transition-all ${
        isSelected
          ? "bg-[#C5A059]/10 border-[#C5A059]"
          : "bg-zinc-900/50 border-white/10 hover:border-[#C5A059]/50"
      }`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={coudelaria.nome}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-serif truncate">{coudelaria.nome}</h3>
            {coudelaria.destaque && (
              <Star size={14} className="text-[#C5A059] flex-shrink-0" />
            )}
          </div>
          <p className="text-zinc-500 text-sm mb-2">{coudelaria.localizacao}</p>
          <p className="text-zinc-400 text-sm line-clamp-2">{coudelaria.descricao}</p>
        </div>
      </div>
    </motion.button>
  );
}

function CoudelariaGridCard({
  coudelaria,
  index,
}: {
  coudelaria: Coudelaria;
  index: number;
}) {
  const image = coudelaria.foto_capa || placeholderImages[index % placeholderImages.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/directorio/${coudelaria.slug}`}
        className="group block bg-zinc-900/50 border border-white/10 hover:border-[#C5A059]/50 overflow-hidden transition-all"
      >
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          {coudelaria.destaque && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#C5A059] text-black px-2 py-1 text-xs font-bold">
              <Star size={12} />
              Destaque
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-black/60 text-[#C5A059] px-2 py-1 text-xs">
            {coudelaria.regiao}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-serif group-hover:text-[#C5A059] transition-colors mb-1">
            {coudelaria.nome}
          </h3>
          <p className="text-zinc-500 text-sm mb-2 flex items-center gap-1">
            <MapPin size={12} />
            {coudelaria.localizacao}
          </p>
          <p className="text-zinc-400 text-sm line-clamp-2">{coudelaria.descricao}</p>
        </div>
      </Link>
    </motion.div>
  );
}
