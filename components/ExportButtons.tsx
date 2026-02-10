"use client";

import { Download, FileText, FileJson, FileSpreadsheet } from "lucide-react";
import {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  ExportFormat,
  ExportOptions,
} from "@/lib/export";
import type { LucideIcon } from "lucide-react";

interface ExportButtonProps {
  data: Record<string, unknown>[];
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

  const _Icon = getIcon();

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
  data: Record<string, unknown>[];
  filename?: string;
  columns?: string[];
  headers?: Record<string, string>;
}

export function ExportMenu({ data, filename, columns, headers }: ExportMenuProps) {
  const formats: { format: ExportFormat; label: string; icon: LucideIcon }[] = [
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
