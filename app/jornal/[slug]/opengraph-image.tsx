import { ImageResponse } from "next/og";
import { fetchArticleBySlug } from "@/lib/sanity-queries";
import { articlesDataPT } from "@/data/articlesData";

export const runtime = "edge";

export const alt = "Jornal Lusitano — Portal Lusitano";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const slugToLegacyId: Record<string, string> = {
  "genese-cavalo-iberico": "1",
  "biomecanica-reuniao": "2",
  "standard-apsl": "3",
  "genetica-pelagens": "4",
  "toricidade-selecao-combate": "5",
  "novilheiro-rubi-revolucao-olimpica": "6",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = "Artigo";
  let category = "Jornal Lusitano";

  try {
    const article = await fetchArticleBySlug(slug);
    if (article) {
      title = article.title || "Artigo";
      category = article.category || "Jornal Lusitano";
    } else {
      const legacyId = slugToLegacyId[slug];
      if (legacyId && articlesDataPT[legacyId]) {
        title = articlesDataPT[legacyId].title;
        category = articlesDataPT[legacyId].category || "Jornal Lusitano";
      }
    }
  } catch {
    // Fall through to default values
  }

  const displayTitle = title.length > 70 ? title.substring(0, 67) + "..." : title;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#050505",
        backgroundImage: "radial-gradient(circle at 70% 80%, #1a1a1a 0%, #050505 60%)",
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

      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
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
          <span style={{ fontSize: 14, color: "#C5A059", letterSpacing: "0.05em" }}>
            {category}
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
            maxWidth: "950px",
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
            Arquivo Editorial
          </div>
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#71717a",
            fontStyle: "italic",
          }}
        >
          Jornal Lusitano
        </div>
      </div>
    </div>,
    { ...size }
  );
}
