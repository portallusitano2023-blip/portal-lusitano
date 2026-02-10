export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-6 space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-full mx-auto" />
              <div className="h-6 bg-white/10 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
            </div>
            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-white/5 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="h-8 bg-white/10 rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-5 space-y-3">
                  <div className="h-5 bg-white/10 rounded w-1/2" />
                  <div className="h-8 bg-white/5 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
