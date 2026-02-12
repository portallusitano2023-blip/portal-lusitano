import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { exportAllTables, getBackupFileName, sendBackupByEmail } from "@/lib/backup";
import { logger } from "@/lib/logger";

export async function GET() {
  const email = await verifySession();
  if (!email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const backup = await exportAllTables();
    const fileName = getBackupFileName();
    const jsonContent = JSON.stringify(backup, null, 2);

    return new NextResponse(jsonContent, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    logger.error("Erro ao gerar backup:", error);
    return NextResponse.json({ error: "Erro ao gerar backup" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sessionEmail = await verifySession();
  if (!sessionEmail) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL;
    const targetEmail = body.email || sessionEmail;

    // Restringir envio apenas para o email do admin ou o email da sessão
    if (targetEmail !== sessionEmail && targetEmail !== adminEmail) {
      return NextResponse.json(
        { error: "Backup só pode ser enviado para o email do administrador" },
        { status: 403 }
      );
    }

    const backup = await exportAllTables();
    const result = await sendBackupByEmail(targetEmail, backup);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Backup enviado para ${targetEmail}`,
        totalRecords: backup.totalRecords,
      });
    } else {
      return NextResponse.json({ error: "Erro ao enviar email de backup" }, { status: 500 });
    }
  } catch (error) {
    logger.error("Erro ao enviar backup por email:", error);
    return NextResponse.json({ error: "Erro ao enviar backup por email" }, { status: 500 });
  }
}
