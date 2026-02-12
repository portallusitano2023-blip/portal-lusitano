export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto animate-pulse">
        {/* Back link */}
        <div className="mb-8">
          <div className="h-4 w-28 bg-[var(--background-elevated)] rounded" />
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-[var(--background-elevated)] rounded-full mx-auto mb-6" />
          <div className="h-12 w-80 bg-[var(--background-elevated)] rounded mx-auto mb-4" />
          <div className="h-4 w-64 bg-[var(--background-elevated)] rounded mx-auto" />
        </div>

        {/* Results count */}
        <div className="h-4 w-36 bg-[var(--background-elevated)] rounded mb-6" />

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[var(--background-card)] border border-[var(--border)] p-6">
              {/* Tool badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[var(--background-elevated)] rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-[var(--background-elevated)] rounded w-32 mb-2" />
                  <div className="h-3 bg-[var(--background-elevated)] rounded w-20" />
                </div>
              </div>

              {/* Title */}
              <div className="h-5 bg-[var(--background-elevated)] rounded w-3/4 mb-3" />

              {/* Date */}
              <div className="h-3 bg-[var(--background-elevated)] rounded w-40 mb-6" />

              {/* Actions */}
              <div className="flex gap-3">
                <div className="h-10 bg-[var(--background-elevated)] rounded flex-1" />
                <div className="h-10 bg-[var(--background-elevated)] rounded w-10" />
                <div className="h-10 bg-[var(--background-elevated)] rounded w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
