"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Check, X, Eye, ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Review } from "@/types/review";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/admin/reviews?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[AdminReviews]", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateReviewStatus(reviewId: string, status: string) {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchReviews();
        setSelectedReview(null);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[AdminReviews]", error);
    }
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700 transition">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="text-amber-600" />
                  Gestão de Reviews
                </h1>
                <p className="text-gray-600 text-sm">
                  Aprovar ou rejeitar avaliações de coudelarias
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setStatusFilter("pending")}
            className={`p-4 rounded-lg border-2 transition ${
              statusFilter === "pending"
                ? "bg-amber-50 border-amber-500"
                : "bg-white border-gray-200 hover:border-amber-300"
            }`}
          >
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-gray-600">Pendentes</p>
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`p-4 rounded-lg border-2 transition ${
              statusFilter === "approved"
                ? "bg-green-50 border-green-500"
                : "bg-white border-gray-200 hover:border-green-300"
            }`}
          >
            <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
            <p className="text-gray-600">Aprovadas</p>
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`p-4 rounded-lg border-2 transition ${
              statusFilter === "rejected"
                ? "bg-red-50 border-red-500"
                : "bg-white border-gray-200 hover:border-red-300"
            }`}
          >
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            <p className="text-gray-600">Rejeitadas</p>
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhuma review {statusFilter}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews
              .filter((r) => r.status === statusFilter)
              .map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">{review.autor_nome}</span>
                        {review.autor_localizacao && (
                          <span className="text-gray-500 text-sm">
                            de {review.autor_localizacao}
                          </span>
                        )}
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= review.avaliacao
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        {review.recomenda ? (
                          <ThumbsUp size={16} className="text-green-500" />
                        ) : (
                          <ThumbsDown size={16} className="text-red-500" />
                        )}
                      </div>

                      {review.titulo && (
                        <h3 className="font-medium text-gray-800 mb-1">{review.titulo}</h3>
                      )}
                      <p className="text-gray-600 mb-3">{review.comentario}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {review.coudelarias && <span>Coudelaria: {review.coudelarias.nome}</span>}
                        {review.tipo_visita && <span>Tipo: {review.tipo_visita}</span>}
                        <span>{new Date(review.created_at).toLocaleDateString("pt-PT")}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
                        title="Ver detalhes"
                      >
                        <Eye size={20} />
                      </button>
                      {review.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateReviewStatus(review.id, "approved")}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                            title="Aprovar"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => updateReviewStatus(review.id, "rejected")}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Rejeitar"
                          >
                            <X size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Detalhes da Review</h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Autor</label>
                  <p className="font-medium">{selectedReview.autor_nome}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p>{selectedReview.autor_email || "Não fornecido"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Localização</label>
                  <p>{selectedReview.autor_localizacao || "Não fornecida"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Avaliação</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={
                          star <= selectedReview.avaliacao
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Comentário</label>
                <p className="bg-gray-50 p-4 rounded-lg mt-1">{selectedReview.comentario}</p>
              </div>

              {selectedReview.status === "pending" && (
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => updateReviewStatus(selectedReview.id, "approved")}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Aprovar Review
                  </button>
                  <button
                    onClick={() => updateReviewStatus(selectedReview.id, "rejected")}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Rejeitar Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
