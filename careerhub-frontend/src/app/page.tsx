"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import { JobListing } from "../types";
import { cn } from "@/lib/utils";

// Mock DATA
const jobs: JobListing[] = [
  {
    id: "1",
    title: "Frontend Engineer",
    company: "Tech Solutions",
    location: "Cape Town",
    employmentType: "Full-Time",
    salaryMin: 50000,
    salaryMax: 70000,
    postedAt: "2026-06-15T08:00:00Z",
    isActive: true,
    applicantCount: 5,
    isAvailable: true,
  },
  {
    id: "2",
    title: "Junior Designer",
    company: "Creative Agency",
    location: "Johannesburg",
    employmentType: "Internship",
    salaryMin: 12000,
    salaryMax: 18000,
    postedAt: "2026-06-16T14:30:00Z",
    isActive: false,
    applicantCount: 0,
    isAvailable: true,
  },
  {
    id: "3",
    title: "Junior Software Engineer",
    company: "BitCube",
    location: "Bloemfontein",
    employmentType: "Internship",
    salaryMin: 12000,
    salaryMax: 18000,
    postedAt: "2026-06-16T14:30:00Z",
    isActive: true,
    applicantCount: 0,
    isAvailable: true,
  },
  {
    id: "4",
    title: "Junior Technical Support",
    company: "University of the Free State",
    location: "Bloemfontein",
    employmentType: "Internship",
    salaryMin: 12000,
    salaryMax: 18000,
    postedAt: "2026-06-16T14:30:00Z",
    isActive: false,
    applicantCount: 0,
    isAvailable: true,
  },
  {
    id: "5",
    title: "Front End Developer",
    company: "Absa Bank",
    location: "CapeTown",
    employmentType: "Full-Time",
    salaryMin: 12000,
    salaryMax: 18000,
    postedAt: "2026-06-16T14:30:00Z",
    isActive: false,
    applicantCount: 0,
    isAvailable: true,
  },
  {
    id: "6",
    title: "Senior Software Engineer",
    company: "Standard Bank",
    location: "Johannesburg",
    employmentType: "Contract",
    salaryMin: 12000,
    salaryMax: 18000,
    postedAt: "2026-05-16T14:30:00Z",
    isActive: true,
    applicantCount: 0,
    isAvailable: true,
  },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Restore selection from sessionStorage on mount
  useEffect(() => {
    const savedId = sessionStorage.getItem('selectedJobId');
    if (savedId) {
      // Only restore if job still exists in the list
      const jobExists = jobs.some(job => job.id === savedId);
      if (jobExists) {
        setSelectedId(savedId);
      }
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

  const selectedJob = jobs.find((j) => j.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <main className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Job Openings
        </h1>

        {selectedJob && (
          <div className={cn(
            "border rounded-lg p-6 shadow-sm",
            "bg-white dark:bg-gray-800",
            "border-blue-200 dark:border-gray-700"
          )}>
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300">
              Selected Opportunity
            </h2>
            <p className="text-blue-700 dark:text-blue-200">
              {selectedJob.title} at {selectedJob.company}
            </p>
          </div>
        )}

        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSelected={selectedId === job.id}
            onSelect={() => setSelectedId(selectedId === job.id ? null : job.id)}
          />
        ))}
      </main>
    </div>
  );
}