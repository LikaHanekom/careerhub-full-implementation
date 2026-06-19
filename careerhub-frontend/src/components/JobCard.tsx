import { formatDistanceToNow, parseISO } from 'date-fns';
import { JobListing } from "../types";
import { JobStatusBadge } from "./JobStatusBadge";
import { cn } from "@/lib/utils";

interface JobCardProps {
    job: JobListing;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const salaryFormatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
});

export default function JobCard({ job, isSelected, onSelect }: JobCardProps) {
    return (
        <div
            onClick={() => onSelect(job.id)}
            className={cn(
                "border-2 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200", // Increased border-2
                "bg-white dark:bg-gray-800",
                isSelected 
                ? "border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20" // Use a subtle ring
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                !job.isActive && "opacity-60 grayscale-[0.2]"
            )}
        >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {job.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-2">
                {job.company} · {job.location}
            </p>

            <div className="flex flex-wrap gap-2 items-center mb-2">
                <JobStatusBadge 
                    employmentType={job.employmentType} 
                    isActive={job.isActive} 
                />
            </div>

            <p className="font-semibold mt-2 text-gray-800 dark:text-gray-200">
                {salaryFormatter.format(job.salaryMin)} – {salaryFormatter.format(job.salaryMax)} pm
            </p>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatDistanceToNow(parseISO(job.postedAt), { addSuffix: true })}</span>
                {job.applicantCount > 0 && <span>{job.applicantCount} applicants</span>}
            </div>
        </div>
    )
}