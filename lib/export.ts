// Utilitários para exportação de dados

export type ExportFormat = "csv" | "json" | "excel";

export interface ExportOptions {
  filename?: string;
  columns?: string[];
  headers?: Record<string, string>;
}

/**
 * Exportar dados para CSV
 */
export function exportToCSV(data: Record<string, unknown>[], options: ExportOptions = {}) {
  const {
    filename = `export_${Date.now()}`,
    columns,
    headers = {},
  } = options;

  if (data.length === 0) {
    throw new Error("Sem dados para exportar");
  }

  // Determinar colunas
  const cols = columns || Object.keys(data[0]);

  // Headers (usar custom ou nomes das colunas)
  const headerRow = cols.map((col) => headers[col] || col).join(",");

  // Dados
  const dataRows = data.map((item) => {
    return cols
      .map((col) => {
        let value = item[col];

        // Tratar valores especiais
        if (value === null || value === undefined) return "";
        if (typeof value === "object") value = JSON.stringify(value);
        if (typeof value === "string" && value.includes(",")) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      })
      .join(",");
  });

  const csv = [headerRow, ...dataRows].join("\n");

  // Download
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

/**
 * Exportar dados para JSON
 */
export function exportToJSON(data: Record<string, unknown>[], options: ExportOptions = {}) {
  const { filename = `export_${Date.now()}` } = options;

  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
  link.click();
}

/**
 * Exportar para Excel (formato básico usando CSV com BOM)
 * Para Excel real, usaria biblioteca como xlsx
 */
export function exportToExcel(data: Record<string, unknown>[], options: ExportOptions = {}) {
  // Por agora, usar CSV com BOM UTF-8 que o Excel reconhece
  exportToCSV(data, { ...options, filename: options.filename || `export_${Date.now()}` });
}
