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
