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
    <>
      {/* Professional Pricing Section */}
      <section className="px-6 md:px-12 pt-32 pb-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[var(--gold)] text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.4em] font-bold border border-[var(--gold)]/30 px-4 py-2 mb-8">
            Registe-se como Profissional
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-none tracking-tight mb-6">
            Aumente a sua
            <br />
            <em className="text-[var(--gold)]">Visibilidade</em>
          </h2>
          <p className="text-[var(--foreground-secondary)] text-lg max-w-2xl mx-auto font-light">
            Registe-se no directório profissional e alcance novos clientes no mercado Lusitano.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="grid md:grid-cols-1 max-w-2xl mx-auto">
          <div className="p-8 sm:p-10 border border-[var(--border)] rounded-2xl relative bg-[var(--gold)]/5">
            {/* Top border accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--gold)]" />

            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="flex items-center gap-1.5 bg-[var(--gold)] text-black text-[9px] uppercase tracking-wider font-bold px-3.5 py-1.5 whitespace-nowrap rounded-full">
                Directório Profissional
              </span>
            </div>

            <div className="mb-8 pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">Plano anual</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-serif bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] bg-clip-text text-transparent">
                  6
                </span>
                <span className="text-[var(--foreground-secondary)] text-lg">EUR</span>
                <span className="text-[var(--foreground-muted)] text-base">/mês</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                Faturado anualmente: 72€/ano · Cancele quando quiser
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3.5 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--gold)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[var(--foreground-secondary)]">Perfil verificado no directório</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--gold)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[var(--foreground-secondary)]">Visibilidade elevada entre compradores</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--gold)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[var(--foreground-secondary)]">Contacto directo com clientes</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--gold)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[var(--foreground-secondary)]">Badge profissional exclusivo</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--gold)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[var(--foreground-secondary)]">Publicar eventos e artigos educativos</span>
              </li>
            </ul>

            {/* CTA Button */}
            <a
              href="/profissionais/registar"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black font-bold rounded-xl hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all shadow-lg shadow-[var(--gold)]/25 hover:shadow-[var(--gold)]/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Começar Registo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Trust note */}
            <p className="text-center text-[10px] text-[var(--foreground-muted)] mt-4">
              Cancele a qualquer momento · Sem fidelização
            </p>
          </div>
        </div>
      </section>

      {/* Directory Content */}
      <ProfissionaisContent
        initialProfissionais={profissionais}
        initialEventos={eventos}
        initialArtigos={artigos}
      />
    </>
  );
}
