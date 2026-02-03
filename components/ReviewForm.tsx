"use client";

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";

interface ReviewFormProps {
  coudelariaId: string;
  coudelariaNome: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ coudelariaId, coudelariaNome, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    autor_nome: "",
    autor_email: "",
    autor_localizacao: "",
    titulo: "",
    comentario: "",
    data_visita: "",
    tipo_visita: "visita",
    recomenda: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Por favor selecione uma avaliacao");
      return;
    }

    if (!formData.autor_nome || !formData.comentario) {
      setError("Nome e comentario sao obrigatorios");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coudelaria_id: coudelariaId,
          avaliacao: rating,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao submeter avaliacao");
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-6 h-6 text-green-600" fill="currentColor" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Obrigado pela sua avaliacao!
        </h3>
        <p className="text-green-600 text-sm">
          A sua review foi submetida e sera publicada apos aprovacao.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          A sua avaliacao de {coudelariaNome}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {rating === 1 && "Fraco"}
            {rating === 2 && "Razoavel"}
            {rating === 3 && "Bom"}
            {rating === 4 && "Muito Bom"}
            {rating === 5 && "Excelente"}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            value={formData.autor_nome}
            onChange={(e) => setFormData({ ...formData, autor_nome: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="O seu nome"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (opcional)
          </label>
          <input
            type="email"
            value={formData.autor_email}
            onChange={(e) => setFormData({ ...formData, autor_email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="email@exemplo.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localizacao (opcional)
          </label>
          <input
            type="text"
            value={formData.autor_localizacao}
            onChange={(e) => setFormData({ ...formData, autor_localizacao: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Ex: Lisboa, Portugal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data da visita (opcional)
          </label>
          <input
            type="date"
            value={formData.data_visita}
            onChange={(e) => setFormData({ ...formData, data_visita: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de interacao
        </label>
        <select
          value={formData.tipo_visita}
          onChange={(e) => setFormData({ ...formData, tipo_visita: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="visita">Visita presencial</option>
          <option value="compra">Compra de cavalo</option>
          <option value="servico">Servico/Treino</option>
          <option value="evento">Evento</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titulo da avaliacao (opcional)
        </label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="Resuma a sua experiencia"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          A sua experiencia *
        </label>
        <textarea
          value={formData.comentario}
          onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          placeholder="Conte-nos sobre a sua experiencia com esta coudelaria..."
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="recomenda"
          checked={formData.recomenda}
          onChange={(e) => setFormData({ ...formData, recomenda: e.target.checked })}
          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
        />
        <label htmlFor="recomenda" className="text-sm text-gray-700">
          Recomendo esta coudelaria
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            A submeter...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submeter Avaliacao
          </>
        )}
      </button>
    </form>
  );
}
