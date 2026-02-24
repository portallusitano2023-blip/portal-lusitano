/**
 * Seed: Coudelarias históricas do Lusitano
 *
 * Adiciona as 4 coudelarias mais importantes e conhecidas da raça PSL,
 * ordenadas por destaque (as mais conhecidas primeiro).
 *
 * FONTES VERIFICADAS:
 * - Baroque Horse Magazine: https://baroquehorsemagazine.com/manuel-veiga-stud/
 * - Lusitano Horse Finder: https://lusitanohorsefinder.com/lusitano-bloodlines/
 * - The Lusitano Collection: http://www.lusitanocollection.com/novi.htm
 * - Wikipedia: https://en.wikipedia.org/wiki/Alter_Real
 * - Wikipedia: https://en.wikipedia.org/wiki/Ruy_d%27Andrade
 * - Eurodressage: https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
 * - Superior Equine Sires: https://www.superiorequinesires.com/rubi-alter-real/
 * - Interagro: https://interagro.com.br
 *
 * Executar: npx dotenv -e .env.local -- npx tsx scripts/seed-coudelarias-historicas.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Carregar .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessários no .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Dados verificados ──────────────────────────────────────────────────────

const coudelarias = [
  {
    // FONTE: https://en.wikipedia.org/wiki/Alter_Real
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
    nome: "Coudelaria de Alter Real",
    slug: "coudelaria-alter-real",
    descricao:
      "A mais antiga e nobre coudelaria de Portugal, fundada em 1748 pelo Rei D. João V. " +
      "Cavalos barrocos, compactos e de acção alta, hoje a base da Escola Portuguesa de Arte Equestre. " +
      "Rubi AR representou Portugal nos Jogos Olímpicos de Londres 2012.",
    historia:
      "Fundada em 1748 pelo Rei D. João V com cerca de 300 éguas ibéricas. Tornou-se famosa em toda a Europa " +
      "como o melhor local para adquirir cavalos de Alta Escola. Quase extinta após as invasões napoleónicas " +
      "(1807) e a Revolução Republicana (1910), foi salva pelo Dr. Ruy d'Andrade com os garanhões Vigilante, " +
      "Regedor e Marialva II. Regedor (nascido em 1923) tornou-se o Chefe de Linhagem oficial. " +
      "Hoje é gerida pela Fundação Alter Real e cria cavalos para a Escola Portuguesa de Arte Equestre.",
    localizacao: "Alter do Chão",
    regiao: "Alentejo",
    ano_fundacao: 1748,
    especialidades: ["Alta Escola", "Dressage", "Atrelagem"],
    linhagens: ["Alter Real"],
    premios: [
      "Regedor — Chefe de Linhagem oficial do PSL",
      "Rubi AR — 16º Jogos Olímpicos Londres 2012",
      "Gentil — modelo da estátua equestre de D. José I",
    ],
    status: "active",
    destaque: true,
    ordem_destaque: 1,
    is_pro: false,
    views_count: 0,
  },
  {
    // FONTE: https://baroquehorsemagazine.com/manuel-veiga-stud/
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: http://www.lusitanocollection.com/novi.htm
    nome: "Coudelaria Manuel Veiga",
    slug: "coudelaria-manuel-veiga",
    descricao:
      "A mais emblemática coudelaria do Lusitano. Fundada no séc. XIX na Quinta da Broa por Rafael José da Cunha, " +
      "foi continuada por Manuel Veiga Tavares (marca MV). O cruzamento do garanhão Firme (Andrade) com éguas Veiga " +
      "produziu Novilheiro, Nilo, Neptuno e Opus II — a geração de ouro do Lusitano moderno.",
    historia:
      "A linhagem Veiga tem origem na Quinta da Broa, em Azinhaga (Ribatejo), fundada por Rafael José da Cunha " +
      "há mais de 180 anos. O programa de criação foi desenvolvido com base em dois garanhões Alter Real doados " +
      "pelo Rei D. Fernando II. Manuel Veiga Tavares, bisneto do fundador, continuou o programa, dando origem à " +
      "famosa marca 'MV'. A linhagem consolidou-se com o garanhão Agareno (nascido em 1931), filho de Lidador e " +
      "Bagocha, que se tornou um dos seis Chefes de Linhagem oficiais do Puro Sangue Lusitano.",
    localizacao: "Azinhaga",
    regiao: "Ribatejo",
    especialidades: ["Toureio", "Alta Escola", "Working Equitation", "Dressage"],
    linhagens: ["Veiga"],
    premios: [
      "Agareno — Chefe de Linhagem oficial do PSL",
      "Novilheiro — líder europeu em prémios de saltos (1983)",
      "Nilo — Campeão dos Campeões, Golegã 1974",
    ],
    status: "active",
    destaque: true,
    ordem_destaque: 2,
    is_pro: false,
    views_count: 0,
  },
  {
    // FONTE: https://en.wikipedia.org/wiki/Ruy_d%27Andrade
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://interagro.com.br
    // FONTE: https://www.herdadedoazinhal.com/en/the-stud-farm/
    nome: "Coudelaria Andrade",
    slug: "coudelaria-andrade",
    descricao:
      "Fundada em 1894 pelo Dr. Ruy d'Andrade com éguas espanholas Cartujanas. " +
      "Ganhou mais Campeonatos de Criação que qualquer outra coudelaria, incluindo Campeão Ibérico em 1970 e 1972. " +
      "O Dr. Ruy d'Andrade salvou a linha Alter Real da extinção e descobriu o cavalo Sorraia.",
    historia:
      "A coudelaria Andrade foi formada em 1894 por Dr. Ruy d'Andrade (1880-1967), com éguas de criadores " +
      "espanhóis de sangue Cartujano puro. Ganhou mais Campeonatos de Criação do que qualquer outra. " +
      "O garanhão Firme (1956-1978), cruzado com éguas Veiga, produziu Novilheiro, Nilo, Neptuno e Opus II. " +
      "Dr. Ruy d'Andrade salvou a linha Alter Real da extinção (1938) e descobriu o cavalo Sorraia (1920). " +
      "Após a sua morte em 1967, a coudelaria dividiu-se entre os seus filhos.",
    localizacao: "Coruche",
    regiao: "Ribatejo",
    ano_fundacao: 1894,
    especialidades: ["Dressage", "Toureio", "Reprodução"],
    linhagens: ["Andrade"],
    premios: [
      "Marialva II — Chefe de Linhagem oficial do PSL",
      "Campeão Ibérico de Criação (1970, 1972)",
      "Salvação da linha Alter Real (1938)",
    ],
    status: "active",
    destaque: true,
    ordem_destaque: 3,
    is_pro: false,
    views_count: 0,
  },
  {
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines-part-ii/
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    nome: "Coudelaria Nacional (Fonte Boa)",
    slug: "coudelaria-nacional-fonte-boa",
    descricao:
      "Instituição estatal fundada em 1887, responsável pela preservação e melhoria genética do Lusitano. " +
      "Localizada na Quinta da Fonte Boa, em Santarém. Detém 3 dos 6 Chefes de Linhagem oficiais da raça, " +
      "incluindo Hucharia — a única égua entre os fundadores.",
    historia:
      "A Coudelaria Nacional foi fundada em 1887, na Quinta da Fonte Boa, em Santarém, nas férteis margens " +
      "do rio Tejo. Tem como Chefes de Linha oficiais Primoroso (n. 1927), Destinado (n. 1930) e Hucharia " +
      "(n. 1943) — a única égua entre os seis fundadores oficiais da raça. Os cavalos CN são tipicamente " +
      "maiores e mais redondos, adequados para atrelagem e dressage. Hoje faz parte da Fundação Alter Real.",
    localizacao: "Santarém",
    regiao: "Ribatejo",
    ano_fundacao: 1887,
    especialidades: ["Atrelagem", "Dressage", "Reprodução"],
    linhagens: ["Coudelaria Nacional"],
    premios: [
      "Primoroso — Chefe de Linhagem oficial do PSL",
      "Destinado — Chefe de Linhagem oficial do PSL",
      "Hucharia — única égua Chefe de Linhagem do PSL",
    ],
    status: "active",
    destaque: true,
    ordem_destaque: 4,
    is_pro: false,
    views_count: 0,
  },
];

// ─── Inserção ───────────────────────────────────────────────────────────────

async function seed() {
  console.log("🐴 Seed: Coudelarias históricas do Lusitano\n");

  let inserted = 0;
  let skipped = 0;

  for (const coudelaria of coudelarias) {
    // Verificar se já existe
    const { data: existing } = await supabase
      .from("coudelarias")
      .select("id")
      .eq("slug", coudelaria.slug)
      .single();

    if (existing) {
      console.log(`⚠️  ${coudelaria.nome} já existe (id: ${existing.id}) — ignorada`);
      skipped++;
      continue;
    }

    const { data, error } = await supabase
      .from("coudelarias")
      .insert(coudelaria)
      .select("id, slug")
      .single();

    if (error) {
      console.error(`❌ Erro ao inserir ${coudelaria.nome}:`, error.message);
      continue;
    }

    console.log(`✅ ${coudelaria.nome} — id: ${data.id}, slug: ${data.slug}`);
    inserted++;
  }

  console.log(`\n📊 Resultado: ${inserted} inseridas, ${skipped} já existiam`);
  console.log("🔗 Ver em: /directorio");
}

seed();
