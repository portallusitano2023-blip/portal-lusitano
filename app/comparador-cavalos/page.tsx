"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Scale, Trophy, Heart, Ruler, Calendar, MapPin, Euro, Star } from "lucide-react";

interface HorseToCompare {
  id: string;
  nome: string;
  idade: number;
  sexo: "Macho" | "Fêmea" | "Castrado";
  altura: number; // em cm
  peso: number; // em kg
  cor: string;
  linhagem: "Desconhecida" | "Registada" | "Premium" | "Elite";
  nivel_treino: "Desbravado" | "Iniciado" | "Intermédio" | "Avançado" | "Alta Escola";
  temperamento: number; // 1-10
  saude: number; // 1-10
  competicoes: number;
  premios: number;
  preco: number;
  localizacao: string;
}

const emptyHorse: HorseToCompare = {
  id: "",
  nome: "",
  idade: 5,
  sexo: "Macho",
  altura: 160,
  peso: 500,
  cor: "Ruço",
  linhagem: "Registada",
  nivel_treino: "Iniciado",
  temperamento: 7,
  saude: 8,
  competicoes: 0,
  premios: 0,
  preco: 15000,
  localizacao: "",
};

const cores = ["Ruço", "Castanho", "Preto", "Alazão", "Baio", "Palomino", "Tordilho", "Malhado"];
const linhagens = ["Desconhecida", "Registada", "Premium", "Elite"];
const niveis_treino = ["Desbravado", "Iniciado", "Intermédio", "Avançado", "Alta Escola"];
const sexos = ["Macho", "Fêmea", "Castrado"];

