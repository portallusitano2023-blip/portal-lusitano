import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  let dbStatus: "connected" | "error" = "error";

  try {
    const { count, error } = await supabase
      .from("cavalos_venda")
      .select("id", { count: "exact", head: true });

    if (!error && count !== null) {
      dbStatus = "connected";
    }
  } catch {
    dbStatus = "error";
  }

  const status = dbStatus === "connected" ? "healthy" : "degraded";

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
      },
    },
    {
      status: 200,
      headers: {
        // Health endpoint must always reflect live state — never cache
        "Cache-Control": "no-store",
      },
    }
  );
}
