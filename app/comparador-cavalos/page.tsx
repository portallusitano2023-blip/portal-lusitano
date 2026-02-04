"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Scale, Trophy, Heart, Ruler, Calendar, Euro, Star, Crown, Dna, Activity, Medal, TrendingUp, BarChart3 } from "lucide-react";

// Tipos
interface Cavalo {
  id: string;
  nome: string;
  idade: number;
  sexo: string;
  altura: number;
  peso: number;
  pelagem: string;
  linhagem: string;
  treino: string;
  temperamento: number;
  saude: number;
  conformacao: number;
  andamentos: number;
  competicoes: number;
  premios: number;
  preco: number;
  blup: number;
}

const criarCavalo = (id: string, nome: string): Cavalo => ({
  id, nome, idade: 8, sexo: "Garanhão", altura: 162, peso: 500,
  pelagem: "Ruço", linhagem: "Registada", treino: "Elementar",
  temperamento: 7, saude: 8, conformacao: 7, andamentos: 7,
  competicoes: 0, premios: 0, preco: 20000, blup: 100
});

const PELAGENS = ["Ruço", "Castanho", "Preto", "Alazão", "Baio", "Palomino"];
const LINHAGENS = ["Desconhecida", "Registada", "Certificada", "Premium", "Elite"];
const TREINOS = ["Potro", "Desbravado", "Iniciado", "Elementar", "Médio", "Avançado", "Alta Escola", "Grand Prix"];
const SEXOS = ["Garanhão", "Égua", "Castrado"];

// Componente Radar Chart
const RadarChart = ({ cavalos, labels }: { cavalos: { nome: string; valores: number[]; cor: string }[]; labels: string[] }) => {
  const size = 220;
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (2 * Math.PI) / labels.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 10) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid */}
      {[2, 4, 6, 8, 10].map(level => (
        <polygon key={level} points={labels.map((_, i) => {
          const p = getPoint(level, i);
          return `${p.x},${p.y}`;
        }).join(" ")} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      ))}
      {/* Axes */}
      {labels.map((_, i) => {
        const p = getPoint(10, i);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />;
      })}
      {/* Data polygons */}
      {cavalos.map((cavalo, ci) => (
        <polygon key={ci} points={cavalo.valores.map((v, i) => {
          const p = getPoint(v, i);
          return `${p.x},${p.y}`;
        }).join(" ")} fill={`${cavalo.cor}30`} stroke={cavalo.cor} strokeWidth="2" />
      ))}
      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(11.5, i);
        return <text key={i} x={p.x} y={p.y} fill="white" fontSize="9" textAnchor="middle" dominantBaseline="middle">{label}</text>;
      })}
    </svg>
  );
};

