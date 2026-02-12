export default function Maintenance() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] z-50 relative">
      <div className="flex flex-col items-center gap-8 p-4 text-center">
        <h1 className="text-3xl font-bold tracking-[0.2em] md:text-5xl uppercase text-[var(--foreground)]">
          PORTAL LUSITANO
        </h1>
        <div className="h-[1px] w-24 bg-[var(--foreground-muted)]"></div>
        <p className="text-sm font-light tracking-widest text-[var(--foreground-secondary)] uppercase">
          Uma experiência sem precedentes
          <br />
          <span className="mt-2 block opacity-50">Brevemente • 2026</span>
        </p>
      </div>
    </main>
  );
}
