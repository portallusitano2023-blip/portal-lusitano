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
  /**
   * Server-side validation + recording. Must be called BEFORE running calculations.
   * Returns `true` if the user is allowed to proceed, `false` otherwise.
   */
  validateAndRecord: (
    formData?: Record<string, unknown>,
    resultData?: Record<string, unknown>
  ) => Promise<boolean>;
  /** @deprecated Use validateAndRecord instead — kept for backwards compat */
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
      } catch (err) {
        // SECURITY: On error, be RESTRICTIVE — block access until data loads correctly
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "[useToolAccess] Error loading tool access, defaulting to restrictive:",
            err
          );
        }
        setUsageCount(FREE_USES_PER_TOOL); // Forces canUse = false
      } finally {
        setIsLoading(false);
      }
    };

    loadAccess();
  }, [user, authLoading, toolName]);

  const freeUsesLeft = Math.max(0, FREE_USES_PER_TOOL - usageCount);
  // SECURITY: Only authenticated users can use tools.
  // Guests must create an account to get their 1 free use.
  const canUse = !!user && (isSubscribed || freeUsesLeft > 0);
  const requiresAuth = !user;

  /**
   * Server-side validation + atomic usage recording.
   * Called BEFORE calculations to ensure the user truly has access.
   * Returns `true` if allowed, `false` if blocked.
   */
  const validateAndRecord = useCallback(
    async (
      formData?: Record<string, unknown>,
      resultData?: Record<string, unknown>
    ): Promise<boolean> => {
      // SECURITY: Unauthenticated users cannot use tools — triggers Paywall/register flow
      if (!user) return false;

      try {
        const res = await fetch("/api/tools/validate-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolName,
            record: true,
            formData: formData || undefined,
            resultData: resultData || undefined,
          }),
        });

        const data = await res.json();

        if (data.allowed) {
          // Update local state to match server
          if (data.isSubscribed) {
            setIsSubscribed(true);
          } else {
            setUsageCount((prev) => prev + 1);
          }
          return true;
        }

        // Access denied — update local state
        if (data.freeUsesLeft !== undefined) {
          setUsageCount(FREE_USES_PER_TOOL - data.freeUsesLeft);
        }
        return false;
      } catch {
        // SECURITY: On network/server error, DENY access
        return false;
      }
    },
    [user, toolName]
  );

  /**
   * @deprecated Legacy client-side recording. Kept for backwards compatibility.
   * New code should use validateAndRecord() instead.
   */
  const recordUsage = useCallback(
    async (formData?: Record<string, unknown>, resultData?: Record<string, unknown>) => {
      if (!user) return;

      try {
        const { createSupabaseBrowserClient } = await getSupabase();
        const supabase = createSupabaseBrowserClient();
        await supabase.from("tool_usage").insert({
          user_id: user.id,
          tool_name: toolName,
          form_data: (formData as Record<string, never>) || null,
          result_data: (resultData as Record<string, never>) || null,
        });
        const newCount = usageCount + 1;
        setUsageCount(newCount);

        if (!isSubscribed && newCount >= FREE_USES_PER_TOOL) {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 5000);
          fetch("/api/tools/limit-reached", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolSlug: toolName }),
            signal: ctrl.signal,
          })
            .catch(() => {})
            .finally(() => clearTimeout(timer));
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
    validateAndRecord,
    recordUsage,
  };
}
