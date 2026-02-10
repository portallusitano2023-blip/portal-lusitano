export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse mb-12 text-center">
          <div className="h-10 bg-white/5 rounded-lg w-72 mx-auto mb-4" />
          <div className="h-5 bg-white/5 rounded-lg w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/5 rounded-xl overflow-hidden">
              <div className="h-64 bg-white/10" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-white/10 rounded w-2/3" />
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
