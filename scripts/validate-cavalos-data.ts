#!/usr/bin/env tsx
/**
 * Script de Validação - Dados de Cavalos Famosos
 *
 * Valida que TODOS os cavalos em app/cavalos-famosos/data.ts:
 * 1. Têm comentários de fonte verificável (// FONTE:)
 * 2. Têm datas consistentes (nascimento < falecimento)
 * 3. Têm pedigrees lógicos (pais nasceram antes dos filhos)
 * 4. NÃO têm campos não verificáveis (estatisticasDescendentes, indiceReproducao, influenciaGenetica)
 *
 * Executar: npx tsx scripts/validate-cavalos-data.ts
 */

import * as fs from "fs";
import * as path from "path";

interface ValidationError {
  cavalo: string;
  tipo: string;
  mensagem: string;
  linha?: number;
}

const errors: ValidationError[] = [];
let totalCavalos = 0;
let cavalosComFontes = 0;

// Ler o ficheiro de dados
const dataPath = path.join(process.cwd(), "app", "cavalos-famosos", "data.ts");
const fileContent = fs.readFileSync(dataPath, "utf-8");
const lines = fileContent.split("\n");

console.log("🔍 VALIDAÇÃO DE DADOS - CAVALOS FAMOSOS LUSITANOS\n");
console.log("═".repeat(70) + "\n");

// ============================================================================
// VALIDAÇÃO 1: Todos os cavalos têm fontes
// ============================================================================
console.log("📋 1. VERIFICANDO FONTES...\n");

const cavalosRegex = /\{\s*(?:\/\/[^\n]*\n\s*)*id:\s*"(\d+)"/g;
const fontesRegex = /\/\/\s*FONTE:\s*(https?:\/\/[^\s]+)/g;
const verificadoRegex = /\/\/\s*VERIFICADO:\s*(\d{4}-\d{2}-\d{2})/;

let match;
let currentCavaloId: string | null = null;
let currentCavaloNome: string | null = null;
let currentCavaloFontes: string[] = [];
let currentCavaloVerificado: string | null = null;

// Iterar linha por linha
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detectar início de cavalo
  if (line.match(/\{\s*$/)) {
    currentCavaloId = null;
    currentCavaloNome = null;
    currentCavaloFontes = [];
    currentCavaloVerificado = null;
  }

  // Extrair ID
  const idMatch = line.match(/id:\s*"(\d+)"/);
  if (idMatch) {
    currentCavaloId = idMatch[1];
    totalCavalos++;
  }

  // Extrair Nome
  const nomeMatch = line.match(/nome:\s*"([^"]+)"/);
  if (nomeMatch && currentCavaloId) {
    currentCavaloNome = nomeMatch[1];
  }

  // Extrair Fontes
  const fonteMatch = line.match(/\/\/\s*FONTE:\s*(https?:\/\/[^\s]+)/);
  if (fonteMatch) {
    currentCavaloFontes.push(fonteMatch[1]);
  }

  // Extrair data de verificação
  const verificadoMatch = line.match(/\/\/\s*VERIFICADO:\s*(\d{4}-\d{2}-\d{2})/);
  if (verificadoMatch) {
    currentCavaloVerificado = verificadoMatch[1];
  }

  // Ao chegar ao fim de um cavalo (fechar chaves), validar
  if (line.match(/^\s*\},\s*$/) && currentCavaloId && currentCavaloNome) {
    if (currentCavaloFontes.length === 0) {
      errors.push({
        cavalo: currentCavaloNome,
        tipo: "SEM_FONTE",
        mensagem: `Cavalo "${currentCavaloNome}" não tem comentários // FONTE:`,
        linha: i + 1,
      });
    } else {
      cavalosComFontes++;
      console.log(
        `   ✅ ${currentCavaloNome} - ${currentCavaloFontes.length} fonte(s) verificada(s)`
      );
    }

    if (!currentCavaloVerificado) {
      errors.push({
        cavalo: currentCavaloNome,
        tipo: "SEM_DATA_VERIFICACAO",
        mensagem: `Cavalo "${currentCavaloNome}" não tem comentário // VERIFICADO:`,
        linha: i + 1,
      });
    }
  }
}

