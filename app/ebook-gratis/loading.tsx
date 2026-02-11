export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Book image */}
          <div className="h-[400px] bg-[var(--surface-hover)] rounded-xl" />

          {/* Form */}
          <div className="space-y-6">
            <div className="h-10 bg-[var(--surface-hover)] rounded-lg w-3/4" />
            <div className="h-5 bg-[var(--surface-hover)] rounded w-full" />
            <div className="h-5 bg-[var(--surface-hover)] rounded w-4/5" />
            <div className="space-y-4 pt-4">
              <div className="h-12 bg-[var(--surface-hover)] rounded-lg" />
              <div className="h-12 bg-[var(--surface-hover)] rounded-lg" />
              <div className="h-12 bg-[var(--gold)]/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
