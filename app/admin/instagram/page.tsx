"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Instagram,
  Check,
  X,
  Loader2,
  ExternalLink,
  Download,
  Mail,
  Lock,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  Hash,
  Link2,
  MessageSquare,
  FileText,
  Copy,
  Calendar,
  ImageIcon,
} from "lucide-react";

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

export default function AdminInstagramPage() {
  const [uploads, setUploads] = useState<InstagramUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "published" | "cancelled">("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1800);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUploads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, authenticated]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/auth/check");
      const data = await response.json();
      setAuthenticated(data.authenticated);
    } catch {
      setAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (!response.ok) {
        setLoginError(data.error || "Erro ao fazer login");
        return;
      }
      setAuthenticated(true);
    } catch {
      setLoginError("Erro ao conectar ao servidor");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthenticated(false);
      setUploads([]);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[Instagram]", error);
    }
  };

  const fetchUploads = async () => {
    try {
      const response = await fetch(`/api/admin/instagram/list?filter=${filter}`);
      const data = await response.json();
      setUploads(data.uploads || []);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[Instagram]", error);
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
      if (process.env.NODE_ENV === "development") console.error("[Instagram]", error);
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

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 600px 400px at 50% 50%, rgba(197,160,89,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.35em] uppercase text-[#C5A059]">
              Portal
            </span>
            <span className="text-3xl font-serif text-white tracking-wide leading-none">
              Lusitano
            </span>
            <div className="flex items-center gap-3 mt-1">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A059]" />
              <div className="w-1 h-1 rounded-full bg-[#C5A059]" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C5A059]" />
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-20 h-20 rounded-full"
              style={{ border: "1px solid rgba(197,160,89,0.15)" }}
            />
            <div
              className="w-14 h-14 rounded-full animate-spin"
              style={{
                border: "2px solid transparent",
                borderTopColor: "#C5A059",
                borderRightColor: "rgba(197,160,89,0.3)",
              }}
            />
            <div className="absolute w-2 h-2 rounded-full bg-[#C5A059]" />
          </div>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">A verificar sessão</p>
        </div>
      </main>
    );
  }

  // ── Login ────────────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 700px 500px at 50% 50%, rgba(197,160,89,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="relative w-full max-w-md">
          {/* Wordmark */}
          <div className="flex flex-col items-center gap-1 mb-8">
            <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C5A059]">
              Portal
            </span>
            <span className="text-2xl font-serif text-white tracking-wide">Lusitano</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
              <div className="w-1 h-1 rounded-full bg-[#C5A059]/60" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
            </div>
          </div>

          <div
            className="bg-[#0A0A0A] rounded-2xl p-8"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #833ab4 0%, #c13584 35%, #e1306c 60%, #fd1d1d 80%, #f77737 100%)",
                  boxShadow: "0 8px 24px rgba(193,53,132,0.3)",
                }}
              >
                <Instagram className="text-white" size={28} />
              </div>
            </div>

            <h1 className="text-2xl font-serif text-white text-center mb-1 tracking-wide">
              Admin Instagram
            </h1>
            <p className="text-zinc-500 text-sm text-center mb-8">
              Acesso restrito ao painel de administração
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-zinc-500">
                  <Mail size={11} />
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 px-4 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-[#C5A059]/50 placeholder:text-zinc-700 transition-all duration-300"
                  placeholder="admin@portal-lusitano.pt"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-zinc-500">
                  <Lock size={11} />
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 px-4 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-[#C5A059]/50 placeholder:text-zinc-700 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                  <X size={15} className="flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full rounded-xl py-3.5 font-semibold text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #C5A059 0%, #D4AF70 50%, #C5A059 100%)",
                  color: "#0A0A0A",
                  boxShadow: loggingIn ? "none" : "0 4px 20px rgba(197,160,89,0.25)",
                }}
              >
                {loggingIn ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} />A entrar...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          </div>
          <p className="text-center text-zinc-700 text-xs mt-6 tracking-wider">
            Portal Lusitano &mdash; Painel Interno
          </p>
        </div>
      </main>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mb-8" />

          <div className="flex items-start justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #833ab4 0%, #c13584 35%, #e1306c 60%, #fd1d1d 80%, #f77737 100%)",
                    boxShadow: "0 8px 24px rgba(193,53,132,0.25)",
                  }}
                >
                  <Instagram className="text-white" size={26} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C5A059] rounded-full border-2 border-[#050505]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-3xl font-serif text-white tracking-wide">
                    Dashboard Instagram
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-purple-500/10 border border-purple-500/25 text-purple-300 rounded-full">
                    ADMIN
                  </span>
                </div>
                <p className="text-zinc-500 text-sm">Gestão de materiais recebidos</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors duration-200 group mt-1"
              aria-label="Terminar sessão"
            >
              <LogOut
                size={15}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
              <span>Sair</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {(
              [
                { key: "pending", count: stats.pending, color: "orange", label: "Pendentes" },
                { key: "published", count: stats.published, color: "green", label: "Publicados" },
                { key: "cancelled", count: stats.cancelled, color: "zinc", label: "Cancelados" },
              ] as const
            ).map(({ key, count, color, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`relative text-left p-5 rounded-2xl border transition-all duration-200 ${
                  filter === key
                    ? `bg-${color}-500/15 border-${color}-500/40 shadow-lg shadow-${color}-900/20`
                    : `bg-${color}-500/5 border-${color}-500/10 hover:border-${color}-500/25`
                }`}
              >
                {filter === key && (
                  <div
                    className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-${color}-400 shadow-sm shadow-${color}-400/60`}
                  />
                )}
                <div
                  className={`text-${color}-400 text-4xl font-bold tracking-tight leading-none mb-1`}
                >
                  {count}
                </div>
                <div className="text-zinc-500 text-xs uppercase tracking-widest font-medium">
                  {label}
                </div>
              </button>
            ))}
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {(
              [
                {
                  key: "all",
                  label: "Todos",
                  count: uploads.length,
                  activeClass: "bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/20",
                },
                {
                  key: "pending",
                  label: "Pendentes",
                  count: stats.pending,
                  activeClass: "bg-orange-500 text-white shadow-md shadow-orange-500/20",
                },
                {
                  key: "published",
                  label: "Publicados",
                  count: stats.published,
                  activeClass: "bg-green-500 text-white shadow-md shadow-green-500/20",
                },
                {
                  key: "cancelled",
                  label: "Cancelados",
                  count: stats.cancelled,
                  activeClass: "bg-zinc-600 text-white shadow-md shadow-zinc-600/20",
                },
              ] as const
            ).map(({ key, label, count, activeClass }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? activeClass
                    : "bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                }`}
              >
                {label}{" "}
                <span className={filter === key ? "opacity-70" : "text-zinc-600"}>({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin text-[#C5A059] mx-auto mb-4" size={40} />
            <p className="text-zinc-500 text-sm tracking-wide">A carregar...</p>
          </div>
        ) : filteredUploads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 select-none">
            <div className="relative flex items-center justify-center mb-8">
              <div
                className="absolute w-44 h-44 rounded-full"
                style={{ border: "1px solid rgba(197,160,89,0.06)" }}
              />
              <div
                className="absolute w-32 h-32 rounded-full"
                style={{ border: "1px solid rgba(197,160,89,0.10)" }}
              />
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 40% 35%, rgba(197,160,89,0.12) 0%, rgba(197,160,89,0.04) 60%, transparent 100%)",
                  border: "1px solid rgba(197,160,89,0.15)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #833ab4 0%, #c13584 35%, #fd1d1d 80%, #f77737 100%)",
                    opacity: 0.35,
                  }}
                >
                  <Instagram className="text-white" size={28} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C5A059]/30" />
              <div className="w-1 h-1 rounded-full bg-[#C5A059]/30" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C5A059]/30" />
            </div>
            <h3 className="text-white/70 font-serif text-lg tracking-wide mb-2">
              {filter === "pending" && "Sem pendentes"}
              {filter === "published" && "Sem publicados"}
              {filter === "cancelled" && "Sem cancelados"}
              {filter === "all" && "Nenhum material"}
            </h3>
            <p className="text-zinc-600 text-sm text-center max-w-xs">
              {filter === "pending" && "Todos os materiais recebidos foram processados."}
              {filter === "published" && "Ainda nenhum material foi marcado como publicado."}
              {filter === "cancelled" && "Não existem materiais cancelados neste momento."}
              {filter === "all" && "Ainda não foram recebidos materiais para gestão."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUploads.map((upload) => {
              const isPending = upload.status === "pending";
              const isPublished = upload.status === "published";
              const borderAccent = isPending
                ? "border-l-orange-500"
                : isPublished
                  ? "border-l-green-500"
                  : "border-l-zinc-600";
              const imageFiles =
                upload.files_urls?.filter((u) => u.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ?? [];
              const videoFiles =
                upload.files_urls?.filter((u) => u.match(/\.(mp4|mov|avi|webm)$/i)) ?? [];
              const allFiles = upload.files_urls ?? [];
              const multiImage = imageFiles.length > 1;

              return (
                <div
                  key={upload.id}
                  className={`relative bg-zinc-900/60 border border-white/[0.07] border-l-4 ${borderAccent} rounded-xl p-6 shadow-lg shadow-black/40 hover:shadow-2xl hover:shadow-black/60 hover:border-white/[0.12] transition-all duration-300`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6 gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30">
                            <Clock size={11} />
                            Pendente
                          </span>
                        )}
                        {isPublished && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-green-500/15 text-green-400 ring-1 ring-green-500/30">
                            <CheckCircle2 size={11} />
                            Publicado
                          </span>
                        )}
                        {upload.status === "cancelled" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-600/20 text-zinc-500 ring-1 ring-zinc-600/30">
                            <XCircle size={11} />
                            Cancelado
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-zinc-500 text-xs">
                          <Calendar size={12} />
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
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Mail size={13} className="text-zinc-500 flex-shrink-0" />
                          <span className="truncate">{upload.customer_email}</span>
                        </div>
                      )}
                    </div>

                    {isPending && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateStatus(upload.id, "published")}
                          disabled={processingId === upload.id}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-md shadow-green-900/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === upload.id ? (
                            <Loader2 className="animate-spin" size={15} />
                          ) : (
                            <Check size={15} />
                          )}
                          Publicar
                        </button>
                        <button
                          onClick={() => updateStatus(upload.id, "cancelled")}
                          disabled={processingId === upload.id}
                          className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-red-600/80 text-zinc-300 hover:text-white px-4 py-2 text-sm font-semibold rounded-lg ring-1 ring-white/10 hover:ring-red-500/40 shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X size={15} />
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Media */}
                    <div>
                      <h3 className="flex items-center gap-2 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-3">
                        <ImageIcon size={13} className="text-[#C5A059]" />
                        Ficheiros
                        <span className="ml-auto text-zinc-600 font-normal normal-case tracking-normal text-xs">
                          {allFiles.length} {allFiles.length === 1 ? "ficheiro" : "ficheiros"}
                        </span>
                      </h3>

                      {imageFiles.length > 0 && (
                        <div
                          className={`mb-3 rounded-lg overflow-hidden ${multiImage ? "grid grid-cols-2 gap-0.5" : ""}`}
                        >
                          {imageFiles.map((url, idx) => (
                            <div
                              key={idx}
                              className={`relative bg-black ${multiImage ? "aspect-square" : "aspect-[4/3] w-full"}`}
                            >
                              <Image
                                src={url}
                                alt={`Imagem ${idx + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-end justify-end p-2 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 via-transparent to-transparent"
                              >
                                <span className="flex items-center gap-1 text-white text-xs bg-black/60 rounded px-2 py-1">
                                  <Download size={12} />
                                  {idx + 1}
                                </span>
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      {videoFiles.map((url, idx) => (
                        <div key={idx} className="mb-3 bg-black rounded-lg overflow-hidden">
                          <video src={url} controls className="w-full h-auto" />
                          <div className="px-3 py-2 bg-zinc-800/80 flex items-center justify-between">
                            <span className="text-zinc-400 text-xs">Vídeo {idx + 1}</span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[#C5A059] hover:text-white text-xs transition-colors"
                            >
                              <Download size={12} />
                              Download
                            </a>
                          </div>
                        </div>
                      ))}

                      {allFiles
                        .filter((u) => !u.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|webm)$/i))
                        .map((url, idx) => (
                          <div
                            key={idx}
                            className="mb-3 bg-black rounded-lg p-4 flex items-center justify-between"
                          >
                            <span className="text-zinc-400 text-sm">Ficheiro {idx + 1}</span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[#C5A059] hover:text-white text-xs transition-colors"
                            >
                              <Download size={12} />
                              Download
                            </a>
                          </div>
                        ))}
                    </div>

                    {/* Texto */}
                    <div className="space-y-3">
                      <div className="bg-black/60 border-l-2 border-[#C5A059]/50 rounded-r-lg pl-4 pr-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={13} className="text-[#C5A059] flex-shrink-0" />
                          <span className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                            Caption
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(upload.caption || "", `caption-${upload.id}`)
                            }
                            className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-[#C5A059] transition-colors"
                          >
                            <Copy size={11} />
                            {copiedField === `caption-${upload.id}` ? (
                              <span className="text-green-400">Copiado!</span>
                            ) : (
                              "Copiar"
                            )}
                          </button>
                        </div>
                        <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
                          {upload.caption || "(Não especificado)"}
                        </p>
                      </div>

                      {upload.hashtags && (
                        <div className="bg-black/60 border-l-2 border-[#C5A059]/50 rounded-r-lg pl-4 pr-4 py-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Hash size={13} className="text-[#C5A059] flex-shrink-0" />
                            <span className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                              Hashtags
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(upload.hashtags || "", `hashtags-${upload.id}`)
                              }
                              className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-[#C5A059] transition-colors"
                            >
                              <Copy size={11} />
                              {copiedField === `hashtags-${upload.id}` ? (
                                <span className="text-green-400">Copiado!</span>
                              ) : (
                                "Copiar"
                              )}
                            </button>
                          </div>
                          <p className="text-zinc-400 text-sm leading-relaxed">{upload.hashtags}</p>
                        </div>
                      )}

                      {upload.link && (
                        <div className="bg-black/60 border-l-2 border-[#C5A059]/50 rounded-r-lg pl-4 pr-4 py-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Link2 size={13} className="text-[#C5A059] flex-shrink-0" />
                            <span className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                              Link
                            </span>
                          </div>
                          <a
                            href={upload.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C5A059] hover:text-white text-sm flex items-start gap-2 break-all leading-relaxed transition-colors"
                          >
                            <span className="flex-1">{upload.link}</span>
                            <ExternalLink size={13} className="flex-shrink-0 mt-0.5" />
                          </a>
                        </div>
                      )}

                      {upload.observacoes && (
                        <div className="bg-black/60 border-l-2 border-[#C5A059]/50 rounded-r-lg pl-4 pr-4 py-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare size={13} className="text-[#C5A059] flex-shrink-0" />
                            <span className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                              Observações
                            </span>
                          </div>
                          <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
                            {upload.observacoes}
                          </p>
                        </div>
                      )}

                      <p className="text-zinc-700 text-xs pt-1 font-mono">
                        ID: {upload.session_id}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  {upload.published_at && (
                    <div className="mt-5 pt-4 border-t border-white/[0.07] flex items-center gap-2">
                      <Calendar size={13} className="text-green-500 flex-shrink-0" />
                      <p className="text-green-400 text-sm">
                        Publicado em{" "}
                        <span className="font-medium">
                          {new Date(upload.published_at).toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
