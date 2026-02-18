"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Loader2, CheckCircle } from "lucide-react";

function RegistarContent() {
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
  const { t } = useLanguage();

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
      setError(t.errors.error_generic);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.errors.error_generic);
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
          setError(t.errors.error_generic);
        } else {
          setError(authError.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError(t.errors.error_generic);
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
        <h2 className="text-xl font-serif text-[var(--foreground)] mb-2">{t.auth.email_sent}</h2>
        <p className="text-sm text-[var(--foreground-secondary)] mb-6">
          {t.auth.email_sent} <strong className="text-[var(--foreground)]">{email}</strong>
        </p>
        <Link
          href={redirect ? `/login?returnUrl=${encodeURIComponent(redirect)}` : "/login"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-black font-semibold rounded-lg hover:bg-[#D4AF6A] transition-colors"
        >
          {t.auth.back_to_login}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-[var(--foreground)] mb-2">{t.auth.create_account}</h1>
      <p className="text-sm text-[var(--foreground-muted)] mb-6">{t.auth.new_member}</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
            {t.auth.full_name}
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t.auth.full_name}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--gold)] outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
            {t.auth.email}
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
            {t.auth.password}
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
              placeholder={t.auth.password}
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

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
            {t.auth.confirm_password}
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t.auth.confirm_password}
              className={`w-full bg-[var(--background-card)] border rounded-lg pl-10 pr-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none transition-colors ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-500"
                  : "border-[var(--border)] focus:border-[var(--gold)]"
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
          {loading ? t.auth.creating_account : t.auth.create_account}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--foreground-muted)]">
        {t.auth.already_have_account}{" "}
        <Link
          href={redirect ? `/login?returnUrl=${encodeURIComponent(redirect)}` : "/login"}
          className="text-[var(--gold)] hover:text-[var(--gold)] font-medium transition-colors"
        >
          {t.auth.login_account}
        </Link>
      </p>
    </div>
  );
}

export default function RegistarPage() {
  return (
    <Suspense>
      <RegistarContent />
    </Suspense>
  );
}
