"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Dna, Star, AlertTriangle, CheckCircle, Crown, Baby, Palette, Activity, Shield, Zap } from "lucide-react";

// Tipos
interface GeneticaPelagem {
  extension: "EE" | "Ee" | "ee";
  agouti: "AA" | "Aa" | "aa";
  grey: "GG" | "Gg" | "gg";
  cream: "CrCr" | "CrN" | "NN";
}

interface Cavalo {
  nome: string;
  sexo: "Garanhão" | "Égua";
  idade: number;
  altura: number;
  pelagem: string;
  genetica: GeneticaPelagem;
  linhagem: string;
  coudelaria: string;
  conformacao: number;
  andamentos: number;
  temperamento: string;
  saude: number;
  fertilidade: string;
  blup: number;
  coi: number;
  defeitos: string[];
}

const criarCavalo = (sexo: "Garanhão" | "Égua"): Cavalo => ({
  nome: "", sexo, idade: sexo === "Garanhão" ? 8 : 7,
  altura: sexo === "Garanhão" ? 163 : 158, pelagem: "Ruço",
  genetica: { extension: "Ee", agouti: "Aa", grey: "Gg", cream: "NN" },
  linhagem: "Registada", coudelaria: "APSL", conformacao: 7, andamentos: 7,
  temperamento: "Equilibrado", saude: 8, fertilidade: "Normal", blup: 100, coi: 4, defeitos: []
});

const PELAGENS = ["Ruço", "Castanho", "Preto", "Alazão", "Baio", "Palomino", "Isabelo", "Cremelo"];
const COUDELARIAS = ["Veiga", "Andrade", "Alter Real", "Interagro", "Lezírias", "APSL", "Particular"];
const LINHAGENS = ["Desconhecida", "Comum", "Registada", "Certificada", "Premium", "Elite"];
const TEMPERAMENTOS = ["Calmo", "Equilibrado", "Energético", "Nervoso"];
const FERTILIDADES = ["Muito Alta", "Alta", "Normal", "Baixa"];
const DEFEITOS = ["WFFS Portador", "Lordose", "OCD", "Navicular", "DPOC"];

