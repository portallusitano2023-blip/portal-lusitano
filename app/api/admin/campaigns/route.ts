import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { resend } from "@/lib/resend";

// GET - Listar campanhas
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: campaigns, error } = await supabase
      .from("email_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ campaigns: campaigns || [] });
  } catch (error: any) {
    console.error("Campaigns list error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao listar campanhas" },
      { status: 500 }
    );
  }
}

// POST - Criar e enviar campanha
export async function POST(req: NextRequest) {
  try {
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const {
      name,
      subject,
      html_content,
      recipient_type, // 'all_leads', 'customers', 'custom'
      custom_emails,
      schedule_at,
    } = await req.json();

    // Validações
    if (!name || !subject || !html_content || !recipient_type) {
      return NextResponse.json(
        { error: "Campos obrigatórios em falta" },
        { status: 400 }
      );
    }

    // Buscar destinatários
    let recipients: string[] = [];

    if (recipient_type === "all_leads") {
      const { data: leads } = await supabase.from("leads").select("email");
      recipients = leads?.map((l) => l.email) || [];
    } else if (recipient_type === "customers") {
      const { data: payments } = await supabase
        .from("payments")
        .select("email")
        .eq("status", "succeeded");
      recipients = Array.from(new Set(payments?.map((p) => p.email) || []));
    } else if (recipient_type === "custom" && custom_emails) {
      recipients = custom_emails.split(",").map((e: string) => e.trim());
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "Nenhum destinatário encontrado" },
        { status: 400 }
      );
    }

    // Criar campanha na BD
    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .insert({
        name,
        subject,
        html_content,
        recipient_type,
        recipients_count: recipients.length,
        status: schedule_at ? "scheduled" : "sending",
        scheduled_at: schedule_at || null,
        created_by: adminEmail,
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    // Enviar emails (se não estiver agendada)
    if (!schedule_at) {
      let sent = 0;
      let failed = 0;

      // Enviar em batches de 10
      const batchSize = 10;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        const results = await Promise.allSettled(
          batch.map((to) =>
            resend.emails.send({
              from: "Portal Lusitano <noreply@portal-lusitano.pt>",
              to,
              subject,
              html: html_content,
            })
          )
        );

        sent += results.filter((r) => r.status === "fulfilled").length;
        failed += results.filter((r) => r.status === "rejected").length;
      }

      // Atualizar campanha
      await supabase
        .from("email_campaigns")
        .update({
          status: "sent",
          sent_count: sent,
          failed_count: failed,
          sent_at: new Date().toISOString(),
        })
        .eq("id", campaign.id);

      return NextResponse.json({
        campaign: { ...campaign, sent_count: sent, failed_count: failed },
        message: `Campanha enviada para ${sent} destinatários`,
      });
    }

    return NextResponse.json({
      campaign,
      message: "Campanha agendada com sucesso",
    });
  } catch (error: any) {
    console.error("Campaign creation error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar campanha" },
      { status: 500 }
    );
  }
}
