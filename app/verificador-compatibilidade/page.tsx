"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Dna, Star, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Cavalo {
  nome: string;
  sexo: "Garanhão" | "Égua";
  idade: number;
  altura: number;
  cor: string;
  linhagem: "Desconhecida" | "Registada" | "Premium" | "Elite";
  conformacao: number;
  temperamento: "Calmo" | "Equilibrado" | "Energético" | "Nervoso";
  disciplina: string;
  saude: "Excelente" | "Boa" | "Regular" | "Fraca";
  fertilidade: "Alta" | "Normal" | "Baixa" | "Desconhecida";
  historico_genetico: boolean;
  defeitos_conhecidos: string[];
}

const emptyCavalo = (sexo: "Garanhão" | "Égua"): Cavalo => ({
  nome: sexo === "Garanhão" ? "Garanhão" : "Égua",
  sexo,
  idade: sexo === "Garanhão" ? 8 : 7,
  altura: sexo === "Garanhão" ? 162 : 158,
  cor: "Ruço",
  linhagem: "Registada",
  conformacao: 7,
  temperamento: "Equilibrado",
  disciplina: "Dressage",
  saude: "Boa",
  fertilidade: "Normal",
  historico_genetico: false,
  defeitos_conhecidos: [],
});

const cores = ["Ruço", "Castanho", "Preto", "Alazão", "Baio", "Palomino", "Tordilho"];
const linhagens = ["Desconhecida", "Registada", "Premium", "Elite"];
const temperamentos = ["Calmo", "Equilibrado", "Energético", "Nervoso"];
const disciplinas = ["Dressage", "Toureio", "Equitação de Trabalho", "Atrelagem", "Lazer", "Reprodução"];
const saudeOpcoes = ["Excelente", "Boa", "Regular", "Fraca"];
const fertilidadeOpcoes = ["Alta", "Normal", "Baixa", "Desconhecida"];
const defeitosComuns = [
  "Problemas articulares",
  "Problemas respiratórios",
  "Síndrome navicular",
  "Lordose",
  "Problemas dentários",
  "Cólicas recorrentes",
  "Problemas de cascos",
  "Hérnias",
];

interface ResultadoCompatibilidade {
  pontuacao: number;
  nivel: "Excelente" | "Boa" | "Razoável" | "Problemática";
  factores: {
    categoria: string;
    pontuacao: number;
    maxPontuacao: number;
    comentario: string;
    tipo: "positivo" | "neutro" | "negativo";
  }[];
  alertas: string[];
  recomendacoes: string[];
}

