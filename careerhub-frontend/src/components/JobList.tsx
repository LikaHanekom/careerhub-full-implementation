import { JobListing } from "../types";
import JobCard from "./JobCard";
import { cn } from "@/lib/utils";

interface JobListProps {
  jobs: JobListing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function JobList({ jobs, selectedId, onSelect }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className={cn(
        "text-center py-20 border-2 border-dashed rounded-lg",
        "bg-zinc-50 dark:bg-gray-800/50",
        "border-zinc-200 dark:border-gray-700"
      )}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          No career opportunities found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          We're currently scouting for new talent. 
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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