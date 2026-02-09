import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

interface DiagnosticoCheck {
  status: string;
  message?: string;
  email?: string | null;
  error?: unknown;
  total_registos?: number;
  [key: string]: unknown;
}

export async function GET(req: NextRequest) {
  const diagnostico: {
    timestamp: string;
    checks: Record<string, DiagnosticoCheck>;
    resumo?: { total: number; ok: number; falhas: number; status: string };
  } = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // 1. VERIFICAR AUTENTICAÇÃO
  try {
    const email = await verifySession();
    diagnostico.checks.autenticacao = {
      status: email ? "✅ OK" : "❌ FALHOU",
      email: email || null,
      message: email ? "Sessão válida" : "Sem sessão - precisa fazer login",
    };
  } catch (error) {
    diagnostico.checks.autenticacao = {
      status: "❌ ERRO",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }

  // 2. VERIFICAR CONEXÃO SUPABASE
  try {
    const { data, error } = await supabase.from("payments").select("id").limit(1);

    diagnostico.checks.supabase_conexao = {
      status: error ? "❌ ERRO" : "✅ OK",
      message: error ? error.message : "Conexão com Supabase OK",
      error: error || null,
    };
  } catch (error) {
    diagnostico.checks.supabase_conexao = {
      status: "❌ ERRO",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }

  // 3. VERIFICAR TABELA payments
  try {
    const { data, error, count } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true });

    diagnostico.checks.tabela_payments = {
      status: error ? "❌ NÃO EXISTE ou SEM PERMISSÃO" : "✅ EXISTE",
      total_registos: count || 0,
      error: error || null,
    };
  } catch (error) {
    diagnostico.checks.tabela_payments = {
      status: "❌ ERRO",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }

  // 4. VERIFICAR TABELA contact_submissions
  try {
    const { data, error, count } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true });

    diagnostico.checks.tabela_contact_submissions = {
      status: error ? "❌ NÃO EXISTE ou SEM PERMISSÃO" : "✅ EXISTE",
      total_registos: count || 0,
      error: error || null,
    };
  } catch (error) {
    diagnostico.checks.tabela_contact_submissions = {
      status: "❌ ERRO",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }

  // 5. VERIFICAR TABELA leads
  try {
    const { data, error, count } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    diagnostico.checks.tabela_leads = {
      status: error ? "❌ NÃO EXISTE ou SEM PERMISSÃO" : "✅ EXISTE",
      total_registos: count || 0,
      error: error || null,
    };
  } catch (error) {
    diagnostico.checks.tabela_leads = {
      status: "❌ ERRO",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }

  // 6. VERIFICAR VARIÁVEIS DE AMBIENTE
  diagnostico.checks.variaveis_ambiente = {
    status: [
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_PASSWORD,
      process.env.ADMIN_SECRET,
    ].every(Boolean)
      ? "✅ OK"
      : "⚠️ INCOMPLETO",
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "✅ Definida"
      : "❌ Não definida",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "✅ Definida" : "❌ Não definida",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "✅ Definida" : "❌ Não definida",
    ADMIN_SECRET: process.env.ADMIN_SECRET ? "✅ Definida" : "❌ Não definida",
  };

  // 7. RESUMO
  const totalChecks = Object.keys(diagnostico.checks).length;
  const checksOK = Object.values(diagnostico.checks).filter(
    (check: { status?: string }) => typeof check === "object" && check.status?.includes("✅")
  ).length;

  diagnostico.resumo = {
    total: totalChecks,
    ok: checksOK,
    falhas: totalChecks - checksOK,
    status: checksOK === totalChecks ? "✅ TUDO OK" : "⚠️ ALGUNS PROBLEMAS",
  };

  return NextResponse.json(diagnostico, { status: 200 });
}
