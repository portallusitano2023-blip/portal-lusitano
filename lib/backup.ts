import { supabase } from "./supabase";
import { sendEmail } from "./resend";
import { logger } from "@/lib/logger";

// Tabelas chave para backup
const BACKUP_TABLES = [
  "leads",
  "cavalos_venda",
  "eventos",
  "coudelarias",
  "reviews",
  "contact_submissions",
  "payments",
  "admin_tasks",
  "admin_settings",
  "email_campaigns",
] as const;

export interface BackupResult {
  timestamp: string;
  tables: Record<string, { count: number; data: unknown[] }>;
  totalRecords: number;
}

/**
 * Exporta todas as tabelas chave do Supabase
 */
export async function exportAllTables(): Promise<BackupResult> {
  const timestamp = new Date().toISOString();
  const tables: Record<string, { count: number; data: unknown[] }> = {};
  let totalRecords = 0;

  for (const tableName of BACKUP_TABLES) {
    try {
      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        logger.warn(`Aviso: Tabela ${tableName} não encontrada ou erro: ${error.message}`);
        tables[tableName] = { count: 0, data: [] };
        continue;
      }

      tables[tableName] = {
        count: data?.length || 0,
        data: data || [],
      };
      totalRecords += data?.length || 0;
    } catch {
      logger.warn(`Erro ao exportar tabela ${tableName}`);
      tables[tableName] = { count: 0, data: [] };
    }
  }

  return { timestamp, tables, totalRecords };
}

/**
 * Gera o nome do ficheiro de backup
 */
export function getBackupFileName(): string {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toTimeString().split(" ")[0].replace(/:/g, "-");
  return `backup-portal-lusitano-${date}-${time}.json`;
}

/**
 * Envia backup por email
 */
export async function sendBackupByEmail(
  email: string,
  backup: BackupResult
): Promise<{ success: boolean; error?: unknown }> {
  const tablesSummary = Object.entries(backup.tables)
    .map(([name, { count }]) => `<li><strong>${name}</strong>: ${count} registos</li>`)
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #C5A059, #8B6914); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .stats { background: #fff; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #eee; }
        ul { padding-left: 20px; }
        li { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Backup Portal Lusitano</h2>
          <p>${new Date(backup.timestamp).toLocaleString("pt-PT")}</p>
        </div>
        <div class="content">
          <div class="stats">
            <h3>Resumo do Backup</h3>
            <p><strong>Total de registos:</strong> ${backup.totalRecords}</p>
            <p><strong>Tabelas exportadas:</strong> ${Object.keys(backup.tables).length}</p>
          </div>
          <h3>Detalhes por Tabela</h3>
          <ul>${tablesSummary}</ul>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            O ficheiro JSON do backup está em anexo a este email.<br/>
            Nota: Se o backup for demasiado grande, descarregue directamente pelo admin.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Backup Portal Lusitano - ${new Date(backup.timestamp).toLocaleDateString("pt-PT")}`,
    html,
  });
}
