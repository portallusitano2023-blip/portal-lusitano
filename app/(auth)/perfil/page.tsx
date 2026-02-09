"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthGuard from "@/components/auth/AuthGuard";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Mail, Crown, LogOut, Loader2, Check, Pencil, Clock } from "lucide-react";

function PerfilContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.updateUser({
        data: { full_name: name },
      });
      setEditingName(false);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-3xl font-serif">Meu Perfil</h1>

        {/* User Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B7355] flex items-center justify-center text-black text-xl font-bold">
              {(name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm flex-1 focus:border-[#C5A059] outline-none"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="p-1.5 bg-[#C5A059] rounded-lg text-black"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">{name || "Sem nome"}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-zinc-500 hover:text-[#C5A059] transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                <Mail size={14} />
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="text-[#C5A059]" size={20} />
            <h2 className="text-lg font-medium">Subscricao</h2>
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-zinc-400">Plano Actual</span>
                <p className="text-white font-medium">Gratuito</p>
              </div>
              <a
                href="/ferramentas"
                className="px-4 py-2 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black text-sm font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all"
              >
                Upgrade PRO
              </a>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Com o plano PRO, tenha acesso ilimitado a todas as ferramentas, exportacao PDF
              profissional e historico guardado.
            </p>
          </div>
        </div>

        {/* Histórico de Uso */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-zinc-400" size={20} />
            <h2 className="text-lg font-medium">Historico de Uso</h2>
          </div>
          <p className="text-sm text-zinc-500">O historico das suas avaliacoes aparecera aqui.</p>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-sm font-medium hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Terminar Sessao
        </button>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <AuthGuard>
      <PerfilContent />
    </AuthGuard>
  );
}
