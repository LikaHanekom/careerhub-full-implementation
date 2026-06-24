import Link from "next/link";
import { getInternalApiBaseUrl } from "@/lib/internal-api";
import { JobListing } from "@/types";
export const dynamic = "force-dynamic";
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
  // Graceful fallback — stats failure should never break the listings table
  if (!res.ok) return [];
  return res.json();
}
export default async function ListingsPage() {
  const [jobs, stats] = await Promise.all([getJobs(), getApplicationStats()]);
  const statsByJobId = Object.fromEntries(
    stats.map((s) => [s.jobId, s.applicationCount])
  );
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Job Listings</h1>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-3 pr-4 font-medium">Title</th>
            <th className="pb-3 pr-4 font-medium">Company</th>
            <th className="pb-3 pr-4 font-medium">Location</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Applications</th>
            <th className="pb-3 font-medium">View</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b hover:bg-gray-50">
              <td className="py-3 pr-4">{job.title}</td>
              <td className="py-3 pr-4">{job.company}</td>
              <td className="py-3 pr-4">{job.location}</td>
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
              <td className="py-3">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}