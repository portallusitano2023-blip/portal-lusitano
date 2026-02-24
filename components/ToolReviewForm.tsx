"use client";

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";

interface ToolReviewFormProps {
  ferramentaSlug: string;
  ferramentaNome: string;
  onSuccess?: () => void;
}

export default function ToolReviewForm({
  ferramentaSlug,
  ferramentaNome,
  onSuccess,
}: ToolReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    autor_nome: "",
    comentario: "",
    recomenda: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Por favor selecione uma avaliação");
      return;
    }

    if (!formData.autor_nome || !formData.comentario) {
      setError("Nome e comentário são obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ferramenta_slug: ferramentaSlug,
          avaliacao: rating,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao submeter avaliação");
      }

      setIsSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao submeter");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-[var(--gold)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-6 h-6 text-[var(--gold)]" fill="currentColor" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          Obrigado pela sua avaliação!
        </h3>
        <p className="text-[var(--foreground-secondary)] text-sm">
          A sua review será publicada após aprovação.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
          A sua avaliação de {ferramentaNome}
        </label>
        <div className="flex gap-1" role="radiogroup" aria-label="Avaliação por estrelas">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              tabIndex={rating === star || (rating === 0 && star === 1) ? 0 : -1}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const next = Math.min(star + 1, 5);
                  setRating(next);
                  (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
                } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const prev = Math.max(star - 1, 1);
                  setRating(prev);
                  (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
                }
              }}
              className="p-1 transition-transform hover:scale-110"
              aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? "text-[var(--gold)]"
                    : "text-[var(--foreground-muted)]"
                }`}
                fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {rating === 1 && "Fraco"}
            {rating === 2 && "Razoável"}
            {rating === 3 && "Bom"}
            {rating === 4 && "Muito Bom"}
            {rating === 5 && "Excelente"}
          </p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1">
          Nome *
        </label>
        <input
          type="text"
          value={formData.autor_nome}
          onChange={(e) => setFormData({ ...formData, autor_nome: e.target.value })}
          className="w-full px-4 py-2.5 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition"
          placeholder="O seu nome"
          required
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1">
          Comentário *
        </label>
        <textarea
          value={formData.comentario}
          onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
          rows={4}
          className="w-full px-4 py-2.5 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent resize-none transition"
          placeholder="O que achou desta ferramenta?"
          required
        />
      </div>

      {/* Recommend */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`recomenda-${ferramentaSlug}`}
          checked={formData.recomenda}
          onChange={(e) => setFormData({ ...formData, recomenda: e.target.checked })}
          className="w-4 h-4 text-[var(--gold)] bg-[var(--background-card)] border-[var(--border)] rounded focus:ring-[var(--gold)]"
        />
        <label
          htmlFor={`recomenda-${ferramentaSlug}`}
          className="text-sm text-[var(--foreground-secondary)]"
        >
          Recomendo esta ferramenta
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black font-semibold rounded-lg hover:from-[var(--gold-hover)] hover:to-[var(--gold-hover)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />A submeter...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submeter Avaliação
          </>
        )}
      </button>
    </form>
  );
}
