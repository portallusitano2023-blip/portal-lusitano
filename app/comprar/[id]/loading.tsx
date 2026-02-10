export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Image gallery */}
          <div className="lg:col-span-3 space-y-4">
            <div className="h-[400px] bg-white/5 rounded-xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 w-20 bg-white/5 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Purchase sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-white/10 rounded w-3/4" />
            <div className="h-10 bg-white/5 rounded w-1/2" />
            <div className="space-y-3 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-white/5 rounded w-full" />
              ))}
            </div>
            <div className="h-14 bg-[#C5A059]/20 rounded-xl w-full mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
