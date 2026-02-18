import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// Mapeamento de cidades/localidades para distritos (simplificado)
const CITY_TO_DISTRICT: Record<string, string> = {
  // Norte
  "viana do castelo": "Viana do Castelo",
  braga: "Braga",
  porto: "Porto",
  "vila nova de gaia": "Porto",
  matosinhos: "Porto",
  "vila real": "Vila Real",
  bragança: "Bragança",

  // Centro
  aveiro: "Aveiro",
  coimbra: "Coimbra",
  viseu: "Viseu",
  guarda: "Guarda",
  "castelo branco": "Castelo Branco",
  leiria: "Leiria",
  santarém: "Santarém",

  // Lisboa e Vale do Tejo
  lisboa: "Lisboa",
  sintra: "Lisboa",
  cascais: "Lisboa",
  oeiras: "Lisboa",
  amadora: "Lisboa",
  loures: "Lisboa",
  odivelas: "Lisboa",
  "vila franca de xira": "Lisboa",
  setúbal: "Setúbal",
  portalegre: "Portalegre",

  // Alentejo
  évora: "Évora",
  beja: "Beja",

  // Algarve
  faro: "Faro",
  albufeira: "Faro",
  portimão: "Faro",
  lagos: "Faro",
  "vila real de santo antónio": "Faro",
  olhão: "Faro",
  tavira: "Faro",
};

// Extrair distrito de uma localidade
function extractDistrict(location: string | null): string | null {
  if (!location) return null;

  const normalized = location.toLowerCase().trim();

  // Procurar correspondência direta
  if (CITY_TO_DISTRICT[normalized]) {
    return CITY_TO_DISTRICT[normalized];
  }

  // Procurar se a localidade contém o nome de um distrito
  for (const [city, district] of Object.entries(CITY_TO_DISTRICT)) {
    if (normalized.includes(city) || city.includes(normalized)) {
      return district;
    }
  }

  return null;
}

// Todos os distritos de Portugal
const ALL_DISTRICTS = [
  "Viana do Castelo",
  "Braga",
  "Porto",
  "Vila Real",
  "Bragança",
  "Aveiro",
  "Viseu",
  "Guarda",
  "Coimbra",
  "Castelo Branco",
  "Leiria",
  "Santarém",
  "Lisboa",
  "Portalegre",
  "Évora",
  "Setúbal",
  "Beja",
  "Faro",
];

// GET - Buscar dados geográficos
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const metric = searchParams.get("metric") || "leads"; // 'leads', 'payments', 'customers'

    const districtCounts: Record<string, number> = {};

    // Inicializar todos os distritos com 0
    ALL_DISTRICTS.forEach((district) => {
      districtCounts[district] = 0;
    });

    if (metric === "leads") {
      // Contar leads por distrito
      const { data: leads } = await supabase.from("leads").select("location, email");

      if (leads) {
        leads.forEach((lead) => {
          const district = extractDistrict(lead.location);
          if (district && districtCounts[district] !== undefined) {
            districtCounts[district]++;
          }
        });
      }
    } else if (metric === "payments") {
      // Contar pagamentos por distrito (usar email para fazer join com leads)
      const { data: payments } = await supabase
        .from("payments")
        .select("email, amount")
        .eq("status", "succeeded");

      if (payments) {
        // Buscar localização dos leads correspondentes
        const emails = payments.map((p) => p.email);
        const { data: leads } = await supabase
          .from("leads")
          .select("email, location")
          .in("email", emails);

        const locationMap = new Map(leads?.map((l) => [l.email, l.location]) || []);

        payments.forEach((payment) => {
          const location = locationMap.get(payment.email);
          const district = extractDistrict(location || null);
          if (district && districtCounts[district] !== undefined) {
            districtCounts[district]++;
          }
        });
      }
    } else if (metric === "customers") {
      // Clientes únicos (emails únicos com pagamentos)
      const { data: payments } = await supabase
        .from("payments")
        .select("email")
        .eq("status", "succeeded");

      if (payments) {
        const uniqueEmails = Array.from(new Set(payments.map((p) => p.email)));
        const { data: leads } = await supabase
          .from("leads")
          .select("email, location")
          .in("email", uniqueEmails);

        leads?.forEach((lead) => {
          const district = extractDistrict(lead.location);
          if (district && districtCounts[district] !== undefined) {
            districtCounts[district]++;
          }
        });
      }
    } else if (metric === "cavalos") {
      // Cavalos por distrito (proprietário)
      const { data: cavalos } = await supabase
        .from("cavalos_venda")
        .select("proprietario_localizacao");

      if (cavalos) {
        cavalos.forEach((cavalo) => {
          const district = extractDistrict(cavalo.proprietario_localizacao);
          if (district && districtCounts[district] !== undefined) {
            districtCounts[district]++;
          }
        });
      }
    }

    // Converter para array
    const districtData = Object.entries(districtCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json({
      metric,
      data: districtData,
      total: districtData.reduce((sum, d) => sum + d.value, 0),
    });
  } catch (error) {
    logger.error("Geo data error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar dados geográficos" },
      { status: 500 }
    );
  }
}
