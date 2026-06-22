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