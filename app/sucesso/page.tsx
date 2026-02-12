export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center text-[var(--foreground)] px-6">
      <div className="text-center">
        <span className="text-[var(--gold)] uppercase tracking-[0.8em] text-[10px] font-bold block mb-8 animate-pulse">
          Portal Lusitano
        </span>
        <h1 className="text-4xl md:text-6xl font-serif italic mb-8 tracking-tighter text-[var(--foreground)]">
          The Future of Lusitano Elite
        </h1>
        <div className="w-16 h-[1px] bg-[var(--gold)] mx-auto mb-12 opacity-40"></div>
        <p className="text-[var(--foreground-muted)] font-light tracking-[0.4em] text-[9px] uppercase">
          Private Preview — Opening Early 2026
        </p>
      </div>
    </main>
  );
}
