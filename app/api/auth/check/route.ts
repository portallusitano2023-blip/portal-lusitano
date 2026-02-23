import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const email = await verifySession();

    if (!email) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json(
      { authenticated: true, email },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    logger.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
