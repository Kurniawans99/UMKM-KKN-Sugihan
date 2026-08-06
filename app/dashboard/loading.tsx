export default function DashboardLoading() {
  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-border-light rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-border-light rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-44 bg-border-light rounded-xl animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="stat-card"
          >
            <div className="h-3 w-24 bg-border-light rounded animate-pulse mb-3" />
            <div className="h-7 w-16 bg-border-light rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
        <div className="h-5 w-48 bg-border-light rounded animate-pulse mb-6" />
        <div className="h-48 bg-border-light rounded-xl animate-pulse" />
      </div>

      {/* Cards Grid Skeleton */}
      <div>
        <div className="h-6 w-52 bg-border-light rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-4"
            >
              {/* Status Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="h-6 w-32 bg-border-light rounded-full animate-pulse" />
                <div className="h-6 w-12 bg-border-light rounded-full animate-pulse" />
              </div>
              {/* Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-border-light animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 bg-border-light rounded animate-pulse" />
                  <div className="h-3 w-32 bg-border-light rounded animate-pulse" />
                </div>
              </div>
              {/* Stats Pills */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                <div className="h-14 bg-border-light rounded-xl animate-pulse" />
                <div className="h-14 bg-border-light rounded-xl animate-pulse" />
              </div>
              {/* Action Links */}
              <div className="pt-2 flex items-center gap-2 border-t border-border">
                <div className="h-8 flex-1 bg-border-light rounded-lg animate-pulse" />
                <div className="h-8 flex-1 bg-border-light rounded-lg animate-pulse" />
                <div className="h-8 flex-1 bg-border-light rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
