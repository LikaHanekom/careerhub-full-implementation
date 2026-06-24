import Link from "next/link";
import { JobListing } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

interface ApplicationStats {
  jobId: string;
  applicationCount: number;
}

async function getJobs(): Promise<JobListing[]> {
  const res = await fetch(`${API_URL}/api/jobs`, {
    next: { tags: ["jobs"] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.status}`);
  }

  return res.json();
}

async function getApplicationStats(): Promise<ApplicationStats[]> {
  const res = await fetch(`${API_URL}/api/applications/stats`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch application stats: ${res.status}`);
  }

  return res.json();
}

export default async function DashboardListingsPage() {
  const [jobs, stats] = await Promise.all([
    getJobs(),
    getApplicationStats(),
  ]);

  const statsMap = new Map<string, number>(
    stats.map((s) => [s.jobId, s.applicationCount])
  );

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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Applications
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => {
                const appCount = statsMap.get(job.id) || 0;

                return (
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

                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {job.employmentType}
                    </td>

                    {/* REAL STATUS LOGIC (no fake type needed) */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          job.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {appCount}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}