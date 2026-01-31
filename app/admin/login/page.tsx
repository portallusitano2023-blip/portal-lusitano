"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminLogin } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#C5A059] text-black font-bold uppercase text-xs tracking-[0.2em] py-4 hover:bg-white hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-500 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "A entrar..." : "Entrar"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(adminLogin, null);

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C5A059] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-20 w-full max-w-md bg-zinc-900/40 backdrop-blur-md border border-white/5 p-10 md:p-14 shadow-2xl">
        <div className="text-center mb-12">
          <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-4">
            Acesso Restrito
          </span>
          <h1 className="text-4xl font-serif text-white tracking-tight">
            Administração
          </h1>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mt-6"></div>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-900/20 border border-red-500/50 p-3 text-center">
              <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold">
                {state.error}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-black/60 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50 transition-all placeholder-zinc-800"
              placeholder="admin@portal-lusitano.pt"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-black/60 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50 transition-all placeholder-zinc-800"
              placeholder="••••••••"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="text-zinc-600 text-[10px] text-center mt-8">
          Portal Lusitano &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
