export default function AdminEditUmkmLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-border-light rounded-lg" />
          <div className="h-8 w-64 bg-border-light rounded-xl" />
        </div>
        <div className="h-10 w-36 bg-border-light rounded-xl" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-border pb-3">
        <div className="h-9 w-32 bg-border-light rounded-xl" />
        <div className="h-9 w-32 bg-border-light rounded-xl" />
        <div className="h-9 w-32 bg-border-light rounded-xl" />
      </div>

      {/* Card Form Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-border-light rounded-md" />
            <div className="h-10 w-full bg-border-light rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-border-light rounded-md" />
            <div className="h-10 w-full bg-border-light rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-border-light rounded-md" />
            <div className="h-10 w-full bg-border-light rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-border-light rounded-md" />
            <div className="h-10 w-full bg-border-light rounded-xl" />
          </div>
        </div>

        <div className="h-24 w-full bg-border-light rounded-xl" />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <div className="h-10 w-24 bg-border-light rounded-xl" />
          <div className="h-10 w-32 bg-primary/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
