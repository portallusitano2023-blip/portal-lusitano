"use client";

import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useLanguage } from "@/context/LanguageContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserPlus,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function inputClass(hasError: boolean) {
  return [
    "w-full bg-[var(--background-card)] border rounded-lg pl-10 pr-4 py-3",
    "text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]",
    "outline-none transition-colors",
    "focus:border-[var(--gold)]/50 focus:ring-1 focus:ring-[var(--gold)]/30",
    hasError
      ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
      : "border-[var(--border)]",
  ].join(" ");
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
      <AlertCircle size={12} aria-hidden="true" />
      {message}
    </p>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────
type StrengthLevel = "none" | "weak" | "medium" | "strong";

function getPasswordStrength(pw: string): StrengthLevel {
  if (!pw) return "none";
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score = checks.filter(Boolean).length;
  if (score <= 1) return "weak";
  if (score <= 2) return "medium";
  return "strong";
}

const strengthConfig: Record<StrengthLevel, { label: string; color: string; width: string }> = {
  none: { label: "", color: "bg-[var(--border)]", width: "w-0" },
  weak: { label: "Fraca", color: "bg-red-500", width: "w-1/3" },
  medium: { label: "Média", color: "bg-amber-400", width: "w-2/3" },
  strong: { label: "Forte", color: "bg-emerald-500", width: "w-full" },
};

function PasswordStrengthBar({ password }: { password: string }) {
  const level = getPasswordStrength(password);
  const { label, color, width } = strengthConfig[level];

  if (!password) return null;

  return (
    <div className="mt-2" aria-live="polite" aria-atomic="true">
      <div className="h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${color} ${width}`} />
      </div>
      {label && (
        <p
          className={`mt-1 text-xs ${level === "strong" ? "text-emerald-400" : level === "medium" ? "text-amber-400" : "text-red-400"}`}
        >
          Força da palavra-passe: <span className="font-medium">{label}</span>
        </p>
      )}
    </div>
  );
}

