import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  description:
    "Est\u00e1 sem liga\u00e7\u00e3o \u00e0 internet. Volte a tentar quando tiver liga\u00e7\u00e3o.",
  keywords: [],
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
