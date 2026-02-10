"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { analytics } from "@/lib/analytics-events";
import Image from "next/image";
import DynamicSEO from "@/components/DynamicSEO";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Calendar,
  Award,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Trophy,
  Sparkles,
  ExternalLink,
  Quote,
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
  Send,
} from "lucide-react";

interface Review {
  id: string;
  autor_nome: string;
  autor_localizacao?: string;
  avaliacao: number;
  titulo?: string;
  comentario: string;
  data_visita?: string;
  tipo_visita?: string;
  recomenda: boolean;
  created_at: string;
}

interface Coudelaria {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  historia?: string;
  localizacao: string;
  regiao: string;
  telefone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  num_cavalos?: number;
  ano_fundacao?: number;
  especialidades: string[];
  linhagens?: string[];
  premios?: string[];
  servicos?: string[];
  horario?: string;
  latitude?: number;
  longitude?: number;
  foto_capa?: string;
  galeria?: string[];
  video_url?: string;
  cavalos_destaque?: {
    nome: string;
    ano: number;
    pelagem: string;
    aptidao: string;
    preco?: number;
    vendido: boolean;
  }[];
  testemunhos?: {
    autor: string;
    texto: string;
    data: string;
  }[];
  is_pro: boolean;
  destaque: boolean;
  views_count: number;
}

// Placeholder images
const placeholderImages = [
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200",
  "https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=1200",
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=1200",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
  "https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=1200",
];

