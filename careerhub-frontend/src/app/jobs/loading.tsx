import { JobListSkeleton } from "@/components/JobCardSkeleton";
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 h-9 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

        <JobListSkeleton />
      </div>
    </main>
  );
}