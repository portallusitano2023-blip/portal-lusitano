import { supabase, supabaseAdmin } from "@/lib/supabase-admin";
import { logger } from "@/lib/logger";
import ProfissionaisContent from "@/components/profissionais/ProfissionaisContent";

import type {
  Profissional,
  CategoriaProf,
  NivelVerificacao,
  Evento,
  ArtigoEducativo,
} from "@/components/profissionais/types";

export const revalidate = 3600;

// -----------------------------------------------------------------------------
// Map raw Supabase row to the Profissional type used by the client component
// -----------------------------------------------------------------------------
function mapProfissional(p: Record<string, unknown>): Profissional {
  return {
    id: p.id as string,
    nome: p.nome as string,
    titulo: (p.especialidade as string) || "",
    especialidade: (p.especialidade as string) || (p.tipo as string) || "",
    categoria: (p.tipo as CategoriaProf) || "veterinario",
    localizacao: (p.cidade as string) || (p.distrito as string) || "",
    distrito: (p.distrito as string) || "",
    telefone: (p.telemovel as string) || "",
    email: (p.email as string) || "",
    descricao: (p.descricao_completa as string) || (p.descricao_curta as string) || "",
    avaliacao: (p.rating_average as number) || 0,
    numAvaliacoes: (p.rating_count as number) || 0,
    servicos: Array.isArray(p.servicos_oferecidos)
      ? (p.servicos_oferecidos as { nome: string }[]).map((s) => s.nome || String(s))
      : [],
    nivelVerificacao: p.verificado
      ? ("verificado" as NivelVerificacao)
      : ("basico" as NivelVerificacao),
    experienciaAnos: (p.anos_experiencia as number) || 0,
    especializacoes: [],
    credenciais: [],
    metricas: {
      tempoResposta: "< 24h",
      taxaSatisfacao: 0,
      casosConcluidosAno: 0,
      clientesRecorrentes: 0,
      recomendacoes: 0,
      anosAtivo: 0,
      cavalosAtendidos: 0,
    },
    disponibilidade: {
      diasSemana: [],
      horaInicio: "",
      horaFim: "",
      emergencias24h: false,
      raioServico: 0,
    },
    idiomas: ["Portugues"],
    associacoes: [],
    modalidade:
      (p.modalidade as "presencial" | "online" | "clinicas_internacionais") || "presencial",
    pais: (p.pais as string) || undefined,
    destaque: (p.destaque as boolean) || false,
    fotoUrl: (p.foto_perfil_url as string) || undefined,
    redesSociais: {
      website: (p.website as string) || undefined,
      instagram: (p.instagram as string) || undefined,
    },
  };
}

// -----------------------------------------------------------------------------
// Map raw Supabase evento row to the Evento type
// -----------------------------------------------------------------------------
function mapEvento(e: Record<string, unknown>): Evento {
  return {
    id: e.id as string,
    titulo: e.titulo as string,
    tipo: e.tipo as Evento["tipo"],
    data: e.data_inicio as string,
    dataFim: (e.data_fim as string) || undefined,
    local: (e.local as string) || "",
    pais: (e.pais as string) || undefined,
    online: (e.online as boolean) || undefined,
    organizador: (e.profissionais as unknown as { nome: string })?.nome || "Profissional",
    preco: (e.preco as string) || undefined,
    vagas: (e.vagas as number) || undefined,
    descricao: (e.descricao as string) || "",
    linkInscricao: (e.link_inscricao as string) || undefined,
  };
}

// -----------------------------------------------------------------------------
// Map raw Supabase artigo row to the ArtigoEducativo type
// -----------------------------------------------------------------------------
function mapArtigo(a: Record<string, unknown>): ArtigoEducativo {
  return {
    id: a.id as string,
    titulo: a.titulo as string,
    autor: (a.profissionais as unknown as { nome: string })?.nome || "Profissional",
    categoria: (a.categoria as string) || "",
    resumo: (a.resumo as string) || "",
    conteudo: (a.conteudo as string) || undefined,
    data: new Date(a.created_at as string).toISOString().slice(0, 7),
    leituras: (a.leituras as number) || 0,
  };
}

// =============================================================================
// SERVER COMPONENT — fetches all data in parallel, passes to client
// =============================================================================
export default async function ProfissionaisPage() {
  const today = new Date().toISOString().split("T")[0];

  // Parallel fetch all 3 data sources — matching exact queries from API routes
  const [profResult, eventosResult, artigosResult] = await Promise.all([
    // From app/api/profissionais/route.ts — uses supabase (anon/public, respects RLS)
    supabase
      .from("profissionais")
      .select(
        "id, nome, slug, tipo, especialidade, descricao_curta, descricao_completa, cidade, distrito, pais, modalidade, telemovel, email, website, instagram, foto_perfil_url, servicos_oferecidos, rating_average, rating_count, destaque, ordem_destaque, verificado, plano, anos_experiencia, created_at"
      )
      .eq("status", "aprovado")
      .is("deleted_at", null)
      .order("destaque", { ascending: false })
      .order("ordem_destaque", { ascending: true })
      .order("rating_average", { ascending: false }),

    // From app/api/profissionais/eventos/route.ts — uses supabaseAdmin
    supabaseAdmin
      .from("profissionais_eventos")
      .select(
        "id, titulo, tipo, descricao, data_inicio, data_fim, local, pais, online, link_inscricao, preco, vagas, created_at, profissional_id, profissionais(nome)"
      )
      .gte("data_inicio", today)
      .order("data_inicio", { ascending: true })
      .limit(50),

    // From app/api/profissionais/artigos/route.ts — uses supabaseAdmin
    supabaseAdmin
      .from("profissionais_artigos")
      .select(
        "id, titulo, categoria, resumo, conteudo, leituras, created_at, profissional_id, profissionais(nome)"
      )
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (profResult.error) logger.error("[ProfissionaisPage] profissionais:", profResult.error);
  if (eventosResult.error) logger.error("[ProfissionaisPage] eventos:", eventosResult.error);
  if (artigosResult.error) logger.error("[ProfissionaisPage] artigos:", artigosResult.error);

  const profissionais: Profissional[] = (profResult.data || []).map((p: Record<string, unknown>) =>
    mapProfissional(p)
  );

  const eventos: Evento[] = (eventosResult.data || []).map((e: Record<string, unknown>) =>
    mapEvento(e)
  );

  const artigos: ArtigoEducativo[] = (artigosResult.data || []).map((a: Record<string, unknown>) =>
    mapArtigo(a)
  );

  return (
    <ProfissionaisContent
      initialProfissionais={profissionais}
      initialEventos={eventos}
      initialArtigos={artigos}
    />
  );
}
