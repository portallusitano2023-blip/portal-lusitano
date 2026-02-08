"use client";

import { Component, ReactNode } from "react";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Sentry captura automaticamente via sentry.client.config.ts
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            {/* Icone */}
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="text-red-500" size={40} />
            </div>

            {/* Titulo */}
            <h1 className="text-3xl font-serif text-white mb-4">Algo correu mal</h1>

            {/* Descricao */}
            <p className="text-zinc-400 mb-8">
              Ocorreu um erro inesperado. Por favor, tente novamente ou volte à página inicial.
            </p>

            {/* Detalhes do erro (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-left overflow-auto max-h-40">
                <p className="text-red-400 text-xs font-mono">{this.state.error.message}</p>
              </div>
            )}

            {/* Acoes */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 bg-[#C5A059] text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                <RefreshCw size={16} />
                Tentar Novamente
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 text-xs uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
              >
                <Home size={16} />
                Página Inicial
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
