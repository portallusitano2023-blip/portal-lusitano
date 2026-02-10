import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RevenueData {
  date: string;
  transactions: number;
  revenue: number;
  product_type?: string;
}

interface AnalyticsData {
  period: string;
  leads: number;
  customers: number;
  revenue: number;
}

export async function generateRevenueReport(data: RevenueData[], period: string) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(197, 160, 89); // #C5A059
  doc.text("Portal Lusitano", 14, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Relatório de Receitas", 14, 32);

  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Período: ${period}`, 14, 40);
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-PT")}`, 14, 46);

  // Summary
  const totalRevenue = data.reduce((sum, row) => sum + row.revenue, 0);
  const totalTransactions = data.reduce((sum, row) => sum + row.transactions, 0);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `Total de Receitas: €${(totalRevenue / 100).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`,
    14,
    56
  );
  doc.text(`Total de Transações: ${totalTransactions}`, 14, 64);

  // Table
  autoTable(doc, {
    startY: 72,
    head: [["Data", "Transações", "Receita (€)"]],
    body: data.map((row) => [
      row.date,
      row.transactions.toString(),
      (row.revenue / 100).toLocaleString("pt-PT", { minimumFractionDigits: 2 }),
    ]),
    headStyles: {
      fillColor: [197, 160, 89],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Portal Lusitano - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Download
  doc.save(`receitas_${period.replace(/\s/g, "_")}_${Date.now()}.pdf`);
}

export async function generateAnalyticsReport(data: AnalyticsData[], title: string) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(197, 160, 89);
  doc.text("Portal Lusitano", 14, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, 32);

  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-PT")}`, 14, 40);

  // Summary Stats
  const totalLeads = data.reduce((sum, row) => sum + row.leads, 0);
  const totalCustomers = data.reduce((sum, row) => sum + row.customers, 0);
  const totalRevenue = data.reduce((sum, row) => sum + row.revenue, 0);
  const conversionRate = totalLeads > 0 ? (totalCustomers / totalLeads) * 100 : 0;

  doc.setFontSize(12);
  doc.text(`Total Leads: ${totalLeads}`, 14, 52);
  doc.text(`Total Clientes: ${totalCustomers}`, 14, 60);
  doc.text(`Taxa de Conversão: ${conversionRate.toFixed(1)}%`, 14, 68);
  doc.text(`Receita Total: €${(totalRevenue / 100).toLocaleString("pt-PT")}`, 14, 76);

  // Table
  autoTable(doc, {
    startY: 86,
    head: [["Período", "Leads", "Clientes", "Receita (€)", "Conv. %"]],
    body: data.map((row) => [
      row.period,
      row.leads.toString(),
      row.customers.toString(),
      (row.revenue / 100).toLocaleString("pt-PT"),
      row.leads > 0 ? `${((row.customers / row.leads) * 100).toFixed(1)}%` : "0%",
    ]),
    headStyles: {
      fillColor: [197, 160, 89],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Portal Lusitano - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  doc.save(`analytics_${Date.now()}.pdf`);
}

export async function generateCustomReport(
  title: string,
  subtitle: string,
  data: Record<string, unknown>[],
  columns: { header: string; dataKey: string; format?: (val: unknown) => string }[]
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(197, 160, 89);
  doc.text("Portal Lusitano", 14, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, 32);

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(subtitle, 14, 40);
  }

  // Table
  autoTable(doc, {
    startY: subtitle ? 48 : 40,
    head: [columns.map((col) => col.header)],
    body: data.map((row) =>
      columns.map((col) => {
        const value = row[col.dataKey];
        return col.format ? col.format(value) : String(value);
      })
    ),
    headStyles: {
      fillColor: [197, 160, 89],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Portal Lusitano - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  doc.save(`relatorio_${Date.now()}.pdf`);
}

// ================================================================
// HTML-based report generation (printable via window.print())
// ================================================================

/**
 * Shared inline-styled HTML wrapper with Portal Lusitano dark-theme branding.
 * Opens a new window and triggers print when ready.
 */
function openPrintableReport(title: string, bodyHTML: string): void {
  const html = `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} - Portal Lusitano</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Montserrat', Arial, sans-serif;
    background: #050505;
    color: #fff;
    padding: 40px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .header {
    border-bottom: 2px solid #C5A059;
    padding-bottom: 20px;
    margin-bottom: 32px;
  }
  .header h1 {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 28px;
    color: #C5A059;
    margin-bottom: 4px;
  }
  .header h2 {
    font-size: 18px;
    color: #fff;
    font-weight: 600;
  }
  .header .meta {
    font-size: 12px;
    color: #888;
    margin-top: 8px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .summary-card {
    background: #0A0A0A;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 16px;
  }
  .summary-card .label {
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
  .summary-card .value {
    font-size: 22px;
    font-weight: 700;
    color: #C5A059;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
  }
  thead th {
    background: #C5A059;
    color: #000;
    padding: 10px 12px;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  tbody td {
    padding: 10px 12px;
    font-size: 13px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    color: #ddd;
  }
  tbody tr:nth-child(even) {
    background: rgba(255,255,255,0.03);
  }

  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 11px;
    color: #666;
    text-align: center;
  }

  @media print {
    body { padding: 20px; background: #050505; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
${bodyHTML}
<div class="footer">
  Portal Lusitano &middot; Relatorio gerado em ${new Date().toLocaleString("pt-PT")}
</div>
<script>
  window.onload = function() {
    // Small delay to let fonts load, then trigger print
    setTimeout(function() { window.print(); }, 600);
  };
</script>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

// -------------------------------------------------------
// Financial Report
// -------------------------------------------------------

interface FinancialReportData {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{ name: string; revenue: number; quantity: number }>;
}

export function generateFinancialReportHTML(data: FinancialReportData): string {
  const fmt = (cents: number) =>
    `€${(cents / 100).toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const body = `
<div class="header">
  <h1>Portal Lusitano</h1>
  <h2>Relatorio Financeiro</h2>
  <p class="meta">Periodo: ${data.period}</p>
</div>

<div class="summary-grid">
  <div class="summary-card">
    <div class="label">Receita Total</div>
    <div class="value">${fmt(data.totalRevenue)}</div>
  </div>
  <div class="summary-card">
    <div class="label">Total Encomendas</div>
    <div class="value">${data.totalOrders.toLocaleString("pt-PT")}</div>
  </div>
  <div class="summary-card">
    <div class="label">Valor Medio</div>
    <div class="value">${fmt(data.averageOrderValue)}</div>
  </div>
</div>

<h3 class="section-title">Top Produtos</h3>
<table>
  <thead>
    <tr>
      <th>Produto</th>
      <th>Receita</th>
      <th>Quantidade</th>
    </tr>
  </thead>
  <tbody>
    ${data.topProducts
      .map(
        (p) => `
    <tr>
      <td>${p.name}</td>
      <td>${fmt(p.revenue)}</td>
      <td>${p.quantity}</td>
    </tr>`
      )
      .join("")}
  </tbody>
</table>
`;

  openPrintableReport("Relatorio Financeiro", body);
  return body;
}

// -------------------------------------------------------
// Analytics Report
// -------------------------------------------------------

interface AnalyticsReportDataHTML {
  period: string;
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  topPages: Array<{ path: string; views: number }>;
  conversionRate: number;
}

export function generateAnalyticsReportHTML(data: AnalyticsReportDataHTML): string {
  const body = `
<div class="header">
  <h1>Portal Lusitano</h1>
  <h2>Relatorio de Analytics</h2>
  <p class="meta">Periodo: ${data.period}</p>
</div>

<div class="summary-grid">
  <div class="summary-card">
    <div class="label">Visitas Totais</div>
    <div class="value">${data.totalVisits.toLocaleString("pt-PT")}</div>
  </div>
  <div class="summary-card">
    <div class="label">Visitantes Unicos</div>
    <div class="value">${data.uniqueVisitors.toLocaleString("pt-PT")}</div>
  </div>
  <div class="summary-card">
    <div class="label">Page Views</div>
    <div class="value">${data.pageViews.toLocaleString("pt-PT")}</div>
  </div>
  <div class="summary-card">
    <div class="label">Taxa de Conversao</div>
    <div class="value">${data.conversionRate.toFixed(1)}%</div>
  </div>
</div>

<h3 class="section-title">Paginas Mais Visitadas</h3>
<table>
  <thead>
    <tr>
      <th>Pagina</th>
      <th>Visualizacoes</th>
      <th>% do Total</th>
    </tr>
  </thead>
  <tbody>
    ${data.topPages
      .map(
        (p) => `
    <tr>
      <td>${p.path}</td>
      <td>${p.views.toLocaleString("pt-PT")}</td>
      <td>${data.pageViews > 0 ? ((p.views / data.pageViews) * 100).toFixed(1) : "0.0"}%</td>
    </tr>`
      )
      .join("")}
  </tbody>
</table>
`;

  openPrintableReport("Relatorio de Analytics", body);
  return body;
}
