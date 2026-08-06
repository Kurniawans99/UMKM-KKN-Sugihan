export default function AdminLoading() {
  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-72 bg-border-light rounded-lg animate-pulse" />
        <div className="h-4 w-[28rem] bg-border-light rounded-lg animate-pulse" />
      </div>

      {/* KPI Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 bg-border-light rounded animate-pulse" />
              <div className="w-10 h-10 rounded-xl bg-border-light animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-border-light rounded animate-pulse mt-2" />
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-6 shadow-xs"
          >
            <div className="h-5 w-48 bg-border-light rounded animate-pulse mb-6" />
            <div className="h-48 bg-border-light rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Tables Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-56 bg-border-light rounded animate-pulse" />
              <div className="h-4 w-20 bg-border-light rounded animate-pulse" />
            </div>
            {/* Table rows skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-36 bg-border-light rounded animate-pulse" />
                    <div className="h-3 w-24 bg-border-light rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-16 bg-border-light rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
