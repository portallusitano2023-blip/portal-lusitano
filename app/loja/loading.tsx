export default function LojaLoading() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center mb-32">
          <div className="w-[1px] h-16 bg-[var(--background-elevated)] mb-8 animate-pulse" />
          <div className="h-4 w-32 bg-[var(--background-elevated)] rounded mb-6 animate-pulse" />
          <div className="h-16 w-80 bg-[var(--background-elevated)] rounded mb-8 animate-pulse" />
          <div className="h-3 w-64 bg-[var(--background-elevated)] rounded animate-pulse" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-28 md:gap-y-32">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-full max-w-[380px]">
                <div className="aspect-[4/5] w-full bg-[var(--background-secondary)] border border-[var(--border)] animate-pulse mb-6" />
                <div className="flex flex-col items-center">
                  <div className="h-6 w-48 bg-[var(--background-elevated)] rounded mb-2 animate-pulse" />
                  <div className="h-5 w-24 bg-[var(--background-elevated)] rounded mb-5 animate-pulse" />
                  <div className="h-3 w-20 bg-[var(--background-elevated)] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
