import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Executar uma automação manualmente ou via trigger
export async function POST(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { automation_id, trigger_data = {} } = body;

    if (!automation_id) {
      return NextResponse.json({ error: "automation_id é obrigatório" }, { status: 400 });
    }

    // Buscar automação
    const { data: automation, error: fetchError } = await supabase
      .from("admin_automations")
      .select("*")
      .eq("id", automation_id)
      .single();

    if (fetchError) throw fetchError;

    if (!automation) {
      return NextResponse.json({ error: "Automação não encontrada" }, { status: 404 });
    }

    if (!automation.enabled) {
      return NextResponse.json({ error: "Automação está desativada" }, { status: 400 });
    }

    // Criar log de execução
    const { data: log, error: logError } = await supabase
      .from("admin_automation_logs")
      .insert({
        automation_id: automation.id,
        status: "pending",
        trigger_data,
      })
      .select()
      .single();

    if (logError) throw logError;

    // Executar ação com base no action_type
    let result: Record<string, unknown> | undefined;
    let status = "success";
    let errorMessage = null;

    try {
      switch (automation.action_type) {
        case "send_email":
          result = await executeSendEmail(automation, trigger_data);
          break;

        case "create_task":
          result = await executeCreateTask(automation, trigger_data, email);
          break;

        case "update_field":
          result = await executeUpdateField(automation, trigger_data);
          break;

        case "approve_review":
          result = await executeApproveReview(automation, trigger_data);
          break;

        case "send_notification":
          result = await executeSendNotification(automation, trigger_data);
          break;

        default:
          throw new Error(`Action type não suportado: ${automation.action_type}`);
      }
    } catch (actionError) {
      status = "failed";
      errorMessage = actionError instanceof Error ? actionError.message : "Erro desconhecido";
      result = { error: actionError instanceof Error ? actionError.message : "Erro desconhecido" };
    }

    // Atualizar log
    await supabase
      .from("admin_automation_logs")
      .update({
        status,
        action_result: result,
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      })
      .eq("id", log.id);

    // Atualizar estatísticas da automação
    const updates: Record<string, unknown> = {
      total_runs: automation.total_runs + 1,
      last_run_at: new Date().toISOString(),
    };

    if (status === "success") {
      updates.successful_runs = automation.successful_runs + 1;
    } else {
      updates.failed_runs = automation.failed_runs + 1;
      updates.last_error = errorMessage;
    }

    await supabase.from("admin_automations").update(updates).eq("id", automation.id);

    return NextResponse.json({
      success: status === "success",
      log_id: log.id,
      result,
      error: errorMessage,
    });
  } catch (error) {
    logger.error("Error executing automation:", error);
    return NextResponse.json(
      {
        error: "Erro ao executar automação",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// ========================================
// ACTION EXECUTORS
// ========================================

interface AutomationData {
  id: string;
  name: string;
  action_type: string;
  action_config: Record<string, string | undefined>;
  delay_minutes?: number;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  enabled: boolean;
  [key: string]: unknown;
}
type TriggerData = Record<string, unknown>;

async function executeSendEmail(automation: AutomationData, triggerData: TriggerData) {
  const config = automation.action_config;
  const to = config.to || String(triggerData.email || "");
  const subject = config.subject || "Portal Lusitano";
  const template = config.template || "default";

  if (!to) {
    throw new Error("Email de destino não especificado");
  }

  // Aqui você pode usar templates diferentes
  let htmlContent = `<p>Email automático do Portal Lusitano</p>`;

  if (template === "welcome") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C5A059;">Bem-vindo ao Portal Lusitano!</h1>
        <p>Obrigado por se registar na nossa plataforma.</p>
        <p>Estamos entusiasmados por ter você connosco!</p>
      </div>
    `;
  }

  const { data, error } = await resend.emails.send({
    from: "Portal Lusitano <noreply@portal-lusitano.pt>",
    to: [to],
    subject,
    html: htmlContent,
  });

  if (error) throw error;

  return { email_sent: true, message_id: data?.id };
}

async function executeCreateTask(
  automation: AutomationData,
  triggerData: TriggerData,
  adminEmail: string
) {
  const config = automation.action_config;

  const title = config.title || "Tarefa Automática";
  const description =
    config.description || `Criada automaticamente pela automação: ${automation.name}`;
  const task_type = config.task_type || "follow_up";
  const priority = config.priority || "normal";

  // Calcular due_date (delay em minutos)
  const dueDate = new Date();
  dueDate.setMinutes(dueDate.getMinutes() + (automation.delay_minutes || 0));

  const { data: task, error } = await supabase
    .from("admin_tasks")
    .insert({
      title,
      description,
      task_type,
      priority,
      due_date: dueDate.toISOString(),
      status: "pendente",
      related_email: triggerData.email || null,
      notes: `Criada por automação: ${automation.name}`,
      admin_email: adminEmail,
    })
    .select()
    .single();

  if (error) throw error;

  return { task_created: true, task_id: task.id };
}

async function executeUpdateField(automation: AutomationData, _triggerData: TriggerData) {
  const config = automation.action_config;

  if (!config.table || !config.id || !config.field || config.value === undefined) {
    throw new Error("Configuração incompleta: table, id, field, value são obrigatórios");
  }

  const { data, error } = await supabase
    .from(config.table)
    .update({ [config.field]: config.value })
    .eq("id", config.id)
    .select()
    .single();

  if (error) throw error;

  return { field_updated: true, data };
}

async function executeApproveReview(automation: AutomationData, triggerData: TriggerData) {
  const reviewId = triggerData.review_id || automation.action_config.review_id;

  if (!reviewId) {
    throw new Error("review_id não especificado");
  }

  const { error } = await supabase
    .from("reviews")
    .update({ status: "approved" })
    .eq("id", reviewId)
    .select()
    .single();

  if (error) throw error;

  return { review_approved: true, review_id: reviewId };
}

async function executeSendNotification(automation: AutomationData, triggerData: TriggerData) {
  const config = automation.action_config;

  const title = config.title || "Notificação Automática";
  const message = config.message || "Nova notificação do Portal Lusitano";
  const type = config.type || "info";

  // Create a task instead since we don't have a dedicated notifications table
  // This will show up in the admin's task list
  const dueDate = new Date();

  const { data, error } = await supabase
    .from("admin_tasks")
    .insert({
      title,
      description: message,
      task_type: "other",
      due_date: dueDate.toISOString(),
      priority: type === "urgent" ? "urgente" : type === "important" ? "alta" : "normal",
      status: "pendente",
      notes: `Notificação criada por automação: ${automation.name}\n${JSON.stringify(triggerData, null, 2)}`,
      admin_email: "system",
    })
    .select()
    .single();

  if (error) throw error;

  return { notification_sent: true, task_id: data.id };
}
