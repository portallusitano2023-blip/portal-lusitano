"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Calculator, Dna, ChevronRight, ChevronLeft, Check, Activity,
  ArrowLeft, TrendingUp, TrendingDown, GitBranch, Crown, Sparkles,
  Download, Share2, RefreshCw
} from "lucide-react";

// ============================================
// TIPOS SIMPLIFICADOS
// ============================================

interface FormData {
  nome: string;
  idade: number;
  sexo: "garanhao" | "egua" | "castrado";
  pelagem: string;
  altura: number;
  registoAPSL: boolean;
  linhagem: "desconhecida" | "comum" | "registada" | "certificada" | "premium" | "elite";
  morfologia: number;
  andamentos: number;
  treino: "potro" | "desbravado" | "iniciado" | "elementar" | "medio" | "avancado" | "alta_escola" | "grand_prix";
  competicoes: "nenhuma" | "regional" | "nacional" | "internacional";
  saude: "excelente" | "muito_bom" | "bom" | "regular";
  temperamento: number;
  reproducao: boolean;
  descendentes: number;
  mercado: string;
  tendencia: "alta" | "estavel" | "baixa";
}

interface Resultado {
  valorFinal: number;
  valorMin: number;
  valorMax: number;
  confianca: number;
  blup: number;
  percentil: number;
  multiplicador: number;
  categorias: { nome: string; impacto: number; score: number }[];
  recomendacoes: string[];
}

// ============================================
// DADOS
// ============================================

const PELAGENS = ["Ruço", "Castanho", "Preto", "Baio", "Tordilho", "Isabela", "Palomino"];
const MERCADOS = ["Portugal", "Espanha", "França", "Alemanha", "Holanda", "Bélgica", "Brasil", "EUA", "Outros"];

const VALORES_BASE: Record<string, number> = {
  potro: 8000, desbravado: 15000, iniciado: 22000, elementar: 35000,
  medio: 55000, avancado: 85000, alta_escola: 130000, grand_prix: 200000
};

const MULT_LINHAGEM: Record<string, number> = {
  desconhecida: 0.7, comum: 0.9, registada: 1.0, certificada: 1.2, premium: 1.5, elite: 2.0
};

const MULT_SAUDE: Record<string, number> = {
  excelente: 1.15, muito_bom: 1.05, bom: 1.0, regular: 0.75
};

