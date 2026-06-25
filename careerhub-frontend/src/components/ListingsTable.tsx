import Link from "next/link";
import CloseJobButton from "@/components/CloseJobFunction";
import { fetchEmployerJobs } from "@/lib/api";
import { JobListing } from "@/types";

export const dynamic = "force-dynamic";

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

async function getJobs(): Promise<JobListing[]> { //stream triggered here
  return fetchEmployerJobs({ next: { tags: ["jobs"] } });
}

export default async function ListingsTable() {
  const jobs = await getJobs(); //promise is made

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

            <td className="py-3 pr-4">{job.applicantCount}</td>

            <td className="py-3 pr-4">
              <Link
                href={`/jobs/${job.id}`}
                className="text-blue-600 hover:underline"
              >
                View
              </Link>
            </td>

            <td className="py-3">
              <CloseJobButton jobId={job.id} isActive={job.isActive} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
