//bridge between application and backend API
import { JobListing, ApplicationRequest, ApplicationResponse, CreateJobFormData, CreateJobResponse, CreateJobRequest } from "@/types";

// Centralized config
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is missing");
}

// Private helper for common logic
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.title || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Clean, readable exports
export async function fetchJobs(): Promise<JobListing[]> {
  const result = await apiRequest<{ data: any[] }>('/api/v1/jobs');
  
  return (result.data ?? []).map((job) => ({
    id: job.id,
    title: job.title,
    company: job.companyName,
    location: job.location,
    description: job.description ??"",
    employmentType: job.type,
    salaryMin: job.salaryMin ?? null,
    salaryMax: job.salaryMax ?? null,
    postedAt: job.postedAt,
    isActive: job.isActive,
    applicantCount: job.applicationCount ?? 0,
    isAvailable: true,
  }));
}

export async function submitApplication(data: ApplicationRequest): Promise<ApplicationResponse> {
  return apiRequest<ApplicationResponse>('/api/v1/applications/apply', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function createJob(data: CreateJobFormData): Promise<CreateJobResponse> {
  const requestBody: CreateJobRequest = {
    title: data.title,
    companyId: data.companyId,
    location: data.location,
    type: data.employmentType,
    salaryMin: data.salaryMin,
    salaryMax: data.salaryMax,
    description: data.description,
    expiresAt: data.expiresAt, 
  };

  console.log(' Creating job with:', requestBody);

  const result = await apiRequest<{ data: CreateJobResponse }>('/api/v1/jobs', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  return result.data;
}