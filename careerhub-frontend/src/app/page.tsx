'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/lib/api";
import JobCard from "@/components/JobCard";
import { cn } from "@/lib/utils";
import { JobListSkeleton } from "@/components/JobCardSkeleton";
import { ApplicationForm } from "@/components/ApplicationForm";
import { CreateJobForm } from "@/components/CreateJobForm"; // Add this import

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // Add this state

  const {
    data: jobs,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    staleTime: 0,
  });

  const jobList = jobs ?? [];

  // Restore selection from sessionStorage on mount
  useEffect(() => {
    const savedId = sessionStorage.getItem("selectedJobId");
    if (savedId) {
      setSelectedId(savedId);
    }
  }, []);

  // Persist selection changes
  useEffect(() => {
    if (selectedId !== null) {
      sessionStorage.setItem("selectedJobId", selectedId);
    } else {
      sessionStorage.removeItem("selectedJobId");
    }
  }, [selectedId]);

  // Error state
  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">
          Error loading jobs: {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try again
        </button>
      </div>
    );
  }

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
        <main className="mx-auto max-w-6xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Job Openings
          </h1>
          <JobListSkeleton />
        </main>
      </div>
    );
  }

  const selectedJob = jobList.find((j) => j.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <main className="mx-auto max-w-6xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Openings
          </h1>
          {/* Add Job Button - Only this is new */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg font-bold">+</span> Add Job
          </button>
        </div>

        {selectedJob && (
          <div
            className={cn(
              "border rounded-lg p-6 shadow-sm bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700"
            )}
          >
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300">
              Selected Opportunity
            </h2>
            <p className="text-blue-700 dark:text-blue-200">
              {selectedJob.title} at {selectedJob.company}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobList.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedId === job.id}
              onSelect={() =>
                setSelectedId(selectedId === job.id ? null : job.id)
              }
            />
          ))}
        </div>

        {/* Application Form - Only show when a job is selected */}
        {selectedJob && (
          <div className="mt-8">
            <ApplicationForm 
              jobId={selectedJob.id} 
              jobTitle={selectedJob.title}
              applicantId="a1111111-1111-1111-1111-111111111111" // replace with real auth
            />
          </div>
        )}

        {/* Create Job Modal - This is new */}
        {showCreateForm && (
          <CreateJobForm onClose={() => setShowCreateForm(false)} />
        )}
      </main>
    </div>
  );
}