export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse mb-12 text-center">
          <div className="h-10 bg-[var(--surface-hover)] rounded-lg w-72 mx-auto mb-4" />
          <div className="h-5 bg-[var(--surface-hover)] rounded-lg w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-[var(--surface-hover)] rounded-xl overflow-hidden"
            >
              <div className="h-64 bg-[var(--surface-hover)]" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-[var(--surface-hover)] rounded w-2/3" />
                <div className="h-4 bg-[var(--surface-hover)] rounded w-full" />
                <div className="h-4 bg-[var(--surface-hover)] rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