const MULT_COMP: Record<string, number> = {
  nenhuma: 1.0, regional: 1.1, nacional: 1.25, internacional: 1.5
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function CalculadoraValorPage() {
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    nome: "", idade: 6, sexo: "garanhao", pelagem: "Ruço", altura: 162,
    registoAPSL: true, linhagem: "certificada", morfologia: 7, andamentos: 7,
    treino: "elementar", competicoes: "nenhuma", saude: "muito_bom",
    temperamento: 8, reproducao: false, descendentes: 0, mercado: "Portugal",
    tendencia: "estavel"
  });

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const calcular = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const base = VALORES_BASE[form.treino];

      // Multiplicadores
      const multLinhagem = MULT_LINHAGEM[form.linhagem];
      const multSaude = MULT_SAUDE[form.saude];
      const multComp = MULT_COMP[form.competicoes];
      const multIdade = form.idade >= 7 && form.idade <= 12 ? 1.1 : form.idade > 15 ? 0.8 : 1.0;
      const multMorfo = 0.7 + (form.morfologia / 10) * 0.6;
      const multAnd = 0.7 + (form.andamentos / 10) * 0.6;
      const multTemp = 0.8 + (form.temperamento / 10) * 0.4;
      const multAPSL = form.registoAPSL ? 1.15 : 0.85;
      const multRepro = form.reproducao && form.descendentes > 0 ? 1 + (form.descendentes * 0.03) : 1;
      const multTend = form.tendencia === "alta" ? 1.1 : form.tendencia === "baixa" ? 0.9 : 1;
      const multSexo = form.sexo === "garanhao" && form.reproducao ? 1.3 : form.sexo === "egua" ? 1.05 : 1;

      const totalMult = multLinhagem * multSaude * multComp * multIdade * multMorfo *
                        multAnd * multTemp * multAPSL * multRepro * multTend * multSexo;

      const valorFinal = Math.round(base * totalMult);
      const variance = 0.15;

      const categorias = [
        { nome: "Linhagem & Genética", impacto: Math.round((multLinhagem - 1) * base), score: multLinhagem * 5 },
        { nome: "Morfologia", impacto: Math.round((multMorfo - 1) * base), score: form.morfologia },
        { nome: "Andamentos", impacto: Math.round((multAnd - 1) * base), score: form.andamentos },
        { nome: "Treino & Nível", impacto: Math.round(base * 0.3), score: Object.keys(VALORES_BASE).indexOf(form.treino) + 3 },
        { nome: "Saúde Veterinária", impacto: Math.round((multSaude - 1) * base), score: multSaude * 8 },
        { nome: "Temperamento", impacto: Math.round((multTemp - 1) * base), score: form.temperamento },
        { nome: "Competições", impacto: Math.round((multComp - 1) * base), score: multComp * 7 },
        { nome: "Reprodução", impacto: Math.round((multRepro - 1) * base), score: form.reproducao ? 8 : 5 }
      ].sort((a, b) => b.impacto - a.impacto);

      const recomendacoes: string[] = [];
      if (form.morfologia < 7) recomendacoes.push("Melhorar condição física pode aumentar valor em 10-15%");
      if (!form.registoAPSL) recomendacoes.push("Registo APSL pode valorizar 15%+ no mercado internacional");
      if (form.competicoes === "nenhuma" && form.treino !== "potro") recomendacoes.push("Participação em competições aumenta credibilidade");
      if (form.saude !== "excelente") recomendacoes.push("Exame veterinário completo recomendado para compradores exigentes");

      setResultado({
        valorFinal,
        valorMin: Math.round(valorFinal * (1 - variance)),
        valorMax: Math.round(valorFinal * (1 + variance)),
        confianca: Math.min(95, 70 + form.morfologia + form.andamentos),
        blup: Math.round(100 + (multLinhagem - 1) * 50 + (form.morfologia - 5) * 5),
        percentil: Math.min(99, Math.round(totalMult * 50)),
        multiplicador: Math.round(totalMult * 100) / 100,
        categorias,
        recomendacoes
      });

      setIsCalculating(false);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1500);
  };

  const resetar = () => {
    setResultado(null);
    setStep(1);
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header minimalista */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Voltar</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#8B7355] flex items-center justify-center">
              <Calculator size={16} className="text-black" />
            </div>
            <span className="text-sm font-medium text-zinc-300 hidden sm:block">Avaliação Profissional</span>
          </div>

          {resultado ? (
            <button onClick={resetar} className="text-sm text-[#C5A059] hover:text-[#D4AF6A] transition-colors flex items-center gap-1">
              <RefreshCw size={14} />
              Nova avaliação
            </button>
          ) : (
            <div className="text-xs text-zinc-500">Passo {step} de {totalSteps}</div>
          )}
        </div>

        {/* Progress bar */}
        {!resultado && (
          <div className="h-0.5 bg-zinc-900">
            <div
              className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF6A] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      <div className="pt-20 pb-24 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Formulário */}
          {!resultado && (
            <div className="space-y-8 animate-in fade-in duration-500">

              {/* Step 1: Dados Básicos */}
              {step === 1 && (
                <section className="space-y-6">
                  <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                      Identificação
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                      Dados do Cavalo
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">Informações básicas para a avaliação</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Nome do Cavalo</label>
                      <input
                        type="text"
                        value={form.nome}
                        onChange={e => update("nome", e.target.value)}
                        placeholder="Ex: Ícaro III"
                        className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors placeholder:text-zinc-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Idade</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={form.idade}
                            onChange={e => update("idade", Number(e.target.value))}
                            min={0}
                            max={30}
                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors"
                          />
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">anos</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Altura</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={form.altura}
                            onChange={e => update("altura", Number(e.target.value))}
                            min={140}
                            max={180}
                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors"
                          />
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">cm</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Sexo</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "garanhao", label: "Garanhão" },
                          { value: "egua", label: "Égua" },
                          { value: "castrado", label: "Castrado" }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => update("sexo", opt.value as FormData["sexo"])}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                              form.sexo === opt.value
                                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Pelagem</label>
                        <select
                          value={form.pelagem}
                          onChange={e => update("pelagem", e.target.value)}
                          className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors appearance-none cursor-pointer"
                        >
                          {PELAGENS.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Registo APSL</label>
                        <button
                          onClick={() => update("registoAPSL", !form.registoAPSL)}
                          className={`w-full py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                            form.registoAPSL
                              ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                              : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          {form.registoAPSL && <Check size={16} />}
                          {form.registoAPSL ? "Registado" : "Não registado"}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Step 2: Linhagem e Qualidade */}
              {step === 2 && (
                <section className="space-y-6">
                  <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                      Genética & Qualidade
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                      Linhagem e Conformação
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">Avalie a qualidade genética e física</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Qualidade da Linhagem</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { value: "desconhecida", label: "Desconhecida" },
                          { value: "comum", label: "Comum" },
                          { value: "registada", label: "Registada" },
                          { value: "certificada", label: "Certificada" },
                          { value: "premium", label: "Premium" },
                          { value: "elite", label: "Elite" }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => update("linhagem", opt.value as FormData["linhagem"])}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                              form.linhagem === opt.value
                                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Morfologia</label>
                        <span className="text-[#C5A059] font-medium">{form.morfologia}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={form.morfologia}
                        onChange={e => update("morfologia", Number(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#C5A059]"
                      />
                      <div className="flex justify-between text-xs text-zinc-600 mt-1">
                        <span>Fraco</span>
                        <span>Excelente</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Andamentos</label>
                        <span className="text-[#C5A059] font-medium">{form.andamentos}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={form.andamentos}
                        onChange={e => update("andamentos", Number(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#C5A059]"
                      />
                      <div className="flex justify-between text-xs text-zinc-600 mt-1">
                        <span>Fraco</span>
                        <span>Excelente</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Temperamento</label>
                        <span className="text-[#C5A059] font-medium">{form.temperamento}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={form.temperamento}
                        onChange={e => update("temperamento", Number(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#C5A059]"
                      />
                      <div className="flex justify-between text-xs text-zinc-600 mt-1">
                        <span>Difícil</span>
                        <span>Excelente</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Step 3: Treino e Saúde */}
              {step === 3 && (
                <section className="space-y-6">
                  <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                      Formação & Saúde
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                      Treino e Condição
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">Nível de treino e estado de saúde</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Nível de Treino</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "potro", label: "Potro", desc: "Sem desbaste" },
                          { value: "desbravado", label: "Desbravado", desc: "Aceita cavaleiro" },
                          { value: "iniciado", label: "Iniciado", desc: "Trabalho básico" },
                          { value: "elementar", label: "Elementar", desc: "Movimentos básicos" },
                          { value: "medio", label: "Médio", desc: "Movimentos médios" },
                          { value: "avancado", label: "Avançado", desc: "Movimentos avançados" },
                          { value: "alta_escola", label: "Alta Escola", desc: "Ares de cima" },
                          { value: "grand_prix", label: "Grand Prix", desc: "Competição GP" }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => update("treino", opt.value as FormData["treino"])}
                            className={`py-3 px-4 rounded-lg border text-left transition-all ${
                              form.treino === opt.value
                                ? "border-[#C5A059] bg-[#C5A059]/10"
                                : "border-zinc-800 hover:border-zinc-700"
                            }`}
                          >
                            <span className={`block text-sm font-medium ${form.treino === opt.value ? "text-[#C5A059]" : "text-zinc-300"}`}>
                              {opt.label}
                            </span>
                            <span className="text-xs text-zinc-500">{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Historial de Competição</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "nenhuma", label: "Sem competição" },
                          { value: "regional", label: "Regional" },
                          { value: "nacional", label: "Nacional" },
                          { value: "internacional", label: "Internacional" }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => update("competicoes", opt.value as FormData["competicoes"])}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                              form.competicoes === opt.value
                                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Estado de Saúde</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "excelente", label: "Excelente", color: "text-green-400" },
                          { value: "muito_bom", label: "Muito Bom", color: "text-emerald-400" },
                          { value: "bom", label: "Bom", color: "text-yellow-400" },
                          { value: "regular", label: "Regular", color: "text-orange-400" }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => update("saude", opt.value as FormData["saude"])}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                              form.saude === opt.value
                                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Step 4: Reprodução e Mercado */}
              {step === 4 && (
                <section className="space-y-6">
                  <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                      Finalização
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                      Reprodução e Mercado
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">Informações finais para a avaliação</p>
                  </div>

                  <div className="space-y-6">
                    {form.sexo !== "castrado" && (
                      <>
                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            {form.sexo === "garanhao" ? "Aprovado como Reprodutor?" : "Reprodutora Aprovada?"}
                          </label>
                          <button
                            onClick={() => update("reproducao", !form.reproducao)}
                            className={`w-full py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                              form.reproducao
                                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            {form.reproducao && <Check size={16} />}
                            {form.reproducao ? "Sim, aprovado(a)" : "Não aprovado(a)"}
                          </button>
                        </div>

                        {form.reproducao && (
                          <div>
                            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                              Descendentes Registados
                            </label>
                            <input
                              type="number"
                              value={form.descendentes}
                              onChange={e => update("descendentes", Number(e.target.value))}
                              min={0}
                              className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Mercado Alvo</label>
                      <select
                        value={form.mercado}
                        onChange={e => update("mercado", e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors appearance-none cursor-pointer"
                      >
                        {MERCADOS.map(m => <option key={m} value={m} className="bg-zinc-900">{m}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Tendência de Mercado</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "alta", label: "Em Alta", icon: TrendingUp },
                          { value: "estavel", label: "Estável", icon: Activity },
                          { value: "baixa", label: "Em Baixa", icon: TrendingDown }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => update("tendencia", opt.value as FormData["tendencia"])}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                              form.tendencia === opt.value
                                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            <opt.icon size={18} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Navegação */}
              <div className="flex gap-3 pt-6">
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="flex-1 py-4 rounded-xl border border-zinc-800 text-zinc-400 font-medium hover:border-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Anterior
                  </button>
                )}

                {step < totalSteps ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-medium hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={calcular}
                    disabled={isCalculating}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-bold hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        A calcular...
                      </>
                    ) : (
                      <>
                        <Calculator size={18} />
                        Calcular Valor
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Resultado */}
          {resultado && (
            <div ref={resultRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

              {/* Hero do Valor */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-8 border border-zinc-800">
                {/* Decorações */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-3xl" />
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#C5A059]/10 rounded-full">
                    <Crown size={12} className="text-[#C5A059]" />
                    <span className="text-xs text-[#C5A059] font-medium">Avaliação Premium</span>
                  </div>
                </div>

                <div className="relative z-10 text-center">
                  {form.nome && (
                    <p className="text-zinc-500 text-sm mb-1">{form.nome}</p>
                  )}
                  <p className="text-[#C5A059] text-xs font-medium uppercase tracking-[0.2em] mb-4">
                    Valor de Mercado Estimado
                  </p>

                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl sm:text-7xl font-light tracking-tight text-white">
                      {resultado.valorFinal.toLocaleString("pt-PT")}
                    </span>
                    <span className="text-2xl text-[#C5A059]">€</span>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-4 text-sm text-zinc-500">
                    <span>Min: {resultado.valorMin.toLocaleString("pt-PT")}€</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span>Max: {resultado.valorMax.toLocaleString("pt-PT")}€</span>
                  </div>

                  {/* Métricas */}
                  <div className="flex justify-center gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-medium text-white">{resultado.confianca}%</div>
                      <div className="text-xs text-zinc-500">Confiança</div>
                    </div>
                    <div className="w-px bg-zinc-800" />
                    <div className="text-center">
                      <div className="text-2xl font-medium text-white">Top {100 - resultado.percentil}%</div>
                      <div className="text-xs text-zinc-500">Mercado</div>
                    </div>
                    <div className="w-px bg-zinc-800" />
                    <div className="text-center">
                      <div className="text-2xl font-medium text-white">{resultado.multiplicador}x</div>
                      <div className="text-xs text-zinc-500">Multiplicador</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores Genéticos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                    <Dna size={16} className="text-purple-400" />
                    Índice BLUP
                  </div>
                  <div className="text-3xl font-light text-white">{resultado.blup}</div>
                  <div className="text-xs text-zinc-500 mt-1">Média da raça: 100</div>
                </div>

                <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                    <GitBranch size={16} className="text-amber-400" />
                    Potencial
                  </div>
                  <div className="text-3xl font-light text-white">{resultado.percentil}%</div>
                  <div className="text-xs text-zinc-500 mt-1">Acima da média</div>
                </div>
              </div>

              {/* Análise por Categoria */}
              <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
                  Impacto por Categoria
                </h3>
                <div className="space-y-3">
                  {resultado.categorias.slice(0, 6).map((cat, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-300">{cat.nome}</span>
                          <span className={cat.impacto >= 0 ? "text-emerald-400" : "text-red-400"}>
                            {cat.impacto >= 0 ? "+" : ""}{cat.impacto.toLocaleString("pt-PT")}€
                          </span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF6A] transition-all duration-1000"
                            style={{ width: `${Math.min(cat.score * 10, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendações */}
              {resultado.recomendacoes.length > 0 && (
                <div className="bg-[#C5A059]/5 rounded-2xl p-6 border border-[#C5A059]/20">
                  <h3 className="text-sm font-medium text-[#C5A059] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles size={16} />
                    Recomendações
                  </h3>
                  <ul className="space-y-2">
                    {resultado.recomendacoes.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                        <ChevronRight size={16} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-2">
                  <Download size={16} />
                  Exportar PDF
                </button>
                <button className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-2">
                  <Share2 size={16} />
                  Partilhar
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-center text-xs text-zinc-600 px-4">
                Esta avaliação é uma estimativa baseada nos dados fornecidos.
                O valor real pode variar consoante as condições de mercado e negociação.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}