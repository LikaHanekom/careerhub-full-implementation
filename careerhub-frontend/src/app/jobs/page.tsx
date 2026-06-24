import JobLinkCard from "@/components/JobLinkCard";
import { fetchJobs } from "@/lib/api";

export const dynamic = "force-dynamic";

// Server Component data loader
async function getJobs() {
  return fetchJobs({ next: { tags: ['jobs'] } });
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          All Jobs
        </h1>

        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {jobs.length} positions available
        </p>

        {jobs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No jobs found at this time.
            </p>
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