import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EmploymentType } from "../types";

interface JobStatusBadgeProps {
  employmentType: EmploymentType;
  isActive: boolean;
}

const employmentTypeColors: Record<EmploymentType, string> = {
  "Full-Time": "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
  "Part-Time": "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  "Contract": "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400",
  "Internship": "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400",
  "Freelance": "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export function JobStatusBadge({ employmentType, isActive }: JobStatusBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge 
        variant="outline"
        className={cn(
          "shrink-0",
          employmentTypeColors[employmentType]
        )}
      >
        {employmentType}
      </Badge>
      
  
      {!isActive && (
        <Badge 
          variant="outline"
          className="shrink-0 border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
        >
          Expired
        </Badge>
      )}
    </div>
  );
}