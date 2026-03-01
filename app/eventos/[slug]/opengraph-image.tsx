import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase-admin";
import { ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Evento Equestre — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let titulo = "Evento Equestre";
  let localizacao = "";
  let dataEvento = "";

  try {
    const { data } = await supabase
      .from("eventos")
      .select("titulo, localizacao, data_inicio")
      .eq("slug", slug)
      .single();

    if (data) {
      titulo = data.titulo || "Evento Equestre";
      localizacao = data.localizacao || "";
      if (data.data_inicio) {
        dataEvento = new Date(data.data_inicio).toLocaleDateString("pt-PT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
  } catch {
    // Fall through to defaults
  }

  const details = [dataEvento, localizacao].filter(Boolean).join(" · ");

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#050505",
        backgroundImage: "radial-gradient(circle at 80% 20%, #1a1a1a 0%, #050505 60%)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          letterSpacing: "0.4em",
          color: "#C5A059",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        Agenda Equestre
      </div>
      <div
        style={{
          fontSize: titulo.length > 35 ? 42 : 54,
          fontWeight: 400,
          color: "white",
          textAlign: "center",
          lineHeight: 1.15,
          fontFamily: "serif",
          marginBottom: "16px",
          maxWidth: "900px",
          padding: "0 40px",
        }}
      >
        {titulo}
      </div>
      {details && (
        <div
          style={{
            fontSize: 20,
            color: "#a1a1aa",
            fontStyle: "italic",
            fontFamily: "serif",
            marginBottom: "40px",
          }}
        >
          {details}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          position: "absolute",
          bottom: "50px",
        }}
      >
        <div style={{ width: "40px", height: "1px", backgroundColor: "#C5A059" }} />
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.3em",
            color: "#71717a",
            textTransform: "uppercase",
          }}
        >
          Portal Lusitano
        </div>
        <div style={{ width: "40px", height: "1px", backgroundColor: "#C5A059" }} />
      </div>
    </div>,
    { ...size }
  );
}
