"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Users,
  CalendarDays,
  FileText,
  ChevronDown,
  ArrowRight,
  Star,
  ShieldCheck,
  CheckCircle2,
  LayoutGrid,
  TrendingUp,
  Plus,
} from "lucide-react";

import type {
  CategoriaProf,
  NivelVerificacao,
  Profissional,
  Evento,
  ArtigoEducativo,
} from "@/components/profissionais/types";
import { calcularEstatisticas } from "@/components/profissionais/data";
import {
  CardProfissional,
  ModalProfissional,
  EventosSection,
  EventoForm,
  ArtigoForm,
  SearchFilters,
  CategoriasTabs,
} from "@/components/profissionais";
import { categorias as categoriasConfig } from "@/components/profissionais/constants";

import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import MagneticButton from "@/components/ui/MagneticButton";
import ParallaxSection from "@/components/ui/ParallaxSection";
import TextSplit from "@/components/TextSplit";
// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ProfissionaisPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaProf | "todos">("todos");
  const [distritoAtivo, setDistritoAtivo] = useState("Todos");
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [filtroVerificacao, setFiltroVerificacao] = useState<NivelVerificacao | "todos">("todos");
  const [abaAtiva, setAbaAtiva] = useState<"profissionais" | "eventos" | "artigos">(
    "profissionais"
  );
  const [profissionaisBD, setProfissionaisBD] = useState<Profissional[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [artigos, setArtigos] = useState<ArtigoEducativo[]>([]);
  const [showEventoForm, setShowEventoForm] = useState(false);
  const [showArtigoForm, setShowArtigoForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfissionais = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let cancelled = false;
    try {
      const res = await fetch("/api/profissionais");
      if (cancelled) return;
      if (!res.ok) {
        setError("error");
        return;
      }
      const data = await res.json();
      if (cancelled) return;
      if (data.profissionais && data.profissionais.length > 0) {
        const mapped: Profissional[] = data.profissionais.map((p: Record<string, unknown>) => ({
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
          idiomas: ["Português"],
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
        }));
        setProfissionaisBD(mapped);
      }
    } catch (err) {
      if (!cancelled) {
        if (process.env.NODE_ENV === "development") console.error("[Profissionais]", err);
        setError("error");
      }
    } finally {
      if (!cancelled) setIsLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadProfissionais();
  }, [loadProfissionais]);

  // Fetch events and articles from DB
  const fetchEventos = () => {
    fetch("/api/profissionais/eventos")
      .then((r) => r.json())
      .then((d) => setEventos(d.eventos || []))
      .catch(() => {});
  };
  const fetchArtigos = () => {
    fetch("/api/profissionais/artigos")
      .then((r) => r.json())
      .then((d) => setArtigos(d.artigos || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchEventos();
    fetchArtigos();
  }, []);

  const isProfissional = useMemo(() => {
    if (!user?.email) return false;
    return profissionaisBD.some((p) => p.email.toLowerCase() === user.email?.toLowerCase());
  }, [user, profissionaisBD]);

  const todosProfissionais = useMemo(() => profissionaisBD, [profissionaisBD]);

  const stats = useMemo(() => calcularEstatisticas(profissionaisBD), [profissionaisBD]);

  const profissionaisFiltrados = useMemo(() => {
    return todosProfissionais
      .filter((p) => {
        const matchPesquisa =
          p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          p.especialidade.toLowerCase().includes(pesquisa.toLowerCase()) ||
          p.servicos.some((s) => s.toLowerCase().includes(pesquisa.toLowerCase()));
        const matchCategoria = categoriaAtiva === "todos" || p.categoria === categoriaAtiva;
        const matchDistrito = distritoAtivo === "Todos" || p.distrito === distritoAtivo;
        const matchVerificacao =
          filtroVerificacao === "todos" || p.nivelVerificacao === filtroVerificacao;
        return matchPesquisa && matchCategoria && matchDistrito && matchVerificacao;
      })
      .sort((a, b) => {
        const nivelOrder = { expert: 4, certificado: 3, verificado: 2, basico: 1 };
        const nivelDiff = nivelOrder[b.nivelVerificacao] - nivelOrder[a.nivelVerificacao];
        if (nivelDiff !== 0) return nivelDiff;
        return b.avaliacao - a.avaliacao;
      });
  }, [pesquisa, categoriaAtiva, distritoAtivo, filtroVerificacao, todosProfissionais]);

  const profissionaisDestaque = useMemo(() => {
    return todosProfissionais
      .filter((p) => p.destaque)
      .sort((a, b) => b.avaliacao - a.avaliacao)
      .slice(0, 3);
  }, [todosProfissionais]);

  const handleScrollToDirectory = () => {
    document.getElementById("directorio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ================================================================= */}
      {/* S1: HERO CINEMATOGRÁFICO */}
      {/* ================================================================= */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <ParallaxSection speed={0.4} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=80"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-50"
            priority
          />
        </ParallaxSection>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/50 to-black/40 z-[1]" />
        <div className="absolute inset-0 noise-overlay z-[2]" />

        {/* Gradient orbs */}
        <div
          className="gradient-orb absolute top-[20%] left-[15%] w-[500px] h-[500px] z-[1]"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
        />
        <div
          className="gradient-orb absolute bottom-[10%] right-[10%] w-[400px] h-[400px] z-[1]"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Label */}
          <RevealOnScroll variant="fade-up" delay={400}>
            <span className="inline-block text-[var(--gold)] uppercase tracking-[0.3em] text-[10px] font-bold mb-6">
              {t.profissionais.badge}
            </span>
          </RevealOnScroll>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif italic mb-6">
            <TextSplit text={t.profissionais.title} baseDelay={0.5} />
          </h1>

          {/* Decorative line */}
          <RevealOnScroll variant="fade-scale" delay={900}>
            <div className="w-24 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
          </RevealOnScroll>

          {/* Subtitle */}
          <RevealOnScroll variant="blur-up" delay={1000}>
            <p className="text-lg sm:text-xl font-serif italic text-[var(--foreground-secondary)] max-w-2xl mx-auto mb-10">
              {t.profissionais.subtitle}
            </p>
          </RevealOnScroll>

          {/* CTAs */}
          <RevealOnScroll variant="fade-up" delay={1200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagneticButton>
                <Link
                  href="/profissionais/registar"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--gold)] text-black font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors text-sm"
                >
                  <ShieldCheck size={18} />
                  {t.profissionais.register}
                </Link>
              </MagneticButton>
              <MagneticButton>
                <button
                  onClick={handleScrollToDirectory}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--gold)]/30 text-[var(--foreground)] rounded-lg hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/5 transition-all text-sm"
                >
                  {t.profissionais.explore}
                  <ArrowRight size={16} />
                </button>
              </MagneticButton>
            </div>
          </RevealOnScroll>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <RevealOnScroll variant="fade-up" delay={1800}>
              <button
                onClick={handleScrollToDirectory}
                className="text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors animate-bounce"
                aria-label="Scroll para baixo"
              >
                <ChevronDown size={24} />
              </button>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* S2: STATS BAR */}
      {/* ================================================================= */}
      <section className="border-y border-[var(--border)] bg-[var(--background-secondary)]/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                end: stats.totalProfissionais,
                suffix: "+",
                label: t.profissionais.stat_professionals,
                icon: Users,
              },
              {
                end: stats.profissionaisVerificados,
                suffix: "",
                label: t.profissionais.stat_verified,
                icon: CheckCircle2,
              },
              {
                end: categoriasConfig.filter((c) => c.id !== "todos").length,
                suffix: "",
                label: t.profissionais.stat_categories,
                icon: LayoutGrid,
              },
              {
                end: stats.clientesSatisfeitos,
                suffix: "%",
                label: t.profissionais.stat_satisfaction,
                icon: TrendingUp,
              },
            ].map((stat, i) => (
              <RevealOnScroll key={stat.label} variant="fade-up" delay={i * 100}>
                <div className="text-center">
                  <stat.icon size={20} className="mx-auto mb-2 text-[var(--gold)]/60" />
                  <div className="text-2xl sm:text-3xl font-bold text-gradient-gold mb-1">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* S3: DESTAQUE (top 3 profissionais) */}
      {/* ================================================================= */}
      {profissionaisDestaque.length > 0 && (
        <section className="py-16 px-4 sm:px-6 bg-[var(--background-secondary)]/30">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll variant="fade-up">
              <div className="text-center mb-10">
                <span className="text-[var(--gold)] uppercase tracking-[0.3em] text-[9px] font-bold block mb-2">
                  {t.profissionais.featured_badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif italic">
                  {t.profissionais.featured_title}
                </h2>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-6">
              {profissionaisDestaque.map((prof, i) => (
                <RevealOnScroll key={prof.id} variant="fade-up" delay={i * 150}>
                  <button
                    onClick={() => setProfissionalSelecionado(prof)}
                    className="card-premium shimmer-gold w-full text-left rounded-xl overflow-hidden group"
                  >
                    {/* Gradient header band */}
                    <div className="h-2 bg-gradient-to-r from-[var(--gold)]/60 via-[var(--gold)] to-[var(--gold)]/60" />

                    <div className="p-6">
                      {/* Avatar + info */}
                      <div className="flex items-start gap-4 mb-4">
                        {prof.fotoUrl ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                            <Image
                              src={prof.fotoUrl}
                              alt={prof.nome}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-[var(--gold)]/30 to-[var(--background-card)] rounded-xl flex items-center justify-center text-2xl font-serif text-[var(--gold)] flex-shrink-0">
                            {prof.nome.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--foreground)] truncate">
                              {prof.nome}
                            </h3>
                            {prof.nivelVerificacao !== "basico" && (
                              <ShieldCheck size={14} className="text-[var(--gold)] flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-[var(--gold)] truncate mt-0.5">
                            {prof.especialidade}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={
                                s <= Math.round(prof.avaliacao)
                                  ? "text-[var(--gold)] fill-[var(--gold)]"
                                  : "text-[var(--foreground-muted)]"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[var(--foreground-secondary)]">
                          {prof.avaliacao} ({prof.numAvaliacoes})
                        </span>
                      </div>

                      {/* Top 3 services */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {prof.servicos.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 text-[10px] rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 text-[var(--gold)]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-1 text-sm text-[var(--gold)] font-medium group-hover:gap-2 transition-all">
                        {t.profissionais.view_profile}
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </button>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* S5: DIRECTÓRIO */}
      {/* ================================================================= */}
      <section id="directorio" className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <RevealOnScroll variant="fade-up">
            <div className="flex gap-2 border-b border-[var(--border)] pb-3 mb-6">
              {[
                {
                  id: "profissionais" as const,
                  label: t.profissionais.stat_professionals,
                  icon: Users,
                },
                { id: "eventos" as const, label: t.nav.events, icon: CalendarDays },
                { id: "artigos" as const, label: t.journal.article_type, icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAbaAtiva(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    abaAtiva === tab.id
                      ? "bg-[var(--gold)] text-black font-medium"
                      : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </RevealOnScroll>

          {abaAtiva === "profissionais" && (
            <>
              {/* Categorias compactas */}
              <RevealOnScroll variant="fade-up" delay={100}>
                <div className="mb-6">
                  <CategoriasTabs
                    categoriaAtiva={categoriaAtiva}
                    onCategoriaChange={setCategoriaAtiva}
                  />
                </div>
              </RevealOnScroll>

              {/* Filtros */}
              <RevealOnScroll variant="fade-up" delay={200}>
                <div className="mb-6">
                  <SearchFilters
                    pesquisa={pesquisa}
                    onPesquisaChange={setPesquisa}
                    distritoAtivo={distritoAtivo}
                    onDistritoChange={setDistritoAtivo}
                    filtroVerificacao={filtroVerificacao}
                    onVerificacaoChange={setFiltroVerificacao}
                    totalResultados={profissionaisFiltrados.length}
                  />
                </div>
              </RevealOnScroll>

              {/* Grid */}
              <div aria-live="polite" aria-atomic="true">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059] mx-auto" />
                    <p className="text-sm text-[var(--foreground-muted)] mt-4">
                      A carregar profissionais...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-400 mb-4">{t.errors.error_loading}</p>
                    <button
                      onClick={loadProfissionais}
                      className="px-6 py-2 text-sm font-medium text-[#C5A059] border border-[#C5A059]/30 rounded-lg hover:bg-[#C5A059]/10 transition-colors"
                    >
                      {t.errors.try_again}
                    </button>
                  </div>
                ) : profissionaisFiltrados.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {profissionaisFiltrados.map((prof, i) => (
                      <RevealOnScroll key={prof.id} variant="fade-up" delay={Math.min(i * 80, 600)}>
                        <CardProfissional
                          prof={prof}
                          onClick={() => setProfissionalSelecionado(prof)}
                        />
                      </RevealOnScroll>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Search size={32} className="mx-auto mb-4 text-[var(--foreground-muted)]" />
                    <h3 className="text-lg font-medium mb-2">{t.profissionais.no_results}</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {t.profissionais.no_results_hint}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {abaAtiva === "eventos" && (
            <RevealOnScroll variant="fade-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Próximos Eventos</h2>
                {isProfissional && (
                  <button
                    onClick={() => setShowEventoForm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--gold)] text-black text-xs font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors"
                  >
                    <Plus size={14} />
                    Criar Evento
                  </button>
                )}
              </div>
              {eventos.length > 0 ? (
                <EventosSection eventos={eventos} />
              ) : (
                <div className="text-center py-12">
                  <CalendarDays size={32} className="mx-auto mb-4 text-[var(--foreground-muted)]" />
                  <h3 className="text-lg font-medium mb-2">Sem eventos de momento</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {isProfissional
                      ? "Crie o primeiro evento para divulgar as suas clínicas e workshops."
                      : "Os profissionais registados podem publicar eventos aqui."}
                  </p>
                </div>
              )}
            </RevealOnScroll>
          )}

          {abaAtiva === "artigos" && (
            <RevealOnScroll variant="fade-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Artigos Educativos</h2>
                {isProfissional && (
                  <button
                    onClick={() => setShowArtigoForm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--gold)] text-black text-xs font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors"
                  >
                    <Plus size={14} />
                    Escrever Artigo
                  </button>
                )}
              </div>
              {artigos.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {artigos.map((a, i) => (
                    <RevealOnScroll key={a.id} variant="fade-up" delay={i * 100}>
                      <div className="card-premium shimmer-gold rounded-xl p-4">
                        <span className="text-xs text-[var(--gold)]">{a.categoria}</span>
                        <h3 className="font-medium text-[var(--foreground)] mt-1">{a.titulo}</h3>
                        <p className="text-sm text-[var(--foreground-secondary)] mt-2">
                          {a.resumo}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-xs text-[var(--foreground-muted)]">
                          <span>{a.autor}</span>
                          <span>{a.leituras.toLocaleString()} leituras</span>
                        </div>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={32} className="mx-auto mb-4 text-[var(--foreground-muted)]" />
                  <h3 className="text-lg font-medium mb-2">Sem artigos de momento</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {isProfissional
                      ? "Escreva o primeiro artigo e partilhe o seu conhecimento."
                      : "Os profissionais registados podem publicar artigos aqui."}
                  </p>
                </div>
              )}
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* S6: CTA BANNER */}
      {/* ================================================================= */}
      <section className="py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Background orb */}
        <div
          className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <RevealOnScroll variant="fade-scale">
            <div className="bg-gradient-to-r from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/20 rounded-2xl p-8 sm:p-12 backdrop-blur-sm text-center">
              <span className="text-[var(--gold)] uppercase tracking-[0.3em] text-[9px] font-bold block mb-3">
                {t.profissionais.explore}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif italic mb-4">
                {t.profissionais.cta_title}
              </h2>
              <p className="text-[var(--foreground-secondary)] text-sm max-w-xl mx-auto mb-4">
                {t.profissionais.cta_subtitle}
              </p>

              {/* Price badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 mb-8">
                <span className="text-xs text-[var(--foreground-secondary)]">A partir de</span>
                <span className="text-sm font-bold text-gradient-gold">€6/mês</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton>
                  <Link
                    href="/profissionais/registar"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--gold)] text-black font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors text-sm"
                  >
                    <ShieldCheck size={18} />
                    {t.profissionais.cta_button}
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/profissionais/registar"
                    className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--gold)]/30 text-[var(--foreground)] rounded-lg hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/5 transition-all text-sm"
                  >
                    Como Funciona
                    <ArrowRight size={16} />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ================================================================= */}
      {/* S7: MODAL */}
      {/* ================================================================= */}
      {profissionalSelecionado && (
        <ModalProfissional
          profissional={profissionalSelecionado}
          onClose={() => setProfissionalSelecionado(null)}
        />
      )}

      {showEventoForm && (
        <EventoForm
          onClose={() => setShowEventoForm(false)}
          onSuccess={() => {
            setShowEventoForm(false);
            fetchEventos();
          }}
        />
      )}

      {showArtigoForm && (
        <ArtigoForm
          onClose={() => setShowArtigoForm(false)}
          onSuccess={() => {
            setShowArtigoForm(false);
            fetchArtigos();
          }}
        />
      )}
    </main>
  );
}
