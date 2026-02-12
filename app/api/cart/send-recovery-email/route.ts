import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import CartRecoveryEmail from "@/emails/CartRecoveryEmail";
import { logger } from "@/lib/logger";

interface AbandonedCart {
  id: string;
  email: string;
  emails_sent: number;
  cart_items: Array<{
    product_id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  cart_total: number;
  cart_quantity: number;
  recovery_url: string;
  last_email_sent_at: string | null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/cart/send-recovery-email
 *
 * Sends a cart recovery email to users who abandoned their carts.
 * Called by: Cron job (Vercel Cron or external scheduler)
 *
 * Body:
 * {
 *   cartId?: string (optional - send to specific cart)
 *   emailType?: string (default: 'first_reminder')
 * }
 *
 * If no cartId provided, processes all carts that need emails.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify auth (only admin or cron can call this)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { cartId } = body;

    let cartsToEmail: AbandonedCart[] = [];

    if (cartId) {
      // Send email for specific cart
      const { data, error } = await supabase
        .from("abandoned_carts")
        .select("*")
        .eq("id", cartId)
        .eq("recovered", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Cart not found or already recovered" }, { status: 404 });
      }

      cartsToEmail = [data as AbandonedCart];
    } else {
      // Find all carts that need recovery emails
      const { data, error } = await supabase
        .from("abandoned_carts")
        .select("*")
        .eq("recovered", false)
        .lt("emails_sent", 3) // Max 3 emails per cart
        .gt("expires_at", new Date().toISOString())
        .or(
          `last_email_sent_at.is.null,last_email_sent_at.lt.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`
        ) // At least 24h since last email
        .order("created_at", { ascending: true })
        .limit(50); // Process max 50 per run

      if (error) {
        logger.error("Error fetching carts:", error);
        return NextResponse.json({ error: "Failed to fetch abandoned carts" }, { status: 500 });
      }

      cartsToEmail = (data as AbandonedCart[]) || [];
    }

    if (cartsToEmail.length === 0) {
      return NextResponse.json({
        sent: 0,
        message: "No carts need recovery emails at this time",
      });
    }

    const results = [];

    for (const cart of cartsToEmail) {
      try {
        // Determine email type based on emails_sent count
        const actualEmailType =
          cart.emails_sent === 0
            ? "first_reminder"
            : cart.emails_sent === 1
              ? "second_reminder"
              : "final_offer";

        // Send email via Resend
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: "Portal Lusitano <noreply@portal-lusitano.pt>",
          to: cart.email,
          subject: getSubjectLine(actualEmailType, cart),
          react: CartRecoveryEmail({
            cartItems: cart.cart_items as {
              product_id: string;
              name: string;
              image: string;
              price: number;
              quantity: number;
            }[],
            cartTotal: cart.cart_total,
            recoveryUrl: cart.recovery_url,
            emailType: actualEmailType,
          }) as React.ReactElement,
          tags: [
            { name: "type", value: "cart_recovery" },
            { name: "email_type", value: actualEmailType },
          ],
        });

        if (emailError) {
          logger.error(`Failed to send email for cart ${cart.id}:`, emailError);
          results.push({ cartId: cart.id, success: false, error: emailError.message });
          continue;
        }

        // Log email sent
        await supabase.from("cart_recovery_emails").insert({
          abandoned_cart_id: cart.id,
          email_type: actualEmailType,
          recipient_email: cart.email,
          subject: getSubjectLine(actualEmailType, cart),
          resend_email_id: emailData?.id,
        });

        // Update cart
        await supabase
          .from("abandoned_carts")
          .update({
            emails_sent: cart.emails_sent + 1,
            last_email_sent_at: new Date().toISOString(),
          })
          .eq("id", cart.id);

        results.push({ cartId: cart.id, success: true, emailId: emailData?.id });
      } catch (error: unknown) {
        logger.error(`Error processing cart ${cart.id}:`, error);
        results.push({
          cartId: cart.id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      sent: successCount,
      failed: results.length - successCount,
      results,
    });
  } catch (error: unknown) {
    logger.error("Send recovery email error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

function getSubjectLine(emailType: string, cart: AbandonedCart): string {
  switch (emailType) {
    case "first_reminder":
      return "Esqueceu-se de algo? 🐴 O seu carrinho está à espera";
    case "second_reminder":
      return "Ainda está interessado? Complete a sua compra";
    case "final_offer":
      return `Última oportunidade! ${Math.round(cart.cart_total * 0.1)}€ de desconto no seu carrinho`;
    default:
      return "O seu carrinho está à espera";
  }
}
