"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Mail, Clock } from "lucide-react";

export default function RegistarProfissionalSucessoPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Clear saved form data after successful payment
  useEffect(() => {
    localStorage.removeItem("profissional_registo_form");
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Pagamento Confirmado!</h1>
          <p className="text-[var(--foreground-secondary)] text-lg">
            O seu registo profissional foi recebido com sucesso
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Email de Confirmação</h3>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Enviámos um email com os detalhes da sua subscrição. Verifique também a pasta de
                  spam.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Perfil em Análise</h3>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  O seu perfil será analisado e aprovado pela nossa equipa nas próximas 24 horas.
                  Receberá um email assim que estiver visível no directório.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session ID */}
        {sessionId && (
          <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-lg p-4 mb-8">
            <p className="text-xs text-[var(--foreground-muted)] mb-1">ID da Transação:</p>
            <p className="text-xs text-[var(--foreground-secondary)] font-mono break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-4">
          <Link
            href="/profissionais"
            className="flex items-center justify-center gap-2 w-full bg-[var(--gold)] hover:bg-[#B39049] text-black font-bold py-4 rounded-xl transition-all"
          >
            <span>Ver Directório de Profissionais</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-[var(--background-secondary)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] font-bold py-4 rounded-xl transition-all border border-[var(--border)]"
          >
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
