export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto animate-pulse">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[var(--background-elevated)] rounded-full mx-auto mb-6" />
          <div className="h-3 w-20 bg-[var(--background-elevated)] rounded mx-auto mb-4" />
          <div className="h-12 w-72 bg-[var(--background-elevated)] rounded mx-auto mb-4" />
          <div className="h-4 w-64 bg-[var(--background-elevated)] rounded mx-auto" />
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <div className="max-w-xl mx-auto">
            <div className="h-12 w-full bg-[var(--background-elevated)] rounded-xl border border-[var(--border)]" />
          </div>
        </div>

        {/* Alphabet navigation */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto">
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} className="w-9 h-9 bg-[var(--background-elevated)] rounded-lg" />
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="h-4 w-24 bg-[var(--background-elevated)] rounded mb-6" />

        {/* Term groups */}
        {Array.from({ length: 4 }).map((_, groupIdx) => (
          <div key={groupIdx} className="mb-10">
            {/* Letter heading */}
            <div className="flex items-center gap-4 mb-4">
              <div className="h-9 w-9 bg-[var(--background-elevated)] rounded" />
              <div className="h-px flex-1 bg-[var(--background-elevated)]" />
            </div>

            {/* Term cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, cardIdx) => (
                <div
                  key={cardIdx}
                  className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="h-5 w-32 bg-[var(--background-elevated)] rounded" />
                    <div className="h-6 w-16 bg-[var(--background-elevated)] rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-[var(--background-elevated)] rounded" />
                    <div className="h-3 w-5/6 bg-[var(--background-elevated)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
