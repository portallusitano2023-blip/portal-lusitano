"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Upload, Mail, Instagram } from "lucide-react";

function InstagramSucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
            A sua compra de publicidade no Instagram foi recebida com sucesso
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Fazer Upload dos Materiais</h3>
                <p className="text-sm text-[var(--foreground-secondary)] mb-3">
                  Aceda ao link que enviámos por email para fazer upload das imagens/vídeos e
                  instruções para a publicação.
                </p>
                {sessionId && (
                  <Link
                    href={`/instagram/upload/${sessionId}`}
                    className="inline-flex items-center gap-2 text-sm text-[var(--gold)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <span>Fazer Upload Agora</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Email de Confirmação</h3>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Enviámos um email com o link de upload e todos os detalhes. Verifique também a
                  pasta de spam.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Publicação em 48h</h3>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Após receber os materiais, publicaremos no nosso Instagram nas próximas 48 horas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session ID (debug - pode ser removido em produção) */}
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
          {sessionId && (
            <Link
              href={`/instagram/upload/${sessionId}`}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold py-4 rounded-xl transition-all hover:opacity-90"
            >
              <Upload size={18} />
              <span>Fazer Upload dos Materiais</span>
            </Link>
          )}

          <Link
            href="/instagram"
            className="flex items-center justify-center gap-2 w-full bg-[var(--background-secondary)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] font-bold py-4 rounded-xl transition-all border border-[var(--border)]"
          >
            <span>Voltar ao Instagram</span>
          </Link>
        </div>

        {/* Auto redirect info */}
        {countdown > 0 && (
          <p className="text-center text-sm text-[var(--foreground-muted)] mt-6">
            Será redireccionado para upload em {countdown} segundo{countdown !== 1 ? "s" : ""}...
          </p>
        )}

        {countdown === 0 && sessionId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.location.href = '/instagram/upload/${sessionId}';`,
            }}
          />
        )}
      </div>
    </main>
  );
}

export default function InstagramSucessoPage() {
  return (
    <Suspense>
      <InstagramSucessoContent />
    </Suspense>
  );
}
