"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Loader2, CheckCircle } from "lucide-react";

export default function RegistarPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const passwordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordValid) {
      setError("A senha nao cumpre os requisitos minimos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas nao coincidem.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Este email ja esta registado.");
        } else {
          setError(authError.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-emerald-400" size={32} />
        </div>
        <h2 className="text-xl font-serif text-white mb-2">Conta Criada!</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Enviamos um email de confirmacao para <strong className="text-white">{email}</strong>.
          Verifique a sua caixa de correio para activar a conta.
        </p>
        <Link
          href={redirect ? `/login?returnUrl=${encodeURIComponent(redirect)}` : "/login"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-black font-semibold rounded-lg hover:bg-[#D4AF6A] transition-colors"
        >
          Ir para Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-2">Criar Conta</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Registe-se para aceder as ferramentas do Portal Lusitano.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="O seu nome"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#C5A059] outline-none transition-colors"
            />
          </div>
        </div>

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
              placeholder="Minimo 8 caracteres"
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
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              {[
                { check: passwordChecks.length, label: "Minimo 8 caracteres" },
                { check: passwordChecks.upper, label: "Uma letra maiuscula" },
                { check: passwordChecks.number, label: "Um numero" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`text-xs flex items-center gap-1.5 ${
                    item.check ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.check ? "bg-emerald-400" : "bg-zinc-600"
                    }`}
                  />
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Confirmar Senha
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repita a senha"
              className={`w-full bg-zinc-800 border rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 outline-none transition-colors ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-500"
                  : "border-zinc-700 focus:border-[#C5A059]"
              }`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !passwordValid}
          className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          {loading ? "A criar conta..." : "Criar Conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Ja tem conta?{" "}
        <Link
          href={redirect ? `/login?returnUrl=${encodeURIComponent(redirect)}` : "/login"}
          className="text-[#C5A059] hover:text-[#D4AF6A] font-medium transition-colors"
        >
          Iniciar sessao
        </Link>
      </p>
    </div>
  );
}
