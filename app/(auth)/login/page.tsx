"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

function LoginContent() {
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
      <h1 className="text-2xl font-serif text-[var(--foreground)] mb-2">Iniciar Sessao</h1>
      <p className="text-sm text-[var(--foreground-muted)] mb-6">
        Aceda a sua conta para usar as ferramentas PRO.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
            Email
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--gold)] outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="A sua senha"
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg pl-10 pr-12 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--gold)] outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/recuperar-senha"
            className="text-xs text-[var(--gold)] hover:text-[var(--gold)] transition-colors"
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

      <p className="mt-6 text-center text-sm text-[var(--foreground-muted)]">
        Nao tem conta?{" "}
        <Link
          href={
            returnUrl !== "/" ? `/registar?redirect=${encodeURIComponent(returnUrl)}` : "/registar"
          }
          className="text-[var(--gold)] hover:text-[var(--gold)] font-medium transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