console.log(`\n   📊 ${cavalosComFontes}/${totalCavalos} cavalos com fontes\n`);

// ============================================================================
// VALIDAÇÃO 2: Datas consistentes
// ============================================================================
console.log("📅 2. VERIFICANDO DATAS...\n");

const dataNascimentoRegex = /anoNascimento:\s*(\d{4})/;
const dataFalecimentoRegex = /anoFalecimento:\s*(\d{4})/;

let currentNascimento: number | null = null;
let currentFalecimento: number | null = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Resetar ao encontrar novo cavalo
  if (line.match(/\{\s*$/) || line.match(/id:\s*"\d+"/)) {
    currentNascimento = null;
    currentFalecimento = null;
    currentCavaloNome = null;
  }

  // Extrair nome
  const nomeMatch = line.match(/nome:\s*"([^"]+)"/);
  if (nomeMatch) {
    currentCavaloNome = nomeMatch[1];
  }

  // Extrair nascimento
  const nascMatch = line.match(dataNascimentoRegex);
  if (nascMatch) {
    currentNascimento = parseInt(nascMatch[1]);
  }

  // Extrair falecimento
  const falecMatch = line.match(dataFalecimentoRegex);
  if (falecMatch) {
    currentFalecimento = parseInt(falecMatch[1]);
  }

  // Validar ao fim do cavalo
  if (line.match(/^\s*\},\s*$/) && currentCavaloNome && currentNascimento) {
    if (currentFalecimento && currentFalecimento <= currentNascimento) {
      errors.push({
        cavalo: currentCavaloNome,
        tipo: "DATA_INCONSISTENTE",
        mensagem: `Falecimento (${currentFalecimento}) <= Nascimento (${currentNascimento})`,
        linha: i + 1,
      });
    } else {
      console.log(`   ✅ ${currentCavaloNome} - Datas consistentes`);
    }
  }
}

console.log("");

// ============================================================================
// VALIDAÇÃO 3: Pedigrees lógicos
// ============================================================================
console.log("🧬 3. VERIFICANDO PEDIGREES...\n");

const pedigreeRegex = /pedigree:\s*\{([^}]+)\}/g;
const paiAnoRegex = /pai:\s*\{[^}]*ano:\s*(\d{4})/;
const maeAnoRegex = /mae:\s*\{[^}]*ano:\s*(\d{4})/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Extrair nome
  const nomeMatch = line.match(/nome:\s*"([^"]+)"/);
  if (nomeMatch) {
    currentCavaloNome = nomeMatch[1];
  }

  // Extrair nascimento
  const nascMatch = line.match(dataNascimentoRegex);
  if (nascMatch) {
    currentNascimento = parseInt(nascMatch[1]);
  }

  // Verificar pedigree
  if (line.includes("pedigree:") && currentCavaloNome && currentNascimento) {
    // Ler próximas linhas até fechar pedigree
    let pedigreeText = "";
    let j = i;
    let braceCount = 0;

    do {
      pedigreeText += lines[j] + "\n";
      braceCount += (lines[j].match(/\{/g) || []).length;
      braceCount -= (lines[j].match(/\}/g) || []).length;
      j++;
    } while (braceCount > 0 && j < lines.length);

    const paiAnoMatch = pedigreeText.match(paiAnoRegex);
    const maeAnoMatch = pedigreeText.match(maeAnoRegex);

    if (paiAnoMatch) {
      const paiAno = parseInt(paiAnoMatch[1]);
      if (paiAno >= currentNascimento) {
        errors.push({
          cavalo: currentCavaloNome,
          tipo: "PEDIGREE_INVALIDO",
          mensagem: `Pai nasceu em ${paiAno}, filho em ${currentNascimento} (impossível)`,
          linha: i + 1,
        });
      } else {
        console.log(`   ✅ ${currentCavaloNome} - Pedigree paterno lógico`);
      }
    }

    if (maeAnoMatch) {
      const maeAno = parseInt(maeAnoMatch[1]);
      if (maeAno >= currentNascimento) {
        errors.push({
          cavalo: currentCavaloNome,
          tipo: "PEDIGREE_INVALIDO",
          mensagem: `Mãe nasceu em ${maeAno}, filho em ${currentNascimento} (impossível)`,
          linha: i + 1,
        });
      } else {
        console.log(`   ✅ ${currentCavaloNome} - Pedigree materno lógico`);
      }
    }
  }
}

