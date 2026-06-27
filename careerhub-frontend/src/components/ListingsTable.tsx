import Link from "next/link";
import CloseJobButton from "@/components/CloseJobFunction";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { JobListing } from "@/types";

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

interface ListingsTableProps {
  jobs: JobListing[];
  view: "table" | "grid";
  showClosedJobs: boolean;
}

// Now: data is passed in as props
// The parent (ListingsTableWrapper) reads from Zustand and passes view/showClosedJobs down
export default function ListingsTable({ jobs, view, showClosedJobs }: ListingsTableProps) {
  const filtered = showClosedJobs ? jobs : jobs.filter((j) => j.isActive);

  if (filtered.length === 0) {
    return (
      <p className="text-gray-500 mt-6 text-sm">No job listings found.</p>
    );
  }

  if (view === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {job.company} • {job.location}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <JobStatusBadge employmentType={job.employmentType} isActive={job.isActive} />
              <span className="text-xs text-gray-400">
                {job.applicantCount ?? 0} applicants
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={`/jobs/${job.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View
              </Link>
              <CloseJobButton jobId={job.id} isActive={job.isActive} />
            </div>
          </div>
        ))}
      </div>
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
        {filtered.map((job) => (
          <tr key={job.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-100">
              {job.title}
            </td>
            <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
              {job.company}
            </td>
            <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
              {job.location}
            </td>
            <td className="py-3 pr-4">
              <JobStatusBadge employmentType={job.employmentType} isActive={job.isActive} />
            </td>
            <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
              {job.applicantCount ?? 0}
            </td>
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