function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: "var(--app-surface)" }}
    />
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[95vh]">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-28 left-6 md:left-16 space-y-4 max-w-lg">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-36 md:w-44">
      <Skeleton className="aspect-[2/3] rounded-md" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div style={{ backgroundColor: "var(--app-bg)", minHeight: "100vh" }}>
      <Skeleton className="w-full h-[60vh] rounded-none" />
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-16 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-40 md:w-56 aspect-[2/3] rounded-lg shrink-0" />
          <div className="flex-1 space-y-4 pt-16">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
