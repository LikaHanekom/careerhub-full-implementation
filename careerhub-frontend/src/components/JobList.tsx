import { JobListing } from "../types";
import JobCard from "./JobCard";

interface JobListProps {
  jobs: JobListing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function JobList({
  jobs,
  selectedId,
  onSelect,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="text-4xl mb-4">🔍</div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          No opportunities found
        </h3>

        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
          We’re updating listings. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Available Positions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Explore roles tailored for you
          </p>
        </div>

        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {jobs.length} {jobs.length === 1 ? "role" : "roles"}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSelected={selectedId === job.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}