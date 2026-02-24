import { ImageResponse } from "next/og";
import { client } from "@/lib/client";
import { ogSize, ogContentType } from "@/lib/og-helpers";

export const runtime = "edge";
export const alt = "Cavalo Lusitano — Portal Lusitano";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let nome = "Cavalo Lusitano";
  let idade = "";
  let preco = "";

  try {
    const data = await client.fetch(
      `*[_type == "cavalo" && slug.current == $slug][0]{ nome, idade, preco }`,
      { slug }
    );
    if (data) {
      nome = data.nome || "Cavalo Lusitano";
      idade = data.idade ? `${data.idade} anos` : "";
      preco = data.preco ? `${Number(data.preco).toLocaleString("pt-PT")}€` : "";
    }
  } catch {
    // Fall through to defaults
  }

  const details = [idade, preco].filter(Boolean).join(" · ");

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
        backgroundImage: "radial-gradient(circle at 50% 30%, #1a1200 0%, #050505 60%)",
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
        Cavalo Lusitano à Venda
      </div>
      <div
        style={{
          fontSize: nome.length > 25 ? 48 : 62,
          fontWeight: 400,
          color: "white",
          textAlign: "center",
          lineHeight: 1.15,
          fontFamily: "serif",
          marginBottom: "16px",
          maxWidth: "900px",
        }}
      >
        {nome}
      </div>
      {details && (
        <div
          style={{
            fontSize: 22,
            color: "#C5A059",
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
