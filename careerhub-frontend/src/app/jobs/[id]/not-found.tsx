import Link from "next/link";

// Server Component
export default function JobNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Job Not Found
        </h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          The job listing you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          href="/jobs"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to all jobs
        </Link>
      </div>
    </main>
  );
}