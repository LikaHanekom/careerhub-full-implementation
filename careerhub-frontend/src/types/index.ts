export type EmploymentType =
  | "FullTime"
  | "PartTime"
  | "Contract"
  | "Internship";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: EmploymentType; // mapped from backend
  salaryMin: number | null;
  salaryMax: number | null;
  postedAt: string;
  isActive: boolean;
  applicantCount: number;
  isAvailable: boolean;
}

// types/index.ts
export interface ApplicationRequest {
  jobListingId: string;   
  applicantId: string;   
  fullName: string;
  email: string;
  phone?: string;
  yearsOfExperience: number;
  coverLetter: string;
  linkedInUrl?: string;
  availableImmediately: boolean;
  noticePeriodWeeks: number;
}

export interface ApplicationResponse {
  id: string;
  jobId: string;
  email: string;
  submittedAt: string;
}