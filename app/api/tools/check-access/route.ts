import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        subscribed: false,
        usage: {},
      });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("tools_subscription_status")
      .eq("id", user.id)
      .single();

    const subscribed = profile?.tools_subscription_status === "active";

    // Get usage counts per tool
    const { url } = request;
    const toolName = new URL(url).searchParams.get("tool");

    let usageCount = 0;
    if (toolName && !subscribed) {
      const { count } = await supabase
        .from("tool_usage")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("tool_name", toolName);
      usageCount = count || 0;
    }

    return NextResponse.json({
      authenticated: true,
      subscribed,
      usageCount,
      freeUsesLeft: Math.max(0, 1 - usageCount),
    });
  } catch (error) {
    console.error("Check access error:", error);
    return NextResponse.json({ error: "Erro ao verificar acesso" }, { status: 500 });
  }
}
