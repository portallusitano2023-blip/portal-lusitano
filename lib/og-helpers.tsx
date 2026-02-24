import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Reusable OG image generator — consistent Portal Lusitano branding.
 * Uses dark background (#050505), gold accents (#C5A059), serif typography.
 */
export function createOgImage({
  label,
  title,
  subtitle,
  footer = "Portal Lusitano",
}: {
  label: string;
  title: string;
  subtitle?: string;
  footer?: string;
}) {
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
      {/* Top decorative line */}
      <div
        style={{
          width: "1px",
          height: "50px",
          background: "linear-gradient(to bottom, transparent, #C5A059, transparent)",
          marginBottom: "24px",
        }}
      />

      {/* Label */}
      <div
        style={{
          fontSize: 13,
          letterSpacing: "0.4em",
          color: "#C5A059",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        {label}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: title.length > 30 ? 48 : 58,
          fontWeight: 400,
          color: "white",
          textAlign: "center",
          lineHeight: 1.15,
          fontFamily: "serif",
          marginBottom: subtitle ? "16px" : "40px",
          maxWidth: "900px",
          padding: "0 40px",
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            fontSize: 20,
            color: "#a1a1aa",
            fontStyle: "italic",
            fontFamily: "serif",
            maxWidth: "700px",
            textAlign: "center",
            marginBottom: "40px",
            padding: "0 40px",
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
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
          {footer}
        </div>
        <div style={{ width: "40px", height: "1px", backgroundColor: "#C5A059" }} />
      </div>
    </div>,
    { ...ogSize }
  );
}
