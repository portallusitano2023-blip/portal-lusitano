export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-20 pb-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Back link */}
        <div className="h-4 w-16 bg-[var(--background-elevated)] rounded mb-6" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-3 w-32 bg-[var(--background-elevated)] rounded mx-auto mb-2" />
          <div className="h-10 w-64 bg-[var(--background-elevated)] rounded mx-auto mb-4" />
          <div className="h-4 w-96 bg-[var(--background-elevated)] rounded mx-auto" />
        </div>

        {/* Stats bar */}
        <div className="mb-8">
          <div className="flex justify-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg"
              >
                <div className="h-8 w-8 bg-[var(--background-elevated)] rounded" />
                <div>
                  <div className="h-5 w-8 bg-[var(--background-elevated)] rounded mb-1" />
                  <div className="h-3 w-16 bg-[var(--background-elevated)] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-[var(--border)] pb-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-[var(--background-elevated)] rounded-lg" />
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 bg-[var(--background-elevated)] rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="h-10 flex-1 min-w-[200px] bg-[var(--background-elevated)] rounded-lg border border-[var(--border)]" />
            <div className="h-10 w-36 bg-[var(--background-elevated)] rounded-lg border border-[var(--border)]" />
            <div className="h-10 w-36 bg-[var(--background-elevated)] rounded-lg border border-[var(--border)]" />
          </div>
        </div>

        {/* Professional cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-4"
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[var(--background-elevated)] rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-28 bg-[var(--background-elevated)] rounded mb-1" />
                  <div className="h-3 w-20 bg-[var(--background-elevated)] rounded" />
                </div>
              </div>

              {/* Category badge */}
              <div className="h-6 w-24 bg-[var(--background-elevated)] rounded-full mb-3" />

              {/* Info lines */}
              <div className="space-y-2 mb-4">
                <div className="h-3 w-32 bg-[var(--background-elevated)] rounded" />
                <div className="h-3 w-24 bg-[var(--background-elevated)] rounded" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 w-4 bg-[var(--background-elevated)] rounded" />
                ))}
                <div className="h-3 w-8 bg-[var(--background-elevated)] rounded ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
