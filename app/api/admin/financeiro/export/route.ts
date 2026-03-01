import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { sanitizeSearchInput } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;

    // Parâmetros de filtro (mesmos da API de transactions)
    const productType = searchParams.get("product_type");
    const status = searchParams.get("status");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const search = searchParams.get("search");

    // Construir query (sem paginação, todos os resultados)
    let query = supabase.from("payments").select("*").order("created_at", { ascending: false });

    // Aplicar filtros
    if (productType && productType !== "all") {
      query = query.eq("product_type", productType);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (startDate) {
      query = query.gte("created_at", `${startDate}T00:00:00`);
    }

    if (endDate) {
      query = query.lte("created_at", `${endDate}T23:59:59`);
    }

    if (search) {
      const safeSearch = sanitizeSearchInput(search);
      if (safeSearch) {
        query = query.or(
          `email.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%,stripe_payment_intent_id.ilike.%${safeSearch}%`
        );
      }
    }

    const { data: transactions, error } = await query;

    if (error) throw error;

    // Sanitizar células CSV contra formula injection (CWE-1236)
    function csvSafeCell(val: string): string {
      const escaped = val.replace(/"/g, '""');
      if (/^[=+\-@\t\r]/.test(escaped)) {
        return `"'${escaped}"`;
      }
      return `"${escaped}"`;
    }

    // Gerar CSV
    const csvRows: string[] = [];

    // Cabeçalho
    const headers = [
      "Data",
      "Email",
      "Tipo de Produto",
      "Valor (€)",
      "Moeda",
      "Status",
      "Descrição",
      "Stripe Payment ID",
      "Stripe Session ID",
    ];
    csvRows.push(headers.join(","));

    // Dados
    transactions?.forEach((transaction) => {
      const productLabels: Record<string, string> = {
        cavalo_anuncio: "Anúncio de Cavalo",
        instagram_ad: "Instagram",
        publicidade: "Publicidade",
      };

      const statusLabels: Record<string, string> = {
        succeeded: "Sucesso",
        pending: "Pendente",
        failed: "Falhado",
      };

      const row = [
        csvSafeCell(new Date(transaction.created_at).toLocaleString("pt-PT")),
        csvSafeCell(transaction.email || ""),
        csvSafeCell(productLabels[transaction.product_type || ""] || "Outros"),
        (transaction.amount / 100).toFixed(2),
        transaction.currency?.toUpperCase() || "EUR",
        csvSafeCell(statusLabels[transaction.status] || transaction.status),
        csvSafeCell(transaction.description || ""),
        csvSafeCell(transaction.stripe_payment_intent_id || ""),
        csvSafeCell(transaction.stripe_session_id || ""),
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");

    // Retornar CSV com headers apropriados
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="transacoes_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    logger.error("CSV export error:", error);
    return NextResponse.json({ error: "Erro ao exportar CSV" }, { status: 500 });
  }
}
