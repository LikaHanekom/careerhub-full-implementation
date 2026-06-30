import JobLinkCard from "@/components/JobLinkCard";
import JobFilters from "@/components/JobFilters";
import { getJobs, getJobsTotalCount } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; location?: string; status?: string }>;
}) {
  const { q, location, status } = await searchParams;

  const hasActiveFilters = Boolean(q || location || status);

  const [jobs, totalCount] = await Promise.all([
    getJobs({ q, location, status }),
    getJobsTotalCount(),
  ]);

  // Server-side decision: which empty state applies?
  const isDatabaseEmpty = totalCount === 0;
  const isFilteredEmpty = jobs.length === 0 && !isDatabaseEmpty;

  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          All Jobs
        </h1>

        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {jobs.length} positions available
        </p>

        <div className="mb-6">
          <JobFilters />
        </div>

        {isDatabaseEmpty ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No jobs are currently listed.
            </p>
          </div>
        ) : isFilteredEmpty ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              No jobs match your search.
            </p>
            {hasActiveFilters && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                {q && `"${q}"`}
                {q && (location || status) && " · "}
                {location && `Location: ${location}`}
                {location && status && " · "}
                {status && `Status: ${status}`}
              </p>
            )}
            <Link
              href="/jobs"
              className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobLinkCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}