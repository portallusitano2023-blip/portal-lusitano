"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/perfil`,
      });
      setSent(true);
    } catch {
      // Show success regardless to prevent email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-[#C5A059]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-[#C5A059]" size={32} />
        </div>
        <h2 className="text-xl font-serif text-white mb-2">Email Enviado</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Se o email <strong className="text-white">{email}</strong> estiver registado, recebera um
          link para redefinir a senha.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#D4AF6A] text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-2">Recuperar Senha</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Introduza o seu email e enviaremos um link para redefinir a senha.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#C5A059] outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
          {loading ? "A enviar..." : "Enviar Link de Recuperacao"}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-zinc-500 hover:text-[#C5A059] transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} />
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