export default function CoudelariaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [coudelaria, setCoudelaria] = useState<Coudelaria | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, media: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    autor_nome: "",
    autor_email: "",
    autor_localizacao: "",
    avaliacao: 5,
    titulo: "",
    comentario: "",
    tipo_visita: "visita",
    recomenda: true,
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchCoudelaria() {
      try {
        const res = await fetch(`/api/coudelarias/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setCoudelaria(data.coudelaria);

          // ✅ Track view da coudelaria
          analytics.viewCoudelaria({
            id: data.coudelaria.id,
            nome: data.coudelaria.nome,
            localizacao: data.coudelaria.localizacao,
            regiao: data.coudelaria.regiao,
          });
        } else if (res.status === 404) {
          // ✅ Coudelaria não encontrada - retorna 404 adequado (SEO correto)
          notFound();
        } else {
          // ✅ Outro erro (500, etc.)
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
      } catch (error) {
        console.error("Erro ao carregar coudelaria:", error);
        // ✅ Se houver erro de rede, mostra mensagem genérica
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchCoudelaria();
    }
  }, [slug]);

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      if (!coudelaria?.id) return;
      try {
        const res = await fetch(`/api/reviews?coudelaria_id=${coudelaria.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
          setReviewStats(data.stats || { total: 0, media: 0 });
        }
      } catch (error) {
        console.error("Erro ao carregar reviews:", error);
      }
    }
    fetchReviews();
  }, [coudelaria?.id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coudelaria?.id) return;

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewForm,
          coudelaria_id: coudelaria.id,
        }),
      });

      if (res.ok) {
        // ✅ Track submissão de review
        analytics.submitReview({
          id: coudelaria.id,
          nome: coudelaria.nome,
          rating: reviewForm.avaliacao,
        });

        setShowReviewForm(false);
        setReviewForm({
          autor_nome: "",
          autor_email: "",
          autor_localizacao: "",
          avaliacao: 5,
          titulo: "",
          comentario: "",
          tipo_visita: "visita",
          recomenda: true,
        });
        // ✅ Toast de sucesso
        toast.success("Avaliação submetida com sucesso! Será publicada após revisão.", {
          duration: 5000,
          style: {
            background: "#1a1a1a",
            color: "#C5A059",
            border: "1px solid #C5A059",
          },
        });

        // ✅ Recarregar reviews
        const reviewsRes = await fetch(`/api/reviews?coudelaria_id=${coudelaria.id}`);
        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          setReviews(data.reviews || []);
          setReviewStats(data.stats || { total: 0, media: 0 });
        }
      } else {
        // ✅ Erro do servidor (validação, etc.)
        const errorData = await res.json().catch(() => ({ message: "Erro desconhecido" }));
        toast.error(errorData.message || "Erro ao submeter avaliação. Tente novamente.", {
          duration: 5000,
          style: {
            background: "#1a1a1a",
            color: "#ff4444",
            border: "1px solid #ff4444",
          },
        });
      }
    } catch (error) {
      console.error("Erro ao submeter review:", error);
      // ✅ Erro de rede
      toast.error("Erro de conexão. Verifique sua internet e tente novamente.", {
        duration: 5000,
        style: {
          background: "#1a1a1a",
          color: "#ff4444",
          border: "1px solid #ff4444",
        },
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] pt-32 flex items-center justify-center">
        <div className="animate-pulse text-[#C5A059]">A carregar...</div>
      </main>
    );
  }

  if (!coudelaria) {
    return (
      <main className="min-h-screen bg-[#050505] pt-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-serif text-white mb-4">Coudelaria não encontrada</h1>
          <Link href="/directorio" className="text-[#C5A059] hover:text-white transition-colors">
            ← Voltar ao diretório
          </Link>
        </div>
      </main>
    );
  }

  // Use placeholder images if no gallery
  const images = coudelaria.galeria?.length ? coudelaria.galeria : placeholderImages;
  const heroImage = coudelaria.foto_capa || images[0];

  // JSON-LD structured data for this coudelaria
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: coudelaria.nome,
    description: coudelaria.descricao,
    address: {
      "@type": "PostalAddress",
      addressLocality: coudelaria.localizacao,
      addressRegion: coudelaria.regiao,
      addressCountry: "PT",
    },
    ...(coudelaria.telefone && { telephone: coudelaria.telefone }),
    ...(coudelaria.email && { email: coudelaria.email }),
    ...(coudelaria.website && { url: coudelaria.website }),
    ...(heroImage && { image: heroImage }),
    ...(reviewStats.total > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviewStats.media,
        reviewCount: reviewStats.total,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    priceRange: "€€€",
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      <DynamicSEO
        title={`${coudelaria.nome} - Coudelaria Lusitano - Portal Lusitano`}
        description={
          coudelaria.descricao ||
          `${coudelaria.nome} em ${coudelaria.localizacao}, ${coudelaria.regiao}. ${coudelaria.num_cavalos ? `${coudelaria.num_cavalos} cavalos` : "Coudelaria"} de cavalos Lusitanos.`
        }
        image={heroImage}
        url={`https://portallusitano.com/directorio/${slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-32 left-6 z-10">
          <Link
            href="/directorio"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Voltar</span>
          </Link>
        </div>

        {/* Destaque Badge */}
        {coudelaria.destaque && (
          <div className="absolute top-32 right-6 z-10">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] text-black px-4 py-2 rounded-full">
              <Star size={16} />
              <span className="text-sm font-bold">DESTAQUE</span>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
              {coudelaria.ano_fundacao && (
                <span className="text-[#C5A059] text-sm uppercase tracking-widest mb-2 block">
                  Fundada em {coudelaria.ano_fundacao}
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">{coudelaria.nome}</h1>
              <div className="flex flex-wrap items-center gap-4 text-zinc-300">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#C5A059]" />
                  {coudelaria.localizacao}, {coudelaria.regiao}
                </span>
                {coudelaria.num_cavalos && (
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-[#C5A059]" />
                    {coudelaria.num_cavalos} cavalos
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section
              className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="text-xl text-zinc-300 leading-relaxed">{coudelaria.descricao}</p>
            </section>

            {/* Especialidades */}
            {coudelaria.especialidades?.length > 0 && (
              <section
                className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.2s" }}
              >
                <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                  <Sparkles className="text-[#C5A059]" size={24} />
                  Especialidades
                </h2>
                <div className="flex flex-wrap gap-3">
                  {coudelaria.especialidades.map((esp, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-sm"
                    >
                      {esp}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* História */}
            {coudelaria.historia && (
              <section
                className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.3s" }}
              >
                <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                  <Calendar className="text-[#C5A059]" size={24} />
                  História
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  {coudelaria.historia.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-zinc-400 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Galeria */}
            {images.length > 1 && (
              <section
                className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.4s" }}
              >
                <h2 className="text-2xl font-serif text-white mb-6">Galeria</h2>
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    <Image
                      src={images[activeImage]}
                      alt={`${coudelaria.nome} - Imagem ${activeImage + 1}`}
                      fill
                      className="object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActiveImage((activeImage - 1 + images.length) % images.length)
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={() => setActiveImage((activeImage + 1) % images.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`flex-shrink-0 w-20 h-14 overflow-hidden border-2 transition-colors relative ${
                          activeImage === i
                            ? "border-[#C5A059]"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt={`Miniatura ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Prémios */}
            {coudelaria.premios && coudelaria.premios.length > 0 && (
              <section
                className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.5s" }}
              >
                <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                  <Trophy className="text-[#C5A059]" size={24} />
                  Prémios e Reconhecimentos
                </h2>
                <div className="space-y-3">
                  {coudelaria.premios.map((premio, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-zinc-900/50 border border-white/5"
                    >
                      <Award className="text-[#C5A059] flex-shrink-0 mt-1" size={20} />
                      <span className="text-zinc-300">{premio}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cavalos em Destaque */}
            {coudelaria.cavalos_destaque && coudelaria.cavalos_destaque.length > 0 && (
              <section
                className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.6s" }}
              >
                <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                  <Star className="text-[#C5A059]" size={24} />
                  Cavalos em Destaque
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {coudelaria.cavalos_destaque.map((cavalo, i) => (
                    <div
                      key={i}
                      className={`p-6 border ${
                        cavalo.vendido
                          ? "bg-zinc-900/30 border-zinc-800 opacity-60"
                          : "bg-zinc-900/50 border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-white">{cavalo.nome}</h3>
                        {cavalo.vendido && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1">
                            VENDIDO
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-zinc-400 mb-4">
                        <div>
                          <span className="text-zinc-500">Ano:</span> {cavalo.ano}
                        </div>
                        <div>
                          <span className="text-zinc-500">Pelagem:</span> {cavalo.pelagem}
                        </div>
                        <div className="col-span-2">
                          <span className="text-zinc-500">Aptidão:</span> {cavalo.aptidao}
                        </div>
                      </div>
                      {cavalo.preco && !cavalo.vendido && (
                        <div className="text-[#C5A059] font-bold text-lg">
                          €{cavalo.preco.toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Testemunhos */}
            {coudelaria.testemunhos && coudelaria.testemunhos.length > 0 && (
              <section
                className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.7s" }}
              >
                <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                  <Quote className="text-[#C5A059]" size={24} />
                  Testemunhos
                </h2>
                <div className="space-y-4">
                  {coudelaria.testemunhos.map((test, i) => (
                    <div key={i} className="p-6 bg-zinc-900/50 border border-white/5">
                      <p className="text-zinc-300 italic mb-4">{`\u201C${test.texto}\u201D`}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#C5A059] font-medium">— {test.autor}</span>
                        <span className="text-zinc-500 text-sm">{test.data}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sistema de Reviews */}
            <section
              className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                  <MessageSquare className="text-[#C5A059]" size={24} />
                  Avaliações
                  {reviewStats.total > 0 && (
                    <span className="text-sm bg-[#C5A059]/20 text-[#C5A059] px-2 py-1 rounded-full">
                      {reviewStats.total}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex items-center gap-2 bg-[#C5A059] text-black px-4 py-2 text-sm font-bold hover:bg-white transition-colors"
                >
                  <Star size={16} />
                  Avaliar
                </button>
              </div>

              {/* Estatísticas */}
              {reviewStats.total > 0 && (
                <div className="flex items-center gap-6 mb-6 p-4 bg-zinc-900/50 border border-white/10">
                  <div className="text-center">
                    <div className="text-4xl font-serif text-[#C5A059]">{reviewStats.media}</div>
                    <div className="flex justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= Math.round(reviewStats.media)
                              ? "text-[#C5A059] fill-[#C5A059]"
                              : "text-zinc-600"
                          }
                        />
                      ))}
                    </div>
                    <div className="text-zinc-500 text-sm">{reviewStats.total} avaliações</div>
                  </div>
                </div>
              )}

              {/* Formulário de Review */}
              {showReviewForm && (
                <form
                  onSubmit={submitReview}
                  className="mb-8 p-6 bg-zinc-900/50 border border-[#C5A059]/30 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                >
                  <h3 className="text-lg font-serif text-white mb-4">Partilhe a sua experiência</h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="O seu nome *"
                      value={reviewForm.autor_nome}
                      onChange={(e) => setReviewForm({ ...reviewForm, autor_nome: e.target.value })}
                      required
                      className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#C5A059] focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email (opcional)"
                      value={reviewForm.autor_email}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, autor_email: e.target.value })
                      }
                      className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Localização (opcional)"
                      value={reviewForm.autor_localizacao}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, autor_localizacao: e.target.value })
                      }
                      className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#C5A059] focus:outline-none"
                    />
                    <select
                      value={reviewForm.tipo_visita}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, tipo_visita: e.target.value })
                      }
                      className="bg-zinc-800 border border-white/10 px-4 py-3 text-white focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="visita">Visita</option>
                      <option value="compra">Compra de cavalo</option>
                      <option value="aulas">Aulas</option>
                      <option value="eventos">Evento</option>
                    </select>
                  </div>

                  {/* Avaliação por estrelas */}
                  <div className="mb-4">
                    <label className="text-zinc-400 text-sm block mb-2">Avaliação *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, avaliacao: star })}
                          className="p-1"
                        >
                          <Star
                            size={32}
                            className={
                              star <= reviewForm.avaliacao
                                ? "text-[#C5A059] fill-[#C5A059]"
                                : "text-zinc-600 hover:text-[#C5A059]"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Título da avaliação (opcional)"
                    value={reviewForm.titulo}
                    onChange={(e) => setReviewForm({ ...reviewForm, titulo: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#C5A059] focus:outline-none mb-4"
                  />

                  <textarea
                    placeholder="Conte-nos sobre a sua experiência *"
                    value={reviewForm.comentario}
                    onChange={(e) => setReviewForm({ ...reviewForm, comentario: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#C5A059] focus:outline-none mb-4"
                  />

                  <div className="flex items-center gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="recomenda"
                      checked={reviewForm.recomenda}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, recomenda: e.target.checked })
                      }
                      className="w-5 h-5"
                    />
                    <label htmlFor="recomenda" className="text-zinc-300">
                      Recomendo esta coudelaria
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center gap-2 bg-[#C5A059] text-black px-6 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                    {submittingReview ? "A enviar..." : "Submeter Avaliação"}
                  </button>
                </form>
              )}

              {/* Lista de Reviews */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 bg-zinc-900/50 border border-white/5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{review.autor_nome}</span>
                            {review.recomenda && <ThumbsUp size={14} className="text-green-500" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            {review.autor_localizacao && <span>{review.autor_localizacao}</span>}
                            {review.tipo_visita && <span>• {review.tipo_visita}</span>}
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= review.avaliacao
                                  ? "text-[#C5A059] fill-[#C5A059]"
                                  : "text-zinc-600"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {review.titulo && (
                        <h4 className="text-white font-medium mb-2">{review.titulo}</h4>
                      )}
                      <p className="text-zinc-400">{review.comentario}</p>
                      <div className="mt-3 text-zinc-600 text-xs">
                        {new Date(review.created_at).toLocaleDateString("pt-PT")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-zinc-900/30 border border-white/5">
                  <MessageSquare className="mx-auto text-zinc-600 mb-3" size={32} />
                  <p className="text-zinc-500">
                    Ainda não há avaliações. Seja o primeiro a avaliar!
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Contact Card */}
              <div
                className="bg-zinc-900/50 border border-white/10 p-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="text-lg font-medium text-white mb-6">Informações de Contacto</h3>

                <div className="space-y-4">
                  {coudelaria.telefone && (
                    <a
                      href={`tel:${coudelaria.telefone}`}
                      className="flex items-center gap-3 text-zinc-300 hover:text-[#C5A059] transition-colors"
                    >
                      <Phone size={18} className="text-[#C5A059]" />
                      {coudelaria.telefone}
                    </a>
                  )}
                  {coudelaria.email && (
                    <a
                      href={`mailto:${coudelaria.email}`}
                      className="flex items-center gap-3 text-zinc-300 hover:text-[#C5A059] transition-colors"
                    >
                      <Mail size={18} className="text-[#C5A059]" />
                      {coudelaria.email}
                    </a>
                  )}
                  {coudelaria.website && (
                    <a
                      href={coudelaria.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-zinc-300 hover:text-[#C5A059] transition-colors"
                    >
                      <Globe size={18} className="text-[#C5A059]" />
                      Website
                      <ExternalLink size={14} />
                    </a>
                  )}

                  {/* Social */}
                  {(coudelaria.instagram || coudelaria.facebook || coudelaria.youtube) && (
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                      {coudelaria.instagram && (
                        <a
                          href={`https://instagram.com/${coudelaria.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-zinc-800 hover:bg-[#C5A059] text-zinc-400 hover:text-black flex items-center justify-center transition-colors"
                        >
                          <Instagram size={18} />
                        </a>
                      )}
                      {coudelaria.facebook && (
                        <a
                          href={coudelaria.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-zinc-800 hover:bg-[#C5A059] text-zinc-400 hover:text-black flex items-center justify-center transition-colors"
                        >
                          <Facebook size={18} />
                        </a>
                      )}
                      {coudelaria.youtube && (
                        <a
                          href={coudelaria.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-zinc-800 hover:bg-[#C5A059] text-zinc-400 hover:text-black flex items-center justify-center transition-colors"
                        >
                          <Youtube size={18} />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Horário */}
                  {coudelaria.horario && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <Clock size={16} className="text-[#C5A059]" />
                        <span className="text-sm">Horário</span>
                      </div>
                      <p className="text-zinc-300 text-sm">{coudelaria.horario}</p>
                    </div>
                  )}

                  {/* Sem contactos */}
                  {!coudelaria.telefone && !coudelaria.email && !coudelaria.website && (
                    <p className="text-zinc-500 text-sm italic">Contactos não disponíveis</p>
                  )}
                </div>
              </div>

              {/* Serviços */}
              {coudelaria.servicos && coudelaria.servicos.length > 0 && (
                <div
                  className="bg-zinc-900/50 border border-white/10 p-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.3s" }}
                >
                  <h3 className="text-lg font-medium text-white mb-4">Serviços</h3>
                  <ul className="space-y-2">
                    {coudelaria.servicos.map((servico, i) => (
                      <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                        <CheckCircle size={14} className="text-green-500" />
                        {servico}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Linhagens */}
              {coudelaria.linhagens && coudelaria.linhagens.length > 0 && (
                <div
                  className="bg-zinc-900/50 border border-white/10 p-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.4s" }}
                >
                  <h3 className="text-lg font-medium text-white mb-4">Linhagens</h3>
                  <div className="flex flex-wrap gap-2">
                    {coudelaria.linhagens.map((linhagem, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm">
                        {linhagem}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Map Placeholder */}
              {coudelaria.latitude && coudelaria.longitude && (
                <div
                  className="bg-zinc-900/50 border border-white/10 overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.5s" }}
                >
                  <a
                    href={`https://www.google.com/maps?q=${coudelaria.latitude},${coudelaria.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video bg-zinc-800 relative group"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="text-[#C5A059] mx-auto mb-2" size={32} />
                        <span className="text-zinc-400 text-sm group-hover:text-[#C5A059] transition-colors">
                          Ver no Google Maps
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* CTA para registo */}
              <div
                className="bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/30 p-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.6s" }}
              >
                <h3 className="text-lg font-medium text-white mb-2">Tem uma coudelaria?</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Adicione a sua coudelaria ao diretório e mostre os seus cavalos a milhares de
                  entusiastas.
                </p>
                <Link
                  href="/directorio/registar"
                  className="block w-full bg-[#C5A059] text-black py-3 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors text-center"
                >
                  Registar Coudelaria
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
