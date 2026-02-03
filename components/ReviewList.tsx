"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, Calendar, MapPin, User } from "lucide-react";

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

interface ReviewStats {
  total: number;
  media: number;
}

interface ReviewListProps {
  coudelariaId: string;
  refreshKey?: number;
}

export function ReviewStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={star <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export function ReviewSummary({ stats }: { stats: ReviewStats }) {
  if (stats.total === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Ainda sem avaliacoes</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
      <div className="text-center">
        <p className="text-4xl font-bold text-amber-600">{stats.media}</p>
        <ReviewStars rating={Math.round(stats.media)} size="sm" />
      </div>
      <div className="border-l border-amber-200 pl-4">
        <p className="text-sm text-gray-600">
          Baseado em <span className="font-semibold">{stats.total}</span>{" "}
          {stats.total === 1 ? "avaliacao" : "avaliacoes"}
        </p>
      </div>
    </div>
  );
}

export default function ReviewList({ coudelariaId, refreshKey = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, media: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?coudelaria_id=${coudelariaId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao carregar reviews");
        }

        setReviews(data.reviews || []);
        setStats(data.stats || { total: 0, media: 0 });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [coudelariaId, refreshKey]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tipoVisitaLabels: Record<string, string> = {
    visita: "Visita",
    compra: "Compra",
    servico: "Servico",
    evento: "Evento",
    outro: "Outro",
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewSummary stats={stats} />

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Seja o primeiro a avaliar esta coudelaria!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ReviewStars rating={review.avaliacao} size="sm" />
                    {review.titulo && (
                      <span className="font-semibold text-gray-900">{review.titulo}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {review.autor_nome}
                    </span>
                    {review.autor_localizacao && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {review.autor_localizacao}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(review.created_at)}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{review.comentario}</p>

              <div className="flex items-center gap-4 text-sm">
                {review.data_visita && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Visitou em {formatDate(review.data_visita)}
                  </span>
                )}
                {review.tipo_visita && (
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">
                    {tipoVisitaLabels[review.tipo_visita] || review.tipo_visita}
                  </span>
                )}
                {review.recomenda && (
                  <span className="flex items-center gap-1 text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    Recomenda
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
