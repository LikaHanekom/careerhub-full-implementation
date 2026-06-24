import Link from "next/link";
import { getInternalApiBaseUrl } from "@/lib/internal-api";
import { JobListing } from "@/types";
interface ApplicationStat {
  jobId: string;
  applicationCount: number;
}
async function getJobs(): Promise<JobListing[]> {
  const res = await fetch(`${getInternalApiBaseUrl()}/api/jobs`, {
    next: { tags: ["jobs"] },
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}
async function getApplicationStats(): Promise<ApplicationStat[]> {
  const res = await fetch(
    `${getInternalApiBaseUrl()}/api/applications/stats`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}
export function ListingsTableSkeleton() {
  return (
    <div className="animate-pulse space-y-3 mt-2">
      <div className="h-8 bg-gray-100 rounded w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded w-full" />
      ))}
    </div>
  );
}
export default async function ListingsTable() {
  const [jobs, stats] = await Promise.all([getJobs(), getApplicationStats()]);
  const statsByJobId = Object.fromEntries(
    stats.map((s) => [s.jobId, s.applicationCount])
  );
  if (jobs.length === 0) {
    return (
      <p className="text-gray-500 mt-6 text-sm">No job listings found.</p>
    );
  }
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b text-left text-gray-500">
          <th className="pb-3 pr-4 font-medium">Title</th>
          <th className="pb-3 pr-4 font-medium">Company</th>
          <th className="pb-3 pr-4 font-medium">Location</th>
          <th className="pb-3 pr-4 font-medium">Status</th>
          <th className="pb-3 pr-4 font-medium">Applications</th>
          <th className="pb-3 pr-4 font-medium">View</th>
          <th className="pb-3 font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id} className="border-b hover:bg-gray-50">
            <td className="py-3 pr-4 font-medium">{job.title}</td>
            <td className="py-3 pr-4 text-gray-600">{job.company}</td>
            <td className="py-3 pr-4 text-gray-600">{job.location}</td>
            <td className="py-3 pr-4">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  job.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {job.isActive ? "Active" : "Closed"}
              </span>
            </td>
            <td className="py-3 pr-4">{statsByJobId[job.id] ?? 0}</td>
            <td className="py-3 pr-4">
              <Link
                href={`/jobs/${job.id}`}
                className="text-blue-600 hover:underline"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}