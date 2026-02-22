import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

/**
 * GET /api/admin/me
 * Returns the current admin user's email from session
 */
export async function GET() {
  try {
    const email = await verifySession();

    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ email });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
