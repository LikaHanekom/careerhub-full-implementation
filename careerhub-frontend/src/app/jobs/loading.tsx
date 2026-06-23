export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 h-9 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="mt-4 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}