"use client";

import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/lib/api'; 
import JobCard from "@/components/JobCard";
import { cn } from "@/lib/utils";
import { JobListSkeleton } from "@/components/JobCardSkeleton"; // Import skeleton


export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  //Use useQuery instead of hardcoded jobs array

  const {
    data:jobs,
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['jobs'], // Unique key to cache the results
    queryFn: fetchJobs, //fetch data
    staleTime: 0,
  })

  const isLoading = true;
  // Restore selection from sessionStorage on mount
  useEffect(() => {
    const savedId = sessionStorage.getItem('selectedJobId');
    if (savedId) {
      // Only restore if job still exists in the list
        setSelectedId(savedId);
    }
  }, []); 

  // Persist selection changes to sessionStorage
  useEffect(() => {
    if (selectedId !== null) {
      sessionStorage.setItem('selectedJobId', selectedId);
    } else {
      sessionStorage.removeItem('selectedJobId');
    }
  }, [selectedId]);

  //Handling Error
  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Error loading jobs: {error.message}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try again
        </button>
      </div>
    );
  }

  //Handle Loading State

 if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
        <main className="mx-auto max-w-6xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Job Openings</h1>
          <JobListSkeleton />
        </main>
      </div>
    );
  }
  const selectedJob = jobs.find((j) => j.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <main className="mx-auto max-w-6xl w-full space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Job Openings
        </h1>

        {selectedJob && (
          <div className={cn(
            "border rounded-lg p-6 shadow-sm bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700"
          )}>
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300">
              Selected Opportunity
            </h2>
            <p className="text-blue-700 dark:text-blue-200">
              {selectedJob.title} at {selectedJob.company}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedId === job.id}
              onSelect={() => setSelectedId(selectedId === job.id ? null : job.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}