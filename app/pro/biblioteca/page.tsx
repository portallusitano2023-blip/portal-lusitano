"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Download,
  Eye,
  Clock,
  Star,
  Lock,
  Search,
  Filter,
  ChevronRight,
  FileText,
  Users,
  Award,
  Bookmark,
  Play,
} from "lucide-react";
import Link from "next/link";

// Dados dos Ebooks
const ebooks = [
  {
    id: "guia-completo-lusitano",
    title: "Guia Completo do Cavalo Lusitano",
    subtitle: "Da História à Excelência Moderna",
    description:
      "O guia definitivo sobre o cavalo Lusitano. Desde as suas origens milenares até aos padrões modernos de excelência. Inclui linhagens, características, e tudo o que precisas saber.",
    cover: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=600&fit=crop",
    author: "Portal Lusitano",
    pages: 120,
    readTime: "3 horas",
    rating: 4.9,
    reviews: 156,
    category: "Fundamentos",
    level: "Iniciante",
    free: false,
    new: true,
    chapters: [
      "1. Origens e História",
      "2. Características da Raça",
      "3. Linhagens de Elite",
      "4. Padrões Morfológicos",
      "5. O Lusitano no Mundo",
    ],
  },
  {
    id: "manual-criador",
    title: "Manual do Criador Profissional",
    subtitle: "Gestão de Coudelaria de A a Z",
    description:
      "Tudo sobre gestão de coudelaria: reprodução, nutrição, instalações, custos, marketing e venda. O guia que todo o criador precisa.",
    cover: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=400&h=600&fit=crop",
    author: "Portal Lusitano",
    pages: 200,
    readTime: "5 horas",
    rating: 4.8,
    reviews: 89,
    category: "Criação",
    level: "Avançado",
    free: false,
    new: false,
    chapters: [
      "1. Planeamento da Coudelaria",
      "2. Reprodução e Genética",
      "3. Gestão de Éguas e Poldros",
      "4. Nutrição Equina",
      "5. Instalações e Equipamentos",
      "6. Marketing e Vendas",
    ],
  },
  {
    id: "linhagens-elite",
    title: "Linhagens de Elite",
    subtitle: "Os Garanhões que Fizeram História",
    description:
      "Análise detalhada das linhagens mais importantes do cavalo Lusitano. Árvores genealógicas, características hereditárias e o impacto na raça.",
    cover: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=400&h=600&fit=crop",
    author: "Portal Lusitano",
    pages: 150,
    readTime: "4 horas",
    rating: 5.0,
    reviews: 234,
    category: "Genética",
    level: "Intermédio",
    free: false,
    new: false,
    chapters: [
      "1. A Importância das Linhagens",
      "2. Veiga - O Legado",
      "3. Andrade - A Elegância",
      "4. Alter Real - A Tradição",
      "5. Outras Linhagens Importantes",
    ],
  },
  {
    id: "introducao-lusitano",
    title: "Introdução ao Lusitano",
    subtitle: "O Primeiro Passo",
    description:
      "Ebook gratuito para iniciantes. Aprende o básico sobre o cavalo Lusitano: história resumida, características principais e porquê é tão especial.",
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
    author: "Portal Lusitano",
    pages: 30,
    readTime: "45 min",
    rating: 4.7,
    reviews: 512,
    category: "Fundamentos",
    level: "Iniciante",
    free: true,
    new: false,
    chapters: [
      "1. O que é o Cavalo Lusitano?",
      "2. História em 10 Minutos",
      "3. Características Únicas",
      "4. Próximos Passos",
    ],
  },
  {
    id: "treino-dressage",
    title: "Treino de Dressage",
    subtitle: "Do Desbaste ao Grand Prix",
    description:
      "Metodologia completa de treino para dressage. Desde o desbaste inicial até aos movimentos avançados de Grand Prix. Com ilustrações e exercícios práticos.",
    cover: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&h=600&fit=crop",
    author: "Portal Lusitano",
    pages: 180,
    readTime: "4.5 horas",
    rating: 4.9,
    reviews: 178,
    category: "Treino",
    level: "Avançado",
    free: false,
    new: true,
    chapters: [
      "1. Fundamentos do Desbaste",
      "2. Trabalho à Guia",
      "3. Primeiras Lições Montadas",
      "4. Movimentos Básicos",
      "5. Transições e Coleção",
      "6. Movimentos Avançados",
    ],
  },
  {
    id: "saude-equina",
    title: "Saúde Equina Essencial",
    subtitle: "Prevenção e Primeiros Socorros",
    description:
      "Guia prático sobre saúde equina. Vacinação, desparasitação, sinais de alerta, primeiros socorros e quando chamar o veterinário.",
    cover: "https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=400&h=600&fit=crop",
    author: "Portal Lusitano",
    pages: 90,
    readTime: "2 horas",
    rating: 4.8,
    reviews: 145,
    category: "Saúde",
    level: "Todos",
    free: false,
    new: false,
    chapters: [
      "1. Calendário de Saúde",
      "2. Sinais de Alerta",
      "3. Primeiros Socorros",
      "4. Nutrição e Saúde",
      "5. Emergências Comuns",
    ],
  },
];

