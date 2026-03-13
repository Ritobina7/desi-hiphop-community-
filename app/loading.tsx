export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Left sidebar skeleton */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <div className="space-y-3">
            <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
            <div className="mt-4 h-px bg-white/5" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
          </div>
        </div>

        {/* Main feed skeleton */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-20 bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-56 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#13131f] border border-white/5 rounded-xl overflow-hidden flex"
              >
                <div className="w-1 flex-shrink-0 bg-orange-500/30" />
                <div className="flex-1 p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-white/5 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
                      <div className="flex gap-1.5">
                        <div className="h-5 w-20 bg-white/5 rounded-full animate-pulse" />
                        <div className="h-5 w-16 bg-white/5 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
                  <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                  <div className="flex gap-4 pt-1">
                    <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar skeleton */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="space-y-4">
            <div className="bg-[#13131f] border border-white/5 rounded-xl p-4 space-y-3">
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
              <div className="h-3 bg-white/5 rounded animate-pulse" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-4/5" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
            </div>
            <div className="bg-[#13131f] border border-white/5 rounded-xl p-4 space-y-3">
              <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-white/5 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
