export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header skeleton */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-20 animate-pulse rounded-lg bg-white/10" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
        </div>
      </header>

      {/* Shimmer grid */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="mb-6 break-inside-avoid overflow-hidden rounded-xl border border-white/10"
            >
              <div
                className="aspect-[4/3] w-full bg-[length:200%_100%] bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.06)_100%)] bg-[position:-150%_0]"
                style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
              />
              <div className="space-y-2 border-t border-white/5 bg-white/5 p-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
