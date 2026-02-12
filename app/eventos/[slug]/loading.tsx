export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero area */}
      <section className="relative pt-24 pb-12">
        <div className="absolute inset-0 h-96 bg-[var(--background-elevated)] animate-pulse" />

        <div className="relative max-w-4xl mx-auto px-6 pt-16">
          {/* Breadcrumb */}
          <div className="h-4 w-32 bg-[var(--background-elevated)] rounded animate-pulse mb-8" />

          {/* Badges */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-24 bg-[var(--background-elevated)] rounded animate-pulse" />
            <div className="h-8 w-28 bg-[var(--background-elevated)] rounded animate-pulse" />
          </div>

          {/* Title */}
          <div className="h-12 w-3/4 bg-[var(--background-elevated)] rounded animate-pulse mb-6" />

          {/* Info grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--background-elevated)] rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-12 bg-[var(--background-elevated)] rounded animate-pulse" />
                  <div className="h-4 w-40 bg-[var(--background-elevated)] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content area */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Description */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[var(--background-card)] border border-[var(--border)] p-6 space-y-4">
              <div className="h-6 w-40 bg-[var(--background-elevated)] rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-[var(--background-elevated)] rounded animate-pulse" />
                <div className="h-4 w-full bg-[var(--background-elevated)] rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-[var(--background-elevated)] rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-[var(--background-elevated)] rounded animate-pulse" />
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 bg-[var(--background-elevated)] rounded animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-[var(--background-card)] border border-[var(--border)] p-4 space-y-3">
              <div className="h-12 w-full bg-[var(--background-elevated)] rounded animate-pulse" />
              <div className="h-12 w-full bg-[var(--background-elevated)] rounded animate-pulse" />
              <div className="h-12 w-full bg-[var(--background-elevated)] rounded animate-pulse" />
            </div>
            <div className="bg-[var(--background-card)] border border-[var(--border)] p-4">
              <div className="h-3 w-16 bg-[var(--background-elevated)] rounded animate-pulse mb-2" />
              <div className="h-5 w-28 bg-[var(--background-elevated)] rounded animate-pulse" />
            </div>
          </aside>
        </div>

        {/* Related events */}
        <div className="mt-16">
          <div className="h-8 w-48 bg-[var(--background-elevated)] rounded animate-pulse mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--background-card)] border border-[var(--border)] overflow-hidden"
              >
                <div className="h-32 bg-[var(--background-elevated)] animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-16 bg-[var(--background-elevated)] rounded animate-pulse" />
                  <div className="h-5 w-full bg-[var(--background-elevated)] rounded animate-pulse" />
                  <div className="h-4 w-24 bg-[var(--background-elevated)] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
