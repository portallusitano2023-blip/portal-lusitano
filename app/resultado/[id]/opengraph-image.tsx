import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export const alt = "Resultado - Portal Lusitano";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const TOOL_LABELS: Record<string, string> = {
  calculadora: "Calculadora de Valor",
  comparador: "Comparador de Cavalos",
  compatibilidade: "Verificador de Compatibilidade",
  perfil: "Analise de Perfil",
};

const TOOL_ICONS: Record<string, string> = {
  calculadora: "=",
  comparador: "||",
  compatibilidade: "++",
  perfil: "@",
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let title = "Resultado";
  let toolLabel = "Ferramentas Equestres";
  let toolIcon = ">";
  let dateStr = "";

  try {
    const { data } = await supabase
      .from("saved_results")
      .select("title, tool_name, is_public, created_at")
      .or(`share_id.eq.${id},id.eq.${id}`)
      .single();

    if (data && data.is_public) {
      title = data.title || "Resultado";
      toolLabel = TOOL_LABELS[data.tool_name] || "Ferramenta";
      toolIcon = TOOL_ICONS[data.tool_name] || ">";
      dateStr = new Date(data.created_at).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
  } catch {
    // Fall through to default values
  }

  // Truncate title if too long
  const displayTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#050505",
        backgroundImage: "radial-gradient(circle at 25% 25%, #1a1a1a 0%, #050505 50%)",
        padding: "60px 80px",
        position: "relative",
      }}
    >
      {/* Top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(to right, transparent 10%, #C5A059 30%, #C5A059 70%, transparent 90%)",
        }}
      />

      {/* Header row: brand + tool badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.4em",
              color: "#C5A059",
              textTransform: "uppercase",
            }}
          >
            Portal Lusitano
          </div>
        </div>

        {/* Tool badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            border: "1px solid rgba(197, 160, 89, 0.3)",
            borderRadius: "8px",
            backgroundColor: "rgba(197, 160, 89, 0.08)",
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "#C5A059",
              fontFamily: "monospace",
            }}
          >
            {toolIcon}
          </span>
          <span
            style={{
              fontSize: 14,
              color: "#C5A059",
              letterSpacing: "0.05em",
            }}
          >
            {toolLabel}
          </span>
        </div>
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: "60px",
          height: "1px",
          background: "linear-gradient(to right, #C5A059, transparent)",
          marginBottom: "30px",
        }}
      />

      {/* Main title */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: "white",
            lineHeight: 1.2,
            fontFamily: "serif",
            maxWidth: "900px",
          }}
        >
          {displayTitle}
        </div>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "#C5A059",
            }}
          />
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.3em",
              color: "#71717a",
              textTransform: "uppercase",
            }}
          >
            Cavalos Lusitanos de Elite
          </div>
        </div>
        {dateStr && (
          <div
            style={{
              fontSize: 13,
              color: "#71717a",
            }}
          >
            {dateStr}
          </div>
        )}
      </div>
    </div>,
    {
      ...size,
    }
  );
}
