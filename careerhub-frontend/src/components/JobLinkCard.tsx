import Link from "next/link";
import { JobListing } from "@/types";
import { JobStatusBadge } from "@/components/JobStatusBadge";

export default function JobLinkCard({ job }: { job: JobListing }) {
  return (
    <Link
      href={`/jobs/${job.id}`} 
      className="block rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {job.company}
          </p>
        </div>
        <JobStatusBadge 
          isActive={job.isActive} 
          employmentType={job.employmentType} 
        />
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {job.location}
      </p>
    </Link>
  );
}