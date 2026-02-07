"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt">
      <body style={{ backgroundColor: "#050505", margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <main style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}>
          <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>
            <div style={{ color: "#C5A059", fontSize: "3.75rem", marginBottom: "1.5rem" }}>!</div>

            <h1 style={{ fontSize: "1.5rem", color: "white", marginBottom: "1rem" }}>
              Algo correu mal
            </h1>

            <p style={{ color: "#a1a1aa", marginBottom: "2rem" }}>
              Pedimos desculpa pelo inconveniente. Ocorreu um erro inesperado.
            </p>

            {error.digest && (
              <p style={{ color: "#a1a1aa", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
                Referência: {error.digest}
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button
                onClick={reset}
                style={{
                  backgroundColor: "#C5A059",
                  color: "black",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  padding: "1rem 2rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Tentar novamente
              </button>

              <a
                href="/"
                style={{ color: "#71717a", fontSize: "0.875rem", textDecoration: "none" }}
              >
                Voltar ao início
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
