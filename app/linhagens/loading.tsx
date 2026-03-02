export default function LinhagensLoading() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero skeleton */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-24 h-4 bg-[var(--background-secondary)] rounded mb-8 animate-pulse" />
          <div className="text-center space-y-4">
            <div className="w-32 h-3 bg-[var(--gold)]/20 rounded mx-auto animate-pulse" />
            <div className="w-80 h-10 bg-[var(--background-secondary)] rounded mx-auto animate-pulse" />
            <div className="w-96 h-5 bg-[var(--background-secondary)] rounded mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Intro skeleton */}
        <div className="mb-16 p-8 bg-[var(--background-secondary)]/50 border border-[var(--border)] animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[var(--background-secondary)] rounded-full hidden sm:block" />
            <div className="flex-1 space-y-3">
              <div className="w-48 h-6 bg-[var(--background-secondary)] rounded" />
              <div className="w-full h-4 bg-[var(--background-secondary)] rounded" />
              <div className="w-3/4 h-4 bg-[var(--background-secondary)] rounded" />
            </div>
          </div>
        </div>

        {/* Chefes grid skeleton */}
        <div className="mb-16">
          <div className="w-64 h-6 bg-[var(--background-secondary)] rounded mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="text-center p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] animate-pulse"
              >
                <div className="w-12 h-12 mx-auto bg-[var(--background-secondary)] rounded-full mb-3" />
                <div className="w-20 h-4 bg-[var(--background-secondary)] rounded mx-auto mb-2" />
                <div className="w-12 h-3 bg-[var(--background-secondary)] rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Cards grid skeleton */}
        <div className="grid md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-96 bg-[var(--background-secondary)]/50 border border-[var(--border)] animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
