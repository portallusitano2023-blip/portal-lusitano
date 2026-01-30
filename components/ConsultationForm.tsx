"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ConsultationType } from "@/types/consultation";

interface ConsultationFormProps {
  userEmail: string;
  userName: string;
  userPlan: string;
  onSuccess?: () => void;
}

const consultationTypes: { value: ConsultationType; label: string; description: string }[] = [
  {
    value: "linhagens",
    label: "Análise de Linhagens",
    description: "Análise detalhada de pedigree e linhagens",
  },
  {
    value: "acasalamento",
    label: "Plano de Acasalamento",
    description: "Sugestões de cruzamentos ideais",
  },
  {
    value: "morfologia",
    label: "Avaliação de Morfologia",
    description: "Avaliação morfológica por fotos",
  },
  {
    value: "contrato",
    label: "Revisão de Contratos",
    description: "Análise de documentos legais",
  },
  {
    value: "gestao",
    label: "Coaching de Gestão",
    description: "Estratégia e gestão de coudelaria",
  },
  {
    value: "marketing",
    label: "Marketing Digital",
    description: "Análise de redes sociais e vendas",
  },
  {
    value: "outro",
    label: "Outro",
    description: "Outra questão ou consultoria",
  },
];

export default function ConsultationForm({
  userEmail,
  userName,
  userPlan,
  onSuccess,
}: ConsultationFormProps) {
  const [type, setType] = useState<ConsultationType>("linhagens");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/consultation/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          subject,
          message,
          user_email: userEmail,
          user_name: userName,
          user_plan: userPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao submeter consultoria");
      }

      setSuccess(true);
      setSubject("");
      setMessage("");

      if (onSuccess) {
        onSuccess();
      }

      // Reset success message após 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao submeter consultoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificar se o plano permite consultorias
  const allowedPlans = ["Criador", "Elite"];
  if (!allowedPlans.includes(userPlan)) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">
          Consultorias não disponíveis no seu plano
        </h3>
        <p className="text-amber-700 mb-4">
          Para aceder a consultorias personalizadas, faça upgrade para o plano Criador ou Elite.
        </p>
        <a
          href="/pro"
          className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
        >
          Ver Planos
        </a>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📧 Nova Consultoria
        </h2>
        <p className="text-gray-600">
          Responderemos em <strong>24-48 horas</strong>. Membros Elite têm prioridade.
        </p>
      </div>

      {/* Tipo de Consultoria */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipo de Consultoria *
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ConsultationType)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        >
          {consultationTypes.map((ct) => (
            <option key={ct.value} value={ct.value}>
              {ct.label} - {ct.description}
            </option>
          ))}
        </select>
      </div>

      {/* Assunto */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Assunto *
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Análise da linhagem Andrade para acasalamento"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">{subject.length}/100 caracteres</p>
      </div>

      {/* Mensagem */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descrição Detalhada *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Descreva em detalhe a sua questão ou pedido de consultoria..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          required
          maxLength={2000}
        />
        <p className="text-xs text-gray-500 mt-1">{message.length}/2000 caracteres</p>
      </div>

      {/* Informação sobre anexos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Dica:</strong> Para anexar fotos ou documentos (pedigrees, contratos, etc.),
          pode incluir links para Google Drive, Dropbox ou similar na descrição acima.
        </p>
      </div>

      {/* Mensagens de erro/sucesso */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <p className="text-green-800 font-semibold">
            ✅ Consultoria submetida com sucesso!
          </p>
          <p className="text-green-700 text-sm mt-1">
            Receberá um email de confirmação e a nossa resposta em 24-48 horas.
          </p>
        </motion.div>
      )}

      {/* Botão de submissão */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? "A enviar..." : "📤 Submeter Consultoria"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Ao submeter, aceita os nossos termos de serviço. As respostas são enviadas por email.
      </p>
    </motion.form>
  );
}
