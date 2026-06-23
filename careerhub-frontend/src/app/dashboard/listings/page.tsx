import Link from "next/link";
import {JobStatusBadge} from "@/components/JobStatusBadge";
import { JobListing } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getJobs(): Promise<JobListing[]> {
  // Add '/v1' here to match the backend route
  const res = await fetch(`${API_URL}/api/v1/jobs`, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.status}`);
  }
  
  const response = await res.json();
  return response.data || []; 
}

// No "use client" - Server Component
export default async function DashboardListingsPage() {
  const jobs = await getJobs();

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Job Listings
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {jobs.length} listings
      </p>

      {jobs.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            No job listings found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {job.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {job.company}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {job.location}
                  </td>
                  <td className="px-4 py-3">
                    <JobStatusBadge 
                        employmentType={job.employmentType} 
                        isActive={job.isActive}             
                        />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}