export default function ComparadorCavalosPage() {
  const [cavalos, setCavalos] = useState<Cavalo[]>([
    criarCavalo("1", "Cavalo A"),
    criarCavalo("2", "Cavalo B"),
  ]);
  const [showAnalise, setShowAnalise] = useState(false);

  const cores = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899"];

  const adicionar = () => {
    if (cavalos.length >= 4) return;
    const id = String(Date.now());
    setCavalos([...cavalos, criarCavalo(id, `Cavalo ${String.fromCharCode(65 + cavalos.length)}`)]);
  };

  const remover = (id: string) => {
    if (cavalos.length <= 2) return;
    setCavalos(cavalos.filter(c => c.id !== id));
  };

  const update = (id: string, campo: keyof Cavalo, valor: Cavalo[keyof Cavalo]) => {
    setCavalos(cavalos.map(c => c.id === id ? { ...c, [campo]: valor } : c));
  };

  const calcularScore = (c: Cavalo): number => {
    let score = 0;
    // Idade (ideal 6-12)
    score += c.idade >= 6 && c.idade <= 12 ? 10 : c.idade >= 4 && c.idade <= 15 ? 7 : 4;
    // Altura (ideal 155-165)
    score += c.altura >= 155 && c.altura <= 165 ? 10 : c.altura >= 150 && c.altura <= 170 ? 7 : 5;
    // Linhagem
    const linPoints: Record<string, number> = { Desconhecida: 2, Registada: 5, Certificada: 7, Premium: 9, Elite: 10 };
    score += linPoints[c.linhagem] || 5;
    // Treino
    const treinoPoints: Record<string, number> = { Potro: 2, Desbravado: 3, Iniciado: 4, Elementar: 5, Médio: 6, Avançado: 8, "Alta Escola": 9, "Grand Prix": 10 };
    score += treinoPoints[c.treino] || 5;
    // Outros
    score += c.temperamento;
    score += c.saude;
    score += c.conformacao;
    score += c.andamentos;
    score += Math.min(c.premios, 10);
    return score;
  };

  const getMelhor = (campo: keyof Cavalo, maior = true) => {
    const vals = cavalos.map(c => c[campo] as number);
    return maior ? Math.max(...vals) : Math.min(...vals);
  };

  const getClasse = (val: number, melhor: number, maior = true) => {
    if (maior) return val === melhor ? "text-green-400 font-bold" : val < melhor * 0.7 ? "text-red-400" : "";
    return val === melhor ? "text-green-400 font-bold" : val > melhor * 1.3 ? "text-red-400" : "";
  };

  const vencedor = cavalos.reduce((a, b) => calcularScore(a) > calcularScore(b) ? a : b);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" /><span>Voltar</span>
          </Link>
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold">Comparador de Cavalos</h1>
              <p className="text-xs text-zinc-500">Análise Comparativa Profissional</p>
            </div>
          </div>
          <button onClick={adicionar} disabled={cavalos.length >= 4}
            className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500">
            <Plus className="w-4 h-4" />Adicionar
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards dos Cavalos */}
        <div className={`grid gap-4 mb-8 ${cavalos.length === 2 ? "grid-cols-2" : cavalos.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
          {cavalos.map((c, i) => (
            <div key={c.id} className="bg-zinc-800/50 rounded-2xl border border-zinc-700 overflow-hidden">
              {/* Header do Card */}
              <div className="p-4 border-b border-zinc-700" style={{ borderTopColor: cores[i], borderTopWidth: 3 }}>
                <div className="flex items-center justify-between">
                  <input type="text" value={c.nome} onChange={e => update(c.id, "nome", e.target.value)}
                    className="bg-transparent text-lg font-bold outline-none flex-1" />
                  {cavalos.length > 2 && (
                    <button onClick={() => remover(c.id)} className="text-zinc-500 hover:text-red-400">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {c.id === vencedor.id && showAnalise && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded text-amber-400 text-xs">
                    <Crown className="w-3 h-3" />Melhor Avaliação
                  </div>
                )}
              </div>

              {/* Campos */}
              <div className="p-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500">Idade</label>
                    <input type="number" min="1" max="30" value={c.idade} onChange={e => update(c.id, "idade", +e.target.value || 1)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500">Altura (cm)</label>
                    <input type="number" min="140" max="180" value={c.altura} onChange={e => update(c.id, "altura", +e.target.value || 160)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500">Sexo</label>
                  <select value={c.sexo} onChange={e => update(c.id, "sexo", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5">
                    {SEXOS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500">Pelagem</label>
                  <select value={c.pelagem} onChange={e => update(c.id, "pelagem", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5">
                    {PELAGENS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500">Linhagem</label>
                  <select value={c.linhagem} onChange={e => update(c.id, "linhagem", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5">
                    {LINHAGENS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500">Nível de Treino</label>
                  <select value={c.treino} onChange={e => update(c.id, "treino", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5">
                    {TREINOS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500">Conformação: {c.conformacao}</label>
                    <input type="range" min="1" max="10" value={c.conformacao} onChange={e => update(c.id, "conformacao", +e.target.value)}
                      className="w-full accent-green-500" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500">Andamentos: {c.andamentos}</label>
                    <input type="range" min="1" max="10" value={c.andamentos} onChange={e => update(c.id, "andamentos", +e.target.value)}
                      className="w-full accent-green-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500">Temperamento: {c.temperamento}</label>
                    <input type="range" min="1" max="10" value={c.temperamento} onChange={e => update(c.id, "temperamento", +e.target.value)}
                      className="w-full accent-green-500" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500">Saúde: {c.saude}</label>
                    <input type="range" min="1" max="10" value={c.saude} onChange={e => update(c.id, "saude", +e.target.value)}
                      className="w-full accent-green-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500">Prémios</label>
                    <input type="number" min="0" value={c.premios} onChange={e => update(c.id, "premios", +e.target.value || 0)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500">BLUP</label>
                    <input type="number" min="50" max="150" value={c.blup} onChange={e => update(c.id, "blup", +e.target.value || 100)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500">Preço (€)</label>
                  <input type="number" min="0" step="1000" value={c.preco} onChange={e => update(c.id, "preco", +e.target.value || 0)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5" />
                </div>
              </div>

              {/* Score */}
              {showAnalise && (
                <div className="p-4 bg-zinc-900/50 border-t border-zinc-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Score Total</span>
                    <span className="text-2xl font-bold" style={{ color: cores[i] }}>{calcularScore(c)}</span>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    Valor/Ponto: {(c.preco / calcularScore(c)).toFixed(0)}€
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botão Analisar */}
        <button onClick={() => setShowAnalise(true)}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mb-8">
          <BarChart3 className="w-6 h-6" />Analisar Comparação
        </button>

        {/* Análise */}
        {showAnalise && (
          <div className="space-y-6">
            {/* Gráfico Radar */}
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Comparação Visual
              </h3>
              <div className="flex flex-col items-center">
                <RadarChart
                  cavalos={cavalos.map((c, i) => ({
                    nome: c.nome,
                    valores: [c.conformacao, c.andamentos, c.temperamento, c.saude, Math.min(c.premios, 10), c.blup / 15],
                    cor: cores[i]
                  }))}
                  labels={["Conform.", "Andam.", "Temper.", "Saúde", "Prémios", "BLUP"]}
                />
                <div className="flex gap-4 mt-4">
                  {cavalos.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cores[i] }} />
                      <span className="text-sm">{c.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabela Comparativa */}
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700 overflow-x-auto">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-500" />
                Tabela Comparativa
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-400 border-b border-zinc-700">
                    <th className="text-left py-2">Parâmetro</th>
                    {cavalos.map((c, i) => (
                      <th key={c.id} className="text-center py-2" style={{ color: cores[i] }}>{c.nome}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Idade", campo: "idade" as const, maior: false },
                    { label: "Altura", campo: "altura" as const, maior: false },
                    { label: "Conformação", campo: "conformacao" as const, maior: true },
                    { label: "Andamentos", campo: "andamentos" as const, maior: true },
                    { label: "Temperamento", campo: "temperamento" as const, maior: true },
                    { label: "Saúde", campo: "saude" as const, maior: true },
                    { label: "Prémios", campo: "premios" as const, maior: true },
                    { label: "BLUP", campo: "blup" as const, maior: true },
                    { label: "Preço", campo: "preco" as const, maior: false },
                  ].map(({ label, campo, maior }) => (
                    <tr key={campo} className="border-b border-zinc-800">
                      <td className="py-2 text-zinc-400">{label}</td>
                      {cavalos.map(c => (
                        <td key={c.id} className={`text-center py-2 ${getClasse(c[campo] as number, getMelhor(campo, maior), maior)}`}>
                          {campo === "preco" ? `${(c[campo] as number).toLocaleString("pt-PT")}€` : c[campo]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t-2 border-zinc-600">
                    <td className="py-3 font-bold">SCORE TOTAL</td>
                    {cavalos.map((c, i) => (
                      <td key={c.id} className="text-center py-3 text-xl font-bold" style={{ color: cores[i] }}>
                        {calcularScore(c)}
                        {c.id === vencedor.id && <Crown className="w-4 h-4 inline ml-1 text-amber-400" />}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recomendação */}
            <div className="bg-gradient-to-br from-amber-900/30 to-zinc-900 rounded-2xl p-6 border border-amber-500/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Recomendação
              </h3>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-amber-500/20 rounded-xl">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-amber-400">{vencedor.nome}</p>
                  <p className="text-sm text-zinc-400">
                    Score: {calcularScore(vencedor)} | Valor/Ponto: {(vencedor.preco / calcularScore(vencedor)).toFixed(0)}€
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Melhor relação qualidade/preço entre os cavalos comparados
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}