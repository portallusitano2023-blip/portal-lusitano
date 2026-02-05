"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Award,
  ChevronRight,
  X,
  Star,
  Dna,
} from "lucide-react";

interface CavaloFamoso {
  nome: string;
  ano: string;
  conquistas: string;
}

interface Linhagem {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  historia: string;
  origem: string;
  fundador?: string;
  ano_fundacao?: number;
  caracteristicas: string[];
  cores_comuns: string[];
  temperamento?: string;
  aptidoes: string[];
  cavalos_famosos?: CavaloFamoso[];
  coudelarias_principais?: string[];
  imagem_capa?: string;
}

// Imagens placeholder para linhagens
const linhagemImages: Record<string, string> = {
  Veiga: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800",
  Andrade: "https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=800",
  "Alter Real": "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800",
  "Coudelaria Nacional": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
};

export default function LinhagenPage() {
  const [linhagens, setLinhagens] = useState<Linhagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLinhagem, setSelectedLinhagem] = useState<Linhagem | null>(null);

  useEffect(() => {
    async function fetchLinhagens() {
      try {
        const res = await fetch("/api/linhagens");
        if (res.ok) {
          const data = await res.json();
          setLinhagens(data.linhagens || []);
        }
      } catch (error) {
        console.error("Erro ao carregar linhagens:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLinhagens();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
              Conhecimento
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              Guia das Linhagens
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Descubra a história e as características das principais linhagens
              do cavalo Lusitano. Séculos de seleção e tradição equestre.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Introdução */}
        <motion.div
          className="mb-16 p-8 bg-zinc-900/50 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Dna className="text-[#C5A059]" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white mb-4">
                A Importância das Linhagens
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                O cavalo Lusitano possui linhagens distintas que foram desenvolvidas ao longo
                de séculos por famílias dedicadas à criação. Cada linhagem tem características
                próprias em termos de conformação, temperamento e aptidões. Conhecer estas
                linhagens é fundamental para quem procura um Lusitano, seja para competição,
                trabalho ou lazer. A preservação destas linhas genéticas é essencial para
                manter a qualidade e diversidade da raça.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-[#C5A059]">A carregar linhagens...</div>
          </div>
        ) : linhagens.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto text-zinc-600 mb-4" size={48} />
            <h3 className="text-xl font-serif text-white mb-2">
              Informação em breve
            </h3>
            <p className="text-zinc-500">
              O guia das linhagens está a ser preparado.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {linhagens.map((linhagem, index) => (
              <LinhagemCard
                key={linhagem.id}
                linhagem={linhagem}
                index={index}
                onSelect={() => setSelectedLinhagem(linhagem)}
              />
            ))}
          </div>
        )}

        {/* Árvore Genealógica Simplificada */}
        <motion.section
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-serif text-white mb-8 text-center">
            Influência das Linhagens
          </h2>
          <div className="relative">
            <div className="grid grid-cols-4 gap-4">
              {["Veiga", "Andrade", "Alter Real", "Coudelaria Nacional"].map((nome, i) => (
                <div
                  key={nome}
                  className="text-center p-6 bg-zinc-900/50 border border-white/10 hover:border-[#C5A059]/50 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-serif text-[#C5A059]">
                      {nome.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-white font-serif mb-2">{nome}</h3>
                  <p className="text-zinc-500 text-sm">
                    {i === 0 && "Alta Escola"}
                    {i === 1 && "Trabalho"}
                    {i === 2 && "Tradição Real"}
                    {i === 3 && "Versatilidade"}
                  </p>
                </div>
              ))}
            </div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent -z-10" />
          </div>
        </motion.section>

        {/* Dicas para Escolher */}
        <motion.section
          className="mt-20 p-8 bg-gradient-to-r from-[#C5A059]/10 via-transparent to-[#C5A059]/10 border border-[#C5A059]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif text-white mb-6 text-center">
            Como Escolher a Linhagem Ideal?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-[#C5A059] rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-bold">1</span>
              </div>
              <h3 className="text-white font-serif mb-2">Defina o Objetivo</h3>
              <p className="text-zinc-400 text-sm">
                Dressage, trabalho, lazer ou reprodução? Cada linhagem tem aptidões específicas.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-[#C5A059] rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-bold">2</span>
              </div>
              <h3 className="text-white font-serif mb-2">Considere o Temperamento</h3>
              <p className="text-zinc-400 text-sm">
                Algumas linhagens são mais sensíveis, outras mais robustas. Escolha conforme a sua experiência.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-[#C5A059] rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-bold">3</span>
              </div>
              <h3 className="text-white font-serif mb-2">Visite Coudelarias</h3>
              <p className="text-zinc-400 text-sm">
                Conheça cavalos de diferentes linhagens pessoalmente. Cada exemplar é único.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Modal de Linhagem */}
        {selectedLinhagem && (
          <LinhagemModal
            linhagem={selectedLinhagem}
            onClose={() => setSelectedLinhagem(null)}
          />
        )}
      </div>
    </main>
  );
}

function LinhagemCard({
  linhagem,
  index,
  onSelect,
}: {
  linhagem: Linhagem;
  index: number;
  onSelect: () => void;
}) {
  const image = linhagem.imagem_capa || linhagemImages[linhagem.nome] || linhagemImages["Veiga"];

  return (
    <motion.button
      onClick={onSelect}
      className="text-left group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="relative h-80">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 border border-white/10 group-hover:border-[#C5A059]/50 transition-colors" />

        {/* Badge de origem */}
        {linhagem.ano_fundacao && (
          <div className="absolute top-4 left-4 bg-black/60 text-[#C5A059] px-3 py-1 text-sm flex items-center gap-2">
            <Calendar size={14} />
            Desde {linhagem.ano_fundacao}
          </div>
        )}

        {/* Conteúdo */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-serif text-white group-hover:text-[#C5A059] transition-colors mb-2">
            Linhagem {linhagem.nome}
          </h3>

          {linhagem.origem && (
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
              <MapPin size={14} className="text-[#C5A059]" />
              {linhagem.origem}
            </div>
          )}

          <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
            {linhagem.descricao}
          </p>

          {/* Aptidões */}
          {linhagem.aptidoes && linhagem.aptidoes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {linhagem.aptidoes.slice(0, 3).map((apt) => (
                <span
                  key={apt}
                  className="text-xs bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5"
                >
                  {apt}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-[#C5A059] text-sm">
            Saber mais
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function LinhagemModal({
  linhagem,
  onClose,
}: {
  linhagem: Linhagem;
  onClose: () => void;
}) {
  const image = linhagem.imagem_capa || linhagemImages[linhagem.nome] || linhagemImages["Veiga"];

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-zinc-900 border border-white/10 max-w-4xl w-full my-8 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header com imagem */}
        <div className="relative h-48 md:h-64">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-3xl font-serif text-white">
              Linhagem {linhagem.nome}
            </h2>
            {linhagem.origem && (
              <p className="text-[#C5A059] mt-2">
                {linhagem.origem}
                {linhagem.ano_fundacao && ` • Desde ${linhagem.ano_fundacao}`}
              </p>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-8">
          {/* Fundador */}
          {linhagem.fundador && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-[#C5A059]/10 border border-[#C5A059]/20">
              <Users className="text-[#C5A059]" size={24} />
              <div>
                <div className="text-zinc-500 text-xs uppercase">Fundador</div>
                <div className="text-white font-serif">{linhagem.fundador}</div>
              </div>
            </div>
          )}

          {/* História */}
          <div className="mb-8">
            <h3 className="text-lg font-serif text-white mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-[#C5A059]" />
              História
            </h3>
            <p className="text-zinc-400 leading-relaxed">{linhagem.historia}</p>
          </div>

          {/* Características */}
          {linhagem.caracteristicas && linhagem.caracteristicas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-serif text-white mb-3">Características</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {linhagem.caracteristicas.map((car, i) => (
                  <li key={i} className="flex items-center gap-2 text-zinc-400">
                    <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                    {car}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Temperamento */}
          {linhagem.temperamento && (
            <div className="mb-8">
              <h3 className="text-lg font-serif text-white mb-3">Temperamento</h3>
              <p className="text-zinc-400">{linhagem.temperamento}</p>
            </div>
          )}

          {/* Cores e Aptidões */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {linhagem.cores_comuns && linhagem.cores_comuns.length > 0 && (
              <div>
                <h3 className="text-lg font-serif text-white mb-3">Cores Comuns</h3>
                <div className="flex flex-wrap gap-2">
                  {linhagem.cores_comuns.map((cor) => (
                    <span key={cor} className="bg-zinc-800 text-zinc-300 px-3 py-1 text-sm">
                      {cor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {linhagem.aptidoes && linhagem.aptidoes.length > 0 && (
              <div>
                <h3 className="text-lg font-serif text-white mb-3">Aptidões</h3>
                <div className="flex flex-wrap gap-2">
                  {linhagem.aptidoes.map((apt) => (
                    <span key={apt} className="bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 text-sm">
                      {apt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lusitanos Notáveis */}
          {linhagem.cavalos_famosos && linhagem.cavalos_famosos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-serif text-white mb-3 flex items-center gap-2">
                <Award size={18} className="text-[#C5A059]" />
                Lusitanos Notáveis
              </h3>
              <div className="space-y-3">
                {linhagem.cavalos_famosos.map((cavalo, i) => (
                  <div key={i} className="p-4 bg-zinc-800/50 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={14} className="text-[#C5A059]" />
                      <span className="text-white font-serif">{cavalo.nome}</span>
                      {cavalo.ano && (
                        <span className="text-zinc-500 text-sm">({cavalo.ano})</span>
                      )}
                    </div>
                    {cavalo.conquistas && (
                      <p className="text-zinc-400 text-sm pl-5">{cavalo.conquistas}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coudelarias Principais */}
          {linhagem.coudelarias_principais && linhagem.coudelarias_principais.length > 0 && (
            <div>
              <h3 className="text-lg font-serif text-white mb-3">Coudelarias de Referência</h3>
              <div className="flex flex-wrap gap-2">
                {linhagem.coudelarias_principais.map((coud) => (
                  <span key={coud} className="bg-zinc-800 text-zinc-300 px-3 py-1 text-sm">
                    {coud}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
