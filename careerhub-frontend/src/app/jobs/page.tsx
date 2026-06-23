import JobLinkCard from "@/components/JobLinkCard";
import { JobListing } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getJobs(): Promise<JobListing[]> {
  const res = await fetch(`${API_URL}/api/v1/jobs`, { cache: "no-store" });
  
  if (!res.ok) throw new Error(`Failed: ${res.status}`);

  const envelope = await res.json();
  
  console.log("Full API Response Keys:", Object.keys(envelope));
  
  console.log("Attempted access of .items:", envelope.items);

  // Return data based on inspection
  return envelope.data || [];
}

// Server Component
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