export default function VerificadorCompatibilidadePage() {
  const [garanhao, setGaranhao] = useState<Cavalo>(emptyCavalo("Garanhão"));
  const [egua, setEgua] = useState<Cavalo>(emptyCavalo("Égua"));
  const [resultado, setResultado] = useState<ResultadoCompatibilidade | null>(null);

  const calcularCompatibilidade = () => {
    const factores: ResultadoCompatibilidade["factores"] = [];
    const alertas: string[] = [];
    const recomendacoes: string[] = [];

    // 1. Idade - ambos em idade reprodutiva ideal
    let idadePontos = 0;
    const idadeGaranhaoIdeal = garanhao.idade >= 4 && garanhao.idade <= 18;
    const idadeEguaIdeal = egua.idade >= 4 && egua.idade <= 16;
    if (idadeGaranhaoIdeal && idadeEguaIdeal) {
      idadePontos = 10;
    } else if (idadeGaranhaoIdeal || idadeEguaIdeal) {
      idadePontos = 6;
    } else {
      idadePontos = 3;
    }
    if (garanhao.idade > 18) alertas.push("Garanhão com idade avançada pode ter fertilidade reduzida");
    if (egua.idade > 16) alertas.push("Égua com idade avançada pode ter complicações na gestação");
    if (egua.idade < 4) alertas.push("Égua muito jovem - considere aguardar maturidade completa");
    factores.push({
      categoria: "Idade Reprodutiva",
      pontuacao: idadePontos,
      maxPontuacao: 10,
      comentario: idadePontos >= 8 ? "Ambos em idade ideal" : idadePontos >= 5 ? "Idade aceitável" : "Idade fora do ideal",
      tipo: idadePontos >= 8 ? "positivo" : idadePontos >= 5 ? "neutro" : "negativo",
    });

    // 2. Altura - diferença não deve ser excessiva
    const diferencaAltura = Math.abs(garanhao.altura - egua.altura);
    let alturaPontos = 0;
    if (diferencaAltura <= 5) {
      alturaPontos = 10;
    } else if (diferencaAltura <= 10) {
      alturaPontos = 7;
    } else if (diferencaAltura <= 15) {
      alturaPontos = 4;
    } else {
      alturaPontos = 2;
      alertas.push("Diferença de altura significativa pode complicar a cobrição natural");
    }
    factores.push({
      categoria: "Compatibilidade de Altura",
      pontuacao: alturaPontos,
      maxPontuacao: 10,
      comentario: `Diferença de ${diferencaAltura}cm`,
      tipo: alturaPontos >= 7 ? "positivo" : alturaPontos >= 4 ? "neutro" : "negativo",
    });

    // 3. Linhagem
    const linhagemNiveis = { Desconhecida: 0, Registada: 1, Premium: 2, Elite: 3 };
    const linhagemGaranhao = linhagemNiveis[garanhao.linhagem];
    const linhagemEgua = linhagemNiveis[egua.linhagem];
    const linhagemMedia = (linhagemGaranhao + linhagemEgua) / 2;
    const linhagemPontos = Math.round(linhagemMedia * 3.33);
    if (garanhao.linhagem === "Elite" || egua.linhagem === "Elite") {
      recomendacoes.push("Linhagem Elite presente - poldro terá alto valor genético");
    }
    if (garanhao.linhagem === "Desconhecida" && egua.linhagem === "Desconhecida") {
      alertas.push("Ambos sem linhagem documentada - poldro não terá pedigree completo");
    }
    factores.push({
      categoria: "Qualidade da Linhagem",
      pontuacao: linhagemPontos,
      maxPontuacao: 10,
      comentario: `${garanhao.linhagem} × ${egua.linhagem}`,
      tipo: linhagemPontos >= 7 ? "positivo" : linhagemPontos >= 4 ? "neutro" : "negativo",
    });

    // 4. Conformação
    const conformacaoMedia = (garanhao.conformacao + egua.conformacao) / 2;
    const conformacaoPontos = Math.round(conformacaoMedia);
    if (conformacaoMedia >= 8) {
      recomendacoes.push("Excelente conformação de ambos - espera-se poldro bem estruturado");
    }
    factores.push({
      categoria: "Conformação",
      pontuacao: conformacaoPontos,
      maxPontuacao: 10,
      comentario: `Média: ${conformacaoMedia.toFixed(1)}/10`,
      tipo: conformacaoPontos >= 7 ? "positivo" : conformacaoPontos >= 5 ? "neutro" : "negativo",
    });

    // 5. Temperamento
    const temperamentoCompativel = {
      Calmo: { Calmo: 10, Equilibrado: 9, Energético: 6, Nervoso: 3 },
      Equilibrado: { Calmo: 9, Equilibrado: 10, Energético: 7, Nervoso: 4 },
      Energético: { Calmo: 6, Equilibrado: 7, Energético: 8, Nervoso: 5 },
      Nervoso: { Calmo: 3, Equilibrado: 4, Energético: 5, Nervoso: 2 },
    };
    const tempPontos = temperamentoCompativel[garanhao.temperamento][egua.temperamento];
    if (garanhao.temperamento === "Nervoso" || egua.temperamento === "Nervoso") {
      alertas.push("Temperamento nervoso pode ser transmitido ao poldro");
    }
    if (garanhao.temperamento === "Calmo" && egua.temperamento === "Calmo") {
      recomendacoes.push("Temperamento calmo de ambos é ideal para poldros equilibrados");
    }
    factores.push({
      categoria: "Compatibilidade de Temperamento",
      pontuacao: tempPontos,
      maxPontuacao: 10,
      comentario: `${garanhao.temperamento} × ${egua.temperamento}`,
      tipo: tempPontos >= 7 ? "positivo" : tempPontos >= 5 ? "neutro" : "negativo",
    });

    // 6. Saúde
    const saudeNiveis = { Excelente: 10, Boa: 7, Regular: 4, Fraca: 1 };
    const saudeGaranhao = saudeNiveis[garanhao.saude];
    const saudeEgua = saudeNiveis[egua.saude];
    const saudePontos = Math.round((saudeGaranhao + saudeEgua) / 2);
    if (garanhao.saude === "Fraca" || egua.saude === "Fraca") {
      alertas.push("Saúde fraca pode comprometer a gestação e qualidade do poldro");
    }
    factores.push({
      categoria: "Estado de Saúde",
      pontuacao: saudePontos,
      maxPontuacao: 10,
      comentario: `Garanhão: ${garanhao.saude}, Égua: ${egua.saude}`,
      tipo: saudePontos >= 7 ? "positivo" : saudePontos >= 5 ? "neutro" : "negativo",
    });

    // 7. Fertilidade
    const fertilidadeNiveis = { Alta: 10, Normal: 7, Baixa: 3, Desconhecida: 5 };
    const fertGaranhao = fertilidadeNiveis[garanhao.fertilidade];
    const fertEgua = fertilidadeNiveis[egua.fertilidade];
    const fertPontos = Math.round((fertGaranhao + fertEgua) / 2);
    if (garanhao.fertilidade === "Baixa" || egua.fertilidade === "Baixa") {
      alertas.push("Fertilidade baixa pode exigir múltiplas tentativas ou inseminação artificial");
    }
    factores.push({
      categoria: "Fertilidade",
      pontuacao: fertPontos,
      maxPontuacao: 10,
      comentario: `Garanhão: ${garanhao.fertilidade}, Égua: ${egua.fertilidade}`,
      tipo: fertPontos >= 7 ? "positivo" : fertPontos >= 5 ? "neutro" : "negativo",
    });

    // 8. Histórico Genético
    let geneticoPontos = 5;
    if (garanhao.historico_genetico && egua.historico_genetico) {
      geneticoPontos = 10;
      recomendacoes.push("Ambos com testes genéticos - menor risco de doenças hereditárias");
    } else if (garanhao.historico_genetico || egua.historico_genetico) {
      geneticoPontos = 7;
    } else {
      alertas.push("Recomenda-se realizar testes genéticos antes do cruzamento");
    }
    factores.push({
      categoria: "Testes Genéticos",
      pontuacao: geneticoPontos,
      maxPontuacao: 10,
      comentario: garanhao.historico_genetico && egua.historico_genetico ? "Ambos testados" : garanhao.historico_genetico || egua.historico_genetico ? "Parcialmente testado" : "Sem testes",
      tipo: geneticoPontos >= 8 ? "positivo" : geneticoPontos >= 6 ? "neutro" : "negativo",
    });

    // 9. Defeitos conhecidos
    const defeitosComuns = garanhao.defeitos_conhecidos.filter((d) =>
      egua.defeitos_conhecidos.includes(d)
    );
    let defeitosPontos = 10 - defeitosComuns.length * 3;
    defeitosPontos = Math.max(0, defeitosPontos);
    if (defeitosComuns.length > 0) {
      alertas.push(`Defeitos em comum: ${defeitosComuns.join(", ")} - alto risco de transmissão`);
    }
    const totalDefeitos = garanhao.defeitos_conhecidos.length + egua.defeitos_conhecidos.length;
    if (totalDefeitos > 4) {
      defeitosPontos = Math.max(0, defeitosPontos - 2);
    }
    factores.push({
      categoria: "Defeitos Genéticos",
      pontuacao: defeitosPontos,
      maxPontuacao: 10,
      comentario: defeitosComuns.length > 0 ? `${defeitosComuns.length} defeitos em comum` : "Sem defeitos comuns",
      tipo: defeitosPontos >= 8 ? "positivo" : defeitosPontos >= 5 ? "neutro" : "negativo",
    });

    // Calcular pontuação total
    const pontuacaoTotal = factores.reduce((acc, f) => acc + f.pontuacao, 0);
    const pontuacaoMaxima = factores.reduce((acc, f) => acc + f.maxPontuacao, 0);
    const percentagem = Math.round((pontuacaoTotal / pontuacaoMaxima) * 100);

    let nivel: ResultadoCompatibilidade["nivel"];
    if (percentagem >= 80) nivel = "Excelente";
    else if (percentagem >= 60) nivel = "Boa";
    else if (percentagem >= 40) nivel = "Razoável";
    else nivel = "Problemática";

    // Recomendações finais
    if (nivel === "Excelente") {
      recomendacoes.push("Cruzamento altamente recomendado - excelente potencial genético");
    } else if (nivel === "Boa") {
      recomendacoes.push("Cruzamento recomendado com acompanhamento veterinário");
    } else if (nivel === "Razoável") {
      recomendacoes.push("Considere alternativas ou consulte um especialista em genética equina");
    } else {
      recomendacoes.push("Cruzamento não recomendado - riscos significativos identificados");
    }

    setResultado({
      pontuacao: percentagem,
      nivel,
      factores,
      alertas,
      recomendacoes,
    });
  };

  const CavaloForm = ({
    cavalo,
    setCavalo,
    titulo,
  }: {
    cavalo: Cavalo;
    setCavalo: (c: Cavalo) => void;
    titulo: string;
  }) => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-serif text-[#C5A059] mb-4 flex items-center gap-2">
        {cavalo.sexo === "Garanhão" ? "♂" : "♀"} {titulo}
      </h3>

      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Nome</label>
          <input
            type="text"
            value={cavalo.nome}
            onChange={(e) => setCavalo({ ...cavalo, nome: e.target.value })}
            className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
            placeholder="Nome do cavalo"
          />
        </div>

        {/* Idade e Altura */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Idade</label>
            <input
              type="number"
              value={cavalo.idade}
              onChange={(e) => setCavalo({ ...cavalo, idade: parseInt(e.target.value) || 0 })}
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
              min={1}
              max={30}
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Altura (cm)</label>
            <input
              type="number"
              value={cavalo.altura}
              onChange={(e) => setCavalo({ ...cavalo, altura: parseInt(e.target.value) || 0 })}
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
              min={140}
              max={180}
            />
          </div>
        </div>

        {/* Cor e Linhagem */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Pelagem</label>
            <select
              value={cavalo.cor}
              onChange={(e) => setCavalo({ ...cavalo, cor: e.target.value })}
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
            >
              {cores.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Linhagem</label>
            <select
              value={cavalo.linhagem}
              onChange={(e) => setCavalo({ ...cavalo, linhagem: e.target.value as Cavalo["linhagem"] })}
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
            >
              {linhagens.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Conformação */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Conformação ({cavalo.conformacao}/10)</label>
          <input
            type="range"
            value={cavalo.conformacao}
            onChange={(e) => setCavalo({ ...cavalo, conformacao: parseInt(e.target.value) })}
            className="w-full accent-[#C5A059]"
            min={1}
            max={10}
          />
        </div>

        {/* Temperamento e Disciplina */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Temperamento</label>
            <select
              value={cavalo.temperamento}
              onChange={(e) => setCavalo({ ...cavalo, temperamento: e.target.value as Cavalo["temperamento"] })}
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
            >
              {temperamentos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Disciplina</label>
            <select
              value={cavalo.disciplina}
              onChange={(e) => setCavalo({ ...cavalo, disciplina: e.target.value })}
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
            >
              {disciplinas.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Saúde e Fertilidade */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Saúde</label>
            <select
              value={cavalo.saude}
              onChange={(e) => setCavalo({ ...cavalo, saude: e.target.value as Cavalo["saude"] })}
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
            >
              {saudeOpcoes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Fertilidade</label>
            <select
              value={cavalo.fertilidade}
              onChange={(e) => setCavalo({ ...cavalo, fertilidade: e.target.value as Cavalo["fertilidade"] })}
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
            >
              {fertilidadeOpcoes.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Testes Genéticos */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={cavalo.historico_genetico}
              onChange={(e) => setCavalo({ ...cavalo, historico_genetico: e.target.checked })}
              className="w-5 h-5 accent-[#C5A059]"
            />
            <span className="text-sm text-zinc-300">Testes genéticos realizados</span>
          </label>
        </div>

        {/* Defeitos conhecidos */}
        <div>
          <label className="block text-xs text-zinc-400 mb-2">Defeitos conhecidos</label>
          <div className="grid grid-cols-2 gap-2">
            {defeitosComuns.map((defeito) => (
              <label key={defeito} className="flex items-center gap-2 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={cavalo.defeitos_conhecidos.includes(defeito)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCavalo({ ...cavalo, defeitos_conhecidos: [...cavalo.defeitos_conhecidos, defeito] });
                    } else {
                      setCavalo({ ...cavalo, defeitos_conhecidos: cavalo.defeitos_conhecidos.filter((d) => d !== defeito) });
                    }
                  }}
                  className="w-4 h-4 accent-red-500"
                />
                <span className="text-xs text-zinc-400">{defeito}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 sm:mb-12">
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
            Verificador de Compatibilidade
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Avalie a compatibilidade genética e física entre garanhão e égua para um cruzamento ideal.
          </p>
        </div>
      </div>

      {/* Forms */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
        <CavaloForm cavalo={garanhao} setCavalo={setGaranhao} titulo="Garanhão" />
        <CavaloForm cavalo={egua} setCavalo={setEgua} titulo="Égua" />
      </div>

      {/* Calcular Button */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <button
          onClick={calcularCompatibilidade}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#C5A059] text-black font-semibold rounded-lg hover:bg-[#D4AF6A] transition-all touch-manipulation active:scale-95"
        >
          <Dna size={20} />
          Verificar Compatibilidade
        </button>
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Pontuação Principal */}
          <div className={`rounded-2xl p-6 sm:p-8 mb-6 text-center ${
            resultado.nivel === "Excelente" ? "bg-green-500/10 border border-green-500/30" :
            resultado.nivel === "Boa" ? "bg-[#C5A059]/10 border border-[#C5A059]/30" :
            resultado.nivel === "Razoável" ? "bg-yellow-500/10 border border-yellow-500/30" :
            "bg-red-500/10 border border-red-500/30"
          }`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              {resultado.nivel === "Excelente" ? (
                <CheckCircle size={32} className="text-green-400" />
              ) : resultado.nivel === "Boa" ? (
                <Heart size={32} className="text-[#C5A059]" />
              ) : resultado.nivel === "Razoável" ? (
                <Info size={32} className="text-yellow-400" />
              ) : (
                <AlertTriangle size={32} className="text-red-400" />
              )}
              <span className={`text-2xl sm:text-3xl font-bold ${
                resultado.nivel === "Excelente" ? "text-green-400" :
                resultado.nivel === "Boa" ? "text-[#C5A059]" :
                resultado.nivel === "Razoável" ? "text-yellow-400" :
                "text-red-400"
              }`}>
                Compatibilidade {resultado.nivel}
              </span>
            </div>
            <div className="text-5xl sm:text-6xl font-bold text-white mb-2">
              {resultado.pontuacao}%
            </div>
            <p className="text-zinc-400 text-sm">
              {garanhao.nome} × {egua.nome}
            </p>
          </div>

          {/* Factores */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star size={20} className="text-[#C5A059]" />
              Análise Detalhada
            </h3>
            <div className="space-y-3">
              {resultado.factores.map((factor, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-40 sm:w-48 text-sm text-zinc-400">{factor.categoria}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          factor.tipo === "positivo" ? "bg-green-500" :
                          factor.tipo === "neutro" ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${(factor.pontuacao / factor.maxPontuacao) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={`w-16 text-right text-sm font-medium ${
                    factor.tipo === "positivo" ? "text-green-400" :
                    factor.tipo === "neutro" ? "text-yellow-400" :
                    "text-red-400"
                  }`}>
                    {factor.pontuacao}/{factor.maxPontuacao}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          {resultado.alertas.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-400">
                <AlertTriangle size={20} />
                Alertas
              </h3>
              <ul className="space-y-2">
                {resultado.alertas.map((alerta, i) => (
                  <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    {alerta}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendações */}
          <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#C5A059]">
              <CheckCircle size={20} />
              Recomendações
            </h3>
            <ul className="space-y-2">
              {resultado.recomendacoes.map((rec, i) => (
                <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-[#C5A059] mt-1">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-zinc-500 mt-8">
            * Esta ferramenta é apenas orientativa. Consulte sempre um veterinário e especialista em genética equina antes de proceder ao cruzamento.
          </p>
        </div>
      )}
    </main>
  );
}
