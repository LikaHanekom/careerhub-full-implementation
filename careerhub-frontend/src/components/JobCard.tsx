import { formatDistanceToNow, parseISO } from "date-fns";
import { JobListing } from "../types";
import { JobStatusBadge } from "./JobStatusBadge";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: JobListing;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const salaryFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export default function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  return (
    <div
      onClick={() => onSelect(job.id)}
      className={cn(
        "group cursor-pointer rounded-xl border p-5 transition-all duration-200",
        "bg-white dark:bg-gray-900",
        "hover:shadow-md hover:-translate-y-[1px]",
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/20"
          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
        !job.isActive && "opacity-60 grayscale"
      )}
    >
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
          {job.title}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {job.company} • {job.location}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <JobStatusBadge
          employmentType={job.employmentType}
          isActive={job.isActive}
        />
      </div>

      {/* Salary */}
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-4">
        {salaryFormatter.format(job.salaryMin)} –{" "}
        {salaryFormatter.format(job.salaryMax)} / month
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>
          {formatDistanceToNow(parseISO(job.postedAt), {
            addSuffix: true,
          })}
        </span>

        {job.applicantCount > 0 && (
          <span>{job.applicantCount} applicants</span>
        )}
      </div>
    </div>
  );
}