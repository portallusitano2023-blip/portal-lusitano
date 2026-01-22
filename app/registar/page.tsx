'use client'

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-white text-black font-bold uppercase text-xs tracking-[0.2em] py-4 hover:bg-[#C5A059] transition-all duration-500 mt-6 disabled:opacity-50"
    >
      {pending ? 'A Criar Conta...' : 'Confirmar Registo'}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, null);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden px-6 selection:bg-[#C5A059] selection:text-black">
        
        {/* Glow Dourado */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C5A059] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-20 w-full max-w-md bg-zinc-900/40 backdrop-blur-md border border-white/5 p-10 shadow-2xl">
            
            <div className="text-center mb-10">
                <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-4">
                  Novo Membro
                </span>
                <h1 className="text-3xl font-serif text-white tracking-tight">
                  Criar <span className="italic font-light text-zinc-400">Passaporte</span>
                </h1>
            </div>

            <form action={formAction} className="space-y-4">
                {state?.error && (
                    <div className="bg-red-900/20 border border-red-500/50 p-3 text-center text-red-400 text-[10px] uppercase font-bold">
                        {state.error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Nome</label>
                        <input name="firstName" required type="text" className="w-full bg-black/60 border border-white/10 text-white px-4 py-3 text-sm focus:border-[#C5A059] outline-none transition-colors" placeholder="Francisco" />
                    </div>
                    <div>
                        <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Apelido</label>
                        <input name="lastName" required type="text" className="w-full bg-black/60 border border-white/10 text-white px-4 py-3 text-sm focus:border-[#C5A059] outline-none transition-colors" placeholder="Gaspar" />
                    </div>
                </div>

                <div>
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Email</label>
                    <input name="email" required type="email" className="w-full bg-black/60 border border-white/10 text-white px-4 py-3 text-sm focus:border-[#C5A059] outline-none transition-colors" placeholder="email@exemplo.com" />
                </div>
                
                <div>
                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Password</label>
                    <input name="password" required type="password" className="w-full bg-black/60 border border-white/10 text-white px-4 py-3 text-sm focus:border-[#C5A059] outline-none transition-colors" placeholder="••••••••" />
                </div>

                <SubmitButton />
            </form>

            <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest">
                    Já é membro? <Link href="/login" className="text-[#C5A059] hover:text-white underline transition-colors">Entrar</Link>
                </p>
            </div>

        </div>
      </main>
    </>
  );
}