export default function ComparadorCavalosPage() {
  const [cavalos, setCavalos] = useState<HorseToCompare[]>([
    { ...emptyHorse, id: "1", nome: "Cavalo A" },
    { ...emptyHorse, id: "2", nome: "Cavalo B" },
  ]);

  const adicionarCavalo = () => {
    if (cavalos.length >= 4) return;
    const novoId = String(Date.now());
    setCavalos([...cavalos, { ...emptyHorse, id: novoId, nome: `Cavalo ${String.fromCharCode(65 + cavalos.length)}` }]);
  };

  const removerCavalo = (id: string) => {
    if (cavalos.length <= 2) return;
    setCavalos(cavalos.filter((c) => c.id !== id));
  };

  const atualizarCavalo = (id: string, campo: keyof HorseToCompare, valor: any) => {
    setCavalos(cavalos.map((c) => (c.id === id ? { ...c, [campo]: valor } : c)));
  };

  const getMelhorValor = (campo: keyof HorseToCompare, maiorMelhor = true) => {
    const valores = cavalos.map((c) => c[campo] as number);
    return maiorMelhor ? Math.max(...valores) : Math.min(...valores);
  };

  const getClassePontuacao = (valor: number, melhor: number, maiorMelhor = true) => {
    if (maiorMelhor) {
      return valor === melhor ? "text-green-400 font-bold" : valor < melhor * 0.7 ? "text-red-400" : "text-zinc-300";
    }
    return valor === melhor ? "text-green-400 font-bold" : valor > melhor * 1.3 ? "text-red-400" : "text-zinc-300";
  };

  const calcularPontuacaoGlobal = (cavalo: HorseToCompare): number => {
    let pontuacao = 0;

    // Idade (ideal entre 6-12 anos)
    if (cavalo.idade >= 6 && cavalo.idade <= 12) pontuacao += 10;
    else if (cavalo.idade >= 4 && cavalo.idade <= 15) pontuacao += 7;
    else pontuacao += 4;

    // Altura (ideal 155-165cm)
    if (cavalo.altura >= 155 && cavalo.altura <= 165) pontuacao += 10;
    else if (cavalo.altura >= 150 && cavalo.altura <= 170) pontuacao += 7;
    else pontuacao += 4;

    // Linhagem
    const linhagemPontos = { Desconhecida: 2, Registada: 5, Premium: 8, Elite: 10 };
    pontuacao += linhagemPontos[cavalo.linhagem];

    // Nível de treino
    const treinoPontos = { Desbravado: 2, Iniciado: 4, Intermédio: 6, Avançado: 8, "Alta Escola": 10 };
    pontuacao += treinoPontos[cavalo.nivel_treino];

    // Temperamento e saúde
    pontuacao += cavalo.temperamento;
    pontuacao += cavalo.saude;

    // Competições e prémios (bónus)
    pontuacao += Math.min(cavalo.competicoes * 0.5, 5);
    pontuacao += Math.min(cavalo.premios * 1, 5);

    return Math.round(pontuacao);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6 touch-manipulation"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar</span>
        </Link>

        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
            Ferramentas Lusitano
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4">
            Comparador de Cavalos
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Compare até 4 cavalos lado a lado para tomar a melhor decisão na sua compra ou criação.
          </p>
        </div>
      </div>

      {/* Adicionar Cavalo Button */}
      {cavalos.length < 4 && (
        <div className="max-w-7xl mx-auto mb-6">
          <button
            onClick={adicionarCavalo}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all touch-manipulation"
          >
            <Plus size={18} />
            <span className="text-sm">Adicionar Cavalo</span>
          </button>
        </div>
      )}

      {/* Comparison Grid - Horizontal scroll on mobile */}
      <div className="max-w-7xl mx-auto overflow-x-auto pb-4">
        <div className="min-w-[640px] grid gap-4" style={{ gridTemplateColumns: `200px repeat(${cavalos.length}, minmax(180px, 1fr))` }}>

          {/* Header Row - Names */}
          <div className="bg-zinc-900/50 rounded-lg p-4 flex items-center justify-center">
            <Scale className="text-[#C5A059]" size={24} />
          </div>
          {cavalos.map((cavalo) => (
            <div key={cavalo.id} className="bg-zinc-900/50 rounded-lg p-4 relative">
              {cavalos.length > 2 && (
                <button
                  onClick={() => removerCavalo(cavalo.id)}
                  className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <input
                type="text"
                value={cavalo.nome}
                onChange={(e) => atualizarCavalo(cavalo.id, "nome", e.target.value)}
                className="w-full bg-transparent text-center font-serif text-lg text-white border-b border-zinc-700 focus:border-[#C5A059] outline-none pb-1"
                placeholder="Nome do Cavalo"
              />
            </div>
          ))}

          {/* Idade */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <Calendar size={18} className="text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Idade</span>
          </div>
          {cavalos.map((cavalo) => (
            <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
              <input
                type="number"
                value={cavalo.idade}
                onChange={(e) => atualizarCavalo(cavalo.id, "idade", parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm"
                min={0}
                max={35}
              />
              <span className="block text-center text-xs text-zinc-500 mt-1">anos</span>
            </div>
          ))}

          {/* Sexo */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <span className="text-zinc-500 flex-shrink-0">♂♀</span>
            <span className="text-sm text-zinc-300">Sexo</span>
          </div>
          {cavalos.map((cavalo) => (
            <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
              <select
                value={cavalo.sexo}
                onChange={(e) => atualizarCavalo(cavalo.id, "sexo", e.target.value)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm"
              >
                {sexos.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Altura */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <Ruler size={18} className="text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Altura</span>
          </div>
          {cavalos.map((cavalo) => {
            const melhor = getMelhorValor("altura");
            return (
              <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
                <input
                  type="number"
                  value={cavalo.altura}
                  onChange={(e) => atualizarCavalo(cavalo.id, "altura", parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm"
                  min={140}
                  max={180}
                />
                <span className="block text-center text-xs text-zinc-500 mt-1">cm</span>
              </div>
            );
          })}

          {/* Cor */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-800 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Pelagem</span>
          </div>
          {cavalos.map((cavalo) => (
            <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
              <select
                value={cavalo.cor}
                onChange={(e) => atualizarCavalo(cavalo.id, "cor", e.target.value)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm"
              >
                {cores.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Linhagem */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <Star size={18} className="text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Linhagem</span>
          </div>
          {cavalos.map((cavalo) => {
            const linhagemIndex = linhagens.indexOf(cavalo.linhagem);
            const melhorIndex = Math.max(...cavalos.map((c) => linhagens.indexOf(c.linhagem)));
            const classe = linhagemIndex === melhorIndex ? "text-green-400" : linhagemIndex < melhorIndex - 1 ? "text-red-400" : "";
            return (
              <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
                <select
                  value={cavalo.linhagem}
                  onChange={(e) => atualizarCavalo(cavalo.id, "linhagem", e.target.value)}
                  className={`w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm ${classe}`}
                >
                  {linhagens.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            );
          })}

          {/* Nível de Treino */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <Trophy size={18} className="text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Nível Treino</span>
          </div>
          {cavalos.map((cavalo) => {
            const treinoIndex = niveis_treino.indexOf(cavalo.nivel_treino);
            const melhorIndex = Math.max(...cavalos.map((c) => niveis_treino.indexOf(c.nivel_treino)));
            const classe = treinoIndex === melhorIndex ? "text-green-400" : treinoIndex < melhorIndex - 1 ? "text-red-400" : "";
            return (
              <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
                <select
                  value={cavalo.nivel_treino}
                  onChange={(e) => atualizarCavalo(cavalo.id, "nivel_treino", e.target.value)}
                  className={`w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm ${classe}`}
                >
                  {niveis_treino.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            );
          })}

          {/* Temperamento */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <Heart size={18} className="text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Temperamento</span>
          </div>
          {cavalos.map((cavalo) => {
            const melhor = getMelhorValor("temperamento");
            return (
              <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
                <input
                  type="range"
                  value={cavalo.temperamento}
                  onChange={(e) => atualizarCavalo(cavalo.id, "temperamento", parseInt(e.target.value))}
                  className="w-full accent-[#C5A059]"
                  min={1}
                  max={10}
                />
                <span className={`block text-center text-sm mt-1 ${getClassePontuacao(cavalo.temperamento, melhor)}`}>
                  {cavalo.temperamento}/10
                </span>
              </div>
            );
          })}

          {/* Saúde */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <span className="text-zinc-500 flex-shrink-0">🏥</span>
            <span className="text-sm text-zinc-300">Saúde</span>
          </div>
          {cavalos.map((cavalo) => {
            const melhor = getMelhorValor("saude");
            return (
              <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
                <input
                  type="range"
                  value={cavalo.saude}
                  onChange={(e) => atualizarCavalo(cavalo.id, "saude", parseInt(e.target.value))}
                  className="w-full accent-[#C5A059]"
                  min={1}
                  max={10}
                />
                <span className={`block text-center text-sm mt-1 ${getClassePontuacao(cavalo.saude, melhor)}`}>
                  {cavalo.saude}/10
                </span>
              </div>
            );
          })}

          {/* Competições */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <Trophy size={18} className="text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Competições</span>
          </div>
          {cavalos.map((cavalo) => {
            const melhor = getMelhorValor("competicoes");
            return (
              <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
                <input
                  type="number"
                  value={cavalo.competicoes}
                  onChange={(e) => atualizarCavalo(cavalo.id, "competicoes", parseInt(e.target.value) || 0)}
                  className={`w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm ${getClassePontuacao(cavalo.competicoes, melhor)}`}
                  min={0}
                />
              </div>
            );
          })}

          {/* Prémios */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <span className="text-zinc-500 flex-shrink-0">🏆</span>
            <span className="text-sm text-zinc-300">Prémios</span>
          </div>
          {cavalos.map((cavalo) => {
            const melhor = getMelhorValor("premios");
            return (
              <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
                <input
                  type="number"
                  value={cavalo.premios}
                  onChange={(e) => atualizarCavalo(cavalo.id, "premios", parseInt(e.target.value) || 0)}
                  className={`w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm ${getClassePontuacao(cavalo.premios, melhor)}`}
                  min={0}
                />
              </div>
            );
          })}

          {/* Preço */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <Euro size={18} className="text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Preço</span>
          </div>
          {cavalos.map((cavalo) => {
            const melhor = getMelhorValor("preco", false);
            return (
              <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
                <input
                  type="number"
                  value={cavalo.preco}
                  onChange={(e) => atualizarCavalo(cavalo.id, "preco", parseInt(e.target.value) || 0)}
                  className={`w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm ${getClassePontuacao(cavalo.preco, melhor, false)}`}
                  min={0}
                  step={1000}
                />
                <span className="block text-center text-xs text-zinc-500 mt-1">€</span>
              </div>
            );
          })}

          {/* Localização */}
          <div className="bg-zinc-900/30 rounded-lg p-4 flex items-center gap-3">
            <MapPin size={18} className="text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Localização</span>
          </div>
          {cavalos.map((cavalo) => (
            <div key={cavalo.id} className="bg-zinc-900/30 rounded-lg p-4">
              <input
                type="text"
                value={cavalo.localizacao}
                onChange={(e) => atualizarCavalo(cavalo.id, "localizacao", e.target.value)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-center text-sm"
                placeholder="Ex: Lisboa"
              />
            </div>
          ))}

          {/* Pontuação Global */}
          <div className="bg-[#C5A059]/10 rounded-lg p-4 flex items-center gap-3 border border-[#C5A059]/30">
            <Star size={18} className="text-[#C5A059] flex-shrink-0" />
            <span className="text-sm text-[#C5A059] font-semibold">Pontuação</span>
          </div>
          {cavalos.map((cavalo) => {
            const pontuacao = calcularPontuacaoGlobal(cavalo);
            const pontuacoes = cavalos.map((c) => calcularPontuacaoGlobal(c));
            const melhor = Math.max(...pontuacoes);
            const isMelhor = pontuacao === melhor;
            return (
              <div
                key={cavalo.id}
                className={`rounded-lg p-4 text-center ${
                  isMelhor ? "bg-[#C5A059]/20 border border-[#C5A059]/50" : "bg-zinc-900/50"
                }`}
              >
                <div className={`text-2xl font-bold ${isMelhor ? "text-[#C5A059]" : "text-zinc-300"}`}>
                  {pontuacao}
                </div>
                <div className="text-xs text-zinc-500">de 60 pontos</div>
                {isMelhor && cavalos.length > 1 && (
                  <div className="mt-2 text-xs text-[#C5A059] font-medium">⭐ Melhor escolha</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#C5A059]">Como funciona a pontuação?</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>• <strong className="text-zinc-300">Idade ideal:</strong> Cavalos entre 6-12 anos recebem pontuação máxima</li>
            <li>• <strong className="text-zinc-300">Altura ideal:</strong> Entre 155-165cm para Lusitanos</li>
            <li>• <strong className="text-zinc-300">Linhagem:</strong> Quanto mais documentada, maior a pontuação</li>
            <li>• <strong className="text-zinc-300">Treino:</strong> Cavalos com maior nível de doma pontuam mais</li>
            <li>• <strong className="text-zinc-300">Bónus:</strong> Competições e prémios adicionam pontos extra</li>
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            * Esta ferramenta é apenas orientativa. Recomendamos sempre uma avaliação presencial por um veterinário e especialista.
          </p>
        </div>
      </div>
    </main>
  );
}
