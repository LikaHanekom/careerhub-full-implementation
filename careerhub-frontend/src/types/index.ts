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


export interface CreateJobRequest {
  title: string;
  companyId: string;  // Changed from companyName to companyId
  location: string;
  type: 'FullTime' | 'PartTime' | 'Contract' | 'Casual';  // No hyphens!
  salaryMin: number | null;
  salaryMax: number | null;
  description: string;
  expiresAt: string;  // ISO date string
  // Note: No isActive field - backend doesn't have it
}


// Create Job Response
export interface CreateJobResponse {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Casual';
  salaryMin: number | null;
  salaryMax: number | null;
  postedAt: string;
  isActive: boolean;
  applicationCount: number;
  isAvailable: boolean;
}


// Form data type (matches your UI form)
export interface CreateJobFormData {
  title: string;
  companyId: string;  // Changed from company to companyId
  location: string;
  employmentType: 'FullTime' | 'PartTime' | 'Contract' | 'Casual';  // No hyphens
  salaryMin: number;
  salaryMax: number;
  description: string;
  expiresAt: string;  // Add expiration dat
}