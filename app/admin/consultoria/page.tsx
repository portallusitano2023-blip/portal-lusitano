"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ConsultationTicket } from "@/types/consultation";

export default function AdminConsultationsPage() {
  const [tickets, setTickets] = useState<ConsultationTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [filterStatus]);

  const loadTickets = async () => {
    try {
      const url = `/api/consultation/respond${filterStatus !== "all" ? `?status=${filterStatus}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (ticketId: string) => {
    if (!response.trim()) {
      alert("Por favor, escreva uma resposta");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/consultation/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: ticketId,
          response,
        }),
      });

      if (!res.ok) throw new Error("Erro ao enviar resposta");

      alert("Resposta enviada com sucesso!");
      setResponse("");
      setRespondingTo(null);
      loadTickets(); // Recarregar tickets
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar resposta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
      in_progress: { label: "Em Análise", color: "bg-blue-100 text-blue-800" },
      answered: { label: "Respondida", color: "bg-green-100 text-green-800" },
      closed: { label: "Fechada", color: "bg-gray-100 text-gray-800" },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: { label: "Baixa", color: "bg-gray-100 text-gray-700" },
      medium: { label: "Média", color: "bg-blue-100 text-blue-700" },
      high: { label: "Alta", color: "bg-red-100 text-red-700" },
    };
    const badge = badges[priority as keyof typeof badges] || badges.medium;
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getTypeName = (type: string) => {
    const types: Record<string, string> = {
      linhagens: "Linhagens",
      acasalamento: "Acasalamento",
      morfologia: "Morfologia",
      contrato: "Contrato",
      gestao: "Gestão",
      marketing: "Marketing",
      outro: "Outro",
    };
    return types[type] || type;
  };

  const pendingCount = tickets.filter((t) => t.status === "pending").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎓 Gestão de Consultorias
          </h1>
          <p className="text-gray-600">
            Responda a pedidos de consultoria dos membros PRO
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-sm text-yellow-700">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <p className="text-sm text-blue-700">Em Análise</p>
            <p className="text-2xl font-bold text-blue-900">{inProgressCount}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-sm text-green-700">Respondidas</p>
            <p className="text-2xl font-bold text-green-900">
              {tickets.filter((t) => t.status === "answered").length}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === "pending"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilterStatus("in_progress")}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === "in_progress"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Em Análise
            </button>
            <button
              onClick={() => setFilterStatus("answered")}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === "answered"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Respondidas
            </button>
          </div>
        </div>

        {/* Lista de Tickets */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">A carregar...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Nenhuma consultoria encontrada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                {/* Header do Ticket */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {ticket.subject}
                      </h3>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Cliente:</strong> {ticket.user_name} ({ticket.user_email})
                      </p>
                      <p>
                        <strong>Plano:</strong> {ticket.user_plan} • <strong>Tipo:</strong>{" "}
                        {getTypeName(ticket.type)}
                      </p>
                      <p>
                        <strong>ID:</strong> {ticket.id} • <strong>Criado:</strong>{" "}
                        {new Date(ticket.created_at).toLocaleString("pt-PT")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mensagem do Cliente */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    📝 Pedido do Cliente:
                  </p>
                  <p className="text-gray-800 whitespace-pre-wrap">{ticket.message}</p>
                </div>

                {/* Resposta Admin (se existir) */}
                {ticket.admin_response ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                      ✅ Sua Resposta:
                    </p>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {ticket.admin_response}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Respondido em:{" "}
                      {ticket.admin_response_at
                        ? new Date(ticket.admin_response_at).toLocaleString("pt-PT")
                        : "N/A"}
                    </p>
                  </div>
                ) : respondingTo === ticket.id ? (
                  /* Formulário de Resposta */
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ✍️ Sua Resposta:
                    </label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none mb-3"
                      placeholder="Escreva aqui a sua resposta detalhada..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespond(ticket.id)}
                        disabled={isSubmitting}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                      >
                        {isSubmitting ? "A enviar..." : "📤 Enviar Resposta"}
                      </button>
                      <button
                        onClick={() => {
                          setRespondingTo(null);
                          setResponse("");
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Botão para Responder */
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setRespondingTo(ticket.id)}
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
                    >
                      💬 Responder
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
