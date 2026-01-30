"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ConsultationForm from "@/components/ConsultationForm";
import { ConsultationTicket } from "@/types/consultation";

// TODO: Obter do Supabase Auth
const MOCK_USER = {
  email: "user@example.com",
  name: "João Silva",
  plan: "Criador", // Alterar para testar: "Aficionado", "Criador", "Elite"
};

export default function ConsultoriaPage() {
  const [tickets, setTickets] = useState<ConsultationTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await fetch("/api/consultation/submit");
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
    } finally {
      setIsLoading(false);
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

  const getTypeName = (type: string) => {
    const types: Record<string, string> = {
      linhagens: "Análise de Linhagens",
      acasalamento: "Plano de Acasalamento",
      morfologia: "Avaliação de Morfologia",
      contrato: "Revisão de Contratos",
      gestao: "Coaching de Gestão",
      marketing: "Marketing Digital",
      outro: "Outro",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎓 Consultoria Especializada
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Apoio personalizado de especialistas em Cavalos Lusitanos
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "new"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📝 Nova Consultoria
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "history"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📋 Histórico ({tickets.length})
          </button>
        </div>

        {/* Conteúdo das tabs */}
        {activeTab === "new" ? (
          <ConsultationForm
            userEmail={MOCK_USER.email}
            userName={MOCK_USER.name}
            userPlan={MOCK_USER.plan}
            onSuccess={loadTickets}
          />
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">A carregar consultorias...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">
                  Ainda não submeteu nenhuma consultoria.
                </p>
                <button
                  onClick={() => setActiveTab("new")}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition"
                >
                  Criar primeira consultoria
                </button>
              </div>
            ) : (
              tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {ticket.subject}
                        </h3>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {getTypeName(ticket.type)} • ID: {ticket.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submetida em: {new Date(ticket.created_at).toLocaleDateString("pt-PT")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                      {ticket.message}
                    </p>

                    {ticket.admin_response && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                        <p className="text-sm font-semibold text-green-900 mb-2">
                          ✅ Resposta do Especialista:
                        </p>
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {ticket.admin_response}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Respondido em:{" "}
                          {ticket.admin_response_at
                            ? new Date(ticket.admin_response_at).toLocaleDateString("pt-PT")
                            : "N/A"}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-6"
        >
          <h3 className="font-bold text-gray-900 mb-3">ℹ️ Como funciona:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Plano Criador:</strong> 2 consultorias por mês</li>
            <li>• <strong>Plano Elite:</strong> Consultorias ilimitadas com prioridade</li>
            <li>• <strong>Tempo de resposta:</strong> 24-48 horas (Elite: 24h garantidas)</li>
            <li>• <strong>Especialistas:</strong> Criadores e juízes com décadas de experiência</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
