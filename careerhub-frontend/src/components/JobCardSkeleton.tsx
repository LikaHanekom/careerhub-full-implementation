export function JobCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="mt-2 h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export function JobListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}