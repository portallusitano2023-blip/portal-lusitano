import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cavalos Lusitanos Famosos — Portal Lusitano";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        backgroundImage: "radial-gradient(circle at 50% 30%, #2a1a00 0%, #050505 60%)",
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
        Legado e Excelência
      </div>
      <div
        style={{
          fontSize: 62,
          fontWeight: 400,
          color: "white",
          textAlign: "center",
          lineHeight: 1.1,
          fontFamily: "serif",
          marginBottom: "18px",
        }}
      >
        Lusitanos que Marcaram a História
      </div>
      <div
        style={{
          fontSize: 22,
          color: "#C5A059",
          fontStyle: "italic",
          fontFamily: "serif",
          marginBottom: "40px",
        }}
      >
        Rubi AR · Xaquiro · Furao · Nilo
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
