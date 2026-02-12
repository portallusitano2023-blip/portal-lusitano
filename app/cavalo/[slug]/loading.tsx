export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="h-[500px] bg-[var(--background-elevated)] rounded-xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 w-20 bg-[var(--background-elevated)] rounded-lg" />
              ))}
            </div>
          </div>

          {/* Details sidebar */}
          <div className="space-y-6">
            {/* Horse name */}
            <div className="h-10 bg-[var(--background-elevated)] rounded-lg w-3/4" />
            {/* Subtitle / breed */}
            <div className="h-6 bg-[var(--background-elevated)] rounded w-1/2" />

            {/* Details grid */}
            <div className="space-y-3 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-5 bg-[var(--background-elevated)] rounded w-28" />
                  <div className="h-5 bg-[var(--background-elevated)] rounded w-32" />
                </div>
              ))}
            </div>

            {/* Description block */}
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-[var(--background-elevated)] rounded w-full" />
              <div className="h-4 bg-[var(--background-elevated)] rounded w-full" />
              <div className="h-4 bg-[var(--background-elevated)] rounded w-5/6" />
            </div>

            {/* CTA button */}
            <div className="h-12 bg-[var(--background-elevated)] rounded-xl w-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
