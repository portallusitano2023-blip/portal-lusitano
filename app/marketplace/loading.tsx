export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="animate-pulse mb-8">
          <div className="h-10 bg-white/5 rounded-lg w-64 mb-4" />
          <div className="h-5 bg-white/5 rounded-lg w-96" />
        </div>

        {/* Search bar skeleton */}
        <div className="animate-pulse mb-8 flex gap-4">
          <div className="flex-1 h-12 bg-white/5 rounded-xl" />
          <div className="h-12 w-32 bg-white/5 rounded-xl" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/5 rounded-xl overflow-hidden">
              <div className="h-56 bg-white/10" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="flex justify-between pt-2">
                  <div className="h-6 bg-white/10 rounded w-24" />
                  <div className="h-6 bg-white/5 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
