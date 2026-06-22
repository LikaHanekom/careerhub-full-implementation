//bridge between application and backend API
import { JobListing } from "@/types";

export async function fetchJobs(): Promise<JobListing[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
  }

  const url = `${baseUrl}/api/v1/jobs`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    return (result.data ?? []).map((job: any): JobListing => ({
      id: job.id,
      title: job.title,
      company: job.companyName,          
      location: job.location,

      employmentType: job.type,         

      salaryMin: job.salaryMin ?? null,
      salaryMax: job.salaryMax ?? null,

      postedAt: job.postedAt,
      isActive: job.isActive,

      applicantCount: job.applicationCount ?? 0,
      isAvailable: true,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }
    throw error;
  }
}