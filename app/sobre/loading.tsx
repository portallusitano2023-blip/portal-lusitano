export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto animate-pulse">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="h-12 bg-[var(--surface-hover)] rounded-lg w-80 mx-auto mb-4" />
          <div className="h-5 bg-[var(--surface-hover)] rounded w-96 mx-auto" />
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div
                className={`h-64 bg-[var(--surface-hover)] rounded-xl ${i % 2 ? "md:order-2" : ""}`}
              />
              <div className="space-y-4">
                <div className="h-7 bg-[var(--surface-hover)] rounded w-2/3" />
                <div className="h-4 bg-[var(--surface-hover)] rounded w-full" />
                <div className="h-4 bg-[var(--surface-hover)] rounded w-full" />
                <div className="h-4 bg-[var(--surface-hover)] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
