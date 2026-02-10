export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Book image */}
          <div className="h-[400px] bg-white/5 rounded-xl" />

          {/* Form */}
          <div className="space-y-6">
            <div className="h-10 bg-white/10 rounded-lg w-3/4" />
            <div className="h-5 bg-white/5 rounded w-full" />
            <div className="h-5 bg-white/5 rounded w-4/5" />
            <div className="space-y-4 pt-4">
              <div className="h-12 bg-white/5 rounded-lg" />
              <div className="h-12 bg-white/5 rounded-lg" />
              <div className="h-12 bg-[#C5A059]/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
