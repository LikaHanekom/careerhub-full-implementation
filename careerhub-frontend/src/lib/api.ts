//bridge between application and backend API
import { JobListing, ApplicationRequest, ApplicationResponse, CreateJobFormData, CreateJobResponse, CreateJobRequest, BackendJobResponse ,EmploymentType  } from "@/types";

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
    console.error(`API ${response.status} on ${endpoint}:`, JSON.stringify(errorData, null, 2));
    throw new Error(errorData.detail || errorData.title || errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

  // Clean, readable exports
  type FetchOptions = RequestInit & {
    next?: {
      tags?: string[];
      revalidate?: number;
    };
  };

  interface PagedJobsResponse {
    data: BackendJobResponse[];
    page: number;
    pageSize: number;
    totalCount: number;
  }

  export async function fetchJobs(
    options?: FetchOptions
  ): Promise<JobListing[]> {
    const result = await apiRequest<PagedJobsResponse>(
      '/api/v1/jobs?page=1&pageSize=100',
      options
    );

    return (result.data ?? []).map(mapJobResponse);
  }

  export async function fetchEmployerJobs(
    options?: FetchOptions
  ): Promise<JobListing[]> {
    const result = await apiRequest<PagedJobsResponse>(
      '/api/v1/jobs?page=1&pageSize=100&includeInactive=true',
      options
    );

    return (result.data ?? []).map(mapJobResponse);
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


export async function fetchJobById(
  id: string,
  options?: RequestInit
): Promise<JobListing> {
  const job = await apiRequest<BackendJobResponse>(`/api/v1/jobs/${id}`, options);
  return mapJobResponse(job);
}


function mapJobResponse(job: BackendJobResponse): JobListing {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description ?? "",

    employmentType: job.type as EmploymentType,

    salaryMin: job.salaryMin ?? null,
    salaryMax: job.salaryMax ?? null,

    postedAt: job.postedAt,
    isActive: job.isActive,

    applicantCount: job.applicationCount ?? 0,
    isAvailable: job.isActive,
  };
}

export async function createJob(
  data: CreateJobFormData
): Promise<CreateJobResponse> {
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

  console.log('Creating job with:', requestBody);

  return apiRequest<CreateJobResponse>(
    '/api/v1/jobs',
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    }
  );
}

export type JobFilters = {
  q?: string;
  location?: string;
  status?: string;
};

export async function getJobs(filters?: JobFilters): Promise<JobListing[]> {
  const jobs = await fetchJobs({ next: { tags: ["jobs"] } });

  let results = jobs;

  if (filters?.q) {
    const q = filters.q.toLowerCase();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q)
    );
  }

  if (filters?.location) {
    const loc = filters.location.toLowerCase();
    results = results.filter((j) =>
      j.location.toLowerCase().includes(loc)
    );
  }

  if (filters?.status === "open") {
    results = results.filter((j) => j.isActive);
  }

  return results;
}