export default function VerificadorCompatibilidadePage() {
  const [garanhao, setGaranhao] = useState<Cavalo>(criarCavalo("Garanhão"));
  const [egua, setEgua] = useState<Cavalo>(criarCavalo("Égua"));
  const [tab, setTab] = useState<"garanhao" | "egua">("garanhao");
  const [resultado, setResultado] = useState<{
    score: number; nivel: string; coi: number; blup: number;
    altura: { min: number; max: number };
    pelagens: { cor: string; prob: number }[];
    riscos: string[];
    factores: { nome: string; score: number; max: number; tipo: string }[];
  } | null>(null);

  const cavalo = tab === "garanhao" ? garanhao : egua;
  const setCavalo = tab === "garanhao" ? setGaranhao : setEgua;

  const update = (field: keyof Cavalo, value: Cavalo[keyof Cavalo]) => {
    setCavalo(prev => ({ ...prev, [field]: value }));
  };

  const updateGen = (gene: keyof GeneticaPelagem, value: string) => {
    setCavalo(prev => ({ ...prev, genetica: { ...prev.genetica, [gene]: value } }));
  };

  const toggleDefeito = (d: string) => {
    const lista = cavalo.defeitos.includes(d) ? cavalo.defeitos.filter(x => x !== d) : [...cavalo.defeitos, d];
    update("defeitos", lista);
  };

  const calcular = () => {
    const factores: { nome: string; score: number; max: number; tipo: string }[] = [];
    const riscos: string[] = [];
    let total = 0;

    // Idade (15pts)
    const idadeOk = (garanhao.idade >= 4 && garanhao.idade <= 18) && (egua.idade >= 4 && egua.idade <= 16);
    const idadeScore = idadeOk ? 15 : 8;
    factores.push({ nome: "Idade Reprodutiva", score: idadeScore, max: 15, tipo: idadeScore >= 12 ? "bom" : "aviso" });
    if (egua.idade > 16) riscos.push("Égua com idade avançada");
    total += idadeScore;

    // Tamanho (10pts)
    const difAltura = Math.abs(garanhao.altura - egua.altura);
    const tamanhoScore = difAltura <= 5 ? 10 : difAltura <= 10 ? 7 : 4;
    factores.push({ nome: "Compatibilidade Física", score: tamanhoScore, max: 10, tipo: tamanhoScore >= 7 ? "bom" : "neutro" });
    total += tamanhoScore;

    // Linhagem (20pts)
    const linNiveis: Record<string, number> = { Desconhecida: 0, Comum: 1, Registada: 2, Certificada: 3, Premium: 4, Elite: 5 };
    const linMedia = (linNiveis[garanhao.linhagem] + linNiveis[egua.linhagem]) / 2;
    const linScore = Math.round(linMedia * 4);
    factores.push({ nome: "Qualidade Genética", score: linScore, max: 20, tipo: linScore >= 16 ? "excelente" : linScore >= 10 ? "bom" : "neutro" });
    total += linScore;

    // Conformação (15pts)
    const confMedia = (garanhao.conformacao + egua.conformacao) / 2;
    const confScore = Math.round(confMedia * 1.5);
    factores.push({ nome: "Conformação", score: confScore, max: 15, tipo: confScore >= 12 ? "excelente" : "bom" });
    total += confScore;

    // Andamentos (10pts)
    const andMedia = (garanhao.andamentos + egua.andamentos) / 2;
    const andScore = Math.round(andMedia);
    factores.push({ nome: "Andamentos", score: andScore, max: 10, tipo: andScore >= 8 ? "excelente" : "bom" });
    total += andScore;

    // Temperamento (10pts)
    const tempCompat: Record<string, Record<string, number>> = {
      Calmo: { Calmo: 10, Equilibrado: 9, Energético: 7, Nervoso: 5 },
      Equilibrado: { Calmo: 9, Equilibrado: 10, Energético: 8, Nervoso: 6 },
      Energético: { Calmo: 7, Equilibrado: 8, Energético: 8, Nervoso: 4 },
      Nervoso: { Calmo: 5, Equilibrado: 6, Energético: 4, Nervoso: 3 }
    };
    const tempScore = tempCompat[garanhao.temperamento]?.[egua.temperamento] || 5;
    factores.push({ nome: "Temperamento", score: tempScore, max: 10, tipo: tempScore >= 8 ? "bom" : tempScore >= 6 ? "neutro" : "aviso" });
    if (tempScore < 5) riscos.push("Temperamentos incompatíveis");
    total += tempScore;

    // Saúde (10pts)
    const saudeMedia = (garanhao.saude + egua.saude) / 2;
    const saudeScore = Math.round(saudeMedia);
    factores.push({ nome: "Estado de Saúde", score: saudeScore, max: 10, tipo: saudeScore >= 8 ? "excelente" : "bom" });
    total += saudeScore;

    // Fertilidade (5pts)
    const fertNiveis: Record<string, number> = { "Muito Alta": 5, Alta: 4, Normal: 3, Baixa: 1 };
    const fertScore = Math.round((fertNiveis[garanhao.fertilidade] + fertNiveis[egua.fertilidade]) / 2);
    factores.push({ nome: "Fertilidade", score: fertScore, max: 5, tipo: fertScore >= 4 ? "bom" : "neutro" });
    total += fertScore;

    // COI e BLUP
    const mesmaCoude = garanhao.coudelaria === egua.coudelaria;
    const coiPrevisto = ((garanhao.coi + egua.coi) / 2) + (mesmaCoude ? 3.125 : 0);
    const blupPrevisto = Math.round((garanhao.blup + egua.blup) / 2);
    if (coiPrevisto > 6.25) riscos.push(`COI elevado: ${coiPrevisto.toFixed(1)}%`);

    // Defeitos comuns
    const defeitosComuns = garanhao.defeitos.filter(d => egua.defeitos.includes(d));
    if (defeitosComuns.length > 0) {
      riscos.push(`Ambos portadores: ${defeitosComuns.join(", ")}`);
      total -= defeitosComuns.length * 10;
    }

    // Previsão pelagem simplificada
    const probGrey = (garanhao.genetica.grey.includes("G") || egua.genetica.grey.includes("G")) ? 0.5 : 0;
    const pelagens = [
      { cor: "Ruço", prob: Math.round(probGrey * 100) },
      { cor: "Castanho", prob: Math.round((1 - probGrey) * 60) },
      { cor: "Preto", prob: Math.round((1 - probGrey) * 25) },
      { cor: "Alazão", prob: Math.round((1 - probGrey) * 15) }
    ].filter(p => p.prob > 0).sort((a, b) => b.prob - a.prob);

    const nivel = total >= 85 ? "Excelente" : total >= 70 ? "Muito Boa" : total >= 55 ? "Boa" : total >= 40 ? "Razoável" : "Problemática";

    setResultado({
      score: Math.max(total, 0),
      nivel,
      coi: coiPrevisto,
      blup: blupPrevisto,
      altura: { min: Math.round((garanhao.altura + egua.altura) / 2 - 3), max: Math.round((garanhao.altura + egua.altura) / 2 + 3) },
      pelagens,
      riscos,
      factores
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="bg-zinc-900/80 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" /><span>Voltar</span>
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-xl font-bold">Verificador de Compatibilidade</h1>
              <p className="text-xs text-zinc-500">Análise Genética Profissional</p>
            </div>
          </div>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("garanhao")} className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${tab === "garanhao" ? "bg-blue-600" : "bg-zinc-800 text-zinc-400"}`}>
            <Crown className="w-5 h-5" />Garanhão
          </button>
          <button onClick={() => setTab("egua")} className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${tab === "egua" ? "bg-pink-600" : "bg-zinc-800 text-zinc-400"}`}>
            <Heart className="w-5 h-5" />Égua
          </button>
        </div>

        {/* Formulário */}
        <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700 mb-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nome</label>
              <input type="text" value={cavalo.nome} onChange={e => update("nome", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2" placeholder={cavalo.sexo} />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Idade</label>
              <input type="number" min="1" max="30" value={cavalo.idade} onChange={e => update("idade", +e.target.value || 1)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Altura (cm)</label>
              <input type="number" min="140" max="180" value={cavalo.altura} onChange={e => update("altura", +e.target.value || 160)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Pelagem</label>
              <select value={cavalo.pelagem} onChange={e => update("pelagem", e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                {PELAGENS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Coudelaria</label>
              <select value={cavalo.coudelaria} onChange={e => update("coudelaria", e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                {COUDELARIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Linhagem</label>
              <select value={cavalo.linhagem} onChange={e => update("linhagem", e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                {LINHAGENS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Genética */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2"><Palette className="w-4 h-4 text-purple-400" />Genética de Pelagem</h3>
            <div className="grid grid-cols-4 gap-2">
              <select value={cavalo.genetica.extension} onChange={e => updateGen("extension", e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm">
                <option value="EE">EE</option><option value="Ee">Ee</option><option value="ee">ee</option>
              </select>
              <select value={cavalo.genetica.agouti} onChange={e => updateGen("agouti", e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm">
                <option value="AA">AA</option><option value="Aa">Aa</option><option value="aa">aa</option>
              </select>
              <select value={cavalo.genetica.grey} onChange={e => updateGen("grey", e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm">
                <option value="GG">GG</option><option value="Gg">Gg</option><option value="gg">gg</option>
              </select>
              <select value={cavalo.genetica.cream} onChange={e => updateGen("cream", e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm">
                <option value="CrCr">CrCr</option><option value="CrN">CrN</option><option value="NN">NN</option>
              </select>
            </div>
          </div>

          {/* Sliders */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: "Conformação", field: "conformacao" as const },
              { label: "Andamentos", field: "andamentos" as const },
              { label: "Saúde", field: "saude" as const }
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-sm text-zinc-400 mb-1">{label}: <span className="text-green-400">{cavalo[field]}/10</span></label>
                <input type="range" min="1" max="10" value={cavalo[field]} onChange={e => update(field, +e.target.value)} className="w-full accent-green-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">BLUP Index</label>
              <input type="number" min="50" max="150" value={cavalo.blup} onChange={e => update("blup", +e.target.value || 100)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2" />
            </div>
          </div>

          {/* Selects */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Temperamento</label>
              <select value={cavalo.temperamento} onChange={e => update("temperamento", e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                {TEMPERAMENTOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Fertilidade</label>
              <select value={cavalo.fertilidade} onChange={e => update("fertilidade", e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                {FERTILIDADES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">COI (%)</label>
              <input type="number" min="0" max="25" step="0.5" value={cavalo.coi} onChange={e => update("coi", +e.target.value || 0)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2" />
            </div>
          </div>

          {/* Defeitos */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Defeitos Genéticos</label>
            <div className="flex flex-wrap gap-2">
              {DEFEITOS.map(d => (
                <button key={d} onClick={() => toggleDefeito(d)}
                  className={`px-3 py-1 rounded-full text-sm ${cavalo.defeitos.includes(d) ? "bg-red-500/30 text-red-400 border border-red-500" : "bg-zinc-700 text-zinc-400"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botão */}
        <button onClick={calcular} className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mb-8">
          <Dna className="w-6 h-6" />Analisar Compatibilidade
        </button>

        {/* Resultado */}
        {resultado && (
          <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 rounded-2xl p-6 border border-purple-700/50">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${resultado.score >= 70 ? "bg-green-500/20 text-green-400" : resultado.score >= 50 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>
                {resultado.score >= 70 ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <span className="font-bold">{resultado.nivel}</span>
              </div>
              <p className="text-5xl font-bold">{resultado.score}%</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                <Dna className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-zinc-400">COI Previsto</p>
                <p className={`text-xl font-bold ${resultado.coi > 6.25 ? "text-amber-400" : "text-green-400"}`}>{resultado.coi.toFixed(1)}%</p>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                <Activity className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-zinc-400">BLUP Previsto</p>
                <p className="text-xl font-bold text-blue-400">{resultado.blup}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                <Baby className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                <p className="text-xs text-zinc-400">Altura Estimada</p>
                <p className="text-xl font-bold text-pink-400">{resultado.altura.min}-{resultado.altura.max}cm</p>
              </div>
            </div>

            {/* Pelagens */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 flex items-center gap-2"><Palette className="w-4 h-4 text-purple-400" />Previsão Pelagem</h3>
              <div className="grid grid-cols-2 gap-2">
                {resultado.pelagens.map((p, i) => (
                  <div key={i} className="bg-zinc-800/50 rounded-lg p-2 flex justify-between items-center">
                    <span>{p.cor}</span>
                    <span className="text-purple-400 font-bold">{p.prob}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Riscos */}
            {resultado.riscos.length > 0 && (
              <div className="mb-6 space-y-2">
                {resultado.riscos.map((r, i) => (
                  <div key={i} className="bg-amber-500/20 text-amber-400 p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /><span className="text-sm">{r}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Factores */}
            <div className="space-y-2">
              {resultado.factores.map((f, i) => (
                <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{f.nome}</span>
                    <span className={`text-sm font-bold ${f.tipo === "excelente" ? "text-green-400" : f.tipo === "bom" ? "text-blue-400" : f.tipo === "aviso" ? "text-amber-400" : "text-zinc-400"}`}>
                      {f.score}/{f.max}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div className={`h-full ${f.tipo === "excelente" ? "bg-green-500" : f.tipo === "bom" ? "bg-blue-500" : f.tipo === "aviso" ? "bg-amber-500" : "bg-zinc-500"}`}
                      style={{ width: `${(f.score / f.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}