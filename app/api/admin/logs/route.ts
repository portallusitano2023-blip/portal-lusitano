import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const actionType = searchParams.get("action_type"); // 'create', 'update', 'delete', 'approve'
    const entityType = searchParams.get("entity_type"); // 'cavalo', 'evento', 'review', etc.
    const adminEmail = searchParams.get("admin_email");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    // Query base
    let query = supabase
      .from("admin_activity_log")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Filtros
    if (actionType && actionType !== "all") {
      query = query.eq("action_type", actionType);
    }

    if (entityType && entityType !== "all") {
      query = query.eq("entity_type", entityType);
    }

    if (adminEmail && adminEmail !== "all") {
      query = query.eq("admin_email", adminEmail);
    }

    // Paginação
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: logs, error, count } = await query;

    if (error) {
      logger.error("Error fetching logs:", error);
      throw error;
    }

    // Buscar lista de admins únicos para filtro
    const { data: admins } = await supabase
      .from("admin_activity_log")
      .select("admin_email")
      .order("admin_email");

    const uniqueAdmins = Array.from(new Set(admins?.map((a) => a.admin_email) || []));

    return NextResponse.json({
      logs: logs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      filters: {
        admins: uniqueAdmins,
      },
    });
  } catch (error) {
    logger.error("Logs error:", error);
    return NextResponse.json({ error: "Erro ao buscar logs" }, { status: 500 });
  }
}

// POST - Adicionar novo log (helper para outras APIs usarem)
export async function POST(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { action_type, entity_type, entity_id, changes, ip_address } = await req.json();

    const { data: log, error } = await supabase
      .from("admin_activity_log")
      .insert({
        admin_email: email,
        action_type,
        entity_type,
        entity_id,
        changes: changes || {},
        ip_address:
          ip_address || req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating log:", error);
      throw error;
    }

    return NextResponse.json({ log });
  } catch (error) {
    logger.error("Log creation error:", error);
    return NextResponse.json({ error: "Erro ao criar log" }, { status: 500 });
  }
}