console.log("");

// ============================================================================
// VALIDAÇÃO 4: Campos não verificáveis REMOVIDOS
// ============================================================================
console.log("🚫 4. VERIFICANDO CAMPOS NÃO VERIFICÁVEIS...\n");

const camposProibidos = ["estatisticasDescendentes", "indiceReproducao", "influenciaGenetica"];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Extrair nome se estiver no contexto de um cavalo
  const nomeMatch = line.match(/nome:\s*"([^"]+)"/);
  if (nomeMatch) {
    currentCavaloNome = nomeMatch[1];
  }

  // Verificar campos proibidos
  for (const campo of camposProibidos) {
    if (line.includes(`${campo}:`)) {
      // Verificar se não é um comentário
      if (!line.trim().startsWith("//")) {
        errors.push({
          cavalo: currentCavaloNome || "Desconhecido",
          tipo: "CAMPO_NAO_VERIFICAVEL",
          mensagem: `Campo "${campo}" encontrado (deveria estar removido)`,
          linha: i + 1,
        });
      }
    }
  }
}

if (errors.filter((e) => e.tipo === "CAMPO_NAO_VERIFICAVEL").length === 0) {
  console.log("   ✅ Todos os campos não verificáveis foram removidos\n");
} else {
  console.log("   ❌ Campos não verificáveis encontrados\n");
}

// ============================================================================
// RESULTADOS FINAIS
// ============================================================================
console.log("═".repeat(70));
console.log("\n📊 RESULTADO FINAL\n");

if (errors.length === 0) {
  console.log("✅ VALIDAÇÃO PASSOU - 100% DOS DADOS VERIFICADOS!\n");
  console.log(`   • Total de cavalos: ${totalCavalos}`);
  console.log(`   • Cavalos com fontes: ${cavalosComFontes}`);
  console.log(`   • Datas consistentes: ✅`);
  console.log(`   • Pedigrees lógicos: ✅`);
  console.log(`   • Campos não verificáveis: 0`);
  console.log("\n🎉 Todos os critérios de qualidade foram cumpridos!\n");
  process.exit(0);
} else {
  console.log(`❌ VALIDAÇÃO FALHOU - ${errors.length} ERRO(S) ENCONTRADO(S)\n`);

  // Agrupar erros por tipo
  const errosPorTipo = errors.reduce(
    (acc, error) => {
      if (!acc[error.tipo]) acc[error.tipo] = [];
      acc[error.tipo].push(error);
      return acc;
    },
    {} as Record<string, ValidationError[]>
  );

  for (const [tipo, errosDoTipo] of Object.entries(errosPorTipo)) {
    console.log(`\n   🔴 ${tipo} (${errosDoTipo.length}):`);
    for (const error of errosDoTipo) {
      console.log(`      - ${error.cavalo}: ${error.mensagem}`);
      if (error.linha) {
        console.log(`        Linha: ${error.linha}`);
      }
    }
  }

  console.log("\n❌ Corrija os erros acima e execute novamente.\n");
  process.exit(1);
}
