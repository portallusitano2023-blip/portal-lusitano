// Utilitários para exportação de dados

export type ExportFormat = "csv" | "json" | "excel";

interface ExportOptions {
  filename?: string;
  columns?: string[];
  headers?: Record<string, string>;
}

/**
 * Exportar dados para CSV
 */
export function exportToCSV(data: any[], options: ExportOptions = {}) {
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
export function exportToJSON(data: any[], options: ExportOptions = {}) {
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
export function exportToExcel(data: any[], options: ExportOptions = {}) {
  // Por agora, usar CSV com BOM UTF-8 que o Excel reconhece
  exportToCSV(data, { ...options, filename: options.filename || `export_${Date.now()}` });
}

/**
 * Componente React para botão de exportação
 */
import { Download, FileText, FileJson, FileSpreadsheet } from "lucide-react";

interface ExportButtonProps {
  data: any[];
  filename?: string;
  format?: ExportFormat;
  columns?: string[];
  headers?: Record<string, string>;
  label?: string;
  className?: string;
}

export function ExportButton({
  data,
  filename,
  format = "csv",
  columns,
  headers,
  label,
  className = "",
}: ExportButtonProps) {
  const handleExport = () => {
    const options: ExportOptions = { filename, columns, headers };

    switch (format) {
      case "csv":
        exportToCSV(data, options);
        break;
      case "json":
        exportToJSON(data, options);
        break;
      case "excel":
        exportToExcel(data, options);
        break;
    }
  };

  const getIcon = () => {
    switch (format) {
      case "json":
        return FileJson;
      case "excel":
        return FileSpreadsheet;
      default:
        return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className={`
        flex items-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#d4b469]
        text-black font-semibold rounded-lg transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <Download className="w-4 h-4" />
      {label || `Exportar ${format.toUpperCase()}`}
    </button>
  );
}

/**
 * Menu dropdown com múltiplos formatos
 */
interface ExportMenuProps {
  data: any[];
  filename?: string;
  columns?: string[];
  headers?: Record<string, string>;
}

export function ExportMenu({ data, filename, columns, headers }: ExportMenuProps) {
  const formats: { format: ExportFormat; label: string; icon: any }[] = [
    { format: "csv", label: "CSV", icon: FileText },
    { format: "excel", label: "Excel", icon: FileSpreadsheet },
    { format: "json", label: "JSON", icon: FileJson },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#d4b469] text-black font-semibold rounded-lg transition-all">
        <Download className="w-4 h-4" />
        Exportar
      </button>

      <div className="absolute right-0 top-full mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {formats.map(({ format, label, icon: Icon }) => (
          <button
            key={format}
            onClick={() => {
              const options: ExportOptions = { filename, columns, headers };
              if (format === "csv") exportToCSV(data, options);
              else if (format === "json") exportToJSON(data, options);
              else if (format === "excel") exportToExcel(data, options);
            }}
            disabled={data.length === 0}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg"
          >
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm font-medium">Exportar {label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
