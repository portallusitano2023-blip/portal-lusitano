"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

// Inline minimal types to avoid importing @supabase/supabase-js in the initial bundle
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MinimalUser = { id: string; email?: string; user_metadata: Record<string, any> };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MinimalSession = { user: MinimalUser; access_token: string } & Record<string, any>;

interface AuthContextType {
  user: MinimalUser | null;
  session: MinimalSession | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

// Lazy singleton — Supabase client is only loaded when first needed (~181KB deferred)
let supabasePromise: Promise<typeof import("@/lib/supabase-browser")> | null = null;
function getSupabase() {
  if (!supabasePromise) {
    supabasePromise = import("@/lib/supabase-browser");
  }
  return supabasePromise;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MinimalUser | null>(null);
  const [session, setSession] = useState<MinimalSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let cleanupRef: (() => void) | null = null;

    getSupabase().then(({ createSupabaseBrowserClient }) => {
      if (cancelled) return;
      const supabase = createSupabaseBrowserClient();

      // Get initial session
      supabase.auth.getSession().then(({ data: { session: s } }) => {
        if (cancelled) return;
        setSession(s);
        setUser(s?.user ?? null);
        setIsLoading(false);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setIsLoading(false);

        // Enviar email de boas-vindas apenas no primeiro login após confirmação
        if (event === "SIGNED_IN" && s?.user?.email_confirmed_at) {
          const welcomeSentKey = `welcome_sent_${s.user.id}`;
          if (!sessionStorage.getItem(welcomeSentKey)) {
            sessionStorage.setItem(welcomeSentKey, "1");
            fetch("/api/auth/welcome", { method: "POST" }).catch(() => {});
          }
        }
      });

      // Store unsubscribe for cleanup
      cleanupRef = () => subscription.unsubscribe();
    });

    return () => {
      cancelled = true;
      cleanupRef?.();
    };
  }, []);

  const signOut = useCallback(async () => {
    const { createSupabaseBrowserClient } = await getSupabase();
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, session, isLoading, signOut }),
    [user, session, isLoading, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
