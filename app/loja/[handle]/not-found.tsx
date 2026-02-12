import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[var(--gold)] text-sm uppercase tracking-[0.3em] mb-4">404</p>
      <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
        Produto Não Encontrado
      </h1>
      <p className="text-[var(--foreground-muted)] mb-8 max-w-md">
        O produto que procura não existe ou já não está disponível. Explore a nossa loja para
        encontrar outros artigos.
      </p>
      <Link
        href="/loja"
        className="border border-[var(--gold)]/30 px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
      >
        Ver Toda a Loja
      </Link>
    </div>
  );
}