// ─── Password requirements checklist ─────────────────────────────────────────
function PasswordChecks({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    { ok: password.length >= 8, label: "Mínimo 8 caracteres" },
    { ok: /[A-Z]/.test(password), label: "Uma letra maiúscula" },
    { ok: /[0-9]/.test(password), label: "Um número" },
  ];
  return (
    <ul className="mt-2 space-y-1" aria-label="Requisitos da palavra-passe">
      {checks.map(({ ok, label }) => (
        <li
          key={label}
          className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-400" : "text-[var(--foreground-muted)]"}`}
        >
          <CheckCircle
            size={11}
            aria-hidden="true"
            className={ok ? "text-emerald-400" : "text-[var(--border)]"}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────
function RegistarContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shaking, setShaking] = useState(false);

  const { t } = useLanguage();

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const passwordValid = Object.values(passwordChecks).every(Boolean);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const clearFieldError = useCallback(
    (field: keyof typeof fieldErrors) =>
      setFieldErrors((prev) => ({ ...prev, [field]: undefined })),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    // Client-side validation
    const errors: typeof fieldErrors = {};
    if (!name.trim()) errors.name = "O nome é obrigatório.";
    if (!email) errors.email = "O email é obrigatório.";
    if (!password) errors.password = "A palavra-passe é obrigatória.";
    else if (!passwordValid) errors.password = "A palavra-passe não cumpre os requisitos.";
    if (!confirmPassword) errors.confirmPassword = "Por favor confirme a palavra-passe.";
    else if (password !== confirmPassword)
      errors.confirmPassword = "As palavras-passe não coincidem.";
    if (!termsAccepted) errors.terms = "Deve aceitar os termos para continuar.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (authError) {
        const msg = authError.message.includes("already registered")
          ? t.errors.error_generic
          : authError.message;
        setGlobalError(msg);
        triggerShake();
        return;
      }

      setSuccess(true);
    } catch {
      setGlobalError(t.errors.error_generic);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="text-emerald-400" size={32} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-serif text-[var(--foreground)] mb-2">{t.auth.email_sent}</h2>
        <p className="text-sm text-[var(--foreground-secondary)] mb-1">
          Enviámos um email de confirmação para
        </p>
        <p className="text-sm font-medium text-[var(--foreground)] mb-6">{email}</p>
        <Link
          href={redirect ? `/login?returnUrl=${encodeURIComponent(redirect)}` : "/login"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all"
        >
          {t.auth.back_to_login}
        </Link>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="text-2xl font-serif text-[var(--foreground)] mb-1">{t.auth.create_account}</h1>
      <p className="text-sm text-[var(--foreground-muted)] mb-6">{t.auth.new_member}</p>

      {/* Global error */}
      {globalError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{globalError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className={`space-y-4 ${shaking ? "animate-auth-shake" : ""}`}
        aria-label="Formulário de registo"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="reg-name"
            className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
          >
            {t.auth.full_name}
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              required
              autoComplete="name"
              placeholder={t.auth.full_name}
              aria-label={t.auth.full_name}
              aria-describedby={fieldErrors.name ? "reg-name-error" : undefined}
              aria-invalid={!!fieldErrors.name}
              className={inputClass(!!fieldErrors.name)}
            />
          </div>
          {fieldErrors.name && <FieldError id="reg-name-error" message={fieldErrors.name} />}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="reg-email"
            className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
          >
            {t.auth.email}
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              required
              autoComplete="email"
              placeholder="seu@email.com"
              aria-label={t.auth.email}
              aria-describedby={fieldErrors.email ? "reg-email-error" : undefined}
              aria-invalid={!!fieldErrors.email}
              className={inputClass(!!fieldErrors.email)}
            />
          </div>
          {fieldErrors.email && <FieldError id="reg-email-error" message={fieldErrors.email} />}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="reg-password"
            className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
          >
            {t.auth.password}
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              required
              autoComplete="new-password"
              placeholder={t.auth.password}
              aria-label={t.auth.password}
              aria-describedby={
                fieldErrors.password
                  ? "reg-password-error"
                  : password
                    ? "reg-password-strength"
                    : undefined
              }
              aria-invalid={!!fieldErrors.password}
              className={`${inputClass(!!fieldErrors.password)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showPassword ? (
                <EyeOff size={16} aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldErrors.password ? (
            <FieldError id="reg-password-error" message={fieldErrors.password} />
          ) : (
            <div id="reg-password-strength">
              <PasswordStrengthBar password={password} />
              <PasswordChecks password={password} />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="reg-confirm"
            className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
          >
            {t.auth.confirm_password}
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reg-confirm"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              required
              autoComplete="new-password"
              placeholder={t.auth.confirm_password}
              aria-label={t.auth.confirm_password}
              aria-describedby={fieldErrors.confirmPassword ? "reg-confirm-error" : undefined}
              aria-invalid={!!fieldErrors.confirmPassword}
              className={`${inputClass(
                !!fieldErrors.confirmPassword || (!!confirmPassword && confirmPassword !== password)
              )} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showConfirm ? (
                <EyeOff size={16} aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <FieldError id="reg-confirm-error" message={fieldErrors.confirmPassword} />
          )}
          {!fieldErrors.confirmPassword && confirmPassword && confirmPassword === password && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle size={12} aria-hidden="true" />
              Palavras-passe coincidem
            </p>
          )}
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input
                id="reg-terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  clearFieldError("terms");
                }}
                aria-describedby={fieldErrors.terms ? "reg-terms-error" : undefined}
                aria-invalid={!!fieldErrors.terms}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  termsAccepted
                    ? "bg-[var(--gold)] border-[var(--gold)]"
                    : fieldErrors.terms
                      ? "border-red-500/60 bg-[var(--background-card)]"
                      : "border-[var(--border)] bg-[var(--background-card)] group-hover:border-[var(--gold)]/40"
                }`}
                aria-hidden="true"
              >
                {termsAccepted && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Aceito os{" "}
              <Link
                href="/termos"
                className="text-[var(--gold)] hover:text-[var(--gold-hover)] underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Termos de Serviço
              </Link>{" "}
              e a{" "}
              <Link
                href="/privacidade"
                className="text-[var(--gold)] hover:text-[var(--gold-hover)] underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidade
              </Link>
            </span>
          </label>
          {fieldErrors.terms && <FieldError id="reg-terms-error" message={fieldErrors.terms} />}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !passwordValid}
          className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          aria-busy={loading}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <UserPlus size={18} aria-hidden="true" />
          )}
          {loading ? t.auth.creating_account : t.auth.create_account}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-[var(--foreground-muted)]">
        {t.auth.already_have_account}{" "}
        <Link
          href={redirect ? `/login?returnUrl=${encodeURIComponent(redirect)}` : "/login"}
          className="text-[var(--gold)] hover:text-[var(--gold-hover)] font-medium transition-colors"
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