const categories = ["Todos", "Fundamentos", "Criação", "Genética", "Treino", "Saúde"];
const levels = ["Todos", "Iniciante", "Intermédio", "Avançado"];

export default function BibliotecaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const filteredEbooks = ebooks.filter((ebook) => {
    const matchesSearch =
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || ebook.category === selectedCategory;
    const matchesLevel = selectedLevel === "Todos" || ebook.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif text-white mb-4">
            Biblioteca <span className="text-[#C5A059]">PRO</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Acede a dezenas de ebooks exclusivos sobre o cavalo Lusitano.
            Conhecimento de elite, escrito por especialistas.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="text"
                placeholder="Pesquisar ebooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 pl-12 pr-4 py-4 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 px-6 py-4 text-zinc-400 hover:text-white hover:border-[#C5A059] transition-colors"
            >
              <Filter size={20} />
              <span>Filtros</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-zinc-900/50 border border-white/5 p-6 mb-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-3">Categoria</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 text-sm transition-colors ${
                            selectedCategory === cat
                              ? "bg-[#C5A059] text-black"
                              : "bg-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-3">Nível</label>
                    <div className="flex flex-wrap gap-2">
                      {levels.map((level) => (
                        <button
                          key={level}
                          onClick={() => setSelectedLevel(level)}
                          className={`px-4 py-2 text-sm transition-colors ${
                            selectedLevel === level
                              ? "bg-[#C5A059] text-black"
                              : "bg-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, label: "Ebooks", value: ebooks.length },
            { icon: FileText, label: "Páginas", value: "800+" },
            { icon: Users, label: "Leitores", value: "2.5K+" },
            { icon: Award, label: "Avaliação Média", value: "4.9" },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 text-center">
              <stat.icon className="text-[#C5A059] mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-zinc-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Ebooks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEbooks.map((ebook, index) => (
            <motion.div
              key={ebook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-zinc-900/50 border border-white/5 overflow-hidden hover:border-[#C5A059]/30 transition-all"
            >
              {/* Cover */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={ebook.cover}
                  alt={ebook.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {ebook.new && (
                    <span className="bg-[#C5A059] text-black text-[10px] font-bold px-2 py-1 uppercase">
                      Novo
                    </span>
                  )}
                  {ebook.free && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 uppercase">
                      Grátis
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/pro/biblioteca/${ebook.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#C5A059] text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    <Eye size={16} />
                    Ler Agora
                  </Link>
                  <button className="bg-white/10 backdrop-blur-sm p-3 hover:bg-white/20 transition-colors">
                    <Bookmark size={16} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">
                    {ebook.category}
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    {ebook.level}
                  </span>
                </div>

                <h3 className="text-xl font-serif text-white mb-1 group-hover:text-[#C5A059] transition-colors">
                  {ebook.title}
                </h3>
                <p className="text-zinc-500 text-sm mb-4">{ebook.subtitle}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-zinc-500">
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {ebook.pages} págs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {ebook.readTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="text-[#C5A059] fill-[#C5A059]" size={14} />
                    <span className="text-white font-medium">{ebook.rating}</span>
                    <span className="text-zinc-600">({ebook.reviews})</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEbooks.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="text-zinc-700 mx-auto mb-4" size={48} />
            <h3 className="text-xl text-white mb-2">Nenhum ebook encontrado</h3>
            <p className="text-zinc-500">Tenta ajustar os filtros ou a pesquisa</p>
          </div>
        )}
      </div>
    </main>
  );
}
