"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login")) {
          setError("Email ou senha incorretos.");
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push(returnUrl);
      router.refresh();
    } catch {
      setError("Erro ao iniciar sessao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-2">Iniciar Sessao</h1>
      <p className="text-sm text-zinc-500 mb-6">Aceda a sua conta para usar as ferramentas PRO.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

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

        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Senha</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="A sua senha"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder:text-zinc-600 focus:border-[#C5A059] outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/recuperar-senha"
            className="text-xs text-[#C5A059] hover:text-[#D4AF6A] transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
          {loading ? "A entrar..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Nao tem conta?{" "}
        <Link
          href={
            returnUrl !== "/" ? `/registar?redirect=${encodeURIComponent(returnUrl)}` : "/registar"
          }
          className="text-[#C5A059] hover:text-[#D4AF6A] font-medium transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
