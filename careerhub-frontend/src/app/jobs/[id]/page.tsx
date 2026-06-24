import { notFound } from "next/navigation";
import Link from "next/link";
import { ApplicationForm } from "@/components/ApplicationForm";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { JobListing } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getJob(id: string): Promise<JobListing | null> {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    next: { tags: ["jobs"] }  // Changed from cache: "no-store"
  });

  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    throw new Error(`Failed to fetch job: ${res.status}`);
  }

  return res.json();
}

export default async function JobDetailPage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = await params;
    const job = await getJob(id);

    if (!job) {
        notFound();
    }

  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to jobs
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {job.title}
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {job.company} • {job.location}
              </p>
            </div>
            <JobStatusBadge 
              employmentType={job.employmentType} 
              isActive={job.isActive}             
            />
          </div>
        </div>

        {/* Using isActive (boolean) instead of status (string) */}
        {!job.isActive ? (
          <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              This position is no longer accepting applications.
            </p>
          </div>
        ) : (
          <ApplicationForm 
            jobId={job.id} 
            jobTitle={job.title} 
            applicantId="current-user-id" 
          />
        )}
      </div>
    </main>
  );
}