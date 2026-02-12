export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product image */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-[var(--background-elevated)] rounded" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 w-20 bg-[var(--background-elevated)] rounded" />
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="h-4 w-40 bg-[var(--background-elevated)] rounded" />

            {/* Title */}
            <div className="h-10 w-3/4 bg-[var(--background-elevated)] rounded" />

            {/* Price */}
            <div className="h-8 w-32 bg-[var(--background-elevated)] rounded" />

            {/* Description lines */}
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-[var(--background-elevated)] rounded" />
              <div className="h-4 w-full bg-[var(--background-elevated)] rounded" />
              <div className="h-4 w-5/6 bg-[var(--background-elevated)] rounded" />
              <div className="h-4 w-2/3 bg-[var(--background-elevated)] rounded" />
            </div>

            {/* Variant selector */}
            <div className="flex gap-3 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-16 bg-[var(--background-elevated)] rounded border border-[var(--border)]"
                />
              ))}
            </div>

            {/* Add to cart button */}
            <div className="h-14 w-full bg-[var(--background-elevated)] rounded mt-4" />

            {/* Trust badges */}
            <div className="flex gap-6 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[var(--background-elevated)] rounded-full" />
                  <div className="h-3 w-16 bg-[var(--background-elevated)] rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product description section */}
        <div className="mt-32 max-w-2xl border-t border-[var(--border)] pt-12">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-full bg-[var(--background-elevated)] rounded" />
            <div className="h-4 w-full bg-[var(--background-elevated)] rounded" />
            <div className="h-4 w-4/5 bg-[var(--background-elevated)] rounded" />
            <div className="h-4 w-3/5 bg-[var(--background-elevated)] rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
