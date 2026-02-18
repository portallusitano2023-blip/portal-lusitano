"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

// Lazy singleton — Supabase loaded only when an authenticated user needs tool access
let supabasePromise: Promise<typeof import("@/lib/supabase-browser")> | null = null;
function getSupabase() {
  if (!supabasePromise) supabasePromise = import("@/lib/supabase-browser");
  return supabasePromise;
}

type ToolName = "calculadora" | "comparador" | "compatibilidade" | "perfil";

interface ToolAccessState {
  canUse: boolean;
  isSubscribed: boolean;
  freeUsesLeft: number;
  isLoading: boolean;
  requiresAuth: boolean;
  recordUsage: (
    formData?: Record<string, unknown>,
    resultData?: Record<string, unknown>
  ) => Promise<void>;
}

const FREE_USES_PER_TOOL = 1;

export function useToolAccess(toolName: ToolName): ToolAccessState {
  const { user, isLoading: authLoading } = useAuth();
  const [usageCount, setUsageCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadAccess = async () => {
      try {
        const { createSupabaseBrowserClient } = await getSupabase();
        const supabase = createSupabaseBrowserClient();

        // Check subscription status
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("tools_subscription_status")
          .eq("id", user.id)
          .single();

        const subscribed = profile?.tools_subscription_status === "active";
        setIsSubscribed(subscribed);

        if (!subscribed) {
          // Count uses for this tool
          const { count } = await supabase
            .from("tool_usage")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("tool_name", toolName);

          setUsageCount(count || 0);
        }
      } catch {
        // On error, be permissive
        setUsageCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccess();
  }, [user, authLoading, toolName]);

  const freeUsesLeft = Math.max(0, FREE_USES_PER_TOOL - usageCount);
  const canUse = !user || isSubscribed || freeUsesLeft > 0;
  const requiresAuth = !user;

  const recordUsage = useCallback(
    async (formData?: Record<string, unknown>, resultData?: Record<string, unknown>) => {
      if (!user) return;

      try {
        const { createSupabaseBrowserClient } = await getSupabase();
        const supabase = createSupabaseBrowserClient();
        await supabase.from("tool_usage").insert({
          user_id: user.id,
          tool_name: toolName,
          form_data: formData || null,
          result_data: resultData || null,
        });
        const newCount = usageCount + 1;
        setUsageCount(newCount);

        // Quando o utilizador esgota o uso gratuito, enviar email de upgrade (non-blocking)
        if (!isSubscribed && newCount >= FREE_USES_PER_TOOL) {
          fetch("/api/tools/limit-reached", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolSlug: toolName }),
          }).catch(() => {});
        }
      } catch {
        // Silently fail - don't block user
      }
    },
    [user, toolName, usageCount, isSubscribed]
  );

  return {
    canUse,
    isSubscribed,
    freeUsesLeft,
    isLoading: isLoading || authLoading,
    requiresAuth,
    recordUsage,
  };
}
