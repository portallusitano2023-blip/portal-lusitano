export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse mb-10 text-center">
          <div className="h-10 bg-[var(--surface-hover)] rounded-lg w-64 mx-auto mb-4" />
          <div className="h-5 bg-[var(--surface-hover)] rounded-lg w-80 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-[var(--surface-hover)] rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-[var(--surface-hover)]" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-[var(--surface-hover)] rounded w-2/3" />
                <div className="h-4 bg-[var(--surface-hover)] rounded w-full" />
                <div className="flex gap-2">
                  <div className="h-6 bg-[var(--surface-hover)] rounded-full w-20" />
                  <div className="h-6 bg-[var(--surface-hover)] rounded-full w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
