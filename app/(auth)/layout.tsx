import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Autenticação",
  description:
    "Aceda à sua conta no Portal Lusitano — o maior portal de cavalos Lusitanos em Portugal.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex flex-col items-center mb-8 group">
        <span className="text-xl font-serif text-white tracking-wide group-hover:text-[#C5A059] transition-colors">
          PORTAL LUSITANO
        </span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 mt-1">EST. 2023</span>
      </Link>

      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-xl p-8">
        {children}
      </div>

      <Link href="/" className="mt-6 text-sm text-zinc-500 hover:text-[#C5A059] transition-colors">
        Voltar ao Portal
      </Link>
    </div>
  );
}
