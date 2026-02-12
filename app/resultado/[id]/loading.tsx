export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
        {/* Back link */}
        <div className="h-5 w-32 bg-[var(--background-elevated)] rounded" />

        {/* Header card */}
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[var(--background-elevated)] rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-7 w-56 bg-[var(--background-elevated)] rounded" />
              <div className="flex items-center gap-3">
                <div className="h-4 w-36 bg-[var(--background-elevated)] rounded" />
                <div className="h-4 w-40 bg-[var(--background-elevated)] rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Form data card */}
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-8 space-y-6">
          <div className="h-6 w-48 bg-[var(--background-elevated)] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-[var(--background-elevated)] rounded" />
                <div className="h-5 w-full bg-[var(--background-elevated)] rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Result data card */}
        <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-8 space-y-6">
          <div className="h-6 w-52 bg-[var(--background-elevated)] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-[var(--background-elevated)] rounded" />
                <div
                  className="h-5 bg-[var(--background-elevated)] rounded"
                  style={{ width: `${60 + (i + 1) * 7}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-36 bg-[var(--background-elevated)] rounded" />
          <div className="h-11 w-44 bg-[var(--background-elevated)] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
