"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, Calendar, MapPin, User } from "lucide-react";
import { Review, ReviewStats } from "@/types/review";

interface ReviewListProps {
  coudelariaId: string;
  refreshKey?: number;
}

export function ReviewStars({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
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
          className={`${sizeClasses[size]} ${star <= rating ? "text-yellow-400" : "text-[var(--foreground-muted)]"}`}
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
        <p className="text-[var(--foreground-muted)]">Ainda sem avaliacoes</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
      <div className="text-center">
        <p className="text-4xl font-bold text-amber-600">{stats.media}</p>
        <ReviewStars rating={Math.round(stats.media)} size="sm" />
      </div>
      <div className="border-l border-amber-200 dark:border-amber-500/30 pl-4">
        <p className="text-sm text-[var(--foreground-secondary)]">
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
            <div className="h-4 bg-[var(--surface-hover)] rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-[var(--surface-hover)] rounded w-1/3 mb-3"></div>
            <div className="h-20 bg-[var(--surface-hover)] rounded"></div>
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
          <p className="text-[var(--foreground-muted)]">
            Seja o primeiro a avaliar esta coudelaria!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-[var(--border)] pb-6 last:border-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ReviewStars rating={review.avaliacao} size="sm" />
                    {review.titulo && (
                      <span className="font-semibold text-[var(--foreground)]">
                        {review.titulo}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
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
                <span className="text-xs text-[var(--foreground-muted)]">
                  {formatDate(review.created_at)}
                </span>
              </div>

              <p className="text-[var(--foreground-secondary)] mb-3">{review.comentario}</p>

              <div className="flex items-center gap-4 text-sm">
                {review.data_visita && (
                  <span className="flex items-center gap-1 text-[var(--foreground-muted)]">
                    <Calendar className="w-4 h-4" />
                    Visitou em {formatDate(review.data_visita)}
                  </span>
                )}
                {review.tipo_visita && (
                  <span className="px-2 py-1 bg-[var(--surface-hover)] rounded text-[var(--foreground-secondary)] text-xs">
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
