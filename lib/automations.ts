import { supabase } from "./supabase";

/**
 * Trigger automations based on event type
 * Call this function whenever an event occurs that might trigger automations
 */
export async function triggerAutomations(
  triggerType: string,
  triggerData: Record<string, unknown> = {}
) {
  try {
    // Find all enabled automations matching this trigger type
    const { data: automations, error } = await supabase
      .from("admin_automations")
      .select("*")
      .eq("trigger_type", triggerType)
      .eq("enabled", true);

    if (error) {
      console.error("Error fetching automations:", error);
      return;
    }

    if (!automations || automations.length === 0) {
      return; // No automations to trigger
    }

    // Execute each automation
    for (const automation of automations) {
      // Check if trigger conditions match
      if (!checkTriggerConditions(automation.trigger_conditions, triggerData)) {
        continue;
      }

      // If there's a delay, schedule for later (in production you'd use a queue/cron)
      // For now, we execute immediately
      if (automation.delay_minutes > 0) {
        // TODO: Implement scheduled execution with a job queue
        // TODO: Implement scheduled execution with a job queue
        // For now, skip delayed automations
        continue;
      }

      // Execute automation
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/automations/execute`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              automation_id: automation.id,
              trigger_data: triggerData,
            }),
          }
        );

        if (!response.ok) {
          console.error(`Failed to execute automation ${automation.id}`);
        }
      } catch (execError) {
        console.error(`Error executing automation ${automation.id}:`, execError);
      }
    }
  } catch (error) {
    console.error("Error in triggerAutomations:", error);
  }
}

/**
 * Check if trigger conditions match the trigger data
 */
function checkTriggerConditions(
  conditions: Record<string, unknown>,
  triggerData: Record<string, unknown>
): boolean {
  if (!conditions || Object.keys(conditions).length === 0) {
    return true; // No conditions = always match
  }

  // Example condition checks
  for (const [key, value] of Object.entries(conditions)) {
    if (key === "amount_min" && triggerData.amount) {
      if (triggerData.amount < Number(value)) return false;
    }
    if (key === "amount_max" && triggerData.amount) {
      if (triggerData.amount > Number(value)) return false;
    }
    if (key === "email_contains" && triggerData.email) {
      if (!triggerData.email.includes(value as string)) return false;
    }
    // Add more condition checks as needed
  }

  return true;
}

/**
 * Example usage in your API routes:
 *
 * // When a new lead is created:
 * await triggerAutomations("lead_created", {
 *   email: lead.email,
 *   name: lead.name,
 *   lead_id: lead.id,
 * });
 *
 * // When a payment succeeds:
 * await triggerAutomations("payment_succeeded", {
 *   email: payment.email,
 *   amount: payment.amount,
 *   payment_id: payment.id,
 * });
 *
 * // When a review is submitted:
 * await triggerAutomations("review_submitted", {
 *   review_id: review.id,
 *   rating: review.rating,
 * });
 *
 * // When a cavalo is created:
 * await triggerAutomations("cavalo_created", {
 *   cavalo_id: cavalo.id,
 *   name: cavalo.nome,
 * });
 */
