import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Definir cores do Portal Lusitano
const COLORS = {
  gold: "#C5A059",
  dark: "#050505",
  darkGray: "#1a1a1a",
  lightGray: "#666666",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.white,
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottom: `2pt solid ${COLORS.gold}`,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.lightGray,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 12,
    borderLeft: `3pt solid ${COLORS.gold}`,
    paddingLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  kpiCard: {
    width: "48%",
    backgroundColor: COLORS.darkGray,
    padding: 15,
    borderRadius: 4,
  },
  kpiLabel: {
    fontSize: 10,
    color: COLORS.lightGray,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.gold,
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1pt solid ${COLORS.lightGray}`,
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: COLORS.darkGray,
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.white,
    textTransform: "uppercase",
  },
  tableCell: {
    fontSize: 10,
    color: COLORS.dark,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: COLORS.lightGray,
    borderTop: `1pt solid ${COLORS.lightGray}`,
    paddingTop: 10,
  },
  highlight: {
    backgroundColor: "#FFF9E6",
    padding: 15,
    borderLeft: `3pt solid ${COLORS.gold}`,
    marginBottom: 15,
  },
  highlightText: {
    fontSize: 12,
    color: COLORS.dark,
  },
});

interface ReportData {
  period: {
    month: string;
    year: number;
  };
  financial: {
    totalRevenue: number;
    revenueThisMonth: number;
    mrr: number;
    averageTicket: number;
    transactionCount: number;
    revenueByProduct: {
      cavalo_anuncio: number;
      instagram: number;
      publicidade: number;
    };
  };
  topHorses: Array<{
    name: string;
    views: number;
  }>;
  leads: {
    total: number;
    bySource: Record<string, number>;
  };
  roi: Array<{
    source: string;
    revenue: number;
    leads: number;
    roi: number;
  }>;
}

export const MonthlyReportPDF = ({ data }: { data: ReportData }) => {
  const { period, financial, topHorses, leads, roi } = data;

  // Formatar moeda
  const formatCurrency = (cents: number) => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  // Formatar número
  const formatNumber = (num: number) => {
    return num.toLocaleString("pt-PT");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Portal Lusitano</Text>
          <Text style={styles.subtitle}>
            Relatório Mensal — {period.month} {period.year}
          </Text>
        </View>

        {/* RESUMO EXECUTIVO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Resumo Executivo</Text>
          <View style={styles.row}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Receita Total</Text>
              <Text style={styles.kpiValue}>{formatCurrency(financial.totalRevenue)}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Receita Este Mês</Text>
              <Text style={styles.kpiValue}>{formatCurrency(financial.revenueThisMonth)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>MRR</Text>
              <Text style={styles.kpiValue}>{formatCurrency(financial.mrr)}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Ticket Médio</Text>
              <Text style={styles.kpiValue}>{formatCurrency(financial.averageTicket)}</Text>
            </View>
          </View>
        </View>

        {/* RECEITAS POR PRODUTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Receitas por Produto</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderText, { width: "60%" }]}>Produto</Text>
              <Text style={[styles.tableHeaderText, { width: "40%" }]}>Receita</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "60%" }]}>Anúncios de Cavalos</Text>
              <Text style={[styles.tableCell, { width: "40%" }]}>
                {formatCurrency(financial.revenueByProduct.cavalo_anuncio)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "60%" }]}>Instagram Marketing</Text>
              <Text style={[styles.tableCell, { width: "40%" }]}>
                {formatCurrency(financial.revenueByProduct.instagram)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "60%" }]}>Publicidade</Text>
              <Text style={[styles.tableCell, { width: "40%" }]}>
                {formatCurrency(financial.revenueByProduct.publicidade)}
              </Text>
            </View>
          </View>
        </View>

        {/* TOP CAVALOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Top 5 Cavalos Mais Vistos</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderText, { width: "70%" }]}>Nome</Text>
              <Text style={[styles.tableHeaderText, { width: "30%" }]}>Visualizações</Text>
            </View>
            {topHorses.map((horse, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "70%" }]}>{horse.name}</Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  {formatNumber(horse.views)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ANÁLISE DE LEADS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📧 Análise de Leads</Text>
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>Total de Leads: {formatNumber(leads.total)}</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderText, { width: "60%" }]}>Fonte</Text>
              <Text style={[styles.tableHeaderText, { width: "40%" }]}>Leads</Text>
            </View>
            {Object.entries(leads.bySource)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([source, count], index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: "60%" }]}>{source || "Direto"}</Text>
                  <Text style={[styles.tableCell, { width: "40%" }]}>{formatNumber(count)}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* ROI POR CANAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 ROI por Canal de Marketing</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderText, { width: "40%" }]}>Canal</Text>
              <Text style={[styles.tableHeaderText, { width: "30%" }]}>Receita</Text>
              <Text style={[styles.tableHeaderText, { width: "30%" }]}>ROI</Text>
            </View>
            {roi.slice(0, 5).map((channel, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "40%" }]}>
                  {channel.source || "Direto"}
                </Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  €{channel.revenue.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>{channel.roi.toFixed(0)}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            Relatório gerado automaticamente em {new Date().toLocaleDateString("pt-PT")} | Portal
            Lusitano © {new Date().getFullYear()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
