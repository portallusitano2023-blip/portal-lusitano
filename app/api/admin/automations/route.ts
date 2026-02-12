import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Listar todas as automações com filtros
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const enabled = searchParams.get("enabled"); // 'true', 'false', or null for all
    const trigger_type = searchParams.get("trigger_type") || "all";
    const action_type = searchParams.get("action_type") || "all";

    // Começar query
    let query = supabase
      .from("admin_automations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Filtros
    if (enabled !== null) {
      query = query.eq("enabled", enabled === "true");
    }

    if (trigger_type !== "all") {
      query = query.eq("trigger_type", trigger_type);
    }

    if (action_type !== "all") {
      query = query.eq("action_type", action_type);
    }

    const { data: automations, error, count } = await query;

    if (error) throw error;

    // Calcular estatísticas
    const totalRuns = automations?.reduce((sum, a) => sum + (a.total_runs || 0), 0) || 0;
    const totalSuccessful = automations?.reduce((sum, a) => sum + (a.successful_runs || 0), 0) || 0;
    const totalFailed = automations?.reduce((sum, a) => sum + (a.failed_runs || 0), 0) || 0;

    const stats = {
      total: count || 0,
      enabled: automations?.filter((a) => a.enabled).length || 0,
      disabled: automations?.filter((a) => !a.enabled).length || 0,
      total_runs: totalRuns,
      total_successful: totalSuccessful,
      total_failed: totalFailed,
      success_rate: totalRuns > 0 ? Math.round((totalSuccessful / totalRuns) * 100) : 0,
    };

    return NextResponse.json({
      automations: automations || [],
      stats,
    });
  } catch (error) {
    logger.error("Error fetching automations:", error);
    return NextResponse.json(
      {
        error: "Erro ao carregar automações",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// POST - Criar nova automação
export async function POST(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      trigger_type,
      trigger_conditions = {},
      action_type,
      action_config,
      delay_minutes = 0,
      enabled = true,
    } = body;

    // Validações
    if (!name || !trigger_type || !action_type || !action_config) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, trigger_type, action_type, action_config" },
        { status: 400 }
      );
    }

    // Validar tipos
    const validTriggers = [
      "lead_created",
      "payment_succeeded",
      "review_submitted",
      "cavalo_created",
      "time_based",
    ];
    const validActions = [
      "send_email",
      "create_task",
      "update_field",
      "approve_review",
      "send_notification",
    ];

    if (!validTriggers.includes(trigger_type)) {
      return NextResponse.json(
        { error: `Trigger type inválido. Válidos: ${validTriggers.join(", ")}` },
        { status: 400 }
      );
    }

    if (!validActions.includes(action_type)) {
      return NextResponse.json(
        { error: `Action type inválido. Válidos: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    // Criar automação
    const { data: automation, error } = await supabase
      .from("admin_automations")
      .insert({
        name,
        description,
        trigger_type,
        trigger_conditions,
        action_type,
        action_config,
        delay_minutes: parseInt(delay_minutes) || 0,
        enabled,
        created_by: email,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ automation }, { status: 201 });
  } catch (error) {
    logger.error("Error creating automation:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar automação",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar automação (enable/disable, editar config)
export async function PUT(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID da automação é obrigatório" }, { status: 400 });
    }

    // Atualizar automação
    const { data: automation, error } = await supabase
      .from("admin_automations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ automation });
  } catch (error) {
    logger.error("Error updating automation:", error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar automação",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// DELETE - Apagar automação
export async function DELETE(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID da automação é obrigatório" }, { status: 400 });
    }

    // Apagar automação (logs serão apagados em cascata)
    const { error } = await supabase.from("admin_automations").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting automation:", error);
    return NextResponse.json(
      {
        error: "Erro ao apagar automação",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
