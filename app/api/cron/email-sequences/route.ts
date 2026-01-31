import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  sendDay2Email,
  sendDay4Email,
  sendDay7Email,
  sendDay10Email,
  sendDay14Email,
  EMAIL_SEQUENCE_CONFIG,
} from "@/lib/email-sequences";

/**
 * CRON JOB: Process Email Sequences
 *
 * Este endpoint deve ser chamado diariamente via:
 * - Vercel Cron (vercel.json)
 * - GitHub Actions
 * - External cron service (EasyCron, cron-job.org)
 *
 * Configurar em vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/email-sequences",
 *     "schedule": "0 9 * * *"
 *   }]
 * }
 *
 * Segurança: Verificar CRON_SECRET header
 */

export async function GET(request: NextRequest) {
  // Verify cron secret (security)
  const cronSecret = request.headers.get("x-cron-secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && cronSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = {
      processed: 0,
      day2Sent: 0,
      day4Sent: 0,
      day7Sent: 0,
      day10Sent: 0,
      day14Sent: 0,
      errors: [] as string[],
    };

    // Get all active leads that need emails
    const { data: leads, error: fetchError } = await supabase
      .from("leads")
      .select("*")
      .eq("status", "active")
      .eq("converted_to_pro", false)
      .lt("sequence_step", 14);

    if (fetchError) {
      console.error("Failed to fetch leads:", fetchError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({
        message: "No leads to process",
        results,
      });
    }

    const now = new Date();

    for (const lead of leads) {
      try {
        const createdAt = new Date(lead.created_at);
        const daysSinceSubscription = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        const currentStep = lead.sequence_step || 0;
        let newStep = currentStep;
        let emailSent = false;

        // Check which email to send based on days and current step
        if (
          daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_2 &&
          currentStep < 2
        ) {
          const result = await sendDay2Email({
            email: lead.email,
            name: lead.name,
            subscribed_at: lead.created_at,
          });
          if (result.success) {
            newStep = 2;
            emailSent = true;
            results.day2Sent++;
          }
        } else if (
          daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_4 &&
          currentStep < 4
        ) {
          const result = await sendDay4Email({
            email: lead.email,
            name: lead.name,
            subscribed_at: lead.created_at,
          });
          if (result.success) {
            newStep = 4;
            emailSent = true;
            results.day4Sent++;
          }
        } else if (
          daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_7 &&
          currentStep < 7
        ) {
          const result = await sendDay7Email({
            email: lead.email,
            name: lead.name,
            subscribed_at: lead.created_at,
          });
          if (result.success) {
            newStep = 7;
            emailSent = true;
            results.day7Sent++;
          }
        } else if (
          daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_10 &&
          currentStep < 10
        ) {
          const result = await sendDay10Email({
            email: lead.email,
            name: lead.name,
            subscribed_at: lead.created_at,
          });
          if (result.success) {
            newStep = 10;
            emailSent = true;
            results.day10Sent++;
          }
        } else if (
          daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_14 &&
          currentStep < 14
        ) {
          const result = await sendDay14Email({
            email: lead.email,
            name: lead.name,
            subscribed_at: lead.created_at,
          });
          if (result.success) {
            newStep = 14;
            emailSent = true;
            results.day14Sent++;
          }
        }

        // Update lead in database
        if (emailSent) {
          await supabase
            .from("leads")
            .update({
              sequence_step: newStep,
              last_email_sent_at: new Date().toISOString(),
            })
            .eq("id", lead.id);

          results.processed++;
        }
      } catch (error) {
        console.error(`Error processing lead ${lead.email}:`, error);
        results.errors.push(lead.email);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} leads`,
      results,
    });
  } catch (error) {
    console.error("Error in email sequence cron:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also allow POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
