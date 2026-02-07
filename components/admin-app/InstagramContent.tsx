"use client";

import { useEffect, useState } from "react";
import { Instagram, Check, X, Loader2, ExternalLink, Download, Mail } from "lucide-react";

interface InstagramUpload {
  id: string;
  session_id: string;
  caption: string;
  hashtags: string;
  link: string;
  observacoes: string;
  files_urls: string[];
  status: "pending" | "published" | "cancelled";
  created_at: string;
  published_at: string | null;
  customer_email?: string;
}

export default function InstagramContent() {
  const [uploads, setUploads] = useState<InstagramUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "published" | "cancelled">("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUploads();
  }, [filter]);

  const fetchUploads = async () => {
    try {
      const response = await fetch(`/api/admin/instagram/list?filter=${filter}`);
      const data = await response.json();
      setUploads(data.uploads || []);
    } catch (error) {
      console.error("Erro ao carregar uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "published" | "cancelled") => {
    setProcessingId(id);
    try {
      const response = await fetch("/api/admin/instagram/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      await fetchUploads();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar status");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUploads = uploads.filter((upload) => {
    if (filter === "all") return true;
    return upload.status === filter;
  });

  const stats = {
    pending: uploads.filter((u) => u.status === "pending").length,
    published: uploads.filter((u) => u.status === "published").length,
    cancelled: uploads.filter((u) => u.status === "cancelled").length,
  };

  return (
    <main className="min-h-screen bg-[#050505] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Instagram className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-white">Dashboard Instagram</h1>
              <p className="text-gray-400">Gestão de materiais recebidos</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl">
              <div className="text-orange-400 text-2xl font-bold">{stats.pending}</div>
              <div className="text-gray-400 text-sm">Pendentes</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
              <div className="text-green-400 text-2xl font-bold">{stats.published}</div>
              <div className="text-gray-400 text-sm">Publicados</div>
            </div>
            <div className="bg-zinc-500/10 border border-zinc-500/20 p-4 rounded-xl">
              <div className="text-zinc-400 text-2xl font-bold">{stats.cancelled}</div>
              <div className="text-gray-400 text-sm">Cancelados</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === "all"
                  ? "bg-[#C5A059] text-black"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              Todos ({uploads.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === "pending"
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              Pendentes ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === "published"
                  ? "bg-green-500 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              Publicados ({stats.published})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === "cancelled"
                  ? "bg-zinc-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              Cancelados ({stats.cancelled})
            </button>
          </div>
        </div>

        {/* Upload List */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin text-[#C5A059] mx-auto mb-4" size={40} />
            <p className="text-gray-400">A carregar...</p>
          </div>
        ) : filteredUploads.length === 0 ? (
          <div className="text-center py-20">
            <Instagram className="text-zinc-700 mx-auto mb-4" size={60} />
            <p className="text-gray-500">Nenhum material {filter !== "all" ? filter : ""}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUploads.map((upload) => (
              <div
                key={upload.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${
                          upload.status === "pending"
                            ? "bg-orange-500/20 text-orange-400"
                            : upload.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-600/20 text-zinc-400"
                        }`}
                      >
                        {upload.status}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(upload.created_at).toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {upload.customer_email && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Mail size={14} />
                        <span>{upload.customer_email}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {upload.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(upload.id, "published")}
                        disabled={processingId === upload.id}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                      >
                        {processingId === upload.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Check size={16} />
                        )}
                        Marcar Publicado
                      </button>
                      <button
                        onClick={() => updateStatus(upload.id, "cancelled")}
                        disabled={processingId === upload.id}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Media */}
                  <div>
                    <h3 className="text-white font-medium mb-3">
                      📁 Ficheiros ({upload.files_urls?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {upload.files_urls?.map((url, idx) => {
                        const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        const isVideo = url.match(/\.(mp4|mov|avi|webm)$/i);

                        return (
                          <div key={idx} className="bg-black rounded-lg overflow-hidden">
                            {isImage ? (
                              <img
                                src={url}
                                alt={`Media ${idx + 1}`}
                                className="w-full h-auto"
                              />
                            ) : isVideo ? (
                              <video
                                src={url}
                                controls
                                className="w-full h-auto"
                              />
                            ) : (
                              <div className="p-4 text-gray-400 text-sm">
                                Ficheiro {idx + 1}
                              </div>
                            )}
                            <div className="p-3 bg-zinc-800 flex items-center justify-between">
                              <span className="text-gray-400 text-xs">
                                {isImage ? "📷 Imagem" : "🎥 Vídeo"} {idx + 1}
                              </span>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[#C5A059] hover:text-white text-xs transition-colors"
                              >
                                <Download size={14} />
                                Download
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Text Content */}
                  <div className="space-y-4">
                    {/* Caption */}
                    <div className="bg-black p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                        📝 Caption
                        <button
                          onClick={() => navigator.clipboard.writeText(upload.caption || "")}
                          className="ml-auto text-[#C5A059] hover:text-white text-xs"
                        >
                          Copiar
                        </button>
                      </h3>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {upload.caption || "(Não especificado)"}
                      </p>
                    </div>

                    {/* Hashtags */}
                    {upload.hashtags && (
                      <div className="bg-black p-4 rounded-lg">
                        <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                          #️⃣ Hashtags
                          <button
                            onClick={() => navigator.clipboard.writeText(upload.hashtags || "")}
                            className="ml-auto text-[#C5A059] hover:text-white text-xs"
                          >
                            Copiar
                          </button>
                        </h3>
                        <p className="text-gray-300 text-sm">{upload.hashtags}</p>
                      </div>
                    )}

                    {/* Link */}
                    {upload.link && (
                      <div className="bg-black p-4 rounded-lg">
                        <h3 className="text-white font-medium mb-2">🔗 Link</h3>
                        <a
                          href={upload.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C5A059] hover:text-white text-sm flex items-center gap-2 break-all"
                        >
                          {upload.link}
                          <ExternalLink size={14} className="flex-shrink-0" />
                        </a>
                      </div>
                    )}

                    {/* Observações */}
                    {upload.observacoes && (
                      <div className="bg-black p-4 rounded-lg">
                        <h3 className="text-white font-medium mb-2">💬 Observações</h3>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                          {upload.observacoes}
                        </p>
                      </div>
                    )}

                    {/* Session ID */}
                    <div className="text-xs text-gray-600">
                      Session: {upload.session_id}
                    </div>
                  </div>
                </div>

                {/* Published Info */}
                {upload.published_at && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-green-400 text-sm">
                      ✅ Publicado em{" "}
                      {new Date(upload.published_at).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
