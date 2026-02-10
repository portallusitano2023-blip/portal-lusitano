export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="h-[500px] bg-white/5 rounded-xl" />

          {/* Details sidebar */}
          <div className="space-y-6">
            <div className="h-10 bg-white/10 rounded-lg w-3/4" />
            <div className="h-6 bg-white/5 rounded w-1/2" />
            <div className="space-y-3 pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-5 bg-white/5 rounded w-28" />
                  <div className="h-5 bg-white/10 rounded w-32" />
                </div>
              ))}
            </div>
            <div className="h-12 bg-[#C5A059]/20 rounded-xl w-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
