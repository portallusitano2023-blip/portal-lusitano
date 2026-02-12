export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative pt-28 pb-6">
        <div className="max-w-7xl mx-auto px-6 text-center animate-pulse">
          <div className="h-8 w-40 bg-[var(--background-elevated)] rounded-full mx-auto mb-4" />
          <div className="h-14 w-96 bg-[var(--background-elevated)] rounded mx-auto mb-4" />
          <div className="h-4 w-72 bg-[var(--background-elevated)] rounded mx-auto mb-8" />

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="px-5 py-4 bg-[var(--background-card)] border border-[var(--border)] w-28"
              >
                <div className="h-8 w-8 bg-[var(--background-elevated)] rounded-full mx-auto mb-2" />
                <div className="h-7 w-10 bg-[var(--background-elevated)] rounded mx-auto mb-1" />
                <div className="h-2 w-16 bg-[var(--background-elevated)] rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-16 animate-pulse">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-6 bg-[var(--background-card)] border border-[var(--border)] rounded-xl">
          <div className="flex gap-1 p-1">
            <div className="h-9 w-20 bg-[var(--background-elevated)] rounded-md" />
            <div className="h-9 w-20 bg-[var(--background-elevated)] rounded-md" />
          </div>
          <div className="flex-1 max-w-sm mx-3">
            <div className="h-9 w-full bg-[var(--background-elevated)] rounded-lg border border-[var(--border)]" />
          </div>
        </div>

        {/* Map + sidebar layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Map area */}
          <div className="lg:col-span-8">
            <div
              className="bg-[var(--background-elevated)] border border-[var(--border)] rounded-2xl"
              style={{ height: "600px" }}
            />
          </div>

          {/* Side panel */}
          <div className="lg:col-span-4 space-y-4">
            {/* Panel header */}
            <div className="p-4 bg-[var(--background-card)] border border-[var(--border)] rounded-xl">
              <div className="h-5 w-36 bg-[var(--background-elevated)] rounded mb-2" />
              <div className="h-3 w-56 bg-[var(--background-elevated)] rounded" />
            </div>

            {/* Region list */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[var(--background-elevated)] rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-[var(--background-elevated)] rounded mb-1" />
                    <div className="h-3 w-16 bg-[var(--background-elevated)] rounded" />
                  </div>
                  <div className="h-4 w-4 bg-[var(--background-elevated)] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
