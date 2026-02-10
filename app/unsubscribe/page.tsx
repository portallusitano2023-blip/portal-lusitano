"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleUnsubscribe() {
    if (!email) {
      setStatus("error");
      setMessage("Email não encontrado. Por favor, usa o link do email.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Subscrição cancelada com sucesso.");
      } else {
        setStatus("error");
        setMessage(data.error || "Erro ao cancelar subscrição.");
      }
    } catch {
      setStatus("error");
      setMessage("Erro de conexão. Tenta novamente.");
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/40 backdrop-blur-md border border-white/5 p-10 text-center">
        <h1 className="text-2xl font-serif text-white mb-4">Cancelar Subscrição</h1>

        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mb-8"></div>

        {status === "idle" && (
          <>
            <p className="text-zinc-400 mb-6">
              Tens a certeza que queres deixar de receber os nossos emails?
            </p>
            {email && (
              <p className="text-zinc-500 text-sm mb-6">
                Email: <span className="text-white">{email}</span>
              </p>
            )}
            <button
              onClick={handleUnsubscribe}
              className="w-full bg-red-600 text-white font-bold uppercase text-xs tracking-[0.2em] py-4 hover:bg-red-700 transition-all"
            >
              Sim, cancelar subscrição
            </button>
            <Link
              href="/"
              className="block mt-4 text-zinc-500 text-sm hover:text-[#C5A059] transition-colors"
            >
              Não, quero continuar a receber
            </Link>
          </>
        )}

        {status === "loading" && (
          <div className="py-8">
            <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-zinc-400 mt-4">A processar...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-zinc-300 mb-6">{message}</p>
            <p className="text-zinc-500 text-sm mb-6">
              Vamos sentir a tua falta! Podes sempre voltar a subscrever.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#C5A059] text-black font-bold uppercase text-xs tracking-[0.2em] py-4 px-8 hover:bg-white transition-all"
            >
              Voltar ao Portal
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-4">!</div>
            <p className="text-red-400 mb-6">{message}</p>
            <button
              onClick={() => setStatus("idle")}
              className="inline-block bg-zinc-800 text-white font-bold uppercase text-xs tracking-[0.2em] py-4 px-8 hover:bg-zinc-700 transition-all"
            >
              Tentar novamente
            </button>
          </>
        )}

        <p className="text-zinc-600 text-xs mt-8">
          Portal Lusitano &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
