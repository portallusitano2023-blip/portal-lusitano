import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos Equestres 2025/2026 | Feiras, Competições e Leilões",
  description:
    "Calendário completo de eventos equestres em Portugal: Golegã, Cascais, Ponte de Lima e mais. Feiras, competições de dressage, leilões de cavalos Lusitanos.",
  keywords: [
    "eventos equestres portugal",
    "feira do cavalo golegã",
    "competição dressage",
    "leilão cavalos lusitanos",
    "exposição equestre",
    "workshop equitação",
  ],
  openGraph: {
    title: "Eventos Equestres 2025/2026 - Portal Lusitano",
    description:
      "Todos os eventos equestres de Portugal num só lugar. Feiras, competições, leilões e workshops.",
    type: "website",
    images: [
      {
        url: "/og-eventos.jpg",
        width: 1200,
        height: 630,
        alt: "Eventos Equestres Portugal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventos Equestres 2025/2026",
    description: "Calendário completo de eventos equestres em Portugal",
  },
};
